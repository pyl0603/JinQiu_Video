import { createStore } from 'redux';

import adSystem from './reducer';

let store = createStore(adSystem)

export default store;
