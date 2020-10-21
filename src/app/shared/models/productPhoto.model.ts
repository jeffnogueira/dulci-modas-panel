import { Product } from './product.model';
import { Photo } from './photo.model';

export class ProductPhoto {
	idProduct?: number;
	idPhoto?: number;
	position?: number;
	file?: File;
	product?: Product[];
	photo?: Photo | Photo[];
}
