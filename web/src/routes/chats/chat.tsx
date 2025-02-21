import { API, Messages } from "~/lib/api";
import { cn } from "~/lib/utils";
import { Route } from "./+types/chat";
import { CheckCheckIcon, CheckIcon, ClockIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import dayjs from "dayjs";
import { fakerPT_BR as faker } from "@faker-js/faker";

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

function generateMessages(count: number): Messages {
  return Array.from({ length: count }, (): Messages[0] => {
    return {
      id: faker.string.uuid(),
      senderId: faker.string.uuid(),
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

export default function Chat({ loaderData }: { loaderData: Messages | null }) {
  const [messages, setMessages] = useState(loaderData);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(loaderData);
  }, [loaderData]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollAreaViewPort = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );

      if (scrollAreaViewPort) {
        scrollAreaViewPort.scrollTop = scrollAreaViewPort.scrollHeight;
      }
    }
  }, []);

  if (!messages) {
    return (
      <div className="flex-1">
        <div className="h-full flex justify-center items-center text-gray-600">
          Selecione um contato
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2 space-y-6">
      <ScrollArea ref={scrollAreaRef} className="h-conversation">
        <div className="py-3 px-4 flex flex-col gap-3 justify-end">
          {messages.map((message) => {
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
                  message.status && "self-end bg-green-200"
                )}
              >
                <p className="text-sm break-words overflow-hidden">
                  {message.content}
                </p>
                <span className="-mb-0.5 self-end text-xs text-stone-500 flex items-center gap-1">
                  {dayjs(message.createdAt).format("HH[:]mm")}
                  <Icon />
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
