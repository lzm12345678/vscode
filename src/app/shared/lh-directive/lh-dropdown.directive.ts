/**
 * Created by GyjLoveLh on  2017/12/6
 */
import { Directive, HostListener, Output, Input, EventEmitter, Renderer2, ElementRef, } from '@angular/core';

@Directive({
    selector: '[lh-dropdown]'
})
export class LhDropdownDirective {
    @Output() dropdownStatusChange = new EventEmitter();
    private active = false;
    @Input() private activeCss = 'open';

    constructor(private elmRef: ElementRef, private renderer: Renderer2) {
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick() {
        console.log('click');
        this.active = false;
        this.updateHostStatus();
    }

    @HostListener('click', ['$event'])
    onHostClick($event: Event) {
        console.log('target click run');
        $event.stopPropagation();
        this.active = !this.active;
        this.updateHostStatus();
    }

    updateHostStatus() {
        this.dropdownStatusChange.emit(this.active);
        if (this.active) {
            this.renderer.addClass(this.elmRef.nativeElement, this.activeCss);
            return;
        }
        this.renderer.removeClass(this.elmRef.nativeElement, this.activeCss);
    }
}
