import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { BusyService } from '../services/busy-service';
import { inject } from '@angular/core';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, any>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const generateCacheKey = (url: string, params: HttpParams) => {
    const paramString = params.keys().map(key => `${key}=${params.getAll(key)?.join(',')}`).join('&');
    return paramString ? `${url}?${paramString}` : url;
  }

  const cacheKey = generateCacheKey(req.url, req.params);
  
  if(req.method === "GET") {
    const cachedResponse = cache.get(cacheKey);
    if(cachedResponse){
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(data => cache.set(cacheKey, data)),
    finalize(() => busyService.idle())
  );
};
