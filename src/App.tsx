import "@patternfly/react-core/dist/styles/base.css";
import { Layout } from "./Layout";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter basename="openai-example">
      <Layout />
    </BrowserRouter>
  );
}

export default App;
