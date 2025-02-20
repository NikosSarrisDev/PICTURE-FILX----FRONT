import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {RemoteDataService} from '../../../remotedata.service';
import {MessageService} from 'primeng/api';
import {DataService} from '../../../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-buy-ticket-add-show-remaining',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './buy-ticket-add-show-remaining.component.html',
  styleUrl: './buy-ticket-add-show-remaining.component.css'
})
export class BuyTicketAddShowRemainingComponent implements OnInit {

  seats: any[][] = Array.from({length: 5}, () => Array(20).fill(null));
  movieTitle!: string;
  roomTitle!: string;
  allTicketsONSpecificRoom!: number;
  remainingTicketsONSpecificRoom!: number;

  constructor(private remoteDataService: RemoteDataService,
              private messageService: MessageService,
              public dataService: DataService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.movieTitle = params["movieTitle"];
      this.roomTitle = params["roomTitle"];
    })
    this.getRoom({ title: this.roomTitle });
  }

  getRoom(data: any){
    this.dataService.getRoom(data).subscribe((response) => {
      this.allTicketsONSpecificRoom = response.data.availableNumberOfSeats;
      this.getReservedSeats({ roomTitle: response.data.roomTitle, reserved: true });
      this.getSelectedSeats({ roomTitle: response.data.roomTitle, selected: true });
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
        this.seats[seat.row - 1][seat.col - 1] = seat.title
      })
    })
  }

  toContactForm() {
    this.router.navigate(['contact']);
  }

  cancelTickets() {
    this.dataService.updateAllSeat({ reserved: false });
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  protected readonly window = window;
}
