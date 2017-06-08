import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgQRCodeReaderComponent } from './ng2-qrcode-reader.component';
export * from './ng2-qrcode-reader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgQRCodeReaderComponent,

  ],
  exports: [
    NgQRCodeReaderComponent,
  ]
})
export class NgQRCodeReaderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgQRCodeReaderModule,
      providers: []
    };
  }
}
