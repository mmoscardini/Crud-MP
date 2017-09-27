import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  currentPassword : String;
  password1: String;
  password2: String;

  constructor(
    private validate: ValidateService,
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onResetSubmit(){
    let passwords = {
      currentPassword: this.currentPassword,
      password1: this.password1,
      password2: this.password2,
    }
/*
    this.auth.authenticateUser({email: localStorage.getItem('user'), password: this.currentPassword}).subscribe(data => {
      if (!data.success){
        this.flashMessage.show('senha atual incorreta' ,{cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    });*/

    if (!this.validate.validatePasswordResetFields(passwords)){
      this.flashMessage.show('Porfavor preencha todos os campos',{cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    if (!this.validate.validatePasswordResetEquality(passwords)){
      this.flashMessage.show('As senhas não são iguais',{cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    //quais são os dados que eu preciso passar para esse post requst?
    //Como vou passa-los?
    this.auth.resetPassword(passwords.currentPassword, passwords.password1).subscribe(data =>{
      if (!data.success){
        this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/resetpassword']);
      }
      else{
        this.flashMessage.show(data.msg,{cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/myAccount']);
      }
    })
  }

}
