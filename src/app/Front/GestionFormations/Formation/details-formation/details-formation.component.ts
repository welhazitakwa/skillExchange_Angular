import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';

@Component({
  selector: 'app-details-formation',
  templateUrl: './details-formation.component.html',
  styleUrls: ['./details-formation.component.css'],
})
export class DetailsFormationComponent {
  id!: number;
  formation?: Formation;
  category?: Category;

  constructor(
    private actR: ActivatedRoute,
    private formServ: FormationService,
    private catServ: CategoryService,
    private Rout: Router,
    private dialogRef: MatDialogRef<DetailsFormationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    //getFormationBy Id
    this.id = this.data.id;
    this.formServ.getFormationById(this.id).subscribe((donne) => {
      this.formation = donne;
      console.log('iiddd fooormmmm:' + this.formation.id);

      //getCategory By Id
      this.catServ.getCategoryById(this.formation.category.id).subscribe((donne) => {
        this.category = donne;
        console.log('heddhii cat mel details : ' + this.category);
      });
    });


  }

  convertDuration(duration: number): string {
    const hours = Math.floor(duration / 60); // Nombre d'heures
    const minutes = duration % 60; // Nombre de minutes restantes
    return `${hours}h ${minutes}min`;
  }
}
