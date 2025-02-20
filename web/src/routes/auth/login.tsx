import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { API } from "~/lib/api";
import { useState } from "react";
import { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login | nChat" }];
}

const loginFormSchema = z.object({
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email("O e-mail é inválido"),
  password: z.string({ required_error: "Campo obrigatório" }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function Login() {
  const [isInvalidError, setIsInvalidError] = useState(false);

  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmitLogin(data: LoginFormData) {
    if (data.password.length < 6) {
      setIsInvalidError(true);
      return;
    }

    const res = await API.login(data);

    if (res.error) {
      if (res.error.status === 401) {
        setIsInvalidError(true);
        return;
      }

      console.error(res.error);
      return;
    }

    navigate("/");
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-center">
          Entre na sua conta
        </h2>
        {isInvalidError && (
          <p className="text-red-400 text-center">E-mail ou senha inválidos</p>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitLogin)}
            className="space-y-4"
          >
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
                        setIsInvalidError(false);
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
                    <Input
                      placeholder="******"
                      type="password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsInvalidError(false);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Link
              className="inline-block w-full text-right text-sm underline mt-2"
              to="/forgot-password"
            >
              Esqueceu sua senha?
            </Link> */}
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Entrar
            </Button>
            <Link
              className="inline-block w-full text-center text-sm underline mt-2"
              to="/register"
            >
              Não tem uma conta?
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
