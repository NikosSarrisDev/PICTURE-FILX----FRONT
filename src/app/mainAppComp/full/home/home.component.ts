import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {YouTubePlayer} from '@angular/youtube-player';
import {Router} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    YouTubePlayer,
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  movies!: any;

  constructor(private dataService: DataService,
              private router: Router) {
  }

  ngOnInit() {

    //On resize event for dynamic width of video
    addEventListener("resize", () => {
      return window.innerWidth
    })

    this.getMovies({start: 10, limit: 4});
  }

  getMovies(data: any) {
    console.log(data, "this is the response")
    this.dataService.getMovie(data).subscribe((response) => {
      console.log(response.data[0])
      this.movies = response.data;
    })
  }

  moveToWiki(link: string) {
    window.open("https://en.wikipedia.org/wiki/" + link, '_blank');
  }

  toContactForm() {
    this.router.navigate(['contact']);
  }

  protected readonly window = window;
}
