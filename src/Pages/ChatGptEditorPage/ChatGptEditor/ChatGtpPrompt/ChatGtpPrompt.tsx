import { PropsWithChildren, useCallback, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Stack,
  StackItem,
  TextArea,
  TextInput,
} from "@patternfly/react-core";

type Props = {
  prompt: (propt: string) => Promise<void>;
};

export const ChatGtpPrompt: React.FC<PropsWithChildren<Props>> = ({ prompt, children }) => {
  const [value, setValue] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const doSubmit = useCallback(() => {
    setDisabled(true);
    prompt(value).finally(() => {
      setDisabled(false);
    });
    setValue("");
  }, [value, prompt]);

  return (
    <Card isFlat isCompact isFullHeight>
      <CardBody>
        <Stack hasGutter>
          <StackItem isFilled>
            {children}
          </StackItem>
          <StackItem>
            <TextArea
            rows={4}
              isDisabled={disabled}
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
