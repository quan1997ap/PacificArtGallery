import { combineReducers } from 'redux';
import changeLangReducers from './LanguageReducers';

const allReducers = combineReducers({
    stateCurentLanguage: changeLangReducers,
});

export default allReducers;