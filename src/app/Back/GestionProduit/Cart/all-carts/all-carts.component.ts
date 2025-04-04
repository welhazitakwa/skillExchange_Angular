import { Component } from '@angular/core';
import { Cart } from 'src/app/core/models/GestionProduit/cart';
import { CartService } from 'src/app/core/services/GestionProduit/cart.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-all-carts',
  templateUrl: './all-carts.component.html',
  styleUrls: ['./all-carts.component.css']
})
export class AllCartsComponent {
carts: Cart[] = [];

  constructor(private cartService: CartService, private userService:UserService) {}

  ngOnInit(){
    this.cartService.getCarts().subscribe(
      data => this.carts=data,
      erreur =>console.log("erreur"),
      ()=>console.log("le chargement des produits  est terminés ")
      
     );
     
  }
}
