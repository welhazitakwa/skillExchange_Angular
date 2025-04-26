import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/core/services/GestionQuizz/quiz.service';
import { UserAnswer } from 'src/app/core/models/QuestionQuizz/userAnswer';
import { Result } from 'src/app/core/models/QuestionQuizz/result';
import { Question } from 'src/app/core/models/QuestionQuizz/question';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/core/services/GestionQuizz/question.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class FrontQuizComponent implements OnInit {
  quizId!: number;
  participationCourseId!: number;
  currentQuestionIndex: number = 0;
  questions: Question[] = [];
  selectedOption: string | null = null;
  loading: boolean = true;
  error: string | null = null;
  selectedAnswers: {[key: number]: string} = {};
  submitting: boolean = false;
  gettingHint: boolean = false;
  showHintModal: boolean = false;
  currentHint: string = '';

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
   private questionService: QuestionService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizId = +params['quizId'];
      this.participationCourseId = +params['participationId'];
      this.initializeQuiz();
    });
  }

  private initializeQuiz(): void {
    this.resetComponentState();
    this.loadQuiz();
  }

  private resetComponentState(): void {
    this.currentQuestionIndex = 0;
    this.selectedOption = null;
    this.questions = [];
    this.selectedAnswers = {};
    this.loading = true;
    this.error = null;
    this.submitting = false;
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  loadQuiz(): void {
    this.quizService.getQuizWithQuestions(this.quizId).subscribe({
      next: (quiz) => {
        this.questions = quiz.questions || [];
        this.loading = false;
      },
      error: (err) => {
        this.handleQuizLoadError(err);
      }
    });
  }

  private handleQuizLoadError(err: any): void {
    this.error = 'Failed to load quiz: ' + err.message;
    this.loading = false;
    console.error('Quiz load error:', err);
  }

  getQuestionOptions(question: Question): string[] {
    return [
      question.option1,
      question.option2,
      question.option3,
      question.option4
    ].filter(opt => opt?.trim());
  }

  selectOption(option: string): void {
    if (!this.currentQuestion?.id) return;
    
    this.selectedOption = option;
    this.selectedAnswers[this.currentQuestion.id] = option;
    this.submitAnswer(option);
  }

  submitAnswer(selectedOption: string): void {
    if (!this.currentQuestion?.id) return;

    const userAnswer: UserAnswer = {
      question: { id: this.currentQuestion.id },
      userAnswer: selectedOption
    };

    this.quizService.submitAnswer(this.quizId, userAnswer).subscribe({
      error: (err) => console.error('Error submitting answer:', err),
      complete: () => console.log('Answer submitted successfully')
    });
  }

  navigateQuestion(direction: 'next' | 'previous'): void {
    const newIndex = direction === 'next' 
      ? this.currentQuestionIndex + 1 
      : this.currentQuestionIndex - 1;
  
    if (newIndex >= 0 && newIndex < this.totalQuestions) {
      this.currentQuestionIndex = newIndex;
      this.selectedOption = this.selectedAnswers[this.currentQuestion?.id || 0] || null;
    }
  }

  submitResult(): void {
    if (!this.participationCourseId || this.participationCourseId <= 0) {
      console.error('Invalid participation ID:', this.participationCourseId);
      return;
    }

    const userAnswers = this.prepareSubmissionData();
    if (userAnswers.length === 0) {
      console.error('No answers to submit!');
      return;
    }

    this.submitting = true;
    this.quizService.submitResult(
      this.quizId,
      this.participationCourseId,
      userAnswers
    ).subscribe({
      next: (result) => this.handleSubmissionResult(result),
      error: (err) => this.handleSubmissionError(err),
      complete: () => this.submitting = false
    });
  }

  private prepareSubmissionData(): UserAnswer[] {
    return this.questions
      .filter(question => !!question.id)
      .map(question => ({
        question: { id: question.id! },
        userAnswer: this.selectedAnswers[question.id!] || ''
      }));
  }

  private handleSubmissionResult(result: Result): void {
    console.log('Quiz Result:', result);
    // The backend already handles email sending, just navigate to certificate
    this.router.navigate(['/certificate'], { 
      queryParams: { 
        score: result.score,
        passed: result.score >= 70
      } 
    });
  }

  private handleSubmissionError(err: any): void {
    console.error('Submission error:', err);
    this.error = 'Submission failed. Please try again.';
    this.submitting = false;
  }

  previousQuestion(): void {
    this.navigateQuestion('previous');
  }
  
  nextQuestion(): void {
    this.navigateQuestion('next');
  
  }
  getHint(): void {
    if (!this.currentQuestion?.id || this.gettingHint) return;
    
    this.gettingHint = true;
    console.log('Fetching hint for question ID:', this.currentQuestion.id);
    
    this.questionService.getQuestionHint(this.currentQuestion.id).subscribe({
      next: (response) => {
        console.log('Hint API Response:', response);
        this.currentHint = response.hint;
        this.showHintModal = true;
      },
      error: (err) => {
        console.error('Hint Error Details:', {
          status: err.status,
          message: err.message,
          url: err.url
        });
        this.currentHint = this.generateContextualHint();
        this.showHintModal = true;
      },
      complete: () => {
        this.gettingHint = false;
      }
    });
  }
  
  private generateContextualHint(): string {
    const q = this.currentQuestion?.question.toLowerCase() || '';
    const options = this.getQuestionOptions(this.currentQuestion!);
    
    // Enhanced fallback logic
    if (q.includes('capital')) return 'Consider national capitals in Europe';
    if (q.includes('seine')) return 'Think about famous landmarks in France';
    if (options.some(opt => opt.toLowerCase().includes('not'))) {
      return 'Pay attention to negative terms in the options';
    }
    return 'Review key terms in the question and options carefully';
  }

  closeHint(): void {
    this.showHintModal = false;
    this.currentHint = '';
  }
}
