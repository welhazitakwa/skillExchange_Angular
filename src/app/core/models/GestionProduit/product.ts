import { User } from "../GestionUser/User";
import { Cart } from "./cart";
import { CartProducts } from "./cart-products";
import { ImageProduct } from "./image-product";
import { ReviewProduct } from "./review-product";

export class Product {
    idProduct!: number;
  productName!: string;
  type!: string;
  price!: number;
  stock!: number;
 postedBy!: User | null; 
 cartProducts!: CartProducts[]; 
  reviewProducts!: ReviewProduct[];
  imageProducts!: ImageProduct[]; 
  currencyType?: 'TND' | 'Tokens';

}
