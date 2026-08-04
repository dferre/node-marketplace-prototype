export type OnboardingFlowId =
  | "account"
  | "new-node"
  | "import-node"
  | "developer";

export type OnboardingFieldType =
  | "text"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "checkbox"
  | "choice";

export type OnboardingField = {
  id: string;
  label: string;
  type: OnboardingFieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string; description?: string }[];
};

export type OnboardingStep = {
  id: string;
  title: string;
  summary: string;
  body?: string[];
  fields?: OnboardingField[];
  /** Optional next-route choices on the final step */
  nextActions?: { id: string; label: string; to: string; primary?: boolean }[];
};

export type OnboardingFlowDefinition = {
  id: OnboardingFlowId;
  title: string;
  description: string;
  estimatedMinutes: number;
  aha: string;
  steps: OnboardingStep[];
};

export const onboardingFlows: OnboardingFlowDefinition[] = [
  {
    id: "account",
    title: "New account",
    description:
      "Create an operator account, verify email, accept terms, and learn the platform basics.",
    estimatedMinutes: 5,
    aha: "You can browse the marketplace and decide whether to register a node next.",
    steps: [
      {
        id: "create-account",
        title: "Create account",
        summary: "Minimal credentials to get into the prototype.",
        body: [
          "Use a work email you can verify. Social login is out of scope for this wireframe.",
        ],
        fields: [
          {
            id: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "operator@example.com",
          },
          {
            id: "password",
            label: "Password",
            type: "password",
            required: true,
            placeholder: "At least 12 characters",
            help: "Prototype only — nothing is stored remotely.",
          },
        ],
      },
      {
        id: "verify-email",
        title: "Verify email",
        summary: "Confirm you control the address before fleet actions.",
        body: [
          "In production this would send a code. Here, enter any 6-digit code to continue.",
        ],
        fields: [
          {
            id: "code",
            label: "Verification code",
            type: "text",
            required: true,
            placeholder: "123456",
          },
        ],
      },
      {
        id: "accept-terms",
        title: "Accept terms",
        summary: "Operator terms and marketplace rules.",
        body: [
          "You are responsible for apps you install and the resources they consume on your nodes.",
        ],
        fields: [
          {
            id: "terms",
            label: "I accept the operator terms and privacy notice",
            type: "checkbox",
            required: true,
          },
        ],
      },
      {
        id: "optional-profile",
        title: "Optional profile setup",
        summary: "Display name and org help teammates recognize you.",
        body: ["Skip anytime — you can finish this later in Settings."],
        fields: [
          {
            id: "displayName",
            label: "Display name",
            type: "text",
            placeholder: "Alex Operator",
          },
          {
            id: "organization",
            label: "Organization",
            type: "text",
            placeholder: "Optional",
          },
        ],
      },
      {
        id: "security-setup",
        title: "Security setup",
        summary: "Turn on an extra check for sensitive fleet actions.",
        body: [
          "Prototype offers a simulated second factor. Production would enroll a real authenticator.",
        ],
        fields: [
          {
            id: "mfa",
            label: "Second-factor preference",
            type: "select",
            required: true,
            options: [
              { value: "later", label: "Set up later" },
              { value: "app", label: "Authenticator app (simulated)" },
              { value: "email", label: "Email codes (simulated)" },
            ],
          },
        ],
      },
      {
        id: "platform-intro",
        title: "Introduction to the platform",
        summary: "Three concepts that unlock the rest of the product.",
        body: [
          "Nodes are machines you operate. Apps run on those nodes and may use CPU, storage, bandwidth, or GPU.",
          "The marketplace helps you discover apps, check compatibility, and install across one or many nodes.",
          "Rewards are estimates with eligibility rules — never guaranteed payouts.",
        ],
      },
      {
        id: "choose-next",
        title: "Choose next action",
        summary: "Pick where you want to go first.",
        body: [
          "Experienced operators can skip into the product. Most new owners should register or import a node next.",
        ],
        nextActions: [
          {
            id: "new-node",
            label: "Register a new node",
            to: "/onboarding/new-node",
            primary: true,
          },
          {
            id: "import-node",
            label: "Import an existing node",
            to: "/onboarding/import-node",
          },
          {
            id: "marketplace",
            label: "Browse marketplace",
            to: "/marketplace",
          },
          {
            id: "overview",
            label: "Go to overview",
            to: "/",
          },
        ],
      },
    ],
  },
  {
    id: "new-node",
    title: "New node owner",
    description:
      "Understand nodes, register one, install software, connect, and set up rewards eligibility.",
    estimatedMinutes: 12,
    aha: "A healthy connected node is ready for marketplace installs.",
    steps: [
      {
        id: "what-node-does",
        title: "What a node does",
        summary: "Your node contributes resources that apps can use.",
        body: [
          "A node runs continuously, reports health, and hosts marketplace apps you approve.",
          "Apps may earn rewards or add functionality — both still consume resources and require permissions.",
        ],
      },
      {
        id: "register-connect",
        title: "Register or connect node",
        summary: "Start from a new registration token.",
        body: [
          "Choose how this prototype should treat the node. Real hardware is not required here.",
        ],
        fields: [
          {
            id: "mode",
            label: "How are you adding this node?",
            type: "choice",
            required: true,
            options: [
              {
                value: "register",
                label: "Register a new node",
                description: "Generate a setup token and install software.",
              },
              {
                value: "connect",
                label: "Connect a prepared node",
                description: "You already installed agent software offline.",
              },
            ],
          },
        ],
      },
      {
        id: "verify-ownership",
        title: "Verify ownership",
        summary: "Prove you control the machine before it joins the fleet.",
        body: ["Enter the ownership challenge code shown on the node console."],
        fields: [
          {
            id: "ownershipCode",
            label: "Ownership code",
            type: "text",
            required: true,
            placeholder: "OWN-XXXX",
          },
        ],
      },
      {
        id: "name-node",
        title: "Name node",
        summary: "A clear name helps when installing across a fleet.",
        fields: [
          {
            id: "nodeName",
            label: "Node name",
            type: "text",
            required: true,
            placeholder: "Denver Node 02",
          },
        ],
      },
      {
        id: "select-location",
        title: "Select location",
        summary: "Region affects some app eligibility rules.",
        fields: [
          {
            id: "region",
            label: "Region",
            type: "select",
            required: true,
            options: [
              { value: "us", label: "United States" },
              { value: "ca", label: "Canada" },
              { value: "de", label: "Germany" },
              { value: "other", label: "Other / unspecified" },
            ],
          },
        ],
      },
      {
        id: "configure-node",
        title: "Configure node",
        summary: "Baseline capacity the marketplace will evaluate against.",
        fields: [
          {
            id: "nodeType",
            label: "Node type",
            type: "select",
            required: true,
            options: [
              { value: "standard", label: "Standard" },
              { value: "pro", label: "Pro" },
              { value: "cloud", label: "Cloud" },
              { value: "enterprise", label: "Enterprise" },
            ],
          },
          {
            id: "storageType",
            label: "Primary storage",
            type: "select",
            required: true,
            options: [
              { value: "ssd", label: "SSD" },
              { value: "hdd", label: "HDD" },
            ],
          },
        ],
      },
      {
        id: "install-software",
        title: "Install node software",
        summary: "Agent package that keeps the node connected.",
        body: [
          "Copy the install command to your machine. In this prototype, mark the step complete when ready.",
        ],
        fields: [
          {
            id: "installAck",
            label: "I ran the install command (or simulated it)",
            type: "checkbox",
            required: true,
          },
        ],
      },
      {
        id: "connect-node",
        title: "Connect node",
        summary: "Bring the agent online to the control plane.",
        body: [
          "Connection uses the registration token from earlier. Offline nodes can still be queued for installs later.",
        ],
        fields: [
          {
            id: "connected",
            label: "Node reports connected",
            type: "checkbox",
            required: true,
          },
        ],
      },
      {
        id: "initial-sync",
        title: "Initial synchronization",
        summary: "Pull capacity, software version, and health baseline.",
        body: [
          "Sync usually finishes in under a minute. Stale telemetry is labeled when data is old.",
        ],
      },
      {
        id: "health-check",
        title: "Node health check",
        summary: "Confirm the node is healthy enough for installs.",
        body: [
          "Healthy means online with fresh telemetry. Degraded nodes stay visible — we do not hide problems.",
        ],
      },
      {
        id: "reward-wallet",
        title: "Reward-wallet setup",
        summary: "Eligibility to earn is separate from install compatibility.",
        body: [
          "You can install apps without a wallet. Earnings stay unavailable until a payout wallet is connected.",
        ],
        fields: [
          {
            id: "wallet",
            label: "Wallet setup",
            type: "choice",
            required: true,
            options: [
              {
                value: "connect",
                label: "Connect wallet now (simulated)",
              },
              {
                value: "later",
                label: "Set up wallet later",
              },
            ],
          },
        ],
      },
      {
        id: "success",
        title: "Onboarding success",
        summary: "Your node is ready for marketplace apps.",
        body: [
          "Next, browse apps and check compatibility before installing across your fleet.",
        ],
        nextActions: [
          {
            id: "marketplace",
            label: "Browse marketplace",
            to: "/marketplace",
            primary: true,
          },
          {
            id: "nodes",
            label: "View My Nodes",
            to: "/nodes",
          },
          {
            id: "import",
            label: "Import another node",
            to: "/onboarding/import-node",
          },
        ],
      },
    ],
  },
  {
    id: "import-node",
    title: "Existing node import",
    description:
      "Bring a node you already operate into this account with ownership verification.",
    estimatedMinutes: 6,
    aha: "An imported node appears in My Nodes with a clear compatibility baseline.",
    steps: [
      {
        id: "enter-identifier",
        title: "Enter node identifier",
        summary: "Use the node ID or claim code from your existing agent.",
        fields: [
          {
            id: "nodeId",
            label: "Node identifier",
            type: "text",
            required: true,
            placeholder: "node_denver_01 or CLAIM-…",
          },
        ],
      },
      {
        id: "verify-ownership",
        title: "Verify ownership",
        summary: "Confirm you still control the node.",
        fields: [
          {
            id: "ownershipCode",
            label: "Ownership challenge",
            type: "text",
            required: true,
            placeholder: "OWN-XXXX",
          },
        ],
      },
      {
        id: "confirm-details",
        title: "Confirm node details",
        summary: "Review the capacity snapshot before connecting.",
        body: [
          "Prototype shows a sample snapshot. Production would load live agent inventory.",
          "Type · Pro · Region · United States · Storage · 2000 GB SSD · Online",
        ],
        fields: [
          {
            id: "confirmDetails",
            label: "These details look correct",
            type: "checkbox",
            required: true,
          },
        ],
      },
      {
        id: "connect-node",
        title: "Connect node",
        summary: "Attach the node to this operator account.",
        fields: [
          {
            id: "connected",
            label: "Connect this node to my fleet",
            type: "checkbox",
            required: true,
          },
        ],
      },
      {
        id: "compatibility-check",
        title: "Compatibility check",
        summary: "See which marketplace apps this node can run today.",
        body: [
          "Compatibility is evaluated per app requirement — CPU, memory, storage type, software version, and more.",
          "Incompatible and offline nodes stay visible so you can fix or queue them.",
        ],
      },
      {
        id: "import-success",
        title: "Import success",
        summary: "The node is in your fleet.",
        body: [
          "Open My Nodes for health detail, or browse the marketplace to install your first app.",
        ],
        nextActions: [
          {
            id: "nodes",
            label: "Open My Nodes",
            to: "/nodes",
            primary: true,
          },
          {
            id: "marketplace",
            label: "Browse marketplace",
            to: "/marketplace",
          },
          {
            id: "new-node",
            label: "Register a new node",
            to: "/onboarding/new-node",
          },
        ],
      },
    ],
  },
];

export const developerOnboardingOutline = [
  "Developer registration",
  "Identity or business verification",
  "Organization setup",
  "Team invites",
  "Developer terms",
  "Payout wallet",
  "First app setup",
  "Package upload",
  "Security requirements",
  "Submission and review",
] as const;

export function getOnboardingFlow(
  flowId: string,
): OnboardingFlowDefinition | undefined {
  return onboardingFlows.find((flow) => flow.id === flowId);
}

export const marketplaceEducationPoints = [
  {
    id: "what-apps",
    title: "What node apps are",
    body: "Apps are packages that run on your nodes to provide rewards, services, or utility.",
  },
  {
    id: "resources",
    title: "Apps may use node resources",
    body: "CPU, memory, storage, bandwidth, and sometimes GPU are consumed while an app runs.",
  },
  {
    id: "rewards-or-function",
    title: "Rewards or functionality",
    body: "Some apps pay estimates for capacity or work; others add operational features without payouts.",
  },
  {
    id: "permissions",
    title: "Apps require permissions",
    body: "You review each permission before install. Later updates may ask again if scopes change.",
  },
  {
    id: "multi-node",
    title: "One or multiple nodes",
    body: "Install on a single node, a selection, or every compatible node in the fleet.",
  },
  {
    id: "not-guaranteed",
    title: "Rewards are not guaranteed",
    body: "Estimates depend on eligibility, uptime, and demand. Compatibility ≠ earning.",
  },
] as const;

export const firstInstallCoachSections = [
  {
    id: "compatibility",
    title: "Compatibility",
    body: "Each node is checked against app requirements. Blocking issues prevent selection; warnings stay visible.",
  },
  {
    id: "resources",
    title: "Resource requirements",
    body: "Compare CPU, memory, storage type/size, bandwidth, and software version before you commit.",
  },
  {
    id: "permissions",
    title: "Permissions",
    body: "Install review lists every permission the app needs. Decline means do not install.",
  },
  {
    id: "scope",
    title: "Installation scope",
    body: "Choose one node, selected nodes, or all compatible nodes. Scope drives progress and results.",
  },
  {
    id: "queued",
    title: "Queued offline installations",
    body: "Offline nodes are not hidden — they can queue and continue when they reconnect.",
  },
  {
    id: "rewards",
    title: "Estimated rewards",
    body: "Estimates are labeled with assumptions. Wallet and eligibility can block earning even when install succeeds.",
  },
  {
    id: "post-install",
    title: "Post-install setup",
    body: "Some apps need allocation, wallet, or restart preferences after the package is running.",
  },
] as const;
