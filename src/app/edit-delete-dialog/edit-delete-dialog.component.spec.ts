import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {EditDeleteDialogComponent} from './edit-delete-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {of} from 'rxjs';
import {Employee} from '../employee';
import {Router} from '@angular/router';
import {By} from '@angular/platform-browser';
import {TextMaskModule} from 'angular2-text-mask';

const employee: Employee = {
  id: 1,
  firstName: 'first',
  lastName: 'last',
  position: 'jobTitle',
  directReports: [2, 3],
  compensation: 200
};

describe('EditDeleteDialogComponent', () => {
  let component: EditDeleteDialogComponent;
  let fixture: ComponentFixture<EditDeleteDialogComponent>;
  const mockDialogRef = {
    close: () => {
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteDialogComponent],
      imports: [MatIconModule, MatFormFieldModule, FormsModule, MatDialogModule, TextMaskModule],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}}, {provide: MatDialogRef, useValue: mockDialogRef}],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [EditDeleteDialogComponent],
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('should close dialog on click of save during employee update', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.saveCompensation(employee);
    expect(spy).toHaveBeenCalledWith(employee);
  });

  it('should close dialog on click of save during employee delete', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.deleteEmployee(employee);
    expect(spy).toHaveBeenCalledWith(employee);
  });
});
