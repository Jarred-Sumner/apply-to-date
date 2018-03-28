import _ from "lodash";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { camelizeAttributes } from "../lib/jsonapi";
import { compose } from "recompose";
import { LOGIN_STATUSES } from "../components/LoginGate";
import Cookies from "browser-cookies";
import moment from "moment";
import { createSelector } from "reselect";
import { REGIONS, isDatesEnabled } from "../helpers/dateEvent";

export const UPDATE_ENTITIES = "UPDATE_ENTITIES";
export const SET_CURRENT_USER_ID = "SET_CURRENT_USER_ID";
export const SET_USER_AGENT = "SET_USER_AGENT";
export const SET_LOGIN_STATUS = "SET_LOGIN_STATUS";
export const SET_UNREAD_NOTIFICATION_COUNT = "SET_UNREAD_NOTIFICATION_COUNT";

function customizer(objValue, srcValue) {
  if (objValue && objValue.id && objValue.id === srcValue.id) {
    return srcValue;
  }

  if (_.isArray(objValue)) {
    return _.concat(objValue, srcValue);
  }
}

const mergeWithArray = (value, state) => {
  return _.mergeWith({ ...state }, { ...value }, customizer);
};

const toArray = object => {
  if (_.isArray(object)) {
    return object;
  } else {
    return _.compact([object]);
  }
};

export const normalizeApiResponse = response => {
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

  return entities;
};

export const updateEntities = response => {
  return {
    type: UPDATE_ENTITIES,
    payload: normalizeApiResponse(response)
  };
};

export const setUnreadNotificationCount = unreadNotificationCount => {
  return {
    type: SET_UNREAD_NOTIFICATION_COUNT,
    payload: unreadNotificationCount
  };
};

export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER_ID,
    payload: user
  };
};

export const setLoginStatus = user => {
  return {
    type: SET_LOGIN_STATUS,
    payload: user ? LOGIN_STATUSES.loggedIn : LOGIN_STATUSES.guest
  };
};

export const setCheckingLogin = () => {
  return {
    type: SET_LOGIN_STATUS,
    payload: LOGIN_STATUSES.checking
  };
};

export const setUserAgent = payload => {
  return {
    type: SET_USER_AGENT,
    payload
  };
};

export const currentUser = (state = null, action) => {
  if (action && action.type === SET_CURRENT_USER_ID) {
    if (typeof document !== "undefined") {
      if (action.payload) {
        Cookies.set("currentUserId", action.payload, {
          expires: new Date(2018, 11, 30)
        });
      } else {
        Cookies.erase("currentUserId");
      }
    }

    return action.payload;
  } else {
    return state;
  }
};

export const defaultState = {
  profile: {},
  user: {},
  notification: {},
  external_authentication: {},
  review_application: {},
  application: {},
  currentUserId: null,
  date_event: {},
  date_event_application: {},
  unreadNotificationCount: 0,
  loginStatus: "pending",
  userAgent: null
};

export const loginStatus = (state = defaultState.loginStatus, action) => {
  if (action && action.type === SET_LOGIN_STATUS) {
    return action.payload;
  } else {
    return state;
  }
};

export const userAgent = (state = defaultState.userAgent, action) => {
  if (action && action.type === SET_USER_AGENT) {
    return action.payload;
  } else {
    return state;
  }
};

export const unreadNotificationCount = (
  state = defaultState.unreadNotificationCount,
  action
) => {
  if (action && action.type === SET_UNREAD_NOTIFICATION_COUNT) {
    return action.payload;
  } else {
    return state;
  }
};

export const currentUserIdSelector = state => state.currentUserId;
export const userSelector = state => state.user;
export const profileSelector = state => state.profile;
export const currentUserSelector = createSelector(
  [userSelector, currentUserIdSelector],
  (users, userId) => {
    if (!userId) {
      return null;
    } else {
      return users[userId];
    }
  }
);

export const currentProfileSelector = createSelector(
  currentUserSelector,
  currentUser => _.get(currentUser, "profile")
);

export const currentRegionSelector = createSelector(
  currentProfileSelector,
  currentProfile => _.get(currentProfile, "region")
);

export const dateEventsByRegionSelector = region =>
  createSelector(
    [
      dateEventsSelector,
      currentProfileSelector,
      currentUserDateEventApplicationsByDateEventId
    ],
    (dateEvents, profile, dateEventApplications) => {
      return _.orderBy(
        _.values(dateEvents)
          .filter(({ region: eventRegion }) => eventRegion === region)
          .filter(
            ({ id }) =>
              !["approved"].includes(
                _.get(dateEventApplications[parseInt(id, 10)], "approvalStatus")
              )
          )
          .filter(({ id }) => {
            return !["declined"].includes(
              _.get(
                dateEventApplications[parseInt(id, 10)],
                "confirmationStatus"
              )
            );
          })
          .filter(
            ({ occursOnDay }) =>
              moment(occursOnDay).isAfter(moment()) ||
              moment(occursOnDay).isSame(moment(), "day")
          )
          .filter(({ profileId }) => String(profileId) !== String(profile.id)),

        "occursOnDay",
        "asc"
      );
    }
  );

export const findDateEventApplicationByDateEventId = dateEventId => state => {
  return _.values(state.date_event_application).find(
    ({ dateEventId: currentDateEventId }) =>
      String(currentDateEventId) === String(dateEventId)
  );
};

export const dateEventsPendingRSVPSelector = state => {
  const dateEventsPendingRSVP = _.values(state.date_event_application)
    .filter(
      ({ approved, confirmationStatus }) =>
        approved === true && confirmationStatus === "pending_confirmation"
    )
    .map(dateEventApplication => {
      return {
        ...dateEventApplication,
        dateEvent: state.date_event[dateEventApplication.dateEventId]
      };
    });

  return dateEventsPendingRSVP;
};

export const dateEventSelector = id => state => {
  return state.date_event[parseInt(id, 10)];
};

export const dateEventBySlug = (profileId, slug) => state => {
  return _.find(
    _.values(state.date_event),
    dateEvent => dateEvent.profileId === profileId && dateEvent.slug === slug
  );
};

export const dateEventApplicationSelector = id => state => {
  return state.date_event_application[id];
};

export const applicationsByProfile = state => {
  const profileIds = {};
  _.values(state.application).map(application => {
    if (!profileIds[application.profileId]) {
      profileIds[application.profileId] = [];
    }

    profileIds[application.profileId].push(application);
  });

  return profileIds;
};

export const dateEventsSelector = state => state.date_event;
export const dateEventApplicationsSelector = state =>
  state.date_event_application;

export const dateEventApplicationsByDateEventID = createSelector(
  dateEventApplicationsSelector,
  dateEventApplications => {
    const dateEventIDs = {};
    _.values(dateEventApplications).forEach(application => {
      if (!dateEventIDs[String(application.dateEventId)]) {
        dateEventIDs[String(application.dateEventId)] = [];
      }

      dateEventIDs[String(application.dateEventId)].push(application);

      dateEventIDs[String(application.dateEventId)] = _.orderBy(
        dateEventIDs[String(application.dateEventId)],
        "createdAt",
        "desc"
      );
    });

    return dateEventIDs;
  }
);

export const isApplicationPickable = application => {
  return (
    _.includes(
      ["pending", "submitted", "approved"],
      application.approvalStatus
    ) && _.includes(["pending_confirmation"], application.confirmationStatus)
  );
};

export const pickableDateEventApplicationsByDateEventId = createSelector(
  dateEventApplicationsSelector,
  dateEventApplications => {
    const apps = {};

    const dateEventIDs = {};
    _.values(dateEventApplications)
      .filter(isApplicationPickable)
      .forEach(application => {
        if (!dateEventIDs[String(application.dateEventId)]) {
          dateEventIDs[String(application.dateEventId)] = [];
        }

        dateEventIDs[String(application.dateEventId)].push(application);

        dateEventIDs[String(application.dateEventId)] = _.orderBy(
          dateEventIDs[String(application.dateEventId)],
          "id",
          "desc"
        );
      });

    return dateEventIDs;
  }
);

export const approvedDateEventApplicationsByDateEventID = createSelector(
  dateEventApplicationsSelector,
  dateEventApplications => {
    const dateEventIDs = {};
    _.values(dateEventApplications)
      .filter(application => application.approvalStatus === "approved")
      .forEach(application => {
        dateEventIDs[String(application.dateEventId)] = application;
      });

    return dateEventIDs;
  }
);

export const currentUserDateEventApplicationsByDateEventId = createSelector(
  [dateEventApplicationsSelector, currentProfileSelector],
  (applications, currentProfile) => {
    if (!currentProfile) {
      return {};
    }

    const dateEventIDs = {};

    _.values(applications)
      .filter(application => {
        return application.profileId === currentProfile.id;
      })
      .forEach(application => {
        dateEventIDs[application.dateEventId.toString()] = application;
      });

    return dateEventIDs;
  }
);

export const upcomingDateEventApplicationsSelector = createSelector(
  [currentProfileSelector, dateEventsSelector, dateEventApplicationsSelector],
  (profile, dateEvents, applications) => {
    const dateEventsPendingRSVP = _.values(applications)
      .filter(({ approvalStatus }) => approvalStatus === "approved")
      .filter(({ dateEventId }) => {
        const dateEvent = dateEvents[dateEventId];
        return (
          dateEvent &&
          dateEvent.profileId !== profile.id &&
          (moment(dateEvent.occursOnDay).isAfter(moment()) ||
            moment(dateEvent.occursOnDay).isSame(moment(), "day"))
        );
      })
      .map(dateEventApplication => {
        return {
          ...dateEventApplication,
          dateEvent: dateEvents[dateEventApplication.dateEventId.toString()]
        };
      });

    return _.orderBy(dateEventsPendingRSVP, "dateEvent.occursOnDay", "asc");
  }
);

export const canCurrentUserCreateDateEventsSelector = createSelector(
  currentProfileSelector,
  profile => isDatesEnabled(profile)
);

export const upcomingDateEventsSelector = createSelector(
  [currentProfileSelector, dateEventsSelector],
  (profile, dateEvents) => {
    return _.orderBy(
      _.values(dateEvents)
        .filter(({ profileId }) => String(profileId) === String(profile.id))
        .filter(({ status }) =>
          ["chose_applicant", "scheduled"].includes(status)
        )
        .filter(({ occursOnDay }) => {
          return (
            moment(occursOnDay).isAfter(moment()) ||
            moment(occursOnDay).isSame(moment(), "day")
          );
        }),
      "occursOnDay",
      "asc"
    );
  }
);

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
    loginStatus: loginStatus,
    userAgent,
    unreadNotificationCount,
    profile: createEntitiyReducer("profile"),
    notification: createEntitiyReducer("notification"),
    user: createEntitiyReducer("user"),
    external_authentication: createEntitiyReducer("external_authentication"),
    review_application: createEntitiyReducer("review_application"),
    application: createEntitiyReducer("application"),
    date_event: createEntitiyReducer("date_event"),
    date_event_application: createEntitiyReducer("date_event_application")
  });
};

const newStore = (initialState = defaultState, reducers) => {
  return createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};

export const initStore = (initialState = defaultState, { isServer }) => {
  return newStore(initialState, createReducers());
};
