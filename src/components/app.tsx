import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Help from './help';
import Landing from './landing';
import MainWrapper from './layout/MainWrapper';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainWrapper>
        <Switch>
          <Route exact={true} path={`/`} component={Landing} />
          <Route exact={true} path={`/help`} component={Help} />
        </Switch>
      </MainWrapper>
    </BrowserRouter>
  );
};

export default App;
