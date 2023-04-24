import {
  Masthead,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageToggleButton,
  Title,
} from "@patternfly/react-core";
import "@patternfly/react-core/dist/styles/base.css";
import { ReactComponent as OpenAILogo } from "../openai.svg";

import { BarsIcon } from "@patternfly/react-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { EmptyKey } from "../Components";
import { ChatGptEditorPage } from "../Pages/ChatGptEditorPage";
import { OpenAIPage } from "../Pages/OpenAiPage";

enum Location {
  ROOT = "/",
  SETUP = "Setup",
  V1 = "Creation",
  V2 = "Edition",
}

const DEFAULT_LOCATION: Location = Location.V2;

export const Layout: React.FC<{}> = ({}) => {
  let navigate = useNavigate();
  let location = useLocation();

  const [apiKey, setApiKey] = useState<string>();
  const [navOpen, setNavOpen] = useState(false);

  const onNavToggle = () => {
    setNavOpen(!navOpen);
  };

  const isNavOpen = useMemo(() => {
    return apiKey !== undefined && navOpen;
  }, [navOpen, apiKey]);

  useEffect(() => {
    if (!apiKey) {
      navigate(
        {
          pathname: `/${Location.SETUP}`,
        },
        {
          replace: true,
        }
      );
    }
  }, [apiKey, navigate]);

  const header = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton
          variant="plain"
          aria-label="Global navigation"
          id="vertical-nav-toggle"
          isNavOpen={isNavOpen}
          onNavToggle={onNavToggle}
          isDisabled={!apiKey}
        >
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <OpenAILogo width={40} height={40} fill={"white"} />
      </MastheadMain>
      <MastheadContent>
        <Title headingLevel="h1">OpenaAI Tests</Title>
      </MastheadContent>
    </Masthead>
  );

  const pageNav = (
    <Nav aria-label="Nav">
      <NavList>
        <NavItem
          itemId={Location.V1}
          isActive={location.pathname === `/${Location.V1}`}
        >
          <Link to={Location.V1}>Process Creation (v1)</Link>
        </NavItem>
        <NavItem
          itemId={Location.V2}
          isActive={location.pathname === `/${Location.V2}`}
        >
          <Link to={Location.V2}>Process Co-Edition (v2)</Link>
        </NavItem>
      </NavList>
    </Nav>
  );

  const sidebar = (
    <PageSidebar isNavOpen={isNavOpen} id="vertical-sidebar" nav={pageNav} />
  );

  const root = (
    <>
      {apiKey ? (
        <Navigate to={DEFAULT_LOCATION} />
      ) : (
        <Navigate to={Location.SETUP} />
      )}
    </>
  );
  return (
    <Page header={header} sidebar={sidebar}>
      <Routes location={location}>
        <Route path={Location.ROOT} element={root} />
        <Route
          path={Location.V1}
          element={<OpenAIPage apiKey={apiKey ?? ""} />}
        />
        <Route
          path={Location.V2}
          element={<ChatGptEditorPage apiKey={apiKey ?? ""} />}
        />
        <Route
          path={Location.SETUP}
          element={<SetupComponent onSetApiKey={setApiKey} />}
        />
      </Routes>
    </Page>
  );
};

type SetupComponentProps = {
  onSetApiKey: (key: string) => void;
};

const SetupComponent: React.FC<SetupComponentProps> = ({ onSetApiKey }) => {
  const [apiKey, setApiKey] = useState<string>();

  useEffect(() => {
    if (apiKey) {
      onSetApiKey(apiKey);
    }
  }, [apiKey, onSetApiKey]);

  if (!apiKey) {
    return <EmptyKey setApiKey={setApiKey} />;
  }

  return <Navigate to={`/${DEFAULT_LOCATION}`} />;
};
