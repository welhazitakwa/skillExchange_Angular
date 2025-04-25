import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CoursesComponent } from './Front/courses/courses.component';
import { TeachersComponent } from './Front/teachers/teachers.component';
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

import { AddproductComponent } from './Front/GestionProduit/Product/addproduct/addproduct.component';
import { ProductDetailsComponent } from './Front/GestionProduit/Product/product-details/product-details.component';
import { UpdateproductComponent } from './Front/GestionProduit/Product/updateproduct/updateproduct.component';
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
import { UserBackDetailsComponent } from './Back/GestionUser/User/user-back-details/user-back-details.component';
import { AllbadgesComponent } from './Back/GestionUser/Badge/allbadges/allbadges.component';

import { SignaturePadComponent } from './components/signature-pad/signature-pad.component';

import { CertificatComponent } from './Back/GestionQUIZZ/certificat/certificat.component';
import { QuizComponent } from './Back/GestionQUIZZ/quiz/quiz.component';
import { QuestionComponent } from './Back/GestionQUIZZ/question/question.component';

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

import { ImageCropperComponent } from 'ngx-image-cropper';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PostDetailsComponent } from './Front/GestionForumPost/Posts/post-details/post-details.component';



//import { ImageCropperModule } from 'ngx-image-cropper';




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
    ListpostComponent,
    ListaddComponent,
    AllCommentsComponent,
    ShowPostsComponent,
    PostDetailsComponent,
    AddcartComponent,
    ShowcartComponent,
    UpdatecartComponent,
    CartDetailsComponent,
    AddproductComponent,
    ProductDetailsComponent,
    UpdateproductComponent,
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
    AllRateEventComponent,
    UpdateRateEventComponent,
    DeleteRateEventComponent,
    AllParticipationEventsComponent,
    UpdateParticipationEventsComponent,
    DeleteParticipationEventsComponent,
    ShowPostsComponent, 
       //ImageCropperComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularToastifyModule,
    MatPaginatorModule,
    ImageCropperComponent,
    //ImageCropperModule,
  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
