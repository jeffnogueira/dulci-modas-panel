import { Component, OnDestroy, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Column } from 'app/shared/components/several-components/data-table/column';
import { Config } from 'app/shared/components/several-components/data-table/config';
import { ViewInterface } from 'app/shared/interfaces/view.interface';
import { Operation } from 'app/shared/enums/operation.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/shared/services/user.service';
import { User } from 'app/shared/models/user.model';
import { LoadingService } from 'app/shared/components/several-components/loading/loading.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
	animations: fuseAnimations,
})
export class ViewComponent implements OnInit, ViewInterface, OnDestroy {
	title = 'Usuários';
	operation: Operation = Operation.INDEX;
	subscription: Subscription;
	iconName = 'person';
	dataSource = [];

	paginationInitial = { pageIndex: 0, pageSize: 10 };
	options = {};
	
	configuration = new Config([
		{
			displayedColumn: 'name',
			columnRef: 'name',
			nameColumn: 'Nome',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'email',
			columnRef: 'email',
			nameColumn: 'E-mail',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: '',
			columnRef: 'actions',
			nameColumn: 'Ações',
			type: Column.TYPE_ACTIONS,
			sorted: false
		},
	], 0);

	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _userService: UserService,
		private _loadingService: LoadingService,
		private _utilsService: UtilsService,
		private _sweetAlertService: SweetAlertService
	) {
		this._loadingService.show();
	}

	ngOnInit(): void {
		this.onRefresh(this.paginationInitial);
	}

	onRefresh(params?): void {
		this.options = { ...this.options, ...params };
		this.subscription = this._userService.loadAll(this.options).subscribe((result: any) => {
			const users: User[] = result.data;
			this.configuration.total = result.size;
			this.dataSource = users;
			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	onSearch(search): void {
		this._utilsService.paginatorWasChanged.emit();
		this.options = { ...this.options, ...this.paginationInitial, search };
		this.onRefresh(this.options);
	}

	onUpdate(item: User): void {
		this._router.navigate([`../${item.idUser}/edit`], {relativeTo: this._activatedRoute});
	}

	onView(item: User): void {
		this._router.navigate([`../${item.idUser}/view`], {relativeTo: this._activatedRoute});
	}

	onDelete(item: User): void {
		const msg = `Deseja realmente excluir o usuário ${item.name}? Não será possível recuperá-lo!`;

		this._sweetAlertService.confirm(msg).then(response => {

			if (!response.dismiss) { 
				this.subscription = this._userService.delete(item.idUser).subscribe(data => {
					this._loadingService.hide();
					this._sweetAlertService.success('Registro deletado com sucesso.').then(() => this.onRefresh());
				}, (error) => {
					this._loadingService.hide();
					this._sweetAlertService.error('Ocorreu um erro', error.error.message);
				});
			}
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
