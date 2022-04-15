import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
})
export class AssignmentsComponent implements OnInit {

  assignments:Assignment[] = [];
  assignmentsNonRendu: Assignment[] = [];
  assignmentsRendu: Assignment[] = [];
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu'];
  // pagination
  page=1;
  limit=10;
  totalPages=0;
  pagingCounter=0;
  hasPrevPage=false;
  hasNextPage=true;
  prevPage= 1;
  nextPage= 2;


  constructor(private assignmentsService:AssignmentsService,private router: Router, private ngZone: NgZone) {}
  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;
  ngAfterViewInit():void{
    this.scroller.elementScrolled().pipe(
      tap(event => {
        //console.log(event);
      }),
      map(event => {
        return this.scroller.measureScrollOffset('bottom');
      }),
      tap(val => {
        //console.log("distance par rapport à la fin = " + val)
      }),
      pairwise(),
      tap(val => {
        /*
        if(val[0] < val[1]) console.log("on monte")
        else console.log("on descend")
        */
      }),
      filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
      tap(val => {
        //console.log(val)
      }),
      throttleTime(200),
      tap(val => {
        //console.log(val);
      })
    ).subscribe(() => {
      // ici traitement final
      console.log("On va chercher de nouveaux assignments !")

      // on le fait en tache de fond...
      this.ngZone.run(() => {
        this.page = this.nextPage;
        this.getAssignmentsScrollInfini();
      })
    })
  }

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    console.log("Dans ngOnInit, appelé avant l'affichage")
    // demander les données au service de gestion des assignments...
    //this.assignmentsService.peuplerBD();
    this.getAssignments();

    console.log("Après l'appel au service");

  }

  getAssignments(){
    this.assignmentsService.getAssignments(this.page, this.limit)
    .subscribe(reponse => {
      console.log("données arrivées");
      /*this.assignments = assignments;
      console.log(this.assignments)
      this.assignmentsRendu = this.assignments.filter(x => x.rendu === true);
      this.assignmentsNonRendu = this.assignments.filter(x => x.rendu === false);
      console.log(this.assignmentsNonRendu.length);*/
      console.log(reponse)
      this.assignments = reponse.docs;
        this.page = reponse.page;
        this.limit=reponse.limit;
        this.totalPages=reponse.totalPages;
        this.pagingCounter=reponse.pagingCounter;
        this.hasPrevPage=reponse.hasPrevPage;
        this.hasNextPage=reponse.hasNextPage;
        this.prevPage= reponse.prevPage;
        this.nextPage= reponse.nextPage;
    });
  }

  getAssignmentsScrollInfini() {
    // demander les données au service de gestion des assignments...
    this.assignmentsService.getAssignments(this.page, this.limit)
    .subscribe(reponse => {
      console.log("données arrivées");
      //this.assignments = reponse.docs;
      // au lieu de remplacer les assignments chargés par les nouveaux, on les ajoute
      this.assignments = this.assignments.concat(reponse.docs);

      this.page = reponse.page;
      this.limit=reponse.limit;
      this.totalPages=reponse.totalPages;
      this.pagingCounter=reponse.pagingCounter;
      this.hasPrevPage=reponse.hasPrevPage;
      this.hasNextPage=reponse.hasNextPage;
      this.prevPage= reponse.prevPage;
      this.nextPage= reponse.nextPage;
    });

    console.log("Après l'appel au service");
}

  pagePrecedente() {
    this.page--;
    this.getAssignments();
  }

  pageSuivante() {
    this.page++;
    this.getAssignments();
  }

  premierePage() {
    this.page = 1;
    this.getAssignments();
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }

  details(assignment : Assignment){
    this.router.navigate(['/assignment/'+assignment.id]);
  }

}
