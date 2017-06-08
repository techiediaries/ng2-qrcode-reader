import { Component , ElementRef ,ViewChild ,Renderer2} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div fxLayout="column" fxFlexAlign="center">
    <div  fxFlex="20" fxFill>
      <md-input-container fxFill><textarea fxFill mdInput placeholder="qrr-value (URL or DATA URL)" [(ngModel)]="value"></textarea></md-input-container>
      <br/>
    
    </div>
    <div  fxFlex="60" fxFill>
      <ng2-qrcode-reader (result)="render($event)" [qrr-show]="showQRCode" [qrr-value]="value" [qrr-type]="elementType"></ng2-qrcode-reader>
    </div>
    <p>Result</p>
    <div #result  fxFlex="20" fxFill>
    </div>
    </div>

  `,
  styles: []
})
export class AppComponent {
  elementType = 'url';
  value = 'https://assets.econsultancy.com/images/resized/0002/4236/qr_code-blog-third.png';
   @ViewChild('result') resultElement: ElementRef;
   showQRCode : boolean = true;
  constructor(private renderer: Renderer2) { 
        
  }   
  render(e){
    console.log(e.result);
    let element :Element = this.renderer.createElement('p');
    element.innerHTML = e.result;
    this.renderElement(element);    
  }

  renderElement(element){
    for (let node of this.resultElement.nativeElement.childNodes) {
              this.renderer.removeChild(this.resultElement.nativeElement, node);
    }            
    this.renderer.appendChild(this.resultElement.nativeElement, element);
  }  

}
