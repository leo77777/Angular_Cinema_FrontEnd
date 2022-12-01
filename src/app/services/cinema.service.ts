import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  public host:String ="http://localhost:8080";

  constructor( private http: HttpClient) {}
  
  // getVilles(): retourne un tableau de la liste des villes
  // http://localhost:8080/villes
  public getVilles(){
    return this.http.get(this.host + "/villes"); 
  }

  // getCinemas(v): retourne un tableau de la liste des cinemas pour 1 ville 'v'(parametre)
  // v._links.cinemas.href  <=>   http://localhost:8080/villes/1/cinemas
  getCinemas(v : any) {
    return this.http.get( v._links.cinemas.href );
  }

  // getSalles(c): retourne un tableau de la liste des salles pour 1 cinema 'c'(parametre)
  // c._links.salles.href  <=>   http://localhost:8080/cinemas/1/salles
  getSalles(c : any) {
    return this.http.get( c._links.salles.href );
  }

  // getProjections(s): retourne un tableau de la liste des projections pour 1 salle 's'(parametre)
  // s._links.projections.href?projection=p1  <=>   http://localhost:8080/salles/1/projections?projection=p1
  getProjections(s : any) { 
    let url : String =  s._links.projections.href; 
    url = url.replace( "{?projection}","");
    return this.http.get(url + "?projection=p1");
  }

  // onGetTicketsPlaces(p): retourne un tableau de la liste des tickets pour 1 projection 'p'(parametre)
  // p._links.tickets.href?projection=ticketProj  <=>   http://localhost:8080/projections/1/tickets?projection=ticketProj
  onGetTicketsPlaces(p:any){
    let url : String = p._links.tickets.href; 
    url = url.replace( "{?projection}","");
    return this.http.get(url + "?projection=ticketProj");
  }  

  // PayerTicket(t:any) : retourne la liste des tickets réservés
  PayerTickets(dataForm:any){
    return this.http.post(this.host + "/payerTickets" , dataForm );
  } 
}
