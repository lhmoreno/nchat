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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { io, Socket } from "socket.io-client";
import { queryClient } from "~/lib/react-query";
import { Chat } from "@nchat/dtos/chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessages } from "~/lib/api/get-messages";
import { changeMessageStatus } from "~/lib/api/change-message-status";
import { sendMessage } from "~/lib/api/send-message";
import { v4 as uuid } from "uuid";
import { Message } from "@nchat/dtos/message";
import { User } from "@nchat/dtos/user";

export function meta({ params }: Route.MetaArgs) {
  if (params.chatId) {
    return [{ title: `Conversa: ${params.chatId} | nChat` }];
  }

  return [{ title: "Conversas | nChat" }];
}

let socket: Socket;

export default function Chat({ matches, params }: Route.ComponentProps) {
  if (!params.chatId) {
    return (
      <div className="flex-1">
        <div className="h-full flex justify-center items-center text-gray-600">
          Selecione um contato
        </div>
      </div>
    );
  }

  const chats = queryClient.getQueryData(["chats"]) as Chat[];
  const chat = chats.find(({ id }) => id === params.chatId) as Chat;
  const profile = queryClient.getQueryData(["profile"]) as User;

  const [isSocketConnected, setSocketIsConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputMessageRef = useRef<HTMLInputElement>(null);

  const { data: messages, dataUpdatedAt } = useQuery({
    queryKey: ["messages", params.chatId],
    queryFn: () => (params.chatId ? getMessages(params.chatId) : []),
    initialData: [],
  });

  const { mutateAsync: createMessage } = useMutation({
    mutationFn: sendMessage,
    onMutate: async ({ content }) => {
      const fakeId = "pending-" + uuid();
      const cached = queryClient.getQueryData<Message[]>([
        "messages",
        params.chatId,
      ]);

      if (cached) {
        queryClient.setQueryData<Message[]>(
          ["messages", params.chatId],
          [
            ...cached,
            {
              id: fakeId,
              content,
              createdAt: new Date().toISOString(),
              senderId: profile.id,
              status: "sent",
            },
          ]
        );
      }

      return { fakeId, cached };
    },
    onSuccess: ({ id, createdAt, status }, _, { fakeId }) => {
      queryClient.setQueryData<Message[]>(
        ["messages", params.chatId],
        (cached) => {
          if (cached) {
            const list = cached;
            const index = list.findIndex(({ id }) => id === fakeId);

            list[index] = {
              ...list[index],
              id,
              createdAt,
              status,
            };

            return list;
          }
        }
      );
    },
    onError: (_, __, ctx) => {
      if (ctx?.cached) {
        queryClient.setQueryData<Message[]>(
          ["messages", params.chatId],
          ctx.cached
        );
      }
    },
  });

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
      socket.on("message", (chatId: string, message: Message) => {
        if (chatId !== chat.id) {
          changeMessageStatus(message.id, { status: "delivered" });
          return;
        }

        changeMessageStatus(message.id, { status: "read" });
        queryClient.setQueryData<Message[]>(
          ["messages", params.chatId],
          (cached) => {
            if (cached) {
              return [...cached, message];
            }
          }
        );
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

          queryClient.setQueryData<Message[]>(
            ["messages", params.chatId],
            (cached) => {
              if (cached) {
                const list = cached;
                const index = list.findIndex(({ id }) => id === message.id);

                list[index] = {
                  ...list[index],
                  status: message.status,
                };

                return list;
              }
            }
          );
        }
      );

      return () => {
        socket.off("message");
        socket.off("message_status");
      };
    }
  }, [isSocketConnected, chat]);

  useEffect(() => {
    scrollMessagesToBottom();
  }, [messages, dataUpdatedAt]);

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

    if (message === "" || !params.chatId) {
      return;
    }

    if (inputMessageRef?.current?.value) {
      inputMessageRef.current.value = "";
    }

    await createMessage({
      chatId: params.chatId,
      content: message,
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
              if (message.status === "sent" && message.id.includes("pending")) {
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
