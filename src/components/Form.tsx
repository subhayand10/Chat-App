import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <div className=" text-4xl font-extrabold">Welcome Back</div>
      <div className=" text-xl font-light mb-14">Sign in to get explored</div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-center">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <>
              <FormItem className="flex flex-col justify-center items-center">
                <FormLabel className="text-indigo-900">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your mail" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
              <FormItem className="flex flex-col justify-center items-center">
                <FormLabel className="text-indigo-900">Password</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      
    </Form>
  );
}
