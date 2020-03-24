import Handler from './index';

export type EndBlock = {
  end?: string;
};

const EndHandler: Handler<EndBlock> = {
  canHandle: (block) => {
    return !!block.end;
  },
  handle: (_, context): null => {
    context.stack.pop();
    context.turn.set('end', true);
    context.end();

    context.trace.debug('exiting session - saving location/resolving stack');

    return null;
  },
};

export default EndHandler;
