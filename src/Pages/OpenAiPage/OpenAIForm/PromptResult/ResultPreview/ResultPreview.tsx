import { useCallback, useEffect, useMemo, useState } from "react";
import { OpenAiResponse, RESPONSE_TYPE } from "../../../api";
import { DiagramEditor } from "./DiagramEditor";
import * as xml from "./xml";
import {
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";

type Props = {
  response: OpenAiResponse;
};

export const ResultPreview: React.FC<Props> = ({ response }) => {
  const xmlDoc = useMemo(() => {
    try {
      return xml.getDiagramXML(response.message);
    } catch (err) {
      console.warn("Looks like response doesn't contains a valid XML", err);
    }
    return undefined;
  }, [response]);

  const isSuccess = useMemo(() => {
    return response.type === RESPONSE_TYPE.SUCCES && xmlDoc;
  }, [response]);

  return isSuccess && xmlDoc ? (
    <DiagramEditor content={xmlDoc} />
  ) : (
    <InvalidResponse response={response} />
  );
};

const InvalidResponse: React.FC<Props> = ({ response }) => {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setCopied(false);
  }, [response]);

  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(response.message);
    setCopied(true);
  }, [response]);

  const message =
    response.type === RESPONSE_TYPE.SUCCES
      ? "ChatGPT was able to provide a positive response for your prompt but it cannot be displayed into our BPMN Editor. Please check the error message and try again adjusting either the Prompt or the settings on the right Panel."
      : "Unfortunately ChatGTP wasn't able to process your request, please check the error below:";

  return (
    <EmptyState>
      <EmptyStateIcon icon={WarningTriangleIcon} />
      <Title headingLevel="h4" size="lg">
        Looks like something went wrong...
      </Title>
      <EmptyStateBody>{message}</EmptyStateBody>
      <CodeBlock
        style={{ height: "100%" }}
        actions={[
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
              {copied
                ? "Successfully copied to clipboard!"
                : "Copy to clipboard"}
            </ClipboardCopyButton>
          </CodeBlockAction>,
        ]}
      >
        {response.message}
      </CodeBlock>
    </EmptyState>
  );
};
