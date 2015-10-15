/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule wrapWithRelayMagic
 * @flow
 */
'use strict';

import type {ReduceStore} from 'flux/utils';
import type React from 'react';

function wrapWithRelayMagic(Base: Class<React.Component>, stores: Array<ReduceStore>): Class<React.Component> {
  class MagicContainerClass extends Base {
    _fluxContainerSubscriptions: Array<{remove: Function}>;

    componentDidMount(): void {
      if (super.componentDidMount) {
        super.componentDidMount();
      }

      var onChange = () => {
        this.props.relay.forceFetch();
      };

      this._fluxContainerSubscriptions = stores.map(
        store => store.addListener(onChange),
      );
    }

    componentWillUnmount(): void {
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }

      for (var subscription of this._fluxContainerSubscriptions) {
        subscription.remove();
      }
      this._fluxContainerSubscriptions = [];
    }
  }

  var container = (MagicContainerClass: any);
  var componentName = Base.displayName || Base.name;
  container.displayName = 'MagicRelayTHing(' + componentName + ')';

  return container;
}

module.exports = wrapWithRelayMagic;
