import { useState, useEffect } from 'react'
import { Admin, Resource, CustomRoutes, ListGuesser, EditGuesser, ShowGuesser, localStorageStore, Notification } from 'react-admin'
import { Route } from 'react-router-dom'

import dataProvider from '../../utils/dataProvider'
import authProvider from 'utils/authProvider'
import CarbonLayout from '../Layout/carbonLayout.js'
import CarbonG90 from '../../themes/carbon-g90'
import { i18nProvider } from '../i18n/i18nprovider.js'
import LoginPage from 'components/Login/LoginPage'
import { Loading } from '@carbon/react'

import {
  Roles,
  MainPage,
  Documents,
  Users,
  Relations,
  Jobs,
  Prompts,
} from '../resources'

const store = localStorageStore();
store.setItem('sidebar.open', true);
store.setItem('application.error', false);

const App = (props) => {

  // Using this to dynamically fetch the OIDC configuration from the server, since it would be really annoying to have to re-build individual images for each
  // customer
  const [appIDConfigured, setappIDConfigured] = useState(false)

  // now we need to lazy load the auth and dataprovider as they depend on OIDC being enabled on the server or not (which is a network call)
  // null -> initial state, we didn't finish lazy loading auth and data providers yet, so we do not render the react-admin app
  // true -> OIDC is enabled, we need to load the correct authProvider and dataProvider
  // false -> OIDC is disabled, we just need a dataProvider
  const [authProvider, setAuthProvider] = useState(null);
  const [dataProvider, setDataProvider] = useState(null);

  useEffect(() => {
    fetch('/api/oidc')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("oidc", JSON.stringify(data))
        setappIDConfigured(data.enabled)
      })
      .catch(error => {
        console.error('Error fetching server oidc config', error);
      });
  }, []); // The empty dependency array ensures this effect runs only once

  // use "lazy" loading to ensure the correct auth and dataproviders are loaded
  useEffect(() => {
    console.log("loadProviders")
    const loadProviders = async () => {
      if (appIDConfigured) {
        //console.log("appIDConfigured is true, loading auth and data refresh")
        const { default: authprovider } = await import('utils/authProviderRefresh.js');
        setAuthProvider(authprovider);
        const { default: dataprovider } = await import('utils/dataProviderRefresh.js');
        setDataProvider(dataprovider);
      } else if (appIDConfigured === false) {
        //console.log("appIDConfigured is false, loading dataprovider")
        setAuthProvider(false); // turn off authProvider
        const { default: dataprovider } = await import('utils/dataProvider.js');
        setDataProvider(dataprovider);
      }
    };

    loadProviders();
  }, [appIDConfigured]);

  if (authProvider === null) {
    return <Loading withOverlay />; // Loading state
  } else if (dataProvider === null) {
    return <Loading withOverlay />; // Loading state
  }

  const authConditionalProps = appIDConfigured ? { requireAuth: true } : {};
  const authConditionalPropsDataProvider = appIDConfigured ? { dataProvider: dataProvider } : { dataProvider: dataProvider };
  const authConditionalPropsAuthProvider = appIDConfigured ? { authProvider: authProvider } : {};
  //console.log("using appIDConfigured", appIDConfigured)

  const LogoutPage = () => {
    // Clear tokens and session data
    console.log("/logout removing tokens")
    localStorage.removeItem('token');
    // Redirect to login or homepage
    return redirect("/login")
  };


  return (
    <Admin title="Document Extraction Toolkit" i18nProvider={i18nProvider}
      layout={CarbonLayout} notification={Notification} theme={CarbonG90} store={store} loginPage={LoginPage}
      {...authConditionalProps}
      {...authConditionalPropsAuthProvider}
      {...authConditionalPropsDataProvider}
    >
      <Route path="/logout" component={LogoutPage} />
      <CustomRoutes>
        <Route path="documents/upload" element={<Documents.Upload />} />
      </CustomRoutes>
      {/* <Resource name="roles" recordRepresentation="name" intent="registration" {...Roles} />
      <Resource name="users" recordRepresentation="email" intent="registration" {...Users} /> */}
      <Resource name="documents" recordRepresentation="name" intent="registration" {...Documents} />
      <Resource name="prompts" recordRepresentation="name" intent="registration" {...Prompts} />
      <Resource name="jobs" recordRepresentation="name" intent="registration" {...Jobs} />
      <Resource name="extracted_relations_live" recordRepresentation="Extracted Relations" intent="registration" {...Relations} />
      <Resource name="extracted_relations_history" recordRepresentation="Extracted Relations (History)" intent="registration" {...Relations} />
      <CustomRoutes>
        <Route path="/" element={<MainPage />} />
      </CustomRoutes>
    </Admin>
  )
}

export default App
