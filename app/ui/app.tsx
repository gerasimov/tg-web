import { T } from 'app/core/dom';
import LoginLayout from 'app/ui/layouts/login-layout';
import ChatLayout from 'app/ui/layouts/chat-layout';
import { invokeApi } from 'app/core/mtproto/invokeApi';
import { InitConnection } from 'app/core/mtproto/functions/InitConnection';

import route, { initializeRoutes } from 'app/ui/router/history';

import 'app/ui/styles/base.less';

class App {
  rootEl: any;

  init = async () => {
    route('/login', () => this.renderPage(<LoginLayout />));
    route('/', () => this.renderPage(<ChatLayout />));
    await Promise.resolve()
      .then(initializeRoutes)
      .then(() => invokeApi(InitConnection.create().getBytes(true)))
      .catch(e => console.error(e));
  };

  renderPage = (el: any) => {
    if (this.rootEl.firstChild) {
      this.rootEl.firstChild.replaceWith(el);
    } else {
      this.rootEl.appendChild(el);
    }
  };

  render = () => <div class="tg-app" />;
}

export default App;
