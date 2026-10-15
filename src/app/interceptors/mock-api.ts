import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RegisterPayload } from '../models/auth';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('/signup') && req.method === 'POST') {
    
    // On indique à TypeScript le format attendu du body pour éviter l'erreur
    const body = req.body as RegisterPayload;

    const mockResponse = new HttpResponse({
      status: 200,
      body: {
        token: 'fake-jwt-token-12345',
        user: {
          id: '1',
          username: body?.username || 'utilisateur',
          email: body?.email || 'user@example.com'
        }
      }
    });
    return of(mockResponse).pipe(delay(800));
  }

  return next(req);
};