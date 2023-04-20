import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import uuid from "react-uuid";
import { ChatGptSettings } from "../ChatGptSettingsEditor";
import {
  ChatGptInteraction,
  ChatGptResponse,
  RESPONSE_TYPE,
  SuccessfulChatGptResponse,
} from "../api";
import { getDiagramXML } from "./xml";

export class ChatGptController {
  private interactions: Array<ChatGptInteraction> = [];
  private readonly openai: OpenAIApi;

  constructor(apiKey: string) {
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey,
      })
    );
  }

  public async submit(
    prompt: string,
    currentDiagram: string,
    settings: ChatGptSettings
  ): Promise<ChatGptResponse> {
    const interaction: ChatGptInteraction = {
      uuid: uuid(),
      request: prompt.trim(),
    };
    this.interactions.push(interaction);
    try {
      const messages = this.getCompletionContext(prompt, currentDiagram, settings);

      const response = await this.openai.createChatCompletion({
        model: settings.propmtSettings.model ?? "gpt-3.5-turbo",
        temperature: settings.propmtSettings.temperature ?? 0.7,
        messages,
        n: 1,
      });

      console.log("usage total: ", response.data.usage?.total_tokens)
      console.log("usage prompt: ", response.data.usage?.prompt_tokens)
      console.log("usage completion: ", response.data.usage?.completion_tokens)
      
      if (
        response.data.choices.length > 0 &&
        response.data.choices[0].finish_reason === "stop" &&
        response.data.choices[0].message
      ) {
        interaction["response"] = {
          type: RESPONSE_TYPE.SUCCES,
          diagram: getDiagramXML(response.data.choices[0].message.content),
        };
      } else {
        let message;

        if (response.data.choices[0].finish_reason) {
          message = `Sorry, ChatGpt couldn't complete your request due to '${response.data.choices[0].finish_reason}'`;
        } else {
          message =
            response.data.choices[0].message?.content ??
            "Sorry, ChatGpt couldn't perform your request, try again...";
        }
        interaction["response"] = {
          type: RESPONSE_TYPE.FAILURE,
          message,
        };
      }
    } catch (error: any) {
      interaction["response"] = {
        type: RESPONSE_TYPE.FAILURE,
        message: `Something went really wrong with ChatGpt API request: ${
          error.response ? error.response.data.error.message : error.message
        }`,
      };
    }

    return Promise.resolve(interaction.response);
  }

  private getCompletionContext(
    prompt: string,
    currentDiagram: string,
    settings: ChatGptSettings
  ): ChatCompletionRequestMessage[] {
    const firstSuccesful = this.getFirstSuccessFul();

    if (!firstSuccesful) {
      return [
        { role: "system", content: settings.sessionContext.trim() },
        { role: "user", content: prompt },
        {
          role: "user",
          content: "your response should only contain the process xml",
        },
      ];
    }

    const context: ChatCompletionRequestMessage[] = [
      { role: "system", content: settings.sessionContext.trim() },
    ];

    context.push(
      {role: "user", content: firstSuccesful.request},
      { role: "assistant", content: currentDiagram.trim() },
      {
        role: "user",
        content: prompt,
      },
      {
        role: "user",
        content: "your response should only contain the process xml",
      }
    );

    return context;
  }

  private getFirstSuccessFul(): ChatGptInteraction | undefined {
    return this.interactions.find(
      (interaction: ChatGptInteraction) =>
        interaction.response?.type === RESPONSE_TYPE.SUCCES
    );
  }

  public get history() {
    return this.interactions;
  }

  public reset(): void {
    this.interactions = [];
  }
}
