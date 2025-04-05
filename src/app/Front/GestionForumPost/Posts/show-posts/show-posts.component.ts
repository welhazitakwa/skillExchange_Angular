import { Component } from '@angular/core';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.css']
})
export class ShowPostsComponent {

  posts: Posts[] = [];

  constructor(private postService: PostService) { }

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
}
