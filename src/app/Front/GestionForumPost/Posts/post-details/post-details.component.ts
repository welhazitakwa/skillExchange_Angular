import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentPosts } from 'src/app/core/models/GestionForumPost/CommentPosts';
import { EmojiPosts } from 'src/app/core/models/GestionForumPost/EmojiPosts';
import { EmojiType, EmojiTypeMapping } from 'src/app/core/models/GestionForumPost/EmojiType';
import { ImagePosts } from 'src/app/core/models/GestionForumPost/image-posts';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { CommentPostsService } from 'src/app/core/services/GestionForumPost/comment-posts.service';
import { EmojiCommentsService } from 'src/app/core/services/GestionForumPost/emoji-comments.service';
import { EmojiPostsService } from 'src/app/core/services/GestionForumPost/emoji-posts.service';
import { ImagePostService } from 'src/app/core/services/GestionForumPost/image-post.service';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { MailService } from 'src/app/core/services/Mailing/mail.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent {
  postId!: number;
  post: Posts | undefined;
  comments: CommentPosts[] = [];
  newComment: CommentPosts = new CommentPosts();
  showCommentModalOpen: boolean = false;
  showPostModalOpen: boolean = false;
  newPost: Posts = new Posts();
  currentUser: User | null = null;
  usersMap: { [key: string]: User } = {};
  //selectedImage: File | null = null;
  currentImageIndexes: { [key: number]: number } = {}; 
  hoveredEmojiComment: string | null = null;
  usersByEmoji: { [emoji: string]: User[] } = {};

  showMenu: boolean = false;
  editImagesPreviews: any[] = [];



  constructor(
    private postService: PostService,
    private commentService: CommentPostsService,
    private authService: AuthService,
    private userService: UserService,
    private emojiPostsService: EmojiPostsService,
    private route: ActivatedRoute,
    private router: Router,
    private emojiCommentsService:EmojiCommentsService,
    private mailService: MailService,
    private imagePostService: ImagePostService

  ) { }

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.getPostDetails();
    this.loadCurrentUser();
    this.getComments();
    this.loadEmojiCounts();
    this.loadEmojiCountsForComments();
    this.getAllUsers();
    
    if (!this.post?.imagePost) {
      console.log('Le post ou imagePost est undefined');
      return;
    }

    // Si le post existe et contient imagePost, assure-toi qu'il est bien rempli
    if (this.post.imagePost.length === 0) {
      console.log('Aucune image dans imagePost');
      return;
    }

    console.log('post et imagePost initialisés');
    console.log("llliiissssssssstttttttttt : "+ this.currentImageIndexes)
    

  }

  // currentImageIndex(post: Posts): number {
  //   return post.idPost !== undefined ? this.currentImageIndexes[post.idPost] || 0 : 0;
    
  // }

    
  
  // emojiCount(emoji: string): number {
  //   if (!this.post?.emojiPosts) return 0;
  //   return this.post.emojiPosts.filter(e => e.emoji === emoji).length;
  // }

  getPostDetails(): void {
    this.postService.getPostByID(this.postId).subscribe(
      (post: Posts) => {
        this.post = post;
        this.editImagesPreviews = post?.imagePost || [];
        console.log(post);
      },
      (error) => {
        console.error('Error fetching post details', error);
      }
    );
  }
  
  
  //   getImageSrc(post?: Posts): string | null {
  //     if (!post?.imagePost || post.imagePost.length === 0) {
  //       return null;
  //     }
    
  //     const index = this.currentImageIndex(post); // Ici post est garanti non undefined
  //     const imageObj = post.imagePost[index];
  //     return imageObj?.image ? 'data:image/jpeg;base64,' + imageObj.image : null;
  //   }
    
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
  getImageSrc(post?: Posts): string | null {
    if (!post || !post.imagePost || post.imagePost.length === 0) {
      return null;
    }
  
    const index = this.currentImageIndex(post); // Here, post is guaranteed to be non-null/undefined
    const imageObj = post.imagePost[index];
    return imageObj?.image ? 'data:image/jpeg;base64,' + imageObj.image : null;
  }
  
  currentImageIndex(post: Posts): number {
    if (!post || !post.idPost) {
      return 0;  // or a fallback value
    }
    return this.currentImageIndexes[post.idPost] || 0;
  }

  
 // Fonction pour parser une chaîne de date
 getComments(): void {
  this.commentService.getCommentsByPost(this.postId).subscribe(
    (comments) => {
      console.log("RAW comments:", comments); // Affiche les commentaires avant transformation

      // Sécuriser la transformation des dates
      this.comments = comments.map(comment => {
        if (comment.createdAt && comment.updatedAt) {
          return {
            ...comment,
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt),
          };
        } else {
          return { ...comment, createdAt: null, updatedAt: null }; // Assurer que createdAt et updatedAt sont null si non valides
        }
      });

      console.log("Transformed comments:", this.comments); // Vérifie après transformation
      this.loadUserDetails();
      this.loadEmojiCountsForComments();
    },
    (error) => {
      console.error('Error fetching comments', error);
    }
  );
}





isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}




  
  
  
  
  

  loadUserDetails(): void {
    this.comments.forEach(comment => {
      if (comment.email && !this.usersMap[comment.email]) {
        this.userService.getUserByEmail(comment.email).subscribe(
          (user: User) => {
            this.usersMap[comment.email] = user;
          },
          (error) => {
            console.error(`Error fetching user ${comment.email}`, error);
          }
        );
      }
    });
  }


  
  
  notifyMentionedUsers(mentionedNames: string[]): void {
    mentionedNames.forEach(name => {
      this.userService.getUserByName(name).subscribe(user => {
        if (user && this.post?.idPost) {
          const subject = 'Vous avez été mentionné dans un commentaire';
          const text = `Bonjour ${user.name},\n\nVous avez été mentionné dans un commentaire sur le post n°${this.post.idPost}.\n\nConnectez-vous pour le consulter.`;
  
          this.mailService.sendEmail(user.email, subject, text).subscribe(() => {
            console.log(`Email de mention envoyé à ${user.email}`);
          });
        }
      });
    });
  }
  ///////////////////////////////////////////////
  filteredUsers: any[] = []; // Liste des utilisateurs filtrés
  allUsers: any[] = []; // Liste de tous les utilisateurs
  getAllUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.allUsers = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }
  // Fonction appelée lors de chaque saisie dans la zone de texte
 
  
  onInputChange(event: any): void {
    const inputText = event.target.value;
    console.log('Texte du commentaire:', inputText);  // Vérifier ce que l'utilisateur tape
  
    // Trouver la mention
    const mentionMatch = inputText.match(/@(\w*)/);
    
    if (mentionMatch && mentionMatch[1]) {
      const searchTerm = mentionMatch[1].toLowerCase();  // Prendre la première lettre
  
      if (searchTerm === 'everyone') {
        console.log('Mention @everyone détectée');
        // Si c'est @everyone, récupérer tous les utilisateurs
        this.userService.getEveryoneUsers().subscribe(users => {
          console.log('Utilisateurs récupérés pour @everyone:', users);
          this.filteredUsers = users;
        });
      } else {
        // Filtrer les utilisateurs en fonction de la première lettre
        this.filteredUsers = this.allUsers.filter(user =>
          user.name.toLowerCase().startsWith(searchTerm)  // Recherche par la première lettre
        );
      }
    } else {
      // Si aucun @ n'est trouvé ou si aucune lettre n'est saisie après le @
      this.filteredUsers = [];
    }
  }
  

  
  
   // Fonction appelée lorsque l'utilisateur sélectionne un utilisateur à mentionner
   mentionUser(user: any): void {
    const inputText = this.newComment.content || '';
    const mentionMatch = inputText.match(/@(\w*)/);
    if (mentionMatch) {
      this.newComment.content = inputText.replace(mentionMatch[0], `@${user.name} `);
    }

    // Ajouter la classe selected pour marquer l'utilisateur sélectionné
    this.filteredUsers.forEach(u => u.selected = false);  // Réinitialiser la sélection précédente
    user.selected = true;  // Sélectionner l'utilisateur actuel

    this.filteredUsers = []; // Vider la liste filtrée après la sélection
}

  
  addComment(): void {
    if (this.currentUser && this.post) {
      const content = this.newComment.content;
      const mentionedNames = this.extractMentions(content ?? ''); // Gérer les mentions
  
      // Créer un objet CommentPosts
      const commentToSend = new CommentPosts();
      commentToSend.content = content;
      commentToSend.email = this.currentUser.email;
      commentToSend.post_id_post = this.post; // Assurer que le post est bien lié
      commentToSend.email = this.currentUser.email; // Ajout de l'ID de l'utilisateur
  
      // Appel à l'API pour ajouter le commentaire
      this.commentService.addComment(commentToSend, this.post.idPost!).subscribe(
        (response) => {
          console.log('Comment added successfully:', response);
  
          // Réinitialiser le champ de texte du commentaire et fermer la fenêtre modale
          this.newComment.content = '';
          this.showCommentModalOpen = false;
  
          // Rafraîchir la liste des commentaires pour afficher le nouveau
          this.getComments();
  
          // Notifier les utilisateurs mentionnés
          this.notifyMentionedUsers(mentionedNames);
        },
        (error) => {
          console.error('Error adding comment', error);
          alert('An error occurred while adding the comment. Please try again.');
        }
      );
    } else {
      alert('You must be logged in to comment.');
    }
  }
  //
  extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const matches = content.matchAll(mentionRegex);
    const mentionedNames: string[] = [];
  
    for (const match of matches) {  
      if (match[1]) {
        mentionedNames.push(match[1]);
      }
    }
  
    return mentionedNames;
  }
  
  
//////////////////////////////////////////////////////////
  deleteComment(commentId: number): void {
    if (!commentId) return;

    if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
      this.commentService.deleteComment(commentId).subscribe(
        () => {
          this.getComments();
        },
        (error) => {
          console.error('Erreur lors de la suppression du commentaire', error);
        }
      );
    }
  }

  

  addPost(): void {
    if (this.currentUser) {
      const postToSend: Posts = new Posts();

      this.postService.addPost(postToSend as Posts).subscribe(
        () => {
          this.showPostModalOpen = false;
          this.newPost = new Posts();
          this.getPostDetails();
        },
        (error) => {
          console.error('Erreur lors de l’ajout du post', error);
        }
      );
    } else {
      alert('Vous devez être connecté pour publier un post.');
    }
  }
  
  selectedFiles: File[] = [];

openEditPostModal() {
  this.showPostModalOpen = true;
}
onEditPostClicked(event: MouseEvent) {
  event.stopPropagation(); // Empêche la fermeture du menu
  if (!this.post) {
    console.error('Le post est indéfini');
    return; // Si le post est indéfini, on ne fait rien
  }
  console.log('Modifier cliqué', this.post);

  // Charge le post à éditer
  this.editingPost = { ...this.post }; // Copie le post pour pouvoir le modifier
  this.editImagesPreviews = this.post?.imagePost|| []; // Si le post contient des images, les afficher

  this.openEditPostModal(); // Ouvre le modal de modification
}

onFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    this.selectedFiles = Array.from(input.files);
  }
}
/////////////////////////////////////////////////
editingPost?: Posts; 
//editImagesPreviews: any;
imagesToDelete: number[] = [];


onImageSelected(event: any) {
  const files: FileList = event.target.files;
  this.selectedImage = Array.from(files); // ✅ convertit en tableau
}
selectedImage: File[] = [];


fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]; // enlever "data:image/jpeg;base64,"
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}
async prepareImages(): Promise<string[]> {
  return Promise.all(this.selectedImage.map(file => this.fileToBase64(file)));
}

async submitEditPost() {
  if (!this.editingPost) return;

  const base64Images = await this.prepareImages(); // conversion ici

  const newImages: ImagePosts[] = base64Images.map(base64 => ({
    id: 0,
    image: base64,
    post: this.editingPost! // ← ici, le "!" règle l'erreur
  }));
  

  const postToUpdate = {
    ...this.editingPost,
    imagePost: [
      ...this.editingPost.imagePost,
      ...newImages
    ]
  };

  this.postService.updatePostWithFormData(this.editingPost.idPost!, postToUpdate)
    .subscribe({
      next: (updatedPost) => {
        this.editingPost = updatedPost;
        console.log('✅ Post mis à jour', updatedPost);
        console.log('🖼️ Images mises à jour:', updatedPost.imagePost); //
this.editImagesPreviews = updatedPost.imagePost; // Très important !!

       
        this.afterPostUpdate();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la mise à jour du post', err);
      }
    });
}




private resetEditForm(): void {
  this.editImagesPreviews = [];
  this.selectedFiles = [];
  this.imagesToDelete = [];
}
private afterPostUpdate() {
  this.getPostDetails(); // ou refresh
  this.resetEditForm();
  this.showPostModalOpen = false;
  this.imagesToDelete = [];
  Swal.fire({
    icon: 'success',
    title: 'Post updated!',
    showConfirmButton: false,
    timer: 1500
  });
}
toggleMenu() {
  this.showMenu = !this.showMenu;
  console.log('showMenu:', this.showMenu); 
}

deletePost(id: number| undefined): void {
  if (id == null) {
    console.warn('Id du post non valide');
    return; // Si l'id est null ou undefined, on arrête l'exécution de la méthode
  }

  if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
    this.postService.deletePost(id).subscribe(() => {
      this.getPostDetails(); // Recharge les détails du post après suppression
    });
  }
}






////////////////Emojis/////////////////////////
EmojiTypeMapping = EmojiTypeMapping;
  
emojis: EmojiType[] = [
  EmojiType.Like,
  EmojiType.Love,
  EmojiType.Laugh,
  EmojiType.Wow,
  EmojiType.Sad,
  EmojiType.Angry
  
];
  emojiCounts: { [emoji: string]: number } = {};


  loadEmojiCounts() {
    if (!this.postId) return;
  
    this.emojiPostsService.getEmojiCounts(this.postId).subscribe(
      (counts) => {
        console.log('Counts:', counts);  // Vérifie la réponse ici
        this.emojiCounts = counts;
      },
      (error) => console.error('Erreur lors du chargement des emojis', error)
    );
  }
  getEmojiColor(emoji: string): string {
    switch (EmojiTypeMapping[emoji as EmojiType]) {
      case 'LIKE': return '#0d6efd';     // Bleu
      case 'LOVE': return '#dc3545';     // Rouge
      case 'LAUGH': return '#ffc107';    // Jaune
      case 'WOW': return '#6610f2';      // Violet
      case 'SAD': return '#6c757d';      // Gris
      case 'ANGRY': return '#fd7e14';    // Orange
      default: return '#6c757d';
    }
  }
  



////emoji+User///

reactToPost(selectedEmoji: string): void {
  const mappedEmoji = EmojiTypeMapping[selectedEmoji as EmojiType];

  if (!mappedEmoji) {
    console.error('Emoji non valide');
    return;
  }

  const postId = this.post?.idPost;
  const email = this.currentUser?.email;

  if (!postId || !email) {
    alert("L'utilisateur ou le post est introuvable.");
    return;
  }

  this.emojiPostsService.hasUserReactedWithEmoji(postId, email, mappedEmoji)
    .subscribe((hasReacted: boolean) => {
      if (hasReacted) {
        
        this.emojiPostsService.removeReaction(postId, email, mappedEmoji).subscribe(
          () => {
            console.log('Réaction supprimée');
            this.getPostDetails();
            this.loadEmojiCounts();
          },
          (error) => {
            console.error('Erreur suppression réaction :', error);
          }
        );
      } else {
        // Ajouter une nouvelle réaction
        const reaction = {
          postId,
          email,
          emoji: mappedEmoji
        };

        this.emojiPostsService.addReaction(reaction).subscribe(
          () => {
            console.log('Réaction ajoutée');
            this.getPostDetails();
            this.loadEmojiCounts();
          },
          (error) => {
            console.error('Erreur ajout réaction :', error);
          }
        );
      }
    });
}



getUsersByEmoji(emoji: string): void {
  const emojiKey = EmojiTypeMapping[emoji as keyof typeof EmojiTypeMapping];
  if (!emojiKey) return;

  this.emojiPostsService.getUsersByEmojiAndPostId(this.postId, emojiKey)
    .subscribe({
      next: (users) => {
        this.usersByEmoji[emoji] = users;
      },
      error: (err) => {
        console.error('Erreur récupération users emoji:', err);
      }
    });
}
hoveredEmoji: string | null = null;
 // Méthode pour afficher ou masquer les utilisateurs au survol
 onEmojiHover(emoji: string): void {
  this.hoveredEmoji = emoji;
  this.getUsersByEmoji(emoji);  // Charger les utilisateurs pour cet emoji
}

// Méthode pour masquer la liste des utilisateurs
onEmojiLeave(): void {
  this.hoveredEmoji = null;
}

 // Afficher les utilisateurs au survol de l'emoji




////////////////////////////EMOJICOMMENT//////////////
// Fonction pour réagir à un commentaire avec un emoji

reactToComment(selectedEmoji: string, comment: CommentPosts): void {
  const mappedEmoji = EmojiTypeMapping[selectedEmoji as EmojiType];

  if (!mappedEmoji) {
    console.error('Emoji non valide');
    return;
  }

  const commentId = comment.idComment;
  const email = this.currentUser?.email;
  console.log('DEBUG ➤ commentId:', commentId, 'email:', email);
  
  if (!commentId || !email) {
    alert("L'utilisateur ou le commentaire est introuvable.");
    return;
  }

  this.emojiCommentsService.hasUserReactedWithEmojiForComment(commentId, email, mappedEmoji)
    .subscribe((hasReacted: boolean) => {
      if (hasReacted) {
        // Supprimer la réaction existante
        this.emojiCommentsService.removeReactionFromComment(commentId, email, mappedEmoji).subscribe(
          () => {
            console.log('Réaction supprimée');
            this.getComments();  // Recharger les commentaires
           
            this.loadEmojiCountsForComments();  // Mettre à jour les comptages d'emoji
          },
          (error) => {
            console.error('Erreur suppression réaction :', error);
          }
        );
      } else {
        // Ajouter une nouvelle réaction
        const reaction = {
          commentId,
          email,
          emoji: mappedEmoji
        };

        this.emojiCommentsService.addReactionToComment(reaction).subscribe(
          () => {
            console.log('Réaction ajoutée');
            this.getComments();  // Recharger les commentaires
     
            this.loadEmojiCountsForComments();  // Mettre à jour les comptages d'emoji
          },
          (error) => {
            console.error('Erreur ajout réaction :', error);
          }
        );
      }
    });
}

usersByEmojiForComment: { [emoji: string]: User[] } = {};


// Fonction pour récupérer les utilisateurs ayant réagi avec un emoji sur un commentaire
getUsersByEmojiForComment(emoji: string, commentId: number): void {
  const emojiKey = EmojiTypeMapping[emoji as keyof typeof EmojiTypeMapping];
  if (!emojiKey) return;

  this.emojiCommentsService.getUsersByEmojiAndCommentId(commentId, emojiKey)
    .subscribe({
      next: (users) => {
        this.usersByEmojiForComment[emoji] = users;
      },
      error: (err) => {
        console.error('Erreur récupération users emoji commentaire:', err);
      }
    });
}


// Afficher ou masquer la liste des utilisateurs réagissant à un emoji sur un commentaire
onEmojiHoverComment(emoji: string, commentId: number): void {
  this.hoveredEmojiComment = emoji;
  this.getUsersByEmojiForComment(emoji, commentId);  // Charger les utilisateurs pour cet emoji et ce commentaire
}

onEmojiLeaveComment(): void {
  this.hoveredEmojiComment = null;
}

emojiCountsForComment: { [commentId: number]: { [emoji: string]: number } } = {};

loadEmojiCountsForComments(): void {
  if (!this.comments) return;

  this.comments.forEach((comment) => {
    this.emojiCommentsService.getEmojiCountsForComment(comment.idComment).subscribe(
      (counts) => {
        this.emojiCountsForComment[comment.idComment] = counts;
      },
      (error) => {
        console.error(`Erreur lors du chargement des emojis pour le commentaire ${comment.idComment}`, error);
      }
    );
  });
}




getUserImage(email: string): string {
  const user = this.usersMap[email];
  if (user && user.image) {
    // Si l'image semble être en base64
    return user.image.startsWith('http') ? user.image : 'data:image/jpeg;base64,' + user.image;
  }
  return '/assets/assetsFront/img/user.jpg'; // fallback
}



 

}