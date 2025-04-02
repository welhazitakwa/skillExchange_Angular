import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/core/services/GestionQuizz/question.service';
import { Question } from 'src/app/core/models/QuestionQuizz/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  quizId!: number;
  questions: Question[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  newQuestion: Question = { 
    question: '', 
    reponse: '', 
    option1: '', 
    option2: '', 
    option3: '', 
    option4: '', 
    quiz: { id: 0 }  // Ensure quiz object is present with ID
  };  

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute  
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId')); 

    if (!this.quizId) {
      this.errorMessage = "Quiz ID is missing in the URL!";
      this.loading = false;
      return;
    }

    this.newQuestion.quiz.id = this.quizId; // Assign quizId to new questions
    this.fetchQuestions();
  }

  fetchQuestions(): void {
    this.questionService.getQuestionsByQuizId(this.quizId).subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching questions:', error);
        this.errorMessage = 'Failed to load questions';
        this.loading = false;
      }
    });
  }

  addQuestion(): void {
    if (!this.newQuestion.question.trim()) {
      alert("Question cannot be empty.");
      return;
    }

    this.questionService.addQuestion(this.newQuestion).subscribe({
      next: (data) => {
        this.questions.push(data);
        this.resetForm();
        alert('Question added successfully');
      },
      error: (error) => {
        console.error('Error adding question:', error);
        this.errorMessage = 'Failed to add question';
      }
    });
  }

  editQuestion(question: Question): void {
    this.newQuestion = { ...question };  
  }

  updateQuestion(): void {
    if (!this.newQuestion.id) return;

    this.questionService.editQuestion(this.newQuestion.id, this.newQuestion).subscribe({
      next: (updatedQuestion) => {
        const index = this.questions.findIndex(q => q.id === updatedQuestion.id);
        if (index !== -1) {
          this.questions[index] = updatedQuestion;
        }
        this.resetForm();
        alert('Question updated successfully');
      },
      error: (error) => {
        console.error('Error updating question:', error);
        this.errorMessage = 'Failed to update question';
      }
    });
  }

  deleteQuestion(id: number): void {
    if (confirm("Are you sure you want to delete this question?")) {
      this.questionService.deleteQuestion(id).subscribe({
        next: () => {
          this.questions = this.questions.filter(q => q.id !== id);
          alert('Question deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting question:', error);
          this.errorMessage = 'Failed to delete question';
        }
      });
    }
  }

  resetForm(): void {
    this.newQuestion = { 
      question: '', 
      reponse: '', 
      option1: '', 
      option2: '', 
      option3: '', 
      option4: '', 
      quiz: { id: this.quizId } 
    };
  }
}
