import { DataColumn } from 'app/shared/classes/data-column';
import { User } from './user.model';

export class Comment extends DataColumn {
	idComment?: number;
	description?: string;
	user?: User;
}
