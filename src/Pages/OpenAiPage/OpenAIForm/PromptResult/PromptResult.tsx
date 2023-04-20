import {
  Bullseye,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Spinner,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import { useEffect, useMemo, useState } from "react";
import { OpenAiInteraction } from "../../api";
import { ResultPreview } from "./ResultPreview";

type Props = {
  interaction?: OpenAiInteraction;
};

export const PrompResult: React.FC<Props> = ({ interaction }) => {
  const Component = useMemo(() => {
    if (!interaction) {
      return <PromptResultEmptyState />;
    }
    return interaction.response ? (
        <ResultPreview response={interaction.response} />
    ) : (
        <LoadingSpinner />
    );
  }, [interaction]);
  return (
    <Card isFlat isCompact isFullHeight>
      <CardBody>{Component}</CardBody>
    </Card>
  );
};

const LoadingSpinner: React.FC<{}> = ({}) => {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <Bullseye>
        <p>
          <TextContent>
            <Spinner isSVG aria-label="spinner in a subheading" size="xl" />
          </TextContent>
        </p>
        <p>
          <TextContent>
            <Text component="h2">
              Waiting for BPMN AI, please be patient it can take up to two
              minutes... ({seconds} s.)
            </Text>
          </TextContent>
        </p>
      </Bullseye>
    </>
  );
};
const PromptResultEmptyState: React.FC<{}> = ({}) => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        Nothing to show
      </Title>
      <EmptyStateBody>
        Please fill your BPMN process description on the prompt and let ChatGPT
        build it for you!
      </EmptyStateBody>
    </EmptyState>
  );
};
