import { Component } from '@angular/core';
import { Product } from 'src/app/core/models/GestionProduit/product';
import { ProductService } from 'src/app/core/services/GestionProduit/product.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent {
products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(){
    this.productService.getProduct().subscribe(
      data => this.products=data,
      erreur =>console.log("erreur"),
      ()=>console.log("le chargement des produits  est terminés ")
      
     );
  }
}
