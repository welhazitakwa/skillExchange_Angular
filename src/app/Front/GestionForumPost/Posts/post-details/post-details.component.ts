import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentPosts } from 'src/app/core/models/GestionForumPost/CommentPosts';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { CommentPostsService } from 'src/app/core/services/GestionForumPost/comment-posts.service';
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

  constructor(
    private postService: PostService,
    private commentService: CommentPostsService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.getPostDetails();
    this.loadCurrentUser();
    this.getComments();
  }

  getPostDetails(): void {
    this.postService.getPostByID(this.postId).subscribe(
      (post: Posts) => {
        this.post = post;
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
        id_comment: 0,
        content: this.newComment.content,
        email: this.currentUser.email,
        created_at: new Date(),
        updated_at: new Date(),
        post_id_post: this.post
      };

      this.commentService.addComment(commentToSend, this.post.idPost).subscribe(
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
      const postToSend: Posts = {
        idPost: 0,
        title: this.newPost.title,
        content: this.newPost.content,
        ImageP: this.newPost.ImageP || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        upVote: 0,
        downVote: 0,
        user: this.currentUser,
        emojiPosts: [],
        commentPosts: []
      };

      this.postService.addPost(postToSend).subscribe(
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
}
