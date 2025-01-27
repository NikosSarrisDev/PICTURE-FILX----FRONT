import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ProgressSpinner} from "primeng/progressspinner";

@Component({
  selector: 'app-rooms',
  standalone: true,
    imports: [
        NgForOf,
        NgIf,
        ProgressSpinner
    ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {

  allRooms: any[] = [];
  loading!: boolean;

  constructor(private dataService: DataService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.getAllRooms({});

  }

  getAllRooms(data: any) {
    this.loading = true;
    this.dataService.getRoom(data).subscribe((response) => {
      this.allRooms = response.data;
      this.loading = false;
    })
  }

  toContactForm(){
    this.router.navigate(['contact']);
  }

  navigateToRooms(roomTitle: string){
    switch (roomTitle){
      case "Η Απλή Αίθουσα":
        this.router.navigate(['roomDefault']);
        break;
      case "Dolby Atmos":
        this.router.navigate(['roomAtmos']);
        break;
      case "VIP Luxe":
        this.router.navigate(['roomGold']);
        break;
      default:
        console.error("No such room");
    }
  }

  protected readonly window = window;
}
