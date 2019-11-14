import { T, Component } from "app/core/dom";

import "./chat-layout.less";

interface ChatLayoutProps {
  children: any;
}

class LeftSidebar {
  props: any;
  render = () => <aside>{this.props.children}</aside>;
}

class RightSidebar {
  render = () => <aside />;
}

class Message {
  render = ({ text }: any) => <div class="dialogs-item">{text}</div>;
}

class MessageHistory {
  render = () => (
    <div class="dialogs">
      <div class="dialogs-search" />
      <div class="dialogs-wrap">
        {new Array(100).fill(0).map((_, i) => (
          <Message text={i} />
        ))}
      </div>
    </div>
  );
}

class ChatLayout {
  render = ({ children }: ChatLayoutProps) => (
    <main class="l-chat">
      <div className="chat-container">
        <LeftSidebar>
          <MessageHistory />
        </LeftSidebar>
        <section>
          <header />
        </section>
        {/* <RightSidebar /> */}
      </div>
    </main>
  );
}

export default ChatLayout;
