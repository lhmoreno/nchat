import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { API, Profile } from "~/lib/api";
import { toast } from "sonner";

const updateUsernameFormSchema = z.object({
  username: z
    .string({ required_error: "Campo obrigatório" })
    .min(3, "Deve ter no mínimo 3 caracteres")
    .max(32, "Deve ter no máximo 32 caracteres"),
});

type UpdateUsernameFormData = z.infer<typeof updateUsernameFormSchema>;

export default function UpdateUsernameForm({ profile }: { profile: Profile }) {
  const [currentUsername, setCurrentUsername] = useState(profile.username);

  const form = useForm<UpdateUsernameFormData>({
    resolver: zodResolver(updateUsernameFormSchema),
    defaultValues: {
      username: profile.username,
    },
  });

  async function handleSubmit(data: UpdateUsernameFormData) {
    if (currentUsername === data.username) return;

    const res = await API.updateUsername(data.username);

    if (res.error) {
      if (res.error.status === 409) {
        form.setError("username", { message: "Username já está em uso" });
        return;
      }

      console.error(res.error);
      return;
    }

    setCurrentUsername(data.username);

    toast("Username alterado com sucesso!", {
      description: "@" + data.username,
    });
  }

  return (
    <Card>
      <CardHeader className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">Username</h3>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 max-w-sm"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="seu-username"
                      type="text"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("username");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="px-6 py-3 border-t border-border justify-between">
        <p className="text-sm text-gray-600">Use no máximo 32 caracteres.</p>
        <Button
          onClick={() => handleSubmit({ username: form.getValues("username") })}
          disabled={form.formState.isSubmitting}
        >
          Salvar
        </Button>
      </CardFooter>
    </Card>
  );
}
