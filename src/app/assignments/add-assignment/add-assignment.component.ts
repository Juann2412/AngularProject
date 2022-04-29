import { Component, OnInit } from '@angular/core';
import { AssignmentsService } from 'src/app/Shared/assignments.service';
import { MatieresService } from '../../Shared/matieres.service';
import { Assignment } from '../assignment.model';
import { Matiere } from '../matiere.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss'],
})
export class AddAssignmentComponent implements OnInit {
  // Champ de formulaire
  nomAssignment!: string;
  nomEleve!: string;
  dateDeRendu!: Date;
  matiere: Matiere[] = [];
  selectedMatiere : Matiere = new Matiere;
  firstFormGroup !: FormGroup;
  secondFormGroup !: FormGroup;
  thirdFormGroup !: FormGroup;
  fourthFormGroup !: FormGroup;
  isLinear = false;
  

  constructor(private assignmentsService: AssignmentsService,
    private matiereService: MatieresService,
    private route: ActivatedRoute, private router: Router,private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let token = localStorage.getItem('user')
    if (token === null) {
      this.router.navigate(['/login']);
    }
    else{
      this.getMatiere();

      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
        assignmentCtrl: ['', Validators.required],
      });  
      this.thirdFormGroup = this._formBuilder.group({
        eleveCtrl: ['', Validators.required],
      });
      this.fourthFormGroup = this._formBuilder.group({
        dateCtrl: ['', Validators.required],
      }); 
    }

  }

  getMatiere() {

    this.matiereService.getMatiere().subscribe((matiere) => {
      if (!matiere) return;
      this.matiere = matiere;
      this.selectedMatiere = matiere[0];
      console.log(this.selectedMatiere)
    });
  }

  onSubmit() {
    if ((!this.secondFormGroup.controls['assignmentCtrl'].value) || (!this.thirdFormGroup.controls['eleveCtrl'].value) || (!this.fourthFormGroup.controls['dateCtrl'].value)) return;
    console.log(
      //'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu + ' matiere = ' + this.selectedMatiere.id
      '1 = ' + this.selectedMatiere.id + ' 2 = ' + this.secondFormGroup.controls['assignmentCtrl'].value
    );

    
    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random() * 10000000);
    newAssignment.nom = this.secondFormGroup.controls['assignmentCtrl'].value;
    newAssignment.eleve = this.thirdFormGroup.controls['eleveCtrl'].value;
    newAssignment.dateDeRendu = this.fourthFormGroup.controls['dateCtrl'].value;
    newAssignment.rendu = false;
    newAssignment.matiere = this.selectedMatiere.id;

    this.assignmentsService.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);

        // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
        // en gros, demander de naviguer vers /home
        let config = new MatSnackBarConfig();
        config.duration = 2000;
        config.verticalPosition = "bottom";
        this._snackBar.open("Ajout d'assignment avec succès","",config);
        this.router.navigate(["/home"]);
      })
  }
  
}
