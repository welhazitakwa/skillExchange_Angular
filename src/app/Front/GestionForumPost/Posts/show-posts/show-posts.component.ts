import { Component, OnInit } from '@angular/core';
import { ImagePosts } from 'src/app/core/models/GestionForumPost/image-posts';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';
import { PageEvent } from '@angular/material/paginator'; // ✅ Ajout important
import { User } from 'src/app/core/models/GestionUser/User';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.css']
})
export class ShowPostsComponent implements OnInit {
  posts: any[] = [];
  totalItems = 0;
  page = 0;
  pageSize = 6;

  newPost: Posts = new Posts();
  showPostModalOpen = false;
  selectedFiles: File[] = [];
  currentUser: User | null=null;
  selectedImages: string[] = [];
  imagesPreviews: any[] = [];  // ✅ Typé correctement comme tableau

  constructor(private postService: PostService,  private router: Router, private authService: AuthService,
    private userService: UserService) {
   
  }

  ngOnInit(): void {
    this.loadPosts();
    this.loadCurrentUser();
    console.log('Utilisateur récupéré au ngOnInit :', this.currentUser);

  }
  
  loadPosts() {
    this.postService.showPosts(this.page, this.pageSize).subscribe(response => {
      this.posts = response.content;  // Liste des posts
      this.totalItems = response.totalElements;  // Nombre total de posts pour la pagination
    });
  }
  
  currentImageIndexes: { [key: number]: number } = {}; 
  // currentImageIndex(post: Posts): number {
  //   return post.imagePost?.length > 0 ? 0 : -1;
  // }

  // Fonction pour naviguer à travers les images (précédente ou suivante)
  // navigateImage(post: Posts, direction: 'prev' | 'next'): void {
  //   if (post.imagePost?.length) {
  //     const currentIndex = this.currentImageIndex(post);
  //     let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

  //     // Limiter l'index entre 0 et la longueur des images - 1
  //     if (newIndex < 0) {
  //       newIndex = post.imagePost.length - 1;  // Aller à la dernière image
  //     } else if (newIndex >= post.imagePost.length) {
  //       newIndex = 0;  // Revenir à la première image
  //     }

  //     // Mettre à jour l'image principale avec le nouvel index
  //     post.imagePost[0] = post.imagePost[newIndex];
  //   }
  // }
  navigateImage(post: Posts, direction: 'prev' | 'next'): void {
    if (post.imagePost?.length && post.idPost !== undefined) {
      // Récupérer l'index actuel de l'image du post
      let currentIndex = this.currentImageIndexes[post.idPost] || 0;

      // Calculer le nouvel index
      let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

      // Limiter l'index entre 0 et la longueur des images - 1
      if (newIndex < 0) {
        newIndex = post.imagePost.length - 1;  // Aller à la dernière image
      } else if (newIndex >= post.imagePost.length) {
        newIndex = 0;  // Revenir à la première image
      }

      // Mettre à jour l'index de l'image actuelle dans l'objet currentImageIndexes
      this.currentImageIndexes[post.idPost] = newIndex;
    }
  }
  // Fonction pour récupérer l'image actuelle d'un post
  currentImageIndex(post: Posts): number {
    // S'assurer que l'index existe avant de l'utiliser
    return post.idPost !== undefined ? this.currentImageIndexes[post.idPost] || 0 : 0;
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;  // L'indice de la page sélectionnée
    this.pageSize = event.pageSize;  // La taille de la page sélectionnée
    this.loadPosts();  // Recharge les posts en fonction de la nouvelle page et taille
  }
  
  transformStyle(post: any): string {
    return `translateX(-${post.currentSlide * 100}%)`;
  }

  moveSlide(post: any, direction: number): void {
    const totalSlides = post.imagePosts.length;
    post.currentSlide = (post.currentSlide + direction + totalSlides) % totalSlides;
  }

  async addPost() {
    if (!this.currentUser) {
      return alert('Utilisateur non connecté !');
    }
  
    if (this.newPost.title && this.newPost.content) {
      try {
        const imageProducts = await Promise.all(
          this.selectedFiles.map(async (file) => ({
            image: await this.getBase64WithoutPrefix(file),
          }))
        );
  
        this.newPost.imagePost = imageProducts.map(imageData => {
          const imagePost = new ImagePosts();
          imagePost.image = imageData.image;
          return imagePost;
        });
  
        // 🔥 Ajout de l'utilisateur courant
        this.newPost.user = this.currentUser;
  
        this.postService.addPost(this.newPost).subscribe(response => {
          this.posts.push(response);
          this.showPostModalOpen = false;
          this.newPost = new Posts();
        });
  
      } catch (error) {
        console.error('Erreur lors du traitement des images:', error);
        alert('Une erreur est survenue lors du traitement des images.');
      }
    } else {
      alert('Le titre et le contenu sont obligatoires!');
    }
  }
  

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        alert("Le fichier n'est pas une image valide (JPEG/PNG requis)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop volumineuse (5MB maximum)");
        return;
      }

      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagesPreviews.push({
          url: e.target.result,
          file: file
        });
      };
      reader.readAsDataURL(file);
    });
  }
  switchMainImage(post: Posts, index: number) {
    if (post.imagePost && post.imagePost.length > index) {
      // Échange la première image avec celle cliquée
      [post.imagePost[0], post.imagePost[index]] = 
      [post.imagePost[index], post.imagePost[0]];
    }
  }
  private async getBase64WithoutPrefix(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
  }
  private loadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user: User) => {
        this.currentUser = user;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  deletePost(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.postService.deletePost(id).subscribe(() => {
        this.loadPosts(); // recharge les posts
      });
    }
  }
  
}
