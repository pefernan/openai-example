import {
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { Configuration, OpenAIApi } from "openai";
import uuid from "react-uuid";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  OpenAiInteraction,
  OpenAiResponse,
  OPENAI_CONTEXT,
  RESPONSE_TYPE,
} from "./api";
import { Prompt } from "./Prompt";
import { PromptLog } from "./PromptLog";

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
        loading: true,
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
            loading: false,
            request: interaction.request,
            response: action.response
        });
      }
    }
  }
  return newState;
}

function buildPrompt(prompt: string, log: OpenAiInteraction[]): string {
  return `${OPENAI_CONTEXT}\nHuman:${prompt}`;
}

export function OpenAiForm() {
    const [interaction, setInteraction] = useState<OpenAiInteraction>();
  const [log, dispatch] = useReducer(reduce, []);

  const openai = useMemo<OpenAIApi>(() => {
    if (!process.env.REACT_APP_OPENAI_KEY) {
      throw Error(
        "Cannot initialize OpenAIApi, cannot find apiKey in node env"
      );
    }
    return new OpenAIApi(
      new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_KEY,
      })
    );
  }, []);

  const doSubmit = useCallback(
    async (prompt: string) => {
      const interactionUuid = uuid();
      try {
        dispatch({
          type: "add",
          uuid: interactionUuid,
          prompt: prompt,
        });

        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: buildPrompt(prompt, log),
          temperature: 0.2,
          max_tokens: 3000,
        });

        const message =
          response.data.choices.length > 0
            ? response.data.choices[0].text
            : "Sorry, AI couldn't generate a valid response, try again...";

        dispatch({
          type: "complete",
          uuid: interactionUuid,
          response: {
            type: RESPONSE_TYPE.SUCCES,
            message:
              message ??
              "Sorry, AI couldn't generate a valid response, try again...",
          },
        });
      } catch (error: any) {
        dispatch({
          type: "complete",
          uuid: interactionUuid,
          response: {
            type: RESPONSE_TYPE.FAILURE,
            message: `Error with OpenAI API request: ${
              error.response ? error.response.data.error.message : error.message
            }`,
          },
        });
      }
    },
    [log, openai]
  );

  useEffect(() => {
    if(log.length > 0) {
        setInteraction(log[log.length -1]);
    } else {
        setInteraction(undefined);
    }
  }, [log])

  return (
    <div style={{ height: "100%" }}>
        <Grid hasGutter style={{ height: "100%" }}>
            <GridItem span={3}>
            <Prompt prompt={doSubmit} />
            </GridItem>
            <GridItem span={9}>
            <PromptLog interaction={interaction} />
            </GridItem>
        </Grid>
    </div>
  );
}
