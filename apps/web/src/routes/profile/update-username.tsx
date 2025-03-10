import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { toast } from "sonner";
import { User } from "@nchat/dtos/user";
import { updateUsername } from "~/lib/api/update-username";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const updateUsernameFormSchema = z.object({
  username: z
    .string({ required_error: "Campo obrigatório" })
    .min(3, "Deve ter no mínimo 3 caracteres")
    .max(32, "Deve ter no máximo 32 caracteres"),
});

type UpdateUsernameFormData = z.infer<typeof updateUsernameFormSchema>;

export default function UpdateUsernameForm({ profile }: { profile: User }) {
  const [currentUsername, setCurrentUsername] = useState(profile.username);

  const form = useForm<UpdateUsernameFormData>({
    resolver: zodResolver(updateUsernameFormSchema),
    defaultValues: {
      username: profile.username,
    },
  });

  const { mutateAsync: update } = useMutation({
    mutationFn: updateUsername,
    onSuccess: (_, data) => {
      setCurrentUsername(data.username);

      toast("Username alterado com sucesso!", {
        description: "@" + data.username,
      });
    },
    onError: (error) => {
      if (isAxiosError(error) && error.status === 409) {
        form.setError("username", { message: "Username já está em uso" });
        return;
      }

      console.error(error);
    },
  });

  async function handleSubmit(data: UpdateUsernameFormData) {
    if (currentUsername === data.username) return;

    await update(data);
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
