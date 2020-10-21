import { Action } from '@ngrx/store';
import { AuthInterface } from 'app/shared/interfaces/auth.interface';
import { ActionTypes } from 'app/shared/enums/action.enum';

export const AddAuthData = (authInterface: AuthInterface) => {
	return { type: ActionTypes.SET, payload: authInterface } as Action;
};

export const ClearAuthData = () => {
	return { type: ActionTypes.CLEAR, payload: null } as Action;
};
