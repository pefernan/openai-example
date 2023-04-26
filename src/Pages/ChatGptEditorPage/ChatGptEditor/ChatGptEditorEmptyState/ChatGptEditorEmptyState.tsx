import {
  Bullseye,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  TextArea
} from "@patternfly/react-core";
import { useCallback, useState } from "react";
import { ReactComponent as OpenAILogo } from "../../../../openai.svg";

type Props = {
  doStart: (prompt: string) => void;
};

type Prompt = {
  prompt: string;
  name: string;
};

const prompts: Prompt[] = [
  {
    prompt: "create a process to handle the company new hires.",
    name: "New Hirings",
  },
  {
    prompt: "create a process to handle customer orders for an online shop.",
    name: "Online Shop",
  },
  {
    prompt: "create a process to onboard new employees.",
    name: "Onboard new employees",
  },
];

export const ChatGptEditorEmptyState: React.FC<Props> = ({ doStart }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>();

  const onClick = useCallback(() => {
    if (!prompt) {
      return;
    }
    doStart(prompt);
  }, [prompt, doStart]);

  const changePrompt = useCallback((value: string) => {
    const option = value || undefined;
    setPrompt(option);
    setIsOpen(false);
  }, []);

  const dropdownItems = prompts.map((prompt) => {
    return (
      <DropdownItem
        key={prompt.name}
        description={prompt.prompt}
        onClick={() => changePrompt(prompt.prompt)}
      >
        {prompt.name}
      </DropdownItem>
    );
  });

  return (
    <Card isFlat isCompact isFullHeight>
      <CardBody>
        <Bullseye>
          <EmptyState>
            <EmptyStateIcon icon={OpenAILogo} width={100} height={100} />
            <EmptyStateBody>
              Please fill your prompt with a nice BPMN process description:
            </EmptyStateBody>
            <EmptyStateBody>
              <TextArea
                placeholder="Write your process description here..."
                onChange={changePrompt}
                value={prompt}
              />
            </EmptyStateBody>
            <EmptyStateBody>
              <span>Or use one of the availabe examples...</span>
              <span>
                <Dropdown
                  isOpen={isOpen}
                  toggle={
                    <DropdownToggle
                      id="toggle-groups"
                      onToggle={() => setIsOpen(!isOpen)}
                    >
                      Select one of the prompt examples
                    </DropdownToggle>
                  }
                  dropdownItems={dropdownItems}
                />
              </span>
            </EmptyStateBody>
            <Button variant="primary" onClick={onClick} isDisabled={!prompt}>
              Let's start!
            </Button>
          </EmptyState>
        </Bullseye>
      </CardBody>
    </Card>
  );
};
