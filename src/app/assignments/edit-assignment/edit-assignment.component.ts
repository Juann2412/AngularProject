import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/Shared/assignments.service';
import { Assignment } from '../assignment.model';
import { Matiere } from '../matiere.model';
import { MatieresService } from 'src/app/Shared/matieres.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss'],
})
export class EditAssignmentComponent implements OnInit {
  assignment!: Assignment | undefined;
  nomAssignment!: string;
  dateDeRendu!: Date;
  nomEleve!: string;
  selectedMatiere: Matiere = new Matiere;
  matiere: Matiere[] = [];
  idMatiere !: Number;
  noteAssignment!: number;
  remarqueAssignment!: string;
  firstFormGroup !: FormGroup;
  secondFormGroup !: FormGroup;
  thirdFormGroup !: FormGroup;
  fourthFormGroup !: FormGroup;
  fifthFormGroup !: FormGroup;
  sixthFormGroup !: FormGroup;
  isLinear = false;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private matiereService: MatieresService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // ici un exemple de récupération des query params et du fragment
    let queryParams = this.route.snapshot.queryParams;
    console.log("Query params :")
    console.log(queryParams);
    console.log("Fragment :")
    console.log(this.route.snapshot.fragment);

    this.getAssignment();
    this.getMatiere();
  }

  getAssignment() {
    // on récupère l'id dans le snapshot passé par le routeur
    // le "+" force l'id de type string en "number"
    const id = +this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (!assignment) return;

      this.assignment = assignment;

      this.idMatiere = assignment.matiere;

      // Pour pré-remplir le formulaire
      /**this.nomAssignment = assignment.nom;
      this.dateDeRendu = assignment.dateDeRendu;
      this.nomEleve = assignment.eleve;
      this.noteAssignment = assignment.note;
      this.remarqueAssignment = assignment.remarque;
      **/

      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
        assignmentCtrl: [assignment.nom, Validators.required],
      });
      this.thirdFormGroup = this._formBuilder.group({
        eleveCtrl: [assignment.eleve, Validators.required],
      });
      this.fourthFormGroup = this._formBuilder.group({
        dateCtrl: [assignment.dateDeRendu, Validators.required],
      });
      this.fifthFormGroup = this._formBuilder.group({
        noteCtrl: [assignment.note, Validators.required],
      });
      this.sixthFormGroup = this._formBuilder.group({
        remarqueCtrl: [assignment.remarque, Validators.required],
      });
    });
  }

  getMatiere() {

    this.matiereService.getMatiere().subscribe((matiere) => {
      if (!matiere) return;

      this.matiere = matiere;

      for (let mat of this.matiere) {
        if (mat.id == this.idMatiere)
          this.selectedMatiere = mat;
      }
    });
  }

  onSaveAssignment() {
    if (!this.assignment) return;
    if ((!this.secondFormGroup.controls['assignmentCtrl'].value) || (!this.thirdFormGroup.controls['eleveCtrl'].value) || (!this.fourthFormGroup.controls['dateCtrl'].value)) return;
    console.log(
      'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu + ' matiere = ' + this.selectedMatiere.id
    );

    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.secondFormGroup.controls['assignmentCtrl'].value;
    this.assignment.eleve = this.thirdFormGroup.controls['eleveCtrl'].value;
    this.assignment.dateDeRendu = this.fourthFormGroup.controls['dateCtrl'].value;
    this.assignment.note = this.fifthFormGroup.controls['noteCtrl'].value;
    this.assignment.remarque = this.sixthFormGroup.controls['remarqueCtrl'].value;
    this.assignment.matiere = this.selectedMatiere.id;

    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((reponse) => {
        console.log(reponse.message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
  }
}
