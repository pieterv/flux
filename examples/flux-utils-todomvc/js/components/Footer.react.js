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

import type Immutable from 'immutable';
import type Todo from '../flux-infra/Todo';

import React, {Component} from 'react';
import Relay from 'react-relay';
import {dispatch} from '../flux-infra/TodoDispatcher';

type Props = {
  todos: Immutable.Map<string, Todo>,
};

class Footer extends Component<{}, Props, {}> {
  render(): ?ReactElement {
    const {viewer: {totalCount, completedCount}} = this.props;

    if (totalCount === 0) {
      return null;
    }

    const itemsLeft = totalCount - completedCount;
    const itemsLeftPhrase = itemsLeft === 1 ? ' item left' : ' items left';

    let clearCompletedButton;
    if (completedCount > 0) {
      clearCompletedButton =
        <button
          id="clear-completed"
          onClick={this._onClearCompletedClick}>
          Clear completed ({completedCount})
        </button>;
    }

    return (
      <footer id="footer">
        <span id="todo-count">
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
        </span>
        {clearCompletedButton}
      </footer>
    );
  }

  _onClearCompletedClick(): void {
    dispatch({type: 'todo/destroy-completed'});
  }
}

export default Relay.createContainer(Footer, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        todos {
          id,
        },
        totalCount,
        completedCount,
      }
    `,
  },
});
