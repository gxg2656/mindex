import {TestBed, inject} from '@angular/core/testing';

import {EmployeeService} from './employee.service';
import {Employee} from './employee';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {BackendlessMockService} from './backendless-mock.service';

const employees: Employee[] = [{
  id: 1,
  firstName: 'Brian',
  lastName: 'McGee',
  position: 'CEO',
  directReports: [2, 3],
  compensation: 0
},
  {
    id: 2,
    firstName: 'Homer',
    lastName: 'Thompson',
    position: 'Dev Manager',
    directReports: [],
    compensation: 0
  }];

describe('EmployeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService, BackendlessMockService]
    });
  });

  it('should be created', inject([EmployeeService], (service: EmployeeService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an employee based on employee ID', inject([EmployeeService], (service: EmployeeService) => {
    service.get(employees[0].id).subscribe(value => {
      expect(value).toEqual(employees[0]);
    });
  }));

  it('should return all employees', inject([EmployeeService], (service: EmployeeService) => {
    service.getAll().subscribe(value => {
      expect(value).toBe(employees[0], 'No employees');
    });
  }));

  it('should call http put method to update the employee compensation', inject([EmployeeService], (service: EmployeeService) => {
    const updatedEmployee = {
      id: 1,
      firstName: 'Brian',
      lastName: 'McGee',
      position: 'CEO',
      directReports: [2, 3],
      compensation: 100
    };
    service.save(updatedEmployee).subscribe(value => {
      expect(value.compensation).toEqual(updatedEmployee.compensation);
    });
  }));

  it('should delete the employee', inject([EmployeeService], (service: EmployeeService) => {
    const updatedEmployee = {
      id: 1,
      firstName: 'Brian',
      lastName: 'McGee',
      position: 'CEO',
      directReports: [2, 3],
      compensation: 100
    };
    service.remove(updatedEmployee).subscribe(value => {
      expect(value).toBeFalsy();
    });
  }));

  it('should call http post method if emp ID does not exist', inject([EmployeeService], (service: EmployeeService) => {
    const updatedEmployee = {
      id: null,
      firstName: 'New',
      lastName: 'User',
      position: 'Jr. Developer',
      directReports: [],
      compensation: 0
    };
    service.save(updatedEmployee).subscribe(value => {
      expect(value).toEqual(updatedEmployee);
    });
  }));
});
