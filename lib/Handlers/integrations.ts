import { IntegrationType, NodeType } from '@voiceflow/general-types';
import { Node } from '@voiceflow/general-types/build/nodes/integration';
import axios from 'axios';
import _ from 'lodash';
import safeJSONStringify from 'safe-json-stringify';

import { HandlerFactory } from '@/lib/Handler';

import { deepVariableSubstitution, ENDPOINTS_MAP, resultMappings } from './utils/integrations';

export type IntegrationsOptions = {
  customAPIEndpoint: string;
  integrationsLambdaEndpoint: string;
};

const IntegrationsHandler: HandlerFactory<Node, IntegrationsOptions> = ({ customAPIEndpoint, integrationsLambdaEndpoint }) => ({
  canHandle: (node) => node.type === NodeType.INTEGRATIONS,
  handle: async (node, runtime, variables) => {
    if (!node.selected_integration || !node.selected_action) {
      runtime.trace.debug('no integration or action specified - fail by default');
      return node.fail_id ?? null;
    }

    let nextId: string | null = null;

    try {
      const { selected_action: selectedAction, selected_integration: selectedIntegration } = node;

      const actionBodyData = deepVariableSubstitution(_.cloneDeep(node.action_data), variables.getState());

      const BASE_URL = selectedIntegration === IntegrationType.CUSTOM_API ? customAPIEndpoint : integrationsLambdaEndpoint;
      const { data } = await axios.post(`${BASE_URL}${ENDPOINTS_MAP[selectedIntegration][selectedAction]}`, actionBodyData);

      // map result data to variables
      const mappedVariables = resultMappings(node, selectedIntegration === IntegrationType.CUSTOM_API ? data.variables : data);
      // add mapped variables to variables store
      variables.merge(mappedVariables);

      // if custom api returned error http status nextId to fail port, otherwise success
      if (selectedIntegration === IntegrationType.CUSTOM_API && data.response.status >= 400) {
        runtime.trace.debug(`action **${node.selected_action}** for integration **${node.selected_integration}** failed or encountered error`);
        nextId = node.fail_id ?? null;
      } else {
        runtime.trace.debug(`action **${node.selected_action}** for integration **${node.selected_integration}** successfully triggered`);
        nextId = node.success_id ?? null;
      }
    } catch (error) {
      runtime.trace.debug(
        `action **${node.selected_action}** for integration **${node.selected_integration}** failed  \n${safeJSONStringify(error.response?.data)}`
      );
      nextId = node.fail_id ?? null;
    }

    return nextId;
  },
});

export default IntegrationsHandler;
