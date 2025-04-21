import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/GestionProduit/product';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { ProductService } from 'src/app/core/services/GestionProduit/product.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent {
  newProduct: Product = new Product();
products: Product[] = [];
filteredproduct: Product[] = [];
  // Search and filter properties
  searchText: string = '';
 
  statusFilter: string = '';
  sellerFilter: string = '';  // Vendeur
  stockFilter: string = '';   // Stock
  uniqueSellers: string[] = [];  // Liste des vendeurs uniques
  

  // Sorting properties
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private router: Router, private authService: AuthService,
      private userService: UserService,private productService: ProductService) {}

  ngOnInit(){
    this.productService.getProduct().subscribe(
      /*data => this.products=data,
      erreur =>console.log("erreur"),
      ()=>console.log("le chargement des produits  est terminés ")
      
     );*/
     (response: Product[]) => {
                    this.products = response;
                    this.filteredproduct = [...this.products];
                    this.extractUniqueSellers();  // Extraire les vendeurs uniques
                    this.applyFilters(); 
                    console.log(response);
                  },
                  (error) => {
                    console.log(error);
                  }
         );
         this.loadCurrentUser();
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



// Extraire les vendeurs uniques
private extractUniqueSellers(): void {
  this.uniqueSellers = Array.from(new Set(
    this.products.map(product => product.postedBy!.name) // Remplacer 'name' par la propriété que vous souhaitez
  ));}
  applyFilters(): void {
    this.filteredproduct = this.products.filter((p) => {
      const isApproved = p.isApproved === 1;
      // Search text filter (name or email)
      const matchesSearch =
        !this.searchText ||
        p.productName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.type.toLowerCase().includes(this.searchText.toLowerCase());
  
     
  
      return matchesSearch ;
    });
  
    this.sortData();
  }
  sort(column: string): void {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
      this.sortData();
    }
  
    private sortData(): void {
      this.filteredproduct.sort((a, b) => {
        let valueA: any = a[this.sortColumn as keyof Product];
        let valueB: any = b[this.sortColumn as keyof Product];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
          // For boolean values (like verified status)
          valueA = valueA ? 1 : 0;
          valueB = valueB ? 1 : 0;
        }
  
        if (!valueA || !valueB) return 0;
  
        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    deleteProduct(id: number) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.productService.deleteProduct(id).subscribe(
          () => {
            console.log('Product deleted');
            this.productService.getProduct().subscribe(
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
    private async getBase64WithoutPrefix(file: File): Promise<string> {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => resolve(e.target.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
    }
     currentUser: User | null = null;
     
    async submitNewProduct() {
      console.log('Utilisateur actuel:', this.currentUser);

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
    selectedFiles: File[]=[]
    imagesPreviews: { url: string, file: File | null }[] = [];

    resetForm(): void {
      this.newProduct = new Product();
      this.selectedFiles = [];
      this.imagesPreviews = [];
      // Réinitialiser aussi l'input file
      const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
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
    
        this.selectedFiles.push(file);
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
    selectedImages: string[] = [];
    removeImage(index: number): void {
      if (confirm('Are you sure you want to remove this image?')) {
        this.imagesPreviews.splice(index, 1);
        this.selectedImages.splice(index, 1);
      }
      else {
        const actualIndex = index - this.imagesPreviews.length;
        this.markImageForDeletion(actualIndex);
      }
    }
    imagesToDelete: number[] = [];
    markImageForDeletion(index: number): void {
      if (!this.imagesToDelete.includes(index)) {
        this.imagesToDelete.push(index);
       
      }
    }
    editingProduct: Product = {
      idProduct: 0,
      productName: '',
      type: 'PHYSICAL', // ou 'DIGITAL' ou 'TOKENS', une valeur par défaut valide
      price: 0,
      stock: 0,
      postedBy: null,
      cartProducts: [],
      reviewProducts: [],
      imageProducts: [],
      currencyType: 'TND' // si tu veux aussi définir une valeur par défaut pour currency
    };
    showModalProduct = false;
    startEditProduct(product: Product) {
      this.editingProduct = JSON.parse(JSON.stringify(product)); // Deep clone
      this.imagesToDelete = [];
      this.selectedFiles = [];
     
      this.showModalProduct = true;
    }
  
    cancelEditProduct() {
      this.showModalProduct = false;
    }
    approveProduct(id: number): void {
      this.productService.approveProduct(id).subscribe({
        next: () => {
          alert("✅ Product approved successfully");
          this.refreshProducts();
        },
        error: (err) => {
          console.error("❌ Failed to approve product", err);
          alert("An error occurred while approving the product.");
        }
      });
    }
    
    rejectProduct(id: number): void {
      if (confirm("Are you sure you want to reject this product?")) {
        this.productService.rejectProduct(id).subscribe({
          next: () => {
            alert("❌ Product rejected and removed");
            this.refreshProducts();
          },
          error: (err) => {
            console.error("❌ Failed to reject product", err);
            alert("An error occurred while rejecting the product.");
          }
        });
      }
    }
    refreshProducts(): void {
      this.productService.getProduct().subscribe(
        (products) => {
          this.products = products;
          this.filteredproduct = [...products];
          this.extractUniqueSellers();
          this.applyFilters();
        },
        (error) => {
          console.error("Erreur lors de la mise à jour des produits :", error);
        }
      );
    }
    
    
}
