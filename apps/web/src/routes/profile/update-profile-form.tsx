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
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { User } from "@nchat/dtos/user";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "~/lib/api/update-profile";

const updateProfileFormSchema = z.object({
  name: z
    .string({ required_error: "Campo obrigatório" })
    .min(3, "Deve ter no mínimo 3 caracteres")
    .max(32, "Deve ter no máximo 32 caracteres"),
});

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;

export default function UpdateProfileForm({ profile }: { profile: User }) {
  const [changeDefaultNameCount, setChangeDefaultNameCount] = useState(0);

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      name: profile.name,
    },
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (_, data) => {
      toast("Nome alterado com sucesso!", {
        description: `Novo nome: ${data.name}`,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (changeDefaultNameCount === 0) {
      if (profile.name !== form.formState.defaultValues?.name) {
        form.setValue("name", profile.name);
        setChangeDefaultNameCount(1);
      }
    }
  }, [changeDefaultNameCount, profile, form]);

  async function handleSubmitName(data: UpdateProfileFormData) {
    if (profile.name === data.name) return;

    await updateUser({ name: data.name });
  }

  return (
    <Card>
      <CardHeader className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Nome de exibição
        </h3>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitName)}
            className="space-y-4 max-w-sm"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Nome do projeto"
                      type="text"
                      {...field}
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
          onClick={() => handleSubmitName({ name: form.getValues("name") })}
          disabled={form.formState.isSubmitting}
        >
          Salvar
        </Button>
      </CardFooter>
    </Card>
  );
}
