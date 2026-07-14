# Blog Module

This module handles the display and routing of markdown-based blog posts for the website.&nbsp; It will be a personal blog for coding tips, lessons learned, best practices, & other hobbies.

## Resources / Tools

- **[marked.js](https://github.com/markedjs/marked):**&nbsp; Markdown parser and compiler
- **[ngx-markdown](https://github.com/jfcere/ngx-markdown):**&nbsp; Markdown rendering library
  <!-- - [MakeUseOf Guide](https://www.makeuseof.com/angular-markdown-files-website)
  - [David Dalbusco's Angular Markdown Blog Guide](https://daviddalbusco.medium.com/add-a-blog-to-your-angular-website-using-markdown-files-31cdb0627bdd) -->

## How It Works

Store markdown files within the `/assets` folder.&nbsp; Use `HttpClient` to fetch these files dynamically.&nbsp; Use the library to properly render its content as HTML.

1. Install ngx-markdown
2. Add `provideMarkdown()` to "providers" in the `ApplicationConfig`
3. Use `MarkdownComponent` in Angular components

### Metadata Generation

Before building for production, the application generates a metadata JSON file that parses and catalogues the `yaml` frontmatter of all markdown posts so the Angular application knows what to render.

To manually generate the blog metadata JSON (this runs automatically during `npm run deploy` via root scripts):

```bash
npm run meta
```

<!-- ### Styling Inspiration

[Clean Blog Theme](https://startbootstrap.com/theme/clean-blog) -->

---

## Historical Tools & Generation (Reference)

The following commands were used to originally scaffold this module and its components using the Angular CLI:

```bash
npx ng g m modules/blog --route=blog --routing
npx ng g c modules/blog/pages/blog
npx ng g c modules/blog/pages/blog-post
```

Early considerations for static site generation included **Scully**, though the project ultimately shifted toward a dynamic NodeJS metadata generation script (`generate-blog-metadata.js`) and standard SPA hosting on GitHub Pages.

<!--
Install Scully (https://scully.io, Repo: https://github.com/scullyio/scully, Example: https://solocoding.dev)

```bash
npx ng add @scullyio/init
```
-->
