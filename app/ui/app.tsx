import { T } from 'app/core/dom';
import LoginLayout from 'app/ui/pages/login-layout';
import ChatLayout from 'app/ui/pages/chat-layout';

import { RegisterLayout } from 'app/ui/pages/register-layout';
import { invokeApi } from 'app/core/mtproto/invokeApi';
import route, { initializeRoutes } from 'app/ui/router/history';

import { InvokeWithLayer } from 'app/core/mtproto/functions/InvokeWithLayer';

import 'app/ui/styles/base.less';

class App {
  rootEl: any;

  init = () => {
    route('/login', () => this.renderPage(<LoginLayout />));
    route('/register', () => this.renderPage(<RegisterLayout />));
    route('/', () => this.renderPage(<ChatLayout />));
    initializeRoutes();
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
