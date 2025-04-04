import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.css']
})
export class SignaturePadComponent {
  @ViewChild('canvas') canvasEl!: ElementRef;
  @Output() signatureSaved = new EventEmitter<string>();

  signaturePad!: SignaturePad;
  signatureNeeded = true;

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement, {
      minWidth: 1,
      maxWidth: 3,
      backgroundColor: 'rgb(255,255,255)',
      penColor: 'rgb(0,0,0)'
    });
  }

  clearPad() {
    this.signaturePad.clear();
    this.signatureNeeded = true;
  }

  savePad() {
    if (!this.signaturePad.isEmpty()) {
      const base64Data = this.signaturePad.toDataURL();
      this.signatureSaved.emit(base64Data);
      this.signatureNeeded = false;
    }
  }
}
