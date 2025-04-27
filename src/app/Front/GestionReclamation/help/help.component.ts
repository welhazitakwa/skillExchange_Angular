import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Reclamation } from 'src/app/core/models/GestionReclamation/Reclamation';
import { User } from 'src/app/core/models/GestionUser/User';
import { AiSuggestionService } from 'src/app/core/services/ai/ai-suggestion.service';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { ReclamationService } from 'src/app/core/services/GestionReclamation/reclamation.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { EmailService, EmailRequest } from 'src/app/core/services/Mailing/email.service';



@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  predefinedTitles = [
    { id: 1, title: 'Problème d\'accès à un cours', icon: 'fas fa-book' },
    { id: 2, title: 'Problème de paiement', icon: 'fas fa-credit-card' },
    { id: 3, title: 'Problème technique de lecture vidéo', icon: 'fas fa-video' },
    { id: 4, title: 'Problème de compte utilisateur', icon: 'fas fa-user' },
    { id: 5, title: 'Problème de téléchargement de ressources', icon: 'fas fa-download' },
    { id: 6, title: 'Signalement de contenu inapproprié', icon: 'fas fa-flag' }
  ];

  selectedTitle: string = '';
  reclamation: Reclamation = new Reclamation();
  currentUser: User | null = null;
  userReclamations: Reclamation[] = [];
  isEditing: boolean = false;
  showReclamationsList: boolean = false;
  aiSuggestions: string[] = [];
  loadingSuggestions = false;
  showSuggestions = false;
  private suggestionDebounce: any;

  constructor(
    private aiService: AiSuggestionService,
    private servicerec: ReclamationService, 
    private authService: AuthService, 
    private userService: UserService, 
    private router: Router,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  

  private loadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.userService.getUserByEmail(currentUserEmail).subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.loadUserReclamations();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private loadUserReclamations() {
    if (this.currentUser) { // Add null check
      this.servicerec.getAllReclamations().subscribe({
        next: (res: Reclamation[]) => {
          this.userReclamations = res.filter(rec => 
            rec.idUser === this.currentUser!.id // Add non-null assertion here
          );
        },
        error: (err) => console.error(err)
      });
    }
  }

  selectTitle(title: string) {
    this.selectedTitle = title;
    this.reclamation.title = title;
    this.isEditing = false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload an image (JPEG, PNG, GIF).");
        return;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = () => {
        // Store the full base64 string with prefix
        this.reclamation.image = reader.result as string;
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
      };
    } else {
      // Keep existing image if no new file selected
      this.reclamation.image = this.reclamation.image;
    }
  }

  loadForEdit(rec: Reclamation) {
    this.isEditing = true;
    this.reclamation = { ...rec };
    this.selectedTitle = rec.title;
    if (this.reclamation.image && !this.reclamation.image.startsWith('data:image')) {
      this.reclamation.image = `data:image/*;base64,${this.reclamation.image}`;
    }
  }

  showCreateForm() {
    this.resetForm();
    this.selectedTitle = '';
  }

  cancelEdit() {
    this.selectedTitle = '';
    this.reclamation = new Reclamation();
    this.isEditing = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private resetForm() {
    this.reclamation = new Reclamation();
    this.isEditing = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  toggleReclamationsView() {
    this.showReclamationsList = !this.showReclamationsList;
    if (this.showReclamationsList) {
      this.loadUserReclamations();
    }
  }

  onSubmit(form: NgForm) {
    const user = this.currentUser;
    if (form.valid && user) {
        // Create a new Reclamation object instead of a plain object
        const payload: Reclamation = {
            ...this.reclamation,
            idReclamation: this.reclamation.idReclamation,
            title: this.selectedTitle,
            idUser: user.id,
            date: new Date(),
            image: this.reclamation.image?.startsWith('data:image') 
                 ? this.reclamation.image.split(',')[1] 
                 : this.reclamation.image,
            description: this.reclamation.description,
            status: this.reclamation.status || 'Pending', 
            reponse: this.reclamation.reponse || '' 
        };

        const operation = this.isEditing 
            ? this.servicerec.updateReclamations(this.reclamation.idReclamation, payload)
            : this.servicerec.addReclamation(payload);

        operation.subscribe({
            next: () => {
              if (!this.isEditing && this.currentUser?.email) {
                const emailData: EmailRequest = {
                  to: this.currentUser.email,
                  subject: 'Confirmation de réception de votre réclamation',
                  text: this.generateEmailText()
                };
          
                this.emailService.sendConfirmationEmail(emailData).subscribe({
                  next: (response: string) => {
                    console.log('Email response:', response);
                    // Handle successful email sending
                  },
                  error: (err) => {
                    console.error('Error sending email:', err);
                    // Optional: Show user-friendly error message
                  }
                });
                this.sendWhatsAppNotification();
              }
                alert(`Reclamation ${this.isEditing ? 'updated' : 'sent'} successfully!`);
                this.loadUserReclamations();
                this.resetForm();
                this.selectedTitle = '';
                this.showReclamationsList = false;
            },
            error: (err) => {
                console.error('Full error:', err);
                let serverMessage = err.error?.error || err.error?.message;
                let userMessage = serverMessage 
                    ? `Server error: ${serverMessage}`
                    : 'Failed to communicate with server';
                
                alert(userMessage);
            }
        });
    }
}

private generateEmailText(): string {
  return `
    Bonjour ${this.currentUser?.name || ''},

    Nous accusons réception de votre réclamation concernant :
    "${this.selectedTitle}".

    Notre équipe traitera votre demande dans les plus brefs délais.
    
    Date de soumission : ${new Date().toLocaleDateString()}
    Référence : #${this.reclamation.idReclamation || 'Nouvelle'}

    Ceci est un message automatique - Merci de ne pas y répondre.
    
    Cordialement,
    L'équipe de support SkillExchange
  `;
}


// AI methods
onDescriptionInput() {
  if (this.reclamation.description.length > 20) {
      clearTimeout(this.suggestionDebounce);
      this.suggestionDebounce = setTimeout(() => {
          this.loadSuggestions();
      }, 1000);
  }
}

private loadSuggestions() {
  console.log('Loading suggestions for:', this.reclamation.description);
  this.loadingSuggestions = true;
  this.showSuggestions = true;
  
  this.aiService.getSuggestions(this.reclamation.description).subscribe({
    next: (response: any) => {
      if (response.error) {
        console.error('Backend Error:', response.error);
        this.aiSuggestions = ['Our team is currently unavailable. Please try again later.'];
      } else {
        console.log('AI Response:', response);
        this.aiSuggestions = this.mapLabelsToSuggestions(response.labels || []);
      }
      this.loadingSuggestions = false;
    },
    error: (err) => {
      console.error('HTTP Error:', err);
      this.aiSuggestions = ['Failed to load suggestions. Check your connection.'];
      this.loadingSuggestions = false;
    }
  });
}

private mapLabelsToSuggestions(labels: string[]): string[] {
  const suggestionMap: { [key: string]: string } = {
      'technical issue': 'Try clearing your browser cache and updating your browser to the latest version.',
      'payment problem': 'Please verify your payment details and ensure your card is not expired.',
      'account access': 'Reset your password using the "Forgot Password" feature.',
      'content issue': 'Our content team will review this within 24 hours.',
      'download problem': 'Check your internet connection and available storage space.'
  };

  return labels.map(label => suggestionMap[label] || 'Our support team will review your issue shortly.');
}

applySuggestion(suggestion: string) {
  this.reclamation.description += '\n' + suggestion;
  this.showSuggestions = false;
}


private sendWhatsAppNotification() {
  const message = `New Reclamation Alert! 🚨\n\n` +
                 `Title: ${this.selectedTitle}\n` +
                 `User: ${this.currentUser?.name}\n` +
                 `Description: ${this.reclamation.description.substring(0, 100)}`;

  this.servicerec.sendWhatsAppMessage(message).subscribe({
    next: () => console.log('WhatsApp notification sent'),
    error: (err) => {
      console.error('WhatsApp error details:', err.details);
      alert('Failed to send WhatsApp notification. Check console for details.');
    }
  });
}

}