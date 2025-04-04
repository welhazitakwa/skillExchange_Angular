import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, takeUntil, timer } from 'rxjs';
import { UserStatus } from '../../models/GestionUser/UserStatus';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  private activityEvents = [
    'mousemove',
    'keydown',
    'scroll',
    'click',
    'mousedown',
    'touchstart',
  ];
  private destroy$ = new Subject<void>();
  private lastActivityTime: number = 0;
  private currentStatus: UserStatus = UserStatus.OFFLINE;

  private onlineTime: number = 30000; // 30 seconds
  private awayTime: number = 300000; // 5 minutes

  url = 'http://localhost:8084/skillExchange/users';

  constructor(private http: HttpClient) {
    this.initializeActivityTracking();
    this.startStatusMonitoring();
  }

  private headers = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  });

  private initializeActivityTracking() {
    this.lastActivityTime = Date.now();

    // Add activity listeners
    this.activityEvents.forEach((event) => {
      window.addEventListener(event, this.handleUserActivity);
    });
  }

  private handleUserActivity = () => {
    this.lastActivityTime = Date.now();
  };

  private startStatusMonitoring() {
    timer(0, 3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - this.lastActivityTime;
        let newStatus: UserStatus;

        if (elapsed < this.onlineTime) {
          newStatus = UserStatus.ONLINE;
        } else if (elapsed < this.awayTime) {
          newStatus = UserStatus.AWAY;
        } else {
          newStatus = UserStatus.OFFLINE;
        }

        if (newStatus !== this.currentStatus) {
          this.currentStatus = newStatus;
          this.updateUserStatus(newStatus);
        }
      });
  }

  private updateUserStatus(status: UserStatus) {
    this.http
      .post(
        `${this.url}/status`,
        { status: status },
        {
          headers: this.headers,
        }
      )
      .subscribe(
        () => console.debug('Status updated to', status),
        (err) => console.error('Status update failed:', err)
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.activityEvents.forEach((event) => {
      window.removeEventListener(event, this.handleUserActivity);
    });
  }
}
