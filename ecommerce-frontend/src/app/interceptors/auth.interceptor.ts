import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    
    console.log('AuthInterceptor: Request URL:', req.url);
    console.log('AuthInterceptor: Token available:', !!token);
    
    if (token) {
      console.log('AuthInterceptor: Adding Authorization header');
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    console.log('AuthInterceptor: No token available, proceeding without Authorization header');
    return next.handle(req);
  }
}
