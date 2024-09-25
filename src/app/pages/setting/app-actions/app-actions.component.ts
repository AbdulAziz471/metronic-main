// app-actions.component.ts
import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppAction } from './app-action.modal';
import { AppActionService } from 'src/app/Service/AppActionsApi.service';
@Component({
  selector: 'app-app-actions',  // Make sure the selector matches the file name if needed
  templateUrl: './app-actions.component.html',
  styleUrls: ['./app-actions.component.scss']
})
export class AppActionsComponent implements OnInit {
  AllAppActions: AppAction[] = []; 
  selectedAction: AppAction = { id: null, name: '' };  

  constructor(private appActionService: AppActionService, private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllAppActions();
  }

  loadAllAppActions(): void {
    this.appActionService.getAllAppAction().subscribe(actions => {
      this.AllAppActions = actions;  
      this.cdr.detectChanges();  
    });
  }

  openModal(content: any): void {
    this.modalService.open(content);
  }

  onSubmit(form: NgForm, action: AppAction): void {
    if (form.invalid) return;
    const operation = action.id
      ? this.appActionService.updateAppAction(action)
      : this.appActionService.createAppAction(action.name);

    operation.subscribe({
      next: () => {
        this.loadAllAppActions();
        this.modalService.dismissAll();
        form.resetForm();  // resetForm is used to reset the state
      },
      error: (err) => {
        console.error('Failed to save or update the action', err);
        // Optionally handle errors, e.g., show an error message
      }
    });
  }

  edit(action: AppAction): void {
    this.selectedAction = { ...action };
  }

 // app-actions.component.ts

 deleteActions(id: number | null | undefined): void {
  this.appActionService.deleteAppAction(id as number).subscribe({
    next: () => {
      this.loadAllAppActions(); // Refresh the list after deletion
      // Optionally show a success message
    },
    error: err => {
      console.error('Error deleting setting:', err);
      // Optionally show an error message
    }
  });
}


}