import { Component } from '@angular/core';
import { Badge } from 'src/app/core/models/GestionUser/Badge';
import { BadgeService } from 'src/app/core/services/GestionUser/badge.service';

@Component({
  selector: 'app-allbadges',
  templateUrl: './allbadges.component.html',
  styleUrls: ['./allbadges.component.css'],
})
export class AllbadgesComponent {
  badges: Badge[] = [];
  icons: any[] = [];
  newBadge: Badge = new Badge();

  showIconDropdown = false;
  searchQuery = '';
  filteredIcons: any[] = [];
  selectedIcon: any;
  selectedBadgeId: number | null = null;
  isAddBadgeModalOpen: boolean = false;

  isEditModalOpen: boolean = false;
  selectedBadge: Badge = new Badge();

  isDeleteModalOpen: boolean = false;

  constructor(private badgeService: BadgeService) {}

  ngOnInit(): void {
    this.loadBadges();
    this.loadFontAwesomeIcons();
  }

  private loadBadges(): void {
    this.badgeService.getAllBadges().subscribe(
      (response: Badge[]) => {
        this.badges = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private loadFontAwesomeIcons(): void {
    const styleSheets = Array.from(document.styleSheets);

    styleSheets.forEach((sheet: any) => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        rules.forEach((rule: any) => {
          if (
            rule.selectorText &&
            rule.selectorText.startsWith('.fa-') &&
            rule.style.content
          ) {
            const iconClass = rule.selectorText.split('::')[0].replace('.', '');
            const iconName = this.formatIconName(iconClass.replace('fa-', ''));
            if (!this.icons.find((i) => i.class === `fas ${iconClass}`)) {
              this.icons.push({
                class: `fas ${iconClass}`,
                name: iconName,
              });
            }
          }
        });
      } catch (e) {
        console.log('Could not access stylesheet:', e);
      }
    });
  }

  private formatIconName(name: string): string {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  addBadge(): void {
    if (this.newBadge.title && this.newBadge.description) {
      this.badgeService.addBadge(this.newBadge).subscribe(
        (response: any) => {
          console.log(response);
          this.badges.push(response);
          this.newBadge = new Badge();
        },
        (error: any) => {
          console.error(error);
        }
      );
      // Close modal
      this.isAddBadgeModalOpen = false;
    }
  }

  closeModal(): void {
    this.isAddBadgeModalOpen = false;
  }

  // Add these methods
  openDeleteModal(badgeId: number): void {
    this.selectedBadgeId = badgeId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedBadgeId = null;
  }

  confirmDelete(): void {
    if (this.selectedBadgeId) {
      this.badgeService.deleteBadge(this.selectedBadgeId).subscribe(
        () => {
          this.badges = this.badges.filter(
            (badge) => badge.id !== this.selectedBadgeId
          );
          this.closeDeleteModal();
        },
        (error) => {
          console.error('Error deleting badge:', error);
          this.closeDeleteModal();
        }
      );
    }
  }

  openEditModal(badge: Badge): void {
    this.selectedBadge = { ...badge };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedBadge = new Badge();
  }

  updateBadge(): void {
    if (
      this.selectedBadge.id &&
      this.selectedBadge.title &&
      this.selectedBadge.description
    ) {
      this.badgeService
        .updateBadge(this.selectedBadge.id, this.selectedBadge)
        .subscribe(
          (updatedBadge: Badge) => {
            const index = this.badges.findIndex(
              (b) => b.id === updatedBadge.id
            );
            if (index !== -1) {
              this.badges[index] = updatedBadge;
            }
            this.closeEditModal();
          },
          (error) => {
            console.error('Error updating badge:', error);
            this.closeEditModal();
          }
        );
    }
  }
}
