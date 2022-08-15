# Personal Site

## Web App ([site](https://david-rachwalik.github.io), [repo](https://github.com/david-rachwalik/david-rachwalik.github.io))

Personal site for hobbies, aspirations, game news, game design, engine info, and patch notes.

### Project Commands Used

Generate a new Angular application ([tutorial](https://angular.io/tutorial/toh-pt5), [layouts](https://indepth.dev/posts/1235/how-to-reuse-common-layouts-in-angular-using-router-2), [RxJS](https://www.learnrxjs.io))

```bash
ng new <app-name>
```

Install linting & Prettier

```bash
npm i -D eslint prettier
npm i -D eslint-config-airbnb eslint-config-airbnb-typescript
npm i -D eslint-config-prettier eslint-plugin-prettier eslint-plugin-html
npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Install Angular Material ("custom" theme, 'y' typography, 'y' animations) ([background](https://material.angular.io/guide/theming#application-background-color))

```bash
ng add @angular/material
```

Install [Angular Flex-Layout](https://github.com/angular/flex-layout) ([wiki](https://github.com/angular/flex-layout/wiki), [API](https://github.com/angular/flex-layout/wiki/API-Documentation))

```bash
npm i @angular/flex-layout
```

Install [GitHub Pages deployment package for Angular](https://www.npmjs.com/package/angular-cli-ghpages) ([Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows))

```bash
ng add angular-cli-ghpages
```

Install [NGRX](https://ngrx.io) [Store](https://ngrx.io/guide/store) for state management

```bash
ng add @ngrx/store --minimal=false --statePath=core/store
ng add @ngrx/entity --skip-confirmation
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
