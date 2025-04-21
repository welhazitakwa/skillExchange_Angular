import { Component, OnInit } from '@angular/core';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';

@Component({
  selector: 'app-listpost',
  templateUrl: './listpost.component.html',
  styleUrls: ['./listpost.component.css']
})
export class ListpostComponent implements OnInit {

  listPosts: Posts[] = [];  // Déclaration de la liste des posts
  approvedPosts: Posts[] = [];
  pendingPosts: Posts[] = [];
  
  constructor(private postService: PostService) { }

  ngOnInit(): void {
    // Récupérer tous les posts avec typage explicite pour éviter les erreurs
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe(
      (data: Posts[]) => {  // Typage explicite pour les posts
        // Séparer les posts approuvés et en attente
        this.approvedPosts = data.filter(post => post.approved === true);
        this.pendingPosts = data.filter(post => post.approved === false);
    
        console.log("Posts approuvés :", this.approvedPosts);
        console.log("Posts en attente :", this.pendingPosts);
      },
      (error: any) => {  // Typage explicite pour l'erreur
        console.log("Erreur lors de la récupération des posts : ", error);
      }
    );
  }

  approvePost(idPost: number | undefined): void {
    if (idPost !== undefined) {
      this.postService.approvePost(idPost).subscribe(
        (response: any) => {
          console.log("Post approuvé avec succès", response);
          if (response) {
            // Mettre à jour la liste des posts approuvés
            const postIndex = this.pendingPosts.findIndex(post => post.idPost === idPost);
            if (postIndex !== -1) {
              this.pendingPosts.splice(postIndex, 1);  // Retirer le post de la liste des en attente
              this.approvedPosts.push(response);  // Ajouter le post à la liste des approuvés
            }
          }
        },
        (error) => {
          console.error("Erreur lors de l'approbation du post", error);
        }
      );
    } else {
      console.error("idPost is undefined");
    }
  }
  
  
  rejectPost(idPost: number | undefined): void {
    if (idPost !== undefined) {
      this.postService.rejectPost(idPost).subscribe(
        (response) => {
          console.log("Post rejeté avec succès");
          // Mettre à jour la liste des posts
          const postIndex = this.pendingPosts.findIndex(post => post.idPost === idPost);
          if (postIndex !== -1) {
            this.pendingPosts.splice(postIndex, 1);  // Retirer le post de la liste des en attente
          }
        },
        (error) => {
          console.error("Erreur lors du rejet du post", error);
        }
      );
    } else {
      console.error("idPost is undefined");
    }
  }
  
  
  
  
}
