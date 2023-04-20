import { useCallback, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Stack,
  StackItem,
  TextArea,
} from "@patternfly/react-core";

type Props = {
  prompt: (propt: string, useContextOnPrompt: boolean) => Promise<void>;
};

export const Prompt: React.FC<Props> = ({ prompt }) => {
  const [useContextOnPrompt, setUseContextOnPrompt] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const doSubmit = useCallback(() => {
    setDisabled(true);
    prompt(value, useContextOnPrompt).finally(() => {
      setDisabled(false);
    });
  }, [value, prompt]);

  return (
    <Card isFlat isCompact isFullHeight>
      <CardBody>
        <Stack hasGutter>
          <StackItem isFilled>
            <TextArea
              style={{ height: "100%" }}
              disabled={disabled}
              value={value}
              onChange={(value) => setValue(value)}
              placeholder={"Fill your process description here!!"}
            />
          </StackItem>
          <StackItem>
            <Button
              isDisabled={disabled}
              variant={"primary"}
              onClick={(e) => doSubmit()}
            >
              Submit
            </Button>
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};
