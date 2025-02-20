import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../../data.service';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {Tooltip} from 'primeng/tooltip';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-quantity',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    Dialog,
    NgForOf,
    Tooltip,
    NgClass,
    ProgressSpinner
  ],
  templateUrl: './quantity.component.html',
  styleUrl: './quantity.component.css'
})
export class QuantityComponent implements OnInit {

  movieTitle!: string;
  viewDate!: string;
  startTime!: string;
  roomTitle!: string;
  ticketCounter: number = 0;
  ticketPrice!: number;
  seats: any[][] = Array.from({length: 5}, () => Array(20).fill(null));
  visible: boolean = false;
  availableNumberOfSeats!: number;
  loading: boolean = false;
  remainingTicket!: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.movieTitle = params["movieTitle"];
      this.viewDate = params["viewDate"];
      this.startTime = params["startTime"];
      this.roomTitle = params["roomTitle"];
      this.dataService.getRoom({title: this.roomTitle}).subscribe((response) => {
        this.ticketPrice = response.data[0].ticketPrice;
        this.availableNumberOfSeats = response.data[0].availableNumberOfSeats;
      })
    })

    this.dataService.updateAllSeat({ selected: false });
    this.getSeats({roomTitle: this.roomTitle});

  }

  getSeats(data: any) {
    this.loading = true;
    this.dataService.getSeat(data).subscribe((response) => {
      response.data.forEach((seat: any) => {
        this.seats[seat.row - 1][seat.col - 1] = {
          id: seat.id,
          code: seat.title,
          reserved: seat.reserved,
          selected: seat.selected
        };
        this.loading = false;
      })
    });
  }

  updateSeats(data: any) {
    this.dataService.updateSeat(data);
  }

  toggleSelectSeat(rowIndex: number, colIndex: number) {
    if (!this.seats[rowIndex][colIndex]?.reserved && this.remainingTicket > 0) {
      this.seats[rowIndex][colIndex].selected = !this.seats[rowIndex][colIndex]?.selected;
      this.updateSeats({id: this.seats[rowIndex][colIndex]?.id, selected: this.seats[rowIndex][colIndex]?.selected});
      this.remainingTicket = this.seats[rowIndex][colIndex]?.selected ? this.remainingTicket - 1 : this.remainingTicket + 1;
    }
  }

  resetSelectedSeats() {
    this.remainingTicket = this.ticketCounter;
    this.dataService.updateAllSeat({ selected: false });
    this.getSeats({roomTitle: this.roomTitle});
  }

  addTicket() {
    this.ticketCounter++;
    this.remainingTicket = this.ticketCounter;
  }

  removeTicket() {
    this.ticketCounter--;
    this.remainingTicket = this.ticketCounter;
  }

  toContactForm() {
    this.router.navigate(['contact']);
  }

  showDialogSeats() {
    this.visible = true;
  }

  closeDialogSeats() {
    this.visible = false;
    this.dataService.updateAllSeat({ selected: false });
    this.getSeats({roomTitle: this.roomTitle});
    this.remainingTicket = this.ticketCounter;
  }

  moveToShowRemainingTickets() {
    //Overwrite the seats 2D Array with only the selected seats
    this.getSeats({selected: true});

    this.router.navigate(['buyTicket'], {
      queryParams: {
        movieTitle: this.movieTitle,
        seats: this.seats,
        roomTitle: this.roomTitle,
        allRoomSeats: this.availableNumberOfSeats,
        remainingTickets: this.availableNumberOfSeats - this.ticketCounter
      }
    });

    //If I press the update it will make the selected seats to reserved
    this.seats.forEach((seatInnerArray) => {
      this.updateSeats({id: seatInnerArray[0].id, reserved: true});
    });

    this.visible = false;
  }

  protected readonly window = window;
  protected readonly console = console;
}
