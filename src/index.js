import ReactDOM from "react-dom";

// third party
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

// project imports
import * as serviceWorker from "serviceWorker";
import App from "App";
import { store } from "store";

// style + assets
import "assets/scss/style.scss";
import "./styles.css";

// ==============================|| REACT DOM RENDER  ||============================== //
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://aqueous-headland-76339.herokuapp.com/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
