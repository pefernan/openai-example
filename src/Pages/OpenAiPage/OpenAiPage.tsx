import {
  Button,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Text,
  TextContent
} from "@patternfly/react-core";
import React, { useCallback } from "react";
import { ChatGpt, ToggleSettingsApi } from "./ChatGpt";

type Props = {
  apiKey: string;
};

export const OpenAIPage: React.FC<Props> = ({ apiKey }) => {
  const toggleSettingsApi = React.createRef<ToggleSettingsApi>();

  const toggleSettings = useCallback(() => {
    toggleSettingsApi?.current?.toggleSettings();
  }, [toggleSettingsApi]);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Split>
          <SplitItem>
            <TextContent>
              <Text component="h1">Generate your BPMN Proces with ChatGPT</Text>
            </TextContent>
          </SplitItem>
          <SplitItem isFilled style={{ textAlign: "right" }}>
            {apiKey && (
              <Button variant="primary" onClick={toggleSettings}>
                Show Settings
              </Button>
            )}
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection isFilled>
        <ChatGpt apiKey={apiKey} ref={toggleSettingsApi} />
      </PageSection>
    </>
  );
};
