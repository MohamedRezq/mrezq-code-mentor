import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-background/50 backdrop-blur-sm">
      <div className="container py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <GraduationCap className="h-7 w-7 text-violet-500" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-cyan-400" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">Devling</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              The AI-powered platform that makes learning to code feel like having a brilliant friend explain everything.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 md:gap-16">
            <div>
              <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Product</h4>
              <ul className="space-y-3">
                {["Learn", "Playground", "Pricing"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-foreground/80 hover:text-violet-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Company</h4>
              <ul className="space-y-3">
                {["About", "Blog", "Careers"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-foreground/80 hover:text-violet-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Legal</h4>
              <ul className="space-y-3">
                {["Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-foreground/80 hover:text-violet-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Devling. All rights reserved.</p>
          <p>Built with AI, for humans who want to code.</p>
        </div>
      </div>
    </footer>
  );
}
