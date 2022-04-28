import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Shared/auth.service';
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

    return
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
        console.log("dans oui")
        console.log(JSON.stringify(connectedUser))
        this.router.navigate(["/"])
      }
      else{
        this.auth.loggedIn = false
        console.log(response)
      }
    })

  }

}
