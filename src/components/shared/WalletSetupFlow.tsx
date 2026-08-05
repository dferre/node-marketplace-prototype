import {
  Button,
  Checkbox,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@relume_io/relume-ui";
import { useMemo, useState } from "react";
import {
  PROTOTYPE_RECOVERY_PHRASE,
  buildRecoveryConfirmChallenges,
  createFreshWalletFixture,
  createImportedWalletFixture,
  validatePrivateKey,
  validateRecoveryPhrase,
  type WalletFixture,
  type WalletSetupContext,
} from "../../data/wallet";
import { walletIcons } from "../../icons/iconMap";

export type WalletSetupStep =
  | "setup"
  | "create-reveal"
  | "create-confirm"
  | "import";

type WalletSetupFlowProps = {
  context: WalletSetupContext;
  step: WalletSetupStep;
  onStepChange: (step: WalletSetupStep) => void;
  onComplete: (wallet: WalletFixture, kind: "created" | "imported") => void;
  onCancel: () => void;
  showToast: (message: string) => void;
};

function SetupHeader({
  title,
  description,
  onBack,
}: {
  title: string;
  description: string;
  onBack: () => void;
}) {
  const BackIcon = walletIcons.back;
  return (
    <div className="flex items-start gap-2">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="touch-target shrink-0"
        onClick={onBack}
        aria-label="Back"
      >
        <BackIcon pack="basic" size="sm" aria-hidden="true" />
      </Button>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

export function WalletSetupFlow({
  context,
  step,
  onStepChange,
  onComplete,
  onCancel,
  showToast,
}: WalletSetupFlowProps) {
  const CreateIcon = walletIcons.create;
  const KeyIcon = walletIcons.key;
  const ShieldIcon = walletIcons.shield;
  const WarningIcon = walletIcons.warning;
  const CopyIcon = walletIcons.copy;
  const CheckIcon = walletIcons.check;

  const phrase = PROTOTYPE_RECOVERY_PHRASE;
  const challenges = useMemo(
    () => buildRecoveryConfirmChallenges(phrase),
    [phrase],
  );

  const [savedAck, setSavedAck] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [importMode, setImportMode] = useState<"phrase" | "private-key">(
    "phrase",
  );
  const [phraseInput, setPhraseInput] = useState("");
  const [privateKeyInput, setPrivateKeyInput] = useState("");
  const [importAck, setImportAck] = useState(false);

  const copyPhrase = async () => {
    try {
      await navigator.clipboard.writeText(phrase.join(" "));
      showToast("Recovery phrase copied (prototype)");
    } catch {
      showToast("Could not copy recovery phrase");
    }
  };

  const continueFromReveal = () => {
    if (!savedAck) {
      showToast("Confirm you saved the recovery phrase");
      return;
    }
    setAnswers({});
    onStepChange("create-confirm");
  };

  const finishCreate = () => {
    const allMatch = challenges.every(
      (challenge) => answers[challenge.index] === challenge.word,
    );
    if (!allMatch) {
      showToast("Select the correct recovery words to continue");
      return;
    }
    onComplete(createFreshWalletFixture(context), "created");
  };

  const finishImport = () => {
    if (!importAck) {
      showToast("Confirm you control this wallet");
      return;
    }
    if (importMode === "phrase") {
      const result = validateRecoveryPhrase(phraseInput);
      if (!result.ok) {
        showToast(result.message ?? "Invalid recovery phrase");
        return;
      }
    } else {
      const result = validatePrivateKey(privateKeyInput);
      if (!result.ok) {
        showToast(result.message ?? "Invalid private key");
        return;
      }
    }
    onComplete(createImportedWalletFixture(context), "imported");
  };

  if (step === "setup") {
    return (
      <div className="flex flex-col gap-5" data-testid="wallet-setup-panel">
        <SetupHeader
          title="Set up a wallet"
          description="Create a new payout wallet or import one you already control. Simulated only — nothing is stored on-chain."
          onBack={onCancel}
        />

        <div className="flex flex-col gap-3">
          <button
            type="button"
            data-testid="wallet-setup-create"
            className="flex w-full items-start gap-3 rounded-md border border-border-primary bg-background-primary p-4 text-left shadow-border hover:bg-background-secondary"
            onClick={() => {
              setSavedAck(false);
              onStepChange("create-reveal");
            }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background-secondary text-text-primary">
              <CreateIcon pack="basic" size="sm" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-text-primary">
                Create a new wallet
              </span>
              <span className="mt-1 block text-sm text-text-secondary">
                Generate a recovery phrase, back it up, then confirm the words.
              </span>
            </span>
          </button>

          <button
            type="button"
            data-testid="wallet-setup-import"
            className="flex w-full items-start gap-3 rounded-md border border-border-primary bg-background-primary p-4 text-left shadow-border hover:bg-background-secondary"
            onClick={() => {
              setPhraseInput("");
              setPrivateKeyInput("");
              setImportAck(false);
              setImportMode("phrase");
              onStepChange("import");
            }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background-secondary text-text-primary">
              <KeyIcon pack="basic" size="sm" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-text-primary">
                Import an existing wallet
              </span>
              <span className="mt-1 block text-sm text-text-secondary">
                Restore with a 12/24-word recovery phrase or a private key.
              </span>
            </span>
          </button>
        </div>

        <div className="rounded-md border border-border-primary bg-background-secondary p-3">
          <div className="flex items-start gap-2">
            <ShieldIcon pack="basic" size="sm" aria-hidden="true" />
            <p className="text-sm text-text-secondary">
              Prototype wallets never leave this browser session. Do not paste
              real recovery phrases or private keys.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "create-reveal") {
    return (
      <div className="flex flex-col gap-5" data-testid="wallet-create-reveal">
        <SetupHeader
          title="Save your recovery phrase"
          description="Write these 12 words down and store them offline. This is the only time they are shown."
          onBack={() => onStepChange("setup")}
        />

        <div className="rounded-md border border-border-primary bg-background-error p-3">
          <div className="flex items-start gap-2">
            <WarningIcon
              pack="basic"
              size="sm"
              className="text-text-error"
              aria-hidden="true"
            />
            <p className="text-sm text-text-primary">
              Anyone with this phrase can control the wallet. Never share it or
              store it in screenshots/email.
            </p>
          </div>
        </div>

        <ol className="grid grid-cols-2 gap-2 rounded-md border border-border-primary bg-background-secondary p-3 sm:grid-cols-3">
          {phrase.map((word, index) => (
            <li
              key={`${word}-${index}`}
              className="flex items-center gap-2 rounded-sm border border-border-primary bg-background-primary px-2 py-2 font-mono text-sm text-text-primary"
            >
              <span className="w-5 shrink-0 text-text-muted">{index + 1}.</span>
              <span>{word}</span>
            </li>
          ))}
        </ol>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="gap-2 self-start"
          onClick={() => void copyPhrase()}
        >
          <CopyIcon pack="basic" size="sm" aria-hidden="true" />
          Copy phrase
        </Button>

        <label className="flex items-start gap-2 text-sm text-text-primary">
          <Checkbox
            checked={savedAck}
            onCheckedChange={(value) => setSavedAck(value === true)}
            aria-label="I saved my recovery phrase"
          />
          <span>
            I saved my recovery phrase in a secure place and understand it
            cannot be recovered by Node Marketplace.
          </span>
        </label>

        <Button
          type="button"
          size="sm"
          variant="primary"
          disabled={!savedAck}
          onClick={continueFromReveal}
        >
          Continue
        </Button>
      </div>
    );
  }

  if (step === "create-confirm") {
    return (
      <div className="flex flex-col gap-5" data-testid="wallet-create-confirm">
        <SetupHeader
          title="Confirm recovery phrase"
          description="Select the correct word for each position to finish creating the wallet."
          onBack={() => onStepChange("create-reveal")}
        />

        <div className="flex flex-col gap-4">
          {challenges.map((challenge) => (
            <fieldset key={challenge.index} className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-text-primary">
                Word #{challenge.index + 1}
              </legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {challenge.options.map((option) => {
                  const selected = answers[challenge.index] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`rounded-sm border px-3 py-2 text-sm ${
                        selected
                          ? "border-border-alternative bg-background-tertiary font-medium text-text-primary"
                          : "border-border-primary bg-background-primary text-text-secondary hover:bg-background-secondary"
                      }`}
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [challenge.index]: option,
                        }))
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          variant="primary"
          className="gap-2"
          onClick={finishCreate}
        >
          <CheckIcon pack="basic" size="sm" aria-hidden="true" />
          Create wallet
        </Button>
      </div>
    );
  }

  // import
  return (
    <div className="flex flex-col gap-5" data-testid="wallet-import-panel">
      <SetupHeader
        title="Import wallet"
        description="Restore a wallet with a recovery phrase or private key. Prototype validation only."
        onBack={() => onStepChange("setup")}
      />

      <Tabs
        value={importMode}
        onValueChange={(value) =>
          setImportMode(value === "private-key" ? "private-key" : "phrase")
        }
      >
        <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-0 border-b border-border-primary bg-transparent p-0">
          <TabsTrigger
            value="phrase"
            className="rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-2 pt-0 text-sm data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Recovery phrase
          </TabsTrigger>
          <TabsTrigger
            value="private-key"
            className="rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-2 pt-0 text-sm data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Private key
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phrase" className="mt-4 flex flex-col gap-2">
          <Label htmlFor="import-phrase">Recovery phrase</Label>
          <Textarea
            id="import-phrase"
            value={phraseInput}
            onChange={(event) => setPhraseInput(event.target.value)}
            placeholder="orbit node signal vault … (12 or 24 words)"
            rows={4}
            className="font-mono text-sm"
          />
          <p className="text-sm text-text-muted">
            Tip: try the prototype phrase from Create wallet, or any 12 letter
            words.
          </p>
        </TabsContent>

        <TabsContent value="private-key" className="mt-4 flex flex-col gap-2">
          <Label htmlFor="import-private-key">Private key</Label>
          <Input
            id="import-private-key"
            type="password"
            value={privateKeyInput}
            onChange={(event) => setPrivateKeyInput(event.target.value)}
            placeholder="0x… 64 hex characters"
            className="font-mono text-sm"
            autoComplete="off"
          />
        </TabsContent>
      </Tabs>

      <div className="rounded-md border border-border-primary bg-background-secondary p-3">
        <div className="flex items-start gap-2">
          <WarningIcon pack="basic" size="sm" aria-hidden="true" />
          <p className="text-sm text-text-secondary">
            Never import a real production key into this prototype.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-text-primary">
        <Checkbox
          checked={importAck}
          onCheckedChange={(value) => setImportAck(value === true)}
          aria-label="I control this wallet"
        />
        <span>
          I control this wallet and understand import is simulated for the
          prototype.
        </span>
      </label>

      <Button
        type="button"
        size="sm"
        variant="primary"
        disabled={!importAck}
        onClick={finishImport}
      >
        Import wallet
      </Button>
    </div>
  );
}
