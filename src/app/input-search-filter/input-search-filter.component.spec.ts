import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSearchFilterComponent } from './input-search-filter.component';

describe('InputSearchFilterComponent', () => {
  let component: InputSearchFilterComponent;
  let fixture: ComponentFixture<InputSearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputSearchFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
