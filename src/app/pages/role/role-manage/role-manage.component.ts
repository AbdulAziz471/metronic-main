import { Component , Input } from '@angular/core';

@Component({
  selector: 'app-role-manage',
  standalone: true,
  imports: [],
  templateUrl: './role-manage.component.html',
  styleUrl: './role-manage.component.scss'
})
export class RoleManageComponent {
  private modalRef: any;
  @Input() isEditMode = false;
  @Input() role: any = {};
  constructor() {}

  close(): void {
    if (this.modalRef) {
        this.modalRef.close()
      }
  }
  
  onSubmit() {
    console.log('Form submitted:', this.role);

  }
}
