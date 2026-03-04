/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminActivate from './pages/AdminActivate';
import CVUpload from './pages/CVUpload';
import Chat from './pages/Chat';
import Checklist from './pages/Checklist';
import EOIGenerator from './pages/EOIGenerator';
import Forms from './pages/Forms';
import Home from './pages/Home';
import MyPlan from './pages/MyPlan';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import Roadmap from './pages/Roadmap';
import Visa482 from './pages/Visa482';
import Visa858 from './pages/Visa858';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminActivate": AdminActivate,
    "CVUpload": CVUpload,
    "Chat": Chat,
    "Checklist": Checklist,
    "EOIGenerator": EOIGenerator,
    "Forms": Forms,
    "Home": Home,
    "MyPlan": MyPlan,
    "Pricing": Pricing,
    "Profile": Profile,
    "Roadmap": Roadmap,
    "Visa482": Visa482,
    "Visa858": Visa858,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};