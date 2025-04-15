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
  selectedFile: File | null = null; // To store the selected file
  imageUrl: string | null = null; // To store the existing image URL (or preview URL)

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

  // Initialize the form for quiz creation or editing.
  // Note: We remove the "image" control because we handle file input separately.
  initForm(): void {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      questions: [[]] // Store selected questions
    });
  }

  // Load quiz data for editing (when quizId is provided)
  loadQuiz(): void {
    this.quizService.getQuizById(this.quizId!).subscribe((quiz) => {
      this.quizForm.patchValue({
        title: quiz.title,
        questions: quiz.questions || []
      });
      this.selectedQuestions = quiz.questions || []; // Preselect questions for the quiz
      // Set the imageUrl from the quiz data so that it displays in the template
      this.imageUrl = quiz.image ? quiz.image : null;
    });
  }

  // Handle file selection from the file input.
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Optional: Create a local preview URL for the selected file
      this.imageUrl = URL.createObjectURL(file);
    }
  }

  // Submit form for creating or updating a quiz.
  // We create a FormData object and append the title, file, and questions.
  onSubmit(): void {
    const formData: FormData = new FormData();
    formData.append('title', this.quizForm.get('title')!.value);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else {
      console.error('No file selected');
    }
    
    // Append selected questions as JSON, if your backend expects them.
    formData.append('questions', JSON.stringify(this.selectedQuestions));

    if (this.quizId) {
      // Update existing quiz
      this.quizService.updateQuiz(this.quizId, formData).subscribe(() => {
        this.router.navigate([`/questions/${this.quizId}`]);
      });
    } else {
      // Create a new quiz
      this.quizService.createQuiz(formData).subscribe((newQuiz) => {
        this.router.navigate([`/questions/${newQuiz.id}`]);
      });
    }
  }

  // Navigate to questions for the given quiz.
  navigateToQuestions(quizId: number | undefined): void {
    if (quizId !== undefined) {
      this.router.navigate([`/questions/${quizId}`]);
    } else {
      console.error('Quiz ID is undefined.');
    }
  }

  // Toggle question selection
  toggleQuestionSelection(question: Question): void {
    const index = this.selectedQuestions.findIndex((q) => q.id === question.id);
    if (index >= 0) {
      this.selectedQuestions.splice(index, 1);
    } else {
      this.selectedQuestions.push(question);
    }
  }

  // Edit a quiz (navigate to the edit page)
  editQuiz(quizId: number): void {
    this.router.navigate([`/quiz/${quizId}`]);
  }

  // Delete a quiz
  deleteQuiz(quizId: number | undefined): void {
    if (quizId !== undefined) {
      this.quizService.deleteQuiz(quizId).subscribe(() => {
        this.quizzes = this.quizzes.filter((quiz) => quiz.id !== quizId); // Remove the deleted quiz from the array
      }, (error) => {
        console.error('Error deleting quiz:', error);
      });
    } else {
      console.error('Quiz ID is undefined.');
    }
  }
  loadQuizForEdit(quiz: any): void {
    this.quizId = quiz.id;
    this.quizForm.patchValue({
      title: quiz.title,
    });
  
    this.imageUrl = 'data:image/jpeg;base64,' + quiz.image;
  }
  
}
