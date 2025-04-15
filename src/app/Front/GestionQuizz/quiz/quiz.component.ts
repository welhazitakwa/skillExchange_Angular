// quiz.component.ts
import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/core/services/GestionQuizz/quiz.service';
import { UserAnswer } from 'src/app/core/models/QuestionQuizz/userAnswer';
import { Result } from 'src/app/core/models/QuestionQuizz/result';
import { Question } from 'src/app/core/models/QuestionQuizz/question';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizId = +params['quizId'];
      this.participationCourseId = +params['participationId'] || 0;
      
      console.log('Quiz ID:', this.quizId);
      console.log('Participation Course ID:', this.participationCourseId);
  
      // Reset component state for new quiz
      this.currentQuestionIndex = 0;
      this.selectedOption = null;
      this.questions = [];
      this.loading = true;
  
      this.loadQuiz();
    });
  }
  get totalQuestions(): number {
    return this.questions.length;
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  loadQuiz(): void {
    this.quizService.getQuizQuestions(this.quizId).subscribe({
      next: (questions) => {
        this.questions = questions.map(q => ({
          ...q,
          quiz: q.quiz || { id: this.quizId }
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load quiz questions: ' + err.message;
        this.loading = false;
        console.error('Quiz load error:', err);
      }
    });
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
    this.selectedOption = option;
    this.submitAnswer(option);
  }

  submitAnswer(selectedOption: string): void {
    if (!this.currentQuestion?.id) {
      console.error('Missing question ID');
      return;
    }

    const userAnswer: UserAnswer = {
      question: { id: this.currentQuestion.id },
      participationCourse: { idp: this.participationCourseId },
      quiz: { id: this.quizId },
      userAnswer: selectedOption
    };

    this.quizService.submitAnswer(this.quizId, userAnswer).subscribe({
      error: (err) => console.error('Error submitting answer:', err),
      complete: () => console.log('Answer submitted successfully')
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
      this.selectedOption = null;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedOption = null;
    }
  }

  submitResult(): void {
    if (this.participationCourseId <= 0) {
      console.error('Invalid participation course ID:', this.participationCourseId);
      alert('Invalid participation course ID');
      return;
    }
  
    this.quizService.submitResult(this.quizId, this.participationCourseId).subscribe({
      next: (result) => {
        console.log('Quiz Result:', result);
        alert(`Quiz completed! Score: ${result.score}%`);
      },
      error: (err) => console.error('Error submitting result:', err)
    });
  }
}