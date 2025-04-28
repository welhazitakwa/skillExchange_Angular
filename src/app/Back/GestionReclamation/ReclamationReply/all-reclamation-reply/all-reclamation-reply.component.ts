import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { Reclamation } from 'src/app/core/models/GestionReclamation/Reclamation';
import { ReclamationReply } from 'src/app/core/models/GestionReclamation/ReclamationReply';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { ReclamationService } from 'src/app/core/services/GestionReclamation/reclamation.service';
import { ReclamationReplyService } from 'src/app/core/services/GestionReclamation/reclamationReply.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { EmailRequest, EmailService } from 'src/app/core/services/Mailing/email.service';

@Component({
  selector: 'app-all-reclamation-reply',
  templateUrl: './all-reclamation-reply.component.html',
  styleUrls: ['./all-reclamation-reply.component.css']
})
export class AllReclamationReplyComponent implements OnInit {
  replies: ReclamationReply[] = [];
  newReply: ReclamationReply = new ReclamationReply();
  reclamationId!: number;
  currentAdminId!: number;
  originalReclamation!: Reclamation;
  isSaving: boolean = false;

  constructor(
    private replyService: ReclamationReplyService,
    private reclamationService: ReclamationService,
    private userService: UserService,
    private emailService: EmailService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reclamationId = +params['id'];
      this.loadOriginalReclamation();
      this.loadReplies();
    });

    
    this.currentAdminId = this.authService.getCurrentUserID() as number;
  }

  private loadOriginalReclamation() {
    this.reclamationService.getReclamationById(this.reclamationId).subscribe({
      next: (rec: Reclamation) => {
        this.originalReclamation = rec;
        this.newReply.title = rec.title;
      },
      error: (err) => {
        console.error('Error loading reclamation:', err);
        alert('Reclamation not found');
        this.router.navigate(['/back/reclamations']);
      }
    });
  }

  private loadReplies() {
    this.replyService.getAllReclamationReply().subscribe({
      next: (res: ReclamationReply[]) => {
        this.replies = res.filter(reply => reply.idReclamation === this.reclamationId);
        this.replies.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: (err) => console.error('Error loading replies:', err)
    });
  }

  addReply() {
    this.isSaving = true;
    if (!this.newReply.reply?.trim()) {
      alert('Please enter a reply');
      return;
    }

    this.newReply = {
      ...this.newReply,
      idReclamation: this.reclamationId,
      idAdmin: this.currentAdminId,
      date: new Date(),
      title: this.originalReclamation.title
    };

    this.replyService.addReclamationReply(this.newReply).pipe(
      // Update the reclamation status after successful reply addition
      switchMap(() => {
        if (this.originalReclamation.status === 'Pending') {
          this.originalReclamation.status = 'Resolved';
          return this.reclamationService.updateReclamations(
            this.reclamationId, 
            this.originalReclamation
          ).pipe(
            switchMap(updatedReclamation => {
              // Get user details for email
              return this.userService.getUserById(updatedReclamation.idUser).pipe(
                switchMap(user => {
                  const emailData: EmailRequest = {
                    to: user.email,
                    subject: 'Your Reclamation Has Been Resolved',
                    text: this.generateResolutionEmailText(user, this.newReply)
                  };
                  return this.emailService.sendResolutionEmail(emailData);
                })
              );
            })
          );
        }
        return of(null); // If status wasn't Pending, just continue
      })
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.loadReplies();
        this.newReply = new ReclamationReply();
        this.newReply.title = this.originalReclamation.title;
        alert('Reply added successfully' + 
          (this.originalReclamation.status === 'Resolved' ? ' and status updated to Resolved' : ''));
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error adding reply:', err);
        alert('Failed to add reply');
      }
    });
  }

  deleteReply(id: number) {
    if (confirm('Are you sure you want to delete this reply?')) {
      this.replyService.deleteReclamationReply(id).subscribe({
        next: () => this.loadReplies(),
        error: (err) => {
          console.error('Error deleting reply:', err);
          alert('Failed to delete reply');
        }
      });
    }
  }

  private generateResolutionEmailText(user: User, reply: ReclamationReply): string {
    return `
      Dear ${user.name},
  
      We're pleased to inform you that your reclamation regarding:
      "${this.originalReclamation.title}"
      has been resolved.
  
      Resolution details:
      ${reply.reply}
  
      Reclamation ID: #${this.reclamationId}
      Resolution Date: ${new Date().toLocaleDateString()}
  
      This is an automated message - please do not reply directly to this email.
  
      Best regards,
      SkillExchange Support Team
    `;
  }
}