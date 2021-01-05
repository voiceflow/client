import { TraceFrame } from '@voiceflow/general-types';

import { State } from '@/lib/Runtime';

export type Context<R = Record<string, unknown>, T = TraceFrame> = {
  request: R;
  state: Omit<State, 'trace'>;
  versionID: string;
  trace?: T[];
  end?: boolean;
};

export type ContextHandle<C extends Context<any, any>> = (request: C) => C | Promise<C>;

export interface ContextHandler<C extends Context<any, any>> {
  handle: ContextHandle<C>;
}

// for request handlers that generate the runtime
export type InitContextHandle<C extends Context<any, any>> = (params: Partial<C>) => C | Promise<C>;

export interface InitContextHandler<C extends Context<any, any>> {
  handle: InitContextHandle<C>;
}
