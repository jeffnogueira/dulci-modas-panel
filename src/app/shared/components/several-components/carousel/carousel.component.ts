import { Component, OnInit, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ImageCarousel } from 'app/shared/models/imageCarousel.model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
	selector: 'app-carousel',
	templateUrl: './carousel.component.html',
	styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit {

	@Input() imagesCarousel: ImageCarousel;

	slideIndex = 1;
	slides;
	urlS3 = environment.bucketS3;

	constructor(
		private _router: Router,
		private _elementRef: ElementRef,
	) { }

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		if (this.imagesCarousel) {
			this.slides = this._elementRef.nativeElement.querySelectorAll('.mySlides');
			this.showSlides(this.slideIndex);
		}
	}

	plusSlides(n): void {
		this.showSlides(this.slideIndex += n);
	}

	currentSlide(n): void {
		this.showSlides(this.slideIndex = n);
	}

	showSlides(n): void {

		if (n > this.slides.length) {
			this.slideIndex = 1;
		}

		if (n < 1) {
			this.slideIndex = this.slides.length;
		}

		for (const slide of this.slides) {
			if (slide) {
				slide.className = slide.className.replace(' dBlock', ' dNone');
			}
		}

		for (let i = -1; i <= 3; i++) {
			if (this.slides[this.slideIndex + i]) {
				this.slides[this.slideIndex + i].className = this.slides[this.slideIndex + i].className.replace(' dNone', ' dBlock');
			}
		}

	}

	navigateToProduct(item): void {
		if (item.link) {
			this._router.navigate([`${item.link}`]);
		}
	}

}
