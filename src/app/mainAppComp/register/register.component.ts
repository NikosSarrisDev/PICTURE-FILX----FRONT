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
    Divider
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent implements OnInit{

  creationForm!: FormGroup;
  email: string = '';
  name: string = '';
  password: string = '';
  verifyPassword: string = '';
  submitted: boolean = false;

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
      password: [this.password, [Validators.required, passwordStrengthValidator ]],
      verifyPassword: [this.verifyPassword, Validators.required]
    }, {validator: this.passwordMatchValidator })
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

  takeTheStrenghtOfThePassword(event: any){
    console.log(event, "This is the event for the password in create");
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

    this.dataService.createUser({name: name, email: email, password: password}).subscribe(r =>{
      if(r.status == 'success'){
        this.messageService.add({severity: 'success', summary: 'Success!', detail: r.message});
        this.router.navigate(['/login']);
      }else {
        this.messageService.add({severity: 'error', summary: 'Error!', detail: r.message})
      }
    })
  }

}
