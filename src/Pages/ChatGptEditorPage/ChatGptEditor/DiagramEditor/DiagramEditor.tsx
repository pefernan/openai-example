import * as BpmnEditor from "@kie-tools/kie-editors-standalone/dist/bpmn";
import { StandaloneEditorApi } from "@kie-tools/kie-editors-standalone/dist/common/Editor";
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Stack,
  StackItem,
  Title,
  Tooltip,
} from "@patternfly/react-core";
import {
  CubesIcon,
  DownloadIcon,
  RedoIcon,
  UndoIcon,
} from "@patternfly/react-icons";
import React, { useImperativeHandle } from "react";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  content?: string;
};

export interface DiagramEditorApi {
  getDiagram: () => Promise<string>;
}

const RefDiagramEditor: React.ForwardRefRenderFunction<
DiagramEditorApi,
  Props
> = ({ content }, forwardedRef) => {
  const containerRef = createRef<HTMLDivElement>();
  const [editor, setEditor] = useState<StandaloneEditorApi>();
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  const disabled: boolean = useMemo(() => {
    return editor === undefined;
  }, [editor]);


  useImperativeHandle(forwardedRef, () => (
    {
      getDiagram(): Promise<string> {
          if(!editor || !hasChanged) {
            return Promise.resolve(content ?? "");
          }
          return editor.getContent();
      },
    }
  ), [editor, hasChanged, content])

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    if (content) {
      containerRef.current.innerHTML = "";
      const instance:StandaloneEditorApi = BpmnEditor.open({
        container: containerRef.current,
        initialContent: new Promise((resolve) => {
          try {
            resolve(content);
          } catch (err) {
            console.warn("couldn't parse diagram content: ", err);
            resolve("");
          }
        }),
        readOnly: false,
      });
      setHasChanged(false);
      instance.subscribeToContentChanges((isDirty: boolean) => {
        setHasChanged(isDirty);
      });
      setEditor(instance);
    }
  }, [content]);

  const doUndo = useCallback(() => {
    if (editor) {
      editor.undo();
    }
  }, [editor]);

  const doRedo = useCallback(() => {
    if (editor) {
      editor.redo();
    }
  }, [editor]);

  const doDownload = useCallback(async () => {
    if (editor) {
      const content = await editor.getContent();

      const url = URL.createObjectURL(
        new Blob([content], { type: "text/plain" })
      );
      const a: HTMLAnchorElement = document.createElement("a");
      a.href = url;
      a.download = "process.bpmn";
      a.click();
      document.removeChild(a);
    }
  }, [editor]);

  if (!content) {
    return <EmptyDiagram />;
  }

  return (
    <Card isFlat isCompact isFullHeight>
      <CardBody>
        <Stack>
          <StackItem>
            <Tooltip content={"Undo"}>
              <Button
                onClick={() => doUndo()}
                variant="control"
                isDisabled={disabled}
              >
                <UndoIcon />
              </Button>
            </Tooltip>
            <Tooltip content={"Redo"}>
              <Button
                onClick={() => doRedo()}
                variant="control"
                isDisabled={disabled}
              >
                <RedoIcon />
              </Button>
            </Tooltip>
            <Tooltip content={"Download process"}>
              <Button
                onClick={() => doDownload()}
                isDisabled={disabled}
                variant="control"
              >
                <DownloadIcon />
              </Button>
            </Tooltip>
            <Divider />
          </StackItem>
          <StackItem isFilled>
            <div ref={containerRef} style={{ height: "100%" }}></div>
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};

const EmptyDiagram: React.FC<{}> = ({}) => {
  return (
    <Card isFlat isCompact isFullHeight>
      <CardBody>
        <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            Nothing to show
          </Title>
          <EmptyStateBody>
            Please fill your BPMN process description on the prompt and let
            ChatGPT build it for you!
          </EmptyStateBody>
        </EmptyState>
        </Bullseye>
      </CardBody>
    </Card>
  );
};

export const DiagramEditor = React.forwardRef(RefDiagramEditor);