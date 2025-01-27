import {Component, OnInit} from '@angular/core';
import {Carousel} from "primeng/carousel";
import {GalleriaModule} from "primeng/galleria";
import {NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {ProgressSpinner} from "primeng/progressspinner";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Select} from "primeng/select";
import {DataService} from '../../../../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-room-atmos',
  standalone: true,
  imports: [
    Carousel,
    GalleriaModule,
    NgIf,
    PrimeTemplate,
    ProgressSpinner,
    ReactiveFormsModule,
    Select
  ],
  templateUrl: './room-atmos.component.html',
  styleUrl: './room-atmos.component.css'
})
export class RoomAtmosComponent implements OnInit {

  roomAtmos!: any;
  filterForm!: FormGroup;
  allMovies: any[] = [];
  images: any[] = [];
  responsiveOptions: any[] = [];
  responsiveOptionsForScroll: any[] = [];
  loadingMovies!: boolean;
  loadingRooms!: boolean;
  movieTypes: any[] = [
    {name: 'documentary'},
    {name: 'horror'},
    {name: 'animation'},
    {name: 'horror-mystery'},
    {name: 'horror-thriller'},
    {name: 'drama'},
    {name: 'family'},
    {name: 'cartoon'},
    {name: 'biography'},
    {name: 'action-adventure'}
  ];

  constructor(private dataService: DataService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.getAllRooms({title: "Dolby Atmos"});
    this.getMovies({});

    this.filterForm = this.formBuilder.group({
      "type": [""]
    })

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];

    this.responsiveOptionsForScroll = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
      }
    ]

  }

  getAllRooms(data: any) {
    this.loadingRooms = true;
    this.dataService.getRoom(data).subscribe((response) => {
      this.roomAtmos = response.data[0];

      this.images.push({
        itemImageSrc: response.data[0].image1,
        thumbnailImageSrc: response.data[0].image1
      }, {
        itemImageSrc: response.data[0].image2,
        thumbnailImageSrc: response.data[0].image2,
      }, {
        itemImageSrc: response.data[0].image3,
        thumbnailImageSrc: response.data[0].image3
      }, {
        itemImageSrc: response.data[0].image4,
        thumbnailImageSrc: response.data[0].image4
      }, {
        itemImageSrc: response.data[0].image5,
        thumbnailImageSrc: response.data[0].image5
      }, {
        itemImageSrc: response.data[0].thumbnail,
        thumbnailImageSrc: response.data[0].thumbnail
      });
      this.loadingRooms = false;

    })
  }

  getMovies(data: any) {
    this.loadingMovies = true;
    this.dataService.getMovie(data).subscribe((response) => {
      this.allMovies = response.data;
      this.loadingMovies = false;
    })
  }

  toContactForm() {
    this.router.navigate(['contact']);
  }

  backToAllMovies() {
    this.router.navigate(['movies']);
  }

  onSelectType(event: any) {
    this.getMovies({type: `'${event.value.name}'`});
  }

  protected readonly window = window;
  protected readonly Array = Array;
}
