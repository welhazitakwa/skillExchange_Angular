import { User } from "../GestionUser/User";
import { Cart } from "./cart";
import { ImageProduct } from "./image-product";

export class Product {
    idProduct!: number;
  productName!: string;
  type!: string;
  price!: number;
  stock!: number;
 postedBy!: User; 
  carts!: Cart[]; 
 /* reviewProducts!: ReviewProduct[];*/
  imageProducts!: ImageProduct[]; 
}
