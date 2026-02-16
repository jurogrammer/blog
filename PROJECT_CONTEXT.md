# System Overview
- One-line summary: Hugo-based technical blog served as a static site on GitHub Pages.
- System purpose: Publish long-form posts and lightweight client-side tools under a single domain.
- Target users: Readers of software engineering content and visitors using utility pages.
- Current system stage/version: Active production blog, custom tooling expansion phase (2026-02-16).

# Global Architecture
- High-level architecture (text diagram): Authoring (`content/**`) -> Hugo render (`layouts/**` + theme) -> Static output (`public/`) -> GitHub Pages CDN.
- Communication patterns: Static HTTP delivery only; browser-side JavaScript for interactive pages.
- Cross-module dependencies: Site pages depend on Hugo templates/theme; tool pages depend on section-specific layouts and static JS/CSS bundles; deployment depends on GitHub Actions workflow.
- Shared libraries: Hugo, PaperMod theme, browser Web APIs.

# Modules Registry
- blog-site: Main Hugo site module containing content, templates, static assets, and client-side scripts.

# Global Conventions
- Coding standards: Keep templates and scripts simple, deterministic, and readable; prefer vanilla JS/CSS for utility pages.
- Error handling standard: Validate user input in UI and show inline, user-readable messages without breaking render.
- Logging / tracing strategy: No centralized backend logging; console logging only for local debugging.
- Security policy: Client-side only features, no credential handling, sanitize rendered user-provided text via text nodes.
- Naming conventions: Kebab-case for paths/files, clear semantic IDs/classes for DOM hooks.

# Infrastructure
- Deployment topology: GitHub repository -> GitHub Actions build -> GitHub Pages hosting.
- CI/CD strategy: Build and deploy on `main` push via `.github/workflows/hugo.yaml`.
- Environments: Local dev and production GitHub Pages.
- Monitoring stack: GitHub Actions status + manual page verification.

# Data Strategy
- Database separation strategy: No server database; browser `localStorage` for per-device preferences/state.
- Transaction boundaries: Single-page UI actions are atomic in-memory updates followed by optional storage persist.
- Event consistency model: Immediate consistency within current browser session.

# Cross-Cutting Concerns
- Authentication: None for readers/tool users.
- Authorization: None.
- Caching: Browser cache + GitHub Pages static asset caching.
- Rate limiting: Not applicable (no server API).
- Observability: Build logs in GitHub Actions; manual functional smoke tests.

# Assumptions / Decisions
- The repository currently operates as a single module (`blog-site`) rooted at project root.
- Team Generator will remain fully client-side to preserve static hosting constraints.
- Team Generator UI is implemented in namespaced CSS/JS under `static/tools/team-generator/` and mounted by a dedicated Hugo layout.

# Known Issues
- Local environments without Hugo installed must use a temporary binary or CI for full render verification.

# Change Log (Last 10)
- 2026-02-16: Adjusted Team Generator form control styling to explicit light theme values (white input backgrounds, native-like borders) and enabled dataset selector visual state for UI parity.
- 2026-02-16: Added `/tools/team-generator/` client-side tool (custom layout, modular JS, token-based CSS) and updated CI to run Hugo build on PRs while restricting deploy to `main` pushes.
- 2026-02-16: Bootstrapped root architecture context and normalized conventions for upcoming tool-page implementation.
