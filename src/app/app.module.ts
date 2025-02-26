import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Front/header/header.component';
import { FooterComponent } from './Front/footer/footer.component';
import { SideBarComponent } from './Back/side-bar/side-bar.component';
import { NavComponent } from './Back/nav/nav.component';
import { MainBackComponent } from './Back/main-back/main-back.component';
import { MainFrontComponent } from './Front/main-front/main-front.component';
import { AboutComponent } from './Front/about/about.component';
import { CoursesComponent } from './Front/courses/courses.component';
import { ElementsComponent } from './Front/elements/elements.component';
import { CoursedetailsComponent } from './Front/coursedetails/coursedetails.component';
import { BlogHomeComponent } from './Front/blog-home/blog-home.component';
import { BlogDetailsComponent } from './Front/blog-details/blog-details.component';
import { ContactsComponent } from './Front/contacts/contacts.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    NavComponent,
    MainBackComponent,
    MainFrontComponent,
    AboutComponent,
    CoursesComponent,
    ElementsComponent,
    CoursedetailsComponent,
    BlogHomeComponent,
    BlogDetailsComponent,
    ContactsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
