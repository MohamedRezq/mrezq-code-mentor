import type { Lesson } from '@/types/lesson'

export const webCoreLessons: Lesson[] = [
  {
    id: 'fe-html-semantic',
    moduleId: 'frontend',
    phaseId: 'fe-web',
    phaseNumber: 1,
    order: 1,
    title: 'Semantic HTML Foundations',
    description: 'Build strong page structure with semantic tags, forms, and accessibility-first markup.',
    duration: '35 min',
    difficulty: 'beginner',
    objectives: [
      'Use semantic elements for structure and meaning',
      'Build accessible forms with labels and validation hints',
      'Understand document flow, landmarks, and heading hierarchy',
      'Avoid div-only anti-patterns that hurt SEO and accessibility',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why Semantic HTML Still Matters

Semantic HTML is the foundation under every framework (React, Next.js, Vue). If your markup is weak, your app becomes harder to navigate, harder to test, and less accessible.

Use semantic elements to describe intent:
- \`header\`, \`main\`, \`section\`, \`article\`, \`nav\`, \`footer\`
- \`button\` for actions, \`a\` for navigation
- \`form\` + \`label\` + \`input\` for user input`,
      },
      {
        type: 'code',
        language: 'html',
        filename: 'semantic-page.html',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SeniorPath - Web Core</title>
  </head>
  <body>
    <header>
      <h1>SeniorPath Frontend Track</h1>
      <nav aria-label="Primary">
        <ul>
          <li><a href="#lessons">Lessons</a></li>
          <li><a href="#resources">Resources</a></li>
        </ul>
      </nav>
    </header>

    <main id="lessons">
      <section aria-labelledby="lesson-title">
        <h2 id="lesson-title">Semantic HTML</h2>
        <p>Structure content with meaningful elements.</p>
      </section>

      <article>
        <h3>Exercise</h3>
        <p>Refactor a div-only layout into semantic landmarks.</p>
      </article>
    </main>

    <footer>
      <small>Copyright 2026 SeniorPath</small>
    </footer>
  </body>
</html>`,
        explanation:
          'Landmark elements improve screen-reader navigation and make document structure obvious for both humans and tooling.',
      },
      {
        type: 'exercise',
        title: 'Refactor Div Soup',
        description:
          'Given a page built only with `<div>` tags, refactor it to semantic HTML with proper landmarks, heading hierarchy, and accessible nav labels.',
        language: 'html',
        starterCode: `<div class="header">...</div>
<div class="menu">...</div>
<div class="content">...</div>
<div class="card">Lesson details</div>
<div class="footer">...</div>`,
        solution: `<header>...</header>
<nav aria-label="Primary">...</nav>
<main>
  <section>
    <h2>Lesson details</h2>
    <article>...</article>
  </section>
</main>
<footer>...</footer>`,
        hints: [
          'Use only one top-level `<h1>` per page',
          'Group related content into `<section>` or `<article>`',
          'Add `aria-label` for navigation landmarks when needed',
        ],
      },
    ],
  },
  {
    id: 'fe-css-layout',
    moduleId: 'frontend',
    phaseId: 'fe-web',
    phaseNumber: 1,
    order: 2,
    title: 'CSS Layout: Flexbox, Grid, and Spacing Systems',
    description: 'Master modern layout primitives and build consistent UI spacing without hacks.',
    duration: '40 min',
    difficulty: 'beginner',
    objectives: [
      'Choose between Flexbox and Grid correctly',
      'Build reusable spacing and typography tokens',
      'Create predictable responsive sections',
      'Avoid common layout anti-patterns',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Flexbox vs Grid

- **Flexbox**: one-dimensional layout (row or column)
- **Grid**: two-dimensional layout (rows and columns)

Use Flexbox for nav bars, button groups, and stacks.
Use Grid for dashboards, card galleries, and page-level sections.`,
      },
      {
        type: 'code',
        language: 'css',
        filename: 'layout.css',
        code: `:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
}

.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-6);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: var(--space-4);
}`,
        explanation:
          'A tokenized spacing scale keeps UI rhythm consistent as the project grows and multiple developers contribute.',
      },
      {
        type: 'exercise',
        title: 'Build a Lesson Dashboard Layout',
        description:
          'Create a layout with a top navigation bar, a 2-column hero section on desktop (1-column on mobile), and a responsive 3-card lesson grid using CSS Grid and Flexbox.',
        language: 'css',
        starterCode: `.topbar { }
.hero { }
.lesson-grid { }
@media (max-width: 768px) { }`,
        solution: `.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.lesson-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; }
  .lesson-grid { grid-template-columns: 1fr; }
}`,
        hints: [
          'Use `minmax(0, 1fr)` to prevent overflow issues',
          'Prefer `gap` over margin hacks for spacing',
          'Make mobile the fallback and scale up with media queries',
        ],
      },
    ],
  },
  {
    id: 'fe-js-dom',
    moduleId: 'frontend',
    phaseId: 'fe-web',
    phaseNumber: 1,
    order: 3,
    title: 'JavaScript DOM & Events',
    description: 'Manipulate the DOM safely, handle events, and build interactive behavior without framework magic.',
    duration: '45 min',
    difficulty: 'beginner',
    objectives: [
      'Select and update DOM nodes safely',
      'Handle user events with clear state transitions',
      'Use event delegation for scalable interactions',
      'Prevent common bugs from stale selectors and duplicated listeners',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'dom-basics.js',
        code: `const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");

if (!form || !input || !list) {
  throw new Error("Required DOM elements not found");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  const li = document.createElement("li");
  li.innerHTML = \`
    <span>\${value}</span>
    <button type="button" data-action="remove">Remove</button>
  \`;
  list.appendChild(li);
  input.value = "";
});

// Event delegation: one listener for all remove buttons
list.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.dataset.action !== "remove") return;
  const item = target.closest("li");
  if (item) item.remove();
});`,
        explanation:
          'Event delegation reduces listener count and keeps dynamic lists maintainable.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Avoid `innerHTML` for Untrusted Content',
        content:
          'If user input can contain HTML, `innerHTML` creates XSS risk. Prefer `textContent` when inserting untrusted strings.',
      },
      {
        type: 'exercise',
        title: 'Interactive FAQ Accordion',
        description:
          'Build an FAQ accordion where clicking a question toggles the answer, closes other open answers, and updates `aria-expanded` for accessibility.',
        language: 'javascript',
        starterCode: `const faq = document.querySelector("#faq");
// TODO: add delegated click handling
// TODO: toggle open class
// TODO: keep only one panel open
// TODO: update aria-expanded`,
        solution: `const faq = document.querySelector("#faq");
if (!faq) throw new Error("FAQ missing");

faq.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("[data-faq-button]");
  if (!button) return;

  const items = faq.querySelectorAll("[data-faq-item]");
  items.forEach((item) => {
    const itemBtn = item.querySelector("[data-faq-button]");
    if (item === button.closest("[data-faq-item]")) return;
    item.classList.remove("open");
    if (itemBtn) itemBtn.setAttribute("aria-expanded", "false");
  });

  const item = button.closest("[data-faq-item]");
  if (!item) return;
  const isOpen = item.classList.toggle("open");
  button.setAttribute("aria-expanded", isOpen ? "true" : "false");
});`,
        hints: [
          'Use `closest()` to find related elements',
          'Handle null checks for robust scripts',
          'Update ARIA attributes as state changes',
        ],
      },
    ],
  },
  {
    id: 'fe-responsive-accessibility',
    moduleId: 'frontend',
    phaseId: 'fe-web',
    phaseNumber: 1,
    order: 4,
    title: 'Responsive Design & Accessibility',
    description: 'Ship interfaces that work across devices and are usable by keyboard and assistive technology users.',
    duration: '45 min',
    difficulty: 'intermediate',
    objectives: [
      'Apply mobile-first responsive strategies',
      'Use accessible color contrast and focus states',
      'Support keyboard-only navigation',
      'Build a practical accessibility audit checklist',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Accessibility Is a Core Engineering Requirement

A11y is not polish. It is correctness.

Minimum baseline for every feature:
- visible focus states
- keyboard navigable controls
- semantic labels for form fields
- sufficient color contrast
- logical heading and landmark structure`,
      },
      {
        type: 'code',
        language: 'css',
        filename: 'a11y.css',
        code: `:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  left: -9999px;
}

.skip-link:focus {
  left: 1rem;
  top: 1rem;
  background: #111827;
  color: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}`,
        explanation:
          'Visible focus and reduced-motion handling are low-effort, high-impact accessibility improvements.',
      },
      {
        type: 'exercise',
        title: 'Accessibility Pass on a Landing Page',
        description:
          'Given an existing landing page, apply an accessibility pass: add skip link, improve heading hierarchy, ensure all form inputs have labels, add keyboard support for menu toggle, and fix two low-contrast color pairs.',
        language: 'html',
        starterCode: `<!-- TODO: add skip link -->
<!-- TODO: fix heading order -->
<!-- TODO: add labels and ids to inputs -->
<!-- TODO: ensure menu button has aria-expanded -->
<!-- TODO: improve color contrast -->`,
        solution: `<!-- Example key fixes -->
<a href="#main" class="skip-link">Skip to content</a>
<header><h1>Product</h1></header>
<main id="main"><h2>Features</h2></main>

<label for="email">Email</label>
<input id="email" type="email" />

<button aria-expanded="false" aria-controls="mobile-menu">Menu</button>`,
        hints: [
          'Use browser devtools accessibility tree to verify semantics',
          'Test full flow with keyboard only (Tab/Shift+Tab/Enter/Escape)',
          'Run Lighthouse accessibility checks after manual review',
        ],
      },
    ],
  },
]
