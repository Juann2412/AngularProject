import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthService } from '../shared/auth.service';
import { User } from './user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email!: string;
  password !: string;
  constructor( private router:Router,private auth : AuthService ) { }

  ngOnInit(): void {
    //this.app.isVisible= false
  }

  onSubmit(){
    this.auth.logIn(this.email,this.password)
     .subscribe(response => {
       console.log(response)
      if(response.auth === true && response.token !== null){
        let connectedUser = new User()
        connectedUser.token = response.token
        connectedUser.isAdmin = response.user.isAdmin
        localStorage.setItem('user',JSON.stringify(connectedUser))
        //this.app.isVisible = true
        this.auth.loggedIn = true
        console.log(JSON.stringify(connectedUser))
        this.router.navigate(["/"])
      }
      else{
        console.log(response)
      }
    })

  }

}
