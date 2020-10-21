import { ActionInterface } from 'app/shared/interfaces/action.interface';
import { Auth } from 'app/shared/models/auth.model';
import { ActionTypes } from 'app/shared/enums/action.enum';

export const initialState = new Auth();

export function authReducer(state = initialState, action: ActionInterface): Auth {
	switch (action.type) {
		case ActionTypes.SET:
			{
				state = action.payload;
				return state;
			}

		case ActionTypes.CLEAR:
			{
				state = initialState;
				return state;
			}

		default:
			return state;
	}
}
