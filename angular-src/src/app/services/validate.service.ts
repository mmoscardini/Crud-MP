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
