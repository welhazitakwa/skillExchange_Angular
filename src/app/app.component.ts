import { Component } from '@angular/core';
import { UserStatusService } from './core/services/GestionUser/userStatus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userStatusService: UserStatusService) {
  }
  title = 'skillXchange';
}
