# david-rachwalik.github.io (Client)

## Web App ([site](https://david-rachwalik.github.io), [repo](https://github.com/david-rachwalik/david-rachwalik.github.io))

Personal site for hobbies, aspirations, game news, game design, engine info, and patch notes.

### Project Tech Stack

_Languages:_ HTML, CSS, JavaScript, SCSS, TypeScript

Angular, Angular Material, NGRX (data store, redux)

### Project Commands Used

Generate a new Angular application ([tutorial](https://angular.io/tutorial/toh-pt5), [layouts](https://indepth.dev/posts/1235/how-to-reuse-common-layouts-in-angular-using-router-2), [RxJS](https://www.learnrxjs.io))

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
ng add @angular/material
```

Install [Angular Flex-Layout](https://github.com/angular/flex-layout) ([wiki](https://github.com/angular/flex-layout/wiki), [API](https://github.com/angular/flex-layout/wiki/API-Documentation))

```bash
npm i @angular/cdk @angular/flex-layout
```

Install [NGRX](https://ngrx.io) [Store](https://ngrx.io/guide/store) for state management

```bash
ng add @ngrx/store --minimal=false --statePath=core/store
ng add @ngrx/store-devtools --skip-confirmation
ng add @ngrx/effects --skip-confirmation
ng add @ngrx/entity --skip-confirmation
ng add @ngrx/data --skip-confirmation
```

---

#### Deployment Options

Install [GitHub Pages deployment package for Angular](https://www.npmjs.com/package/angular-cli-ghpages) ([Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows))

```bash
ng add angular-cli-ghpages
```

#### Blog Options

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

---

### Angular 'generate' Commands Used

Generate a new Angular component

```bash
ng g c <component-name>
```

Generate a new Angular module

```bash
ng g m <module-name>
```

---

### Angular 'update' Commands Used

Globally install the latest Angular framework

```bash
npm i -g @angular/cli@<release-version>
```
