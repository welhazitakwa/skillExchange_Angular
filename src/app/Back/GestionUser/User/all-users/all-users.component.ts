import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../../nav/nav.component';
import { SideBarComponent } from '../../../side-bar/side-bar.component';
import { User } from 'src/app/core/models/GestionUser/User';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { Role } from 'src/app/core/models/GestionUser/Role';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  Users: User[] = [];
  filteredUsers: User[] = [];

  // Search and filter properties
  searchText: string = '';
  roleFilter: Role | null = null;
  statusFilter: string = '';
  uniqueRoles: Role[] = [];

  // Sorting properties
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      (response: User[]) => {
        this.Users = response;
        this.filteredUsers = [...this.Users];
        this.extractUniqueRoles();
        this.applyFilters();
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private extractUniqueRoles(): void {
    const roles = new Set(this.Users.map((user) => user.role));
    this.uniqueRoles = Array.from(roles).sort();
  }

  applyFilters(): void {
    this.filteredUsers = this.Users.filter((user) => {
      // Search text filter (name or email)
      const matchesSearch =
        !this.searchText ||
        user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchText.toLowerCase());

      // Role filter
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;

      // Status filter
      const matchesStatus =
        !this.statusFilter ||
        (this.statusFilter === 'verified' && user.verified) ||
        (this.statusFilter === 'pending' && !user.verified);

      return matchesSearch && matchesRole && matchesStatus;
    });

    this.sortData();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  private sortData(): void {
    this.filteredUsers.sort((a, b) => {
      let valueA = a[this.sortColumn as keyof User];
      let valueB = b[this.sortColumn as keyof User];

      // Handle different data types for sorting
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        // For boolean values (like verified status)
        valueA = valueA ? 1 : 0;
        valueB = valueB ? 1 : 0;
      }

      if (!valueA || !valueB) return 0;

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
