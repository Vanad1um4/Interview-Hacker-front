import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { BehaviorSubject, timer, of, Subscription, EMPTY } from 'rxjs';
import { catchError, switchMap, retry } from 'rxjs/operators';
import { IncomingMessage, Sentence } from '../shared/interfaces';
import { RecognitionService } from './recognition.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkService implements OnDestroy {
  private socket$: WebSocketSubject<any> | undefined;
  private reconnectDelayMs = 1000; // время задержки между попытками переподключения в случае потери соединения с сервером
  private connectionStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private connectionStatusSubscription: Subscription;
  private pingInterval: any;
  private pingIntervalSec: number = 50;

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
            console.error('WebSocket error:', error);
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
      this.startPing();
    }
  }

  public startPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    this.pingInterval = setInterval(() => {
      if (this.socket$ && !this.socket$.closed) {
        this.socket$.next({ request: 'PING' });
      }
    }, this.pingIntervalSec * 1000);
  }

  private getNewWebSocket() {
    return webSocket('ws://127.0.0.1:8000/api/main/ws');
  }

  private handleMessage(data: IncomingMessage) {
    // console.log('Received message:', data);
    const key = Object.keys(data).length === 1 ? Object.keys(data)[0] : null;

    if (key === 'sentence') {
      this.recognitionService.updateSentences(data[key] as Sentence);
    }
  }

  ngOnDestroy() {
    this.connectionStatusSubscription.unsubscribe();

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
