import { Component, OnInit } from '@angular/core';
import { CertificatService } from 'src/app/core/services/GestionQuizz/certificat.service';
import { Certificat } from 'src/app/core/models/QuestionQuizz/certificat';

@Component({
  selector: 'app-certificat',
  templateUrl: './certificat.component.html',
  styleUrls: ['./certificat.component.css']
})
export class CertificatComponent implements OnInit {
  certificats: Certificat[] = [];

  constructor(private certificatService: CertificatService) {}

  ngOnInit(): void {
    this.certificatService.getAllCertificats().subscribe(data => {
      this.certificats = data;
    });
  }
}
