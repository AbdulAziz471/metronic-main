import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
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
    path: 'emailSetting/emailtemplate',
    loadChildren: () => import('./EmailSetting/EmailTemplate/EmailSetting.module').then((m) => m.EmailSettingModule),
  },
  {
    path: 'setting/app-page',
    loadChildren: () => import('./setting/app-page/setting.module').then((m) => m.SettingModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
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
