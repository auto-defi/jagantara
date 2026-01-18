import GradientText from "@/components/gradient-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Percent,
  Calendar,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useMemo } from "react";
import { useStake } from "@/hooks/useJagaStake";
import { useRewardClaimsByUser, useStakesByUser } from "@/hooks/useIndexerData";

import { useAccount } from "wagmi";
import { format } from "date-fns";
import { parseBigIntFromGraphQL } from "@/lib/graphql";
import { formatTokenAmount } from "@/lib/calculations";

type TimeFilter = "7D" | "30D" | "12M";
type StakingData = { date: string; rewards: number; deposits: number };

export default function AnalyticInterface() {
  const { address: userAddress } = useAccount();
  const { currentStake } = useStake();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("12M");

  const { data: rewardClaims, isLoading: loadingRewards } =
    useRewardClaimsByUser(userAddress, 1000);

  const totalRewards = useMemo(() => {
    if (!rewardClaims) return BigInt(0);
    return rewardClaims.reduce(
      (sum, r) => sum + parseBigIntFromGraphQL(r.reward),
      BigInt(0)
    );
  }, [rewardClaims]);

  const groupedRewards = useMemo(() => {
    if (!rewardClaims) return [];

    const buckets: Record<string, number> = {};

    rewardClaims.forEach((r) => {
      const ts = new Date(Number(r.timestamp) * 1000);

      let key: string;
      if (timeFilter === "7D") {
        key = format(ts, "EEE"); // Mon, Tue, etc.
      } else if (timeFilter === "30D") {
        key = `Week ${Math.ceil(ts.getDate() / 7)}`;
      } else {
        key = format(ts, "MMM");
      }

      const current = buckets[key] || 0;
      buckets[key] = current + Number(parseBigIntFromGraphQL(r.reward)) / 1e6;
    });

    const sortOrder =
      timeFilter === "7D"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : timeFilter === "30D"
          ? ["Week 1", "Week 2", "Week 3", "Week 4"]
          : [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

    return sortOrder.map((key) => ({
      date: key,
      rewards: Number(buckets[key] || 0),
      deposits: 0, // future: map stake events
    }));
  }, [rewardClaims, timeFilter]);

  const { data: stakes, isLoading: loadingStakes } = useStakesByUser(
    userAddress,
    1000
  );

  const daySortOrder = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  const groupedDeposits = useMemo(() => {
    if (!stakes) return [];

    const rawBuckets: Record<string, number> = {};

    stakes.forEach((s) => {
      const ts = new Date(Number(s.timestamp) * 1000);

      let key: string;
      if (timeFilter === "7D") {
        key = format(ts, "EEE");
      } else if (timeFilter === "30D") {
        key = `Week ${Math.ceil(ts.getDate() / 7)}`;
      } else {
        key = format(ts, "MMM");
      }

      const amount = Number(parseBigIntFromGraphQL(s.amount)) / 1e6;
      rawBuckets[key] = (rawBuckets[key] || 0) + amount;
    });

    const sortOrder =
      timeFilter === "7D"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : timeFilter === "30D"
          ? ["Week 1", "Week 2", "Week 3", "Week 4"]
          : [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

    // ✅ Make cumulative + sorted
    let cumulative = 0;
    const cumulativeData = sortOrder.map((label) => {
      cumulative += rawBuckets[label] || 0;
      return {
        date: label,
        deposits: cumulative,
      };
    });

    return cumulativeData;
  }, [stakes, timeFilter]);

  const combinedChartData = useMemo(() => {
    const merged = groupedRewards.map((r) => {
      const match = groupedDeposits.find((d) => d.date === r.date);
      return {
        date: r.date,
        rewards: r.rewards,
        deposits: match?.deposits || 0,
      };
    });

    if (timeFilter === "7D") {
      type Day = keyof typeof daySortOrder;
      return merged.sort(
        (a, b) => daySortOrder[a.date as Day] - daySortOrder[b.date as Day]
      );
    }

    return merged;
  }, [groupedRewards, groupedDeposits, timeFilter]);

  const chartConfig = {
    id: "staking-chart",
    color: "var(--primary)",
  } as ChartConfig;

  return (
    <div className="flex flex-col gap-10 h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <GradientText
            colors={[
              "var(--primary)",
              "var(--accent)",
              "var(--primary)",
              "var(--accent)",
            ]}
            animationSpeed={6}
            showBorder={false}
            className="font-normal"
          >
            Analytics
          </GradientText>
          <p className="mx-3">Track your staking rewards and deposits</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 p-1 rounded-lg">
            {["7D", "30D", "12M"].map((period) => (
              <Button
                key={period}
                variant={timeFilter === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeFilter(period as TimeFilter)}
                className={
                  timeFilter === period
                    ? "bg-[var(--accent)] cursor-pointer"
                    : "cursor-pointer hover:bg-[var(--accent)]"
                }
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-[image:var(--gradient-third)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Deposits
            </CardTitle>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 opacity-80" />
              <span className="text-2xl font-bold">
                {Math.round(Number(currentStake) / 1e6).toLocaleString() +
                  " USDC"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 text-sm opacity-90 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5%</span>
              <span className="text-[var(--text)]">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-[image:var(--gradient-third)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Rewards Earned
            </CardTitle>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {/* ${formatTokenAmount(totalRewards, 6, 2)} */}3
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+8.2%</span>
              <span className="text-[var(--text)]">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-[image:var(--gradient-third)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current APY</CardTitle>
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">12.4%</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant="secondary" className="bg-white text-green-600">
              Variable Rate
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-[image:var(--gradient-third)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Days Staked</CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-2xl font-bold">247</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm">Since Jan 2024</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rewards Over Time */}
        <Card className="border-0 shadow-lg bg-[var(--third)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Rewards Over Time
            </CardTitle>
            <CardDescription>
              {timeFilter === "7D"
                ? "Daily rewards"
                : timeFilter === "30D"
                  ? "Weekly rewards"
                  : "Monthly rewards"}{" "}
              earned from staking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart data={groupedRewards} margin={{ left: 12, right: 12 }}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--text)"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "var(--text)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => `$${v}`}
                  tick={{ fill: "var(--text)" }}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Line
                  dataKey="rewards"
                  type="natural"
                  stroke="var(--color-rewards)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--color-rewards)",
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Placeholder for Deposits Chart */}
        <Card className="border-0 shadow-lg bg-[var(--third)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              Total Deposits Growth
            </CardTitle>
            <CardDescription>Cumulative deposits over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                data={combinedChartData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--text)"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "var(--text)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => `$${v.toFixed(0)}`}
                  tick={{ fill: "var(--text)" }}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Line
                  dataKey="deposits"
                  type="natural"
                  stroke="var(--color-deposits)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--color-deposits)",
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
