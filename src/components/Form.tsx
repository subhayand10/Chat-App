import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import axios from "axios";

const formSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string()
});

export default function ProfileForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });
  // const deployedUrl = "https://chat-app-wnta.onrender.com";
   //const deployedUrl = "http://localhost:8000";
   const deployedUrl =
     "http://ec2-3-110-42-202.ap-south-1.compute.amazonaws.com";


  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //console.log(JSON.parse(values));
    
    if (values.fullName) {
      try{

        const response = await axios.post(
          deployedUrl+"/register",
          values
        );
        console.log(response.data);
        navigate("/");
        toast(response.data, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      catch(err){
        toast(err.response.data, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(err.response.data);
      }
    }
    else{
       try {
         const response = await axios.post(
           deployedUrl+"/login",
           values
         );
         console.log(response.data);
         localStorage.setItem("user", JSON.stringify(response.data));
         navigate("/Dashboard");
         toast("Logged in successfully", {
           position: "bottom-right",
           autoClose: 1000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
           theme: "dark",
         });
       } catch (err) {
         toast(err.response.data, {
           position: "bottom-right",
           autoClose: 1000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
           theme: "dark",
         });
         console.log(err.response.data);
       }
    }
  }

  useEffect(() => {
    // Call blur on the input element reference to remove focus
    inputRef.current?.blur();
  }, []);

  return (
    <>
      <Form {...form}>
        <div className=" text-4xl font-extrabold">{`Welcome ${
          location.pathname !== "/SignUp" ? "Back" : ""
        }`}</div>
        <div className=" text-xl font-light mb-14">{`${
          location.pathname == "/"
            ? "Sign in to explore"
            : "Sign up to get started"
        }`}</div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 text-center "
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <>
                {location.pathname == "/" ? (
                  ""
                ) : (
                  <FormItem className="flex flex-col justify-center items-start">
                    <FormLabel className="text-indigo-900">Full name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        ref={inputRef}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              </>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center items-start">
                <FormLabel className="text-indigo-900">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your mail"
                    {...field}
                    ref={inputRef}
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
              <FormItem className="flex flex-col justify-center items-start">
                <FormLabel className="text-indigo-900">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    {...field}
                    ref={inputRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="relative bottom-2 w-[100%]">
            Submit
          </Button>
        </form>
        {location.pathname === "/" ? (
          <div className="text-sm">
            Don't Have Account?{" "}
            <span
              className="text-sm cursor-pointer underline"
              onClick={() => {
                navigate("/SignUp");
              }}
            >
              Create Here
            </span>
          </div>
        ) : (
          <div className="text-sm">
            Already Have Account?{" "}
            <span
              className="text-sm cursor-pointer underline"
              onClick={() => {
                navigate("/");
              }}
            >
              Sign In
            </span>
          </div>
        )}
      </Form>
    </>
  );
}
