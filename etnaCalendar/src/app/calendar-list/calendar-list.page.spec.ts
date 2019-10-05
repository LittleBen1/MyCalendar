import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarListPage } from './calendar-list.page';

describe('CalendarListPage', () => {
  let component: CalendarListPage;
  let fixture: ComponentFixture<CalendarListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
