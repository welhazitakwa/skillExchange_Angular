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

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    // Récupérer tous les posts au démarrage du composant
    this.postService.getAllPosts().subscribe(
      (data) => {
        this.listPosts = data;  // Assigner les posts récupérés à la liste
        console.log("Liste des posts : ", this.listPosts);  // Affichage dans la console pour vérifier
      },
      (error) => {
        console.log("Erreur lors de la récupération des posts : ", error);  // Gestion d'erreur
      }
    );
  }
}
