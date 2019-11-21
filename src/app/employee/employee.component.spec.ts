import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';

import {EmployeeComponent} from './employee.component';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {EmployeeService} from '../employee.service';
import {EmployeeListComponent} from '../employee-list/employee-list.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {of} from 'rxjs';
import {EditDeleteDialogComponent} from '../edit-delete-dialog/edit-delete-dialog.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppModule} from '../app.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {Employee} from '../employee';

@Component({selector: 'mat-card', template: ''})
class CardComponent {
}

@Component({selector: 'mat-card-header', template: ''})
class CardHeaderComponent {
}

@Component({selector: 'mat-card-title', template: ''})
class CardTitleComponent {
}

@Component({selector: 'mat-card-subtitle', template: ''})
class CardSubtitleComponent {
}

@Component({selector: 'mat-card-content', template: ''})
class CardContentComponent {
}

const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getAll', 'get', 'save', 'remove']);
const employeeListSpy = jasmine.createSpyObj('EmployeeListComponent',
  ['getAllEmployees', 'getEmployee', 'updateEmployee', 'deleteEmployee']);
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

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CardComponent,
        CardHeaderComponent,
        CardTitleComponent,
        CardSubtitleComponent,
        CardContentComponent
      ],
      imports: [MatIconModule, MatListModule, MatDialogModule, BrowserAnimationsModule, AppModule, MatSnackBarModule],
      providers: [
        {provide: EmployeeListComponent, useValue: employeeListSpy},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    component.employee = employees[0];
    dialogRefSpyObj = jasmine.createSpyObj({afterClosed: of(employees[0]), close: null});
    dialogRefSpyObj.componentInstance = {body: ''};
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  }));

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should call the getReporters function on component initialization', () => {
    spyOn(component, 'getReporters');
    fixture.detectChanges();
    expect(component.getReporters).toHaveBeenCalled();
  });

  it('should return no reports if the employee has no direct reports', () => {
    component.getReporters(employees[2]);
    expect(component.reports).toEqual([]);
    expect(component.totalReports).toEqual(0);
  });


  it('should find direct and indirect reports for the employee', () => {
    const getEmployeeSpy = employeeListSpy.getEmployee.and.returnValue(of(employees[1]));
    component.getReporters(employees[0]);
    expect(getEmployeeSpy).toHaveBeenCalled();
  });

  it('open modal for edit button', () => {
    component.openEditDialog(employees[0]);
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(EditDeleteDialogComponent,
      {
        width: '25%',
        autoFocus: false,
        disableClose: true,
        data: {
          selectedEmployee: employees[0],
          edit: true,
          delete: false
        }
      });
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('open modal for delete button', () => {
    component.openDeleteDialog(employees[0]);
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(EditDeleteDialogComponent,
      {
        width: '25%',
        autoFocus: false,
        disableClose: true,
        data: {
          selectedEmployee: employees[0],
          edit: false,
          delete: true
        }
      });
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });
});
