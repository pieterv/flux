/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

import Footer from './Footer.react';
import Header from './Header.react';
import MainSection from './MainSection.react';
import React, {Component} from 'react';
import wrapWithRelayMagic from '../flux-infra/wrapWithRelayMagic';
import Relay from 'react-relay';

var STORES = [
  require('../flux-infra/TodoStore'),
];

class TodoApp extends Component {
  render(): ?ReactElement {
    return (
      <div>
        <Header />
        <MainSection
          viewer={this.props.viewer}
        />
        <Footer
          viewer={this.props.viewer}
        />
      </div>
    );
  }
}

export default Relay.createContainer(wrapWithRelayMagic(TodoApp, STORES), {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${MainSection.getFragment('viewer')}
        ${Footer.getFragment('viewer')}
      }
    `,
  },
});
