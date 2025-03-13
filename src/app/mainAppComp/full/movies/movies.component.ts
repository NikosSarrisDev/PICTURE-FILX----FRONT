import {Component, OnInit} from '@angular/core';
import {Checkbox} from 'primeng/checkbox';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {DataService} from '../../../data.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {Paginator} from 'primeng/paginator';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Rating} from 'primeng/rating';
import {AuthenticationService} from '../../../auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    Checkbox,
    InputText,
    ButtonDirective,
    ReactiveFormsModule,
    NgForOf,
    Paginator,
    NgIf,
    ProgressSpinner,
    Rating,
    NgClass,
    FormsModule,
    NgStyle,
    ConfirmDialog,
    Toast
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
  providers: [ConfirmationService, MessageService]
})
export class MoviesComponent implements OnInit {

  filtersForm!: FormGroup;
  movies: any[] = [];
  paginatedMovies: any[] = [];
  first: number = 0;
  rows: number = 9;
  loading!: boolean;
  orderCol: any;
  descAsc: number = 1;
  user!: any;

  constructor(private dataService: DataService,
              private router: Router,
              private formBuilder: FormBuilder,
              private auth: AuthenticationService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.getMovies({});

    this.user = this.auth.currentUser();

    this.filtersForm = this.formBuilder.group({
      "title": [''],
      "director": [''],
      "producer": [''],
      "documentary": [false],
      "horror": [false],
      "animation": [false],
      "horror-mystery": [false],
      "horror-thriller": [false],
      "drama": [false],
      "family": [false],
      "cartoon": [false],
      "musical": [false],
      "biography": [false],
      "action-adventure": [false]
    })
  }

  confirmDelete(event: Event, id: number) {
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
        this.deleteMovie({ id: id });
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

  getMovies(data: any) {
    this.loading = true;
    this.dataService.getMovie(data).subscribe((response) => {
      this.movies = response.data;
      this.updatePaginatedMovies();
      this.loading = false;
    })
  }

  //ugly code it was not to be that way :)
  applyFilters() {

    const title = this.filtersForm.get('title')?.value;
    const director = this.filtersForm.get('director')?.value;
    const producer = this.filtersForm.get('producer')?.value;

    let type: string[] = [];
    if (this.filtersForm.get('documentary')?.value) {
      type.push('documentary');
    }
    if (this.filtersForm.get('horror')?.value) {
      type.push('horror');
    }
    if (this.filtersForm.get('animation')?.value) {
      type.push('animation');
    }
    if (this.filtersForm.get('horror-mystery')?.value) {
      type.push('horror-mystery');
    }
    if (this.filtersForm.get('horror-thriller')?.value) {
      type.push('horror-thriller');
    }
    if (this.filtersForm.get('drama')?.value) {
      type.push('drama');
    }
    if (this.filtersForm.get('family')?.value) {
      type.push('family');
    }
    if (this.filtersForm.get('cartoon')?.value) {
      type.push('cartoon');
    }
    if (this.filtersForm.get('musical')?.value) {
      type.push('musical');
    }
    if (this.filtersForm.get('biography')?.value) {
      type.push('biography');
    }
    if (this.filtersForm.get('action-adventure')?.value) {
      type.push('action-adventure');
    }

    console.log(type.map(type => `'${type}'`).join(","), "This is the type");

    this.getMovies({ title: title, director: director, producer: producer, type: type.map(type => `'${type}'`).join(","), start: this.first, limit: this.rows});
  }

  onSort(field:any) {
    this.movies = [];
    if (this.orderCol != field)
      this.descAsc = -1
    else
      this.descAsc *= -1;
    this.orderCol = field;
    this.getMovies({orderCol: this.orderCol, descAsc: this.descAsc == 1 ? 'asc': 'desc' });
    this.updatePaginatedMovies();
  }

  getOrderIcon(field:any) {
    if (this.descAsc == -1 && this.orderCol == field) {
      return 'pi pi-arrow-down';
    }
    else if (this.descAsc == 1 && this.orderCol == field) {
      return 'pi pi-arrow-up';
    }
    else {
      return 'pi pi-arrows-v';
    }
  }

  onPageChange(event: any){
    this.first = event.first;
    this.rows = event.rows;

    // this.getMovies({start: this.first, limit: this.rows});
    this.updatePaginatedMovies();
  }

  updatePaginatedMovies() {
    const start = this.first;
    const end = this.first + this.rows;
    this.paginatedMovies = this.movies.slice(start, end);
  }

  resetFilters() {
    this.filtersForm.reset();
    this.getMovies({});
  }

  viewsForMovie(title: string){
    this.router.navigate(['views'], { queryParams: { title: title } })
  }

  toContactForm(){
    this.router.navigate(['contact']);
  }

  deleteMovie(data: any) {
    this.loading = true;
    this.dataService.deleteMovie(data).subscribe((response) => {
      if (response.status == 'success') {
        this.messageService.add({severity: 'success', summary: 'Επιτυχία!', detail: response.message});
        this.getMovies({});
      } else {
        this.messageService.add({severity: 'error', summary: 'Αποτυχία!', detail: response.message});
      }
      this.loading = false;
    }, (error) => { console.error(error); this.loading = false });
  }

  //Only for Admin
  moveToAdminPageOfMovies(action: string, title: string) {
    this.router.navigate(["/moviesAdmin"], { queryParams: { action: action, title: title }});
  }

  protected readonly window = window;
}
