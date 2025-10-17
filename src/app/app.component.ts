import { Component } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
   title = 'RISOLVE-HM';
  constructor(private loaderService: LoaderService) {
    this.loaderService.show();

    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }
}
