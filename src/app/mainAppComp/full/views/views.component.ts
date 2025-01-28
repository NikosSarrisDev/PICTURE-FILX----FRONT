import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../../data.service';
import {YouTubePlayer} from '@angular/youtube-player';
import {NgIf} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-views',
  standalone: true,
  imports: [
    NgIf,
    ProgressSpinner,
    YouTubePlayer
  ],
  templateUrl: './views.component.html',
  styleUrl: './views.component.css'
})
export class ViewsComponent implements OnInit, AfterViewInit {

  movieTitle!: string;
  movieDetails!: any;
  loadingMovie!: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataService: DataService) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      this.movieTitle = params["title"];
    })

    this.getMovie(this.movieTitle);

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
      this.loadingMovie = false;
    })
  }

  toContactForm(){
    this.router.navigate(['contact']);
  }

  moveToWiki(link: string) {
    window.open("https://en.wikipedia.org/wiki/" + link, '_blank');
  }


  protected readonly Math = Math;
  protected readonly window = window;
}
