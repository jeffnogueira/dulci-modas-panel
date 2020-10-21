import { Config } from 'app/shared/components/several-components/data-table/config';
import { Subscription } from 'rxjs';

import { Operation } from '../enums/operation.enum';

export interface ViewInterface {
	title: string;
	iconName: string;
	operation: Operation;
	dataSource: any[];
	subscription: Subscription;
	configuration: Config;
	paginationInitial: {};

	onRefresh(params?: any): void;
	onSearch(value: any): void;
	onUpdate(value: any): void;
	onView(value: any): void;
	onDelete(value: any): void;
}
