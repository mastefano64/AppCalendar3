import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PageAssignment1Component } from './components/page-assignment1/page-assignment1.component';
import { PageAssignment2Component } from './components/page-assignment2/page-assignment2.component';
import { PageAssignment3Component } from './components/page-assignment3/page-assignment3.component';
import { PageSchedulerComponent } from './components/page-scheduler/page-scheduler.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'page1', component: PageAssignment1Component },
  { path: 'page2', component: PageAssignment2Component },
  { path: 'page3', component: PageAssignment3Component },
  { path: 'page4', component: PageSchedulerComponent },
  { path: '**', redirectTo: 'page1' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
