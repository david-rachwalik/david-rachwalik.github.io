import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@core/app-routing.module';

// Will contain singleton services
// https://thetombomb.com/posts/app-core-shared-feature-modules
// https://stackoverflow.com/questions/51408210/why-my-path-for-import-angular-core-is-different-to-online-tutorial
// https://www.pluralsight.com/guides/angular-module-declaring-components

// Only import [BrowserModule, BrowserAnimationsModule] once
// All other shared/feature modules will import [CommonModule]
// https://dev.to/sanketmaru/import-once-browser-module-1pie

@NgModule({
  declarations: [],
  imports: [AppRoutingModule, BrowserModule, BrowserAnimationsModule],
  exports: [AppRoutingModule, BrowserModule, BrowserAnimationsModule],
})
export class CoreModule {}
