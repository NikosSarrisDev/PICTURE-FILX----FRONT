import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RemoteDataService} from '../../remotedata.service';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {AuthenticationService} from '../../auth.service';
import {DataService} from '../../data.service';
import {Router, RouterLink} from '@angular/router';
import {first} from 'rxjs';
import {FloatLabel} from 'primeng/floatlabel';
import {CommonModule, NgIf} from '@angular/common';
import {Button, ButtonDirective} from 'primeng/button';
import {Checkbox} from 'primeng/checkbox';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {InputText} from 'primeng/inputtext';
declare const FB: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabel,
    NgIf,
    Button,
    Checkbox,
    FormsModule,
    PasswordModule,
    DividerModule,
    RouterLink,
    ButtonDirective,
    InputText,
    Toast
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent implements OnInit{

  public loginForm!: FormGroup;
  rememberMe : boolean = false;
  loading: boolean = false;
  password: string = '';
  email: string = '';
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
      email: [this.email, [Validators.required, Validators.email]],
      password : [this.password, Validators.required],
      rememberMe : [this.rememberMe],
    })

    const currentUser = this.authenticationService.currentUser();
    console.log("That one !!! the current user", currentUser);
    if (currentUser){
      this.router.navigate([''])
    }

    //Handle the local storage values for remember password option
    const storedUserEmail : any = localStorage.getItem(this.remoteDataService.platform + '_rememberMe_email');
    const storedUserPassword : any = localStorage.getItem(this.remoteDataService.platform + '_rememberMe_password');

    if (localStorage.getItem(storedUserEmail) != null && localStorage.getItem(storedUserPassword) != null){
      this.password = storedUserPassword;
      this.email = storedUserEmail;
    }
  }

  loginViaGoogle(){
    alert("Sign in with Google is not yes implemented!!");
  }

  //This is taken from facebook Javascript SDK
  loginWithFacebook() {
    FB.login((response: any) => {
      if (response.authResponse) {
        console.log('User logged in', response);

        this.fetchUserDetails();
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'public_profile,email'});
  }

  //This is taken from facebook Javascript SDK
  fetchUserDetails() {
    FB.api('/me', { fields: 'name,email' }, (response: any) => {
      console.log('User details:', response);
      const userName = response.name;
      const userEmail = response.email;

      console.log(`Name: ${userName}, Email: ${userEmail}`);

      //Route the user in the full component and pass the guard
      this.authenticationService.loginFb({ name: userName, email: userEmail });
      this.router.navigate(['']);
    });
  }


  onSubmit(){
    if(this.loginForm.invalid){
      this.messageService.add({severity: 'error', summary: 'error!', detail: 'Η φόρμα σας δεν είναι έγκυρη, παρακαλώ όλα τα υποχρεωτικά όλα τα υποχρεωτικά πεδία'})
      this.validateAllFromFields(this.loginForm);
      this.submitted = true;
      return;
    }
    this.loading = true;

    // Extract values from the form
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    const rememberMe = this.loginForm.get('rememberMe')?.value;

    this.authenticationService.login(password,email)
      .pipe(first()).subscribe(
        httpResponse => {
          if (httpResponse.status == "success"){

            if(rememberMe){
              localStorage.setItem(this.remoteDataService.platform + '_rememberMe_password', this.password)
              localStorage.setItem(this.remoteDataService.platform + '_rememberMe_email',this.email)
            }
            this.messageService.add({severity: 'success', summary: 'Success!', detail: httpResponse.message});
            this.router.navigate([''])
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
    this.router.navigate(['/register']);
  }

  forgetPassWord(){
    this.router.navigate(['/forgetPass'])
  }



}
