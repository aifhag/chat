import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Chat } from './chat/chat';
let AppComponent = class AppComponent {
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [Chat],
        templateUrl: './app.component.html',
        styleUrl: './app.component.css'
    })
], AppComponent);
export { AppComponent };
