import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../../../data.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {GalleriaModule} from 'primeng/galleria';
import {DropdownModule} from 'primeng/dropdown';
import {Select} from 'primeng/select';
import {Carousel} from 'primeng/carousel';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-room-default',
  standalone: true,
  imports: [
    GalleriaModule,
    DropdownModule,
    Select,
    ReactiveFormsModule,
    Carousel,
    ProgressSpinner
  ],
  templateUrl: './room-default.component.html',
  styleUrl: './room-default.component.css',
})
export class RoomDefaultComponent implements OnInit {

  roomDefault!: any;
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

    this.getAllRooms({title: "Η Απλή Αίθουσα"});
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
      this.roomDefault = response.data[0];

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
