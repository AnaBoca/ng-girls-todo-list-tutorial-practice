import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ItemWithChanges } from '../interfaces/item-with-changes';
import { TodoItem } from '../interfaces/todo-item';

@Component({
  selector: 'app-todo-item',
  template: `
    <div class="todo-item">
      <input
        type="checkbox"
        class="todo-checkbox"
        (click)="completeItem()"
        [checked]="item.completed"
      />

      <!-- EDIT BUTTON -->
      <span
        *ngIf="!isEditing"
        class="todo-title"
        [ngClass]="{ 'todo-complete': item.completed }"
      >
        {{ item.title }}
      </span>

      <!-- EDIT BUTTON -->
      <input
        *ngIf="isEditing"
        [value]="item.title"
        (keyup)="updateTitle($event)"
      />

      <!-- EDIT BUTTON -->
      <button class="{{isEditing ? 'btn': 'btn btn-green'}}" (click)="enableEditingItem()">{{ isEditing ? 'Done': 'Edit'}}</button>

      <button class="btn btn-red" (click)="removeItem()">Remove</button>
    </div>
  `,
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input()
  item: TodoItem;

  @Output()
  remove: EventEmitter<TodoItem> = new EventEmitter<TodoItem>();

  // EDIT BUTTON
  @Output()
  update: EventEmitter<ItemWithChanges> = new EventEmitter<ItemWithChanges>();

  // EDIT BUTTON
  isEditing: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log('anything');
  }

  removeItem(): void {
    this.remove.emit(this.item);
  }

  // EDIT BUTTON
  enableEditingItem(): void {
    this.isEditing = !this.isEditing;
  }

  // EDIT BUTTON
  updateTitle(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    console.log('updateTitle', target.value);
    this.update.emit({
      item: this.item,
      changes: {title: target.value}
    })
  }

  completeItem(): void {
    this.update.emit({
      item: this.item,
      changes: {completed: !this.item.completed}
    });
  }


}
