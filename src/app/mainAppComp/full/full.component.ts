import {Component, OnInit} from '@angular/core';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {NgForOf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthenticationService} from '../../auth.service';
import {MoviesComponent} from './movies/movies.component';
import {RoomsComponent} from './rooms/rooms.component';
import {Button, ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    Tabs,
    TabList,
    Tab,
    NgForOf,
    RouterLink,
    RouterOutlet,
    TabPanels,
    TabPanel,
    MoviesComponent,
    RoomsComponent,
    ButtonDirective,
    Button,
    RouterLinkActive
  ],
  templateUrl: './full.component.html',
  styleUrl: './full.component.css'
})
export class FullComponent implements OnInit{

  currentUser: any;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser();
  }

  refreshFull(){
    this.router.navigate(['']);
  }

  toMovies(){
    this.router.navigate(['movies']);
  }

  toRooms(){
    this.router.navigate(['rooms']);
  }

  toContactForm(){
    this.router.navigate(['contact']);
  }
}
