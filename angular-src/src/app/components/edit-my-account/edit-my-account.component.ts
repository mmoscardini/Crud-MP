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

  user: Object;

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
    this.auth.getMyAccount().subscribe(data => {
      this.userId = data.user._id,
      this.username = data.user.username,
      this.email = data.user.email,
      this.cpf = data.user.cpf,

      this.street = data.user.address.street, 
      this.complement = data.user.address.comlplement
      this.city = data.user.address.city,
      this.state = data.user.address.state,
      this.cep = data.user.address.cep
    });  
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

    //chegagem de que noem de usuário e email não estão sendo apagados.
    if (this.username == "" || this.username == undefined){
      this.flashMessage.show('Nome completo é obrigatório',{cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    if (this.email == undefined || this.email == ""){
      this.flashMessage.show('Email é obrigatório',{cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    //Conferir se o CEP é válido (isso não impede que o valor errado seja salvo na base de dados)
    this.autoCompleteCEP();
    

    //Criar um usuário novo com os campos atualizados
    const updatedUser = {
      userId: this.userId,
      username: this.username,
      email: this.email,
      cpf: this.cpf,
      address: {
          street: this.street, 
          complement: this.complement, 
          city: this.city, 
          state: this.state,
          cep: this.cep
      }
    }   
    
    //Requisição para altearção de dados
    this.auth.editMyAccount(updatedUser).subscribe(data => {
      if (data.success){
        this.flashMessage.show(data.msg,{cssClass: 'alert-success', timeout: 3000});
      }
      else {
        this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout: 3000});
        return false;        
      }
    }), err =>{
        this.flashMessage.show('ocorreu um erro ao atualizar os dados. Porfavor tente novamante',{cssClass: 'alert-danger', timeout: 3000});      
      }
    }
}
