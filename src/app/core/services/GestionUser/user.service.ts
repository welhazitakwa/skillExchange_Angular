import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/GestionUser/User';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  listAnnoncement: User[] = [];
  url = 'http://localhost:8084/skillExchange/users';
  private headers = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  });

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get<User[]>(this.url, { headers: this.headers });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<User>(`${this.url}/email/${email}`, {
      headers: this.headers,
    });
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
}
