export const verisureCase = {
  summary: {
    totalCustomers: 3135,
    avgRecommendation: 8.7,
    medianRecommendation: 9,
    npsScore: 58.6,
    cancellationRate: 0.0549,
    onceAndDoneRate: 0.6683,
    avgAlarmTriggers: 2.5,
    avgMaintenances: 0.22
  },

  customerTypes: [
    {
      type: "Residential",
      count: 2981,
      share: 0.9509,
      avgNps: 8.73,
      cancelRate: 0.0547,
      onceAndDoneRate: 0.6733
    },
    {
      type: "Business",
      count: 154,
      share: 0.0491,
      avgNps: 8.44,
      cancelRate: 0.0584,
      onceAndDoneRate: 0.5714
    }
  ],

  npsCategories: [
    {
      category: "Detractors",
      count: 264,
      share: 0.0842,
      cancelRate: 0.3485,
      avgAlarms: 3.15
    },
    {
      category: "Passives",
      count: 769,
      share: 0.2453,
      cancelRate: 0.0494,
      avgAlarms: 2.35
    },
    {
      category: "Promoters",
      count: 2102,
      share: 0.6705,
      cancelRate: 0.02,
      avgAlarms: 2.45
    }
  ],

  alarmBands: [
    {
      band: "0 alarms",
      count: 963,
      share: 0.3072,
      avgNps: 8.69,
      cancelRate: 0.0104,
      onceAndDoneRate: 0.6386
    },
    {
      band: "1-3 alarms",
      count: 1375,
      share: 0.4386,
      avgNps: 8.76,
      cancelRate: 0.0211,
      onceAndDoneRate: 0.7258
    },
    {
      band: "4-6 alarms",
      count: 509,
      share: 0.1624,
      avgNps: 8.79,
      cancelRate: 0.0295,
      onceAndDoneRate: 0.6562
    },
    {
      band: "7-10 alarms",
      count: 202,
      share: 0.0644,
      avgNps: 8.71,
      cancelRate: 0.1931,
      onceAndDoneRate: 0.5297
    },
    {
      band: "11+ alarms",
      count: 86,
      share: 0.0274,
      avgNps: 8.02,
      cancelRate: 0.9186,
      onceAndDoneRate: 0.4767
    }
  ],

  installationImpact: [
    {
      label: "Once & Done = YES",
      count: 2095,
      share: 0.6683,
      avgNps: 8.81,
      cancelRate: 0.0358,
      avgAlarms: 2.32,
      avgMaintenances: 0.0
    },
    {
      label: "Once & Done = NO",
      count: 1040,
      share: 0.3317,
      avgNps: 8.53,
      cancelRate: 0.0933,
      avgAlarms: 2.82,
      avgMaintenances: 0.67
    }
  ],

  riskTiers: [
    { tier: "High", count: 106, share: 0.0338, cancelRate: 0.934 },
    { tier: "Medium", count: 270, share: 0.0861, cancelRate: 0.2593 },
    { tier: "Low", count: 2759, share: 0.8801, cancelRate: 0.0011 }
  ],

  conclusions: [
    "The portfolio is healthy overall, with high satisfaction and low overall churn.",
    "Alarm frequency is the strongest operational predictor of cancellation.",
    "Customers with 11+ alarms show a dramatic churn cliff.",
    "Installation quality matters: non once-and-done customers cancel much more.",
    "The highest-risk segment is small in size but extremely concentrated in churn."
  ]
} as const;

export type VerisureCase = typeof verisureCase;
