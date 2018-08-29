import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Credentials {
  username: string;
  name: string;
  birthdate: string;
  age: string;
  gender: string;
  text: string;
  token: string;
}

export interface RegisterContext {
  username: string;
  password: string;
  name: string;
  birthdate: string;
  age: string;
  gender: string;
  text: string;
  remember?: boolean;
}

const credentialsKey = 'credentials';

@Injectable()
export class AuthenticationService {

  private _credentials: Credentials | null;

  constructor() {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  register(context: RegisterContext): Observable<Credentials> {
    const data = {
      username: context.username,
      name: context.name,
      birthdate: context.birthdate,
      age: context.age,
      gender: context.gender,
      text: context.text,
      token: '123456'
    };
    this.setCredentials(data, context.remember);
    return of(data);
  }

  logout(): Observable<boolean> {
    this.setCredentials();
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  get credentials(): Credentials | null {
    return this._credentials;
  }

  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

}
