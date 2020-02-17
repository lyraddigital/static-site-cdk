import { Construct, Stack } from '@aws-cdk/core';

import { DomainSettings } from './domain-settings';

export class DomainSettingsService {
    public static getSettingsFromContext(scope: Construct): DomainSettings {
        const stack = Stack.of(scope);

        return {
            rootDomain: stack.node.tryGetContext('subdomain'),
            subDomain: stack.node.tryGetContext('domain')
          };
    }
}