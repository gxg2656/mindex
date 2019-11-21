import {Component, DoCheck, OnInit} from '@angular/core';
import {catchError, map, reduce} from 'rxjs/operators';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;

  constructor(private employeeService: EmployeeService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map(emps => this.employees = emps),
        catchError(this.handleError.bind(this))
      ).subscribe();
  }

  getEmployee(id: number) {
    return this.employeeService.get(id);
  }

  findEmployee(directReports: number[], indirectReport: Employee) {
    let employeeFound: Employee = new Employee();
    for (let i = 0; i < directReports.length; i++) {
      this.getEmployee(directReports[i]).subscribe(employee => {
        if (employee.directReports) {
          const report = employee.directReports.filter(emp => emp === indirectReport.id).map(emp => emp);
          if (report.length > 0) {
            employeeFound = employee;
          }
        }
      });
    }

    if (employeeFound.directReports) {
      setTimeout(() => {
        const index = employeeFound.directReports.indexOf(indirectReport.id);
        employeeFound.directReports.splice(index, 1);
        this.deleteEmployee(employeeFound);
      }, 500);
    }
  }

  updateEmployee(employee: Employee) {
    this.employeeService.save(employee).pipe(
      catchError(this.handleError.bind(this))
    ).subscribe(() => {
        this.snackBar.open('Employee updated!', 'close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.getAllEmployees();
      }
    );
  }

  deleteEmployee(employee: Employee) {
    this.employeeService.save(employee).pipe(
      catchError(this.handleError.bind(this))
    ).subscribe(() => {
        this.snackBar.open('Report deleted!', 'close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.getAllEmployees();
      }
    );
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }
}
