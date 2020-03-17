import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { fakeRegister, getCaptcha } from '@/services/userregister';

export interface StateType {
  status?: 'ok' | 'error';
  errors?: {},
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
    getCaptcha: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
    errHandle: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userAndregister',

  state: {
    status: undefined,
    errors: {},
  },

  effects: {
    *submit({ payload }, { call, put }) {
      try {
        const response = yield call(fakeRegister, payload);
        yield put({
          type: 'registerHandle',
          payload: response,
        });
      } catch (error) {
        yield put({
          type: 'errHandle',
          payload: error.data.errors,
        });

      }
    },
    *getCaptcha({ payload }, { call, put }) {
      const response = yield call(getCaptcha, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
    errHandle(state, { payload }) {
      return {
        ...state,
        errors: payload,
      };
    },
  },
};

export default Model;
