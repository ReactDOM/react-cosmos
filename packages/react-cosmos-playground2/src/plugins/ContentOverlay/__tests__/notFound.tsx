import * as React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { RendererPreviewSpec } from '../../RendererPreview/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => ({ path: 'foo.js', name: null })
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false
  });
  mockMethodsOf<RendererPreviewSpec>('rendererPreview', {
    getUrlStatus: () => 'ok',
    getRuntimeStatus: () => 'connected'
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="contentOverlay" />);
}

it('renders "notFound" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();

  expect(queryByTestId('notFound')).not.toBeNull();
});
