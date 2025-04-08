import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.css']
})
export class ShowPostsComponent {

  posts: Posts[] = [];
  newPost: Posts = new Posts();
  showPostModalOpen: boolean = false;
  currentUser: User | null = null;
    usersMap: { [key: string]: User } = {};
  constructor(private postService: PostService,  private authService: AuthService,private userService: UserService,
      private route: ActivatedRoute,
      private router: Router) { }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(
      (data) => {
        this.posts = data;
        console.log(this.posts)
      },
      (error) => {
        console.log(error);
      }
    )

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
  addPost(): void {
    const postToSend: Posts = {
      idPost: 3,
      title: this.newPost.title,
      content: this.newPost.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      upVote: 0,
      downVote: 0,
      user: { id: 1 }as User,  // ID statique de l'utilisateur
      emojiPosts: [],
      commentPosts: [],
      ImageP: ''
    };
  
    this.postService.addPost(postToSend).subscribe(
      () => {
        this.showPostModalOpen = false;
        this.newPost = new Posts();
      },
      (error) => {
        console.error('Erreur lors de l’ajout du post', error);
      }
    );
  }
  
    
    showModalPost = false;
    editingPost: Posts = {
      idPost: 0,
      title: '',
      content: '',
      ImageP: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      upVote: 0,
      downVote: 0,
      user: null,
      emojiPosts: [],
      commentPosts: []
    };
  
}
