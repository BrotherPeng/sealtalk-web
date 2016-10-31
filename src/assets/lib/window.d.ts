declare var Intense: any;

declare module RongIMLib {
    export var VCDataProvider :any
    class Expression {
        static retrievalEmoji(a: any, b: any): string
        static getEmojiObjByEnglishNameOrChineseName(obj: any): any
        static getAllExpression(number: any, start: any): any
    }
    class RongIMEmoji {
        static emojis: any[]
        static init(): void

        static calculateUTF(str: string): string
        static emojiToSymbol(str: string): string
        static symbolToEmoji(str: string): string
        static symbolToHTML(str: string): string
        static emojiToHTML(str: string): string
    }
    class RongIMVoice {
        static init(): void
        static preLoaded(data: string): void
        static play(data: string, duration: number): void
        static stop(data?: string): void
        static onprogress(): void
    }
    class RongUploadLib {
        static init(img1Opts?: any, img2Opts?: any, fileOpts?: any): void
        static getInstance(): RongUploadLib;
        reload(image: string, file: string): void
        setListeners(listener: any): void
        start(conversationType: string, targetId: string): void
        stopUpload(): void
        getThumbnail(): void
        postImage(base64: string, file:any, conversationType: webimmodel.conversationType, targetId: string, callback:any): void
        destroy(): void
        cancel(file: any): void
        cancelAll(callback: any): void
    }
}

interface JQuery {
    rebox(target: any): JQuery
    contextmenu: any
}

interface Window {
    webkitURL: URL
    // URL: URL
    Notification: Notification
    [index: string]: any
    Electron: any
    _open_account_settings: any
    upload_base64: any
    clipboardData: any
}
interface Document {
    selection: any
}

interface HTMLElement{
  createTextRange: any;
  href: string;
}
interface HTMLAnchorElement{
  download: any;
}
interface Element{
  children:any;
  files: any;
}

declare var window: Window

interface Notification extends Function {
    title: string;
    dir: string;
    lang: string;
    body: string;
    tag: string;
    icon: string;
    data: any;
    slient: boolean;

    onclick: (ev: MouseEvent) => any;
    onerror: () => any;
    onshow: () => any;
    onclose: () => any;
    close: () => any;
}

declare var Notification: {
    new (title: string, config: any): Notification
    requestPermission(fun: any): void
    permission: any
}


declare var Electron: any
interface Electron {
    ipcRenderer: {
        send(event: string, num: number): void
    }
}
