import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { OwlModule } from 'angular-owl-carousel';

// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

// reducers
import { appReducers, metaReducers } from './core/reducers/app.reducer';
import { cartReducer } from './core/reducers/cart.reducer';

import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    OwlModule,
    SharedModule,
    // HttpModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: false,
      enableHtml: true,
    }),
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreModule.forFeature('cart', cartReducer),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    StoreDevtoolsModule.instrument(),
  ],

  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
