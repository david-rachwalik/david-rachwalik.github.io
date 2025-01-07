# david-rachwalik.github.io (Client)

## Web App ([site](https://david-rachwalik.github.io), [repo](https://github.com/david-rachwalik/david-rachwalik.github.io))

Personal site for hobbies, aspirations, game news, game design, engine info, and patch notes.

### Project Tech Stack

_Languages:_ HTML, CSS, JavaScript, TypeScript, Markdown

[Angular](https://v18.angular.dev/overview), Angular Material, NgRx (data store, redux)

---

### Common Project Commands

Ensure that Docker is running.&nbsp; When the project is opened in VS Code, open the **Command Palette** (`Ctrl+Shift+P`) and select **Dev Containers: Reopen in Container** (or select **Dev Containers: Rebuild and Reopen in Container** if using for the first time).

#### Dev Container Commands

List running containers (shows IDs and names)

```bash
docker ps
```

Connect to container by ID or name

```bash
docker exec -it --user vscode -w /workspaces/<project-name> <container-id> /bin/zsh
```

#### Angular 'generate' Commands Used

<sup><sub>add a script to `package.json` to alias the local `ng`</sub></sup> | <sup><sub>`npx` is a Node.js tool that runs binaries from your local node_modules folder if available</sub></sup>

Generate a new Angular module

```bash
npm run ng -- g m <module-name>
npx ng g m <module-name>
./node_modules/.bin/ng g m <module-name>
```

Generate a new Angular component

```bash
npm run ng -- g c <component-name>
```

Example of generating the Blog section

```bash
npm run ng -- g m modules/blog --module=app --route=blog --routing
npm run ng -- g c modules/blog/pages/blog --module=blog
npm run ng -- g c modules/blog/pages/blog-post --module=blog
```

---

---

### Project Creation Commands Used

Generate a new Angular application ([tutorial](https://angular.io/tutorial/toh-pt5), [layouts](https://indepth.dev/posts/1235/how-to-reuse-common-layouts-in-angular-using-router-2), [routing](https://v18.angular.dev/guide/templates/pipes#built-in-pipes), [RxJS](https://www.learnrxjs.io))

```bash
ng new <app-name>
```

<!-- Install [PostCSS](https://postcss.org) ([plugins](https://www.postcss.parts))

```bash
npm i -D postcss postcss-import postcss-advanced-variables postcss-nested-ancestors postcss-apply postcss-nested postcss-scss autoprefixer cssnano
``` -->

Install [Tailwind CSS](https://tailwindcss.com/docs/guides/angular) with configuration file ([CheatSheet](https://nerdcave.com/tailwind-cheat-sheet), [Need-to-Know](https://www.bitovi.com/blog/tailwind-css-with-angular-v12-what-you-need-to-know), [Use with preprocessors](https://tailwindcss.com/docs/using-with-preprocessors), [Box Shadow](https://tailwindcss.com/docs/box-shadow))

```bash
npm i -D tailwindcss
npx tailwindcss init
```

<!-- Install lodash

```bash
npm i lodash
npm i @types/lodash
``` -->

Install [Angular Material](https://material.angular.io) ("custom" theme, 'y' typography, 'y' animations) ([background](https://material.angular.io/guide/theming#application-background-color))

```bash
ng add @angular/material@<version>
```

Install [NGX-Markdown](https://github.com/jfcere/ngx-markdown) to render Angular markdown components and _yaml_ (for parsing metadata)

```bash
npm i ngx-markdown@<version> marked prismjs yaml
```

Install [NGRX](https://ngrx.io) [Store](https://ngrx.io/guide/store) for state management

```bash
ng add @ngrx/store@<version> --minimal=false --statePath=core/store
ng add @ngrx/store-devtools@<version> --skip-confirmation
ng add @ngrx/effects@<version> --skip-confirmation
ng add @ngrx/entity@<version> --skip-confirmation
ng add @ngrx/data@<version> --skip-confirmation
```

---

---

### Angular 'update' Commands

Globally install the latest Angular framework ([version compatibility](https://angular.io/guide/versions))

```bash
npm i -g @angular/cli@<version>
```

[Update](https://update.angular.io) Angular framework & Angular Materials

```bash
ng update @angular/core@<version> @angular/cli@<version>
ng update @angular/material@<version>
```

#### Angular Migration Commands (optional)

[Migrate](https://material.angular.io/guide/mdc-migration) legacy Material components to MDC-based ones

```bash
ng generate @angular/material:mdc-migration
```

[Migrate](https://angular.io/guide/standalone-migration) existing Angular project to standalone

```bash
ng generate @angular/core:standalone
```

[Migrate](https://blog.angular.io/introducing-angular-v17-4d7033312e4b) existing Angular project to use new [control flow](https://angular.io/guide/control_flow) (v17+)

```bash
ng generate @angular/core:control-flow
```

---

---

### Other Considerations

#### Deployment Options

Install [GitHub Pages deployment package for Angular](https://www.npmjs.com/package/angular-cli-ghpages) ([Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows))

```bash
ng add angular-cli-ghpages
```

#### Blog Commands Used

<!-- Install [Scully](https://scully.io) ([repo](https://github.com/scullyio/scully), [example](https://solocoding.dev))

```bash
ng add @scullyio/init
``` -->

Install [NGX-Markdown](https://github.com/jfcere/ngx-markdown) for Angular markdown components with scripts/styles

- other refs: [makeuseof guide](https://www.makeuseof.com/angular-markdown-files-website), [blog guide](https://daviddalbusco.medium.com/add-a-blog-to-your-angular-website-using-markdown-files-31cdb0627bdd), [clean blog theme](https://startbootstrap.com/theme/clean-blog)

```bash
npm i ngx-markdown marked prismjs
npm i -D @types/marked
```
