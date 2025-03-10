import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainBackComponent } from './Back/main-back/main-back.component';
import { MainFrontComponent } from './Front/main-front/main-front.component';
import { AboutComponent } from './Front/about/about.component';
import { BlogListComponent } from './Front/blog-list/blog-list.component';
import { BlogDetailsComponent } from './Front/blog-details/blog-details.component';
import { CoursesComponent } from './Front/courses/courses.component';
import { TeachersComponent } from './Front/teachers/teachers.component';
import { ContactComponent } from './Front/contact/contact.component';
import { AuthRegisterComponent } from './Auth/auth-register/auth-register.component';
import { AuthLoginComponent } from './Auth/auth-login/auth-login.component';
import { AdminGuard } from './core/services/Auth/admin-guard.service';
import { UserGuard } from './core/services/Auth/user-guard.service';
import { ProfileComponent } from './Front/GestionUser/profile/profile.component';
import { SettingsComponent } from './Front/GestionUser/settings/settings.component';
import { BalanceComponent } from './Front/GestionUser/balance/balance.component';


const routes: Routes = [
  // Back Office
  { path: 'back', component: MainBackComponent },
  
  // Front Office
  { path: '', component: MainFrontComponent  },
  { path: 'bloglist', component: BlogListComponent},
  { path: 'blogdetails', component: BlogDetailsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'contact', component: ContactComponent },
  // { path: 'residenceD/:param', component: ResidenceDetailsComponent },
  //{ path: '', redirectTo: '/front', pathMatch: 'full' },

  // Auth
  { path: 'register' ,component: AuthRegisterComponent },
  { path: 'login' ,component: AuthLoginComponent },
  { path: 'profile' ,component: ProfileComponent },
  { path: 'settings' ,component: SettingsComponent },
  { path: 'balance' ,component: BalanceComponent },

  

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
