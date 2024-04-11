interface ContextDataJsCode {
  templateName: string;
  data: any;
  isShowAll: boolean;
}

interface ContextData {
  content: string | ContextDataJsCode;
  role: string;
}

interface MessageContext {
  data: ContextData;
  type: string;
}

interface Message {
  role: "user" | "weai";
  date: string;
  context: MessageContext[];
  id?: string;
}


interface DebugConetnt {
  code: string;
  data: any;
}

interface MainProps  {
  scrollToBottom: () => void;
  name: string;
  data: any | undefined;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  debug?: Boolean;
  debugContent?: DebugConetnt;
  sendMessage: (inputData: any) => Promise<void>;
  allMessage?: Message[];
  updateChat: (history: any[]) => Promise<void>;
  isDarkMode?: boolean;
  nowMessage?: Message;
  nowMessgae?: Message;
  setMaxWidth?: React.Dispatch<React.SetStateAction<undefined>>;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  chatId: string;
}

declare class WeDyncamic {
  static App: (props:MainProps) => React.JSX.Element;
}

declare const request: (params: Taro.request.Option, isChat?: boolean) => Promise<any>

declare const towxml2: (text: string, type: string) => void;

interface ToXmlProps {
  text: string;
}

declare const ToXml: (arg0: ToXmlProps) => React.JSX.Element;
