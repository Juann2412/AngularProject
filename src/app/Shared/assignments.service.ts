import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {
  assignments:Assignment[] = [
    {
      nom: 'Devoir angular de Mr Buffa',
      dateDeRendu: new Date("2022-03-28"),
      rendu:false
    },
    {
      nom: 'Devoir Oracle de Mr Mopolo',
      dateDeRendu: new Date("2022-01-22"),
      rendu:true
    },
    {
      nom: 'Devoir Grails de Mr Galli',
      dateDeRendu: new Date("2022-04-01"),
      rendu:false
    },
];

  constructor(private loggingService:LoggingService) {
    this.loggingService.setNiveauTrace(2);

  }



  getAssignments():Observable<Assignment[]> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    return of(this.assignments);
  }

  addAssignment(assignment:Assignment):Observable<string> {
    this.assignments.push(assignment);

    this.loggingService.log(assignment.nom, "ajouté");

    return of("Assignment ajouté");
  }

  updateAssignment(assignment:Assignment):Observable<string> {
    this.loggingService.log(assignment.nom, "modifié");

    return of("Assignment modifié");
  }

  deleteAssignment(assignment:Assignment):Observable<string> {
    let pos = this.assignments.indexOf(assignment);
    this.assignments.splice(pos, 1);

    this.loggingService.log(assignment.nom, "supprimé");

    return of("Assignment supprimé");
  }
}
