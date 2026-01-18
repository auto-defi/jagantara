"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Wallet,
  FileText,
  CheckCircle,
  Info,
  AlertTriangle,
  Hash,
  Clock,
  Send,
  Check,
  Star,
  Crown,
  Building2,
} from "lucide-react";
import { useAccount } from "wagmi";
import ConnectWallet from "@/app/components/ConnectWallet";
import GradientText from "@/components/gradient-text";
import { useInsuranceManager } from "@/hooks/useInsuranceManager";
import PremiumsPage from "./PremiumCards";
import { useDAOGovernance } from "@/hooks/useDAOGovernance";
import { parseTokenAmount } from "@/lib/formatters";
import { useRouter } from "next/navigation";

interface ClaimSubmissionData {
  claimant: string; // address
  coveredAddress: string;
  tier: string;
  title: string;
  reason: string; // detailed reason
  claimType: string;
  amount: string; // amount in USD (will be converted to wei-like format)
  currency: string;
  // Additional fields for better UX (not in smart contract)
  supportingEvidence: string;
  acknowledgments: boolean[];
}

export default function CoverageInterface() {
  const { submitClaim, isSubmitting } = useDAOGovernance();
  const { isConnected, address } = useAccount();
  const { isActive, policy, isActiveLoading } = useInsuranceManager();
  const [userAddress, setUserAddress] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [claimId, setClaimId] = useState<number | null>(null);
  const router = useRouter();
  console.log("POLICY: ", policy);
  const [formData, setFormData] = useState<ClaimSubmissionData>({
    claimant: "",
    coveredAddress: "",
    tier: "",
    reason: "",
    amount: "",
    currency: "USDC",
    claimType: "",
    title: "",
    supportingEvidence: "",
    acknowledgments: [false, false, false, false],
  });

  const premiumTypes = [
    { value: "Tier-1", label: "Jaga Lite" },
    { value: "Tier-2", label: "Jaga Shield" },
    { value: "Tier-3", label: "Jaga Max" },
    { value: "Tier-4", label: "Jaga Enterprise" },
  ];
  const iconMap: Record<string, React.ElementType> = {
    "Jaga Lite": Shield,
    "Jaga Shield": Star,
    "Jaga Max": Crown,
    "Jaga Enterprise": Building2,
  };

  const claimTypesByTier = {
    "Tier-1": ["Failed Token Swaps", "Phishing Scam Reimbursement"],
    "Tier-2": [
      "All Lite coverage",
      "NFT Theft Coverage",
      "Wallet Recovery Assistance",
    ],
    "Tier-3": ["All Shield coverage", "Rug Pull Protection"],
    "Tier-4": [
      "All Max coverage",
      "Exchange / Custodial Insolvency",
      "Major Smart Contract Failures",
    ],
  };

  const acknowledgmentTexts = [
    "I confirm that all information provided is accurate and complete",
    "I understand that this claim will be voted on by DAO members",
    "I agree to provide additional evidence if requested during the voting process",
    "I understand that false claims may result in penalties and loss of coverage",
  ];

  const updateFormData = (field: keyof ClaimSubmissionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAcknowledgment = (index: number, checked: boolean) => {
    const newAcknowledgments = [...formData.acknowledgments];
    newAcknowledgments[index] = checked;
    setFormData((prev) => ({ ...prev, acknowledgments: newAcknowledgments }));
  };

  const handleClaim = async () => {
    await submitClaim(
      formData.reason,
      formData.title,
      formData.claimType,
      parseTokenAmount(formData.amount, 6)
    );
    router.push("/jagadao");
  };

  const isFormValid = () => {
    return (
      formData.reason.trim().length > 50 &&
      formData.amount &&
      Number.parseFloat(formData.amount) > 0 &&
      formData.claimType &&
      formData.title &&
      formData.acknowledgments.every((ack) => ack)
    );
  };

  const tierIndex = Number(policy?.[3]) - 1;
  const currentTier = premiumTypes?.[tierIndex]?.value;

  // Get claim types based on tier
  const availableClaimTypes =
    currentTier &&
    claimTypesByTier[currentTier as keyof typeof claimTypesByTier]
      ? claimTypesByTier[currentTier as keyof typeof claimTypesByTier]
      : [];
  useEffect(() => {
    if (policy && policy.length > 3) {
      const tierIndex = Number(policy[3]) - 1;
      const tier = premiumTypes[tierIndex]?.label || "";

      updateFormData("coveredAddress", policy[2]); // assuming policy[2] is the address
      updateFormData("tier", tier);
    }
  }, [policy]);
  if (isActiveLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <Clock className="h-6 w-6 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">Checking policy status...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isConnected ? (
        isActive ? (
          <>
            <div className=" rounded-2xl">
              <div className="md:mx-10 py-8 ">
                <div className="space-y-6">
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
                    File a Claim
                  </GradientText>
                  {/* Claim Form */}
                  <Card className="bg-[var(--secondary)] border-none">
                    <CardHeader>
                      {/* Title */}
                      <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                        <FileText className="h-5 w-5" />
                        <span>Claim Details</span>
                      </CardTitle>

                      {/* Description */}
                      <CardDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-2 text-sm sm:text-base">
                        <p className="text-muted-foreground">
                          Provide the essential information for your insurance
                          claim. This data will be stored on-chain and voted on
                          by DAO members.
                        </p>
                        <p className="text-right sm:text-left font-medium flex items-center gap-2">
                          {formData.tier &&
                            (() => {
                              const Icon = iconMap[formData.tier];
                              return <Icon className="w-4 h-4 text-blue-500" />;
                            })()}
                          {formData.tier} - {policy[1].toString()} Months
                        </p>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Smart Contract Fields */}
                      <div className="space-y-4">
                        <div className="bg-[var(--third)]/40 p-4 rounded-lg border border-none text-sm md:text-md">
                          <h4 className="font-medium mb-3 flex items-center text-base">
                            <Hash className="h-4 w-4 mr-2" />
                            Smart Contract Data
                          </h4>

                          <div className="space-y-3">
                            {/* Row 1 */}
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <span className="text-[var(--text)]">
                                Claimant Address:
                              </span>
                              <span className="font-mono break-all sm:text-right">
                                {address}
                              </span>
                            </div>

                            {/* Row 2 */}
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <span className="text-[var(--text)]">
                                Cover Wallet Address:
                              </span>
                              <span className="font-mono break-all sm:text-right">
                                {formData.coveredAddress}
                              </span>
                            </div>

                            {/* Row 3 */}
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <span className="text-[var(--text)]">
                                Claim Amount:
                              </span>
                              <span className="font-medium text-green-500 sm:text-right">
                                {formData.amount
                                  ? `${Number.parseFloat(formData.amount).toLocaleString()} ${formData.currency}`
                                  : "Not set"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-1">
                          <div className="space-y-2">
                            <Label htmlFor="title">Claim Title *</Label>
                            <Input
                              id="title"
                              type="text"
                              placeholder="ex. Drained Wallet"
                              value={formData.title}
                              className="w-full bg-[var(--third)]/40 border-none md:text-md text-sm"
                              onChange={(e) =>
                                updateFormData("title", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2 cursor-not-allowed">
                            <Label htmlFor="claim-type">Claim Type *</Label>
                            <Select
                              value={formData.claimType}
                              onValueChange={(value) =>
                                updateFormData("claimType", value)
                              }
                            >
                              <SelectTrigger
                                id="claim-type"
                                className="w-full bg-[var(--third)]/40 border-none cursor-pointer"
                              >
                                <SelectValue placeholder="Select a claim type..." />
                              </SelectTrigger>
                              <SelectContent className="cursor-pointer bg-[var(--third)]">
                                {availableClaimTypes.map((claim) => (
                                  <SelectItem
                                    key={claim}
                                    value={claim}
                                    className="cursor-pointer"
                                  >
                                    {claim}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 cursor-not-allowed">
                            <Label htmlFor="amount">Amount *</Label>
                            <div className="flex flex-row gap-1">
                              <div className="w-24 bg-[var(--third)]/40 border-none text-center flex items-center px-2 rounded-md md:text-md text-sm">
                                <Image
                                  src={"/usdc_logo.png"}
                                  width={50}
                                  height={50}
                                  alt="usdc"
                                  className="object-cover w-6 h-6"
                                />
                                USDC
                              </div>
                              <Input
                                id="amount"
                                type="number"
                                placeholder="How much you want to recover"
                                value={formData.amount}
                                className="w-full bg-[var(--third)]/40 border-none md:text-md text-sm  appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                onChange={(e) =>
                                  updateFormData("amount", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reason">
                            Detailed Reason * (stored as string in contract)
                          </Label>
                          <Textarea
                            id="reason"
                            placeholder="Provide a comprehensive description of your claim. Include details about what happened, when it occurred, which protocols/assets were affected, transaction hashes if available, and any other relevant information that will help DAO members make an informed voting decision..."
                            rows={6}
                            className="bg-[var(--third)]/40 border-none md:text-md text-xs"
                            value={formData.reason}
                            onChange={(e) =>
                              updateFormData("reason", e.target.value)
                            }
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Minimum 50 characters required</span>
                            <span>{formData.reason.length}/1000</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Acknowledgments */}
                      <div className="space-y-4">
                        <Label>Required Acknowledgments *</Label>
                        <div className="space-y-3">
                          {acknowledgmentTexts.map((text, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <Checkbox
                                id={`ack-${index}`}
                                checked={formData.acknowledgments[index]}
                                className="data-[state=checked]:bg-[var(--third)] cursor-pointer"
                                onCheckedChange={(checked) =>
                                  updateAcknowledgment(
                                    index,
                                    checked as boolean
                                  )
                                }
                              />

                              <Label
                                htmlFor={`ack-${index}`}
                                className="text-xs md:text-sm leading-5"
                              >
                                {text}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Alert className="bg-yellow-300/70 text-black border-none md:text-md text-xs">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className=" md:text-md text-xs">
                          <strong>Important:</strong> Once submitted, your claim
                          will be permanently recorded on the blockchain and
                          cannot be modified. DAO members will vote to approve
                          or reject your claim based on the information
                          provided.
                        </AlertDescription>
                      </Alert>

                      <Button
                        onClick={handleClaim}
                        disabled={!isFormValid() || isSubmitting}
                        className="w-full bg-[image:var(--gradient-third)] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Submitting to Blockchain...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Claim to DAO
                          </>
                        )}
                      </Button>

                      {!isFormValid() && (
                        <div className="text-xs md:text-sm text-red-600">
                          <p>Please complete all required fields:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {!formData.claimType && <li>Select claim type</li>}
                            {!formData.title && <li>Set claim title</li>}
                            {!formData.amount && <li>Enter claim amount</li>}
                            {formData.reason.length < 50 && (
                              <li>
                                Provide detailed reason (minimum 50 characters)
                              </li>
                            )}
                            {!formData.acknowledgments.every((ack) => ack) && (
                              <li>Accept all acknowledgments</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Smart Contract Preview */}
                  <Card className="bg-[var(--secondary)] border-none">
                    <CardHeader>
                      <CardTitle className="text-md md:text-lg flex items-center space-x-2">
                        <Hash className="h-5 w-5" />
                        <span>Smart Contract Preview </span>
                      </CardTitle>
                      <CardDescription className="md:text-sm text-xs">
                        Preview of data that will be sent to the ClaimProposal
                        struct
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs md:text-sm break-words md:overflow-x-auto">
                        <div className="space-y-1">
                          <div>
                            <span className="text-blue-400">claimant:</span> "
                            {address}"
                          </div>
                          <div>
                            <span className="text-blue-400">
                              coveredAddress:
                            </span>{" "}
                            "{formData.coveredAddress}"
                          </div>
                          <div>
                            <span className="text-blue-400">tier:</span> "
                            {formData.tier}"
                          </div>
                          <div>
                            <span className="text-blue-400">title:</span> "
                            {formData.title}"
                          </div>
                          <div>
                            <span className="text-blue-400">reason:</span> "
                            {formData.reason}"
                          </div>
                          <div>
                            <span className="text-blue-400">claimType:</span> "
                            {formData.claimType}"
                          </div>
                          <div>
                            <span className="text-blue-400">amount:</span>{" "}
                            {formData.amount}000000n
                          </div>
                          <div className="text-gray-500">
                            // Other fields set by contract:
                          </div>
                          <div className="text-gray-500">
                            // createdAt: block.timestamp
                          </div>
                          <div className="text-gray-500">// yesVotes: 0</div>
                          <div className="text-gray-500">// noVotes: 0</div>
                          <div className="text-gray-500">
                            // status: ClaimStatus.Pending
                          </div>
                          <div className="text-gray-500">// approvedAt: 0</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Show cards to buy premiums
          <div>
            <PremiumsPage />
          </div>
        )
      ) : (
        <div className="flex flex-col justify-center items-center text-center h-[60vh] space-y-6 pt-10">
          <Image
            src="/jagantara_icon.png"
            alt="Jagantara Icon"
            width={150}
            height={150}
            className="animate-pulse"
          />
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Connect Your Wallet
          </h1>
          <p className="text-sm text-muted-foreground max-w-md">
            To file a Claim, please connect your wallet securely and subscribed
            to a premium.
          </p>
          <ConnectWallet />
        </div>
      )}
    </div>
  );
}
