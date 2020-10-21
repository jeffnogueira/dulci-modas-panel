import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Column } from './column';
import { Config } from './config';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
	selector: 'app-data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.scss'],
	animations: fuseAnimations,
})
export class DataTableComponent implements OnInit, OnChanges, OnDestroy {
	
	@Input() isViewed = true;
	@Input() isUpdated = true;
	@Input() isDeleted = true;
	@Input() isPaginated = true;

	@Input() data: Array<any>;
	@Input() config: Config;
	@Input() buttons: Array<any>;

	@Input() backgroundColor = '#fff';

	@Input() disableToggles = false;
	@Input() disableCheckboxes = false;
	@Input() disableInputs = false;

	@Input() startPageSize = 10;
	@Input() hidePageSize = false;
	@Input() hideActions = false;

	@Output() update = new EventEmitter();
	@Output() view = new EventEmitter();
	@Output() delete = new EventEmitter();
	@Output() custom = new EventEmitter();

	@Output() refresh = new EventEmitter();
	@Output() changeStatus = new EventEmitter();
	@Output() changeChecked = new EventEmitter();
	@Output() directClick = new EventEmitter();
	@Output() buttonClick = new EventEmitter();

	@ViewChild(MatSort, null) sort: MatSort;
	@ViewChild(MatPaginator, null) paginator: MatPaginator;

	length = 0;
	pageSize = 10;
	pageIndex = 0;
	actualDirection;
	actualActive;
	pageSizeOptions = [10];

	TYPE_COMMOM = Column.TYPE_COMMOM;
	TYPE_IMAGE = Column.TYPE_IMAGE;
	TYPE_ACTIONS = Column.TYPE_ACTIONS;
	TYPE_STATUS = Column.TYPE_STATUS;
	TYPE_CHIP_BOOLEAN = Column.TYPE_CHIP_BOOLEAN;
	TYPE_BUTTON = Column.TYPE_BUTTON;
	TYPE_CHECKBOX = Column.TYPE_CHECKBOX;
	TYPE_INPUT = Column.TYPE_INPUT;
	TYPE_DATE = Column.TYPE_DATE;

	private readonly MOBILE_BREAKPOINT: number = 768;
	private mobileColumnsConfiguration = [];

	dataSource;
	previousIndex: number;

	highlightedRows = [];

	@Input() shouldSelectRow: boolean;

	private _destroy$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _changesDetector: ChangeDetectorRef,
		private _utilsService: UtilsService
	) {
		this._utilsService.paginatorWasChanged.subscribe(() => {
			this.pageIndex = 0;
		});
	}

	ngOnInit(): void {
		this.pageSize = this.startPageSize;
		this.pageSizeOptions = [this.startPageSize];

		this._start();
	}

	ngOnChanges(): void {
		this._start();
	}

	ngOnDestroy(): void {
		this._destroy$.next(true);
		this._destroy$.unsubscribe();
	}

	private _start(): void {
		if (this.data) {
			this.dataSource = new MatTableDataSource(this.data);
			this._changesDetector.detectChanges();

			this._startSort();
			this._startPaginator();
		}
	}

	private _startSort(): void {
		if (this.sort) {
			this.sort.sortChange.pipe(takeUntil(this._destroy$)).subscribe(
			data => {
				let canEmit = false;

				if ((this.actualDirection !== this.sort.direction) ||
				(this.actualActive !== this.sort.active)) {

				canEmit = true;
				}

				this.actualDirection = this.sort.direction;
				this.actualActive = this.sort.active;

				if (canEmit) {
				this.refresh.emit(
					{
					orderBy: this.sort.active,
					direction: this.sort.direction,
					pageIndex: this.paginator.pageIndex,
					pageSize: this.paginator.pageSize
					}
				);
				}
			}
			);
		}
	}

	private _startPaginator(): void {
		if (this.config && this.config.total) {
			this.length = this.config.total;
			if (this.length > this.startPageSize) {
			if (this.startPageSize !== 10) {
				this.pageSizeOptions = [this.startPageSize, 20, 30, 40];
			} else {
				this.pageSizeOptions = [10, 20, 30, 40];
			}
			}
		}
		
		if (this.paginator) {
			this.paginator.page.pipe(takeUntil(this._destroy$)).subscribe(
			data => {
				let canEmit = false;

				if ((this.pageSize !== this.paginator.pageSize) || 
				(this.pageIndex !== this.paginator.pageIndex)) {

				canEmit = true;
				}

				this.pageSize = this.paginator.pageSize;
				this.pageIndex = this.paginator.pageIndex;

				if (canEmit) {
				this.refresh.emit(
					{
					orderBy: this.sort.active ? this.sort.active : '',
					direction: this.sort.direction ? this.sort.direction : '',
					pageIndex: this.paginator.pageIndex,
					pageSize: this.paginator.pageSize
					}
				);
				}
			}
			);
		}
	}

	getColumns(): object {
		return this.config.columns.map((item) => item.columnRef);
	}

	getColumnValue(element, column: Column): string {
		const { displayedColumn } = column;
		let value = element;

		if (Array.isArray(displayedColumn)) {
			value = element;
			for (const key of displayedColumn) {
			value = value[key];
			}
		} else {
			value = value[displayedColumn];
		}

		switch (column.type) {
			case Column.TYPE_IMAGE:
			if (!value) {
				return 'assets/images/ecommerce/product-image-placeholder.png';
			} else {
				return value;
			}
			case Column.TYPE_TIME_FROM_NOW: return moment(value, column.config).fromNow();
			default:
			return value;
		}
	}

	getColumnVisibility(element, column: Column): boolean {
		const { notVisibleWhen } = column.config || { notVisibleWhen: null };

		if (!notVisibleWhen) {
			return true;
		}

		const val = element[notVisibleWhen];
		if (val !== undefined || val !== null) {
			return !val;
		} else {
			return true;
		}
	}

	customItem(item, button): void {
		this.custom.emit({item, button});
	}

	viewItem(item): void {
		if (this.isViewed) {
			this.view.emit(item);
		}
	}

	deleteItem(item): void {
		if (this.isDeleted) {
			this.delete.emit(item);
		}
	}

	updateItem(item): void {
		if (this.isUpdated) {
			this.update.emit(item);
		}
	}

	changeStatusItem(item, column): void {
		item[column] = item[column] ? false : true;

		this.changeStatus.emit(item);
	}

	changeCheckedItem(item, column): void {
		this.changeChecked.emit(item);
	}

	callEvent(item, event): void {
		// this._eventsService.getEvent(event).emit(item);
	}

	onButtonClick(event, item): void {
		event.stopPropagation();
		this.buttonClick.emit(item);
	}

	selectRow(row): void {
		if (!this.shouldSelectRow) { return; }
		this.highlightedRows = [];
		this.highlightedRows.push(row);
	}

	isAllSelected(): boolean {
		let numSelected = 0;
		this.dataSource.data.map(item => {
			if (item.active) {
			numSelected++;
			}
		});
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}
	
	masterToggle(): void {
		const checkeds = [];
		if (this.isAllSelected()) {
			this.dataSource.data.map(row => row.active = false);
		} else {
			this.dataSource.data.map(row => {
			checkeds.push(row);
			return row.active = true;
			});
		}
		this.changeChecked.emit(checkeds);
	}

}
