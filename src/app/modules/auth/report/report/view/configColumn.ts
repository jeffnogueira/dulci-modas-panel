import { Column } from 'app/shared/components/several-components/data-table/column';
import { Config } from 'app/shared/components/several-components/data-table/config';

export const configurationPurchase = new Config([
	{
		displayedColumn: 'productName',
		columnRef: 'idProduct',
		nameColumn: 'Produto',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
	{
		displayedColumn: 'providerName',
		columnRef: 'idProvider',
		nameColumn: 'Fornecedor',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
	{
		displayedColumn: 'datePurchase',
		columnRef: 'datePurchase',
		nameColumn: 'Data',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
	{
		displayedColumn: 'quantity',
		columnRef: 'quantity',
		nameColumn: 'Quantidade',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
	{
		displayedColumn: 'unitPrice',
		columnRef: 'unitPrice',
		nameColumn: 'Preço Unitário',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
], 0);

export const configurationSale = new Config([
	{
		displayedColumn: 'productName',
		columnRef: 'idProduct',
		nameColumn: 'Produto',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
	{
		displayedColumn: 'dateSale',
		columnRef: 'dateSale',
		nameColumn: 'Data',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
	{
		displayedColumn: 'totalSalePrice',
		columnRef: 'totalSalePrice',
		nameColumn: 'Preço Total (R$)',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
	{
		displayedColumn: 'clientName',
		columnRef: 'idClient',
		nameColumn: 'Comprador(a)',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
	{
		displayedColumn: 'dropSale',
		columnRef: 'dropSale',
		nameColumn: 'Baixa na Venda?',
		type: Column.TYPE_COMMOM,
		sorted: false
	},
], 0);
