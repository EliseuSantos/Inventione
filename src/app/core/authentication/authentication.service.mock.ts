import { Observable, of } from 'rxjs';

import { Credentials, RegisterContext } from './authentication.service';

export class MockAuthenticationService {

  credentials: Credentials | null = {
    username: 'test@gmail.com',
    name: 'teste',
    birthdate: '22/12/2018',
    age: '12',
    gender: 'Masculino',
    text: 'teste',
    token: '123'
  };

  register(context: RegisterContext): Observable<Credentials> {
    return of({
      username: context.username,
      name: context.name,
      birthdate: context.birthdate,
      age: context.age,
      gender: context.gender,
      text: context.text,
      token: "123456"
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

}
