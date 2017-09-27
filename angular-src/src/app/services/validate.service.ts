import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegisterFilds(user){
    if (user.email == undefined || user.password == undefined){
      return false;
    }
    else {
      return true;
    }
  }

  validatePasswordResetFields(passwords){
    if (passwords.currentPassword == undefined || passwords.password1 == undefined || passwords.password2 == undefined ){
      return false;
    }
    else{
      return true;
    }
  }

  validatePasswordResetEquality(passwords){
    if (passwords.password1 != passwords.password2){
      return false
    }
    else {
      return true;
    }
  }

  validateEmail(email){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))  
    {  
      return true; 
    }  
    else{ 
      return false;
    }
  }
}
