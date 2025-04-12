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
import { use, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import { createUser } from "~/app/api/manageUser";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isTeacher: false,
    password: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const resUser = await createUser(formData);
    if (resUser) {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (res?.status == 200) {
        router.push("/");
      } else if (res?.status == 401) {
        toast("Incorrect Credentials.");
        setLoading(false);
      } else {
        toast("Uh oh! Something went wrong.", {
          description: "Try again in sometime",
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Join Us</CardTitle>
          {/* <CardDescription>Sign Up with your Google account</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      onChange={(e) => {
                        setFormData((prevState) => ({
                          ...prevState,
                          name: e.target.value,
                        }));
                      }}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      onChange={(e) => {
                        setFormData((prevState) => ({
                          ...prevState,
                          email: e.target.value,
                        }));
                      }}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="name">User Type</Label>
                  <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                    <Switch
                      className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                      aria-describedby={`student-description`}
                    />
                    <div className="flex grow items-center gap-3">
                      <svg
                        className="shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        width={32}
                        height={32}
                        aria-hidden="true"
                      >
                        <circle cx="16" cy="16" r="16" fill="#121212" />
                        <g clipPath="url(#sb-a)">
                          <path
                            fill="url(#sb-b)"
                            d="M17.63 25.52c-.506.637-1.533.287-1.545-.526l-.178-11.903h8.003c1.45 0 2.259 1.674 1.357 2.81l-7.637 9.618Z"
                          />
                          <path
                            fill="url(#sb-c)"
                            fillOpacity=".2"
                            d="M17.63 25.52c-.506.637-1.533.287-1.545-.526l-.178-11.903h8.003c1.45 0 2.259 1.674 1.357 2.81l-7.637 9.618Z"
                          />
                          <path
                            fill="#3ECF8E"
                            d="M14.375 6.367c.506-.638 1.532-.289 1.544.525l.078 11.903H8.094c-1.45 0-2.258-1.674-1.357-2.81l7.638-9.618Z"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="sb-b"
                            x1="15.907"
                            x2="23.02"
                            y1="15.73"
                            y2="18.713"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#249361" />
                            <stop offset="1" stopColor="#3ECF8E" />
                          </linearGradient>
                          <linearGradient
                            id="sb-c"
                            x1="12.753"
                            x2="15.997"
                            y1="11.412"
                            y2="17.519"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop />
                            <stop offset="1" stopOpacity="0" />
                          </linearGradient>
                          <clipPath id="sb-a">
                            <path fill="#fff" d="M6.354 6h19.292v20H6.354z" />
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="grid grow gap-2">
                        <Label htmlFor={"student"}>
                          Student{" "}
                          <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                            (For Learning)
                          </span>
                        </Label>
                        <p
                          id={`student-description`}
                          className="text-muted-foreground text-xs"
                        >
                          This is for students to learn and grow. You can access
                          all content provided by your teachers.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                    <Switch
                      className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                      aria-describedby={`student-description`}
                    />
                    <div className="flex grow items-center gap-3">
                      <svg
                        className="shrink-0"
                        width={32}
                        height={24}
                        viewBox="0 0 32 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <rect width="32" height="24" rx="4" fill="#252525" />
                        <path
                          d="M19.0537 6.49742H12.9282V17.5026H19.0537V6.49742Z"
                          fill="#FF5A00"
                        />
                        <path
                          d="M13.3359 12C13.3359 9.76408 14.3871 7.77961 16 6.49741C14.8129 5.56408 13.3155 5 11.6822 5C7.81295 5 4.68221 8.13074 4.68221 12C4.68221 15.8693 7.81295 19 11.6822 19C13.3155 19 14.8129 18.4359 16 17.5026C14.3848 16.2385 13.3359 14.2359 13.3359 12Z"
                          fill="#EB001B"
                        />
                        <path
                          d="M27.3178 12C27.3178 15.8693 24.1871 19 20.3178 19C18.6845 19 17.1871 18.4359 16 17.5026C17.6333 16.2181 18.6641 14.2359 18.6641 12C18.6641 9.76408 17.6129 7.77961 16 6.49741C17.1848 5.56408 18.6822 5 20.3155 5C24.1871 5 27.3178 8.15113 27.3178 12Z"
                          fill="#F79E1B"
                        />
                      </svg>
                      <div className="grid grow gap-2">
                        <Label htmlFor={"student"}>
                          Teachers{" "}
                          <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                            (For Teaching)
                          </span>
                        </Label>
                        <p
                          id={`student-description`}
                          className="text-muted-foreground text-xs"
                        >
                          This is for teachers to teach and grow. You can create
                          content and manage your students.
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="name">User Type</Label>

                  <div className="grid sm:grid-cols-2 gap-2">
                    {/* Student Switch */}
                    <div
                      className={`border-input ${
                        !formData.isTeacher ? "border-primary/50" : ""
                      } relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none`}
                    >
                      <Switch
                        checked={!formData.isTeacher}
                        onCheckedChange={(checked: boolean) => {
                          setFormData((prev) => ({
                            ...prev,
                            isTeacher: checked,
                          }));
                        }}
                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                        aria-describedby="student-description"
                      />
                      {/* Content remains same */}
                      <div className="flex grow items-center gap-3">
                        {/* SVG and Label */}
                        <svg
                          className="shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          width={32}
                          height={32}
                          aria-hidden="true"
                        >
                          <circle cx="16" cy="16" r="16" fill="#121212" />
                          <g clipPath="url(#sb-a)">
                            <path
                              fill="url(#sb-b)"
                              d="M17.63 25.52c-.506.637-1.533.287-1.545-.526l-.178-11.903h8.003c1.45 0 2.259 1.674 1.357 2.81l-7.637 9.618Z"
                            />
                            <path
                              fill="url(#sb-c)"
                              fillOpacity=".2"
                              d="M17.63 25.52c-.506.637-1.533.287-1.545-.526l-.178-11.903h8.003c1.45 0 2.259 1.674 1.357 2.81l-7.637 9.618Z"
                            />
                            <path
                              fill="#3ECF8E"
                              d="M14.375 6.367c.506-.638 1.532-.289 1.544.525l.078 11.903H8.094c-1.45 0-2.258-1.674-1.357-2.81l7.638-9.618Z"
                            />
                          </g>
                          <defs>
                            <linearGradient
                              id="sb-b"
                              x1="15.907"
                              x2="23.02"
                              y1="15.73"
                              y2="18.713"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#249361" />
                              <stop offset="1" stopColor="#3ECF8E" />
                            </linearGradient>
                            <linearGradient
                              id="sb-c"
                              x1="12.753"
                              x2="15.997"
                              y1="11.412"
                              y2="17.519"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop />
                              <stop offset="1" stopOpacity="0" />
                            </linearGradient>
                            <clipPath id="sb-a">
                              <path fill="#fff" d="M6.354 6h19.292v20H6.354z" />
                            </clipPath>
                          </defs>
                        </svg>
                        <div className="grid grow gap-2">
                          <Label htmlFor="student">
                            Student{" "}
                            <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                              (For Learning)
                            </span>
                          </Label>
                          <p
                            id="student-description"
                            className="text-muted-foreground text-xs"
                          >
                            This is for students to learn and grow. You can
                            access all content provided by your teachers.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Switch */}
                    <div
                      className={`border-input ${
                        formData.isTeacher ? "border-primary/50" : ""
                      } relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none`}
                    >
                      <Switch
                        checked={formData.isTeacher}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              isTeacher: true,
                            }));
                          }
                        }}
                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                        aria-describedby="teacher-description"
                      />
                      <div className="flex grow items-center gap-3">
                        {/* SVG and Label */}
                        <svg
                          className="shrink-0"
                          width={32}
                          height={24}
                          viewBox="0 0 32 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <rect width="32" height="24" rx="4" fill="#252525" />
                          <path
                            d="M19.0537 6.49742H12.9282V17.5026H19.0537V6.49742Z"
                            fill="#FF5A00"
                          />
                          <path
                            d="M13.3359 12C13.3359 9.76408 14.3871 7.77961 16 6.49741C14.8129 5.56408 13.3155 5 11.6822 5C7.81295 5 4.68221 8.13074 4.68221 12C4.68221 15.8693 7.81295 19 11.6822 19C13.3155 19 14.8129 18.4359 16 17.5026C14.3848 16.2385 13.3359 14.2359 13.3359 12Z"
                            fill="#EB001B"
                          />
                          <path
                            d="M27.3178 12C27.3178 15.8693 24.1871 19 20.3178 19C18.6845 19 17.1871 18.4359 16 17.5026C17.6333 16.2181 18.6641 14.2359 18.6641 12C18.6641 9.76408 17.6129 7.77961 16 6.49741C17.1848 5.56408 18.6822 5 20.3155 5C24.1871 5 27.3178 8.15113 27.3178 12Z"
                            fill="#F79E1B"
                          />
                        </svg>
                        <div className="grid grow gap-2">
                          <Label htmlFor="teacher">
                            Teacher{" "}
                            <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                              (For Teaching)
                            </span>
                          </Label>
                          <p
                            id="teacher-description"
                            className="text-muted-foreground text-xs"
                          >
                            This is for teachers to teach and grow. You can
                            create content and manage your students.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        password: e.target.value,
                      }));
                    }}
                    placeholder="******"
                    id="password"
                    type="password"
                    required
                  />
                </div>
                <Button
                  disabled={
                    formData.name == "" ||
                    formData.email == "" ||
                    formData.password == ""
                  }
                  type="submit"
                  className="w-full cursor-pointer disabled:opacity-50"
                >
                  Sign Up
                  {loading ? <LoadingSpinner /> : <></>}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
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
