import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Settings } from '../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private baseUrl = 'http://127.0.0.1:8000/api/settings/';
  private localStorageKey = 'appSettings';
  public settings: Settings | null = null;
  public requestInProgress: boolean = false;

  constructor(private http: HttpClient) {
    this.loadSettingsFromLocalStorage();
  }

  private loadSettingsFromLocalStorage(): void {
    const settings = localStorage.getItem(this.localStorageKey);
    if (settings) {
      this.settings = JSON.parse(settings);
    } else {
      this.settings = { darkTheme: false, initLoadLastNMinutes: 31, mainPrompt: '' };
    }
  }

  public getSettings(): Observable<Settings> {
    return this.http.get<Settings>(`${this.baseUrl}`).pipe(
      tap((settings: Settings) => {
        this.settings = settings;
        this.saveSettingsToLocal(settings);
      }),
      catchError(() => of(this.settings as Settings)),
    );
  }

  public postSettings(settings: Settings): Observable<Settings> {
    this.requestInProgress = true;
    return this.http.post<Settings>(`${this.baseUrl}`, settings).pipe(
      tap((savedSettings: Settings) => {
        this.settings = savedSettings;
        this.saveSettingsToLocal(savedSettings);
        this.requestInProgress = false;
      }),
      catchError((error) => {
        this.requestInProgress = false;
        return of(settings);
      }),
    );
  }

  public postDarkTheme(darkTheme: boolean): Observable<{ darkTheme: boolean }> {
    this.requestInProgress = true;
    return this.http.post<{ darkTheme: boolean }>(`${this.baseUrl}`, { darkTheme }).pipe(
      tap(() => {
        if (this.settings) {
          this.settings.darkTheme = darkTheme;
          this.saveSettingsToLocal(this.settings);
        }
        this.requestInProgress = false;
      }),
      catchError((error) => {
        this.requestInProgress = false;
        return of({ darkTheme });
      }),
    );
  }

  private saveSettingsToLocal(settings: Settings): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(settings));
  }

  public loadSettings(): void {
    this.getSettings().subscribe((settings: Settings) => {
      this.settings = settings;
      console.log('Settings:', settings);
    });
  }
}
