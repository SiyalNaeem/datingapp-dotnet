import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { Member } from '../../types/member';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  likedIds = signal<string[]>([]);

  toggleLike(targetMemberId: string) {
    return this.http.post(`${this.baseUrl}likes/${targetMemberId}`, {}).subscribe({
      next: () => {
        if(this.likedIds().includes(targetMemberId)){
          this.likedIds.update(ids => ids.filter(id => id !== targetMemberId));
        } else {
          this.likedIds.update(ids => [...ids, targetMemberId]);
        }
      }
    })
    // .pipe(tap(() => {
    //   this.likedIds.update(ids => {
    //     if (ids.includes(targetMemberId)) {
    //       return ids.filter(id => id !== targetMemberId);
    //     } else {
    //       ids.push(targetMemberId);
    //     }
    //   });
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('predicate', predicate);
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return this.http.get<PaginatedResult<Member>>(`${this.baseUrl}likes`, { params });
  }

  getLikedIds() {
    return this.http.get<string[]>(`${this.baseUrl}likes/list`).subscribe({
      next: ids => this.likedIds.set(ids)
    });
    // .pipe(
    //   tap(ids => {
    //     this.likedIds.set(ids);
    //   })
    // );
  }

  clearLikedIds() {
    this.likedIds.set([]);
  }
  
}
