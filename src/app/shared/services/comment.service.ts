import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from 'app/shared/models/comment.model';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root'
})
export class CommentService {
	API_URL: string = environment.API;
	contentType = 'application/json';

	constructor(
		private _httpService: HttpService
	) { }

	create(payload: any): Observable<Comment> {
		const url = `${this.API_URL}/comments`;

		return this._httpService.post(url, this.contentType, payload).pipe(map((result: any) => result));
	}

	delete(id: number): Observable<Comment> {
		const url = `${this.API_URL}/comments/${id}`;

		return this._httpService.delete(url, this.contentType).pipe(map((result: any) => result));
	}

}
