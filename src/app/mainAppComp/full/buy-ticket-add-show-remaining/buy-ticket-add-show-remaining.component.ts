import {Component, OnInit} from '@angular/core';
import {RemoteDataService} from '../../../remotedata.service';
import {MessageService} from 'primeng/api';
import {DataService} from '../../../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForOf, NgStyle} from '@angular/common';
import {Toast} from 'primeng/toast';
import {AuthenticationService} from '../../../auth.service';

@Component({
  selector: 'app-buy-ticket-add-show-remaining',
  standalone: true,
  imports: [
    NgForOf,
    Toast,
    NgStyle
  ],
  templateUrl: './buy-ticket-add-show-remaining.component.html',
  styleUrl: './buy-ticket-add-show-remaining.component.css',
  providers: [MessageService]
})
export class BuyTicketAddShowRemainingComponent implements OnInit {

  seatsToSend: string[] = [];
  seats: any[][] = Array.from({length: 5}, () => Array(20).fill(null));
  movieTitle!: string;
  roomTitle!: string;
  allTicketsONSpecificRoom!: number;
  remainingTicketsONSpecificRoom!: number;
  date!: any;
  time!: any;
  amount!: any;
  ticketsEnabled: boolean = true;

  constructor(private remoteDataService: RemoteDataService,
              private messageService: MessageService,
              public dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.movieTitle = params["movieTitle"];
      this.roomTitle = params["roomTitle"];
      this.amount = params["amount"];
      this.date = params["date"];
      this.time = params["time"];
    })
    this.getRoom({ title: this.roomTitle });
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
    console.log(this.time, "This is the time")
    this.dataService.sendTicketToUser({
      userEmail: this.auth.currentUser().email,
      movieTitle: this.movieTitle,
      roomTitle: this.roomTitle,
      seats: this.seatsToSend,
      date: this.date,
      time: this.time,
      amount: this.amount
    }).subscribe((response) => {
      this.messageService.add({severity: response.status, summary: 'Ολοκλήρωση!', detail: response.message});
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
    this.router.navigate(['/']);
  }

  protected readonly window = window;
}
