import {
  Button,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerColorVariant,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { createRef, useCallback, useState } from "react";
import { ChatGptEditor, ChatGptEditorApi } from "./ChatGptEditor";
import {
  ChatGptSettings,
  ChatGptSettingsEditor,
  ChatGptSettingsEditorApi,
} from "./ChatGptSettingsEditor";
import { CHATGPT_CREATE_CONTEXT, CHATGTP_EDIT_CONTEXT } from "./api";

const DEFAULT_CHAT_GPT_SETTINGS: ChatGptSettings = {
  sessionContext: CHATGPT_CREATE_CONTEXT,
  editContext: CHATGTP_EDIT_CONTEXT,
  propmtSettings: {
    model: "gpt-3.5-turbo",
    temperature: 0.9,
    max_tokens: 2048,
  },
};

type Props = {
  apiKey: string;
};

export const ChatGptEditorPage: React.FC<Props> = ({ apiKey }) => {
  const editorApi =  createRef<ChatGptEditorApi>();
  const settingsEditorApi = createRef<ChatGptSettingsEditorApi>();
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<ChatGptSettings>(
    DEFAULT_CHAT_GPT_SETTINGS
  );

  const updateSettings = useCallback(() => {
    if (settingsEditorApi.current) {
      const newSettings = settingsEditorApi.current.getSettigns();
      setSettings(newSettings);
    }
  }, [settingsEditorApi]);

  const toggleSettings = useCallback(() => {
    if (showSettings) {
      updateSettings();
    }
    setShowSettings(!showSettings);
  }, [showSettings, updateSettings]);

  const onCloseDrawer = useCallback(() => {
    updateSettings();
    setShowSettings(false);
  }, [updateSettings]);

  const doReset = useCallback(() => {
    editorApi.current?.reset();
  }, [editorApi])

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
          reset={doReset}
        />
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Split>
          <SplitItem>
            <TextContent>
              <Text component="h2">Build your BPMN Proces with ChatGPT!</Text>
            </TextContent>
          </SplitItem>
          <SplitItem isFilled style={{ textAlign: "right" }}>
            <Button variant="primary" onClick={toggleSettings}>
              Show Settings
            </Button>
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection isFilled>
        <Drawer isExpanded={showSettings}>
          <DrawerContent
            panelContent={drawerContent}
            colorVariant={DrawerColorVariant.light200}
          >
            <DrawerContentBody>
              <ChatGptEditor apiKey={apiKey} settings={settings} ref={editorApi}/>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </>
  );
};
