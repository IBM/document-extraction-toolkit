import {useState, useEffect} from 'react'
import { Admin, Resource, CustomRoutes, ListGuesser,  EditGuesser, ShowGuesser, localStorageStore, Notification } from 'react-admin'
import { Route } from 'react-router-dom'

import dataProvider from '../../utils/dataProvider'
import authProvider from 'utils/authProvider'
import CarbonLayout from '../Layout/carbonLayout.js'
import CarbonG90 from '../../themes/carbon-g90'
import { i18nProvider } from '../i18n/i18nprovider.js'
import LoginPage from 'components/Login/LoginPage'

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

  return (
    <Admin requireAuth={appIDConfigured ? true : false} title="Document Extraction Toolkit" dataProvider={dataProvider} i18nProvider={i18nProvider}
      layout={CarbonLayout} notification={Notification} theme={CarbonG90} store={store} authProvider={authProvider} loginPage={LoginPage}
    >
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
