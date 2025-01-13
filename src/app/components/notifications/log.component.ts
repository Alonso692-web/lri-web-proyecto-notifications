import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from '../../services/logs.service'; // Cambiar a NotificationsService
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

interface Notification {
  notificationId: number;
  notificationText: string;
  userId: number;
  notificationDate: string;
}

@Component({
  selector: 'app-notification',
  templateUrl: './log.component.html', // Cambiar nombre del template
  styleUrls: ['./log.component.css'], // Cambiar nombre del CSS
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
})
export class NotificationComponent implements OnInit { // Cambiar nombre del componente
  @ViewChild('notificationModal') notificationModal: any;
  listadoNotifications: Notification[] = [];
  loading = false;
  notificationForm: FormGroup;
  isEditMode = false;
  currentNotificationId: number | null = null;

  constructor(
    private notificationsService: NotificationsService, // Cambiar a NotificationsService
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.notificationForm = this.fb.group({
      notificationDate: ['', [Validators.required]],
      notificationText: ['', [Validators.required, Validators.minLength(3)]],
      userId: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.cargarNotifications();
  }

  cargarNotifications() {
    if (this.authService.hasAuthority('READ')) {
      this.loading = true;
      this.notificationsService.getNotifications().subscribe({ // Cambiar a getNotifications
        next: (response) => {
          this.listadoNotifications = response.notifications || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar las notificaciones:', error);
          this.loading = false;
        },
      });
    }
  }

  createNotification() {
    this.isEditMode = false;
    this.notificationForm.reset({
      userId: 0,
      notificationDate: new Date().toISOString().split('T')[0],
    });
    this.modalService.open(this.notificationModal, { backdrop: 'static', size: 'lg' });
  }

  editNotification(notification: Notification) {
    this.isEditMode = true;
    this.currentNotificationId = notification.notificationId;
    this.notificationForm.patchValue({
      notificationDate: notification.notificationDate,
      notificationText: notification.notificationText,
      userId: notification.userId,
    });
    this.modalService.open(this.notificationModal, { backdrop: 'static', size: 'lg' });
  }

  eliminarNotification(notificationId: number) {
    if (this.authService.hasAuthority('DELETE')) {
      if (confirm('¿Está seguro que desea eliminar esta notificación?')) {
        this.notificationsService.deleteNotification(notificationId).subscribe({ // Cambiar a deleteNotification
          next: () => {
            this.cargarNotifications();
          },
          error: (error) => {
            console.error('Error al eliminar la notificación:', error);
          },
        });
      }
    } else {
      alert('No tienes permiso para eliminar notificaciones.');
    }
  }

  onSubmitNotification(modal: any) {
    if (this.notificationForm.invalid) {
      return;
    }

    const notificationData: Partial<Notification> = {
      ...this.notificationForm.value,
    };

    if (this.isEditMode && this.currentNotificationId) {
      if (!this.authService.hasAuthority('UPDATE')) {
        alert('No tienes permiso para actualizar notificaciones.');
        return;
      }
      this.notificationsService.updateNotification(this.currentNotificationId, notificationData).subscribe({ // Cambiar a updateNotification
        next: () => {
          modal.close();
          this.cargarNotifications();
        },
        error: (err) => {
          console.error('Error al actualizar la notificación:', err);
        },
      });
    } else {
      if (!this.authService.hasAuthority('CREATE')) {
        alert('No tienes permiso para crear notificaciones.');
        return;
      }
      this.notificationsService.createNotification(notificationData).subscribe({ // Cambiar a createNotification
        next: () => {
          modal.close();
          this.cargarNotifications();
        },
        error: (err) => {
          console.error('Error al crear la notificación:', err);
        },
      });
    }
  }
}