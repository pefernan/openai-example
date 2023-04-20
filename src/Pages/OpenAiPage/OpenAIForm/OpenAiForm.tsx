import { Grid, GridItem } from "@patternfly/react-core";
import { useCallback, useEffect, useReducer, useState } from "react";
import uuid from "react-uuid";
import { Prompt } from "./Prompt";
import {
  OpenAiInteraction,
  OpenAiResponse,
  RESPONSE_TYPE,
} from "../api";
import { PrompResult } from "./PromptResult";

type LogReducerAction =
  | {
      type: "add";
      uuid: string;
      prompt: string;
    }
  | {
      type: "complete";
      uuid: string;
      response: OpenAiResponse;
    };

function reduce(state: OpenAiInteraction[], action: LogReducerAction) {
  let newState = [...state];
  switch (action.type) {
    case "add":
      newState.push({
        uuid: action.uuid,
        request: action.prompt,
      });
      break;
    case "complete": {
      const interaction = newState.find(
        (interaction) => interaction.uuid === action.uuid
      );
      if (interaction) {
        const index = newState.indexOf(interaction);

        newState.splice(index, 1, {
          uuid: interaction.uuid,
          request: interaction.request,
          response: action.response,
        });
      }
    }
  }
  return newState;
}

export type Response = {
  type: RESPONSE_TYPE;
  message: string;
};

type Props = {
  models: string[];
  doSubmit: (prompt: string) => Promise<OpenAiResponse>;
};

export const OpenAiForm: React.FC<Props> = ({ models: models, doSubmit }) => {
  const [interaction, setInteraction] = useState<OpenAiInteraction>();
  const [log, dispatch] = useReducer(reduce, []);

  const onSubmit = useCallback(
    async (prompt: string) => {
      const interactionUuid = uuid();

      dispatch({
        type: "add",
        uuid: interactionUuid,
        prompt: prompt,
      });

      const response = await doSubmit(prompt);

      dispatch({
        type: "complete",
        uuid: interactionUuid,
        response,
      });
    },
    [doSubmit]
  );

  useEffect(() => {
    if (log.length > 0) {
      setInteraction(log[log.length - 1]);
    } else {
      setInteraction(undefined);
    }
  }, [log]);

  return (
    <div style={{ height: "100%" }}>
      <Grid hasGutter style={{ height: "100%" }}>
        <GridItem span={3}>
          <Prompt prompt={onSubmit} />
        </GridItem>
        <GridItem span={9}>
          <PrompResult interaction={interaction} />
        </GridItem>
      </Grid>
    </div>
  );
};
