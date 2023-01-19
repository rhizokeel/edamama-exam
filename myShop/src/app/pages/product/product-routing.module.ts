import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultPageComponent } from './default/default.component';

const routes: Routes = [
    {
        path: 'default/:slug',
        component: DefaultPageComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProductRoutingModule { };