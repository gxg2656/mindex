import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Employee} from '../employee';
import {FormControl, FormGroup} from '@angular/forms';
import {Masks} from '../masks';

@Component({
  selector: 'app-edit-delete-dialog',
  templateUrl: './edit-delete-dialog.component.html',
  styleUrls: ['./edit-delete-dialog.component.css']
})
export class EditDeleteDialogComponent implements OnInit {
  selectedEmployee: Employee;
  edit: boolean;
  delete: boolean;
  updateEmployee: FormGroup;
  masks = Masks;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditDeleteDialogComponent>) {
    this.selectedEmployee = data.selectedEmployee;
    this.edit = data.edit;
    this.delete = data.delete;
    this.updateEmployee = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      position: new FormControl(),
      compensation: new FormControl()
    });
  }

  ngOnInit() {
  }

  saveCompensation(employee: Employee) {
    this.dialogRef.close(employee);
  }

  deleteEmployee(employee: Employee) {
    this.dialogRef.close(employee);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
