import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AngularToastifyModule, ToastService } from 'angular-toastify';
//import { MatPaginatorModule } from '@angular/material/paginator'; // 👈 Ajouté pour le paginator


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { SideBarComponent } from './Back/side-bar/side-bar.component';
import { NavComponent } from './Back/nav/nav.component';
import { MainBackComponent } from './Back/main-back/main-back.component';
import { MainFrontComponent } from './Front/main-front/main-front.component';
import { FooterFrontComponent } from './Front/footer-front/footer-front.component';
import { HeaderFrontComponent } from './Front/header-front/header-front.component';
import { AboutComponent } from './Front/about/about.component';
import { BlogListComponent } from './Front/blog-list/blog-list.component';
import { BlogDetailsComponent } from './Front/blog-details/blog-details.component';


import { CoursesComponent } from './Front/GestionFormations/Formation/courses/courses.component';
import { ContactComponent } from './Front/contact/contact.component';
import { ErrorComponent } from './error/error.component';


import { AuthRegisterComponent } from './Auth/auth-register/auth-register.component';
import { AuthLoginComponent } from './Auth/auth-login/auth-login.component';
import { AuthBanComponent } from './Auth/auth-ban/auth-ban.component';

import { ListpostComponent } from './Back/GestionForumPost/Post/listpost/listpost.component';
import { ListaddComponent } from './Back/GestionForumPost/Post/listadd/listadd.component';
import { AllCommentsComponent } from './Back/GestionForumPost/CommentPost/all-comments/all-comments.component';
import { ShowPostsComponent } from './Front/GestionForumPost/Posts/show-posts/show-posts.component';

import { AddcartComponent } from './Front/GestionProduit/Cart/addcart/addcart.component';
import { ShowcartComponent } from './Front/GestionProduit/Cart/showcart/showcart.component';
import { UpdatecartComponent } from './Front/GestionProduit/Cart/updatecart/updatecart.component';
import { CartDetailsComponent } from './Front/GestionProduit/Cart/cart-details/cart-details.component';

import { ProductDetailsComponent } from './Front/GestionProduit/Product/product-details/product-details.component';
import { ShowproductComponent } from './Front/GestionProduit/Product/showproduct/showproduct.component';
import { AllProductsComponent } from './Back/GestionProduit/Product/all-products/all-products.component';
import { AllCartsComponent } from './Back/GestionProduit/Cart/all-carts/all-carts.component';
import { AllReviewsComponent } from './Back/GestionProduit/ReviewP/all-reviews/all-reviews.component';
import { AllImagesComponent } from './Back/GestionProduit/ImageP/all-images/all-images.component';

import { AllCartProductsComponent } from './Back/GestionProduit/CartProduct/all-cart-products/all-cart-products.component';
import { CartProductsComponent } from './Front/GestionProduit/cart-products/cart-products.component';


import { ProfileComponent } from './Front/GestionUser/profile/profile.component';
import { BalanceComponent } from './Front/GestionUser/balance/balance.component';
import { SettingsComponent } from './Front/GestionUser/settings/settings.component';
import { AllUsersComponent } from './Back/GestionUser/User/all-users/all-users.component';






import { ImageCropperComponent } from 'ngx-image-cropper';
import { UserBackDetailsComponent } from './Back/GestionUser/User/user-back-details/user-back-details.component';
import { SignaturePadComponent } from './components/signature-pad/signature-pad.component';

import { CategoriesComponent } from './Back/GestionFormation/Category/categories/categories.component';
import { AddEditCategoryComponent } from './Back/GestionFormation/Category/add-edit-category/add-edit-category.component';

//

import { MatButtonModule } from '@angular/material/button';






import { EditCategoryComponent } from './Back/GestionFormation/Category/edit-category/edit-category.component';
import { FormationsComponent } from './Back/GestionFormation/Formation/formations/formations.component';
import { AddFormationComponent } from './Back/GestionFormation/Formation/add-formation/add-formation.component';
import { EditFormationComponent } from './Back/GestionFormation/Formation/edit-formation/edit-formation.component';
import { AddCoursesFrontComponent } from './Front/GestionFormations/Formation/add-courses-front/add-courses-front.component';
import { CousesByCategoryComponent } from './Back/GestionFormation/Category/couses-by-category/couses-by-category.component';
import { CoursesByCatFrontComponent } from './Front/GestionFormations/Formation/courses-by-cat-front/courses-by-cat-front.component';
import { UserCourseSpaceComponent } from './Front/GestionFormations/Formation/user-course-space/user-course-space.component';
import { AddCourseComponent } from './Front/GestionFormations/Formation/add-course/add-course.component';
import { DetailsFormationComponent } from './Front/GestionFormations/Formation/details-formation/details-formation.component';
import { EditCourseComponent } from './Front/GestionFormations/Formation/edit-course/edit-course.component';

import { CertificatComponent } from './Back/GestionQUIZZ/certificat/certificat.component';
import { QuizComponent } from './Back/GestionQUIZZ/quiz/quiz.component';
import { QuestionComponent } from './Back/GestionQUIZZ/question/question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllEventsComponent } from './Back/GestionEvents/Events/all-events/all-events.component';
import { UpdateEventsComponent } from './Back/GestionEvents/Events/update-events/update-events.component';
import { DeleteEventsComponent } from './Back/GestionEvents/Events/delete-events/delete-events.component';
import { AllEventCommentComponent } from './Back/GestionEvents/EventComment/all-event-comment/all-event-comment.component';
import { UpdateEventCommentComponent } from './Back/GestionEvents/EventComment/update-event-comment/update-event-comment.component';
import { DeleteEventCommentComponent } from './Back/GestionEvents/EventComment/delete-event-comment/delete-event-comment.component';
import { AllEventImageComponent } from './Back/GestionEvents/EventImage/all-event-image/all-event-image.component';
import { UpdateEventImageComponent } from './Back/GestionEvents/EventImage/update-event-image/update-event-image.component';

import { AllRateEventComponent } from './Back/GestionEvents/RateEvent/all-rate-event/all-rate-event.component';
import { UpdateRateEventComponent } from './Back/GestionEvents/RateEvent/update-rate-event/update-rate-event.component';
import { DeleteRateEventComponent } from './Back/GestionEvents/RateEvent/delete-rate-event/delete-rate-event.component';

import { AllParticipationEventsComponent } from './Back/GestionEvents/ParticipationEvents/all-participation-events/all-participation-events.component';
import { UpdateParticipationEventsComponent } from './Back/GestionEvents/ParticipationEvents/update-participation-events/update-participation-events.component';
import { DeleteParticipationEventsComponent } from './Back/GestionEvents/ParticipationEvents/delete-participation-events/delete-participation-events.component';

import { MatPaginatorModule } from '@angular/material/paginator';
import { ShowEventsComponent } from './Front/GestionEvents/Events/show-events/show-events.component';
import { AddEventModalComponent } from './Back/GestionEvents/Events/add-event-modal/add-event-modal.component';

import { EventImagesComponent } from './Back/GestionEvents/event-images/event-images.component';
import { CommonModule } from '@angular/common';
import { EventDetailsComponent } from './Front/GestionEvents/event-details/event-details.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TeachersComponent } from './Front/teachers/teachers.component';
import { FrontQuizComponent } from './Front/GestionQuizz/quiz/quiz.component';

import { PostDetailsComponent } from './Front/GestionForumPost/Posts/post-details/post-details.component';
import { AnalyticsDashboardComponent } from './Back/GestionForumPost/analytics-dashboard/analytics-dashboard.component';



//import { ImageCropperModule } from 'ngx-image-cropper';



import { SuccessComponent } from './Front/GestionProduit/success/success.component';

import { DetailsFormationBackComponent } from './Back/GestionFormation/Formation/details-formation-back/details-formation-back.component';
import { ParticipantsListComponent } from './Back/GestionFormation/Formation/participants-list/participants-list.component';
import { ApprooveCourseComponent } from './Back/GestionFormation/Formation/approove-course/approove-course.component';
import { NgChartsModule } from 'ng2-charts';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor'; // <-- adapte le chemin si nécessaire



import { AllbadgesComponent } from './Back/GestionUser/Badge/allbadges/allbadges.component';

import { CertificateComponent } from './Front/GestionQuizz/quiz/certificate/certificate.component';
import { MatDialogModule } from '@angular/material/dialog';




@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    NavComponent,
    MainBackComponent,
    MainFrontComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    AboutComponent,
    BlogListComponent,
    BlogDetailsComponent,
    CoursesComponent,
    TeachersComponent,
    ContactComponent,
    ErrorComponent,
    AuthRegisterComponent,
    AuthLoginComponent,

    AuthBanComponent,


    AllCommentsComponent,
    ShowPostsComponent,


    FrontQuizComponent,
    ListpostComponent,
    ListaddComponent,




    AddcartComponent,
    ShowcartComponent,
    UpdatecartComponent,
    CartDetailsComponent,

    ProductDetailsComponent,

    ShowproductComponent,
    AllProductsComponent,
    AllCartsComponent,
    AllReviewsComponent,
    AllImagesComponent,
    AllCartProductsComponent,
    CartProductsComponent,
    ProfileComponent,
    BalanceComponent,
    SettingsComponent,
    AllUsersComponent,
    UserBackDetailsComponent,
    AllbadgesComponent,
    SignaturePadComponent,
    CategoriesComponent,
    AddEditCategoryComponent,
    EditCategoryComponent,
    FormationsComponent,
    AddFormationComponent,
    EditFormationComponent,
    AddCoursesFrontComponent,
    CousesByCategoryComponent,
    CoursesByCatFrontComponent,
    UserCourseSpaceComponent,
    AddCourseComponent,
    DetailsFormationComponent,
    EditCourseComponent,
    CertificatComponent,
    QuizComponent,
    QuestionComponent,
    AllEventsComponent,
    UpdateEventsComponent,
    DeleteEventsComponent,
    AllEventCommentComponent,
    UpdateEventCommentComponent,
    DeleteEventCommentComponent,
    AllEventImageComponent,
    UpdateEventImageComponent,

    // DeleteEventImageComponent,

    AllRateEventComponent,
    UpdateRateEventComponent,
    DeleteRateEventComponent,
    AllParticipationEventsComponent,
    UpdateParticipationEventsComponent,
    DeleteParticipationEventsComponent,

    ShowPostsComponent,
    AnalyticsDashboardComponent,
       //ImageCropperComponent,

    ShowEventsComponent,
    AddEventModalComponent,
    EventImagesComponent,
    EventDetailsComponent,
    AllCartProductsComponent,
    CartProductsComponent,


    PostDetailsComponent,

    SuccessComponent,
    DetailsFormationBackComponent,
    ParticipantsListComponent,

    ApprooveCourseComponent,
    CertificateComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    CommonModule,
    HttpClientModule,
    AngularToastifyModule,

    MatPaginatorModule,
    ImageCropperComponent,
    //ImageCropperModule,

    MatDialogModule,
    FullCalendarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,






    NgChartsModule, // Add NgChartsModule



  ],


  providers: [
    ToastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

