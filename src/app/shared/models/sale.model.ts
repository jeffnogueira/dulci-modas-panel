import { DataColumn } from 'app/shared/classes/data-column';
import { Product } from './product.model';
import { Client } from './client.model';
import { Comment } from './comment.model';

export class Sale extends DataColumn {
	idSale?: number;
	dateSale?: Date;
	quantity?: number;
	plots?: number;
	discount?: number;
	description?: string;
	dropSale?: boolean;
	product?: Product;
	client?: Client;
	comments?: Comment[];
	totalUnitPrice?: number;
	totalSalePrice?: number;
}
