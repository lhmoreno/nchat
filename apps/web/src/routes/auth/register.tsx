import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/register";
import { CreateUserSchema, createUserSchema } from "@nchat/dtos/user";
import { useMutation } from "@tanstack/react-query";
import { register } from "~/lib/api/register";
import { isAxiosError } from "axios";
import { signIn } from "~/lib/api/sign-in";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Registrar | nChat" }];
}

export default function Register() {
  const navigate = useNavigate();

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: createUser } = useMutation({
    mutationFn: register,
    onError: (error, data) => {
      if (isAxiosError(error)) {
        if (
          error.status === 409 &&
          error.response?.data.message.includes(data.email)
        ) {
          form.setError("email", {
            type: "manual",
            message: "E-mail já registrado",
          });
          return;
        }

        if (
          error.status === 409 &&
          error.response?.data.message.includes(data.username)
        ) {
          form.setError("username", {
            type: "manual",
            message: "Username já registrado",
          });
          return;
        }

        console.error(error);
      }
    },
  });

  async function handleSubmitRegister(data: CreateUserSchema) {
    await createUser(data);

    const { access_token } = await signIn(data);

    localStorage.setItem("token", access_token);

    navigate("/chats");
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-center">Crie sua conta</h2>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitRegister)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu-apelido"
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@email.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("email");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Registrar
            </Button>
            <Link
              className="inline-block w-full text-center text-sm underline mt-2"
              to="/login"
            >
              Já tem uma conta?
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
