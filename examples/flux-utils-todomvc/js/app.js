/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import TodoApp from './components/TodoApp.react';
import RelayLocalSchema from 'relay-local-schema';
import {schema} from './flux-infra/schema';

class TodoRoute extends Relay.Route {}
TodoRoute.routeName = 'Todo';
TodoRoute.queries = {
  viewer: (Component) => Relay.QL`
    query TodoQuery {
      viewer {
        ${Component.getFragment('viewer')}
      },
    }
  `,
};


Relay.injectNetworkLayer(new RelayLocalSchema.NetworkLayer({schema}));

ReactDOM.render(
  <Relay.RootContainer
     Component={TodoApp}
     route={new TodoRoute()}
   />,
   document.getElementById('todoapp')
 );
