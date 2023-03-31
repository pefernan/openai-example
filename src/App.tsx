import "@patternfly/react-core/dist/styles/base.css";
import { Page, PageSection, PageSectionVariants, Text, TextContent } from '@patternfly/react-core';
import { Header } from './Header/Header';
import { OpenAiForm } from "./OpenAI/OpenAiForm";

function App() {
  return (
    <Page 
    header={<Header/>}
    additionalGroupedContent={
      <PageSection variant={PageSectionVariants.light} isWidthLimited>
        <TextContent>
          <Text component="h1">OpenAI tests</Text>
          <Text component="p">Try generating a BPMN process using OpenAI!</Text>
        </TextContent>
      </PageSection>
    }
    >
      <PageSection isFilled style={{height: "760px"}}>
        <OpenAiForm/>
      </PageSection>
    </Page>
  );
}

export default App;
