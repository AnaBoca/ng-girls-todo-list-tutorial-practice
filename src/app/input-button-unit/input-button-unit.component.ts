import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-input-button-unit',
  template: `
    <input
      class="todo-input"
      #inputElementRef="ngModel"
      [(ngModel)]="title"
      (keyup.enter)="submitValue()"
      required
    />
    <button class="btn" (click)="submitValue()">Save</button>
  `,
  styleUrls: ['./input-button-unit.component.scss']
})
export class InputButtonUnitComponent implements OnInit {
  title = '';

  @Output()
  submit: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('inputElementRef', { static: true })
  inputNgModel: NgModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  submitValue(): void {
    this.inputNgModel.control.markAsDirty();

    if (this.inputNgModel.valid) {
      this.submit.emit(this.title);
      this.inputNgModel.reset();
    }
  }
}
