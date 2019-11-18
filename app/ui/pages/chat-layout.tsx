import { T } from 'app/core/dom';
import './chat-layout.less';
import ava from 'app/ui/assets/TwoFactorSetupMonkeyClose.svg';

interface ChatLayoutProps {
  children: any;
}

class LeftSidebar {
  props: any;
  render = () => <aside class="dialogs-sidebar">{this.props.children}</aside>;
}

class RightSidebar {
  render = () => <aside class="messages-sidebar" />;
}

class Message {
  render = ({ text, img }: any) => (
    <div class="dialogs-item">
      <img  loading="lazy" class="ava" src={img} />
      <div class="description">
        <span class="name">{"Tele Gram"}</span>
        <span class="preview">{text}</span>
      </div>
      <div class="meta">
        <span className="time">21:48</span>
        <div className="counter"></div>
      </div>
    </div>
  );
}

class SearchInput {
  render = () => (
    <div class="search-input">
      <button class="search-button" />
      <input placeholder="Search" />
    </div>
  );
}

class MessageHistory {
  render = () => (
    <div class="dialogs">
      <div class="dialogs-search">
        <div class="drawer"></div>
        <SearchInput />
      </div>
      <div class="dialogs-wrap">
        {new Array(100).fill(0).map((_, i) => (
          <Message text={"mtproto"} img={ava} />
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
        {/*<RightSidebar />*/}
      </div>
    </main>
  );
}

export default ChatLayout;
