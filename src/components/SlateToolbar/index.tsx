import { Editor } from "slate";
import {
  AlignableElement,
  CustomElement,
  CustomText,
} from "../Slate/slate.types";
import styles from "./SlateToolbar.module.css";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaSuperscript,
  FaUnderline,
} from "react-icons/fa";
import { MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";
import { ImFont, ImRedo2, ImUndo2 } from "react-icons/im";
import { Button, Dropdown, MenuProps } from "antd";
import { useState } from "react";
type ToolbarProps = {
  editor: Editor;
  toggleMark: (
    editor: Editor,
    format: Exclude<keyof CustomText, "text">
  ) => void;
  setAlignment: (editor: Editor, format: AlignableElement["textAlign"]) => void;
  toggleBlock: (editor: Editor, format: CustomElement["type"]) => void;
  onUndo: () => void;
  onRedo: () => void;
  setHighlight: (Editor: Editor, highlight: string) => void;
  setTextColor: (Editor: Editor, color: string) => void;
  setFontSize: (Editor: Editor, fontSize: number) => void;
  setFontFamily: (Editor: Editor, fontFamily: string) => void;
};

const TextFormatting = [
  {
    icon: <FaBold color="#111" />,
    key: "bold",
  },
  {
    icon: <FaItalic color="#111" />,
    key: "italic",
  },
  {
    icon: <FaUnderline color="#111" />,
    key: "underline",
  },
  {
    icon: <FaStrikethrough color="#111" />,
    key: "strikethrough",
  },
  {
    icon: <FaSuperscript color="#111" />,
    key: "superscript",
  },
];

const Alignments = [
  { icon: <FaAlignLeft color="#111" />, key: "left" },
  { icon: <FaAlignRight color="#111" />, key: "right" },
  { icon: <FaAlignCenter color="#111" />, key: "center" },
  { icon: <FaAlignJustify color="#111" />, key: "justify" },
];

const ListOptions = [
  { icon: <MdFormatListBulleted color="#111" />, key: "bulleted-list" },
  { icon: <MdFormatListNumbered color="#111" />, key: "numbered-list" },
];

const fonts = ["Arial", "Georgia", "Times New Roman", "Courier New", "Verdana"];

const SlateToolbar: React.FC<ToolbarProps> = ({
  editor,
  toggleMark,
  setAlignment,
  toggleBlock,
  onRedo,
  onUndo,
}) => {
  const [currentFont, setCurrentFont] = useState("Arial");
  const fontMenuItems: MenuProps["items"] = fonts.map((font, index) => ({
    key: index.toString(), // Use the index or a unique identifier
    label: font,
  }));

  return (
    <div className={styles.toolbar}>
      <div className={styles.iconsRow}>
        <div className={styles.formattingIcon} onClick={onUndo}>
          <ImUndo2
            color={editor.history.undos.length > 0 ? "#111" : "#AFB2B5"}
          />
        </div>
        <div className={styles.formattingIcon} onClick={onRedo}>
          <ImRedo2
            color={editor.history.redos.length > 0 ? "#111" : "#AFB2B5"}
          />
        </div>
        <Dropdown
          menu={{
            items: fontMenuItems,
            onChange: (event) => {
              console.log(event);
            },
            onClick: (event) => {
              const currentItem = fontMenuItems.find(
                (value) => value?.key === event.key
              ) as {
                key: string;
                label: string;
              };

              setCurrentFont(currentItem?.label);
            },
          }}
        >
          <div className={styles.fontFamilyItem}>
            <ImFont color="#111" />
            {currentFont}
          </div>
        </Dropdown>
        {TextFormatting.map((item) => {
          return (
            <div
              className={styles.formattingIcon}
              onClick={(event) => {
                event.preventDefault();
                toggleMark(
                  editor,
                  item.key as Exclude<keyof CustomText, "text">
                );
              }}
            >
              {item.icon}
            </div>
          );
        })}
        {Alignments.map((item) => {
          return (
            <div
              className={styles.formattingIcon}
              onClick={(event) => {
                event.preventDefault();
                setAlignment(editor, item.key as AlignableElement["textAlign"]);
              }}
            >
              {item.icon}
            </div>
          );
        })}
        {ListOptions.map((item) => {
          return (
            <div
              className={styles.formattingIcon}
              onClick={(event) => {
                event.preventDefault();
                toggleBlock(editor, item.key as CustomElement["type"]);
              }}
            >
              {item.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SlateToolbar;
