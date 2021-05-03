import { Injectable } from '@angular/core';
import { ItemWithChanges } from '../interfaces/item-with-changes';
import { TodoItem } from '../interfaces/todo-item';
import { StorageService } from './storage.service';

const todoListStorageKey = 'Todo_List';

let lastItemId = 1;

export function createItem(title: string): TodoItem {
  return {
    id: lastItemId++,
    title: title
  }
}

const defaultTodoList: TodoItem[] = [
  createItem('install NodeJS'),
  createItem('install Angular CLI'),
  createItem('create new app'),
  createItem('serve app'),
  createItem('develop app'),
  createItem('deploy app')
];

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  todoList: TodoItem[];

  constructor(private storageService: StorageService) {
    this.todoList = storageService.getData(todoListStorageKey) || defaultTodoList;
  }

  private saveList() {
    this.storageService.setData(todoListStorageKey, this.todoList);
  }

  getTodoList(): TodoItem[] {
    return this.todoList;
  }

  addItem(item: TodoItem): void {
    this.todoList.push(item);
    this.saveList();
  }

  updateItem(id:number, changes: ItemWithChanges): void {
    const index = this.todoList.findIndex(element => element.id === id);
    const oldItem = this.todoList[index];
    this.todoList[index] = {...oldItem, ...changes};
    this.saveList();
  }

  deleteItem(id: number): void {
    const index = this.todoList.findIndex(element => {
      return element.id === id;
    })
    this.todoList.splice(index, 1);
    this.saveList();
  }
}
