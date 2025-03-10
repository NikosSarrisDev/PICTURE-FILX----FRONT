import {Component, OnInit} from '@angular/core';
import {RemoteDataService} from '../../../remotedata.service';
import {MessageService} from 'primeng/api';
import {DataService} from '../../../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {Toast} from 'primeng/toast';
import {AuthenticationService} from '../../../auth.service';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-buy-ticket-add-show-remaining',
  standalone: true,
  imports: [
    NgForOf,
    Toast,
    NgStyle,
    NgIf,
    ProgressSpinner
  ],
  templateUrl: './buy-ticket-add-show-remaining.component.html',
  styleUrl: './buy-ticket-add-show-remaining.component.css',
  providers: [MessageService]
})
export class BuyTicketAddShowRemainingComponent implements OnInit {

  seatsToSend: string[] = [];
  seats: any[][] = Array.from({length: 5}, () => Array(20).fill(null));
  movieTitle!: string;
  movieId!: number;
  roomTitle!: string;
  allTicketsONSpecificRoom!: number;
  remainingTicketsONSpecificRoom!: number;
  date!: any;
  time!: any;
  amount!: any;
  ticketsEnabled: boolean = true;
  user!: any;
  numOfTicketsUser!: number;
  numOfTicketsMovie!: number;
  ticketCounter!: number;
  isTicketSendToEmail!: boolean;
  emailTravelling!: boolean;

  constructor(private remoteDataService: RemoteDataService,
              private messageService: MessageService,
              public dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.isTicketSendToEmail = false;
    this.emailTravelling = false;
    this.route.queryParams.subscribe((params) => {
      this.movieTitle = params["movieTitle"];
      this.roomTitle = params["roomTitle"];
      this.amount = params["amount"];
      this.ticketCounter = params["ticketCounter"];
      this.date = params["date"];
      this.time = params["time"];
    })
    this.getRoom({ title: this.roomTitle });
    this.getMovie({ title: this.movieTitle });
    this.user = this.auth.currentUser();
  }



  getUserByName(data: any) {
    this.dataService.getUser(data).subscribe((response) => {
      this.numOfTicketsUser = response.data[0].numOfTickets;
      this.updateUserNumOfTickets({ id: response.data[0].id, numOfTickets: Number(this.numOfTicketsUser) + Number(this.ticketCounter), hasEntered: false });
    })
  }

  updateUserNumOfTickets(data: any) {
    console.log(this.numOfTicketsMovie + this.ticketCounter)

    //If the tickets get canceled then the user update no values in db in this way i will not update the movie also
    if (!this.ticketsEnabled) {
      this.dataService.updateUserDetails({}).subscribe((response) => {
        this.router.navigate(['/']);
      });
    } else {
      this.dataService.updateUserDetails(data).subscribe((response) => {

        //Also update the movie ticket count
        this.dataService.updateMovie({ id: this.movieId, ticketCount: Number(this.numOfTicketsMovie) + Number(this.ticketCounter) }).subscribe((response) => {
          this.router.navigate(['/']);
        })
      })
    }
  }

  getMovie(data: any) {
    this.dataService.getMovie(data).subscribe((response) => {
      this.movieId = response.data[0].id;
      this.numOfTicketsMovie = response.data[0].ticketCounter;
    })
  }

  getRoom(data: any){
    this.dataService.getRoom(data).subscribe((response) => {
      this.allTicketsONSpecificRoom = response.data[0].availableNumberOfSeats;
      this.getReservedSeats({ roomTitle: response.data[0].title, reserved: true });
      this.getSelectedSeats({ roomTitle: response.data[0].title, selected: true });
    })
  }

  getReservedSeats(data: any) {
    this.dataService.getSeat(data).subscribe((response) => {
      this.remainingTicketsONSpecificRoom = this.allTicketsONSpecificRoom - response.total;
    });
  }

  getSelectedSeats(data: any) {
    this.dataService.getSeat(data).subscribe((response) => {
      response.data.forEach((seat: any) => {
        this.seatsToSend.push(seat.title);
        this.seats[seat.row - 1][seat.col - 1] = {
          id: seat.id,
          seatCode: seat.title
        }
      })
    })
  }

  toContactForm() {
    this.router.navigate(['contact']);
  }

  sendTicketToEmail(){
    this.emailTravelling = true;
    console.log(this.time, "This is the time")
    this.dataService.sendTicketToUser({
      userEmail: this.user.email,
      movieTitle: this.movieTitle,
      roomTitle: this.roomTitle,
      seats: this.seatsToSend,
      date: this.date,
      time: this.time,
      amount: this.amount
    }).subscribe((response) => {
      this.messageService.add({severity: response.status, summary: 'Ολοκλήρωση!', detail: response.message});
      this.isTicketSendToEmail = true;
      this.emailTravelling = false;
    })
  }

  cancelTickets() {
    this.ticketsEnabled = false;

    const arrayWithTitles: string[] = [];

    this.dataService.getSeat({ roomTitle: this.roomTitle, selected: true }).subscribe((response) => {

      //Make the prev selected seats reserved : false to cancel them
      response.data.forEach((seat: any) => {
        arrayWithTitles.push(seat.title);
      })

      //Turn the string array in this format "'DA-1', 'DB-1'" in order for where title in ... sql statement to work
      this.dataService.updateAllSeat({ seatTitleList: arrayWithTitles.map(title => `'${title}'`).join(","), reserved: false }).subscribe((response) => {
        this.messageService.add({severity: response.status, summary: 'Ολοκλήρωση!', detail: "Τα εισητήρια ακυρώθηκαν με επιτυχία"});
      })

    })
  }

  backToHome() {
    this.getUserByName({ name: this.user.name });
  }

  protected readonly window = window;
}
