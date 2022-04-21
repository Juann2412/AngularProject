import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  titre = 'Application de gestion des assignments...';
  isVisible = false;
  constructor(private authService:AuthService, private router:Router) {
  }
  ngOnInit(): void {
    if(localStorage.getItem('token') === null){
      this.isVisible = false
    }
    else{
      this.isVisible = true
    }
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
    return this.authService.loggedIn;
  }
}
