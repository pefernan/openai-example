import * as BpmnEditor from "@kie-tools/kie-editors-standalone/dist/bpmn";
import { StandaloneEditorApi } from "@kie-tools/kie-editors-standalone/dist/common/Editor";
import {
  Button,
  Divider,
  Stack,
  StackItem,
  Tooltip
} from "@patternfly/react-core";
import { DownloadIcon, RedoIcon, UndoIcon } from "@patternfly/react-icons";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  content: string;
};
export const DiagramEditor: React.FC<Props> = ({ content }) => {
  const containerRef = createRef<HTMLDivElement>();
  const [editor, setEditor] = useState<StandaloneEditorApi>();

  const disabled: boolean = useMemo(() => {
    return editor === undefined;
  }, [editor]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    if (content) {
      containerRef.current.innerHTML = "";
      const instance = BpmnEditor.open({
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

  return (
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
  );
};
