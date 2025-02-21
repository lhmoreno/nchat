import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/app/layout.tsx", [
    layout("./routes/chats/layout.tsx", [
      index("./routes/app/home.tsx"),
      route("chats/:chatId?", "./routes/chats/chat.tsx"),
    ]),
  ]),

  layout("./routes/auth/layout.tsx", [
    route("login", "./routes/auth/login.tsx"),
    route("register", "./routes/auth/register.tsx"),
  ]),
] satisfies RouteConfig;
