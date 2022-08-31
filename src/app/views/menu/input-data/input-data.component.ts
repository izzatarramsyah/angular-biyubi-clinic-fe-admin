import { Component, AfterViewInit } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

//declare var require: any;

@Component({
  templateUrl: './input-data.component.html'
})
export class InputDataComponent implements AfterViewInit {
  subtitle: string;

  currentJustify = 'start';

  active=1;
  activev= "top";

  activeKeep=1;

  activeSelected=1;
  disabled = true;

  tabs = [1, 2, 3, 4, 5];
  counter = this.tabs.length + 1;
  activeDynamic=1;

  constructor() {
    this.subtitle = 'This is some text within a card block.';
  }

  ngAfterViewInit() { }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.activeSelected = 1;
    }
  }

  close(event: MouseEvent, toRemove: number) {
    this.tabs = this.tabs.filter(id => id !== toRemove);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  add(event: MouseEvent) {
    this.tabs.push(this.counter++);
    event.preventDefault();
  }

}
