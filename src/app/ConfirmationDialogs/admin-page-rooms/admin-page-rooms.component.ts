import {Component, OnInit, Signal, viewChild, WritableSignal} from '@angular/core';
import {ConfirmDialog} from "primeng/confirmdialog";
import {DatePicker} from "primeng/datepicker";
import {FileUpload} from "primeng/fileupload";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Rating} from "primeng/rating";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Select} from "primeng/select";
import {Textarea} from "primeng/textarea";
import {Toast} from "primeng/toast";
import {DataService} from '../../data.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-admin-page-rooms',
  standalone: true,
  imports: [
    ConfirmDialog,
    DatePicker,
    FileUpload,
    FormsModule,
    InputText,
    NgIf,
    Rating,
    ReactiveFormsModule,
    RouterLink,
    Select,
    Textarea,
    Toast,
    NgClass,
    NgForOf,
    ProgressSpinner
  ],
  templateUrl: './admin-page-rooms.component.html',
  styleUrl: './admin-page-rooms.component.css',
  providers: [MessageService, ConfirmationService]
})
export class AdminPageRoomsComponent implements OnInit {

  fileUpload = viewChild(FileUpload);

  createForm!: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  numberOfSeats: any[] = [];
  ticketPrice: any[] = [];
  action!: string;
  uploadedFiles: any[] = [];
  base64Files: any[] = [];
  roomTitle!: string;
  buttonEditOrCreate!: string;
  roomId!: number;

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
      this.roomTitle = params["title"];
    })

    this.createForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      quickText: ['', Validators.required],
      seats: [100, Validators.required],
      ticketPrice: [9.5, Validators.required],
      thumbnail: ['', Validators.required],
      image1: ['', Validators.required],
      image2: ['', Validators.required],
      image3: [''],
      image4: [''],
      image5: [''],
    })

    this.numberOfSeats = [
      {count: 100, label: '100 Θέσεις'},
      {count: 60, label: '60 Θέσεις'},
    ];

    this.ticketPrice = [
      {price: 9.5},
      {price: 11.5},
      {price: 16.5}
    ]

    if (this.action == 'Επεξεργασία') {
      this.buttonEditOrCreate = 'Αποθήκευση';
      this.getRoom({title: this.roomTitle});
    } else {
      this.buttonEditOrCreate = this.action;
    }
  }

  clearFileUpload() {
    if (this.fileUpload) {
      this.fileUpload()?.clear();
    }
  }

  getRoom(data: any) {
    this.dataService.getRoom(data).subscribe((response) => {
      this.roomId = response.data[0].id;
      this.createForm.setValue({
        title: response.data[0].title,
        description: response.data[0].description,
        quickText: response.data[0].quickText,
        seats: response.data[0].availableNumberOfSeats,
        ticketPrice: response.data[0].ticketPrice,
        thumbnail: response.data[0].thumbnail,
        image1: response.data[0].image1,
        image2: response.data[0].image2,
        image3: response.data[0].image3,
        image4: response.data[0].image4,
        image5: response.data[0].image5
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
    // for (let file of event.files) {
    //   this.convertToBase64(file);
    // }
    this.uploadedFiles.push(event.files);
    this.convertToBase64(event.files);
  }

  private convertToBase64(files: File[]) {
    // const reader = new FileReader();
    // // reader.readAsDataURL(file); // Convert file to Base64
    // for (let file of files) {
    //   reader.readAsDataURL(file); // Convert file to Base64
    // }
    // reader.onload = () => {
    //   this.base64File = reader.result as string;
    //   this.createForm.patchValue({
    //     thumbnail: this.base64File
    //   })
    //   console.log(this.createForm.get('thumbnail')?.value);
    // };
    // reader.onerror = (error) => {
    //   console.error('Error converting file:', error);
    // };
    for (let file of files) {
      const reader = new FileReader();
      reader.readAsDataURL(file); //Convert into Base64 format
      reader.onload = () => {
        this.base64Files.push(reader.result);
      }
      this.base64Files.forEach((item, index) => {
        switch (index) {
          case 0:
            this.createForm.patchValue({thumbnail: item});
            break;
          case 1:
            this.createForm.patchValue({image1: item});
            break;
          case 2:
            this.createForm.patchValue({image2: item});
            break;
          case 3:
            this.createForm.patchValue({image3: item});
            break;
          case 4:
            this.createForm.patchValue({image4: item});
            break;
          case 5:
            this.createForm.patchValue({image5: item});
            break;
          default:
            this.messageService.add({
              severity: 'error',
              summary: 'Αποτυχία!',
              detail: "Το πλήθος των εικόνων πρέπει να είναι το πολύ 6 στο σύνολο"
            });
            return;
        }
      })
      reader.onerror = (error) => {
        console.error('Error converting file:', error);
      }
    }
  }

  removeAPhotoFromUpload() {

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

    const id = this.roomId;
    const title = this.createForm.get('title')?.value;
    const description = this.createForm.get('description')?.value;
    const quickText = this.createForm.get('quickText')?.value;
    const seats = this.createForm.get('seats')?.value;
    const ticketPrice = this.createForm.get('ticketPrice')?.value;
    const thumbnail = this.createForm.get('thumbnail')?.value;
    const image1 = this.createForm.get('image1')?.value;
    const image2 = this.createForm.get('image2')?.value;
    const image3 = this.createForm.get('image3')?.value;
    const image4 = this.createForm.get('image4')?.value;
    const image5 = this.createForm.get('image5')?.value;

    if (this.action === 'Προσθήκη') {
      this.dataService.addRoom({
        title: title,
        description: description,
        quickText: quickText,
        availableNumberOfSeats: seats,
        ticketPrice: ticketPrice,
        thumbnail: thumbnail,
        image1: image1,
        image2: image2,
        image3: image3,
        image4: image4,
        image5: image5
      }).subscribe((response) => {
        if (response.status == 'success') {
          this.messageService.add({severity: 'success', summary: 'Επιτυχία!', detail: response.message});
          this.dataService.addAllSeats({roomId : response.DO_IT, total: seats}).subscribe((response) => {
            this.messageService.add({severity: 'success', summary: 'Επιτυχία!', detail: response.message});
            this.clearFileUpload();
            this.createForm.reset();
            this.loading = false;
          });
        } else {
          this.messageService.add({severity: 'error', summary: 'Αποτυχία!', detail: response.message});
          this.loading = false;
        }
      }, (error) => {
        this.loading = false;
      });
    } else {
      this.dataService.updateRoom({
        id: id,
        title: title,
        description: description,
        quickText: quickText,
        availableNumberOfSeats: seats,
        ticketPrice: ticketPrice,
        thumbnail: thumbnail,
        image1: image1,
        image2: image2,
        image3: image3,
        image4: image4,
        image5: image5
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
