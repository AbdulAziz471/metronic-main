import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmailSettingService } from 'src/app/Service/EmailSettings.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
    height: '200px',
    minHeight: '150px',
    placeholder: 'Enter email body here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ]
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
      subject: [''],  
      toAddress: [''],  
      ccAddress: [''],
      attachments: this.fb.array([]),
      body: [''], 
      fromAddress: ['']  
    });
  }

  // Called when a file is selected for attachment
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

  // Called when a template is selected
  onTemplateSelect(event: Event) {
    const selectedTemplateId = (event.target as HTMLSelectElement).value;
    const selectedTemplate = this.emailtemplates.find(template => template.id === selectedTemplateId);
    
    if (selectedTemplate) {
      this.emailForm.patchValue({
        subject: selectedTemplate.subject,
        body: selectedTemplate.body,
        toAddress: '', // Pre-fill as per your requirement
        ccAddress: ''  // Pre-fill as per your requirement
      });
    }
  }

  sendEmail() {
    this.cdr.detectChanges(); 
    console.log('Form Valid:', this.emailForm.valid);
    console.log('Form Value:', this.emailForm.value);

    if (this.emailForm.valid) {
      const formValues = this.emailForm.value;
      const emailData = {
        ...formValues,
        attachments: formValues.attachments.map((att: any) => ({
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

  // Fetch email templates from API
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
