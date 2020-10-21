import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
	{
		id: 'administrative',
		title: 'Administrativo',
		type: 'group',
		children: [
			{
				id: 'category',
				title: 'Categorias',
				type: 'item',
				icon: 'category',
				url: '/auth/admin/categories',
			}, {
				id: 'client',
				title: 'Clientes',
				type: 'item',
				icon: 'person',
				url: '/auth/admin/clients',
			}, {
				id: 'provider',
				title: 'Fornecedores',
				type: 'item',
				icon: 'person_pin',
				url: '/auth/admin/providers',
			}, {
				id: 'product',
				title: 'Produtos',
				type: 'item',
				icon: 'shopping_cart',
				url: '/auth/admin/products',
			}, {
				id: 'user',
				title: 'Usuários',
				type: 'item',
				icon: 'person',
				url: '/auth/admin/users',
			},
		]
	}, {
		id: 'financial',
		title: 'Financeiro',
		type: 'group',
		children: [
			{
				id: 'purchase',
				title: 'Compras',
				type: 'item',
				icon: 'shopping_cart',
				url: '/auth/financial/purchases',
			}, {
				id: 'sale',
				title: 'Vendas',
				type: 'item',
				icon: 'add_shopping_cart',
				url: '/auth/financial/sales',
			},
		]
	}, {
		id: 'reports',
		title: 'Relatórios',
		type: 'group',
		children: [
			{
				id: 'report-purchase',
				title: 'Relatório de Compras',
				type: 'item',
				icon: 'insert_chart',
				url: '/auth/report/report-purchases',
			}, {
				id: 'report-sale',
				title: 'Relatório de Vendas',
				type: 'item',
				icon: 'insert_chart',
				url: '/auth/report/report-sales',
			}, {
				id: 'suggestion',
				title: 'Sugestões',
				type: 'item',
				icon: 'slideshow',
				url: '/auth/report/suggestions',
			},
		]
	}, {
		id: 'system',
		title: 'Sistema',
		type: 'group',
		children: [
			{
				id: 'logout',
				title: 'Sair',
				type: 'item',
				icon: 'directions_run',
				url: '/not-auth/logout',
			}
		]
	}
];
