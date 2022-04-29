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
  error:boolean=false
  errorEmail:boolean= false
  errorPassword: boolean = false
  constructor( private router:Router,private auth : AuthService ) { }

  ngOnInit(): void {
    //this.app.isVisible= false

  }

  validateForm(){
     !this.email || this.email==undefined ? this.errorEmail= true : this.errorEmail= false
     !this.password || this.password == undefined ? this.errorPassword= true : this.errorPassword= false
     if(this.errorEmail || this.errorPassword)
       return true
    else
        return false

  }

  onSubmit(){
    if(this.validateForm()) return
    else{
      this.auth.logIn(this.email,this.password)
      .subscribe(response => {
        console.log(response)
       if(response.auth === true && response.token !== null){
        console.log("dans if")
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
        console.log("dans else")
         this.auth.loggedIn = false
         this.error = true
         console.log(response)

       }
     })
    }


  }

}
