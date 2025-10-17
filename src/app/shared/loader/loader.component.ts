import { Component } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  loading$ = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) { 
 
    console.log('testing loader...')

  }
}
