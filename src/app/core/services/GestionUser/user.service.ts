import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/GestionUser/User';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth/auth.service';
import { Banned } from '../../models/GestionUser/Banned';
import { HistoricTransactions } from '../../models/GestionUser/HistoricTransactions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'http://localhost:8084/skillExchange/users';
  private headers = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  });

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get<User[]>(this.url, { headers: this.headers });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, { headers: this.headers });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`, { headers: this.headers });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<User>(`${this.url}/email/${email}`, {
      headers: this.headers,
    });
  }

  getBannedUserByEmail(email: string): Observable<any> {
    return this.http.get<User>(`${this.url}/email/${email}`);
  }

  updateUser(user: User): Observable<any> {
    if (!user.id) {
      throw new Error('User ID is required for updating.');
    }
    console.log(user);
    return this.http.patch<User>(`${this.url}/${user.id}`, user, {
      headers: this.headers,
    });
  }

  updateUserImage(user: User, formData: FormData): Observable<any> {
    if (!user.id) {
      throw new Error('User ID is required for updating.');
    }
    return this.http.post<User>(`${this.url}/${user.id}/image`, formData, {
      headers: this.headers,
    });
  }

  changeUserPassword(
    currentPassword: String,
    newPassword: String
  ): Observable<any> {
    return this.http.put(
      `${this.url}/change-password`,
      { currentPassword: currentPassword, newPassword: newPassword },
      { headers: this.headers }
    );
  }

  resetUserPassword(email: String, newPassword: String): Observable<any> {
    return this.http.put(`${this.url}/reset-password`, {
      email: email,
      newPassword: newPassword,
    });
  }

  banUser(userId: number, banInfo: Banned): Observable<any> {
    return this.http.post(
      `${this.url}/${userId}/ban`,
      {
        reason: banInfo.reason,
        endDate: banInfo.endDate,
        bannedBy: banInfo.bannedBy,
      },
      { headers: this.headers }
    );
  }

  unBanUser(userId: number) {
    return this.http.post(`${this.url}/${userId}/unban`, {
      headers: this.headers,
    });
  }

  assignBadgeToUser(userId: number, badgeId: number): Observable<any> {
    return this.http.post(`${this.url}/${userId}/badges/${badgeId}`, {
      headers: this.headers,
    });
  }

  removeBadgeFromUser(userId: number, badgeId: number): Observable<any> {
    return this.http.delete(`${this.url}/${userId}/badges/${badgeId}`, {
      headers: this.headers,
    });
  }

  getUserBadges(userId: number): Observable<any> {
    return this.http.get<User[]>(`${this.url}/${userId}/badges`, {
      headers: this.headers,
    });
  }

  addTransaction(
    userId: number,
    historicTransaction: HistoricTransactions
  ): Observable<any> {
    return this.http.post(
      `${this.url}/${userId}/transactions`,
      historicTransaction,
      {
        headers: this.headers,
      }
    );
  }

  getUserTransactions(userId: number): Observable<any> {
    return this.http.get<User[]>(`${this.url}/${userId}/transactions`, {
      headers: this.headers,
    });
  }
}
