import { Component } from '@angular/core';
import { ImageProduct } from 'src/app/core/models/GestionProduit/image-product';
import { ImageProductService } from 'src/app/core/services/GestionProduit/image-product.service';

@Component({
  selector: 'app-all-images',
  templateUrl: './all-images.component.html',
  styleUrls: ['./all-images.component.css']
})
export class AllImagesComponent {
  imagesP: ImageProduct[] = [];

  constructor(private imgService:ImageProductService) {}

  ngOnInit(){
    this.imgService.getImages().subscribe(
      data => this.imagesP=data,
      erreur =>console.log("erreur"),
      ()=>console.log("le chargement des images  est terminés ")
      
     );
  }
}
