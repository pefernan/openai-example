import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Button,
  Form,
  FormGroup,
  Select,
  SelectOption,
  Slider,
  TextArea,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface ChatGptSettingsEditorApi {
  getSettigns: () => ChatGptSettings;
}

export type ChatGptSettings = {
  sessionContext: string;
  editContext: string;
  propmtSettings: PromptSettings;
};

export type PromptSettings = {
  model: string;
  temperature: number;
  max_tokens: number;
};

export type Props = {
  models: string[];
  settings: ChatGptSettings;
  reset: () => void;
};

const RefChatGptSettingsEditor: React.ForwardRefRenderFunction<
  ChatGptSettingsEditorApi,
  Props
> = ({ models, settings, reset }, forwardedRef) => {
  const [expanded, setExpanded] = React.useState("settings");

  const onToggle = (id: string) => {
    if (id === expanded) {
      setExpanded("");
    } else {
      setExpanded(id);
    }
  };

  const [modelExpanded, setModelExpanded] = useState<boolean>(false);
  const [sessionContext, setSessionContext] = useState<string>("");
  const [editContext, setEditContext] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.2);
  const [max_tokens, setMaxTokens] = useState<number>(3000);

  useEffect(() => {
    setSessionContext(settings.sessionContext);
    setEditContext(settings.editContext);
    setModel(settings.propmtSettings.model);
    setTemperature(settings.propmtSettings.temperature);
    setMaxTokens(settings.propmtSettings.max_tokens);
  }, [models, settings]);

  useImperativeHandle(forwardedRef, () => {
    return {
      getSettigns: () => {
        return {
          sessionContext,
          editContext,
          propmtSettings: {
            temperature,
            max_tokens,
            model,
          },
        };
      },
    };
  });

  const onModelChange = useCallback((_model: string) => {
    setModel(_model);
    setModelExpanded(false);
  }, []);

  const onChangeMaxTokens = useCallback(
    (value: number, inputValue?: number) => {
      if (!inputValue) {
        setMaxTokens(value);
      } else {
        if (inputValue < 0) {
          inputValue = 0;
        }
        if (inputValue > 4096) {
          inputValue = 4096;
        }
        setMaxTokens(inputValue);
      }
    },
    []
  );
  const onChangeTemp = useCallback((value: number, inputValue?: number) => {
    if (!inputValue) {
      setTemperature(value);
    } else {
      if (inputValue < 0) {
        inputValue = 0;
      }
      if (inputValue > 2) {
        inputValue = 2;
      }
      setTemperature(inputValue);
    }
  }, []);

  return (
    <Accordion asDefinitionList={false}>
      <AccordionItem>
        <AccordionToggle
          onClick={() => {
            onToggle("settings");
          }}
          isExpanded={expanded === "settings"}
          id="settings"
        >
          Settings
        </AccordionToggle>
        <AccordionContent id="settings" isHidden={expanded !== "settings"}>
          <Form>
            <FormGroup label={"Select Model"}>
              <Select
                selections={model}
                onSelect={(_e, value) => {
                  onModelChange(value as string);
                }}
                onToggle={() => setModelExpanded(!modelExpanded)}
                isOpen={modelExpanded}
              >
                {models.map((_model) => {
                  return <SelectOption value={_model}>{_model}</SelectOption>;
                })}
              </Select>
            </FormGroup>
            <FormGroup label={"Max. Tokens"}>
              <Slider
                min={0}
                max={4096}
                step={10}
                hasTooltipOverThumb
                areCustomStepsContinuous={true}
                value={max_tokens}
                onChange={onChangeMaxTokens}
                isInputVisible
                inputValue={max_tokens}
                showBoundaries={false}
                showTicks={false}
                isDisabled={true}
              />
            </FormGroup>
            <FormGroup label={"Temperature"}>
              <Slider
                min={0}
                max={2}
                step={0.1}
                hasTooltipOverThumb
                value={temperature}
                onChange={onChangeTemp}
                isInputVisible
                inputValue={temperature}
                showBoundaries={false}
                showTicks={false}
              />
            </FormGroup>
          </Form>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionToggle
          onClick={() => {
            onToggle("session");
          }}
          isExpanded={expanded === "session"}
          id="session"
        >
          ChatGtp Session context
        </AccordionToggle>
        <AccordionContent id="session" isHidden={expanded !== "session"}>
          <Form>
            <FormGroup label="Session Context:" type="string" fieldId="session">
              <TextArea
                style={{ height: "450px" }}
                value={sessionContext}
                onChange={(value) => setSessionContext(value)}
              />
            </FormGroup>
          </Form>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionToggle
          onClick={() => {
            onToggle("edit");
          }}
          isExpanded={expanded === "edit"}
          id="edit"
        >
          ChatGtp Edit context
        </AccordionToggle>
        <AccordionContent id="edit" isHidden={expanded !== "edit"}>
          <Form>
            <FormGroup label="Edit Context:" type="string" fieldId="edit">
              <TextArea
                style={{ height: "450px" }}
                value={editContext}
                onChange={(value) => setEditContext(value)}
              />
            </FormGroup>
          </Form>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionToggle
          onClick={() => {
            onToggle("reset");
          }}
          isExpanded={expanded === "reset"}
          id={"reset"}
        >
          Reset
        </AccordionToggle>
        <AccordionContent id="reset" isHidden={expanded !== "reset"}>
          <Button variant="danger" onClick={() => reset()} isBlock icon={<WarningTriangleIcon/>}>
            Reset Editor
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const ChatGptSettingsEditor = React.forwardRef(RefChatGptSettingsEditor);
