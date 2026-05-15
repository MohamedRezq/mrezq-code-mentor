# Session Status (Curriculum Build)

Last updated: 2026-05-15

## Deployed
- **https://seniorpath.vercel.app**

## All modules (00–09) — live

| # | Module | Lessons | Status |
|---|--------|---------|--------|
| 00 | CS Fundamentals | 16 | ✅ 3 phases |
| 01 | Frontend | 16 | ✅ reviewer pass |
| 02 | Backend | 17 | ✅ incl. architecture |
| 03 | Databases | 16 | ✅ 4 phases (SQL → vector) |
| 04 | System Design | 16 | ✅ 4 phases |
| 05 | DevOps | 16 | ✅ 4 phases |
| 06 | AI Engineering | 27 | ✅ full reviewer |
| 07 | Security | 16 | ✅ 4 phases |
| 08 | Leadership | 16 | ✅ 4 phases |
| 09 | Python Full-Stack | 50 | ✅ + cheat sheet |

**~186 lessons** wired in `src/data/lessons/index.ts`.

## Patterns per module
- Lesson bodies + exercises
- `reviewer-enhancements.ts` + `mergeReviewerEnhancements`
- `withEstimatedDuration` in each module index
- `modules.ts` phase `lessonIds` + `comingSoon: false`

## Auth
- `AuthProvider` — session persists on refresh in learn header

## Optional next
- Deepen thin lesson bodies (leadership/security are concise)
- Cheat sheets for more modules
- Commit + push when ready
