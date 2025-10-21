import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const signUpSchema = z.object({
  firstname: z.string().min(1, 'Bitte geben Sie einen Vornamen ein'),
  lastname: z.string().min(1, 'Bitte geben Sie einen Nachamen ein'),
  username: z.string().min(3, 'Benutzername hat min. 3 Zeichen'),
  email: z.email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein')

});

type SignUpFormValues = z.infer<typeof signUpSchema>



export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema)
  });
  const onSubmit = async () => {

  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 ">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header -logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center mt-1">
                  <img src="/logo.jpeg" alt="Logo" className="w-40" /></a>
                <h1 className="text-2xl font-bold">Neu Konto eröffnen</h1>
                <p className="text-muted-foreground text-balance">
                  Jetzt kostenlos registrieren!
                </p>
              </div>
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm">Vorname</Label>
                  <Input id="firstname" placeholder="Max" required {...register('firstname')} />
                  {errors.firstname && (
                    <p className="text-destructive text-sm" >
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">Nachname</Label>
                  <Input type="text" id="lastname" placeholder="Mustermann" required {...register('lastname')} />
                  {errors.lastname && (
                    <p className="text-destructive text-sm" >
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Benutzername */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">Benutzername</Label>
                <Input id="username" type="text" placeholder="m.max2025" required {...register('username')} />
                {errors.username && (
                  <p className="text-destructive text-sm" >
                    {errors.username.message}
                  </p>
                )}


              </div>
              {/* email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-sm">Email</Label>
                <Input id="email" type="text" placeholder="maxmusterman@email.com" required {...register('email')} />
                {errors.email && (
                  <p className="text-destructive text-sm" >
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">Passwort</Label>
                <Input id="password" type="password" placeholder="*******" required {...register('password')} />
                {errors.password && (
                  <p className="text-destructive text-sm" >
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* signup Button */}
              <Button type="submit"
                className="w-full"
                disabled={isSubmitting}>
                Konto erstellen
              </Button>
              <div className="text-sm text-balance text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
                Indem du auf „Weiter“ klickst, stimmst du unseren <a href="#">Nutzungsbedingungen</a>{" "}
                und <a href="#">Datenschutzrichtlinie</a> zu.
              </div>
              <div className="text-center text-sm">
                Haben sie schon einen Konto erstellt? {" "}
                <a href="/signin" className="underline underline-offset-4">Anmelden</a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden items-center justify-center md:flex">
            <img
              src="/placeholderSignup.png"
              alt="Image"
              className="w-auto h-auto max-w-[80%] max-h-[80%] object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
