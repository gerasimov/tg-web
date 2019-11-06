import { T } from "../core/dom/t";
import Component from "../core/component";

import logo from "../assets/t_logo.png";

import "./login-layout.less";

@Component
class LoginLayout {
  render() {
    const { children } = this.props;

    return (
      <main className="l-login">
        <div className="login-box">
          <img src={logo} alt="Telegram" />
          <h1>Sign in to Telegram</h1>
          <p>Please confirm you country and enter your phone number</p>
          {children}
        </div>
      </main>
    );
  }
}

export default LoginLayout;
