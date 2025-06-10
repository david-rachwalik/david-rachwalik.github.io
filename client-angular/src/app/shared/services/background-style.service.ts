import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackgroundStyleService {
  private renderer: Renderer2;
  private originalStyles: { [key: string]: string } = {};

  // Observable for background style changes
  private backgroundStyleSubject = new BehaviorSubject<{
    color?: string;
    image?: string;
    attachment?: string;
  }>({});
  backgroundStyle$ = this.backgroundStyleSubject.asObservable();

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addBodyClass(className: string): void {
    this.document.body.classList.add(className);
  }

  removeBodyClass(className: string): void {
    this.document.body.classList.remove(className);
  }

  storeOriginalStyles(): void {
    const { body } = document;
    this.originalStyles = {
      backgroundColor: body.style.backgroundColor,
      backgroundImage: body.style.backgroundImage,
      backgroundAttachment: body.style.backgroundAttachment,
    };
  }

  setBackgroundStyles(color: string, image: string, attachment: string): void {
    const { body } = document;
    this.renderer.setStyle(body, 'backgroundColor', color);
    this.renderer.setStyle(body, 'backgroundImage', image);
    this.renderer.setStyle(body, 'backgroundAttachment', attachment);

    // Emit the new styles via the observable
    this.backgroundStyleSubject.next({ color, image, attachment });
  }

  restoreOriginalStyles(): void {
    const { body } = document;
    this.renderer.setStyle(
      body,
      'backgroundColor',
      this.originalStyles['backgroundColor'] || 'white',
    );
    this.renderer.setStyle(
      body,
      'backgroundImage',
      this.originalStyles['backgroundImage'] || 'none',
    );
    this.renderer.setStyle(
      body,
      'backgroundAttachment',
      this.originalStyles['backgroundAttachment'] || 'scroll',
    );

    // Emit restored default styles via the observable
    this.backgroundStyleSubject.next({
      color: this.originalStyles['backgroundColor'] || 'white',
      image: this.originalStyles['backgroundImage'] || 'none',
      attachment: this.originalStyles['backgroundAttachment'] || 'scroll',
    });
  }
}
