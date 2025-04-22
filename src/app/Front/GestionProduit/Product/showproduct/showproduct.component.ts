import { Component, OnInit, ViewChild } from '@angular/core';
import { Cart } from 'src/app/core/models/GestionProduit/cart';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
import { Product } from 'src/app/core/models/GestionProduit/product';
import { ReviewProduct } from 'src/app/core/models/GestionProduit/review-product';
import { CartProductService } from 'src/app/core/services/GestionProduit/cart-product.service';
import { CartService } from 'src/app/core/services/GestionProduit/cart.service';
import { ProductService } from 'src/app/core/services/GestionProduit/product.service';
import { CartProductsComponent } from '../../cart-products/cart-products.component';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageProduct } from 'src/app/core/models/GestionProduit/image-product';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-showproduct',
  templateUrl: './showproduct.component.html',
  styleUrls: ['./showproduct.component.css']
})

export class ShowproductComponent implements OnInit {

  newProduct: Product = new Product();
 // imagesPreviews: {url: string, file: File}[] = [];
 imagesPreviews: { url: string, file: File | null }[] = [];
 
 isCartOpen = false;
  cartCount = 0; // À mettre à jour dynamiquement selon le panier
  products: Product[] = [];
  cartProducts: CartProducts[] = [];
  localStorage = localStorage;

  currentUser: User | null = null;
  filteredProducts: Product[] = [];
selectedType: string = '';
  
  currentImageIndex: any;
  editImagesPreviews: any;
 
 
  constructor(private router: Router, private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute, private productService: ProductService, private cartProductService: CartProductService, private cartService: CartService) { }
    
   
  ngOnInit() {
    /*this.cartService.currentItemCount.subscribe(count => {
      this.cartCount = count;
    });
    */
   
  
    // Fetch the cart products immediately
    this.loadCartProducts();
   this.loadProducts();
    //this.cartCount = this.cartProducts.reduce((sum, item) => sum + item.quantity, 0);
    this.loadCurrentUser();
  }

  filterProducts() {
    if (this.selectedType) {
      this.filteredProducts = this.products.filter(p => p.type === this.selectedType);
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  private loadProducts(){
    this.productService.getApprovedProducts().subscribe(
      (products) => {
    
      
        this.products = products;
        this.filterProducts();
       
        console.log(this.products); 
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
  }
  private loadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user: User) => {
        this.currentUser = user;
      },
      (error) => {
        console.error(error);
      }
    );
  }


  cartId?: number;


  
  // addToCart(product: Product): void {
  //   if (product.stock <= 0) {
  //     alert('Stock épuisé, impossible d\'ajouter au panier.');
  //     return;
  //   }
  //   if (!this.currentUser) {
  //     alert('Vous devez être connecté');
  //     this.router.navigate(['/login']);
  //     return;
  //   }
    
  //   const userId = this.currentUser.id;
   
  //   if (!userId) {
  //     alert('Utilisateur non trouvé dans le localStorage. Vous devez être connecté.');
  //     console.log('ID utilisateur récupéré depuis localStorage :', userId);
  //     this.router.navigate(['/login']);  // Redirige vers la page de connexion si l'utilisateur n'est pas trouvé
  //     return;
  //   }
  
  //   this.cartId = Number(localStorage.getItem('cartId'));  // Récupère l'ID du panier (s'il existe)
  
  //   if (!this.cartId) {
  //     // Si aucun panier n'existe, créer un nouveau panier pour cet utilisateur
  //     const newCart = { user: { id: Number(userId) } };
  
   
  //   //  this.cartService.getActiveCartByUser(userId)
  //   this.cartService.addCart(newCart as Cart).subscribe({
  //       next: (cart) => {
  //         this.cartId = cart?.id;
  //         localStorage.setItem('cartId', String(this.cartId));  // Sauvegarde le cartId dans le localStorage
  //         this.addProductToCart(product);  // Ajoute le produit au panier
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors de la création du panier', err);
  //         alert('Erreur lors de la création du panier');
  //       }
  //     });
  //   } else {
  //     // Si un panier existe déjà, on ajoute le produit
  //     this.addProductToCart(product);
  //   }
  // }
  addToCart(product: Product): void {
    if (product.stock <= 0) {
      alert('Stock épuisé, impossible d\'ajouter au panier.');
      return;
    }
  
    if (!this.currentUser) {
      alert('Vous devez être connecté');
      this.router.navigate(['/login']);
      return;
    }
  
    const userId = this.currentUser.id;
    
  
    const existingProduct = this.cartProducts.find(cartProduct => cartProduct.product.idProduct === product.idProduct);
  
    if (existingProduct) {
      existingProduct.quantity++;
      this.cartProductService.updateCartProduct(existingProduct).subscribe({
        next: () => {
          console.log('Quantité mise à jour');
          this.updateCartCount();
          this.loadCartProducts();
        },
        error: err => console.error('Erreur lors de la mise à jour de la quantité', err)
      });
    } else {
      // 💡 Appel simplifié sans cartId
      this.cartProductService.addProductToUserCart(userId, product.idProduct, 1).subscribe({
        next: (response) => {
          this.cartProducts.push({
            id: response.id,
            cart: response.cart,
            product: product,
            quantity: 1
          });
          this.updateCartCount();
          this.loadCartProducts();
        },
        error: err => console.error('Erreur lors de l\'ajout au panier', err)
      });
    }
  }
  
  
  // private addProductToCart(product: Product): void {
  //   const existingProduct = this.cartProducts.find(cartProduct => cartProduct.product.idProduct === product.idProduct);
  
  //   if (existingProduct) {
  //     existingProduct.quantity++;
  //     this.cartProductService.updateCartProduct(existingProduct).subscribe({
  //       next: () => {
  //         console.log('Quantité mise à jour');
  //         this.updateCartCount();
  //         this.loadCartProducts();
  //       },
  //       error: err => console.error('Erreur lors de la mise à jour de la quantité', err)
  //     });
  //   } else {
  //     // Ajouter un nouveau produit au panier
  //     this.cartProductService.addToCart(this.cartId!, product.idProduct, 1).subscribe({
  //       next: (response) => {
  //         this.cartProducts.push({
  //           id: response.id,
  //           cart: { id: this.cartId } as Cart,
  //           product: product,
  //           quantity: 1
  //         });
  //         this.updateCartCount();
  //         this.loadCartProducts();
  //       },
  //       error: err => console.error('Erreur lors de l\'ajout au panier', err)
  //     });
  //   }
  // }
  private updateCartCount() {
    const count = Number(localStorage.getItem('cartCount')) || 0;
  
    localStorage.setItem("cartCount", String(count + 1));
  }
    
 
  

  // loadCartProducts(): void {
  //   this.cartProductService.getCartProducts().subscribe({
  //     next: (cartProducts) => {
  //       // Log pour vérifier le contenu de la réponse
  //       console.log(cartProducts);

  //       // Traitement des produits du panier
  //       this.cartProducts = cartProducts;
  //       const count  = this.cartProducts.reduce((sum, item) => sum + item.quantity, 0); // ✅ Calcul après le chargement
      
  //       //this.cartCount=count;
  //       this.localStorage.setItem("cartCount",String(count));
  //       console.log("Panier mis à jour :", this.cartProducts);
  //       console.log("CartCount mis à jour :", this.cartCount);
  //     },
  //     error: (err) => {
  //       console.error("Erreur lors du chargement du panier :", err);
  //       alert("Erreur lors du chargement du panier.");
  //     }
  //   });
  // }
  ///////////New/////////////////////////
  loadCartProducts(): void {
    const userId = Number(localStorage.getItem('userId')); // ou depuis AuthService si tu en as un
    console.log("userId récupéré :", userId);
  
    this.cartService.getActiveCartByUser(userId).subscribe({
      next: (cart) => {
        if (cart) {
          
          this.cartProductService.getProductsInCart(cart.id).subscribe({
            next: (cartProducts) => {
              this.cartProducts = cartProducts;
              const count = this.cartProducts.reduce((sum, item) => sum + item.quantity, 0);
              this.localStorage.setItem("cartCount", String(count));
              console.log("Produits du panier :", this.cartProducts);
              console.log("CartCount mis à jour :", count);
            },
            error: (err) => {
              console.error("Erreur lors du chargement des produits du panier :", err);
            }
          });
        } else {
          console.log("Aucun panier actif trouvé.");
          this.cartProducts = [];
          this.localStorage.setItem("cartCount", "0");
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération du panier actif :", err);
      }
    });
  }
  
  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }
selectedFiles: File[]=[]

  selectedImages: string[] = [];

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;
  
    Array.from(files).forEach((file: File) => {
      // Validation des fichiers image
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        alert("Le fichier ${file.name} n'est pas une image valide (JPEG/PNG requis)");
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) { // Limite à 5MB
        alert("L'image ${file.name} est trop volumineuse (5MB maximum)");
        return;
      }
  
     // this.selectedFiles.push(file);
       // Redimensionner l'image si elle est trop grande
    this.resizeImage(file, 800, 600).then((resizedFile) => {
      this.selectedFiles.push(resizedFile);

  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagesPreviews.push({
          url: e.target.result, // Stocker l'URL en base64
         // file: file,
          file: resizedFile
        });
     
      };

      reader.readAsDataURL(resizedFile);
    }).catch(error => {
      console.error('Erreur lors du redimensionnement de l\'image :', error);
    });
  });
}
  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
  
      reader.onload = (e) => {
        img.src = e.target!.result as string;
  
        img.onload = () => {
          let width = img.width;
          let height = img.height;
  
          // Calculer les nouvelles dimensions
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
  
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
  
          // Créer un canvas pour redimensionner l'image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convertir l'image redimensionnée en base64
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject('Erreur lors du redimensionnement de l\'image');
            }
          }, file.type);
        };
      };
  
      reader.readAsDataURL(file);
    });
  }
  currentImages: string[] = []; // les images actuelles du produit
imagesToDelete: number[] = []; // celles à supprimer



  
 
  async submitNewProduct() {
    
    if (!this.currentUser) {
      alert('Vous devez être connecté');
      return;
    }
  
    try {
      // Conversion des images
      const imageProducts = await Promise.all(
        this.selectedFiles.map(async file => ({
          image: await this.getBase64WithoutPrefix(file),
          // Ne pas inclure la référence au produit ici
        }))
      );
     
      // Construction de l'objet produit
      const productToSend = {
        ...this.newProduct,
        postedBy: { id: this.currentUser.id }, 
        imageProducts:imageProducts,
        currencyType: this.newProduct.currencyType || 'TND'
      };
  
      console.log('Envoi final:', JSON.parse(JSON.stringify(productToSend)));
  
      this.productService.addProduct(productToSend as Product).subscribe({
        next: () => {
          alert('Produit ajouté avec succès!');
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur complète:', err);
          alert(`Erreur: ${err.error?.message || 'Voir la console'}`);
        }
      });
  
    } catch (error) {
      console.error('Erreur de conversion:', error);
      alert('Erreur de traitement des images');
    }
  }
  private async getBase64WithoutPrefix(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
  }
  // private async getBase64WithPrefix(file: File): Promise<string> {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => resolve(e.target.result); // Ne pas splitter le résultat
  //     reader.readAsDataURL(file);
  //   });
  // }
  switchMainImage(product: Product, index: number) {
    if (product.imageProducts && product.imageProducts.length > index) {
      // Échange la première image avec celle cliquée
      [product.imageProducts[0], product.imageProducts[index]] = 
      [product.imageProducts[index], product.imageProducts[0]];
    }
  }
  markImageForDeletion(index: number): void {
    if (!this.imagesToDelete.includes(index)) {
      this.imagesToDelete.push(index);
      this.updateImagePreviews();
    }
  }
  removeImage(index: number): void {
    if (confirm('Are you sure you want to remove this image?')) {
      this.imagesPreviews.splice(index, 1);
      this.selectedImages.splice(index, 1);
      this.imagesToDelete.push(index);
    }
    // else {
    //   const actualIndex = index - this.imagesPreviews.length;
    //   this.markImageForDeletion(actualIndex);
    // }
  }
  imageError: string | null = null;
  onFileChange(event: any): void {
  const files = event.target.files;
  this.imageError = null;
  this.imagesPreviews = [];  // Réinitialisation des aperçus
  this.selectedImages = [];  // Réinitialisation des images sélectionnées

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        this.imageError = 'Only image files are allowed.';
        return;  // Arrêter l'exécution si le type de fichier n'est pas une image
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.imagesPreviews.push(base64String);  // Ajout de la prévisualisation
        const base64Data = base64String.split(',')[1];
        this.selectedImages.push(base64Data);  // Ajout du base64 à la liste des images sélectionnées
      };
      reader.readAsDataURL(file);
    }
  }
}
  private updateImagePreviews(): void {
    this.imagesPreviews = [
      ...this.editingProduct!.imageProducts
        .filter((_, i) => !this.imagesToDelete.includes(i))
        .map(img => ({ url: img.image, file: null })),
      ...this.selectedFiles.map(file => ({ 
        url: URL.createObjectURL(file), 
        file 
      }))
    ];
  }
  showModalProduct = false;
  
  onImageSelected(event: any) {
    const files = event.target.files;
    
  }
  startEditProduct(product: Product) {
    this.editingProduct = JSON.parse(JSON.stringify(product)); // Deep clone
    this.imagesToDelete = [];
    this.selectedFiles = [];
    this.updateImagePreviews();
    this.showModalProduct = true;
  }

  cancelEditProduct() {
    this.showModalProduct = false;
  }
  editingProduct?: Product;
//fonctionnel
  // submitEditProduct() {
  //   if (!this.editingProduct) return;
  
  //   this.productService.updateProduct(this.editingProduct).subscribe({
  //     next: () => {
  //       console.log('Product updated');
  //       this.productService.getProduct().subscribe({
  //         next: (products) => {
  //           this.products = products;
  //           console.log(this.products);
  //         },
  //         error: (error) => {
  //           console.error('Erreur lors de la récupération des produits', error);
  //         }
  //       });
  //       this.showModalProduct = false;
  //       this.editingProduct = undefined;
  //     },
  //     error: (error) => {
  //       console.error('Error updating product', error);
  //     }
  //   });
  // }
  submitEditProduct() {
    if (!this.editingProduct) return;
  
    // Inclure les indices des images à supprimer dans le produit
    const productData = {
      ...this.editingProduct,
      imagesToDelete: this.imagesToDelete
    };
  
    this.productService.updateProduct(productData).subscribe({
      next: () => {
        console.log('Product updated');
        this.productService.getApprovedProducts().subscribe({
          next: (products) => {
            this.products = products;
            console.log(this.products);
          },
          error: (error) => {
            console.error('Error retrieving products', error);
          }
        });
        this.showModalProduct = false;
        this.editingProduct = undefined;
      },
      error: (error) => {
        console.error('Error updating product', error);
      }
    });
  }
  
  removeExistingImage(imageId: number) {
    if (!this.imagesToDelete.includes(imageId)) {
      this.imagesToDelete.push(imageId);
    }
  
    // Supprimer visuellement l'image
    this.editingProduct!.imageProducts = this.editingProduct!.imageProducts.filter(img => img.idImage !== imageId);
  }
  
  // async submitEditProduct() {
  //   const formData = new FormData();
  
  //   const productToSend = {
  //     productName: this.editingProduct?.productName,
  //     type: this.editingProduct?.type,
  //     price: this.editingProduct?.price,
  //     stock: this.editingProduct?.stock,
  //     currencyType: this.editingProduct?.currencyType
  //   };
  
  //   formData.append('product', new Blob([JSON.stringify(productToSend)], { type: 'application/json' }));
  
  //   // Ajouter les nouvelles images
  //   for (let file of this.selectedFiles) {
  //     formData.append('newImages', file);
  //   }
  
  //   // Ajouter les ids des images à supprimer
  //   for (let id of this.imagesToDelete) {
  //     formData.append('imagesToDelete', id.toString());
  //   }
  //   console.log("Images à supprimer :", this.imagesToDelete);
  //   for (const [key, value] of (formData as any).entries()) {
  //     console.log(`${key}:`, value);
  //   }

  
  //   this.productService.updateProduct(this.editingProduct!.idProduct!, formData).subscribe({
  //     next: () => {
  //       alert("Produit modifié avec succès !");
  //       this.showModalProduct = false;
  //       this.loadProducts(); // ou toute méthode pour rafraîchir
  //     },
  //     error: (err) => {
  //       console.error('Erreur update:', err);
  //       alert('Erreur lors de la mise à jour');
  //     }
  //   });
  // }
  
  
  
  

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          console.log('Product deleted');
          this.productService.getApprovedProducts().subscribe(
            (products) => {
              this.products = products;
              
              console.log(this.products); // Vérifier si les produits sont bien récupérés
            },
            (error) => {
              console.error('Erreur lors de la récupération des produits', error);
            }
          );
        },
        (error) => console.error('Error deleting product', error)
      );
    }
  }
  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.newProduct = new Product();
    this.selectedFiles = [];
    this.imagesPreviews = [];
    // Réinitialiser aussi l'input file
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
  // Ajoutez cette propriété
isSubmitting: boolean = false;


newImages: { url: string, file: File | null }[] = [];



// Fonction pour supprimer les références circulaires
private removeCircularReferences(obj: any, seen: Set<any> = new Set()): any {
  if (obj && typeof obj === 'object') {
    if (seen.has(obj)) {
      return undefined; // Si on a déjà vu cet objet, on l'ignore
    }
    seen.add(obj);
    for (const key of Object.keys(obj)) {
      obj[key] = this.removeCircularReferences(obj[key], seen); // Appel récursif
    }
  }
  return obj;
}

private resetEditForm(): void {
  this.editImagesPreviews = [];
  this.selectedFiles = [];
  this.imagesToDelete = [];
}


}

  








