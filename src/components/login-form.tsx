"use client";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";
import { driver } from "driver.js";
import { tourSteps } from "~/lib/toursteps";
import "driver.js/dist/driver.css";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    redirect: false,
  });

  useEffect(() => {
    const shouldStartTour = localStorage.getItem("start_demo_tour") === "true";
    if (shouldStartTour) {
      const startStep = 1;

      const driverObj = driver({
        popoverClass: "driverjs-theme",
        allowClose: true,
        showProgress: true,
        onNextClick: (element) => {
          (element as HTMLElement).click(); // Optional if you're auto-clicking
        },
        onCloseClick: () => {
          // Optional: also fires on close button
          localStorage.removeItem("start_demo_tour");
          console.log("Tour closed by user");
        },
        // onDeselected: () => {
        //   // Called when the user exits the tour
        //   localStorage.removeItem("start_demo_tour");
        //   console.log("Tour ended or closed");
        // },
        steps: tourSteps,
      });

      if (startStep <= tourSteps.length) {
        driverObj.drive(startStep);
      }
    }
  }, []);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", formData);
    if (res?.error) {
      console.log(res);
      if (res.error == "CredentialsSignin") {
        console.log("first");
        toast("Incorrect Credentials.");
      } else {
        toast("Uh oh! Something went wrong.", {
          description: "Try again in sometime",
        });
      }
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          {/* <CardDescription>
            Login with your Apple or Google account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        email: e.target.value,
                      }));
                    }}
                    id="login-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        password: e.target.value,
                      }));
                    }}
                    placeholder="*******"
                    id="login-password"
                    type="password"
                    required
                  />
                </div>
                <Button
                  disabled={formData.email == "" || formData.password == ""}
                  type="submit"
                  className="w-full cursor-pointer disabled:opacity-50"
                >
                  Login
                  {loading ? <LoadingSpinner /> : <></>}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  id="signup"
                  href="/signup"
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
