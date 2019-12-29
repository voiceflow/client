import Context, { ActionType } from '@/lib/Context';
import Frame, { State as FrameState } from '@/lib/Context/Stack/Frame';
import cycleHandler from './cycleHandler';

const STACK_OVERFLOW = 60;

type Action = { type: ActionType.ENDING } | { type: ActionType.POPPING } | { type: ActionType.PUSHING; payload: FrameState };

const cycleStack = async (context: Context, calls: number = 0): Promise<void> => {
  if (context.stack.getDepth() > STACK_OVERFLOW || this.stack.getDepth() === 0) {
    context.setAction(ActionType.END);
    return;
  }

  const currentFrame = context.stack.top();
  const diagram = await context.fetchDiagram(currentFrame.diagramID);

  await cycleHandler(context, diagram);

  const action = context.getAction() as Action;

  switch (action.type) {
    case ActionType.ENDING:
      return;
    case ActionType.POPPING:
      context.stack.pop();
      break;
    case ActionType.PUSHING:
      context.stack.push(new Frame(action.payload));
      break;
  }

  await cycleStack(context, calls + 1);
};

export default cycleStack;
