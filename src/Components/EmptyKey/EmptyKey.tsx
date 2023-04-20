import {
  Bullseye,
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  InputGroup,
  PageSection,
  TextArea,
  Title,
} from "@patternfly/react-core";
import React, { useCallback, useState } from "react";
import { ReactComponent as OpenAILogo } from "../../openai.svg";

type Props = {
  setApiKey: (key: string) => void;
};

export const EmptyKey: React.FC<Props> = ({ setApiKey }) => {
  const [keyValue, setKeyValue] = useState<string>();

  const onClick = useCallback(() => {
    if (!keyValue) {
      return;
    }
    setApiKey(keyValue);
  }, [keyValue, setApiKey]);

  const onChange = useCallback((value: string) => {
    setKeyValue(value);
  }, []);

  return (
    <PageSection isFilled>
      <Card isFlat isFullHeight>
        <CardBody>
          <Bullseye>
            <EmptyState variant="full">
              <OpenAILogo width={70} height={70} />
              <Title headingLevel="h4" size="lg">
                No Open AI key configured!
              </Title>
              <EmptyStateBody>
                Please fill your Open Ai key in order to continue...
                <p>
                  <InputGroup>
                    <TextArea
                      placeholder="Open AI key..."
                      onChange={onChange}
                    />
                    <Button
                      id="textAreaButton2"
                      variant="control"
                      onClick={onClick}
                      isDisabled={keyValue === undefined}
                    >
                      Configure
                    </Button>
                  </InputGroup>
                </p>
              </EmptyStateBody>
            </EmptyState>
          </Bullseye>
        </CardBody>
      </Card>
    </PageSection>
  );
};
