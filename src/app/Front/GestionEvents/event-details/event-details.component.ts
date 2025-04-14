import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events } from 'src/app/core/models/GestionEvents/events';
import { EventsService } from 'src/app/core/services/GestionEvents/events.service';
import { EventCommentService } from 'src/app/core/services/GestionEvents/event-comment.service';
import { EventComment } from 'src/app/core/models/GestionEvents/event-comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/Auth/auth.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Events | null = null;
  carouselIndex: number = 0;
  comments: EventComment[] = [];
  commentForm: FormGroup;
  replyForm: FormGroup;
  replyingTo: number | null = null;
  editingComment: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private commentService: EventCommentService,
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.replyForm = this.fb.group({
      replyContent: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadEvent(id);
      this.loadComments(id);
    }
  }

  loadEvent(id: number): void {
    this.eventsService.getEventByID(id).subscribe(
      (event) => {
        this.event = event;
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'événement', error);
      }
    );
  }
  loadComments(eventId: number): void {
    this.commentService.getCommentsByEvent(eventId).subscribe({
      next: (comments) => {
        // Organiser les commentaires et réponses
        const commentMap = new Map<number, EventComment>();
        const topLevelComments: EventComment[] = [];
        
        comments.forEach(comment => {
          if (!comment.parentComment) {
            comment.replies = [];
            commentMap.set(comment.idComment!, comment);
            topLevelComments.push(comment);
          }
        });
  
        // Ajouter les réponses aux commentaires parents
        comments.forEach(comment => {
          if (comment.parentComment) {
            const parent = commentMap.get(comment.parentComment.idComment!);
            if (parent) {
              if (!parent.replies) parent.replies = [];
              parent.replies.push(comment);
            }
          }
        });
  
        this.comments = topLevelComments;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.comments = [];
      }
    });
  }

  updateComment(comment: EventComment): void {
    const formToUse = comment.parentComment ? this.replyForm : this.commentForm;
    
    if (formToUse.valid) {
      const updatedContent = comment.parentComment 
        ? this.replyForm.value.replyContent
        : this.commentForm.value.content;
  
      const updatedComment: Partial<EventComment> = {
        idComment: comment.idComment,
        content: updatedContent
      };
      
      this.commentService.updateComment(updatedComment).subscribe({
        next: (updated) => {
          // Mise à jour du commentaire dans le tableau
          const allComments = [...this.comments];
          const updateInTree = (comments: EventComment[]) => {
            for (let c of comments) {
              if (c.idComment === updated.idComment) {
                c.content = updated.content;
                return true;
              }
              if (c.replies && c.replies.length > 0) {
                if (updateInTree(c.replies)) return true;
              }
            }
            return false;
          };
          
          updateInTree(allComments);
          this.comments = allComments;
          
          this.editingComment = null;
          this.commentForm.reset();
          this.replyForm.reset();
        },
        error: (error) => {
          console.error('Error updating comment:', error);
        }
      });
    }
  }
  prevImage(): void {
    if (this.event && this.event.images && this.event.images.length > 0) {
      this.carouselIndex = Math.max(0, this.carouselIndex - 1);
    }
  }

  nextImage(): void {
    if (this.event && this.event.images && this.event.images.length > 0) {
      this.carouselIndex = Math.min(this.event.images.length - 1, this.carouselIndex + 1);
    }
  }

  submitComment(): void {
    if (this.commentForm.valid && this.event) {
      const commentData = {
        content: this.commentForm.value.content,
        email: this.authService.getCurrentUserEmail() || '',
        event: this.event
      };
  
      this.commentService.addComment(commentData).subscribe({
        next: (newComment) => {
          this.comments.push(newComment);
          this.commentForm.reset();
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          alert('Failed to add comment. Please try again.');
        }
      });
    }
  }
  startReply(commentId: number): void {
    this.replyingTo = commentId;
    this.editingComment = null;
  }

  cancelReply(): void {
    this.replyingTo = null;
    this.replyForm.reset();
  }

  submitReply(parentComment: EventComment): void {
    if (this.replyForm.valid && this.event) {
      const replyData = {
        content: this.replyForm.value.replyContent,
        email: this.authService.getCurrentUserEmail() || '',
        event: this.event,
        parentComment: parentComment
      };
  
      this.commentService.addComment(replyData).subscribe({
        next: (newReply) => {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          // S'assurer que la réponse a la bonne structure
          const completeReply: EventComment = {
            ...newReply,
            replies: [],
            parentComment: { 
              idComment: parentComment.idComment,
              content: parentComment.content 
            }
          };
          parentComment.replies.push(completeReply);
          this.replyingTo = null;
          this.replyForm.reset();
        },
        error: (error) => {
          console.error('Error adding reply:', error);
          if (error.error) {
            console.error('Server error:', error.error);
          }
          alert('Failed to add reply. Please try again.');
        }
      });
    }
  }
  startEdit(comment: EventComment): void {
    this.editingComment = comment.idComment!;
    this.replyingTo = null;
    // Utilisez le bon formulaire selon si c'est un commentaire ou une réponse
    if (comment.parentComment) {
      // C'est une réponse - utilisez replyForm
      this.replyForm.patchValue({ replyContent: comment.content });
    } else {
      // C'est un commentaire principal - utilisez commentForm
      this.commentForm.patchValue({ content: comment.content });
    }
  }

  cancelEdit(): void {
    this.editingComment = null;
    this.commentForm.reset();
    this.replyForm.reset();
  }
  
  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe(
        () => {
          this.comments = this.comments.filter(c => c.idComment !== commentId);
          this.comments.forEach(parent => {
            if (parent.replies) {
              parent.replies = parent.replies.filter(reply => reply.idComment !== commentId);
            }
          });
        },
        (error) => {
          console.error('Error deleting comment', error);
        }
      );
    }
  }

  canModify(comment: EventComment): boolean {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    return currentUserEmail === comment.email;
  }
}