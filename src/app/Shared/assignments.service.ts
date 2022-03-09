import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {
  assignments: Assignment[] = [];

  constructor(private loggingService: LoggingService, private http:HttpClient) {
    this.loggingService.setNiveauTrace(2);

  }


  url = "http://localhost:8010/api/assignments";

  getAssignments(): Observable<Assignment[]> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.url);
  }

  getAssignment(id: number): Observable<Assignment | undefined> {
    //let a = this.assignments.find(a => a.id === id);
    //return of(a);
    return this.http.get<Assignment>(`${this.url}/${id}`);
  }

  addAssignment(assignment: Assignment): Observable<any> {
    // this.assignments.push(assignment);

    this.loggingService.log(assignment.nom, "ajouté");

    return this.http.post<Assignment>(this.url, assignment);

    //return of("Assignment ajouté");
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    this.loggingService.log(assignment.nom, "modifié");

    return this.http.put<Assignment>(this.url, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    //let pos = this.assignments.indexOf(assignment);
    //this.assignments.splice(pos, 1);

    this.loggingService.log(assignment.nom, "supprimé");

    //return of("Assignment supprimé");
    return this.http.delete(this.url + "/" + assignment._id);
  }
}
