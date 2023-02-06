import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { DemoRoutingModule } from './demo-routing.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, DemoRoutingModule],
})
export class DemoModule {}
