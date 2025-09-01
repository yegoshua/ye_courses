"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { registerSchema, LoginFormData, RegisterFormData, loginSchema } from "./schema";

import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { loginUser, registerUser } from "@/lib/store/slices/authSlice";
import { closeAuthForm, toggleAuthMode } from "@/lib/store/slices/uiSlice";
import {
  selectIsAuthFormOpen,
  selectAuthMode,
  selectAuthLoading,
  selectAuthError,
} from "@/lib/store/selectors";

export function AuthForm() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsAuthFormOpen);
  const authMode = useAppSelector(selectAuthMode);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLogin = authMode === "login";
  const schema = isLogin ? loginSchema : registerSchema;

  const form = useForm<
    LoginFormData | RegisterFormData
  >({
    resolver: zodResolver(schema),
    defaultValues: isLogin
      ? {
          email: "",
          password: "",
        }
      : {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    try {
      if (isLogin) {
        const result = await dispatch(loginUser(data as LoginFormData));
        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Welcome back!");
          dispatch(closeAuthForm());
          form.reset();
        }
      } else {
        const result = await dispatch(registerUser(data as RegisterFormData));
        if (result.meta.requestStatus === "fulfilled") {
          toast.success(
            "Account created successfully! Welcome to YeCourses!"
          );
          dispatch(closeAuthForm());
          form.reset();
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const handleModeToggle = () => {
    dispatch(toggleAuthMode());
    form.reset();
  };

  const handleClose = () => {
    dispatch(closeAuthForm());
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Sign in to your account to continue learning"
              : "Join thousands of learners on YeCourses"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isLogin && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleModeToggle}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
