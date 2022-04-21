import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/login/user.model';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.scss']
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis?:Assignment;
  @Output() deleteAssignment = new EventEmitter<Assignment>();
  noteAssignment!: number;
  remarqueAssignment?: string;

  constructor(private assignmentsService:AssignmentsService,
    private route:ActivatedRoute, private router:Router , private authService : AuthService) { }

  ngOnInit(): void {
    // on va récupérer l'id dans l'URL,
    // le + permet de forcer en number (au lieu de string)
    let token = localStorage.getItem('user')
    if (token === null) {
      this.router.navigate(['/login']);
    }
    else{
      const id = +this.route.snapshot.params['id'];
      this.getAssignment(id);
    }

  }

  getAssignment(id: number) {
    // on demande au service de gestion des assignment,
    // l'assignment qui a cet id !
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment;
    });
  }

  onAssignmentRendu() {
    if (this.assignmentTransmis) {
      this.assignmentTransmis.rendu = true;

      this.assignmentsService
        .updateAssignment(this.assignmentTransmis)
        .subscribe((reponse) => {
          console.log(reponse.message);
          // et on navigue vers la page d'accueil pour afficher la liste
          this.router.navigate(['/home']);
        });
    }
  }

  onDelete() {
    if (!this.assignmentTransmis) return;

    this.assignmentsService
      .deleteAssignment(this.assignmentTransmis)
      .subscribe((reponse) => {
        console.log(reponse.message);
        // et on navigue vers la page d'accueil pour afficher la liste
        this.router.navigate(['/home']);
      });
  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTransmis?.id, 'edit'], {
      queryParams: {
        name: 'Michel Buffa',
        job: 'Professeur',
      },
      fragment: 'edition',
    });
  }

  isLoggedIn() {
   // var admin = this.authService.isAdmin().then(admin => {return admin})
    //    return this.authService.isAdmin;
    let session = localStorage.getItem('user')
    if(session !== null){
      let user = <User> JSON.parse(session)
      return user.isAdmin
    }
    return false

  }

  onSubmit() {
    if((!this.noteAssignment)) return;
    console.log(
      'note = ' + this.noteAssignment + ' remarque = ' + this.remarqueAssignment + ''
    );
    if (this.assignmentTransmis) {
      this.assignmentTransmis.rendu = true;
      this.assignmentTransmis.note = this.noteAssignment;
      if(this.remarqueAssignment)
        this.assignmentTransmis.remarque = this.remarqueAssignment;


      this.assignmentsService
        .updateAssignment(this.assignmentTransmis)
        .subscribe((reponse) => {
          console.log(reponse.message);
          // et on navigue vers la page d'accueil pour afficher la liste
          this.router.navigate(['/home']);
        });
    }
  }
}
