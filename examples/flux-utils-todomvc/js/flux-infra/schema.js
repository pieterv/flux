import TodoStore from './TodoStore';
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInterfaceType,
} from 'graphql';

/**
 * Get data from stores.
 */
function getTodo(id) {
  for (let todo of getTodos()) {
    if (todo.id === id) {
      return todo;
    }
  }

  return null;
}

function getTodos(status = 'any') {
  var todos = TodoStore.getState().toArray();
  if (status === 'any') {
    return todos;
  }

  return todos.filter(todo => todo.complete === (status === 'completed')) || null;
}

function getViewer(id) {
  if (id === 'me') {
    return {
      id: 'me',
    };
  }

  return null;
}

/**
 * GraphQL Types
 */
var NodeInterface = new GraphQLInterfaceType({
  name: 'Node',
  description: 'An object with an ID',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the object.',
    },
  },
  resolveType: ({id}) => {
    if (getViewer(id)) {
      return GraphQLUser;
    }
    if (getTodo(id)) {
      return GraphQLTodo;
    }
    return null;
  }
});

var GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    complete: {type: GraphQLBoolean},
    text: {type: GraphQLString},
  },
  interfaces: [NodeInterface]
});

var GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    todos: {
      type: new GraphQLList(GraphQLTodo),
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any',
        },
      },
      resolve: (_, {status}) => getTodos(status),
    },
    totalCount: {
      type: GraphQLInt,
      resolve: () => getTodos().length
    },
    completedCount: {
      type: GraphQLInt,
      resolve: () => getTodos('completed').length
    },
  },
  interfaces: [NodeInterface]
});

var Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer('me')
    },
    node: {
      name: 'node',
      description: 'Fetches an object given its ID',
      type: NodeInterface,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The ID of an object'
        }
      },
      resolve: (_, {id}) => (
        getViewer(id) ||
        getTodo(id) ||
        null
      ),
    },
  },
});

export var schema = new GraphQLSchema({
  query: Root,
});
