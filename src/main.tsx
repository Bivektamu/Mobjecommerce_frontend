import ReactDOM from 'react-dom/client'
import TagManager from 'react-gtm-module'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { Store } from './store/index.ts'
import { ApolloProvider } from '@apollo/client'
import client from './data/client.ts'

const tagManagerArgs = {
  gtmId: 'GTM-N3MSCCCH'
}

TagManager.initialize(tagManagerArgs)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={Store}>
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
  </Provider >,
)
