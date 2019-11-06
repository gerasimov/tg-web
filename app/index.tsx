import { T } from "./core/dom/t";

import Input from "./components/input";
import LoginLayout from "./layouts/login-layout";

import "./styles/base.less";

const root = document.querySelector("#root");

if (root) {
  root.appendChild(
    <LoginLayout>
      <Input />
    </LoginLayout>
  );
}
