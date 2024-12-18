import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'onlineUsers',
    loadChildren: () => import('./OnlineUsers/onlineUsers.module').then((m) => m.OnlineUserModule),
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/userroles',
    loadChildren: () => import('./UserRoles/user-roles.module').then((m) => m.UserRoleModule),
  },
  {
    path: 'setting/app-setting',
    loadChildren: () => import('./setting/app-setting/setting.module').then((m) => m.SettingModule),
  },
  {
    path: 'setting/app-actions',
    loadChildren: () => import('./setting/app-actions/setting.module').then((m) => m.SettingModule),
  },
  {
    path: 'emailSetting/smtp',
    loadChildren: () => import('./EmailSetting/SMTP/EmailSetting.module').then((m) => m.EmailSettingModule),
  },
  {
    path: 'emailSetting/sendEmail',
    loadChildren: () => import('./EmailSetting/SendEmail/SendEmail.module').then((m) => m.SendEmailModule),
  },
  {
    path: 'logs/logs-audit',
    loadChildren: () => import('./LoginAudit/LoginAudit.module').then((m) => m.LoginAuditModule),
  },
  {
    path: 'logs/error-logs',
    loadChildren: () => import('./ErrorLogs/Error-logs.module').then((m) => m.ErrorLogsModule),
  },
  {
    path: 'emailSetting/emailtemplate',
    loadChildren: () => import('./EmailSetting/EmailTemplate/EmailSetting.module').then((m) => m.EmailSettingModule),
  },
  {
    path: 'setting/app-page',
    loadChildren: () => import('./setting/App-Page/setting.module').then((m) => m.SettingModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
