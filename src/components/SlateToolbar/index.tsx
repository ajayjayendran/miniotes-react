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
import { ImRedo2, ImUndo2 } from "react-icons/im";
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

const SlateToolbar: React.FC<ToolbarProps> = ({
  editor,
  toggleMark,
  setAlignment,
  toggleBlock,
  onRedo,
  onUndo,
}) => {
  console.log(editor);
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
