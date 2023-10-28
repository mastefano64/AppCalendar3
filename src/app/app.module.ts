import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app.routing.module';
import { AppMaterialModule } from './app.material.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormAssignmentComponent } from './components/form-assignment/form-assignment.component';
import { PageAssignment1Component } from './components/page-assignment1/page-assignment1.component';
import { PageAssignment2Component } from './components/page-assignment2/page-assignment2.component';
import { PageAssignment3Component } from './components/page-assignment3/page-assignment3.component';
import { PageSchedulerComponent } from './components/page-scheduler/page-scheduler.component';
import { FormSchedulerComponent } from './components/form-scheduler/form-scheduler.component';
import { AssignmentModule } from './module-assignment/assignment.module';
import { ShedulerModule } from './module-scheduler/scheduler.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PageAssignment1Component,
    PageAssignment2Component,
    PageAssignment3Component,
    FormAssignmentComponent,
    PageSchedulerComponent,
    FormSchedulerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppMaterialModule,
    AssignmentModule,
    ShedulerModule,
    AppRoutingModule
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
