import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose } from 'redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction'

// Services & utils
import service from './service'
import { mapServiceToStore, applyServices } from './service/utils'

// Pages/Views
import MainServiceProvider from './view/MainServiceProvider'
import NotFound from './view/NotFound'
import Setup from './view/Setup'
import Login from './view/Login'
import Home from './view/Home'
import LinkedSheets from './view/LinkedSheets'
import Workflows from './view/Workflows'
import Settings from './view/Settings'

if (process.env.NODE_ENV === 'development') {
  localStorage.debug = 'app:*,api:*,test:*'
}

const store = createStore(combineReducers(mapServiceToStore({
  main: service.main,
  setup: service.setup,
  login: service.login,
})), compose(
  applyServices,
  devToolsEnhancer({
    name: 'Chingu Dashboard',
    actionSanitizer: action => ({
      // @ts-ignore
      ...action,
      type: action.type.toString().slice(6),
    }),
  }),
))

render(
  <Provider store={store}>
    <Router>
      <MainServiceProvider>
        <Switch>
          <Route exact path="/setup" component={Setup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/linkedSheets" component={LinkedSheets} />
          <Route exact path="/workflows" component={Workflows} />
          <Route component={NotFound} />
        </Switch>
      </MainServiceProvider>
    </Router>
  </Provider>,
  document.querySelector('[role="application"]'),
)
