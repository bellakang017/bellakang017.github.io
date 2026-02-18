# CLAUDE.md

## Project Overview

Personal research and design portfolio for Bella Kang, hosted on GitHub Pages at `https://bellakang017.github.io`. The site combines a Jekyll static site with standalone HTML pages for academic course documentation.

## Tech Stack

- **Static site generator:** Jekyll (Ruby-based, built automatically by GitHub Pages)
- **Templating:** Liquid
- **Markdown processor:** Kramdown
- **Styling:** SCSS (compiled by Jekyll) + inline CSS on standalone pages
- **JavaScript:** Vanilla JS (no frameworks)
- **Fonts:** Google Fonts — Playfair Display, Source Sans 3, Titillium Web, JetBrains Mono
- **Some course pages:** Built with Vite (pre-built assets committed to repo)

## Repository Structure

```
├── _config.yml              # Jekyll configuration
├── index.html               # Main portfolio homepage (standalone HTML, not Jekyll-processed)
├── aboutme.html             # About/CV page (Jekyll layout)
├── 404.html                 # Error page
├── feed.xml / sitemap.xml   # RSS feed and sitemap
├── robots.txt               # SEO directives
├── site.webmanifest         # PWA manifest
│
├── _layouts/                # Jekyll page templates
│   ├── page.html
│   └── post.html
│
├── _includes/               # Jekyll template partials
│   ├── head.html            # <head> section
│   ├── header.html          # Site header/nav
│   ├── footer.html          # Site footer
│   ├── mobile_menu.html     # Mobile navigation
│   ├── archive.html         # Post archive listing
│   ├── js.html              # JavaScript includes (theme toggle)
│   ├── google_analytics.html
│   ├── disqus.html
│   └── cusdis.html
│
├── _posts/                  # Blog posts (Markdown, YYYY-MM-DD-title.md)
│
├── _sass/                   # SCSS partials
│   ├── _normalize.scss
│   ├── _code_style.scss
│   ├── _flexible.scss
│   └── _show_comment.scss
│
├── assets/
│   ├── css/main.scss        # Main stylesheet (dark/light mode support)
│   └── img/                 # Images and favicons
│
├── images/                  # Additional images (profile, etc.)
│
├── categories/              # Category archive pages
│   ├── dev.html
│   ├── travel.html
│   └── writing.html
│
├── adv382j-guide/           # ADV 382J Persuasion Theory — Vite-built React app
│   ├── index.html
│   └── assets/              # Bundled JS/CSS (hashed filenames)
│
├── hdf342/                  # HDF 342 Developmental Psychopathology — standalone HTML
│   └── index.html
│
└── mkt397/                  # MKT 397 Quantitative Marketing — standalone HTML
    └── index.html
```

## Key Configuration

**`_config.yml`:**
- Site title: `Bella Kang`
- URL: `https://bellakang017.github.io`
- Permalink pattern: `/:year-:month/:title`
- Timezone: `America/Chicago`
- Default layout for posts: `post` (with comments disabled)
- Excludes: `README.md`, `LICENSE`, `github`

## Build & Deployment

- **No local build tooling required** — no `package.json`, `Gemfile`, or `Makefile` in the repo
- GitHub Pages automatically runs Jekyll on push to `master`
- Output goes to `_site/` (gitignored)
- SCSS is compiled to CSS by Jekyll during build
- Vite-built course pages have pre-committed assets; no build step needed

## Development Workflow

1. **Blog posts:** Add Markdown files to `_posts/` with format `YYYY-MM-DD-title.md` and appropriate front matter
2. **New category pages:** Create HTML in `categories/` with the category layout
3. **Course pages:** Add a new directory at the root (e.g., `coursecode/index.html`). Can be standalone HTML or Vite-built
4. **Styling changes:** Edit SCSS files in `_sass/` or `assets/css/main.scss`. The main homepage uses inline `<style>` in `index.html`
5. **Layout/partial changes:** Edit files in `_layouts/` and `_includes/`

## Design Conventions

- **Color system:** CSS custom properties defined in `:root` on `index.html`
  - Primary palette: `--chalk`, `--piano`, `--linen`, `--stone` (neutrals)
  - Accent: `--accent` (#8B2332 — deep red), `--sage` (#6B7B5E — green)
  - Text levels: `--text`, `--text-mid`, `--text-soft`
- **Typography:** Playfair Display for headings, Source Sans 3 for body text
- **Dark/light mode:** Supported via `_includes/js.html` with `localStorage` persistence and `prefers-color-scheme` detection (applies to Jekyll-rendered pages)
- **Animations:** Intersection Observer-based fade-up effects on the homepage
- **Responsive breakpoints:** 768px (mobile), 1024px (tablet)
- **Max content width:** 1060px

## Content Architecture

The site has two distinct page types:

1. **Jekyll-rendered pages** (`aboutme.html`, blog posts, category archives) — use `_layouts/`, `_includes/`, and SCSS
2. **Standalone pages** (`index.html`, course pages) — self-contained HTML with inline styles and scripts, not processed through Jekyll layouts

## File Naming Conventions

- SCSS partials: prefixed with underscore (`_normalize.scss`)
- Blog posts: `YYYY-MM-DD-title.md`
- Course directories: lowercase course code (`adv382j-guide/`, `hdf342/`, `mkt397/`)
- Vite-built assets: hashed filenames (`index-4_JCMkki.js`)

## Testing

No test framework is configured. Validate changes by:
- Running `jekyll serve` locally (if Ruby/Jekyll are installed)
- Checking GitHub Pages build status after pushing

## Important Notes

- The main `index.html` is a standalone page — it does **not** use Jekyll layouts or Liquid templating
- Course pages (`hdf342/`, `mkt397/`) use inline CSS and are fully self-contained
- The `adv382j-guide/` page is a Vite-built app with hashed assets — source is not in this repo
- Comments (Disqus/Cusdis) and Google Analytics are configured but currently disabled (empty values in `_config.yml`)
- The `.jekyll-cache/` directory may appear locally but is not committed
