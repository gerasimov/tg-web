import { T, Component } from "app/core/dom";
import LoginLayout from "app/ui/layouts/login-layout";

import "./styles/base.less";

@Component
class App {
  render = () => <LoginLayout />;
}

export default App;
