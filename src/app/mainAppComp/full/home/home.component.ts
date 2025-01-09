import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {YouTubePlayer} from '@angular/youtube-player';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    YouTubePlayer
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  title!: string;
  description!: string;
  director!: string;
  rating!: number;
  duration!: number;
  type!: string;
  trailerCode!: string;
  rated!: string;
  thumbnail!: any;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {

    //On resize event for dynamic width of video
    addEventListener("resize", () => {
      return window.innerWidth
    })

    this.getMovies({});
  }

  getMovies(data: any) {
    console.log(data, "this is the response")
    this.dataService.getMovie(data).subscribe((response) => {
      console.log(response.data[0].duration)
      this.title = response.data[0].title;
      this.description = response.data[0].description;
      this.director = response.data[0].director;
      this.rating = response.data[0].response;
      this.duration = response.data[0].duration;
      this.type = response.data[0].type;
      this.trailerCode = response.data[0].trailerCode;
      this.rated = response.data[0].rated;
      this.thumbnail = response.data[0].thumbnail;

    })
  }

  protected readonly window = window;
}
