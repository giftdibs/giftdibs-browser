import {
  NgModule
} from '@angular/core';

import {
  Routes,
  RouterModule
} from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: 'app/modules/home/home.module#HomeModule',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: 'app/modules/account/account.module#AccountModule'
  },
  {
    path: 'page-not-found',
    loadChildren: 'app/modules/page-not-found/page-not-found.module#PageNotFoundModule'
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
