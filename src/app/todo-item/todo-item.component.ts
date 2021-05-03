import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ItemWithChanges } from '../interfaces/item-with-changes';
import { Direction } from '../interfaces/move-direction';
import { TodoItem } from '../interfaces/todo-item';

@Component({
  selector: 'app-todo-item',
  template: `
    <div class="todo-item">

      <button
        [disabled]="first"
        class="btn btn-up"
        (click)="moveItem('up')"
      >
        <i class="fa fa-arrow-up"></i>
      </button>

      <button
        [disabled]="last"
        class="btn btn-down"
        (click)="moveItem('down')"
      >
        <i class="fa fa-arrow-down"></i>
      </button>

      <input
        type="checkbox"
        class="todo-checkbox"
        (click)="completeItem()"
        [checked]="item.completed"
      />

      <span
        *ngIf="!isEditing"
        class="todo-title"
        [ngClass]="{ 'todo-complete': item.completed }"
      >
        {{ item.title }}
      </span>

      <input
        *ngIf="isEditing"
        [value]="item.title"
        (keyup)="updateTitle($event)"
      />

      <button class="{{isEditing ? 'btn': 'btn btn-green'}}" (click)="enableEditingItem()">{{ isEditing ? 'Done': 'Edit'}}</button>

      <button class="btn btn-red" (click)="removeItem()">Remove</button>

    </div>
  `,
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input()
  item: TodoItem;

  @Input()
  first: boolean;

  @Input()
  last: boolean;

  @Output()
  remove = new EventEmitter<TodoItem>();

  @Output()
  update = new EventEmitter<ItemWithChanges>();

  @Output()
  move = new EventEmitter<Direction>();

  isEditing: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log('anything');
  }

  removeItem(): void {
    this.remove.emit(this.item);
  }

  enableEditingItem(): void {
    this.isEditing = !this.isEditing;
  }

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

  moveItem(direction: Direction): void {
    this.move.emit(direction);
  }
}
