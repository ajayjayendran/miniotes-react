import { useMemo, useState } from "react";
import {
  Descendant,
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
  Text,
} from "slate";

import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
  ReactEditor,
} from "slate-react";

import styles from "./Slate.module.css";
import { HistoryEditor, withHistory } from "slate-history";
import { AlignableElement, CustomElement, CustomText } from "./slate.types";
import SlateToolbar from "../SlateToolbar";

const SlateEditor = () => {
  const editor = useMemo(
    () => withHistory(withReact(createEditor() as ReactEditor & HistoryEditor)),
    []
  );
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const toggleMark = (
    editor: Editor,
    format: Exclude<keyof CustomText, "text">
  ): void => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isMarkActive = (
    editor: Editor,
    format: Exclude<keyof CustomText, "text">
  ): boolean => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleBlock = (editor: Editor, format: CustomElement["type"]): void => {
    const isActive = isBlockActive(editor, format);
    const isList = format === "bulleted-list" || format === "numbered-list";

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        ["bulleted-list", "numbered-list"].includes(n.type),
      split: true,
    });

    const newType = isActive ? "paragraph" : isList ? "list-item" : format;

    Transforms.setNodes(editor, { type: newType });

    if (!isActive && isList) {
      Transforms.wrapNodes(editor, { type: format, children: [] });
    }
  };

  const isBlockActive = (
    editor: Editor,
    format: CustomElement["type"]
  ): boolean => {
    const [match] = Editor.nodes(editor, {
      match: (n) => {
        return SlateElement.isElement(n) && n.type === format;
      },
    });
    return !!match;
  };

  const setAlignment = (
    editor: Editor,
    alignment: AlignableElement["textAlign"]
  ): void => {
    Transforms.setNodes<AlignableElement>(
      editor,
      { textAlign: alignment },
      { match: (n) => SlateElement.isElement(n) && n.type === "paragraph" }
    );
  };

  const renderLeaf = ({
    attributes,
    children,
    leaf,
  }: RenderLeafProps): JSX.Element => {
    const style: React.CSSProperties = {
      fontFamily: leaf.fontFamily || undefined,
      fontSize: leaf.fontSize ? `${leaf.fontSize}px` : undefined,
      color: leaf.color || undefined,
      backgroundColor: leaf.highlight || undefined,
    };

    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.strikethrough) children = <s>{children}</s>;
    if (leaf.superscript) children = <sup>{children}</sup>;
    return (
      <span style={style} {...attributes}>
        {children}
      </span>
    );
  };

  const renderElement = ({
    attributes,
    children,
    element,
  }: RenderElementProps): JSX.Element => {
    const style = {
      textAlign: (element as AlignableElement).textAlign || "left",
    };
    console.log(element);
    switch (element.type) {
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "checklist-item":
        return (
          <div
            {...attributes}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={element.checked}
              onChange={(e) => {
                const path = ReactEditor.findPath(editor, element);
                Transforms.setNodes(
                  editor,
                  { checked: e.target.checked },
                  { at: path }
                );
              }}
            />
            <span contentEditable={false} style={{ marginLeft: "8px" }}>
              {children}
            </span>
          </div>
        );
      default:
        return (
          <p style={style} {...attributes}>
            {children}
          </p>
        );
    }
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: Editor
  ): void => {
    if (event.ctrlKey && event.key === "b") {
      event.preventDefault();
      toggleMark(editor, "bold");
    }
    if (event.ctrlKey && event.key === "i") {
      event.preventDefault();
      toggleMark(editor, "italic");
    }
    if (event.ctrlKey && event.key === "u") {
      event.preventDefault();
      toggleMark(editor, "underline");
    }
    if (event.ctrlKey && event.key === "l") {
      event.preventDefault();
      toggleBlock(editor, "bulleted-list");
    }
    if (event.ctrlKey && event.key === "n") {
      event.preventDefault();
      toggleBlock(editor, "numbered-list");
    }
    if (event.key === "Enter" && !event.shiftKey) {
      const [match] = Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === "checklist-item",
      });

      if (match) {
        event.preventDefault();
        Transforms.insertNodes(editor, {
          type: "checklist-item",
          checked: false,
          children: [{ text: "" }],
        });
      }
    }
    if (event.key === "Enter" && event.shiftKey) {
      const [match] = Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === "checklist-item",
      });

      if (match) {
        event.preventDefault();
        Transforms.setNodes(editor, { type: "paragraph" });
      }
    }
    // Add other shortcuts
  };

  const handleUndo = (): void => {
    if (editor.history.undos) {
      editor.undo();
    }
  };

  const handleRedo = (): void => {
    if (editor.history.redos) {
      editor.redo();
    }
  };

  const setFontFamily = (editor: Editor, fontFamily: string) => {
    Transforms.setNodes(
      editor,
      { fontFamily },
      { match: (n) => Text.isText(n), split: true }
    );
  };

  const setFontSize = (editor: Editor, fontSize: number) => {
    Transforms.setNodes(
      editor,
      { fontSize },
      { match: (n) => Text.isText(n), split: true }
    );
  };

  const setTextColor = (editor: Editor, color: string) => {
    Transforms.setNodes(
      editor,
      { color },
      { match: (n) => Text.isText(n), split: true }
    );
  };

  const setHighlight = (editor: Editor, highlight: string) => {
    Transforms.setNodes(
      editor,
      { highlight },
      { match: (n) => Text.isText(n), split: true }
    );
  };

  const toggleChecklist = (editor: Editor) => {
    debugger;
    const [match] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "checklist-item",
    });

    if (match) {
      // Change back to a paragraph
      Transforms.setNodes(editor, { type: "paragraph" });
    } else {
      // Convert to a checklist-item
      Transforms.setNodes(
        editor,
        {
          type: "checklist-item",
          checked: false,
          children: [{ text: "ajay" }],
        },
        { match: (n) => Editor.isBlock(editor, n as CustomElement) }
      );
    }
  };

  return (
    <div className={styles.container}>
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <SlateToolbar
          editor={editor}
          toggleMark={toggleMark}
          setAlignment={setAlignment}
          toggleBlock={toggleBlock}
          onUndo={handleUndo}
          onRedo={handleRedo}
          setFontFamily={setFontFamily}
          setFontSize={setFontSize}
          setTextColor={setTextColor}
          setHighlight={setHighlight}
          toggleChecklist={toggleChecklist}
        />
        <Editable
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={(event) => onKeyDown(event, editor)}
          className={styles.editor}
          placeholder="Ajay"
          renderPlaceholder={({ attributes }) => (
            <div {...attributes} className={styles.placeholder}>
              <div>Type something</div>
              <div>
                Use the renderPlaceholder prop to customize rendering of the
                placeholder
              </div>
            </div>
          )}
        />
      </Slate>
    </div>
  );
};

export default SlateEditor;
