import { T } from 'app/core/dom';
import LoginLayout from 'app/ui/layouts/login-layout';

import ChatLayout from 'app/ui/layouts/chat-layout';
import route, { initializeRoutes } from 'app/ui/router/history';

import { MTPClient } from 'app/core/MTPClient'

import 'app/ui/styles/base.less';


class App {
  rootEl: any;

  init = async () => {
    route('/', () => this.renderPage(<ChatLayout />));
    route('/login', () => this.renderPage(<LoginLayout />));

    Promise.resolve().then(initializeRoutes);
    new MTPClient().auth();
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
