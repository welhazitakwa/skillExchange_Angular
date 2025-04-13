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
  emojiCount(emoji: string): number {
    if (!this.post?.emojiPosts) return 0;
    return this.post.emojiPosts.filter(e => e.emoji === emoji).length;
  }

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

  emojis: string[] = ['LIKE', 'LOVE',
    'LAUGH',
    'WOW',
    'SAD',
    'ANGRY'];
  emojiCounts: { [emoji: string]: number } = {};

  loadEmojiCounts() {
    if (!this.postId) return;

    this.emojiPostsService.getEmojiCounts(this.postId).subscribe(
      counts => this.emojiCounts = counts,
      error => console.error("Erreur lors du chargement des emojis", error)
    );
  }

//   reactToPost(emoji: string) {

//     if (!this.post || !this.currentUser) {

//       alert("Vous devez être connecté pour réagir.");
//       return;
//     }
//     if (!this.post.idPost)
//       return
//     const reaction = {
//       emoji: emoji,
//       postId: this.post.idPost,
//       userId: this.currentUser.id,
//     };
// // console.log(reaction);
// // return;
//     this.emojiPostsService.addReaction(reaction).subscribe(
//       () => this.loadEmojiCounts(),
//       error => console.error("Erreur lors de l'ajout d'une réaction", error)
//     );
//   }
///nour///
// reactToPost(selectedEmoji: string): void {
//   if (this.currentUser?.email && this.post?.idPost) {
//     // Assurer que selectedEmoji est de type EmojiType
//     const emoji: EmojiType = EmojiType[selectedEmoji as keyof typeof EmojiType];

//     const reaction = {
//       postId: this.post.idPost,  // Utilise l'id du post (numérique)
//       email: this.currentUser.email,  // Utilise l'email de l'utilisateur
//       emoji: emoji.toString() // Appelle toString pour obtenir une chaîne
//     };

//     this.emojiPostsService.addReaction(reaction).subscribe(
//       (response) => {
//         // Mettre à jour l'affichage ou effectuer d'autres actions
//         console.log('Réaction ajoutée avec succès:', response);
//       },
//       (error) => {
//         console.error('Erreur lors de l’ajout de la réaction', error);
//       }
//     );
//   } else {
//     alert('Vous devez être connecté pour réagir.');
//   }
// }
reactToPost(selectedEmoji: string): void {
  if (this.currentUser?.email && this.post?.idPost) {
    console.log('Emoji sélectionné:', selectedEmoji);  // Voir l'emoji sélectionné

    // Vérifier si l'emoji sélectionné est valide
    if (!(selectedEmoji in EmojiType)) {
      console.error('Emoji sélectionné non valide');
      alert('Emoji sélectionné non valide');
      return;  // Arrêter la fonction si l'emoji n'est pas valide
    }

    // Convertir l'emoji en valeur correspondante dans l'énumération EmojiType
    const emoji: EmojiType = EmojiType[selectedEmoji as keyof typeof EmojiType];
    console.log('Emoji validé:', emoji);  // Afficher l'emoji validé

    // Mappage de l'emoji validé vers l'emoji backend
    const mappedEmoji = EmojiTypeMapping[emoji];
    console.log('Emoji mappé pour le backend:', mappedEmoji);  // Afficher l'emoji mappé

    // Créer l'objet de réaction pour l'envoi
    const reaction = {
      postId: this.post.idPost,
      email: this.currentUser.email,
      emoji: mappedEmoji
    };

    // Appel au service pour ajouter la réaction
    this.emojiPostsService.addReaction(reaction).subscribe(
      (response) => {
        console.log('Réaction ajoutée avec succès:', response);
      },
      (error) => {
        console.error('Erreur lors de l’ajout de la réaction:', error);
      }
    );
  } else {
    alert('Vous devez être connecté pour réagir.');
  }
}





}
