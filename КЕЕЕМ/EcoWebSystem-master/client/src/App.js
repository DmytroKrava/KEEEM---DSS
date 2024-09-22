import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { MenuView } from './components/menu/menu.jsx';
import { AdvancedMap } from "./components/advancedmap/advancedmap.jsx";
import { Home } from './components/home/home.jsx';
import { MapView } from './components/map/map.jsx';
import { Dictionary } from './components/dictionary/dictionary.jsx';
import { Instruction } from './components/instruction/instruction.jsx';
import { DSS } from './components/DSS/DSS.jsx';



//import { /*tooltip, modal_window, tooltipClick,*/ audio } from './components/interactive-hints/interactive-hints.js';






import { get } from './utils/httpService';
import { ENVIRONMENTS_URL } from './utils/constants';

import {
  EnvironmentsInfoContext,
  environmentsInfoInitialState,
} from './components/context/environmentsInfoContext';

export const App = () => {
  const [user, setUser] = useState({});
  const [environmentsInfo, setEnvironmentsInfo] = useState(
    environmentsInfoInitialState
  );
  const [dictionary, setDictionary] = useState('');

  React.useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')));
  }, []);

  useEffect(() => {
    get(ENVIRONMENTS_URL).then(({ data }) => {
      setEnvironmentsInfo({
        selected: null,
        environments: data,
      });
    });
  }, []);

  return (
    <Router>
      <div className='App'>
        <EnvironmentsInfoContext.Provider
          value={{ environmentsInfo, setEnvironmentsInfo }}
        >

          <MenuView
            user={user}
            setUser={setUser}
            dictionary={dictionary}
            setDictionary={setDictionary}
          />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/instruction' component={Instruction} />
            <Route path='/DSS' component={DSS} />

            <Route path='/earth' component={() => <MapView user={user} />} />
            <Route
              path='/dictionary'
              component={() => (
                <Dictionary user={user} tableName={dictionary} />
              )}
            />
            <Route
              path='/advancedmap'
              component={()=>(
                <AdvancedMap user={user}/>
              )}
            />
          </Switch>
        </EnvironmentsInfoContext.Provider>
      </div>
    </Router>
  );
};
