import { Component, OnInit, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmailSettingService } from 'src/app/Service/EmailSettings.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

interface Attachment {
  src: string;
  name: string;
  extension: string;
  fileType: string;
}

@Component({
  selector: 'app-send-email',
  templateUrl: './sendEmail.component.html',
  styleUrls: ['./sendEmail.component.scss']
})
export class SendEmailComponent implements OnInit {
  public emailtemplates: any[] = [];
  emailForm: FormGroup;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, 
    private emailService: EmailSettingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadEmailTemplate();
    this.emailForm = this.fb.group({
      subject: [''],  // Validation removed for testing
      toAddress: [''],  // Validation removed for testing
      ccAddress: [''],
      attachments: this.fb.array([]),
      body: [''],  // Validation removed for testing
      fromAddress: ['']  // Validation removed for testing
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = input.files;
    const fileArray = this.emailForm.get('attachments') as FormArray;
    fileArray.clear();
  
    Array.from(files).forEach((file: File) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        fileArray.push(this.fb.group({
          src: fileReader.result, // base64 string
          name: file.name,
          extension: file.name.split('.').pop(),
          fileType: file.type
        }));
      };
      fileReader.readAsDataURL(file); // Read the file as data URL
    });
  }
  
  sendEmail() {
    this.cdr.detectChanges(); 
    console.log('Form Valid:', this.emailForm.valid);
    console.log('Form Errors:', this.emailForm.errors);
    console.log('Form Value:', this.emailForm.value);
    console.log('Form Status:', this.emailForm.status);

    if (this.emailForm.valid) {
      const formValues = this.emailForm.value;
      const emailData = {
        ...formValues,
        attachments: formValues.attachments.map((att: Attachment) => ({
          src: att.src,
          name: att.name,
          extension: att.extension,
          fileType: att.fileType
        }))
      };

      this.emailService.SendEmail(emailData).subscribe({
        next: response => console.log('Email sent successfully', response),
        error: error => console.error('Failed to send email', error)
      });
    } else {
      console.error('Form is invalid:', this.emailForm);
    }
  }

  loadEmailTemplate() {
    this.emailService.getAllEmailTemplate().subscribe(
      response => {
        this.emailtemplates = response;
        this.cdr.detectChanges();
      },
      error => console.error('Error fetching email templates:', error)
    );
  }
}
