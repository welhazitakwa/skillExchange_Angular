import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentPosts } from 'src/app/core/models/GestionForumPost/CommentPosts';
import { EmojiPosts } from 'src/app/core/models/GestionForumPost/EmojiPosts';
import { EmojiType, EmojiTypeMapping } from 'src/app/core/models/GestionForumPost/EmojiType';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { CommentPostsService } from 'src/app/core/services/GestionForumPost/comment-posts.service';
import { EmojiCommentsService } from 'src/app/core/services/GestionForumPost/emoji-comments.service';
import { EmojiPostsService } from 'src/app/core/services/GestionForumPost/emoji-posts.service';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

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
  selectedImage: File | null = null;
  currentImageIndexes: { [key: number]: number } = {}; 


  constructor(
    private postService: PostService,
    private commentService: CommentPostsService,
    private authService: AuthService,
    private userService: UserService,
    private emojiPostsService: EmojiPostsService,
    private route: ActivatedRoute,
    private router: Router,
    private emojiCommentsService:EmojiCommentsService
  ) { }

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.getPostDetails();
    this.loadCurrentUser();
    this.getComments();
    this.loadEmojiCounts();
    this.loadEmojiCountsForComments();
    
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

  currentImageIndex(post: Posts): number {
    return post.idPost !== undefined ? this.currentImageIndexes[post.idPost] || 0 : 0;
    console.log("llliiissssssssstttttttttt : "+ this.currentImageIndexes)
  }

    
  
  // emojiCount(emoji: string): number {
  //   if (!this.post?.emojiPosts) return 0;
  //   return this.post.emojiPosts.filter(e => e.emoji === emoji).length;
  // }

  getPostDetails(): void {
    this.postService.getPostByID(this.postId).subscribe(
      (post: Posts) => {
        this.post = post;
        console.log(post);
      },
      (error) => {
        console.error('Error fetching post details', error);
      }
    );
  }
  // currentImageIndex(post: Posts): number {
  //   // S'assurer que l'index existe avant de l'utiliser
  //   //return post.idPost !== undefined ? this.currentImageIndexes[post.idPost] || 0 : 0;
    
  //     return post.idPost !== undefined ? this.currentImageIndexes[post.idPost] ?? 0 : 0;
  //   }
  // currentImageIndex(post: Posts): number {
  //   // Vérifie si l'ID du post est défini et renvoie l'index pour ce post
  //   return post.idPost !== undefined ? this.currentImageIndexes[post.idPost] || 0 : 0;

  // }
    getImageSrc(post?: Posts): string | null {
      if (!post?.imagePost || post.imagePost.length === 0) {
        return null;
      }
    
      const index = this.currentImageIndex(post); // Ici post est garanti non undefined
      const imageObj = post.imagePost[index];
      return imageObj?.image ? 'data:image/jpeg;base64,' + imageObj.image : null;
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

  
 // Fonction pour parser une chaîne de date
 getComments(): void {
  this.commentService.getCommentsByPost(this.postId).subscribe(
    (comments) => {
      console.log("RAW created_at:", comments.map(c => typeof c.createdAt)); // Affiche avant la conversion

      this.comments = comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt ? new Date(comment.createdAt) : null,
    updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : null,
      })
    );

      console.log("AFTER PARSE:", this.comments.map(c => c.createdAt)); // Affiche après la conversion
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

  addComment(): void {
    if (this.currentUser && this.post) {
      // const commentToSend: CommentPosts = {
      //   idComment: 0,
        
      //   content: this.newComment.content,
      //   email: this.currentUser.email,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      //   post_id_post: this.post,
      //   emojiComments: []
      // };
      const commentToSend = new CommentPosts();
      commentToSend.content = this.newComment.content;
      commentToSend.email = this.currentUser.email;
      this.commentService.addComment(commentToSend, this.post.idPost!).subscribe(
        () => {
          this.showCommentModalOpen = false;
          this.newComment.content = '';
          this.getComments();
        },
        (error) => {
          console.error('Error adding comment', error);
        }
      );
    } else {
      alert('You must be logged in to comment.');
    }
  }

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


usersByEmoji: { [emoji: string]: User[] } = {};

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

hoveredEmojiComment: string | null = null;

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







 

}




