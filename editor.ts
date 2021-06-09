import "codemirror/lib/codemirror.css";

import CodeMirror from "codemirror";
import { mode } from "./messageformat.mode";

export class Editor {
  // TODO: double quotes for HTML attributes?
  static readonly forbiddenChars: RegExp = /[{}<>]/;

  private readonly editor: CodeMirror.Editor;

  constructor(textArea: HTMLTextAreaElement) {
    const { scrollLeft, scrollTop } = textArea;

    this.editor = CodeMirror.fromTextArea(textArea, {
      lineWrapping: true,
      theme: "",
      mode
    });

    this.editor.operation(() => this.setNotEditableParts());
    this.editor.scrollTo(scrollLeft, scrollTop);

    // FIXME: typings
    this.editor.on("changes", () => this.editor.save());

    this.editor.on("beforeChange", (editor, change) => {
      if (Editor.forbiddenChars.test(change.text.join())) {
        change.cancel();
      }
    });
  }

  destroy(): void {
    // FIXME: typings
    const textArea: HTMLTextAreaElement = this.editor.getTextArea();
    const { top, left } = this.editor.getScrollInfo();
    this.editor.toTextArea();
    textArea.scrollTop = top;
    textArea.scrollLeft = left;
  }

  private isEditableToken(
    type: CodeMirror.Token["type"],
    value: CodeMirror.Token["string"]
  ): boolean {
    return /^string/.test(type) || (type === "keyword" && value === "#");
  }

  private setNotEditablePart(
    from: CodeMirror.Position | null,
    to: CodeMirror.Position
  ): void {
    if (from) {
      this.editor.markText(from, to, {
        className: "notEditable",
        readOnly: true,
        atomic: true
      });
    }
  }

  private setNotEditableParts(): void {
    let from: CodeMirror.Position | null = null;

    this.editor.eachLine(handle => {
      const line: CodeMirror.Position["line"] = this.editor.getLineNumber(
        handle
      );

      this.editor.getLineTokens(line).forEach(token => {
        const { type, string, start } = token;
        const to: CodeMirror.Position = CodeMirror.Pos(line, start);

        if (this.isEditableToken(type, string)) {
          this.setNotEditablePart(from, to);
          from = null;
        } else if (!from) {
          from = to;
        }
      });
    });

    this.setNotEditablePart(from, CodeMirror.Pos(this.editor.lineCount(), -1));
  }
}
