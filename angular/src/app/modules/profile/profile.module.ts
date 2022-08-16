import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AboutComponent } from './components/about/about.component';
import { FooterComponent } from './components/profile-layout/footer/footer.component';
import { HeaderComponent } from './components/profile-layout/header/header.component';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { SubheaderComponent } from './components/profile-layout/subheader/subheader.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [
    ProfileLayoutComponent,
    ProfileComponent,
    AboutComponent,
    HeaderComponent,
    SubheaderComponent,
    FooterComponent,
  ],
  imports: [SharedModule, ProfileRoutingModule],
})
export class ProfileModule {}
