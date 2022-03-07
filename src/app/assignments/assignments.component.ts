import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit {

  constructor() { }

  // appele le contructeur et AVANT l'affichage du composant 
  ngOnInit(): void {
  }

}
