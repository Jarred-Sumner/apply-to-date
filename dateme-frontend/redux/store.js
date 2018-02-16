import _ from "lodash";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { camelizeAttributes } from "../lib/jsonapi";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { compose } from "recompose";

export const UPDATE_ENTITIES = "UPDATE_ENTITIES";
export const SET_CURRENT_USER = "SET_CURRENT_USER";

function customizer(objValue, srcValue) {
  if (objValue && objValue.id && objValue.id === srcValue.id) {
    return srcValue;
  }

  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const mergeWithArray = (value, state) => {
  return _.mergeWith(state, { ...value }, customizer);
};

const toArray = object => {
  if (_.isArray(object)) {
    return object;
  } else {
    return _.compact([object]);
  }
};

export const updateEntities = response => {
  let entities = toArray(response.data);

  if (response.included) {
    entities = _.concat(entities, toArray(response.included));
  }

  entities = _.groupBy(entities, "type");

  _.keys(entities).forEach(key => {
    entities[key] = _.fromPairs(
      entities[key].map(entity => [entity.id, camelizeAttributes(entity)])
    );
  });

  return {
    type: UPDATE_ENTITIES,
    payload: entities
  };
};

export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};

export const currentUser = (state = null, action) => {
  if (action && action.type === SET_CURRENT_USER) {
    if (typeof document !== "undefined") {
      document.cookie = "currentUserId=" + action.payload;
    }

    return action.payload;
  } else {
    return state;
  }
};

export const defaultState = {
  profile: {},
  user: {},
  external_authentication: {},
  review_application: {},
  application: {},
  currentUserId: null
};

export const createEntitiyReducer = entityType => {
  return (_state, action) => {
    const state = _state || defaultState[entityType];
    if (
      action &&
      action.type === UPDATE_ENTITIES &&
      action.payload &&
      action.payload[entityType]
    ) {
      return mergeWithArray(action.payload[entityType], state);
    }
    return state;
  };
};

const createReducers = persist => {
  return combineReducers({
    currentUserId: currentUser,
    profile: createEntitiyReducer("profile"),
    user: createEntitiyReducer("user"),
    external_authentication: createEntitiyReducer("external_authentication"),
    review_application: createEntitiyReducer("review_application"),
    application: createEntitiyReducer("application")
  });
};

const newStore = (initialState, reducers) => {
  return createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};

export const initStore = (initialState = defaultState, { isServer }) => {
  return newStore(initialState, createReducers());
};
