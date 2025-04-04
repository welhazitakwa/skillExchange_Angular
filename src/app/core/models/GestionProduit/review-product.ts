import { User } from "../GestionUser/User";
import { Product } from "./product";

export class ReviewProduct {
    idReview!: number; 
  content!: string; 
  createdAt!: Date; 
  updatedAt!: Date; 
  rating!: number; 
  product!: Product;
  email!:string;
}
