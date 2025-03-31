import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ToastService, AngularToastifyModule } from 'angular-toastify'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRegisterComponent } from './Auth/auth-register/auth-register.component';
import { AuthLoginComponent } from './Auth/auth-login/auth-login.component';

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

import { ProfileComponent } from './Front/GestionUser/profile/profile.component';
import { BalanceComponent } from './Front/GestionUser/balance/balance.component';
import { SettingsComponent } from './Front/GestionUser/settings/settings.component';
import { AllUsersComponent } from './Back/GestionUser/User/all-users/all-users.component';

import { ImageCropperComponent } from 'ngx-image-cropper';
import { UserBackDetailsComponent } from './Back/GestionUser/User/user-back-details/user-back-details.component';
import { AuthBanComponent } from './Auth/auth-ban/auth-ban.component';
import { AllbadgesComponent } from './Back/GestionUser/Badge/allbadges/allbadges.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    NavComponent,
    MainBackComponent,
    ErrorComponent,
    MainFrontComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    AboutComponent,
    BlogListComponent,
    BlogDetailsComponent,
    CoursesComponent,
    TeachersComponent,
    ContactComponent,
    AuthRegisterComponent,
    AuthLoginComponent,

    ProfileComponent,
    BalanceComponent,
    SettingsComponent,
    AllUsersComponent,

    
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
    UserBackDetailsComponent,
    AuthBanComponent,
    AllbadgesComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ImageCropperComponent,
    AngularToastifyModule,
  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }