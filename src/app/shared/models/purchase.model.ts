import { DataColumn } from 'app/shared/classes/data-column';
import { Product } from './product.model';
import { Provider } from './provider.model';

export class Purchase extends DataColumn {
	idPurchase?: number;
	quantity?: number;
	unitPrice?: number;
	product?: Product;
	provider?: Provider;
	datePurchase?: Date;
}
