import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type PropsWithChildren
} from 'react';
import { STORAGE_KEY, STORAGE_VERSION } from '../lib/storage';
import type { AppAction, AppState } from '../types';

const initialState: AppState = {
  answers: {},
  currentQuestionIndex: 0,
  latestResults: null,
  contentVersion: STORAGE_VERSION
};

function loadState(): AppState {
  if (typeof window === 'undefined') {
    return initialState;
  }

  const storedVersion = window.localStorage.getItem(`${STORAGE_KEY}:version`);

  if (storedVersion !== STORAGE_VERSION) {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.setItem(`${STORAGE_KEY}:version`, STORAGE_VERSION);
    return initialState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...initialState,
      ...parsed,
      contentVersion: STORAGE_VERSION
    };
  } catch {
    return initialState;
  }
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'rehydrate':
      return action.payload;
    case 'answer':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.optionId
        },
        latestResults: null
      };
    case 'go_to':
      return {
        ...state,
        currentQuestionIndex: action.index
      };
    case 'set_results':
      return {
        ...state,
        latestResults: action.results
      };
    case 'set_selected_role':
      return {
        ...state,
        latestResults: state.latestResults
          ? {
              ...state.latestResults,
              selectedRoleId: action.roleId
            }
          : state.latestResults
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);

  useEffect(() => {
    window.localStorage.setItem(`${STORAGE_KEY}:version`, STORAGE_VERSION);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = {
    state,
    dispatch
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
}
