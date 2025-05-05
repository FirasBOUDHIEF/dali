import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModeService } from '../../../core/services/theme-mode.service';
import {
  CommonModule,
  DOCUMENT,
  NgClass,
  NgFor,
  NgIf,
  UpperCasePipe,
} from '@angular/common';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { AuthServiceService } from '../../features/auth/login/auth-service.service';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent as MyNgSelectComponent,
} from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PeoplesData, Person } from '../../../core/dummy-datas/peoples.data';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../features/candidatures/notification.service';
import { TimeAgoPipe } from '../../features/user/time-ago.pipe';
import { MENU_ADMIN } from './menu_admin';
import { MENU_CLIENT } from './menu_cliient';
import { MENU_FREELANCER } from './menu_freelancer';
interface Freelancer {
  id: any;
  username: any;
  // Add other properties from your API response
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    FeatherIconDirective,
    RouterLink,
    RouterLinkActive,
    NgFor,
    NgIf,
    NgClass,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    MyNgSelectComponent,
    FormsModule,
    UpperCasePipe,
    TimeAgoPipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  currentTheme: string;
  menuItems: MenuItem[] = [];

  currentlyOpenedNavItem: HTMLElement | undefined;
  email: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private themeModeService: ThemeModeService,
    private authService: AuthServiceService,
    private notificationService: NotificationService
  ) {}
  people: Freelancer[] = [];
  customTemplateSelectedPeople: any = null;
  notifications: any[] = [];
  unreadCount: number = 0;
  currentUserId!: any;
  role;
  imagename;
  username;
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.imagename = localStorage.getItem('imageFilename');

    this.username = localStorage.getItem('userName');
    this.email = localStorage.getItem('email');
    this.themeModeService.currentTheme.subscribe((theme) => {
      this.currentTheme = theme;
      this.showActiveTheme(this.currentTheme);
    });
    if (this.role == 'ROLE_ADMIN') {
      this.menuItems = MENU_ADMIN;
    } else if (this.role == 'ROLE_CLIENT') {
      this.menuItems = MENU_CLIENT;
    } else {
      this.menuItems = MENU_FREELANCER;
    }
    // simple array
    this.loadFreelancers();
    /**
     * Close the header menu after a route change on tablet and mobile devices
     */
    // if (window.matchMedia('(max-width: 991px)').matches) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        document
          .querySelector('.horizontal-menu .bottom-navbar')
          ?.classList.remove('header-toggled');
        document
          .querySelector('[data-toggle="horizontal-menu-toggle"]')
          ?.classList.remove('open');
        document.body.classList.remove('header-open');
      }
    });
    // }
    this.currentUserId = this.authService.getCurrentUserId();

    this.loadNotifications();
  }
  getUserImageUrl(): string {
    return this.imagename == 'undefined' || this.imagename == 'null'
      ? '/profile.jpg'
      : `http://localhost:8082/api/user/${this.currentUserId}/image`;
  }
  loadNotifications(): void {
    this.notificationService
      .getUnreadNotifications(this.currentUserId)
      .subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.unreadCount = notifications.filter((n) => !n.isRead).length;
        },
        error: (err) => console.error('Error loading notifications:', err),
      });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        const index = this.notifications.findIndex(
          (n) => n.id === notificationId
        );
        if (index > -1) {
          this.notifications[index].isRead = true;
          this.unreadCount--;
        }
      },
      error: (err) => console.error('Error marking notification as read:', err),
    });
  }

  markAllAsRead(): void {
    // Implement this if you add a bulk update endpoint
    console.log('Implement bulk mark as read functionality');
  }
  loadFreelancers(): void {
    this.http
      .get<Freelancer[]>('http://localhost:8082/api/user/allfreelancer')
      .subscribe({
        next: (freelancers) => {
          this.people = freelancers;
        },
        error: (error) => {
          console.error('Error loading freelancers:', error);
        },
      });
  }

  getFreelancerImage(freelancerId: string): string {
    return `http://localhost:8082/api/user/${freelancerId}/image`;
  }

  onFreelancerSelected(event: any): void {
    if (event && event.id) {
      this.router.navigate([`/profile/${event.id}`]);
    }
  }
  showActiveTheme(theme: string) {
    const themeSwitcher = document.querySelector(
      '#theme-switcher'
    ) as HTMLInputElement;
    const box = document.querySelector('.box') as HTMLElement;

    if (!themeSwitcher) {
      return;
    }

    // Toggle the custom checkbox based on the theme
    if (theme === 'dark') {
      themeSwitcher.checked = true;
      box.classList.remove('light');
      box.classList.add('dark');
    } else if (theme === 'light') {
      themeSwitcher.checked = false;
      box.classList.remove('dark');
      box.classList.add('light');
    }
  }

  /**
   * Change the theme on #theme-switcher checkbox changes
   */
  onThemeCheckboxChange(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const newTheme: string = checkbox.checked ? 'dark' : 'light';
    this.themeModeService.toggleTheme(newTheme);
    this.showActiveTheme(newTheme);
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    this.authService.logout();

    this.router.navigate(['/auth/login']);
  }

  /**
   * Fixed header menu on scroll
   */
  @HostListener('window:scroll', ['$event']) getScrollHeight() {
    if (window.matchMedia('(min-width: 992px)').matches) {
      let header: HTMLElement = document.querySelector(
        '.horizontal-menu'
      ) as HTMLElement;
      if (window.pageYOffset >= 60) {
        header.parentElement!.classList.add('fixed-on-scroll');
      } else {
        header.parentElement!.classList.remove('fixed-on-scroll');
      }
    }
  }

  /**
   * Returns true or false depending on whether the given menu item has a child
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subMenus !== undefined ? item.subMenus.length > 0 : false;
  }

  /**
   * Toggle the header menu on tablet and mobile devices
   */
  toggleHeaderMenu() {
    // document.querySelector('.horizontal-menu .bottom-navbar')!.classList.toggle('header-toggled');

    const horizontalMenuToggleButton = document.querySelector(
      '[data-toggle="horizontal-menu-toggle"]'
    );
    const bottomNavbar = document.querySelector(
      '.horizontal-menu .bottom-navbar'
    );
    if (!bottomNavbar?.classList.contains('header-toggled')) {
      bottomNavbar?.classList.add('header-toggled');
      horizontalMenuToggleButton?.classList.add('open');
      document.body.classList.add('header-open'); // Used to create a backdrop"
    } else {
      bottomNavbar?.classList.remove('header-toggled');
      horizontalMenuToggleButton?.classList.remove('open');
      document.body.classList.remove('header-open');
    }
  }

  // Show or hide the submenu on mobile and tablet devices when a nav-item is clicked
  toggleSubmenuOnSmallDevices(navItem: HTMLElement) {
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (this.currentlyOpenedNavItem === navItem) {
        this.currentlyOpenedNavItem = undefined;
      } else {
        this.currentlyOpenedNavItem = navItem;
      }
    }
  }
}
