import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainBackComponent } from './Back/main-back/main-back.component';


const routes: Routes = [
  { path: 'back', component: MainBackComponent },
  // { path: '', component: MainFrontComponent },
  // { path: 'headerFront', component: HeaderComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'courses', component: CoursesComponent },
  // { path: 'elements', component: ElementsComponent },
  // { path: 'courseDetails', component: CoursedetailsComponent },
  // { path: 'blogDetails', component: BlogDetailsComponent },
  // { path: 'blogHome', component: BlogHomeComponent },
  // { path: 'contacts', component: ContactsComponent },
  // { path: 'residenceD/:param', component: ResidenceDetailsComponent },
  //{ path: '', redirectTo: '/front', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
