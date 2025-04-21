import { NgModule } from '@angular/core';
import { MainBackComponent } from './Back/main-back/main-back.component';
import { MainFrontComponent } from './Front/main-front/main-front.component';
import { AboutComponent } from './Front/about/about.component';
import { BlogListComponent } from './Front/blog-list/blog-list.component';
import { BlogDetailsComponent } from './Front/blog-details/blog-details.component';
import { CoursesComponent } from './Front/GestionFormations/Formation/courses/courses.component';
import { TeachersComponent } from './Front/teachers/teachers.component';
import { ContactComponent } from './Front/contact/contact.component';
import { AuthRegisterComponent } from './Auth/auth-register/auth-register.component';
import { AuthLoginComponent } from './Auth/auth-login/auth-login.component';
import { AdminGuard } from './core/services/Auth/admin-guard.service';
import { UserGuard } from './core/services/Auth/user-guard.service';
import { ListpostComponent } from './Back/GestionForumPost/Post/listpost/listpost.component';

import { AllProductsComponent } from './Back/GestionProduit/Product/all-products/all-products.component';
import { AllCartsComponent } from './Back/GestionProduit/Cart/all-carts/all-carts.component';
import { AllReviewsComponent } from './Back/GestionProduit/ReviewP/all-reviews/all-reviews.component';
import { AllImagesComponent } from './Back/GestionProduit/ImageP/all-images/all-images.component';

import { ProfileComponent } from './Front/GestionUser/profile/profile.component';
import { SettingsComponent } from './Front/GestionUser/settings/settings.component';
import { BalanceComponent } from './Front/GestionUser/balance/balance.component';
import { AllUsersComponent } from './Back/GestionUser/User/all-users/all-users.component';
import { UserBackDetailsComponent } from './Back/GestionUser/User/user-back-details/user-back-details.component';
import { AuthBanComponent } from './Auth/auth-ban/auth-ban.component';
import { AllbadgesComponent } from './Back/GestionUser/Badge/allbadges/allbadges.component';
import { CategoriesComponent } from './Back/GestionFormation/Category/categories/categories.component';
import { FormationsComponent } from './Back/GestionFormation/Formation/formations/formations.component';
import { CousesByCategoryComponent } from './Back/GestionFormation/Category/couses-by-category/couses-by-category.component';
import { CoursesByCatFrontComponent } from './Front/GestionFormations/Formation/courses-by-cat-front/courses-by-cat-front.component';
import { UserCourseSpaceComponent } from './Front/GestionFormations/Formation/user-course-space/user-course-space.component';
import { CertificatComponent } from './Back/GestionQUIZZ/certificat/certificat.component';
import { QuizComponent } from './Back/GestionQUIZZ/quiz/quiz.component';
import { QuestionComponent } from './Back/GestionQUIZZ/question/question.component';
import { RouterModule, Routes } from '@angular/router';
import { AllEventsComponent } from './Back/GestionEvents/Events/all-events/all-events.component';
import { ShowproductComponent } from './Front/GestionProduit/Product/showproduct/showproduct.component';
import { ProductDetailsComponent } from './Front/GestionProduit/Product/product-details/product-details.component';
import { AllCartProductsComponent } from './Back/GestionProduit/CartProduct/all-cart-products/all-cart-products.component';
import { AllCommentsComponent } from './Back/GestionForumPost/CommentPost/all-comments/all-comments.component';
import { ShowPostsComponent } from './Front/GestionForumPost/Posts/show-posts/show-posts.component';
import { PostDetailsComponent } from './Front/GestionForumPost/Posts/post-details/post-details.component';
import { ParticipantsListComponent } from './Back/GestionFormation/Formation/participants-list/participants-list.component';
import { ApprooveCourseComponent } from './Back/GestionFormation/Formation/approove-course/approove-course.component';
import { ContentListComponent } from './Front/GestionFormations/CourseContent/content-list/content-list.component';
import { AddContentComponent } from './Front/GestionFormations/CourseContent/add-content/add-content.component';


const routes: Routes = [
  //canActivate: [AdminGuard] to lock for admin
  //canActivate: [UserGuard] to lock for user
  // Back Office

  { path: 'backpost', component: ListpostComponent },

  { path: 'backCommentpost', component: AllCommentsComponent },

  { path: 'back', component: MainBackComponent /*,canActivate: [AdminGuard]*/ },

  //**************Back Gestion Users********************************
  {
    path: 'backusers',
    component: AllUsersComponent,
  },
  {
    path: 'backuserdetail/:id',
    component: UserBackDetailsComponent,
  },
  {
    path: 'backbadges',
    component: AllbadgesComponent,
  },
  /***************************************************************/

  //**************Back Gestion Events********************************

  { path: 'backEvents', component: AllEventsComponent },

  /***************************************************************/

  //**************Back Gestion Produit********************************
  { path: 'backproducts', component: AllProductsComponent },
  { path: 'backcarts', component: AllCartsComponent },
  { path: 'backreviews', component: AllReviewsComponent },
  { path: 'backimagesP', component: AllImagesComponent },

  /********************Back Gestion Formations****************************************/
  { path: 'categories', component: CategoriesComponent },
  { path: 'backcourses', component: FormationsComponent },
  { path: 'backcoursescat', component: CousesByCategoryComponent },
  { path: 'coursescat', component: CoursesByCatFrontComponent },
  { path: 'userCourseSpace', component: UserCourseSpaceComponent },
  { path: 'participantsList', component: ParticipantsListComponent },
  { path: 'approveCourse', component: ApprooveCourseComponent },
  { path: 'ContentList', component: ContentListComponent },
  { path: 'courses/:id/contents/add', component: AddContentComponent },

  { path: 'backcartProducts', component: AllCartProductsComponent },
  /***************************************************************/

  // Front Office
  { path: '', component: MainFrontComponent /*, canActivate: [UserGuard] */ },
  {
    path: 'bloglist',
    component: BlogListComponent /*, canActivate: [UserGuard] */,
  },
  {
    path: 'blogdetails',
    component: BlogDetailsComponent /*,
    canActivate: [UserGuard],*/,
  },
  /// Gestion Produit
  {
    path: 'products',
    component: ShowproductComponent /*, canActivate: [UserGuard]*/,
  },

  {
    path: 'productD/:idProduct',
    component: ProductDetailsComponent /*, canActivate: [UserGuard]*/,
  },
  { path: 'about', component: AboutComponent /*, canActivate: [UserGuard] */ },
  {
    path: 'courses',
    component: CoursesComponent /*, canActivate: [UserGuard] */,
  },
  {
    path: 'teachers',
    component: TeachersComponent /*, canActivate: [UserGuard]*/,
  },
  {
    path: 'contact',
    component: ContactComponent /*, canActivate: [UserGuard]*/,
  },

  // Auth
  { path: 'register', component: AuthRegisterComponent },
  { path: 'login', component: AuthLoginComponent },
  { path: 'banned/:email', component: AuthBanComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'balance', component: BalanceComponent },
  { path: 'certificats', component: CertificatComponent },

  // Quiz Routes
  { path: 'quizzes', component: QuizComponent },

  // Question Routes
  { path: 'questions/:quizId', component: QuestionComponent },
  //Gestion ForumPosts
  { path: 'posts', component: ShowPostsComponent },
  {
    path: 'posts/:id',
    component: PostDetailsComponent /*, canActivate: [UserGuard]*/,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
