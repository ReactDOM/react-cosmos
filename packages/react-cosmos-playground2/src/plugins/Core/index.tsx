import React from 'react';
import { PluginContext, createPlugin } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { CoreSpec } from './public';
import { Layout } from './Layout';
import { NAV_WIDTH_STORAGE_KEY, NAV_WIDTH_DEFAULT } from './shared';
import { RouterSpec } from '../Router/public';

type Context = PluginContext<CoreSpec>;

const { onLoad, plug, register } = createPlugin<CoreSpec>({
  name: 'core',
  defaultConfig: {
    projectId: 'defaultProjectId',
    fixturesDir: '__fixtures__',
    fixtureFileSuffix: 'fixture',
    devServerOn: false,
    webRendererUrl: null
  },
  initialState: {
    storageCacheReady: false
  },
  methods: {
    getFixtureFileVars,
    isDevServerOn,
    getWebRendererUrl
  }
});

onLoad(context => {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.loadCache(context.getConfig().projectId).then(() => {
    context.setState({ storageCacheReady: true });
  });
});

plug('root', ({ pluginContext: { getState, getMethodsOf } }) => {
  const { storageCacheReady } = getState();
  if (!storageCacheReady) {
    return (
      <Layout
        storageCacheReady={false}
        fullScreen={false}
        navWidth={0}
        setNavWidth={() => {}}
      />
    );
  }

  const storage = getMethodsOf<StorageSpec>('storage');
  const router = getMethodsOf<RouterSpec>('router');
  return (
    <Layout
      storageCacheReady={true}
      fullScreen={router.isFullScreen()}
      navWidth={
        storage.getItem<number>(NAV_WIDTH_STORAGE_KEY) || NAV_WIDTH_DEFAULT
      }
      setNavWidth={(newNavWidth: number) =>
        storage.setItem(NAV_WIDTH_STORAGE_KEY, newNavWidth)
      }
    />
  );
});

export { register };

function getFixtureFileVars({ getConfig }: Context) {
  const { fixturesDir, fixtureFileSuffix } = getConfig();
  return { fixturesDir, fixtureFileSuffix };
}

function isDevServerOn({ getConfig }: Context) {
  return getConfig().devServerOn;
}

function getWebRendererUrl({ getConfig }: Context) {
  return getConfig().webRendererUrl;
}
