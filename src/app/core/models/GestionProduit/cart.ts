import { User } from "../GestionUser/User";
import { CartProducts } from "./cart-products";
import { Product } from "./product";

export class Cart {
    id!: number;
   
    user!:User;
    cartProducts!: CartProducts[]; 
    isActive: boolean = true;
  
}
