import {
    HashLocationStrategy,
    LocationStrategy
    } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NguiMapModule } from '@ngui/map';
import { NguiUtilsModule } from '@ngui/utils';
import { AppComponent } from './app.component';
import {
    APP_ROUTER_COMPONENTS,
    APP_ROUTER_PROVIDERS
    } from './app.route';
import { SourceCodeService } from './source-code.service';


// import { Codeblock } from 'ng2-prism/codeblock';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        APP_ROUTER_PROVIDERS,
        // NguiMapModule,
        NguiMapModule.forRoot({
            apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCbMGRUwcqKjlYX4h4-P6t-xcDryRYLmCM' +
            '&libraries=visualization,places,drawing',
        }),
        NguiUtilsModule
    ],
    declarations: [AppComponent, APP_ROUTER_COMPONENTS],
    providers: [
        SourceCodeService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}