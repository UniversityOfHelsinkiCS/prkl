/**
 * RC-based configuration.
 */
import rc from 'rc';


// Set defaults here, if you don't want to handle nulls.
const defaultConfig = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL,
};

// rc searches for the settings in ".{appname}rc" (e.g., ".prklrc").
const appname = process.env.NODE_ENV === 'test' ? 'prkltest' : 'prkl';
export default rc(appname, defaultConfig);
