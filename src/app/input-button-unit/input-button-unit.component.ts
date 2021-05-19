import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-input-button-unit',
  template: `
    <input
      data-cy="todo-input"
      class="todo-input"
      #inputElementRef="ngModel"
      [(ngModel)]="listItemValue"
      (keyup.enter)="submitValue()"
      required
    />
    <button data-cy="save-button" class="btn" (click)="submitValue()">Save</button>
  `,
  styleUrls: ['./input-button-unit.component.scss']
})
export class InputButtonUnitComponent implements OnInit {
  listItemValue = '';

  @Output()
  submit = new EventEmitter<string>();

  @ViewChild('inputElementRef', { static: true })
  inputNgModel: NgModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  submitValue(): void {
    this.inputNgModel.control.markAsDirty();

    if (this.inputNgModel.valid) {
      this.submit.emit(this.listItemValue);
      this.inputNgModel.reset();
    }
  }
}
