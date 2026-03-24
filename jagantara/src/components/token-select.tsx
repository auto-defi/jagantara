"use client";

import { TOKENS } from "@/constants/abi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TokenKey = keyof typeof TOKENS;

export function TokenSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select token",
  disabled,
  className,
}: {
  value: TokenKey;
  onValueChange: (value: TokenKey) => void;
  options: readonly TokenKey[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v as TokenKey)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((key) => {
          const token = TOKENS[key];
          return (
            <SelectItem key={key} value={key}>
              <span className="flex items-center gap-2">
                <span aria-hidden>{token.logo}</span>
                <span>{token.symbol}</span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

