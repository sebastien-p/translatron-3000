import "./style.css";

import Clipboard from "clipboard";
import { Editor } from "./editor";

const textArea: HTMLTextAreaElement = document.querySelector("#textArea");
const highlight: HTMLButtonElement = document.querySelector("#highlight");
const clear: HTMLButtonElement = document.querySelector("#clear");

let editor: Editor | void;

clear.addEventListener("click", () => {
  if (editor) {
    editor = editor.destroy();
  }

  textArea.value = "";
});

highlight.addEventListener("click", () => {
  editor = editor ? editor.destroy() : new Editor(textArea);
});

new Clipboard("#copy", { text: () => textArea.value });
