import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './login/user.model';
import { AuthService } from './Shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  titre = 'Application de gestion des assignments...';
   user !: User;
  constructor(private authService:AuthService, private router:Router) {
  }
  ngOnInit(): void {
    console.log("dans app")
  }
  /*
  onLoginLogout() {
    if(this.authService.loggedIn) {
      console.log("je me deloggue");
      this.authService.logOut();
      // et je navigue vers la page d'accueil
      this.router.navigate(["/home"]);
    } else {
      console.log("je me loggue");
      this.authService.logIn("Juann", "monpassword");
    }
  }
*/
  logout(){
    this.authService.logOut();
     this.router.navigate(["/login"],{replaceUrl:true})
  }

  isLogged() {
    console.log("dans islogged:"+this.authService.loggedIn)
    return this.authService.loggedIn;
  }

}
