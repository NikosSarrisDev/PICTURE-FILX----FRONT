import {Component, OnInit} from '@angular/core';
import {Checkbox} from 'primeng/checkbox';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {DataService} from '../../../data.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Paginator} from 'primeng/paginator';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    Checkbox,
    InputText,
    ButtonDirective,
    ReactiveFormsModule,
    NgForOf,
    Paginator
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit {

  filtersForm!: FormGroup;
  movies: any[] = [];
  allMovies: any[] = [];
  first: number = 0;
  rows: number = 10;

  constructor(private dataService: DataService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getMovies({start: this.first, limit: this.rows});
    this.getAlMovies();

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

  getMovies(data: any) {
    this.dataService.getMovie(data).subscribe((response) => {
      this.movies = response.data;
    })
  }

  getAlMovies() {
    this.dataService.getMovie({}).subscribe((response) => {
      this.allMovies = response.data;
    })
  }

  //ugly code it was not to be that way :)
  applyFilters() {

    const title = this.filtersForm.get('title')?.value;
    const director = this.filtersForm.get('director')?.value;
    const producer = this.filtersForm.get('producer')?.value;

    let type = '';
    if (this.filtersForm.get('documentary')?.value) {
      type += ' documentary ';
    }
    if (this.filtersForm.get('horror')?.value) {
      type += ' horror ';
    }
    if (this.filtersForm.get('animation')?.value) {
      type += ' animation ';
    }
    if (this.filtersForm.get('horror-mystery')?.value) {
      type += ' horror-mystery ';
    }
    if (this.filtersForm.get('horror-thriller')?.value) {
      type += ' horror-thriller ';
    }
    if (this.filtersForm.get('drama')?.value) {
      type += ' drama ';
    }
    if (this.filtersForm.get('family')?.value) {
      type += ' family ';
    }
    if (this.filtersForm.get('cartoon')?.value) {
      type += ' cartoon ';
    }
    if (this.filtersForm.get('musical')?.value) {
      type += ' musical ';
    }
    if (this.filtersForm.get('biography')?.value) {
      type += ' biography '
    }
    if (this.filtersForm.get('action-adventure')?.value) {
      type += 'action-adventure';
    }

    this.getMovies({ title: title, director: director, producer: producer, type: type})
  }

  onPageChange(event: any){
    this.first = event.first;
    this.rows = event.rows;

    this.getMovies({start: this.first, limit: this.rows});
  }

  toContactForm(){
    this.router.navigate(['contact']);
  }

  protected readonly window = window;
}
