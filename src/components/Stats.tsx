import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { NumberTicker } from "./magicui/number-ticker";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const Stats = () => {
  return (
    <div>
      <section className="mb-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tighter">
          My Stats
        </h1>
        <section className="py-12">
          <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
            <div className="space-y-4">
              <NumberTicker
                value={20}
                className="whitespace-pre-wrap text-5xl font-bold tracking-tighter text-black dark:text-white"
              />
              <p>Questions Attempted</p>
            </div>
            <div className="space-y-4">
              <NumberTicker
                value={3}
                className="whitespace-pre-wrap text-5xl font-bold tracking-tighter text-black dark:text-white"
              />
              <p>Classes</p>
            </div>
            <div className="space-y-4">
              <NumberTicker
                value={5}
                className="whitespace-pre-wrap text-5xl font-bold tracking-tighter text-black dark:text-white"
              />
              <p>Quizzes Attempted</p>
            </div>
          </div>
        </section>
        <div className="grid sm:grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <CardTitle>Performance per Topic</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout="vertical"
                  margin={{
                    right: 16,
                  }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="month"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <XAxis dataKey="desktop" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar
                    dataKey="desktop"
                    layout="vertical"
                    fill="var(--color-green-600)"
                    radius={4}
                  >
                    <LabelList
                      dataKey="month"
                      position="insideLeft"
                      offset={8}
                      fill="var(--color-white)"
                      fontSize={12}
                    />
                    <LabelList
                      dataKey="desktop"
                      position="right"
                      offset={8}
                      className="fill-[--color-white]"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Line Chart</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-green-500)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Stats;
