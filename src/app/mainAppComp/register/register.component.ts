import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RemoteDataService} from '../../remotedata.service';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../auth.service';
import {DataService} from '../../data.service';
import {Router, RouterLink} from '@angular/router';
import {ButtonDirective} from 'primeng/button';
import {Checkbox} from 'primeng/checkbox';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {Password} from 'primeng/password';
import {Toast} from 'primeng/toast';
import {Divider} from 'primeng/divider';
import { passwordStrengthValidator } from './customValidatorPassWordStrength'
import {FileSystemFileEntry, NgxFileDropEntry, NgxFileDropModule} from 'ngx-file-drop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonDirective,
    Checkbox,
    FloatLabel,
    FormsModule,
    InputText,
    NgIf,
    Password,
    ReactiveFormsModule,
    RouterLink,
    Toast,
    Divider,
    NgxFileDropModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent implements OnInit{

  base64File: string | null = null;
  creationForm!: FormGroup;
  email: string = '';
  name: string = '';
  phone: string = "";
  photo: string = "";
  password: string = '';
  verifyPassword: string = '';
  submitted: boolean = false;
  dropZoneLabel: string = "Ανέβασε Φωτογραφία";

  constructor(private formBuilder: FormBuilder,
              private remoteDataService: RemoteDataService,
              private messageService: MessageService,
              public dataService: DataService,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.creationForm = this.formBuilder.group({
      name: [this.name, [Validators.required, Validators.minLength(4)]],
      email: [this.email, [Validators.required, Validators.email]],
      phone: [this.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      photo: [this.photo],
      password: [this.password, [Validators.required, Validators.minLength(8) , passwordStrengthValidator ]],
      verifyPassword: [this.verifyPassword, Validators.required]
    }, {validator: this.passwordMatchValidator })
  }

  //Drag and drop file
  dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.dropZoneLabel = fileEntry.name;
        fileEntry.file((file: File) => {
          this.convertToBase64(file);
        });
      }
    }
  }

  //Choose a file via click
  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log("This event list", event.target.files);
    if (file) {
      console.log('Selected file:', file.name);
      this.dropZoneLabel = file.name;
      this.convertToBase64(file);
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.dropZoneLabel = "Ανέβασε Φωτογραφία";
    this.creationForm.patchValue({
      photo: ""
    })
  }

  private convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert file to Base64
    reader.onload = () => {
      this.base64File = reader.result as string;
      this.creationForm.patchValue({
        photo: this.base64File
      })
      console.log('Base64 File:', this.base64File);
    };
    reader.onerror = (error) => {
      console.error('Error converting file:', error);
    };
  }

  validateAllFromFields(formGroup: FormGroup| any){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({onlySelf: true});
      }else if (control instanceof FormGroup){
        this.validateAllFromFields(control);
      }
    })
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const verifyPassword = form.get('verifyPassword')?.value;
    if (password !== verifyPassword) {
      form.get('verifyPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('verifyPassword')?.setErrors(null);
    }
  }

  submit(){
    if (this.creationForm.invalid){
      this.messageService.add({severity: 'success', summary: 'Success!', detail: 'Η φόρμα σας δεν είναι έγκυρη, παρακαλώ όλα τα υποχρεωτικά όλα τα υποχρεωτικά πεδία'})
      this.validateAllFromFields(this.creationForm);
      this.submitted = true;
      return;
    }

    const name = this.creationForm.get('name')?.value;
    const email = this.creationForm.get('email')?.value;
    const password = this.creationForm.get('password')?.value;
    const phone = this.creationForm.get('phone')?.value;
    const photo = this.creationForm.get('photo')?.value;

    this.dataService.createUser({name: name, email: email, password: password, phone: phone, photo: photo}).subscribe(r =>{
      if(r.status == 'success'){
        this.messageService.add({severity: 'success', summary: 'Success!', detail: r.message});
        this.router.navigate(['/login']);
      }else {
        this.messageService.add({severity: 'error', summary: 'Error!', detail: r.message})
      }
    })
  }

}
