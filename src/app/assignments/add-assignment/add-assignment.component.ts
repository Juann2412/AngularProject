import { Component, OnInit } from '@angular/core';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { MatieresService } from 'src/app/shared/matieres.service';
import { Assignment } from '../assignment.model';
import { Matiere } from '../matiere.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss'],
})
export class AddAssignmentComponent implements OnInit {
  // Champ de formulaire
  nomAssignment!: string;
  nomEleve!: string;
  idMatiere!: number;
  dateDeRendu!: Date;
  matiere: Matiere[] = [];

  constructor(private assignmentsService: AssignmentsService,
    private matiereService: MatieresService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getMatiere();
  }

  getMatiere() {

    this.matiereService.getMatiere().subscribe((matiere) => {
      if (!matiere) return;

      this.matiere = matiere;
    });
  }

  onSubmit() {
    if ((!this.nomAssignment) || (!this.dateDeRendu)) return;
    console.log(
      'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu + ' matiere = ' + this.idMatiere
    );

    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random() * 10000000);
    newAssignment.nom = this.nomAssignment;
    newAssignment.eleve = this.nomEleve;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = false;
    newAssignment.matiere = this.idMatiere;

    this.assignmentsService.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);

        // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
        // en gros, demander de naviguer vers /home
        this.router.navigate(["/home"]);
      })
  }
}
