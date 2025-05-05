import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthServiceService } from '../../views/features/auth/login/auth-service.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
