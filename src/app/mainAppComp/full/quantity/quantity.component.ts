import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../../data.service';
import {NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-quantity',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
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
      })
    })
  }

  addTicket() {
    this.ticketCounter++;
  }

  removeTicket() {
    this.ticketCounter--;
  }

  toContactForm() {
    this.router.navigate(['contact']);
  }

  protected readonly window = window;
  protected readonly console = console;
}
