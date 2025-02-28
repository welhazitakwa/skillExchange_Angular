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


const routes: Routes = [
  { path: 'back', component: MainBackComponent },
   { path: '', component: MainFrontComponent },
  { path: 'bloglist', component: BlogListComponent },
  { path: 'blogdetails', component: BlogDetailsComponent },
   { path: 'about', component: AboutComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'contact', component: ContactComponent },
  // { path: 'residenceD/:param', component: ResidenceDetailsComponent },
  //{ path: '', redirectTo: '/front', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
