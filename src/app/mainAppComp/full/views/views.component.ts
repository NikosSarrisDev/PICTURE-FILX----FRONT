import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../../data.service';
import {YouTubePlayer} from '@angular/youtube-player';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';
import {FullCalendarComponent, FullCalendarModule} from '@fullcalendar/angular';
import {Calendar, CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-views',
  standalone: true,
  imports: [
    NgIf,
    ProgressSpinner,
    YouTubePlayer,
    FullCalendarModule,
    NgForOf,
    NgClass
  ],
  templateUrl: './views.component.html',
  styleUrl: './views.component.css'
})
export class ViewsComponent implements OnInit, AfterViewInit {

  @ViewChild('viewPlace') targetSection!: ElementRef;

  movieTitle!: string;
  movieDetails!: any;
  views: any[] = [];
  loadingMovie!: boolean;
  selectedDate!: any;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    unselectAuto: false,
    select: (selected) => this.handleDateSelect(selected),
    headerToolbar: {
      start: 'title',
      center: '',
      end: 'today prev,next'
    },
    titleFormat: {year: 'numeric', month: 'long'},
    buttonText: {
      today: 'today',
      month: 'month',
      week: 'week',
      day: 'day',
      list: 'list'
    },
    buttonIcons: {
      prev: 'chevron-left',
      next: 'chevron-right',
      prevYear: 'chevrons-left', // double chevron
      nextYear: 'chevrons-right' // double chevron
    },

  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataService: DataService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      this.movieTitle = params["title"];
    })

    this.getMovie(this.movieTitle);

  }

  handleDateSelect(selection: any) {
    this.selectedDate = selection.startStr;
    console.log('Selected Date:', this.selectedDate);

    //Doing this in order to scroll the page in the specific part after the click
    if (this.targetSection) {
      this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    this.getViewByCalendarDate(this.selectedDate);
  }

  ngAfterViewInit() {

    addEventListener("resize", () => {
      return window.innerWidth;
    })

  }

  getMovie(title: string) {
    this.loadingMovie = true;
    this.dataService.getMovie({title: title}).subscribe((response) => {
      this.movieDetails = response.data[0];
      this.getView(response.data[0].id);
      this.loadingMovie = false;
    })
  }

  getView(movieId: any) {
    this.dataService.getView({movieId: movieId}).subscribe((response) => {
      this.views = response.data;
    })
  }

  getViewByCalendarDate(date: any) {
    this.dataService.getView({date: date}).subscribe((response) => {
      this.views = response.data;
    })
  }

  toContactForm() {
    this.router.navigate(['contact']);
  }

  moveToWiki(link: string) {
    window.open("https://en.wikipedia.org/wiki/" + link, '_blank');
  }

  protected readonly Math = Math;
  protected readonly window = window;
}
