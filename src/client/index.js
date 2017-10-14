import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose } from 'redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction'

import service from './service'
import { mapServiceToStore, applyServices } from './service/utils'
import Setup from './view/Setup'

if (process.env.NODE_ENV === 'development') {
  localStorage.debug = 'app:*,api:*,test:*'
}

const store = createStore(combineReducers(
  mapServiceToStore({
    main: service.main,
  }),
), compose(
  applyServices,
  devToolsEnhancer({
    name: 'Chingu Dashboard',
    actionSanitizer: action => ({
      // @ts-ignore
      ...action,
      type: action.type.toString(),
    }),
  }),
))

render(
  <Provider store={store}>
    <Router>
      <Route exact path="/setup" component={Setup} />
    </Router>
  </Provider>,
  document.querySelector('[role="application"]'),
)
