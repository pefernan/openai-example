import { OpenAIApi } from "openai";
import { OpenAiForm } from "../../../../Components";
import { useCallback } from "react";
import {
  OPENAI_CONTEXT,
  OpenAiResponse,
  RESPONSE_TYPE,
} from "../../api";

type Props = {
  openai: OpenAIApi;
};


function buildPrompt(prompt: string): string {
  return `${OPENAI_CONTEXT}\n\n${prompt}`;
}

export const CompletionsApi: React.FC<Props> = ({ openai }) => {
  const doSubmit = useCallback(
    async (prompt: string): Promise<OpenAiResponse> => {
      try {
        const response = await openai.createCompletion({
          model:  "text-davinci-003",
          temperature:  0.2,
          max_tokens:  3000,
          prompt: buildPrompt(prompt),
          n: 1
        });

        const message =
          response.data.choices.length > 0
            ? response.data.choices[0].text ?? ""
            : "Sorry, AI couldn't generate a valid response, try again...";

        return {
          type: RESPONSE_TYPE.SUCCES,
          message: message,
        };
      } catch (error: any) {
        return {
          type: RESPONSE_TYPE.FAILURE,
          message: `Error with OpenAI API request: ${
            error.response ? error.response.data.error.message : error.message
          }`,
        };
      }
    },
    [openai]
  );

  return (
    <OpenAiForm
      models={["text-davinci-003", "text-davinci-002", "text-curie-001", "text-babbage-001", "text-ada-001", "davinci", "curie", "babbage", "ada"]}
      doSubmit={doSubmit}
    />
  );
};