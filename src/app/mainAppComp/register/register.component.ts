import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RemoteDataService} from '../../remotedata.service';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../auth.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';
import {first} from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  creationForm!: FormGroup;
  email: string = '';
  name: string = '';
  password: string = '';
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
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    })
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

  submit(){
    if (this.creationForm.invalid){
      this.messageService.add({severity: 'success', summary: 'Success!', detail: 'Η φόρμα σας δεν είναι έγκυρη, παρακαλώ όλα τα υποχρεωτικά όλα τα υποχρεωτικά πεδία'})
      this.validateAllFromFields(this.creationForm);
      this.submitted = true;
      return;
    }
    this.dataService.createUser({name: this.name, email: this.email, password: this.password}).subscribe(r =>{
      if(r.status == 'success'){
        this.messageService.add({severity: 'success', summary: 'Success!', detail: r.message});
      }else {
        this.messageService.add({severity: 'error', summary: 'Error!', detail: r.message})
      }
    })
  }

}
