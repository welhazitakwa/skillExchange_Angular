import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../../nav/nav.component';
import { SideBarComponent } from '../../../side-bar/side-bar.component';
import { User } from 'src/app/core/models/GestionUser/User';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  Users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      (response: User[]) => {
        this.Users = response;
        console.log(response)
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
