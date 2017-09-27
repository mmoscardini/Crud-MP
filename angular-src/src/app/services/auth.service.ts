import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http'
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {

  user: any;
  token: any;

  constructor(
    private http: Http
  ) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/register', user, {headers:headers})
    .map(res=>res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/loginAuth', user, {headers:headers})
    .map(res=>res.json());
  }

  getMyAccount(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.token);
    return this.http.get('http://localhost:3000/users/myAccount', {headers:headers})
    .map(res=>res.json());
  }

  resetPassword(curPass, newPass){
    this.loadUser();
    const requestData = {email: JSON.parse(this.user), currentPass: curPass, newPassword: newPass};

    this.loadToken();
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/resetPassword',requestData , {headers:headers})
    .map(res=>res.json());
  }

  loadToken(){
    const token = localStorage.getItem('token');
    this.token = token;
  }

  loadUser(){
    const user = localStorage.getItem('user');
    this.user = user;
    console.log (this.user);
  }
  
  storeUserData(token, user){
    localStorage.setItem('token',token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }

  logout(){
    this.token = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn(){
    return tokenNotExpired();
  }

}
