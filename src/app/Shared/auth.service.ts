import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../login/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn !: boolean;
  isVisibles : any
  url = "https://mbdsprojectbackapikj.herokuapp.com/api"
  //url = "http://localhost:8010/api";
  logIn(login:string, password:string) {
    // normalement il faudrait envoyer une requête sur un web service, passer le login et le password
    // et recevoir un token d'authentification, etc. etc.
   // this.loggedIn = true;
    // pour le moment, si on appelle cette méthode, on ne vérifie rien et on se loggue
    let user = new User();
    user.email = login
    user.password = password
    return this.http.post<any>(this.url+"/login",user);
  }

  register(login:string, password:string){
    let user = new User();
    user.email = login
    user.password = password;
    return this.http.post<any>(this.url+"/register",user);
  }

  logOut() {
    localStorage.removeItem('user')
    this.loggedIn = false;
  }

  isVisible(){
    this.isVisibles = new Promise((resolve) => {
      resolve(this.loggedIn)
    })
    return this.isVisibles
  }

  isAdmin() {
    let isUserAdmin = new Promise((resolve, reject) => {
      var session = localStorage.getItem('user')
      if(session !== null){
        let user = <User>JSON.parse(session)
        console.log("user est-il admin:"+ user.isAdmin)
        resolve(user.isAdmin)
      }
      else{
        console.log("dans resolve false")
        resolve(false);
      }
    });
    //return this.loggedIn;
    return isUserAdmin;
  }

  // isAdmin().then(admin => { if(admin) { console.log("L'utilisateur est administrateur"); }})

  constructor(private http:HttpClient) {
    let token = localStorage.getItem('user')
    if (token === null) {
      this.loggedIn = false
    } else {
      this.loggedIn = true
    }
   }
}
