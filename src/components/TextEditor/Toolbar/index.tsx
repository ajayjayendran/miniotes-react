import React from "react";
import { useSlate } from "slate-react";
import { Editor, Transforms, Text } from "slate";
import { ChecklistItemElement, CustomEditor } from "../../Slate/slate.types";

const Toolbar: React.FC = () => {
  const editor = useSlate();

  const toggleBoldMark = () => {
    const isActive = isMarkActive(editor, "bold");
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: Text.isText, split: true }
    );
  };

  const toggleItalicMark = () => {
    const isActive = isMarkActive(editor, "italic");
    Transforms.setNodes(
      editor,
      { italic: isActive ? undefined : true },
      { match: Text.isText, split: true }
    );
  };

  const addChecklistItem = (editor: CustomEditor | any) => {
    const checklistItem: ChecklistItemElement = {
      type: "checklist-item",
      checked: false,
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, checklistItem);
  };

  return (
    <div className="toolbar">
      <button onClick={toggleBoldMark}>Bold</button>
      <button onClick={toggleItalicMark}>Italic</button>
      <button onClick={addChecklistItem}>Checklist</button>
    </div>
  );
};

const isMarkActive = (editor: CustomEditor, format: "bold" | "italic") => {
  const marks = Editor.marks(editor);
  if (!marks) return false;
  return marks[format] === true;
};

export default Toolbar;
