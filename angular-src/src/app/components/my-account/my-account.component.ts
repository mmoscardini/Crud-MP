import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  user: Object;

  constructor(
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.getMyAccount().subscribe(data =>{
      console.log(data);
    }), err => {
      console.log (err);
      return false;
    }
  }

}
