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
  

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;  // L'indice de la page sélectionnée
    this.pageSize = event.pageSize;  // La taille de la page sélectionnée
    this.loadPosts();  // Recharge les posts en fonction de la nouvelle page et taille
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
  
        this.newPost.imagePosts = imageProducts.map(imageData => {
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
