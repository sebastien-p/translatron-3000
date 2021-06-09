import CodeMirror from "codemirror";
import icuMode from "codemirror-mode-icu";
import "codemirror/mode/xml/xml";
import "codemirror/addon/mode/multiplex";

// FIXME
declare module "codemirror" {
  namespace CodeMirror {
    function multiplexingMode(): void;
  }
}

CodeMirror.defineMode("icu", icuMode);

export const mode: string = "messageformat";

CodeMirror.defineMode(mode, config =>
  CodeMirror.multiplexingMode(CodeMirror.getMode(config, "icu"), {
    mode: CodeMirror.getMode(config, "xml"),
    // parseDelimiters: true, // TODO: HTML attributes
    close: />/,
    open: /</
  })
);
