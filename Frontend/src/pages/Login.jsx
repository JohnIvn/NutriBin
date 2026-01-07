import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLogin } from "@/schema/adminAccount";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const { login } = useUser();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(adminLogin),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      setLoginError(null);
      setLoginMessage(null);
      const formData = values;

      const response = await axios.post(
        "http://localhost:3000/staff/signin",
        formData
      );
      if (!response.data.ok) {
        setLoginError(response.data.error || "Login failed");
        return;
      }
      setLoginMessage("Login successful!");
      login(response.data.staff);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setLoginError(error.message || "An error occurred");
      console.error(error.message || error);
    }
  }

  async function handleGoogleLogin(credentialResponse) {
    try {
      setLoginError(null);
      setLoginMessage(null);

      const response = await axios.post(
        "http://localhost:3000/staff/google-signin",
        { credential: credentialResponse.credential }
      );

      if (!response.data.ok) {
        setLoginError(response.data.error || "Google sign-in failed");
        return;
      }

      setLoginMessage("Google sign-in successful!");
      login(response.data.staff);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setLoginError(
        error.response?.data?.message || error.message || "An error occurred"
      );
      console.error(error);
    }
  }

  function handleGoogleError() {
    setLoginError("Google sign-in failed. Please try again.");
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="w-full h-screen lg:grid lg:grid-cols-2">
        {/* left */}
        <div className="hidden lg:flex flex-col justify-center items-center relative h-full">
          <div className="absolute inset-0 bg-zinc-900" />
          <img
            src="/login-bg.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* right */}
        <div className="flex items-center justify-center py-12 px-4 sm:px-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">SIGN IN</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 "
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            className="h-10 focus-visible:ring-1 focus-visible:ring-[#CD5C08] focus-visible:border-[#CD5C08]"
                            {...field}
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type={showPass ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-10 focus-visible:ring-1 focus-visible:ring-[#CD5C08] focus-visible:border-[#CD5C08]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showPassword"
                      onCheckedChange={(checked) => setShowPass(checked)}
                      className="border-[#CD5C08] data-[state=checked]:bg-[#CD5C08] data-[state=checked]:text-white cursor-pointer"
                    />
                    <Label
                      htmlFor="showPassword"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Show Password
                    </Label>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    asChild
                    className="px-0 font-normal text-sm text-[#CD5C08]"
                  >
                    <Link to="/password-reset">Forgot password?</Link>
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full font-semibold bg-[#CD5C08] text-white hover:bg-[#A34906] cursor-pointer"
                >
                  Sign In
                </Button>

                {/* error & success */}
                {loginError && (
                  <div className="p-3 bg-destructive/15 border border-destructive/50 rounded-md text-destructive text-sm text-center">
                    {loginError}
                  </div>
                )}
                {loginMessage && (
                  <div className="p-3 bg-green-500/15 border border-green-500/50 rounded-md text-green-700 text-sm text-center">
                    {loginMessage}
                  </div>
                )}

                {/* divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* google */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={handleGoogleError}
                    useOneTap
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    width="100%"
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
