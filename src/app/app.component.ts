import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1 class="app-title">
      {{ title }}
    </h1>

    <app-list-manager></app-list-manager>
  `,
  styles: ['h1 {color: #fff;']
})
export class AppComponent {
  title = 'To-Do List';
}
