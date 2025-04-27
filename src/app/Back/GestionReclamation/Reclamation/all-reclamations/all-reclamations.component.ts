import { Component, OnDestroy, OnInit } from '@angular/core';
import { Reclamation } from 'src/app/core/models/GestionReclamation/Reclamation';
import { ReclamationService } from 'src/app/core/services/GestionReclamation/reclamation.service';
import { AIService } from 'src/app/core/services/ai/ai.service';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-all-reclamations',
  templateUrl: './all-reclamations.component.html',
  styleUrls: ['./all-reclamations.component.css']
})
export class AllReclamationsComponent implements OnInit, OnDestroy{
  reclamations:Reclamation[]=[];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  topIssues: { label: string, score: number }[] = [];
  isAnalyzing = false;
  analysisError = false;


  constructor(private servicerec:ReclamationService, private aiService:AIService){}

  // ngOnInit(): void {
  //   this.isAnalyzing = true;
  //   this.servicerec.getAllReclamations().subscribe(
  //     (res:Reclamation[])=>{
  //       this.reclamations = res;
  //       console.log(res);
  //     }, (err)=>{
  //       console.log("erreur : "+ err);
  //     }
  //   )
    
  // }

  ngOnInit(): void {
    this.isAnalyzing = true;
    this.servicerec.getAllReclamations().subscribe({
      next: (res: Reclamation[]) => {
        this.reclamations = res;
        this.analyzeTitles();
      },
      error: (err) => {
        console.error(err);
        this.isAnalyzing = false;
      }
    });
  }

  

  ngOnDestroy() {
    
  }

  deleteReclamation(id: number) {
    if (confirm('Are you sure you want to delete this reclamation?')) {
      this.servicerec.deleteReclamations(id).subscribe(
        () => {
          this.reclamations = this.reclamations.filter(
            rec => rec.idReclamation !== id
          );
          alert('Reclamation deleted successfully');
        },
        (err) => {
          console.error("Error deleting reclamation:", err);
          alert('Error deleting reclamation');
        }
      );
    }
  }

  get filteredReclamations(): Reclamation[] {
    if (!this.searchTerm.trim()) return this.reclamations;
    
    const searchText = this.searchTerm.toLowerCase();
    return this.reclamations.filter(rec => 
      rec.title?.toLowerCase().includes(searchText)
    );
  }

  get paginatedReclamations(): Reclamation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReclamations.slice(
      startIndex, 
      startIndex + this.itemsPerPage
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReclamations.length / this.itemsPerPage);
  }

  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  private analyzeTitles() {
    const titles = this.reclamations
      .filter(r => r.title)
      .map(r => r.title.trim());
    
    if (titles.length === 0) {
      this.isAnalyzing = false;
      return;
    }
  
    this.aiService.analyzeTitles(titles).subscribe({
      next: (response) => {
        this.topIssues = Object.entries(response)
          .map(([label, score]) => ({ 
            label, 
            score: Math.round(score) 
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        
        this.isAnalyzing = false;
      },
      error: (err) => {
        this.handleAnalysisError(err.message);
      }
    });
  }

  private handleAnalysisError(message: string) {
    console.error('Analysis failed:', message);
    this.isAnalyzing = false;
    this.analysisError = true;
    
    // Show user-friendly messages
    const errorMap: { [key: string]: string } = {
      'Authentication required': 'Please login to use AI features',
      'Invalid token format': 'Session expired - Please login again',
      'AI service unavailable': 'AI service is currently unavailable'
    };
  
    alert(errorMap[message] || 'Analysis failed - Please try again later');
  }

}
