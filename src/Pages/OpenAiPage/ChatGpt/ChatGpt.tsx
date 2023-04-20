import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerColorVariant,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Text
} from "@patternfly/react-core";
import { Configuration, OpenAIApi } from "openai";
import React, { useCallback, useImperativeHandle, useMemo, useState } from "react";
import { OpenAiForm } from "../../../Components";
import {
  CHATGPT_CONTEXT,
  OpenAiResponse,
  RESPONSE_TYPE,
} from "../api";
import {
  ChatGptSettings,
  ChatGptSettingsEditor,
  ChatGptSettingsEditorApi,
} from "./ChatGptSettingsEditor";

type Props = {
  apiKey: string;
};

export interface ToggleSettingsApi {
  toggleSettings: () => void;
}

const DEFAULT_CHAT_GPT_SETTINGS: ChatGptSettings = {
  context: CHATGPT_CONTEXT,
  propmtSettings: {
    model: "gpt-3.5-turbo",
    temperature: 0.2,
    max_tokens: 3000,
  },
};

const RefChatGpt: React.ForwardRefRenderFunction<ToggleSettingsApi, Props> = (
  { apiKey },
  forwardedRef
) => {
  const settingsEditorApi = React.createRef<ChatGptSettingsEditorApi>();
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<ChatGptSettings>(
    DEFAULT_CHAT_GPT_SETTINGS
  );

  const openai = useMemo<OpenAIApi>(() => {
    if (!apiKey) {
      throw new Error("Api Key cannot be empty");
    }

    return new OpenAIApi(new Configuration({ apiKey: apiKey }));
  }, [apiKey]);

  const toggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
  }, [showSettings]);

  useImperativeHandle(
    forwardedRef,
    () => {
      return {
        toggleSettings,
      };
    },
    [toggleSettings]
  );

  const onCloseDrawer = useCallback(() => {
    setSettings(settingsEditorApi.current?.getSettigns() ?? DEFAULT_CHAT_GPT_SETTINGS);
    setShowSettings(false);
  },[setSettings, settingsEditorApi])


  const doSubmit = useCallback(
    async (
      prompt: string
    ): Promise<OpenAiResponse> => {
      try {
        const response = await openai.createChatCompletion({
          model: settings.propmtSettings.model ?? "gpt-3.5-turbo",
          temperature: settings.propmtSettings.temperature ?? 0.2,
          max_tokens: settings.propmtSettings.max_tokens ?? 3000,
          messages: [
            { role: "system", content: CHATGPT_CONTEXT },
            { role: "user", content: prompt },
          ],
          n: 1,
        });

        const message =
          response.data.choices.length > 0
            ? response.data.choices[0].message?.content ?? ""
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
    [openai, settings]
  );

  const drawerContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <Text component="h1">ChatGpt Settings</Text>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseDrawer} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody hasNoPadding>
        <ChatGptSettingsEditor
          settings={settings}
          ref={settingsEditorApi}
          models={["gpt-3.5-turbo", "gpt-3.5-turbo-0301"]}
        />
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  return (
    <Drawer isExpanded={showSettings}>
      <DrawerContent panelContent={drawerContent} colorVariant={DrawerColorVariant.light200}>
        <DrawerContentBody>
          <OpenAiForm
            models={["gpt-3.5-turbo", "gpt-3.5-turbo-0301"]}
            doSubmit={doSubmit}
          />
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export const ChatGpt = React.forwardRef(RefChatGpt);
