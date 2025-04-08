import { Component } from '@angular/core';
import { CommentPosts } from 'src/app/core/models/GestionForumPost/CommentPosts';
import { CommentPostsService } from 'src/app/core/services/GestionForumPost/comment-posts.service';

@Component({
  selector: 'app-all-comments',
  templateUrl: './all-comments.component.html',
  styleUrls: ['./all-comments.component.css']
})
export class AllCommentsComponent {
  listComment: CommentPosts[] = [];

  constructor(private commentpostServ: CommentPostsService) { }

  ngOnInit(): void {
    this.commentpostServ.getAllCommentPosts().subscribe(
      (data) => {
        this. listComment = data;
        console.log(this. listComment)
      },
      (error) => {
        console.log(error);
      }
    )

  }

}
