import { Component, OnInit } from '@angular/core';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { MatieresService } from 'src/app/shared/matieres.service';
import { Assignment } from '../assignment.model';
import { Matiere } from '../matiere.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

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

  constructor(private assignmentsService: AssignmentsService,
    private matiereService: MatieresService,
    private route: ActivatedRoute, private router: Router,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    let token = localStorage.getItem('user')
    if (token === null) {
      this.router.navigate(['/login']);
    }
    else{
      this.getMatiere();
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
    if ((!this.nomAssignment) || (!this.dateDeRendu)) return;
    console.log(
      'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu + ' matiere = ' + this.selectedMatiere.id
    );

    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random() * 10000000);
    newAssignment.nom = this.nomAssignment;
    newAssignment.eleve = this.nomEleve;
    newAssignment.dateDeRendu = this.dateDeRendu;
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
