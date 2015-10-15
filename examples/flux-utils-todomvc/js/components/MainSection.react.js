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

import type Immutable from 'immutable';
import type Todo from '../flux-infra/Todo';

import {dispatch} from '../flux-infra/TodoDispatcher';
import React, {Component} from 'react';
import TodoItem from './TodoItem.react';
import Relay from 'react-relay';

type Props = {
  todos: Immutable.Map<string, Todo>,
  areAllComplete: boolean,
};

class MainSection extends Component<{}, Props, {}> {
  render(): ?ReactElement {
    const {viewer: {totalCount, completedCount, todos}} = this.props;
    const areAllComplete = totalCount === completedCount;

    if (totalCount === 0) {
      return null;
    }

    const todoItems = [];
    for (let todo of todos) {
      todoItems.push(<TodoItem key={todo.id} todo={todo} />);
    }

    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          checked={areAllComplete ? 'checked' : ''}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todoItems}</ul>
      </section>
    );
  }

  _onToggleCompleteAll(): void {
    dispatch({type: 'todo/toggle-complete-all'});
  }
}

export default Relay.createContainer(MainSection, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        todos {
          id,
          ${TodoItem.getFragment('todo')}
        },
        totalCount,
        completedCount,
      }
    `,
  },
});
