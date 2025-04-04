import { Injectable } from '@angular/core';
import { ImageProduct } from '../../models/GestionProduit/image-product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageProductService{

 listImagess: ImageProduct[] = [];
  url = 'http://localhost:8084/skillExchange/imageProduct';
   constructor(private http: HttpClient) { }
   getImages() : Observable<ImageProduct[]> 
   {
    
    return this.http.get<ImageProduct[]>(this.url);
 }
 addImageProduct(imgProd: ImageProduct): Observable<ImageProduct> {
  return this.http.post<ImageProduct>(this.url, imgProd);
 }
 
 deleteImageProduct(id:number){
  return this.http.delete(this.url+'/'+id);
 }
 getImageProductByID(id:number){
  return this.http.get<ImageProduct>(this.url+'/'+id);
 }
 updateImageProduct(imgProd:ImageProduct){
  return this.http.patch(this.url+'/'+imgProd.idImage,imgProd);
 }
}
