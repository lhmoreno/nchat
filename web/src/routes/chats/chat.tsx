import { API, Chats, Messages } from "~/lib/api";
import { cn } from "~/lib/utils";
import { Route } from "./+types/chat";
import {
  CheckCheckIcon,
  CheckIcon,
  ClockIcon,
  Paperclip,
  SendHorizonal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import dayjs from "dayjs";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { io, Socket } from "socket.io-client";

export function meta({ params }: Route.MetaArgs) {
  if (params.chatId) {
    return [{ title: `Conversa: ${params.chatId} | nChat` }];
  }

  return [{ title: "Conversas | nChat" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { chatId } = params;

  if (!chatId) {
    return null;
  }

  const res = await API.getMessages(chatId);

  if (res.error) {
    console.error(res.error);
    return [];
  }

  return res.body;
}

function generateMessages(
  count: number,
  senderId: string | undefined = "123"
): Messages {
  return Array.from({ length: count }, (): Messages[0] => {
    return {
      id: faker.string.uuid(),
      senderId: faker.datatype.boolean() ? faker.string.uuid() : senderId,
      content: faker.lorem.sentence(),
      createdAt: faker.date.recent().toISOString(),
      status: faker.helpers.arrayElement([
        // undefined,
        // "pending",
        "sent",
        "delivered",
        "read",
      ]),
    };
  });
}

let socket: Socket;

export default function Chat({
  matches,
  params,
  loaderData,
}: Route.ComponentProps) {
  if (!params.chatId) {
    return (
      <div className="flex-1">
        <div className="h-full flex justify-center items-center text-gray-600">
          Selecione um contato
        </div>
      </div>
    );
  }

  const chat = matches[2].data.find(
    ({ id }) => id === params.chatId
  ) as Chats[0];
  const profile = matches[1].data;

  const [isSocketConnected, setSocketIsConnected] = useState(false);
  const [messages, setMessages] = useState(loaderData ?? []);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputMessageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket = io(import.meta.env.VITE_API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    socket.on("connect", () => {
      setSocketIsConnected(true);
    });
  }, []);

  useEffect(() => {
    if (isSocketConnected) {
      socket.on("message", (message: Messages[0] & { chatId: string }) => {
        if (message.chatId !== chat.id) {
          API.changeMessageStatus(message.id, "delivered");
          return;
        }

        API.changeMessageStatus(message.id, "read");
        setMessages((v) => [
          ...v,
          {
            ...message,
            status: "read",
          },
        ]);
      });

      socket.on(
        "message_status",
        (message: {
          id: string;
          chatId: string;
          status: "delivered" | "read";
        }) => {
          if (message.chatId !== chat.id) {
            return;
          }

          setMessages((v) => {
            const list: Messages = [...v];
            const index = list.findIndex(({ id }) => id === message.id);

            list[index] = {
              ...list[index],
              status: message.status,
            };

            return list;
          });
        }
      );

      return () => {
        socket.off("message");
        socket.off("message_status");
      };
    }
  }, [isSocketConnected, chat]);

  useEffect(() => {
    setMessages(loaderData ?? []);
  }, [loaderData]);

  useEffect(() => {
    scrollMessagesToBottom();
  }, [messages]);

  function scrollMessagesToBottom() {
    if (scrollAreaRef.current) {
      const scrollAreaViewPort = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );

      if (scrollAreaViewPort) {
        scrollAreaViewPort.scrollTop = scrollAreaViewPort.scrollHeight;
      }
    }
  }

  async function handleSubmitMessage(
    ev: React.FormEvent<HTMLFormElement> & React.FormEvent<HTMLDivElement>
  ) {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);
    const message = String(formData.get("message")).trim();

    if (message === "") {
      return;
    }

    const fakeId = faker.string.uuid();

    setMessages((v) => {
      const list: Messages = [
        ...v,
        {
          id: fakeId,
          content: message,
          createdAt: new Date().toISOString(),
          senderId: profile.id,
          status: "pending",
        },
      ];

      return list;
    });

    if (inputMessageRef?.current?.value) {
      inputMessageRef.current.value = "";
    }

    const res = await API.sendMessage({ chatId: chat.id, content: message });

    if (res.error) {
      setMessages((v) => v.filter(({ id }) => id !== fakeId));
      return;
    }

    setMessages((v) => {
      const list: Messages = [...v];
      const index = list.findIndex(({ id }) => id === fakeId);

      list[index] = {
        ...list[index],
        id: res.message.id,
        createdAt: res.message.createdAt,
        status: res.message.status,
      };

      return list;
    });
  }

  return (
    <div className="w-full py-2">
      <div className="px-6 py-3 flex border-b border-stone-300">
        <Avatar className="w-11 h-11">
          <AvatarImage src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <h1 className="font-bold">{chat.user.name}</h1>
          <h2 className="text-sm text-stone-500">{`@${chat.user.username}`}</h2>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="h-conversation">
        <div className="py-3 px-4 flex flex-col gap-3 justify-end">
          {messages.map((message) => {
            const isSender = message.senderId === profile.id;

            const Icon = () => {
              if (message.status === "pending") {
                return <ClockIcon className="w-3 h-3" />;
              }
              if (message.status === "sent") {
                return <CheckIcon className="w-4 h-4" />;
              }
              if (message.status === "delivered") {
                return <CheckCheckIcon className="w-4 h-4" />;
              }
              if (message.status === "read") {
                return <CheckCheckIcon className="w-4 h-4 text-blue-500" />;
              }
              return null;
            };

            return (
              <div
                key={message.id}
                className={cn(
                  "bg-secondary py-1 px-2 mr-2 rounded-lg flex gap-2 w-fit max-w-xl shadow",
                  isSender && "self-end bg-green-200"
                )}
              >
                <p className="text-sm break-words overflow-hidden">
                  {message.content}
                </p>
                <span className="-mb-0.5 self-end text-xs text-stone-500 flex items-center gap-1">
                  {dayjs(message.createdAt).format("HH[:]mm")}
                  {isSender && <Icon />}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-4 py-2 flex items-center gap-4 border-t border-stone-300">
        <Button variant="ghost">
          <Paperclip className="w-5 h-5" />
        </Button>
        <form
          className="flex-1 flex items-center gap-4"
          onSubmit={handleSubmitMessage}
        >
          <Input
            ref={inputMessageRef}
            className="text-base"
            name="message"
            placeholder="Digite uma mensagem"
          />
          <Button type="submit">
            <SendHorizonal className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
