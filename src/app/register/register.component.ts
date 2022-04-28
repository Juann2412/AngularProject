import { Component, OnInit } from '@angular/core';
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

  constructor( private router:Router,private auth : AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(){
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
       this.router.navigate(["/"])
     }
     else{
       this.auth.loggedIn = false
       console.log(response)
     }
   })
  }
}
