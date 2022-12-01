import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CinemaService } from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public currentVille:any;
  public currentCinema :any;
  public currentSeance : any;
  public currentProjection : any;

  public villes : any;
  public cinemas : any; 
  public salles : any; 
  public tickets : any; 
  public selectedTickets : any;

  constructor(public cinemaService:CinemaService) { 
   }

  // ngOnInit():this.villes   (update=>'this.villes' : liste des villes)
  ngOnInit(): void {
      this.cinemaService.getVilles()
          .subscribe(data =>{
              this.villes=data;
           } , error=>{
              console.log(error);
           })
  }

  // onGetCinemas(v):this.cinema   (update=>'this.cinemas' : liste des cinemas de 1 ville v)
  onGetCinemas(v : any){
    this.salles = undefined; // réinitialisation de la liste des salles dans page Html
    this.currentVille = v;
    this.cinemaService.getCinemas(v)
          .subscribe(data =>{
            this.cinemas=data;
          } , error=>{
            console.log(error);
          })
  }
  // onGetSalles(c):this.salles    (update=>'this.salles' : liste des salles de 1 cinema c ,
  //                                et pour chaque salle c, adjoint 1 attribut 'projections' qui
  //                                contient la liste des projections pour la salle c) 
  onGetSalles(c : any){
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
          .subscribe(data =>{
            this.salles=data;
            this.salles._embedded.salles.forEach( (salle:any) => {
              this.cinemaService.getProjections(salle)
                .subscribe(data =>{                   
                    salle.projections=data;
                } , error=>{
                    console.log(error);
                })
            }); 
          } , error=>{
            console.log(error);
          })
  }

    // onGetTicketsPlaces(p):this.currentProjection   (update=>'this.currentProjection.tickets' : 
    //                                                  liste des tickets de 1 projection p)
  public onGetTicketsPlaces(p:any){ 
    this.currentProjection = p;
    this.cinemaService.onGetTicketsPlaces(p)
    .subscribe(data =>{ 
      this.currentProjection.tickets= data;
      this.selectedTickets = [];
    } , error=>{
      console.log(error);
    })
  }

    // Met àjout la classe du bouton correspondant au ticket
    getTicketClass(ticket:any){
      let classe = "btn ticket ";
      if (ticket.reserve) {
        classe+="btn-danger";
      }else if(ticket.selected){
        classe = classe + "btn-warning";
      }else {
        classe = classe + "btn-success";
      }
      return classe;
  }

  // onGetReserveTicket(ticket)    (update=>'this.selectedTickets' 
  //                                ajoute un ticket au tableau, si le ticket a été selectionné 
  //                                supprime un ticket du tableau, si le ticket a été déselectionné)
  public onSelectTicket(ticket:any){
    if (!ticket.selected) {
      ticket.selected=true;
      this.selectedTickets.push(ticket);
    }else{
      ticket.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(ticket),1);
      //splice(4,3) on supprime 3 elements à partir de l'element numero 4
    }  
  }

  // onPayTickets(form:any) // paiement d'une liste de tickets
  onPayTickets(dataForm:any){
    let tickets : any = []; 
    this.selectedTickets.forEach( (t:any) => {
        tickets.push(t.id);
    });
    dataForm.tickets = tickets;
     /*  dataForm <=> { 'codePayement' : dataForm.codePayement, 'nomClient' : dataForm.nomClient, 
                        'tickets' : tickets  }; */
    this.cinemaService.PayerTickets(dataForm) 
     .subscribe( (data : any) =>{ 
          alert( data[0].nomClient + ", vos tickets ont été réservés avec succés !" );
          this.onGetTicketsPlaces(this.currentProjection);
    } , error=>{
        console.log(error);
    })

  }
}
