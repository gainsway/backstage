import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { camelCase, kebabCase, snakeCase, startCase } from 'lodash';
import { scaffolderTemplatingExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

const scaffolderModuleCustomFilters = createBackendModule({
  pluginId: 'scaffolder', // name of the plugin that the module is targeting
  moduleId: 'custom-filters',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderTemplatingExtensionPoint,
        // ... and other dependencies as needed
      },
      async init({ scaffolder /* ..., other dependencies */ }) {
        scaffolder.addTemplateFilters({
          camelCase: (...args: any[]) => {
            return args.map(arg => camelCase(arg));
          },
          pascalCase: (...args: any[]) => {
            return args.map(arg => startCase(camelCase(arg)).replace(/ /g, ''));
          },
          kebabCase: (...args: any[]) => {
            return args.map(arg => kebabCase(arg));
          },
          snakeCase: (...args: any[]) => {
            return args.map(arg => snakeCase(arg));
          },
        });
      },
    });
  },
});

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(scaffolderModuleCustomFilters());
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));

backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
// See https://backstage.io/docs/auth/guest/provider

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));

backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

// permission plugin
backend.add(import('@backstage/plugin-permission-backend/alpha'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

backend.start();
