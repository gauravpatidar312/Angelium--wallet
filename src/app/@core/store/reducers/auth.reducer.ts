import {User} from '../../models/user.model';
import {All, AuthActionTypes} from '../actions/user.action';

export interface State {
  // is a user authenticated?
  isAuthenticated: boolean;
  // if authenticated, there should be a user object
  user: null;
  // error message
  errorMessage: string | null;
}

export const initialState: State = {
  isAuthenticated: false,
  user: null,
  errorMessage: null
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case AuthActionTypes.LOGIN: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorMessage: null
      };
    }
    case AuthActionTypes.USER_INFO: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorMessage: null
      };
    }
    case AuthActionTypes.UPDATE_USER_INFO: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorMessage: null
      };
    }
    case AuthActionTypes.SET_USER_PROFILE: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorMessage: null
      };
    }
    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorMessage: null
      };
    }

    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: 'Incorrect email and/or password.'
      };
    } 
    case AuthActionTypes.RESET_STATE: {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        errorMessage: null
      };
    }
    default: {
      return state;
    }
  }
}


// export function reducerLogin(state = initialState, action: All): State {
//   switch (action.type) {
//     case AuthActionTypes.LOGIN_SUCCESS: {
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: {
//           token: action.payload.token,
//           email: action.payload.email
//         },
//         errorMessage: null
//       };
//     }
//     default: {
//       return state;
//     }
//   }
// }

