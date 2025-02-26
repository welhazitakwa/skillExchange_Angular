import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainBackComponent } from './Back/main-back/main-back.component';
import { MainFrontComponent } from './Front/main-front/main-front.component';
import { HeaderComponent } from './Front/header/header.component';
import { AboutComponent } from './Front/about/about.component';
import { CoursesComponent } from './Front/courses/courses.component';
import { ElementsComponent } from './Front/elements/elements.component';
import { CoursedetailsComponent } from './Front/coursedetails/coursedetails.component';
import { BlogDetailsComponent } from './Front/blog-details/blog-details.component';
import { BlogHomeComponent } from './Front/blog-home/blog-home.component';
import { ContactsComponent } from './Front/contacts/contacts.component';

const routes: Routes = [
  { path: 'back', component: MainBackComponent },
  { path: '', component: MainFrontComponent },
  { path: 'headerFront', component: HeaderComponent },
  { path: 'about', component: AboutComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'elements', component: ElementsComponent },
  { path: 'courseDetails', component: CoursedetailsComponent },
  { path: 'blogDetails', component: BlogDetailsComponent },
  { path: 'blogHome', component: BlogHomeComponent },
  { path: 'contacts', component: ContactsComponent },
  // { path: 'residenceD/:param', component: ResidenceDetailsComponent },
  //{ path: '', redirectTo: '/front', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
