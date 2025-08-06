/**
 * Type declarations for EditorJS plugins
 */

declare module '@editorjs/header' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Header implements BlockTool {
    constructor(config: any);
    render(): HTMLElement;
    save(): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/paragraph' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Paragraph implements BlockTool {
    constructor(config: any);
    render(): HTMLElement;
    save(): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/list' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class List implements BlockTool {
    constructor(config: any);
    render(): HTMLElement;
    save(): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/quote' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Quote implements BlockTool {
    constructor(config: any);
    render(): HTMLElement;
    save(): any;
    static get toolbox(): any;
  }
}



declare module '@editorjs/image' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Image implements BlockTool {
    constructor(config: any);
    render(): HTMLElement;
    save(): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/table' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Table implements BlockTool {
    constructor(config: any);
    render(): HTMLElement;
    save(): any;
    static get toolbox(): any;
  }
}

declare module '@editorjs/delimiter' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Delimiter implements BlockTool {
    constructor(config: any);
    render(): HTMLElement;
    save(): any;
    static get toolbox(): any;
  }
}



declare module '@editorjs/embed' {
  import { BlockTool } from '@editorjs/editorjs';
  export default class Embed implements BlockTool {
    constructor(config: any);
    render(): HTMLElement;
    save(): any;
    static get toolbox(): any;
  }
}



declare module '@editorjs/link' {
  import { InlineTool } from '@editorjs/editorjs';
  export default class LinkTool implements InlineTool {
    constructor(config: any);
    render(): HTMLElement;
    surround(): void;
    checkState(): boolean;
    static get isInline(): boolean;
    static get sanitize(): any;
  }
}
