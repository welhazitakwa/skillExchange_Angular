import { Component, OnInit } from '@angular/core';
import { ImagePosts } from 'src/app/core/models/GestionForumPost/image-posts';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';
import { PageEvent } from '@angular/material/paginator'; // ✅ Ajout important
import { User } from 'src/app/core/models/GestionUser/User';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { Router } from '@angular/router';
import { EmojiTypeMapping } from 'src/app/core/models/GestionForumPost/EmojiType';
import { MixPanelService } from 'src/app/core/services/GestionForumPost/mix-panel.service';

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.css']
})
export class ShowPostsComponent implements OnInit {
  posts: any[] = [];
  emojiTypeMapping = EmojiTypeMapping;
  emojiKeys = Object.keys(this.emojiTypeMapping) as (keyof typeof EmojiTypeMapping)[];

  totalItems = 0;
  page = 0;
  pageSize = 6;
  //emojiTypeMapping = ['👍', '❤️', '😂', '😢', '😮' ,'😡'];  // Liste des emojis à afficher

  newPost: Posts = new Posts();
  showPostModalOpen = false;
  selectedFiles: File[] = [];
  currentUser: User | null = null;
  selectedImages: string[] = [];
  imagesPreviews: any[] = [];  // ✅ Typé correctement comme tableau

  constructor(private postService: PostService,  private router: Router, private authService: AuthService,
    private userService: UserService, private mixPanelService: MixPanelService ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.emojiKeys = Object.keys(this.emojiTypeMapping) as (keyof typeof EmojiTypeMapping)[];
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

  navigateImage(post: Posts, direction: 'prev' | 'next'): void {
    if (post.imagePost?.length && post.idPost !== undefined) {
      let currentIndex = this.currentImageIndexes[post.idPost] || 0;
      let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex < 0) {
        newIndex = post.imagePost.length - 1;
      } else if (newIndex >= post.imagePost.length) {
        newIndex = 0;
      }

      this.currentImageIndexes[post.idPost] = newIndex;
    }
  }

  currentImageIndex(post: Posts): number {
    return post.idPost !== undefined ? this.currentImageIndexes[post.idPost] || 0 : 0;
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex; 
    this.pageSize = event.pageSize;  
    this.loadPosts(); 
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
  
        this.newPost.user = this.currentUser;
  
        this.postService.addPost(this.newPost).subscribe(() => {
          this.mixPanelService.trackEvent('Ajout de Post', {
            title: this.newPost.title,
            userEmail: this.currentUser?.email,
            date: new Date().toISOString()
          });
          alert('✅ Votre post a été soumis et sera visible après validation par un administrateur.');
          this.showPostModalOpen = false;
          this.newPost = new Posts();
          this.selectedFiles = [];
          this.imagesPreviews = [];
          this.page = 0; 
          this.loadPosts(); 
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
      [post.imagePost[0], post.imagePost[index]] = [post.imagePost[index], post.imagePost[0]];
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
        this.loadPosts(); 
      });
    }
  }


  getEmojiCounts(post: Posts): { [emoji: string]: number } {
    const counts: { [emoji: string]: number } = {};
  
    for (const emoji of this.emojiKeys) {
      counts[emoji] = post.emojiPosts?.filter(e => e.emoji === this.emojiTypeMapping[emoji]).length || 0;
    }
  
    return counts;
  }
  
}
