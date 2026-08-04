/**
 * Prototype-only gallery frames and sample operator notes.
 * Not real customer testimonials, press, or production metrics.
 */

export type AppGalleryFrame = {
  id: string;
  title: string;
  caption: string;
  kind: "screenshot" | "diagram" | "marketing";
};

export type AppReview = {
  id: string;
  authorLabel: string;
  nodeContext: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  postedLabel: string;
  helpfulCount: number;
};

export type AppComment = {
  id: string;
  authorLabel: string;
  body: string;
  postedLabel: string;
};

export type AppSocialProof = {
  gallery: AppGalleryFrame[];
  reviews: AppReview[];
  comments: AppComment[];
  averageRating: number;
  reviewCount: number;
};

const defaultGallery = (appName: string): AppGalleryFrame[] => [
  {
    id: "frame-overview",
    title: "Operator overview",
    caption: `${appName} dashboard wireframe — capacity and status at a glance.`,
    kind: "screenshot",
  },
  {
    id: "frame-setup",
    title: "Setup flow",
    caption: "Allocation and wallet setup steps shown as a marketing frame.",
    kind: "marketing",
  },
  {
    id: "frame-architecture",
    title: "How it runs on a node",
    caption: "Simple architecture diagram placeholder for reviewer walkthroughs.",
    kind: "diagram",
  },
];

const atlasProof: AppSocialProof = {
  averageRating: 4.4,
  reviewCount: 3,
  gallery: [
    {
      id: "atlas-capacity",
      title: "Capacity allocation",
      caption: "Choose how much SSD storage Atlas may use on each node.",
      kind: "screenshot",
    },
    {
      id: "atlas-rewards",
      title: "Rewards panel",
      caption: "Estimate vs eligibility called out separately from install fit.",
      kind: "screenshot",
    },
    {
      id: "atlas-network",
      title: "Network contribution",
      caption: "Marketing frame describing encrypted fragment storage.",
      kind: "marketing",
    },
    {
      id: "atlas-diagram",
      title: "Node data path",
      caption: "Wireframe diagram of store → serve → payout reporting.",
      kind: "diagram",
    },
  ],
  reviews: [
    {
      id: "rev-atlas-1",
      authorLabel: "Operator A (prototype sample)",
      nodeContext: "Pro node · United States",
      rating: 5,
      title: "Clear capacity controls",
      body: "Allocation and wallet setup were easy to follow. Reward copy correctly separates estimates from guarantees.",
      postedLabel: "2 weeks ago",
      helpfulCount: 6,
    },
    {
      id: "rev-atlas-2",
      authorLabel: "Operator B (prototype sample)",
      nodeContext: "Cloud node · Canada",
      rating: 4,
      title: "Solid once SSD requirement is met",
      body: "Compatibility messaging about SSD vs HDD saved a bad install. Would like denser retrieval stats later.",
      postedLabel: "1 month ago",
      helpfulCount: 3,
    },
    {
      id: "rev-atlas-3",
      authorLabel: "Operator C (prototype sample)",
      nodeContext: "Enterprise node · Germany",
      rating: 4,
      title: "Good for fleet storage",
      body: "Works across multiple nodes when requirements line up. Continuous-operation note is important.",
      postedLabel: "6 weeks ago",
      helpfulCount: 2,
    },
  ],
  comments: [
    {
      id: "cmt-atlas-1",
      authorLabel: "Reviewer (prototype)",
      body: "Does queued install resume cleanly after an offline Pro node reconnects?",
      postedLabel: "3 days ago",
    },
    {
      id: "cmt-atlas-2",
      authorLabel: "Product (prototype)",
      body: "Yes in this prototype — offline nodes stay visible and queue until recheck.",
      postedLabel: "2 days ago",
    },
  ],
};

const byAppId: Record<string, AppSocialProof> = {
  app_atlas_storage: atlasProof,
};

function buildGenericProof(appId: string, appName: string): AppSocialProof {
  const seed = appId.length % 3;
  return {
    averageRating: 3.8 + seed * 0.2,
    reviewCount: 2,
    gallery: defaultGallery(appName),
    reviews: [
      {
        id: `${appId}-rev-1`,
        authorLabel: "Operator sample (prototype)",
        nodeContext: "Mixed fleet",
        rating: (4 + (seed % 2)) as 4 | 5,
        title: "Useful for scenario review",
        body: `${appName} detail pages expose benefits, requirements, and compatibility without hiding blocked nodes.`,
        postedLabel: "3 weeks ago",
        helpfulCount: 1 + seed,
      },
      {
        id: `${appId}-rev-2`,
        authorLabel: "Stakeholder sample (prototype)",
        nodeContext: "Prototype walkthrough",
        rating: 4,
        title: "Permissions are explicit",
        body: "Accordion permissions and setup notes make the install review conversation easier.",
        postedLabel: "1 month ago",
        helpfulCount: seed,
      },
    ],
    comments: [
      {
        id: `${appId}-cmt-1`,
        authorLabel: "Reviewer (prototype)",
        body: `Any known fleet edge cases for ${appName} we should script in the debugger?`,
        postedLabel: "5 days ago",
      },
    ],
  };
}

export function getAppSocialProof(
  appId: string,
  appName: string,
): AppSocialProof {
  return byAppId[appId] ?? buildGenericProof(appId, appName);
}
