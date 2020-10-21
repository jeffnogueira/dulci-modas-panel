import { DataColumn } from 'app/shared/classes/data-column';
import { Category } from './category.model';
import { ProductPhoto } from './productPhoto.model';

export class Product extends DataColumn {
	idProduct?: number;
	name?: string;
	description?: string;
	leftQuantity?: number;
	quantity?: number;
	unitPrice?: number;
	interestPrice?: number;
	percent?: number;
	category?: Category;
	categoryName?: string;
	totalUnitPrice?: number;
	totalInterestPrice?: number;
	productPhotos?: ProductPhoto[];
}
