import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ItemWithChanges } from '../interfaces/item-with-changes';
import { Direction } from '../interfaces/move-direction';
import { TodoItem } from '../interfaces/todo-item';
import { FormControl, Validators } from '@angular/forms';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { notEmpty } from '../validators/not-empty';

@Component({
  selector: 'app-todo-item',
  template: `
    <div class="todo-item">

      <button
        class="btn btn-up"
        [disabled]="first"
        (click)="moveItem('up')"
      >
        <i class="fa fa-arrow-up"></i>
      </button>

      <button
        class="btn btn-down"
        [disabled]="last"
        (click)="moveItem('down')"
      >
        <i class="fa fa-arrow-down"></i>
      </button>

      <input
        type="checkbox"
        class="todo-checkbox"
        [checked]="item.completed"
        (click)="completeItem()"
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
        data-cy="editInput"
        [formControl]="titleControl"
      />

      <button
        class="{{isEditing ? 'btn': 'btn btn-green'}}"
        (click)="toggleIsEditing()"
        [disabled]="isEditing && titleControl.invalid"
      >
        {{ isEditing ? 'Done': 'Edit'}}
      </button>

      <button class="btn btn-red" (click)="removeItem()">Remove</button>

    </div>
  `,
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit, OnDestroy {
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

  titleControl = new FormControl('', notEmpty());

  unsubscribe$ = new Subject();

  constructor() {
    this.titleControl.valueChanges.pipe(
      filter(() => this.titleControl.valid),
      tap((titleValue) => {
        this.updateTitle(titleValue);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.titleControl.setValue(this.item.title);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  removeItem(): void {
    this.remove.emit(this.item);
  }

  toggleIsEditing(): void {
    this.isEditing = !this.isEditing;
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

  private updateTitle(titleValue: string) {
    this.update.emit({
      item: this.item,
      changes: {title: titleValue}
    })
  }
}
