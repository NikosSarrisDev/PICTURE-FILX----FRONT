import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Button} from 'primeng/button';
import {ProgressBar} from 'primeng/progressbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Button, ProgressBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PictureFlix';
}
