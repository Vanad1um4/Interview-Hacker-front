import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { BehaviorSubject, timer, of, Subscription, EMPTY } from 'rxjs';
import { catchError, switchMap, retry } from 'rxjs/operators';
import { IncomingPayload, Sentence } from '../shared/interfaces';
import { RecognitionService } from './recognition.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkService implements OnDestroy {
  private socket$: WebSocketSubject<any> | undefined;
  private reconnectDelayMs = 1000; // время задержки между попытками переподключения в случае потери соединения с сервером
  private connectionStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private connectionStatusSubscription: Subscription;

  constructor(private recognitionService: RecognitionService) {
    this.connectionStatusSubscription = this.connectionStatus
      .pipe(
        switchMap((isConnected) => {
          if (!isConnected) {
            return timer(this.reconnectDelayMs).pipe(
              switchMap(() => {
                console.log('Reconnecting...');
                this.connect();
                return of(false);
              }),
            );
          } else {
            return of(true);
          }
        }),
      )
      .subscribe();

    this.connect();
  }

  private connect() {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();

      this.socket$
        .pipe(
          retry({
            delay: (error, retryCount) => {
              console.log(`Retry attempt #${retryCount}`);
              return timer(this.reconnectDelayMs);
            },
          }),
          catchError((error) => {
            this.handleError(error);
            return EMPTY;
          }),
        )
        .subscribe({
          next: (payload) => this.handleMessage(payload),
          error: (err) => {
            console.error('WebSocket connection error:', err);
            this.connectionStatus.next(false);
          },
          complete: () => {
            console.warn('WebSocket connection closed');
            this.connectionStatus.next(false);
          },
        });

      this.connectionStatus.next(true);
    }
  }

  private getNewWebSocket() {
    return webSocket('ws://127.0.0.1:8000/api/main/ws');
  }

  private handleMessage(payload: IncomingPayload) {
    // console.log('Received message:', payload);
    const key = Object.keys(payload).length === 1 ? Object.keys(payload)[0] : null;

    if (key === 'all_sentences' || key === 'sentence') {
      this.recognitionService.updateSentences(payload[key] as Sentence);
    }
  }

  private handleError(error: any) {
    console.error('WebSocket error:', error);
  }

  public sendAction(action: 'start' | 'stop' | 'get_results') {
    this.socket$?.next({ action });
  }

  ngOnDestroy() {
    this.connectionStatusSubscription.unsubscribe();
  }
}
