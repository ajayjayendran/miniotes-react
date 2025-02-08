import React, { useMemo, useState } from "react";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";
import {
  createEditor,
  Descendant,
  BaseEditor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";
import Toolbar from "./Toolbar"; // Adjust the import path accordingly

// Define Custom Types
type CustomText = { text: string };

interface ChecklistItemElement {
  type: "checklist-item";
  checked: boolean;
  children: CustomText[];
}

// Define the initial content of the editor
const initialContent: Descendant[] = [
  { type: "paragraph", children: [{ text: "Start typing..." }] },
];

// Define the interface for checklist item elements
interface ChecklistItemElementProps extends RenderElementProps {
  element: ChecklistItemElement;
}

// Define the checklist item element component
const ChecklistItemElement: React.FC<ChecklistItemElementProps> = ({
  attributes,
  children,
  element,
}) => {
  return (
    <div {...attributes} className="checklist-item">
      <input
        type="checkbox"
        checked={element.checked}
        onChange={(event) => handleCheckboxChange(event, element)}
      />
      <span>{children}</span>
    </div>
  );
};

// Handle the checkbox change
const handleCheckboxChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  element: ChecklistItemElement
) => {
  const editor = useMemo(() => withReact(createEditor()), []); // Ensure editor is in scope
  const { checked } = event.target;
  const path = ReactEditor.findPath(editor, element);
  Transforms.setNodes(editor, { checked }, { at: path });
};

// Define the plugin to render the checklist item elements
const ChecklistPlugin = {
  renderElement: (props: RenderElementProps) => {
    const { element } = props;
    switch (element.type) {
      case "checklist-item":
        return (
          <ChecklistItemElement
            children={props.children}
            element={props.element as ChecklistItemElement}
            attributes={props.attributes}
          />
        );
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  },
};

// Define the main text editor component
const TextEditor: React.FC = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(initialContent);

  return (
    <>
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <Toolbar />
        <Editable
          renderElement={(props) => (
            <ChecklistPlugin.renderElement {...props} />
          )}
        />
      </Slate>
    </>
  );
};

export default TextEditor;
