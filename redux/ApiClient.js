/* Erik Rassumsen */

import superagent from 'superagent';

const config = {
  apiHost: process.env.API_HOST || 'localhost:3001'
}

export function clientMiddleware (client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});

      const actionPromise = promise(client);
      actionPromise.then(
        (result) => next({...rest, result, type: SUCCESS}),
        (error) => next({...rest, error, type: FAILURE})
      ).catch((error)=> {
        next({...rest, error, type: FAILURE})
        throw new Error('MIDDLEWARE ERROR:', error);
      });

      return actionPromise;
    };
  };
}

export class ApiClient {
  methods = ['get', 'post', 'put', 'patch', 'del'];

  constructor(req) {
    this.methods.forEach((method) =>
      this[method] = (path, { query, data, headers } = {}) => new Promise((resolve, reject) => {
        const url = this.formatUrl(path)
        const request = superagent[method](url)

        if (query) {
          request.query(query);
        }

        if (window.localStorage.authToken) {
          request.set({ Authorization: window.localStorage.authToken })
        }

        if (headers) {
          request.set(headers)
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }));
  }

  formatUrl (path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    return config.apiHost + adjustedPath;
  }
}
