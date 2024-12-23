import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RemoteDataService} from '../../remotedata.service';
import {MessageService, PrimeTemplate} from 'primeng/api';
import { AuthenticationService } from '../../auth.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';
import {first} from 'rxjs';
import {FloatLabel} from 'primeng/floatlabel';
import {NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {Checkbox} from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    NgIf,
    Button,
    PrimeTemplate,
    Checkbox,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  public loginForm: FormGroup = this.formBuilder.group({});
  rememberMe : boolean = false;
  loading: boolean = false;
  password = '';
  email = '';
  submitted: boolean = false;
  error = '';

  constructor(private formBuilder: FormBuilder,
              private remoteDataService: RemoteDataService,
              private messageService: MessageService,
              public dataService: DataService,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required]]
    })

    const currentUser = this.authenticationService.currentUser();
    if (currentUser){
      this.router.navigate([''])
    }

    if (localStorage.getItem(this.remoteDataService.platform + '_rememberMe_password') != null && localStorage.getItem(this.remoteDataService.platform + '_rememberMe_email')){
      this.password = localStorage.getItem(this.remoteDataService.platform + '_rememberMe_password').toString()
      this.email = localStorage.getItem(this.remoteDataService.platform + '_rememberMe_email').toString()
    }
  }

  onSubmit(){
    if(this.loginForm.invalid){
      this.messageService.add({severity: 'error', summary: 'error!', detail: 'Η φόρμα σας δεν είναι έγκυρη, παρακαλώ όλα τα υποχρεωτικά όλα τα υποχρεωτικά πεδία'})
      this.validateAllFromFields(this.loginForm);
      this.submitted = true;
      return;
    }
    this.loading = true;

    this.authenticationService.login(this.password,this.email)
      .pipe(first()).subscribe(
        httpResponse => {
          if (httpResponse.status == "success"){

            if(this.rememberMe){
              localStorage.setItem(this.remoteDataService.platform + '_rememberMe_password', this.password)
              localStorage.setItem(this.remoteDataService.platform + '_rememberMe_email',this.email)
            }
            this.messageService.add({severity: 'success', summary: 'Success!', detail: httpResponse.message});

          }else {
            this.messageService.add({severity: 'error', summary: 'error!', detail: httpResponse.message});
          }
          this.loading = false;
        },
      error => {
          this.error = error;
          this.loading = false;
      }
    )
  }

  changePass(userId: any){

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

  navigateToRegister(){
    this.router.navigate(['register']);
  }

  forgetPassWord(){
    this.router.navigate(['forgetPass'])
  }



}
