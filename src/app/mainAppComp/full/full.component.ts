import {Component, OnInit} from '@angular/core';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthenticationService} from '../../auth.service';
import {MoviesComponent} from './movies/movies.component';
import {RoomsComponent} from './rooms/rooms.component';
import {Button, ButtonDirective} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';

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
    RouterLinkActive,
    Tooltip,
    NgStyle,
    NgIf
  ],
  templateUrl: './full.component.html',
  styleUrl: './full.component.css'
})
export class FullComponent implements OnInit {

  currentUser: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser();
    console.log(this.currentUser)
  }

  logoutUser() {
    this.authenticationService.logout();
    location.reload();
  }

  toContactForm() {
    this.router.navigate(['contact']);
  }
}
