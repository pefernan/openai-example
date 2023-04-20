import {
    Bullseye,
    Button,
    Card,
    CardBody,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    Form,
    FormGroup,
    Select,
    SelectOption,
    TextArea,
    Title,
} from "@patternfly/react-core";
import { useCallback, useState } from "react";
import { ReactComponent as OpenAILogo } from "../../../../openai.svg";

type Props = {
  doStart: (prompt: string) => void;
};

export const ChatGptEditorEmptyState: React.FC<Props> = ({ doStart }) => {
  const [dropdownExpanded, setDropdownExpanded] = useState<boolean>(false);
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
    setDropdownExpanded(false);
  }, []);

  return (
    <Card isFlat isCompact isFullHeight>
      <CardBody>
        <Bullseye>
          <EmptyState>
            <EmptyStateIcon icon={OpenAILogo} width={100} height={100}/>
            <Title headingLevel="h4" size="lg">
              Nothing to show
            </Title>
            <EmptyStateBody>
              Please fill your BPMN process description (or use any of the
              examples in the dropdown) on the prompt and let ChatGPT build it
              for you!
              <Form>
                <FormGroup label={"Examples"}>
                  <Select
                  value={undefined}
                            selections={""}
                    onSelect={(_e, value) => {
                      changePrompt(value as string);
                    }}
                    onToggle={() => setDropdownExpanded(!dropdownExpanded)}
                    isOpen={dropdownExpanded}
                  >
                    <SelectOption isPlaceholder value={undefined} >
                      Select your example...
                    </SelectOption>
                    <SelectOption
                      value={
                        "create a process to handle the company new hires."
                      }
                    >
                      New Hirings
                    </SelectOption>
                    <SelectOption
                      value={
                        "create a process to handle customer orders for an online shop."
                      }
                    >
                      Online shop
                    </SelectOption>
                    <SelectOption
                      value={"create a process to onboard new employees."}
                    >
                      Onboarding new Employees
                    </SelectOption>
                  </Select>
                </FormGroup>
                <FormGroup label={""}>
                  <TextArea
                    placeholder="Write your process description here..."
                    onChange={changePrompt}
                    value={prompt}
                  />
                </FormGroup>
              </Form>
            </EmptyStateBody>
            <Button
              variant="primary"
              onClick={onClick}
              isDisabled={prompt === undefined}
            >
              Start
            </Button>
          </EmptyState>
        </Bullseye>
      </CardBody>
    </Card>
  );
};
