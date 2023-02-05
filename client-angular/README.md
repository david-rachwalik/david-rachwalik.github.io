# david-rachwalik.github.io (Client)

## Web App ([site](https://david-rachwalik.github.io), [repo](https://github.com/david-rachwalik/david-rachwalik.github.io))

Personal site for hobbies, aspirations, game news, game design, engine info, and patch notes.

### Project Tech Stack

Angular, Angular Material, NGRX (data store)

### Project Commands Used

Generate a new Angular application ([tutorial](https://angular.io/tutorial/toh-pt5), [layouts](https://indepth.dev/posts/1235/how-to-reuse-common-layouts-in-angular-using-router-2), [RxJS](https://www.learnrxjs.io))

```bash
ng new <app-name>
```

<!-- Install [Angular Flex-Layout](https://github.com/angular/flex-layout) ([wiki](https://github.com/angular/flex-layout/wiki), [API](https://github.com/angular/flex-layout/wiki/API-Documentation))

```bash
npm i @angular/cdk @angular/flex-layout
``` -->

<!-- Install [PostCSS](https://postcss.org) ([plugins](https://www.postcss.parts))

```bash
npm i -D postcss postcss-import postcss-advanced-variables postcss-nested-ancestors postcss-nested postcss-scss autoprefixer cssnano
``` -->

Install [Tailwind CSS](https://tailwindcss.com/docs/guides/angular) ([CheatSheet](https://nerdcave.com/tailwind-cheat-sheet), [Need-to-Know](https://www.bitovi.com/blog/tailwind-css-with-angular-v12-what-you-need-to-know), [Use with preprocessors](https://tailwindcss.com/docs/using-with-preprocessors), [Box Shadow](https://tailwindcss.com/docs/box-shadow)) and generate configuration

```bash
npm i -D tailwindcss
npx tailwindcss init
```

Install Angular Material ("custom" theme, 'y' typography, 'y' animations) ([background](https://material.angular.io/guide/theming#application-background-color))

```bash
ng add @angular/material
```

Install [NGX-Markdown](https://github.com/jfcere/ngx-markdown) for Angular markdown components with scripts/styles

```bash
npm i ngx-markdown marked prismjs
npm i -D @types/marked
```

Install [NGRX](https://ngrx.io) [Store](https://ngrx.io/guide/store) for state management

```bash
ng add @ngrx/store --minimal=false --statePath=core/store
ng add @ngrx/store-devtools --skip-confirmation
ng add @ngrx/effects --skip-confirmation
ng add @ngrx/entity --skip-confirmation
ng add @ngrx/data --skip-confirmation
```

Install [GitHub Pages deployment package for Angular](https://www.npmjs.com/package/angular-cli-ghpages) ([Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows))

```bash
ng add angular-cli-ghpages
```

---

[Default Angular component css display block](https://stackoverflow.com/questions/51032328/angular-component-default-style-css-display-block) (generated components will contain css `:host { display: block; }`)

```json
...
// Set default value in angular.json (Angular v9.1+)
"projectType": "application",
"schematics": {
  "@schematics/angular:component": {
    "displayBlock": true
  }
}
...
```

Install lodash

```bash
npm i lodash
npm i @types/lodash
```

- also consider adding Angular blog ([Scully](https://scully.io), [example](https://solocoding.dev))

### Angular Generate Commands Used

Generate a new Angular component

```bash
ng g c <component-name>
```

Generate a new Angular module

```bash
ng g m <module-name>
```
