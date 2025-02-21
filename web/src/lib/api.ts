const apiUrl = import.meta.env.VITE_API_URL as string;

export type Chats = {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
}[];

export type Messages = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  status: string;
}[];

export const API = {
  async login(data: { email: string; password: string }) {
    const res = await fetch(`${apiUrl}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body = await res.json();

    if (res.status === 201) {
      const access_token = body.access_token as string;

      localStorage.setItem("token", access_token);

      return { access_token };
    }

    return { error: { status: res.status, body } };
  },

  async register(data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) {
    const res = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status === 204) {
      return { success: true };
    }

    const body = await res.json();

    return { error: { status: res.status, body } };
  },

  async getChats() {
    const res = await fetch(`${apiUrl}/chats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.status === 200) {
      const body = (await res.json()) as Chats;

      return { body };
    }

    const body = await res.json();

    return { error: { status: res.status, body } };
  },

  async getMessages(chatId: string) {
    const res = await fetch(`${apiUrl}/chats/${chatId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.status === 200) {
      const body = (await res.json()) as Messages;

      return { body };
    }

    const body = await res.json();

    return { error: { status: res.status, body } };
  },
};
