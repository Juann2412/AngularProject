import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.scss']
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis?:Assignment;
  @Output() deleteAssignment = new EventEmitter<Assignment>();

  constructor(private assignmentsService:AssignmentsService,
    private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    // on va récupérer l'id dans l'URL,
    // le + permet de forcer en number (au lieu de string)
    const id = +this.route.snapshot.params['id'];
    this.getAssignment(id);
  }

  getAssignment(id:number) {
    // on demande au service de gestion des assignment,
    // l'assignment qui a cet id !
    this.assignmentsService.getAssignment(id)
    .subscribe(assignment => {
      this.assignmentTransmis = assignment;
    })
  }

  onAssignmentRendu() {
    if(this.assignmentTransmis) {
      this.assignmentTransmis.rendu = true;

      this.assignmentsService.updateAssignment(this.assignmentTransmis)
      .subscribe(message => {
        console.log(message);
        // et on navigue vers la page d'accueil pour afficher la liste
        this.router.navigate(["/home"]);
      })
    }
  }

  onDelete() {
    if(! this.assignmentTransmis) return;

    this.assignmentsService.deleteAssignment(this.assignmentTransmis)
    .subscribe(message => {
      console.log(message);
      // et on navigue vers la page d'accueil pour afficher la liste
      this.router.navigate(["/home"]);
    })
  }
}
