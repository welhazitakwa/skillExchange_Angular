import { Component, OnInit } from '@angular/core';
import { Posts } from 'src/app/core/models/GestionForumPost/Posts';
import { PostService } from 'src/app/core/services/GestionForumPost/post.service';

@Component({
  selector: 'app-listpost',
  templateUrl: './listpost.component.html',
  styleUrls: ['./listpost.component.css']
})
export class ListpostComponent implements OnInit {

  // 📝 Deux listes : posts approuvés et en attente d’approbation
  approvedPosts: Posts[] = [];
  pendingPosts: Posts[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts(); // 🔄 Charger tous les posts dès le démarrage
  }

  // 📥 Charger tous les posts et les séparer selon le statut d'approbation
  loadPosts(): void {
    this.postService.getAllPosts().subscribe(
      (data: Posts[]) => {
        this.approvedPosts = data.filter(post => post.approved === true);
        this.pendingPosts = data.filter(post => post.approved === false);

        console.log("✅ Posts approuvés :", this.approvedPosts);
        console.log("⏳ Posts en attente :", this.pendingPosts);
      },
      (error: any) => {
        console.error(" Erreur lors de la récupération des posts :", error);
      }
    );
  }

  // ✅ Approbation d’un post
  approvePost(idPost: number | undefined): void {
    if (idPost !== undefined) {
      this.postService.approvePost(idPost).subscribe(
        (updatedPost: Posts) => {
          const postIndex = this.pendingPosts.findIndex(post => post.idPost === idPost);
          if (postIndex !== -1) {
            this.pendingPosts.splice(postIndex, 1);      //  Retirer de la liste des en attente
            this.approvedPosts.push(updatedPost);        //  Ajouter à la liste des approuvés
          }
          console.log("✅ Post approuvé avec succès :", updatedPost);
        },
        (error) => {
          console.error("❌ Erreur lors de l'approbation du post :", error);
        }
      );
    } else {
      console.error("⚠️ idPost est undefined");
    }
  }

  //  Rejet d’un post
  rejectPost(idPost: number | undefined): void {
    if (idPost !== undefined) {
      this.postService.rejectPost(idPost).subscribe(
        () => {
          const postIndex = this.pendingPosts.findIndex(post => post.idPost === idPost);
          if (postIndex !== -1) {
            this.pendingPosts.splice(postIndex, 1);  //  Retirer de la liste des en attente
          }
          console.log("🚫 Post rejeté avec succès");
        },
        (error) => {
          console.error("❌ Erreur lors du rejet du post :", error);
        }
      );
    } else {
      console.error("⚠️ idPost est undefined");
    }
  }

}
