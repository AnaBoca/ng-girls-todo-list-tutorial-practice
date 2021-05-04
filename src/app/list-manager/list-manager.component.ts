import { Component, OnInit } from '@angular/core';
import { ItemWithChanges } from '../interfaces/item-with-changes';
import { TodoItem } from '../interfaces/todo-item';
import { createItem, TodoListService } from '../services/todo-list.service';

@Component({
  selector: 'app-list-manager',
  template: `
    <div class="todo-app">
      <app-input-button-unit (submit)="addItem($event)"></app-input-button-unit>

      <app-input-search-filter (search)="findItems($event)"></app-input-search-filter>

      <ul>
        <li *ngFor="let todoItem of filteredTodoList; trackBy: trackById">
          <app-todo-item
            [item]="todoItem"
            (remove)="removeItem(todoItem.id)"
            (update)="updateItem(todoItem.id, $event.changes)"
          ></app-todo-item>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./list-manager.component.scss']
})
export class ListManagerComponent implements OnInit {
  todoList: TodoItem[] = [];
  filteredTodoList: TodoItem[] = [];
  term: string;

  constructor(private todoListService: TodoListService) { }

  ngOnInit(): void {
    this.todoList = this.todoListService.getTodoList();
    this.filteredTodoList = this.todoList;
  }

  trackById(index: number, item: TodoItem) {
    return item.id;
  }

  addItem(title: string): void {
    this.todoListService.addItem(createItem(title));
    this.applyFilter();
  }

  removeItem(id: number): void {
    this.todoListService.deleteItem(id);
    this.applyFilter();
  }

  updateItem(id: number, changes: ItemWithChanges): void {
    this.todoListService.updateItem(id, changes);
    this.applyFilter();
  }

  applyFilter() {
    this.filteredTodoList = this.todoList.filter(curItem => curItem.title.toLowerCase().includes(this.term.toLowerCase()));
  }

  findItems(term: string) {
    this.term = term;
    this.applyFilter();
  }

}
