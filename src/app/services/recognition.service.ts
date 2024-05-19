import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable, BehaviorSubject, timer, of, Subscription } from 'rxjs';
import { catchError, switchMap, takeWhile } from 'rxjs/operators';

interface RecognitionResult {
  id: number;
  timestamp: string;
  words: string[];
  sentence: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecognitionService implements OnDestroy {
  private socket$: WebSocketSubject<any> | undefined;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 2000; // время задержки между попытками переподключения (в миллисекундах)
  private connectionStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private connectionStatusSubscription: Subscription;

  private resultsSubject: BehaviorSubject<RecognitionResult[]> = new BehaviorSubject<RecognitionResult[]>([]);
  public results$: Observable<RecognitionResult[]> = this.resultsSubject.asObservable();

  constructor() {
    this.connectionStatusSubscription = this.connectionStatus
      .pipe(
        switchMap((isConnected) => {
          if (isConnected) {
            return of(true);
          } else {
            return timer(this.reconnectDelay).pipe(
              switchMap(() => {
                this.reconnectAttempts++;
                console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                this.connect();
                return of(false);
              }),
              takeWhile(() => this.reconnectAttempts < this.maxReconnectAttempts),
            );
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
          catchError((error) => {
            console.error('WebSocket error:', error);
            return of(error);
          }),
        )
        .subscribe({
          next: (message) => {
            if (Array.isArray(message)) {
              this.resultsSubject.next(message);
            } else {
              this.resultsSubject.next([...this.resultsSubject.value, message]);
            }
          },
          error: (err) => {
            console.error('WebSocket connection error:', err);
            this.connectionStatus.next(false);
          },
          complete: () => {
            console.warn('WebSocket connection closed');
            this.connectionStatus.next(false);
          },
        });

      this.reconnectAttempts = 0;
      this.connectionStatus.next(true);
    }
  }

  private getNewWebSocket() {
    return webSocket('ws://127.0.0.1:8000/ws');
  }

  startRecognition() {
    this.socket$?.next({ action: 'start' });
  }

  stopRecognition() {
    this.socket$?.next({ action: 'stop' });
  }

  getResults() {
    this.socket$?.next({ action: 'get_results' });
  }

  ngOnDestroy() {
    this.connectionStatusSubscription.unsubscribe();
  }
}

// import { Injectable } from '@angular/core';
// import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
// import { Observable, BehaviorSubject, Subject, timer, of } from 'rxjs';
// import { switchMap, catchError } from 'rxjs/operators';

// interface RecognitionResult {
//   id: number;
//   timestamp: string;
//   words: string[];
//   sentence: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class RecognitionService {
//   private socket$: WebSocketSubject<any> | undefined;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 10;
//   private reconnectDelay = 100; // время задержки между попытками переподключения (в миллисекундах)

//   private resultsSubject: BehaviorSubject<RecognitionResult[]> = new BehaviorSubject<RecognitionResult[]>([]);
//   public results$: Observable<RecognitionResult[]> = this.resultsSubject.asObservable();

//   constructor() {
//     this.connect();
//   }

//   private connect() {
//     if (!this.socket$ || this.socket$.closed) {
//       this.socket$ = this.getNewWebSocket();

//       this.socket$
//         .pipe(
//           catchError((error) => {
//             console.error('WebSocket error:', error);
//             return of(error);
//           }),
//         )
//         .subscribe({
//           next: (message) => {
//             if (Array.isArray(message)) {
//               this.resultsSubject.next(message);
//             } else {
//               this.resultsSubject.next([...this.resultsSubject.value, message]);
//             }
//           },
//           error: (err) => {
//             console.error('WebSocket connection error:', err);
//             this.reconnect();
//           },
//           complete: () => {
//             console.warn('WebSocket connection closed');
//             this.reconnect();
//           },
//         });
//     }
//   }

//   private reconnect() {
//     if (this.reconnectAttempts < this.maxReconnectAttempts) {
//       this.reconnectAttempts++;
//       console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
//       timer(this.reconnectDelay).subscribe(() => this.connect());
//     } else {
//       console.error('Max reconnect attempts reached');
//     }
//   }

//   private getNewWebSocket() {
//     return webSocket('ws://127.0.0.1:8000/ws');
//   }

//   startRecognition() {
//     this.socket$?.next({ action: 'start' });
//   }

//   stopRecognition() {
//     this.socket$?.next({ action: 'stop' });
//   }

//   getResults() {
//     this.socket$?.next({ action: 'get_results' });
//   }
// }
