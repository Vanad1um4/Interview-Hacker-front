import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NetworkService } from './app/services/network.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    NetworkService,
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
}).catch((err) => console.error(err));
