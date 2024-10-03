import { AngularEditorConfig } from "@kolkov/angular-editor";

export const EditorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    defaultFontSize: '',
    sanitize: false,  // Allow HTML tags
    toolbarHiddenButtons: [
        [
            'insertImage',
            'insertVideo',
            'customClasses',  // Add other buttons you want to hide
            'unlink',
            'insertHorizontalRule',
            'removeFormat',
            'toggleEditorMode'  // Example of additional buttons you might want to hide
        ]
    ],
    customClasses: [  // Optional: Define custom classes for styling within the editor
        {
            name: "Title H1",
            class: "title-h1",
            tag: "h1",
        },
        {
            name: "Title H2",
            class: "title-h2",
            tag: "h2",
        },
        {
            name: "Paragraph",
            class: "paragraph",
            tag: "p",
        }
    ]
};
