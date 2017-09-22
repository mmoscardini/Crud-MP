import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private flashMessage: FlashMessagesService,
    private auth: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  onLogoutClick(){
    this.auth.logout();
    this.flashMessage.show('Você foi deslgado',{cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['/']);
  }
}
