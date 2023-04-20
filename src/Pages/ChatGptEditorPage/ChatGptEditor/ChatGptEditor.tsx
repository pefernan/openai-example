import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertVariant,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import React, {
  createRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { ChatGptSettings } from "../ChatGptSettingsEditor";
import { ChatGptInteraction, RESPONSE_TYPE } from "../api";
import { ChatGptController } from "./ChatGptController";
import { ChatGptInteractions } from "./ChatGptInteractions/ChatGptInteractions";
import { ChatGtpPrompt } from "./ChatGtpPrompt";
import { DiagramEditor, DiagramEditorApi } from "./DiagramEditor";
import { Loading } from "./Loading/Loading";
import { ChatGptEditorEmptyState } from "./ChatGptEditorEmptyState";

type Props = {
  apiKey: string;
  settings: ChatGptSettings;
};

export interface ChatGptEditorApi {
  reset: () => void;
}

const RefChatGptEditor: React.ForwardRefRenderFunction<
  ChatGptEditorApi,
  Props
> = ({ apiKey, settings }, forwardedRef) => {
  const diagramEditorApi = createRef<DiagramEditorApi>();
  const [isFirst, setIsFirst] = useState<boolean>(true);

  const [error, setError] = useState<string>();
  const [diagram, setDiagram] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const chatgpt = useMemo<ChatGptController>(() => {
    return new ChatGptController(apiKey);
  }, [apiKey]);

  const history = useMemo<ChatGptInteraction[]>(()=> {
    return chatgpt?.history ?? [];
  }, [chatgpt, loading])

  useImperativeHandle(forwardedRef, () => ({
    reset: () => {
      setDiagram("");
      chatgpt.reset();
      setIsFirst(true);
    },
  }), [chatgpt]);

  const onPrompt = useCallback(
    async (prompt: string): Promise<void> => {
      setError(undefined);
      setIsFirst(false);
      setLoading(true);

      const currentDiagram =
        (await diagramEditorApi.current?.getDiagram()) ?? "";
      const response = await chatgpt.submit(prompt, currentDiagram, settings);

      setLoading(false);
      if (response.type === RESPONSE_TYPE.SUCCES) {
        setDiagram(response.diagram);
      } else {
        if(currentDiagram !== diagram) {
          setDiagram(currentDiagram);
        }
        setError(response.message);
      }
      return Promise.resolve();
    },
    [chatgpt, settings, diagramEditorApi, diagram]
  );

  if(isFirst) {
    return <ChatGptEditorEmptyState doStart={onPrompt} />
  }
  return (
    <>
      {error && (
        <AlertGroup isToast isLiveRegion>
          <Alert
            variant={AlertVariant.danger}
            title={"Cannot get a succesfull response"}
            actionClose={
              <AlertActionCloseButton
                variantLabel={`danger alert`}
                onClose={() => setError(undefined)}
              />
            }
          >
            <p>{error}</p>
          </Alert>
        </AlertGroup>
      )}
      {loading && <Loading />}
      <Grid hasGutter style={{ height: "100%" }}>
        <GridItem span={3}>
          <ChatGtpPrompt prompt={onPrompt}>
            <ChatGptInteractions history={history} />
          </ChatGtpPrompt>
        </GridItem>
        <GridItem span={9}>
          <DiagramEditor content={diagram} ref={diagramEditorApi} />
        </GridItem>
      </Grid>
    </>
  );
};

export const ChatGptEditor = React.forwardRef(RefChatGptEditor);
