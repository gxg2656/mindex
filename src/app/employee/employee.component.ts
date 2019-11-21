import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChildren} from '@angular/core';

import {Employee} from '../employee';
import {EmployeeListComponent} from '../employee-list/employee-list.component';
import {MatDialog} from '@angular/material/dialog';
import {EditDeleteDialogComponent} from '../edit-delete-dialog/edit-delete-dialog.component';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;

  @Output() editEmployee = new EventEmitter<Employee>();
  @Output() deleteEmployee = new EventEmitter<Employee>();

  totalReports = 0;
  reports: Employee[] = [];
  isMenuCollapsed = true;

  constructor(private employeeList: EmployeeListComponent, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getReporters(this.employee);
  }

  getReporters(employee: Employee) {
    if (!employee.directReports) {
      return;
    }
    for (let i = 0; i < employee.directReports.length; i++) {
      this.employeeList.getEmployee(employee.directReports[i]).subscribe(value => {
        this.totalReports++;
        this.reports.push(value);
        this.getReporters(value);
      });
    }
  }

  openEditDialog(selectedEmployee: Employee) {
    const dialogRef = this.dialog.open(EditDeleteDialogComponent, {
      width: '25%',
      autoFocus: false,
      disableClose: true,
      data: {
        selectedEmployee: selectedEmployee,
        edit: true,
        delete: false
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.editEmployee.emit(value);
      }
    });
  }

  openDeleteDialog(selectedEmployee: Employee) {
    const dialogRef = this.dialog.open(EditDeleteDialogComponent, {
      width: '25%',
      autoFocus: false,
      disableClose: true,
      data: {
        selectedEmployee: selectedEmployee,
        edit: false,
        delete: true
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const index = this.employee.directReports.indexOf(value.id);
        if (index !== -1) {
          this.employee.directReports.splice(index, 1);
          this.deleteEmployee.emit(this.employee);
        } else {
          this.employeeList.findEmployee(this.employee.directReports, value);
        }
      }
    });
  }

}
