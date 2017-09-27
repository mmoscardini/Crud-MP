import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: String;
  name: String;
  password: String;

  constructor(
    private validate: ValidateService,
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  OnRegisterSubmit(){
    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    }

    if (!this.validate.validateRegisterFilds(user)){
      this.flashMessage.show('Porfavor preencha todos os campos',{cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    if (!this.validate.validateEmail(user.email)){
      this.flashMessage.show('Email invalido',{cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    this.auth.registerUser(user).subscribe(data => {
      if (data.success){
        this.flashMessage.show(data.msg,{cssClass: 'alert-succsess', timeout: 3000});
        this.router.navigate(['/login']);
      }
      else {
        this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/login']);
      }
    });
  }

}
