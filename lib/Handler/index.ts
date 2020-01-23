import Context from '@/lib/Context';
import Diagram from '@/lib/Diagram';
import Store from '@/lib/Context/Store';

// handlers
import CodeHandler from './code';
import EndHandler from './end';
import FlowHandler from './flow';
import StartHandler from './start';
import RandomHandler from './random';
import IfHandler from './if';
import SetHandler from './set';

type Block = Record<string, any>;

export interface Handler {
  canHandle: (block: Block, context: Context, variables: Store, diagram: Diagram) => boolean;
  handle: (block: Block, context: Context, variables: Store, diagram: Diagram) => string | Promise<string>;
}

export const DefaultHandlers = [CodeHandler, EndHandler, FlowHandler, StartHandler, RandomHandler, SetHandler, IfHandler];

export default Handler;
