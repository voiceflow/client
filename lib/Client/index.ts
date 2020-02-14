import Context, { Options as ContextOptions, State as ContextState } from '@/lib/Context';
import Request from '@/lib/Context/Request';
import Handler, { DefaultHandlers } from '@/lib/Handler';
import { AbstractLifecycle } from '@/lib/Lifecycle';

const DEFAULT_ENDPOINT = 'https://data.voiceflow.com';

class Controller extends AbstractLifecycle {
  private options: {
    secret?: string;
    endpoint?: string;
    handlers: Handler[];
    services?: Record<string, any>;
  };

  constructor({ secret, endpoint = DEFAULT_ENDPOINT, handlers = [], services = {} }: ContextOptions) {
    super();

    this.options = {
      secret,
      endpoint,
      handlers: [...handlers, ...DefaultHandlers],
      services,
    };
  }

  public createContext(versionID: string, state: ContextState, request?: Request): Context {
    return new Context(versionID, state, request, this.options, this.events);
  }
}

export default Controller;
