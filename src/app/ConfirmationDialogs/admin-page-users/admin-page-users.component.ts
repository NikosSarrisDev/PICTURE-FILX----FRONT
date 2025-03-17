import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../auth.service';
import {DataService} from '../../data.service';
import {NgForOf} from '@angular/common';
import {Toast} from 'primeng/toast';
import {ConfirmPopup} from 'primeng/confirmpopup';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-admin-page-users',
  standalone: true,
  imports: [
    NgForOf,
    Toast,
    ConfirmPopup
  ],
  templateUrl: './admin-page-users.component.html',
  styleUrl: './admin-page-users.component.css',
  providers: [ConfirmationService, MessageService]
})
export class AdminPageUsersComponent implements OnInit {

  user!: any;
  userList: any[] = [];

  constructor(private auth: AuthenticationService,
              private dataService: DataService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.user = this.auth.currentUser();
    this.getUsers({});
  }

  getUsers(data: any) {
    this.dataService.getUser(data).subscribe((response) => {
      this.userList = response.data;
    })
  }

  updateUser(data: any) {
    this.dataService.updateUserDetails(data).subscribe((response) => {
      this.messageService.add({severity: response.status, summary: 'Επιτυχία!', detail: response.message});
      this.getUsers({});
    })
  }

  confirm(event: Event, id: number, role: string, name: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Θα ήθελες αν αλλάξεις το ρόλο αυτού του χρήστη?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Ακύρωση',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Αλλαγή'
      },
      accept: () => {
        this.messageService.add({severity: 'info', summary: 'Αποδοχή', detail: 'Αποδέχτηκες', life: 3000});
        if (name === 'admin') {
          this.messageService.add({severity: 'error', summary: 'Μη Επιτρεπτό', detail: 'Ο ρόλος του βασικού (Root) Χρήστη δεν μπορεί να αλλάξει!'});
        } else {
          this.updateUser({id: id, role: role === 'ADMIN' ? 'USER' : 'ADMIN'});
        }
      },
      reject: () => {
        this.messageService.add({severity: 'error', summary: 'Απόρρηψη', detail: 'Απορρήφθηκε', life: 3000});
      }
    });
  }

}
