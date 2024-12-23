import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../auth.service';
import {DataService} from '../../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent implements OnInit{

  recoveryForm!: FormGroup;
  email: string = '';
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              public dataService: DataService,
              private router: Router) {
  }

  ngOnInit() {

    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
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
    if (this.recoveryForm.invalid){
      this.messageService.add({severity:'warn', summary:'Warning!', detail:'Η φόρμα σας δεν είναι έγκυρη, παρακαλώ όλα τα υποχρεωτικά όλα τα υποχρεωτικά πεδία'});
      this.validateAllFromFields(this.recoveryForm);
      this.submitted = true;
      return;
    }

    this.dataService.recoverPassword({email: this.email}).subscribe(r => {
      if(r.status == 'success') {
        this.messageService.add({severity: 'success', summary: 'Success!', detail: r.message});
      } else {
        this.messageService.add({severity: 'error', summary: 'Error!', detail: r.message})
      }
    })
  }


}
