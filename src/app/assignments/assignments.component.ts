import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
})
export class AssignmentsComponent implements OnInit {

  assignments:Assignment[] = [];


  constructor(private assignmentsService:AssignmentsService,private router: Router) {}

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    console.log("Dans ngOnInit, appelé avant l'affichage")
    // demander les données au service de gestion des assignments...
    this.assignmentsService.getAssignments()
    .subscribe(assignments => {
      console.log("données arrivées");
      this.assignments = assignments;
      console.log(this.assignments)
    });

    console.log("Après l'appel au service");
  }

  details(assignment : Assignment){
    this.router.navigate(['/assignment/'+assignment.id]);
  }

}
