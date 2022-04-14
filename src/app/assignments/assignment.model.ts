import { Matiere } from "./matiere.model";

export class Assignment{
  _id?:string;
  id!:number;
  eleve!: string;
  note!: number;
  remarque!: string;
  nom!:string;
  dateDeRendu!:Date;
  rendu!:boolean;
  matiere!: Number;
  matieres!: Matiere;
}
