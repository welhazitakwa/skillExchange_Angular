import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent {
  postId!: number; 
  post: Posts | undefined;
   constructor(
      private postService: PostService,
     
      private route: ActivatedRoute,
     
      
    ) {}
  ngOnInit(): void {
    
    this.postId =Number(this.route.snapshot.paramMap.get('id')) ; 
    this.getProductDetails();
  }
  getProductDetails(): void {
    this. postService.getPostByID(this.postId).subscribe(
      (post) => {
        this.post = post;
      },
      (error) => {
        console.error('Error fetching product details', error);
      }
    );
  }

}
