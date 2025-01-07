# david-rachwalik.github.io (Client)

## Blog

Personal blog for hobbies, programmer teachings, best practices, & general tech info.

- <sup><sub>**Categories:**&nbsp; Superheroes, Anime, VTubers, Movies, Series, Games, Tech, Coding</sub></sup>

### Project Tech Stack

_Languages:_&nbsp; HTML, CSS, JavaScript, TypeScript, Markdown

Angular, Angular Material, NgRx (data store, redux)

---

### Client-Side Markdown Rendering

Using Angular with Markdown Libraries.&nbsp; This approach leverages JavaScript to dynamically load and render markdown files directly on the client side.&nbsp; Integrate markdown rendering into the Angular project using these libraries:

- [Marked.js](https://github.com/markedjs/marked):&nbsp; A fast markdown parser and compiler
- [ngx-markdown](https://github.com/jfcere/ngx-markdown):&nbsp; An Angular-specific library that uses Marked.js

#### How It Works

Store markdown files in the `/assets` folder.&nbsp; Use `HttpClient` to fetch these files dynamically.&nbsp; Use the library to render the content into HTML.

1. Install ngx-markdown
2. Provide `provideHttpClient()` and import `MarkdownModule.forRoot()` to `AppModule`
3. Use in component
