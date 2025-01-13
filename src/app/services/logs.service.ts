import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Notification {
  notificationId: number;
  notificationText: string;
  userId: number;
  notificationDate: string;
}

interface ApiResponse {
  notifications: Notification[];
  estado: number;
  msg: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = 'https://gerardo-isaac-api-notifications.onrender.com/api/v1/notifications';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getNotifications(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl, { 
      headers: this.authService.getAuthHeaders() 
    });
  }

  getNotification(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`, { 
      headers: this.authService.getAuthHeaders() 
    });
  }

  createNotification(notification: Partial<Notification>): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification, { 
      headers: this.authService.getAuthHeaders() 
    });
  }

  updateNotification(id: number, notification: Partial<Notification>): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}`, notification, { 
      headers: this.authService.getAuthHeaders() 
    });
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { 
      headers: this.authService.getAuthHeaders() 
    });
  }
}