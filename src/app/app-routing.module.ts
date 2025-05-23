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
import { ShowEventsComponent } from './Front/GestionEvents/Events/show-events/show-events.component';
import { EventDetailsComponent } from './Front/GestionEvents/event-details/event-details.component';
import { ShowproductComponent } from './Front/GestionProduit/Product/showproduct/showproduct.component';
import { ProductDetailsComponent } from './Front/GestionProduit/Product/product-details/product-details.component';
import { AllCartProductsComponent } from './Back/GestionProduit/CartProduct/all-cart-products/all-cart-products.component';
import { FrontQuizComponent } from './Front/GestionQuizz/quiz/quiz.component';
import { AllCommentsComponent } from './Back/GestionForumPost/CommentPost/all-comments/all-comments.component';
import { ShowPostsComponent } from './Front/GestionForumPost/Posts/show-posts/show-posts.component';
import { PostDetailsComponent } from './Front/GestionForumPost/Posts/post-details/post-details.component';
import { AnalyticsDashboardComponent } from './Back/GestionForumPost/analytics-dashboard/analytics-dashboard.component';

import { SuccessComponent } from './Front/GestionProduit/success/success.component';

import { ParticipantsListComponent } from './Back/GestionFormation/Formation/participants-list/participants-list.component';
import { ApprooveCourseComponent } from './Back/GestionFormation/Formation/approove-course/approove-course.component';
import { ContentListComponent } from './Front/GestionFormations/CourseContent/content-list/content-list.component';
import { AddContentComponent } from './Front/GestionFormations/CourseContent/add-content/add-content.component';
import { ListContentStudentComponent } from './Front/GestionFormations/Formation/list-content-student/list-content-student.component';

import { CertificateComponent } from './Front/GestionQuizz/quiz/certificate/certificate.component';
import { UserProductSpaceComponent } from './Front/GestionProduit/user-product-space/user-product-space.component';

import { AllReclamationsComponent } from './Back/GestionReclamation/Reclamation/all-reclamations/all-reclamations.component';
import { HelpComponent } from './Front/GestionReclamation/help/help.component';
import { AllReclamationReplyComponent } from './Back/GestionReclamation/ReclamationReply/all-reclamation-reply/all-reclamation-reply.component';

const routes: Routes = [
  //canActivate: [AdminGuard] to lock for admin
  //canActivate: [UserGuard] to lock for user
  // Back Office

  { path: 'backpost', component: ListpostComponent, canActivate: [AdminGuard] },

  { path: 'backpost', component: ListpostComponent, canActivate: [AdminGuard] },

  {
    path: 'backCommentpost',
    component: AllCommentsComponent,
    canActivate: [AdminGuard],
  },
  { path: 'analytics-dashboard', component: AnalyticsDashboardComponent },

  { path: 'back', component: MainBackComponent, canActivate: [AdminGuard] },

  //**************Back Gestion Users********************************
  {
    path: 'backusers',
    component: AllUsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'backuserdetail/:id',
    component: UserBackDetailsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'backbadges',
    component: AllbadgesComponent,
    canActivate: [AdminGuard],
  },
  /***************************************************************/

  //**************Back Gestion Events********************************

  {
    path: 'backEvents',
    component: AllEventsComponent,
    canActivate: [AdminGuard],
  },

  /***************************************************************/

  //**************Back Gestion Produit********************************
  {
    path: 'backproducts',
    component: AllProductsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'backcarts',
    component: AllCartsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'backreviews',
    component: AllReviewsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'backimagesP',
    component: AllImagesComponent,
    canActivate: [AdminGuard],
  },

  /********************Back Gestion Formations****************************************/
  { path: 'categories', component: CategoriesComponent },
  {
    path: 'backcourses',
    component: FormationsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'backcoursescat',
    component: CousesByCategoryComponent,
    canActivate: [AdminGuard],
  },
  { path: 'coursescat', component: CoursesByCatFrontComponent },
  { path: 'userCourseSpace', component: UserCourseSpaceComponent },
  { path: 'participantsList', component: ParticipantsListComponent },
  { path: 'approveCourse', component: ApprooveCourseComponent },
  { path: 'ContentList', component: ContentListComponent },
  { path: 'courses/:id/contents/add', component: AddContentComponent },
  { path: 'sudentsContent', component: ListContentStudentComponent },

  {
    path: 'backcartProducts',
    component: AllCartProductsComponent,
    canActivate: [AdminGuard],
  },
  /***************************************************************/

  // Front Office

  {
    path: 'quiz/:quizId',
    component: FrontQuizComponent,
  },
  { path: 'certificate', component: CertificateComponent },

  // Add this if you need a direct participation link
  { path: 'quiz/:quizId/:participationId', component: FrontQuizComponent },
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
  { path: 'my-products', component: UserProductSpaceComponent },

  {
    path: 'productD/:idProduct',
    component: ProductDetailsComponent /*, canActivate: [UserGuard]*/,
  },
  { path: 'success', component: SuccessComponent },
  ///////////////////////////////////////////////////////////////
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

  // Gestion des événements Front
  { path: 'events', component: ShowEventsComponent, canActivate: [UserGuard] },
  {
    path: 'events/:id',
    component: EventDetailsComponent,
    canActivate: [UserGuard],
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
  //Reclamation
  { path: 'reclamationback', component: AllReclamationsComponent },
  { path: 'help', component: HelpComponent },
  { path: 'reclamationreplyback/:id', component: AllReclamationReplyComponent },
  { path: 'accessdenied', component: ContactComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
