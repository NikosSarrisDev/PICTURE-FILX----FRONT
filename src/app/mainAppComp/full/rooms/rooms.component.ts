import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {ProgressSpinner} from "primeng/progressspinner";
import {AuthenticationService} from '../../../auth.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ProgressSpinner,
    NgStyle,
    ConfirmDialog,
    Toast
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
  providers: [MessageService, ConfirmationService]
})
export class RoomsComponent implements OnInit {

  user: any;
  allRooms: any[] = [];
  loading!: boolean;

  constructor(private dataService: DataService,
              private router: Router,
              private formBuilder: FormBuilder,
              private auth: AuthenticationService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {

    this.user = this.auth.currentUser();

    this.getAllRooms({});

  }

  confirmDelete(event: Event, id: number) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το αντικείμενο?',
      header: 'Διαγραφή',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Ακύρωση',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Διαγραφή',
      },
      accept: () => {
        this.messageService.add({severity: 'info', summary: 'Αποδοχή', detail: 'Αποδέχτηκες'});
        this.deleteRoom({ id: id });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Απόρρηψη',
          detail: 'Απορρήφθηκε',
          life: 3000,
        });
      },
    });
  }

  getAllRooms(data: any) {
    this.loading = true;
    this.dataService.getRoom(data).subscribe((response) => {
      this.allRooms = response.data;
      this.loading = false;
    })
  }

  deleteRoom(data: any) {
    this.loading = true;
    this.dataService.deleteRoom(data).subscribe((response) => {
      if (response.status == 'success') {
        this.messageService.add({severity: 'success', summary: 'Επιτυχία!', detail: response.message});
        this.getAllRooms({});
      } else {
        this.messageService.add({severity: 'error', summary: 'Αποτυχία!', detail: response.message});
      }
      this.loading = false;
    }, (error) => { console.error(error); this.loading = false });
  }

  //Only for Admin
  moveToAdminPageOfRooms(action: string, title: string) {
    this.router.navigate(["/roomsAdmin"], { queryParams: { action: action, title: title }});
  }

  toContactForm(){
    this.router.navigate(['contact']);
  }

  navigateToRooms(roomTitle: string){
    this.router.navigate(['roomDefault'], { queryParams: { title: roomTitle } })
  }

  protected readonly window = window;
}
