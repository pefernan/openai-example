import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Banner,
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  Divider,
  DropdownItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  Title,
  Tooltip,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  CubesIcon,
  DownloadIcon,
  WarningTriangleIcon,
} from "@patternfly/react-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OpenAiInteraction, OpenAiResponse, RESPONSE_TYPE } from "../api";

type Props = {
  interaction?: OpenAiInteraction;
};

export const PromptLog: React.FC<Props> = ({ interaction }) => {


  return (
    <Card isFlat isCompact isFullHeight>
      <CardBody>
        {interaction ? <LogEntry interaction={interaction} /> : <PromptLogEmptyState /> }
      </CardBody>
    </Card>
  );
};

const PromptLogEmptyState: React.FC<{}> = ({}) => {
    return (<EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              Nothing to show
            </Title>
            <EmptyStateBody>
              There has been no interactions with our BPMN AI bot yet.. please use
              the form to get your BPMN process done!
            </EmptyStateBody>
          </EmptyState>
    );
}

type EntryProps = {
  interaction: OpenAiInteraction;
};

const LogEntry: React.FC<EntryProps> = ({ interaction }) => {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setCopied(false);
  }, [interaction]);


  const header = useMemo(() => {
    if (!interaction) {
      return <Text component="h3">No Requests yet</Text>;
    }
    return <Text component="h3">{interaction.request}</Text>;
  }, [interaction]);

  const isDownload = useMemo<boolean>(() => {
    if (!interaction || interaction.loading) {
      return false;
    }

    if (interaction.response?.message && isXml(interaction.response?.message.trim())) {
      return true;
    }

    return false;
  }, [interaction]);

  const doCopy = useCallback(() => {
    if(!interaction.loading) {
        navigator.clipboard.writeText(interaction.response?.message ?? "");
        setCopied(true);
    }
  }, [interaction]);

  const doDownload = useCallback(() => {
    if (isDownload && !interaction.loading) {
      const a: HTMLAnchorElement = document.createElement("a");
      a.href = getContentUrL(interaction.response?.message ?? "");
      a.download = "process.bpmn";
      a.click();
    }
  }, [interaction, isDownload]);

  const actions = (
    <>
      {!interaction.loading && (
        <CodeBlockAction>
          <ClipboardCopyButton
            id="copy-action"
            textId="code-content"
            aria-label="Copy to clipboard"
            onClick={(e) => doCopy()}
            exitDelay={copied ? 1500 : 600}
            maxWidth="110px"
            variant="plain"
            onTooltipHidden={() => setCopied(false)}
          >
            {copied ? "Successfully copied to clipboard!" : "Copy to clipboard"}
          </ClipboardCopyButton>
        </CodeBlockAction>
      )}
      {isDownload && (
        <CodeBlockAction>
          <Tooltip content={"Download process"}>
            <Button variant="plain" onClick={doDownload}>
              <DownloadIcon />
            </Button>
          </Tooltip>
        </CodeBlockAction>
      )}
    </>
  );

  return (
    <Stack hasGutter>
      <StackItem>{header}</StackItem>
      <StackItem>
        <Divider />
      </StackItem>
      <StackItem isFilled>
        {interaction.loading  ? <LoadingSpinner/> : (
            <CodeBlock style={{ height: "100%" }} actions={actions}>
            {!interaction.loading ? interaction?.response.message : ""}
          </CodeBlock>
        )}
      </StackItem>
    </Stack>
  );
};

function isXml(content: string) {
  try {
    const xml = new DOMParser().parseFromString(content, "text/xml");
    if (xml && !xml.querySelector("parsererror")) {
      return true;
    }
  } catch (err) {
    console.warn("content isn't xml... !", err);
  }

  return false;
}

function getContentUrL(content: string) {
  return URL.createObjectURL(new Blob([content], { type: "text/plain" }));
}

const LoadingSpinner: React.FC<{}> = ({}) => {
    return (
        <Bullseye>
            <Spinner isSVG size="xl" aria-label="Loading..."/>
            <Title headingLevel="h4" size="lg">
              Waiting for BPMN AI to reply...
            </Title>
        </Bullseye>
    );
}