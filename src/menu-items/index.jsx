// menu-items/index.js
import samplePage from './sample-page';
import tickitingRaiseMenu from './tickiting';
import MasterTabMenu from './masterTab';

// Export a simple object, no hooks here
const menuItems = {
  items: [samplePage, tickitingRaiseMenu, MasterTabMenu]
};

export default menuItems;