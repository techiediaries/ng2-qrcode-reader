import { Component, Input, Output ,EventEmitter , OnChanges,OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
//import { TextExtraction } from './extract';


declare var require: any;

var QrCode = require('qrcode-reader').default;
//var linkify = require('linkifyjs');

@Component({
  selector: 'ng2-qrcode-reader',
  template: `<div #qrcElement [class]="cssClass"></div>`,
  styles: []
})
export class NgQRCodeReaderComponent implements OnChanges , OnInit {

  @Input('qrr-type') elementType: 'url' | 'dataurl' | 'canvas' = 'url';
  @Input('qrr-class') cssClass = 'qrcode-reader'; 
  @Input("qrr-show") showQRCode = true;
  @Input('qrr-value') value ='';
  @ViewChild('qrcElement') qrcElement: ElementRef;
  @Output('result') result  = new EventEmitter();

  private qrReader;
  Types: {
    TEXT_TYPE: string;
    EMAIL_TYPE: string;
    PHONE_TYPE: string;
    URL_TYPE : string;
    SMS_TYPE: string;
  } = {
    TEXT_TYPE: 'TEXT_TYPE',
    EMAIL_TYPE: 'EMAIL_TYPE',
    PHONE_TYPE: 'PHONE_TYPE',
    URL_TYPE : 'URL_TYPE',
    SMS_TYPE: 'SMS_TYPE'
  };  
  PATTERNS = {
    url: "/(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i",
    phone: "/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/",
    email: "/\S+@\S+\.\S+/"
  };

  constructor(private renderer: Renderer2) { 
        this.qrReader = new QrCode();
  }

  ngOnChanges() {
    this.decode(this.value);
    if(this.showQRCode)
    {
      this.render(this.elementType);
    }
  }
  error(error){
    console.log(error);
        
  }
  find(pattern,str) {
      var  arr = [], matches;
      if (typeof pattern === "string") {
        pattern = new RegExp(pattern, "g");
      } else if (!(pattern instanceof RegExp)) {
          throw new Error("pattern must be string or RegExp object");
      }
          
      while (matches = pattern.exec(str)) {
          arr.push([matches.index, matches.index + matches[0].length - 1]);
      }
      return arr.length ? arr : false;
  }  
  ngOnInit(){
    let that = this;
    this.qrReader.callback = function(error, result) {
      if(error) {
        that.error(error);
        return;
      }
      //console.log(result);
      //var r = that.find(that.PATTERNS.url,result.result);
      that.result.emit({result : result.result , type : "text"  });
      //that.renderResult(result.result);
    }
    //this.decodeByUrl(this.value);  
  }
  renderElement(element){
    for (let node of this.qrcElement.nativeElement.childNodes) {
              this.renderer.removeChild(this.qrcElement.nativeElement, node);
    }            
    this.renderer.appendChild(this.qrcElement.nativeElement, element);
  }  
  render(type){
    let element : Element ;
    switch(type)
    {
      case 'url':
      case 'dataurl':
        element = this.renderer.createElement('img');
        element.setAttribute("src",this.value);
        this.renderElement(element);
      break; 
      case 'canvas' : 
      default :
      break;
    }
    
  }
  decode(value){
    this.qrReader.decode(value);    
  }

}
