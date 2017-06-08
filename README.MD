# ng2-qrcode-reader

An Angular 4+ Component library for Reading  QR (Quick Response ) Codes .

You can pass QRCode as URL to image ,DATA URL Or canvas context data .

## Demo 
A simple [demo](https://www.techiediaries.com/demos/ng2-qrcode-reader/)


## Installation

To use ng2-qrcode-reader in your project, install it via npm:

```bash
$ npm install ng2-qrcode-reader --save
```

## Usage
For a complete and detailed tutorial on how to use this library .See  :

<a href="https://www.techiediaries.com/generate-qrcodes-angular">How to Generate/Read QR Codes In Angular 4+ Applications </a>

Import the NgQRCodeReaderModule from ng2-qrcode-reader  into your app :


Once the library is imported, you can use the ng2-qrcode-reader component in your Angular application:

```xml

 <ng2-qrcode-reader (result)="render($event)" [qrr-show]="showQRCode" [qrr-value]="value" [qrr-type]="elementType"></ng2-qrcode-reader>


```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Techiediaries](mailto:techiediaries9@gmail.com)
