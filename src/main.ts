import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';
import { routes } from 'src/app/app.routes';
import { NetworkService } from 'src/app/services/network.service';

import { MarkdownModule } from 'ngx-markdown';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(),
    importProvidersFrom(MarkdownModule.forRoot()),
    NetworkService,
  ],
}).catch((err) => console.error(err));
