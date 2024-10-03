// smtp-configuration.model.ts
export interface SMTPSetting {
    id?: number | null; 
    host: string;
    userName: string;
    password: string;
    isEnableSSL: boolean;
    port: number;
    isDefault: boolean;
  }
  