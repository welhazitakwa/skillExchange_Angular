import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  score: number = 0;
  passed: boolean = false;

  constructor(private route: ActivatedRoute,
     private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.score = +params['score'] || 0;
      this.passed = params['passed'] === 'true';
      
    });
  }
  retryQuiz(): void {
    // Add logic to restart the quiz if needed
    this.router.navigate(['/courses']); // Adjust route as needed
}
}