import React, { type ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Settings2, Sparkles, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SubHero = () => {
  return (
    <>
      <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
        <div className="@container mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
              Built for Accessibility and Engagement
            </h2>
            <p className="mt-4">
              Our platform is designed to provide a seamless and user-friendly
              experience, making it easy for students to access course
              materials, interact with their peers, and receive personalized
              feedback from their instructors.
            </p>
          </div>
          <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
            <Card className="group shadow-zinc-950/5">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Zap className="size-6" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 font-medium">Fun</h3>
              </CardHeader>

              <CardContent>
                <p className="text-sm">
                  Extensive customization options, allowing you to tailor every
                  aspect to meet your specific needs.
                </p>
              </CardContent>
            </Card>

            <Card className="group shadow-zinc-950/5">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Settings2 className="size-6" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 font-medium">Educative</h3>
              </CardHeader>

              <CardContent>
                <p className="mt-3 text-sm">
                  From design elements to functionality, you have complete
                  control to create a unique and personalized experience.
                </p>
              </CardContent>
            </Card>

            <Card className="group shadow-zinc-950/5">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Sparkles className="size-6" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 font-medium">Powered By Q-Learning</h3>
              </CardHeader>

              <CardContent>
                <p className="mt-3 text-sm">
                  Elements to functionality, you have complete control to create
                  a unique experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
            <h2 className="text-4xl font-medium lg:text-5xl">
              Built for Education
            </h2>
            <p>
              To make learning more accessible and engaging, we have created a
              platform that is tailored to the needs of students and educators
              alike.
            </p>
          </div>

          <div className="grid gap-4 [--color-card:var(--color-muted)] *:border-none *:shadow-none sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2 dark:[--color-muted:var(--color-zinc-900)]">
            <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
              <CardHeader>
                <img
                  className="h-6 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nike.svg"
                  alt="Nike Logo"
                  height="24"
                  width="auto"
                />
              </CardHeader>
              <CardContent>
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p className="text-xl font-medium">
                    I am very satisfied with the quality of the templates and
                    the support provided by QConnect.
                  </p>

                  <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarImage
                        src="https://tailus.io/images/reviews/shekinah.webp"
                        alt="Shekinah Tshiokufila"
                        height="400"
                        width="400"
                        loading="lazy"
                      />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>

                    <div>
                      <cite className="text-sm font-medium">
                        Shekinah Tshiokufila
                      </cite>
                      <span className="text-muted-foreground block text-sm">
                        Software Ingineer
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardContent className="h-full pt-6">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p className="text-xl font-medium">
                    Tailus is really extraordinary and very practical, no need
                    to break your head. A real gold mine.
                  </p>

                  <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarImage
                        src="https://tailus.io/images/reviews/jonathan.webp"
                        alt="Jonathan Yombo"
                        height="400"
                        width="400"
                        loading="lazy"
                      />
                      <AvatarFallback>JY</AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-medium">
                        Jonathan Yombo
                      </cite>
                      <span className="text-muted-foreground block text-sm">
                        Software Ingineer
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="h-full pt-6">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p>
                    Great work on tailfolio template. This is one of the best
                    personal website that I have seen so far!
                  </p>

                  <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                    <Avatar className="size-12">
                      <AvatarImage
                        src="https://tailus.io/images/reviews/yucel.webp"
                        alt="Yucel Faruksahan"
                        height="400"
                        width="400"
                        loading="lazy"
                      />
                      <AvatarFallback>YF</AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-medium">
                        Yucel Faruksahan
                      </cite>
                      <span className="text-muted-foreground block text-sm">
                        Creator, Tailkits
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
            <Card className="card variant-mixed">
              <CardContent className="h-full pt-6">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p>
                    Great work on tailfolio template. This is one of the best
                    personal website that I have seen so far!
                  </p>

                  <div className="grid grid-cols-[auto_1fr] gap-3">
                    <Avatar className="size-12">
                      <AvatarImage
                        src="https://tailus.io/images/reviews/rodrigo.webp"
                        alt="Rodrigo Aguilar"
                        height="400"
                        width="400"
                        loading="lazy"
                      />
                      <AvatarFallback>YF</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Rodrigo Aguilar</p>
                      <span className="text-muted-foreground block text-sm">
                        Creator, TailwindAwesome
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};
export default SubHero;

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="bg-radial to-background absolute inset-0 from-transparent to-75%"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
