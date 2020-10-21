import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

	@Input() title: string;
	@Input() type: string;
	@Input() dataSource: { labels: Array<string>, data: Array<number> };

	@ViewChild('chart', { static: true }) chart: ElementRef<HTMLCanvasElement>;

	mockColors = ['#0c0cb1', '#e0e40d', '#d61111', '#4be40d', '#f3590e', '#6b0cb1', '#f10ef3', '#610505', '#0dcfe4', '#807f82'];

	constructor() { 
	}

	ngOnInit(): void {
		this.createChart();
	}

	createChart(): void {
		const myChart = new Chart(this.chart.nativeElement, {
			type: this.type,
			data: {
				labels: this.dataSource.labels,
				datasets: [{
					label: this.title,
					data: this.dataSource.data,
					backgroundColor: this.mockColors,
					borderColor: this.mockColors,
					borderWidth: 1
				}]
			},
			options: {
				legend: {
					labels: {
						boxWidth: 20
					},
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			}
		});
	}

}
