import { DataColumn } from 'app/shared/classes/data-column';

export class User extends DataColumn {
	idUser?: number;
	name?: string;
	email?: string;
	password?: string;
}
