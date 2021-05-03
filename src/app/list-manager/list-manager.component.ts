import { Component, OnInit } from '@angular/core';
import { ItemWithChanges } from '../interfaces/item-with-changes';
import { Direction } from '../interfaces/move-direction';
import { TodoItem } from '../interfaces/todo-item';
import { createItem, TodoListService } from '../services/todo-list.service';

@Component({
  selector: 'app-list-manager',
  template: `
    <div class="todo-app">
      <app-input-button-unit (submit)="addItem($event)"></app-input-button-unit>

      <ul>
<<<<<<< HEAD
        <li *ngFor="let todoItem of todoList; trackBy: trackById; let first = first; let last = last">
=======
        <li *ngFor="let todoItem of todoList; trackBy: trackById">
>>>>>>> 0b4d954... edit method name
          <app-todo-item
            [item]="todoItem"
            [first]="first"
            [last]="last"
            (remove)="removeItem(todoItem.id)"
            (update)="updateItem(todoItem.id, $event.changes)"
            (move)="moveItem(todoItem.id, $event)"
          >
          </app-todo-item>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./list-manager.component.scss']
})
export class ListManagerComponent implements OnInit {
  todoList: TodoItem[] = [];

  constructor(private todoListService: TodoListService) { }

  trackById(index: number, item: TodoItem) {
    return item.id;
  }

  ngOnInit(): void {
    this.todoList = this.todoListService.getTodoList();
  }

  addItem(title: string): void {
    this.todoListService.addItem(createItem(title));
  }

  removeItem(id: number): void {
    this.todoListService.deleteItem(id);
  }

  updateItem(id: number, changes: ItemWithChanges): void {
    this.todoListService.updateItem(id, changes);
  }

  moveItem(id: number, direction: Direction) {
    this.todoListService.moveItem(id, direction);
  }

}
