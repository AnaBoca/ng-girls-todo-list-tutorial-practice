import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getData<T>(key: string) {
    const localStorageValue = localStorage.getItem(key);
    if (localStorageValue) {
      return JSON.parse(localStorageValue) as T;
    }
  }

  setData<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
