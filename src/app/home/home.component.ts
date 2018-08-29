import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { AuthenticationService } from '../core/authentication/authentication.service';

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

  get data(): object | null {
    const credentials = this.authenticationService.credentials;

    if (!credentials)
      return null;

    const { name, username, text, gender, age, birthdate } = credentials;

    const data = { username: username, name: name, birthdate: birthdate, age: age, gender: gender, text: text };

    return data;
  }
}
