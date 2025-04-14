import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentPosts } from 'src/app/core/models/GestionForumPost/CommentPosts';
import { EmojiPosts } from 'src/app/core/models/GestionForumPost/EmojiPosts';
import { EmojiType, EmojiTypeMapping } from 'src/app/core/models/GestionForumPost/EmojiType';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { CommentPostsService } from 'src/app/core/services/GestionForumPost/comment-posts.service';
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
 

  constructor(
    private postService: PostService,
    private commentService: CommentPostsService,
    private authService: AuthService,
    private userService: UserService,
    private emojiPostsService: EmojiPostsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.getPostDetails();
    this.loadCurrentUser();
    this.getComments();
    this.loadEmojiCounts();
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

 
  
  getComments(): void {
    this.commentService.getCommentsByPost(this.postId).subscribe(
      (comments) => {
        this.comments = comments.map(comment => ({
          ...comment,
          created_at: new Date(comment.created_at)
        }));
        console.log(comments)
        this.loadUserDetails();
      },
      (error) => {
        console.error('Error fetching comments', error);
      }
    );
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
      const commentToSend: CommentPosts = {
        idComment: 0,
        content: this.newComment.content,
        email: this.currentUser.email,
        created_at: new Date(),
        updated_at: new Date(),
        post_id_post: this.post
      };

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
  

// reactToPost(selectedEmoji: string): void {
//   if (this.currentUser?.email && this.post?.idPost) {
//     console.log('Emoji sélectionné:', selectedEmoji);

//     // Valider si c'est un emoji valide
//     if (!Object.values(EmojiType).includes(selectedEmoji as EmojiType)) {
//       console.error('Emoji sélectionné non valide');
//       alert('Emoji sélectionné non valide');
//       return;
//     }

//     // Mapper l'emoji sélectionné vers la valeur attendue par le backend
//     const mappedEmoji = EmojiTypeMapping[selectedEmoji as EmojiType];

//     const reaction = {
//       postId: this.post.idPost,
//       email: this.currentUser.email,
//       emoji: mappedEmoji // On envoie "WOW" ou "LIKE" ou autre, au lieu de "😮"
//     };

//     this.emojiPostsService.addReaction(reaction).subscribe(
//       () => {
//         console.log('Réaction ajoutée avec succès');
//         this.getPostDetails(); // Recharge le post pour afficher les emojis à jour
//         this.loadEmojiCounts(); // Met à jour le compteur
//       },
//       (error) => {
//         console.error('Erreur lors de l’ajout de la réaction', error);
//       }
//     );
//   } else {
//     alert('Vous devez être connecté pour réagir.');
//   }
// }

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
        // ✅ Sécurisé ici aussi
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
 

}




