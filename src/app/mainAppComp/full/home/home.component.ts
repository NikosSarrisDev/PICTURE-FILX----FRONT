import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {YouTubePlayer} from '@angular/youtube-player';
import {Router} from '@angular/router';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';
import {AuthenticationService} from '../../../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    YouTubePlayer,
    NgForOf,
    ProgressSpinner,
    NgIf,
    NgStyle
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  movies!: any;
  loading!: boolean;
  user!: any;
  constructor(private dataService: DataService,
              private router: Router,
              private auth: AuthenticationService) {
  }

  ngOnInit() {

    //On resize event for dynamic width of video
    addEventListener("resize", () => {
      return window.innerWidth
    })

    this.user = this.auth.currentUser();
    console.log(this.user);

    this.getMovies({start: 3, limit: 4});
  }

  getMovies(data: any) {
    this.loading = true;
    this.dataService.getMovie(data).subscribe((response) => {
      console.log(response.data[0])
      this.movies = response.data;
      this.loading = false;
    })
  }

  moveToWiki(link: string) {
    window.open("https://en.wikipedia.org/wiki/" + link, '_blank');
  }

  toContactForm() {
    this.router.navigate(['contact']);
  }

  viewsForMovie(title: string){
    this.router.navigate(['views'], { queryParams: { title: title } })
  }

  protected readonly window = window;
}
