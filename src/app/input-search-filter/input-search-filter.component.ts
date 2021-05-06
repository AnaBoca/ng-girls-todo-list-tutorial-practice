import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-search-filter',
  template: `
    <label>Search</label>

    <input
      class="search-input"
      (keyup)="findListItem($event)"
    />
  `,
  styleUrls: ['./input-search-filter.component.scss']
})
export class InputSearchFilterComponent implements OnInit {
  @Output()
  search = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  findListItem(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const inputValue = target.value;

    this.search.emit(inputValue);
  }
}
