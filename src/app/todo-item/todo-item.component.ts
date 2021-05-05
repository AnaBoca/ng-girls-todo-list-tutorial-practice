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
        class="todo-title"
        [ngClass]="{ 'todo-complete': item.completed }"
      >
        {{ item.title }}
      </span>

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

  constructor() { }

  ngOnInit(): void {
  }

  removeItem(): void {
    this.remove.emit(this.item);
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
