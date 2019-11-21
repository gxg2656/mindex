import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {Component, Input} from '@angular/core';

import {EmployeeListComponent} from './employee-list.component';
import {EmployeeService} from '../employee.service';
import {MatCardModule} from '@angular/material/card';
import {Employee} from '../employee';
import {Observable, of, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({selector: 'app-employee', template: ''})
class EmployeeComponent {
  @Input('employee') employee: any;
}

@Component({selector: 'mat-grid-list', template: ''})
class GridListComponent {
}

@Component({selector: 'mat-grid-tile', template: ''})
class GridTileComponent {
}

const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getAll', 'get', 'save', 'remove']);
const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open', 'close']);
const employees: Employee[] = [{
  id: 1,
  firstName: 'Brian',
  lastName: 'McGee',
  position: 'CEO',
  directReports: [2],
  compensation: 0
},
  {
    id: 2,
    firstName: 'Homer',
    lastName: 'Thompson',
    position: 'Dev Manager',
    directReports: [3],
    compensation: 0
  },
  {
    id: 3,
    firstName: 'Rock',
    lastName: 'Strongo',
    position: 'Lead Tester',
    directReports: [],
    compensation: 0
  }];


describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let snackBar: MatSnackBar;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeListComponent,
        EmployeeComponent,
        GridListComponent,
        GridTileComponent
      ],
      imports: [MatCardModule],
      providers: [
        {provide: EmployeeService, useValue: employeeServiceSpy},
        {provide: MatSnackBar, useValue: snackBarSpy}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
  }));

  beforeEach(inject([MatSnackBar, OverlayContainer],
    (sb: MatSnackBar, oc: OverlayContainer) => {
      snackBar = sb;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    }));

  it('should create the component', async(() => {
    component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  it('should fetch all employees on component initialization', () => {
    component = fixture.componentInstance;
    const getAllSpy = employeeServiceSpy.getAll.and.returnValue(of(employees));
    fixture.detectChanges();
    expect(getAllSpy.calls.any()).toBe(true, 'getAll function not called');
  });

  it('should return the employee based on input ID', () => {
    component = fixture.componentInstance;
    employeeServiceSpy.get.and.returnValue(of(employees[0]));
    component.getEmployee(1).subscribe(value => {
      expect(value).toEqual(employees[0]);
    });
  });

  it('should update the employee with a new compensation value', () => {
    const updateEmployee: Employee = {
      id: 1,
      firstName: 'Brian',
      lastName: 'McGee',
      position: 'CEO',
      directReports: [2, 3],
      compensation: 100
    };

    component = fixture.componentInstance;
    const saveSpy = employeeServiceSpy.save.and.returnValue(of(updateEmployee));
    component.updateEmployee(updateEmployee);
    expect(snackBarSpy.open.calls.count()).toEqual(1);
    expect(snackBarSpy.open.calls.first().args).toEqual(['Employee updated!', 'close', {duration: 3000, verticalPosition: 'top'}]);
    expect(saveSpy.calls.any()).toBe(true, 'Employee not updated');
  });

  it('should delete the employee report of an employee', () => {
    const deleteEmployee: Employee = {
      id: 1,
      firstName: 'Brian',
      lastName: 'McGee',
      position: 'CEO',
      directReports: [3],
      compensation: 0
    };

    component = fixture.componentInstance;
    fixture.detectChanges();
    const saveSpy = employeeServiceSpy.save.and.returnValue(of(deleteEmployee));
    component.deleteEmployee(deleteEmployee);
    expect(snackBarSpy.open.calls.count()).toEqual(2);
    expect(snackBarSpy.open.calls.mostRecent().args).toEqual(['Report deleted!', 'close', {duration: 3000, verticalPosition: 'top'}]);
    expect(saveSpy.calls.any()).toBe(true, 'Employee report not deleted');
  });

  it('should find the employee for an indirect report to be deleted', fakeAsync(() => {
    component = fixture.componentInstance;
    component.employees = employees;
    employeeServiceSpy.get.and.returnValue(of(employees[1]));
    const saveSpy = employeeServiceSpy.save.and.returnValue(of(employees[1]));
    component.findEmployee(employees[0].directReports, employees[2]);
    tick(500);
    fixture.detectChanges();
    expect(saveSpy.calls.any()).toBe(true, 'Indirect report not deleted');
  }));

});
