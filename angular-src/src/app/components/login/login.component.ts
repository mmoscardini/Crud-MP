import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: String;
  password: String;

  constructor(
    private validate: ValidateService,
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  OnLoginSubmit(){
    let user = {
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

    this.auth.authenticateUser(user).subscribe(data =>{
      if (data.success){
        this.auth.storeUserData(data.token, data.user);
        this.flashMessage.show(data.msg,{cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/myAccount']);
      }
      else {
        this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/login']);
      }
    })

    
  }
}
