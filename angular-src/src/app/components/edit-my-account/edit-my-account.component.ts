import { Component, OnInit } from '@angular/core';
import { default as cep } from 'cep-promise'
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-edit-my-account',
  templateUrl: './edit-my-account.component.html',
  styleUrls: ['./edit-my-account.component.css']
})
export class EditMyAccountComponent implements OnInit {

  userId: String;
  username: String;
  email: String;
  cpf: Number;
  address: Object;

  cep: number;
  street: String;
  complement: String;
  state: String;
  city: String;
  
  constructor(
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  autoCompleteCEP(){
        //se o catch pegou algum erro
        cep(this.cep).then(result =>{
          this.street = result.street;
          this.city = result.city;
          this.state = result.state;
        })
        .catch(err => {
          //imprima a mensagem de erro na caixa 0 se ela não estiver vazia
          if(err.errors[0].message != ""){
            this.flashMessage.show(err.errors[0].message,{cssClass: 'alert-danger', timeout: 4000});
            //console.log (result.errors[0].message);
            return false;
          } 
          //se ela estiver vazia olhe na caixa 1 por uma mensagem
          else {
            this.flashMessage.show(err.errors[1].message, {cssClass: 'alert-danger', timeout: 4000});
            //console.log (result.errors[1].message);
            return false;
          }
        })
        
  }

  OnProfileEditSubmit(){

  }

}
