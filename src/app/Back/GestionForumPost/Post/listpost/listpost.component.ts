import { Component, OnInit } from '@angular/core';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';

@Component({
  selector: 'app-listpost',
  templateUrl: './listpost.component.html',
  styleUrls: ['./listpost.component.css']
})
export class ListpostComponent implements OnInit {

  listPosts: Posts[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(
      (data) => {
        this.listPosts = data;
        console.log(this.listPosts)
      },
      (error) => {
        console.log(error);
      }
    )

  }

}
