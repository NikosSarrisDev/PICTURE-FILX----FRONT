import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DataService} from '../../data.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Select} from 'primeng/select';
import {FileUpload} from 'primeng/fileupload';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Rating} from 'primeng/rating';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-admin-page-movies',
  standalone: true,
  imports: [
    InputText,
    Textarea,
    ReactiveFormsModule,
    Select,
    FileUpload,
    NgIf,
    NgForOf,
    Rating,
    ConfirmDialog,
    Toast,
    NgClass,
    RouterLink,
    DatePicker
  ],
  templateUrl: './admin-page-movies.component.html',
  styleUrl: './admin-page-movies.component.css',
  providers: [MessageService, ConfirmationService]
})
export class AdminPageMoviesComponent implements OnInit {

  @ViewChild(FileUpload) fileUpload!: FileUpload;

  createForm!: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  types: any[] = [];
  ages: any[] = [];
  action!: string;
  base64File!: string;
  movieTitle!: string;
  buttonEditOrCreate!: string;
  movieId!: number;

  constructor(private formBuilder: FormBuilder,
              private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.action = params["action"];
      this.movieTitle = params["title"];
    })

    this.createForm = this.formBuilder.group({
      title: ['', Validators.required],
      director: ['', Validators.required],
      producer: ['', Validators.required],
      type: ['', Validators.required],
      duration: ['', [Validators.required, Validators.maxLength(3), Validators.pattern(/\d{2,3}/)]],
      rating: [null, Validators.required],
      releaseDate: ['', Validators.required],
      rated: ['', Validators.required],
      trailerCode: ['', Validators.required],
      wikiLink: ['', Validators.required],
      description: ['', Validators.required],
      thumbnail: ['', Validators.required]
    })

    this.types = [
      {name: 'Ντοκιμαντέρ', code: 'documentary'},
      {name: 'Τρόμου', code: 'horror'},
      {name: 'Animation', code: 'animation'},
      {name: 'Θρίλερ Μηστυρίου', code: 'horror-mystery'},
      {name: 'Θρίλερ Τρόμου', code: 'horror-thriller'},
      {name: 'Δράμα', code: 'drama'},
      {name: 'Παιδική', code: 'family'},
      {name: 'Κινούμενα Σχέδια', code: 'cartoon'},
      {name: 'Μιούζικαλ', code: 'musical'},
      {name: 'Βιογραφία', code: 'biography'},
      {name: 'Περιπέτεια Δράσης', code: 'action-adventure'}
    ];

    this.ages = [
      {range: '3+'},
      {range: '7+'},
      {range: '12+'},
      {range: '16+'},
      {range: '18+'}
    ]

    if (this.action == 'Επεξεργασία') {
      this.buttonEditOrCreate = 'Αποθήκευση';
      this.getMovie({title: this.movieTitle});
    } else {
      this.buttonEditOrCreate = this.action;
    }
  }

  clearFileUpload() {
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  getMovie(data: any) {
    this.dataService.getMovie(data).subscribe((response) => {
      this.movieId = response.data[0].id;
      this.createForm.setValue({
        title: response.data[0].title,
        director: response.data[0].director,
        producer: response.data[0].producer,
        type: response.data[0].type,
        duration: response.data[0].duration,
        rating: response.data[0].rating,
        releaseDate: response.data[0].releaseDate,
        rated: response.data[0].rated,
        trailerCode: response.data[0].trailerCode,
        wikiLink: response.data[0].wikiLink,
        description: response.data[0].description,
        thumbnail: response.data[0].thumbnail
      })
    })
  }

  confirmCreate(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.action === 'Προσθήκη' ? 'Είσαι σίγουρος ότι θέλεις να προσθέσεις αυτό το αντικείμενο?' : 'Είσαι σίγουρος ότι θέλεις να αποθηκεύσεις αυτές τις αλλαγές?',
      header: this.action === 'Προσθήκη' ? 'Προσθήκη' : 'Αποθήκευση',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Ακύρωση',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.action === 'Προσθήκη' ? 'Προσθήκη' : 'Αποθήκευση',
      },
      accept: () => {
        this.messageService.add({severity: 'info', summary: 'Αποδοχή', detail: 'Αποδέχτηκες'});
        this.onSubmit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Απόρρηψη',
          detail: 'Απορρήφθηκε',
          life: 3000,
        });
      },
    });
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.convertToBase64(file);
    }
  }

  private convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert file to Base64
    reader.onload = () => {
      this.base64File = reader.result as string;
      this.createForm.patchValue({
        thumbnail: this.base64File
      })
      console.log(this.createForm.get('thumbnail')?.value);
    };
    reader.onerror = (error) => {
      console.error('Error converting file:', error);
    };
  }

  validateAllFromFields(formGroup: FormGroup | any) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFromFields(control);
      }
    })
  }

  onSubmit() {
    if (this.createForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Αποτυχία!',
        detail: 'Η φόρμα σας δεν είναι έγκυρη, παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία'
      })
      this.validateAllFromFields(this.createForm);
      this.submitted = true;
      return;
    }
    this.loading = true;

    const id = this.movieId;
    const title = this.createForm.get('title')?.value;
    const director = this.createForm.get('director')?.value;
    const producer = this.createForm.get('producer')?.value;
    const type = this.createForm.get('type')?.value;
    const duration = this.createForm.get('duration')?.value;
    const rating = this.createForm.get('rating')?.value;
    const releaseDate = this.createForm.get('releaseDate')?.value;
    const rated = this.createForm.get('rated')?.value;
    const trailerCode = this.createForm.get('trailerCode')?.value;
    const wikiLink = this.createForm.get('wikiLink')?.value;
    const description = this.createForm.get('description')?.value;
    const thumbnail = this.createForm.get('thumbnail')?.value;

    if (this.action === 'Προσθήκη') {
      this.dataService.addMovie({
        title: title,
        director: director,
        producer: producer,
        type: type,
        duration: duration,
        rating: rating,
        releaseDate: releaseDate,
        rated: rated,
        trailerCode: trailerCode,
        wikiLink: wikiLink,
        description: description,
        thumbnail: thumbnail
      }).subscribe((response) => {
        if (response.status == 'success') {
          this.messageService.add({severity: 'success', summary: 'Επιτυχία!', detail: response.message});
          this.clearFileUpload();
          this.createForm.reset();
        } else {
          this.messageService.add({severity: 'error', summary: 'Αποτυχία!', detail: response.message});
        }
        this.loading = false;
      }, (error) => {
        this.loading = false;
      });
    } else {
      this.dataService.updateMovie({
        id: id,
        title: title,
        director: director,
        producer: producer,
        type: type,
        duration: duration,
        rating: rating,
        releaseDate: releaseDate,
        rated: rated,
        trailerCode: trailerCode,
        wikiLink: wikiLink,
        description: description,
        thumbnail: thumbnail
      }).subscribe((response) => {
        if (response.status == 'success') {
          this.messageService.add({severity: 'success', summary: 'Επιτυχία!', detail: response.message});
        } else {
          this.messageService.add({severity: 'error', summary: 'Αποτυχία!', detail: response.message});
        }
        this.loading = false;
      }, (error) => {
        this.loading = false;
      });
    }

  }

}
