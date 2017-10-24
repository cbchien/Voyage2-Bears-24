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
import NotFound from './view/NotFound'
import Setup from './view/Setup'
import Login from './view/Login'
import Home from './view/Home'

const { MainServiceProvider } = service

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
      type: action.type.toString(),
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
          <Route component={NotFound} />
        </Switch>
      </MainServiceProvider>
    </Router>
  </Provider>,
  document.querySelector('[role="application"]'),
)
