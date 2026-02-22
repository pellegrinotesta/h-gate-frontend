import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
  private loader$ = new BehaviorSubject<boolean>(false);

  show(): void {
    this.loader$.next(true);
  }

  hide(): void {
    setTimeout(() => this.loader$.next(false), 500);
  }

  isLoading(): Observable<boolean> {
    return this.loader$ as Observable<boolean>;
  }
}
