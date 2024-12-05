import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  superscript?: boolean;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  highlight?: string;
};

type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

type ListElement = {
  type: "bulleted-list" | "numbered-list";
  children: ListItemElement[];
};

type ListItemElement = {
  type: "list-item";
  children: CustomText[];
};

export type AlignableElement = {
  type: "paragraph";
  textAlign?: "left" | "center" | "right" | "justify";
  children: CustomText[];
};

export type CustomElement =
  | ParagraphElement
  | ListElement
  | ListItemElement
  | AlignableElement;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
