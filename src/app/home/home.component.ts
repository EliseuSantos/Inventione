import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { AuthenticationService } from '../core/authentication/authentication.service';
import * as moment from 'moment';

export interface Profile {
  username: string;
  name: string;
  birthdate: string;
  age: string;
  gender: string;
  text: string;
  totalWorld?: Number;
}
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;

  constructor(private quoteService: QuoteService, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: "dev" })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
  }

  wordCount(text: string): Number {
    const matches = text.match(/[\w\d\’\'-]+/gi);
    return matches ? matches.length : 0;
  }

  get data(): Profile | null {
    const credentials = this.authenticationService.credentials;

    if (!credentials) {
      return null;
    }

    if (!credentials.text) {
      credentials.text = '';
    }

    const { name, username, text, gender, age, birthdate } = credentials;

    const data = {
      username: username,
      name: name,
      birthdate: moment(birthdate, 'DDMMYYYY').format('DD/MM/YYYY'),
      age: age,
      gender: gender,
      text: text || '',
      totalWorld: this.wordCount(text) || 0
    };

    return data;
  }
}
