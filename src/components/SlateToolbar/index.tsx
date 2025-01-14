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
import {
  MdFormatColorText,
  MdFormatListBulleted,
  MdFormatListNumbered,
} from "react-icons/md";
import { ImFont, ImRedo2, ImUndo2 } from "react-icons/im";
import { Dropdown, MenuProps, Popover } from "antd";
import { useState } from "react";
import { CirclePicker, TwitterPicker } from "react-color";
import { IoColorFillOutline } from "react-icons/io5";
import { LuListTodo } from "react-icons/lu";

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
  toggleChecklist: (Editor: Editor) => void;
};

const textColors = [
  "#000000", // Black
  "#333333", // Dark Gray
  "#666666", // Gray
  "#999999", // Light Gray
  "#CCCCCC", // Silver
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FFA500", // Orange
  "#800080", // Purple
  "#A52A2A", // Brown
  "#FFC0CB", // Pink
  "#808000", // Olive
  "#008080", // Teal
  "#800000", // Maroon
  "#000080", // Navy
  "#DDA0DD", // Plum
];

const highlightColors = [
  "#FFFF99", // Light Yellow
  "#CCFFCC", // Light Green
  "#99CCFF", // Light Blue
  "#FFCCCC", // Light Pink
  "#FFDAB9", // Peach
  "#E6E6FA", // Lavender
  "#87CEEB", // Sky Blue
  "#98FF98", // Mint
  "#FF7F50", // Coral
  "#B0E0E6", // Baby Blue
  "#FFFFE0", // Pale Yellow
  "#C8A2C8", // Lilac
  "#F5F5DC", // Beige
  "#DAA520", // Goldenrod
  "#FA8072", // Salmon
  "#DA70D6", // Orchid
  "#00FFFF", // Cyan
  "#F08080", // Light Coral
  "#00FFFF", // Aqua
];

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
  setFontFamily,
  setTextColor,
  setHighlight,
  toggleChecklist,
}) => {
  const [currentFont, setCurrentFont] = useState("Arial");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const fontMenuItems: MenuProps["items"] = fonts.map((font, index) => ({
    key: index.toString(), // Use the index or a unique identifier
    label: font,
  }));

  return (
    <div className={styles.toolbar}>
      <div className={styles.iconsRow}>
        <div
          className={styles.formattingIcon}
          onClick={() => toggleChecklist(editor)}
        >
          <LuListTodo color="#111" />
        </div>
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
              setFontFamily(editor, currentItem?.label);
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
        <Popover
          content={
            <CirclePicker
              colors={textColors}
              onChangeComplete={(color) => {
                setShowColorPicker(false);
                setTextColor(editor, color.hex);
              }}
            />
          }
          open={showColorPicker}
          trigger="click"
        >
          <div>
            <MdFormatColorText
              color="#111"
              onClick={() => {
                setShowColorPicker(true);
              }}
            />
          </div>
        </Popover>

        <Popover
          content={
            <CirclePicker
              colors={textColors}
              onChangeComplete={(color) => {
                setShowHighlightPicker(false);
                setHighlight(editor, color.hex);
              }}
            />
          }
          open={showHighlightPicker}
          trigger="click"
        >
          <div>
            <IoColorFillOutline
              color="#111"
              onClick={() => {
                setShowHighlightPicker(true);
              }}
            />
          </div>
        </Popover>
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
