import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Matiere } from '../assignments/matiere.model';

@Injectable({
  providedIn: 'root'
})
export class MatieresService {

  constructor(private http:HttpClient) { }
  url = "http://localhost:8010/api/matiere";

  getMatiere():Observable<Matiere[]>{
    return this.http.get<Matiere[]>(this.url);
  }
}
