import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {FloatLabel} from "primeng/floatlabel";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {Password} from "primeng/password";
import {Router, RouterLink} from "@angular/router";
import {Toast} from "primeng/toast";
import {RemoteDataService} from '../../../remotedata.service';
import {MessageService} from 'primeng/api';
import {DataService} from '../../../data.service';
import {AuthenticationService} from '../../../auth.service';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ButtonDirective,
    FloatLabel,
    FormsModule,
    InputText,
    NgIf,
    Password,
    ReactiveFormsModule,
    RouterLink,
    Toast,
    Textarea
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  providers: [MessageService]
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  text!: string;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private remoteDataService: RemoteDataService,
              private messageService: MessageService,
              public dataService: DataService,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      "text": [this.text, Validators.required]
    })
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

  submit() {
    if (this.contactForm.invalid){
      this.messageService.add({severity: 'success', summary: 'Success!', detail: 'Η φόρμα σας δεν είναι έγκυρη, παρακαλώ όλα τα υποχρεωτικά όλα τα υποχρεωτικά πεδία'})
      this.validateAllFromFields(this.contactForm);
      return;
    }

    const email = this.authenticationService.currentUser().email;
    const text = this.contactForm.get("text")?.value;

    this.dataService.sendContactMessage({email: email, text: text}).subscribe(r =>{
      if(r.status == 'success'){
        this.messageService.add({severity: 'success', summary: 'Success!', detail: r.message});
        this.submitted = true;
        // this.router.navigate(['/']);
      }else {
        this.messageService.add({severity: 'error', summary: 'Error!', detail: r.message})
      }
    })
  }

}
