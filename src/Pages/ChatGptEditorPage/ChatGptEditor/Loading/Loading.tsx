import {
  Bullseye,
  Modal,
  ModalVariant,
  Spinner,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { useEffect, useState } from "react";

type Props = {
  isModal?: boolean;
};

export const Loading: React.FC<Props> = ({ isModal }) => {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const spinner = (
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

  return (
    <Modal variant={ModalVariant.small} title="Loading" isOpen={true}>
      {spinner}
    </Modal>
  );
};
