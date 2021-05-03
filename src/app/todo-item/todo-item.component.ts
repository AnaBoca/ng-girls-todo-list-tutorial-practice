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
      <span
        class="todo-title"
        [ngClass]="{ 'todo-complete': item.completed }"
      >{{ item.title }}</span>

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
  @Output()
  update: EventEmitter<ItemWithChanges> = new EventEmitter<ItemWithChanges>();

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


}
