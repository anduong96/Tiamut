/* eslint-disable @typescript-eslint/no-explicit-any */
export type DropFirst<T extends unknown[]> = T extends [any, ...infer U]
  ? U
  : never;

export type Listener<T, K> = (
  current: T,
  previous: T,
  actionName: K | 'setState',
) => void;

export type Action<T> = (state: T, ...params: any[]) => T;

export type ActionsMap<T> = { [key: string]: Action<T> };
export type ModActionMap<S, T extends ActionsMap<S>> = {
  [K in keyof T]: (...params: DropFirst<Parameters<T[K]>>) => void;
};

export type CreateStoreFn<S, A extends ActionsMap<S>> = (param: {
  initialState: S;
  actions: A;
}) => Store<S, A>;

export type Store<S, A extends ActionsMap<S> = ActionsMap<S>> = {
  actions: ModActionMap<S, A>;
  destroy: () => void;
  subscribe: (listener: Listener<S, keyof ModActionMap<S, A>>) => () => boolean;
  getState: () => Readonly<S>;
  resetState: () => void;
  setState: (nextState: S | Action<S>, actionName?: string) => S;
  getInitialState: () => Readonly<S>;
};

export type Selector<S, R = any> = (state: S) => R;
export type SelectorsMap<T> = { [key: string]: Selector<T> };
export type EqualityFn<S> = (a: S, b: S) => boolean;

export type StoreOrStoreParam<S, A extends ActionsMap<S> = ActionsMap<S>> =
  | Store<S, A>
  | Parameters<CreateStoreFn<S, A>>[0];

export type StoreMap = {
  [key: string]: Store<any, any>;
};

export type MergeState<S extends StoreMap> = {
  [K in keyof S]: ReturnType<S[K]['getState']>;
};

export type CombinedSelectorsMap<S extends StoreMap> = {
  [key: string]: Selector<MergeState<S>>;
};
