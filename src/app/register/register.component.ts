import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../login/user.model';
import { AuthService } from '../Shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email!: string;
  password !: string;
  confirmpassword !: string;
  errorEmail: boolean =false
  errorPassword: boolean =false
  errorConfirmPassword: boolean =false
  errorEqualsPassword: boolean =false
  constructor( private router:Router,private auth : AuthService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  validateForm(){
    !this.email || this.email==undefined ? this.errorEmail= true : this.errorEmail= false
    !this.password || this.password == undefined ? this.errorPassword= true : this.errorPassword= false
    !this.confirmpassword || this.confirmpassword == undefined ? this.errorConfirmPassword= true : this.errorConfirmPassword= false
    this.password != this.confirmpassword ?this.errorEqualsPassword = true : this.errorConfirmPassword = false
    if(this.errorEmail || this.errorPassword || this.confirmpassword)
      return true
   else
       return false

 }

  onSubmit(){
    if(this.validateForm()) return
    else{
      this.auth.register(this.email,this.password)
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
         let config = new MatSnackBarConfig();
        config.duration = 2000;
        config.verticalPosition = "bottom";
        this._snackBar.open("Félicitation,inscription a été effectué avec succès","",config);
         this.router.navigate(["/"])
       }
       else{
         this.auth.loggedIn = false
         console.log(response)
       }
     })
    }

  }
}
