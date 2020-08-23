import { client, appsIndex } from '../../algolia';
import {
  homeGetFailed,
  homeGetRequest,
  homeGetSuccess,
  homeUpdateCurrentQuery,
  homeUpdateQuery,
  homeUpdateScrollOffset,
} from './action-creators';

export const getHits = () => (dispatch, getState) => {
  const state = getState();

  const {
    isGetting,
    page,
    currentQuery,
    totalPage,
  } = state.home;

  if (isGetting) return;

  // If all pages have already been fetched, we stop
  if (totalPage && page + 1 >= totalPage) return;

  dispatch(homeGetRequest());

  appsIndex.search(currentQuery, {
    page: page + 1,
    hitsPerPage: 28,
  })
    .then((res) => {
      // validate to make sure this request is not from older query
      const currentHome = getState().home;
      if (currentQuery !== currentHome.currentQuery || page !== currentHome.page) {
        return;
      }
      dispatch(homeGetSuccess({
        hits: res.hits,
        page: res.page,
        totalPage: res.nbPages,
      }));
    })
    .catch(() => {
      // validate to make sure this request is not from older query
      const currentHome = getState().home;
      if (currentQuery !== currentHome.currentQuery || page !== currentHome.page) {
        return;
      }
      dispatch(homeGetFailed());
    });
};

export const resetThenGetHits = (forceClearCache) => (dispatch, getState) => {
  const state = getState();
  const { query } = state.home;

  if (forceClearCache) {
    client.clearCache();
  }

  dispatch(homeUpdateCurrentQuery(query));
  dispatch(getHits(query));
};

let timeout;
export const updateQuery = (query) => (dispatch) => {
  dispatch(homeUpdateQuery(query));

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    dispatch(resetThenGetHits());
  }, 500);
};

export const updateScrollOffset = (scrollOffset) => homeUpdateScrollOffset(scrollOffset);
