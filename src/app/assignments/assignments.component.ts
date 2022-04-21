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

  pageNonRendu=1;
  limitNonRendu=10;
  totalPagesNonRendu=0;
  pagingCounterNonRendu=0;
  hasPrevPageNonRendu=false;
  hasNextPageNonRendu=true;
  prevPageNonRendu= 1;
  nextPageNonRendu= 2;


  constructor(private assignmentsService:AssignmentsService,private router: Router, private ngZone2: NgZone, private ngZone: NgZone) {}
  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;
  @ViewChild('scrollerNonRendu') scrollerNonRendu!: CdkVirtualScrollViewport;
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
        //console.log("val")
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
        if(this.hasNextPage === true){
          this.getAssignmentsScrollInfini();
        }
      })
    })

    this.scrollerNonRendu.elementScrolled().pipe(
      tap(event => {
        //console.log(event);
      }),
      map(event => {
        return this.scrollerNonRendu.measureScrollOffset('bottom');
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
       // console.log(val)
      }),
      throttleTime(200),
      tap(val => {
        //console.log(val);
       // console.log("next page:"+ this.hasNextPage)
      })
    ).subscribe(() => {
      // ici traitement final
      console.log("On va chercher de nouveaux assignments !")

      // on le fait en tache de fond...
      this.ngZone2.run(() => {
        this.pageNonRendu = this.nextPageNonRendu;

        if(this.hasNextPageNonRendu === true){
          this.getAssignmentsNonRenduScrollInfini();
        }

      })
    })
  }

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    console.log("Dans ngOnInit, appelé avant l'affichage")
    // demander les données au service de gestion des assignments...
    //this.assignmentsService.peuplerBD();
    console.log('verification si deja connecté');
    let token = localStorage.getItem('user')
    if (token === null) {
      this.router.navigate(['/login']);
    } else {
      this.getAssignments();
    }
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

    this.assignmentsService.getAssignmentsNonRendu(this.page, this.limit)
    .subscribe(reponse => {
      console.log("données arrivées");
      /*this.assignments = assignments;
      console.log(this.assignments)
      this.assignmentsRendu = this.assignments.filter(x => x.rendu === true);
      this.assignmentsNonRendu = this.assignments.filter(x => x.rendu === false);
      console.log(this.assignmentsNonRendu.length);*/
      console.log(reponse)
      this.assignmentsNonRendu = reponse.docs;
        this.pageNonRendu = reponse.page;
        this.limitNonRendu=reponse.limit;
        this.totalPagesNonRendu=reponse.totalPages;
        this.pagingCounterNonRendu=reponse.pagingCounter;
        this.hasPrevPageNonRendu=reponse.hasPrevPage;
        this.hasNextPageNonRendu=reponse.hasNextPage;
        this.prevPageNonRendu= reponse.prevPage;
        this.nextPageNonRendu= reponse.nextPage;
    });
  }

  getAssignmentsScrollInfini() {
    // demander les données au service de gestion des assignments...
    this.assignmentsService.getAssignments(this.page, this.limit)
    .subscribe(reponse => {
      console.log("données arrivées rendu");
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

  getAssignmentsNonRenduScrollInfini(){
    this.assignmentsService.getAssignmentsNonRendu(this.pageNonRendu, this.limitNonRendu)
    .subscribe(reponse => {
      console.log("données arrivées non rendu");
      //this.assignments = reponse.docs;
      // au lieu de remplacer les assignments chargés par les nouveaux, on les ajoute
      this.assignmentsNonRendu = this.assignmentsNonRendu.concat(reponse.docs);

      this.pageNonRendu = reponse.page;
      this.limitNonRendu=reponse.limit;
      this.totalPagesNonRendu=reponse.totalPages;
      this.pagingCounterNonRendu=reponse.pagingCounter;
      this.hasPrevPageNonRendu=reponse.hasPrevPage;
      this.hasNextPageNonRendu=reponse.hasNextPage;
      this.prevPageNonRendu= reponse.prevPage;
      this.nextPageNonRendu= reponse.nextPage;
    });
    console.log("Après l'appel au service non rendu");
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
