import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizService } from 'src/app/core/services/GestionQuizz/quiz.service';
import { QuestionService } from 'src/app/core/services/GestionQuizz/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from 'src/app/core/models/QuestionQuizz/quiz';
import { Question } from 'src/app/core/models/QuestionQuizz/question';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizForm!: FormGroup;
  quizzes: Quiz[] = []; // To store all quizzes
  questions: Question[] = []; // To store all available questions
  selectedQuestions: Question[] = []; // To store selected questions for the quiz
  quizId?: number; // Optional quizId, for editing purposes

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get quizId from route params (for editing purposes)
    this.quizId = this.route.snapshot.params['id'];
    this.initForm();

    // If quizId exists, load quiz data for editing
    if (this.quizId) {
      this.loadQuiz();
    }

    // Fetch all quizzes and questions for listing
    this.quizService.getAllQuizzes().subscribe((data) => {
      this.quizzes = data;
    });

    this.questionService.getAllQuestions().subscribe((data) => {
      this.questions = data;
    });
  }

  // Initialize the form for quiz creation or editing
  initForm(): void {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      image: ['', Validators.required],
      questions: [[]] // Store selected questions
    });
  }

  // Load quiz data for editing (when quizId is provided)
  loadQuiz(): void {
    this.quizService.getQuizById(this.quizId!).subscribe((quiz) => {
      this.quizForm.patchValue({
        title: quiz.title,
        image: quiz.image,
        questions: quiz.questions || []
      });
      this.selectedQuestions = quiz.questions || []; // Preselect questions for the quiz
    });
  }

  // Submit form for creating or updating a quiz
  onSubmit(): void {
    const quizData: Quiz = {
      ...this.quizForm.value,
      questions: this.selectedQuestions // Assign selected questions to the quiz
    };

    if (this.quizId) {
      // Update existing quiz
      this.quizService.updateQuiz(this.quizId, quizData).subscribe(() => {
        this.router.navigate([`/questions/${this.quizId}`]); // Navigate to the quiz's question page
      });
    } else {
      // Create a new quiz
      this.quizService.createQuiz(quizData).subscribe((newQuiz) => {
        this.router.navigate([`/questions/${newQuiz.id}`]); // Navigate to the question page for the new quiz
      });
    }
  }
  navigateToQuestions(quizId: number | undefined): void {
    if (quizId !== undefined) {
      this.router.navigate([`/questions/${quizId}`]); // Navigate to the quiz's question page
    } else {
      console.error('Quiz ID is undefined.');
    }
  }

  // Toggle question selection
  toggleQuestionSelection(question: Question): void {
    const index = this.selectedQuestions.findIndex((q) => q.id === question.id);
    if (index >= 0) {
      this.selectedQuestions.splice(index, 1); // Remove from selected questions
    } else {
      this.selectedQuestions.push(question); // Add to selected questions
    }
  }

  // Edit a quiz (navigate to the edit page)
  editQuiz(quizId: number): void {
    this.router.navigate([`/quiz/${quizId}`]);
  }

  deleteQuiz(quizId: number | undefined): void {
    if (quizId !== undefined) {
      this.quizService.deleteQuiz(quizId).subscribe(() => {
        this.quizzes = this.quizzes.filter((quiz) => quiz.id !== quizId); // Remove quiz from list after deletion
      });
    } else {
      console.error('Quiz ID is undefined.');
    }
  }
}