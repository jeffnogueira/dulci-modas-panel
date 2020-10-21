import { DataColumn } from 'app/shared/classes/data-column';

export class Client extends DataColumn {
	idClient?: number;
	name?: string;
	cpf?: string;
	address?: string;
	phone?: string;
}
