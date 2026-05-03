import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [progressResult, completionsResult] = await Promise.all([
      supabase.from("user_progress").select("*").eq("user_id", user.id),
      supabase.from("lesson_completions").select("*").eq("user_id", user.id),
    ]);

    return NextResponse.json({
      progress: progressResult.data ?? [],
      completions: completionsResult.data ?? [],
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, timeSpentSeconds } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "Missing lessonId" },
        { status: 400 }
      );
    }

    // Record lesson completion
    const { error: completionError } = await supabase
      .from("lesson_completions")
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
          time_spent_seconds: timeSpentSeconds,
        },
        {
          onConflict: "user_id,lesson_id",
        }
      );

    if (completionError) {
      throw completionError;
    }

    // Get the lesson to find its concept and add XP
    const { data: lesson } = await supabase
      .from("lessons")
      .select("concept_id, difficulty")
      .eq("id", lessonId)
      .single();

    if (lesson) {
      // Get the concept to find the topic/language
      const { data: concept } = await supabase
        .from("concepts")
        .select("topic_id")
        .eq("id", lesson.concept_id)
        .single();

      if (concept) {
        const { data: topic } = await supabase
          .from("topics")
          .select("language_id")
          .eq("id", concept.topic_id)
          .single();

        if (topic) {
          // Update or create user progress
          const xpGained = lesson.difficulty * 10;

          const { data: existingProgress } = await supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("language_id", topic.language_id)
            .single();

          if (existingProgress) {
            await supabase
              .from("user_progress")
              .update({
                xp: existingProgress.xp + xpGained,
                last_activity_at: new Date().toISOString(),
              })
              .eq("id", existingProgress.id);
          } else {
            await supabase.from("user_progress").insert({
              user_id: user.id,
              language_id: topic.language_id,
              xp: xpGained,
              last_activity_at: new Date().toISOString(),
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording progress:", error);
    return NextResponse.json(
      { error: "Failed to record progress" },
      { status: 500 }
    );
  }
}
