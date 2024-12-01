import { useState } from "react";
import { createEditor } from "slate";

import { Slate, Editable, withReact } from "slate-react";

import styles from "./Slate.module.css";

const SlateEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A" }],
    },
  ]);

  const init = [
    {
      type: "paragraph",
      children: [{ text: "A" }],
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "50vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <Slate editor={editor} initialValue={init}>
        <Editable
          style={{
            minHeight: "100vh",
            width: "100%",
            maxWidth: "800px",
            color: "#111",
            outline: "none",
            fontSize: "16px",
            lineHeight: "1.5",
            textAlign: "left",
            position: "relative", // Needed for placeholder positioning
          }}
          placeholder="Ajay"
          renderPlaceholder={({ attributes }) => (
            <div
              {...attributes}
              style={{
                position: "absolute",
                top: "0", // Aligned to editor top
                left: "10px", // Matches editor padding
                fontSize: "16px",
                lineHeight: "1.5",
                color: "#aaa",
                pointerEvents: "none", // Prevent interaction issues
              }}
            >
              <p
                style={{
                  margin: 0, // Removes default margin
                  padding: 0, // Ensures no extra spacing
                }}
              >
                Type something
              </p>
              <div
                style={{
                  marginTop: "8px", // Add spacing if needed
                }}
              >
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
