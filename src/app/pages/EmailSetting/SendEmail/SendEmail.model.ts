// smtp-configuration.model.ts
export interface Emailtemplate {
  subject?: "",
  toAddress?: "",
  ccAddress?: "",
  attechments?: [
    {
      src?: "",
      name?: "",
      extension?: "",
      fileType?: ""
    }
  ],
  body?: "",
  fromAddress?: ""
}