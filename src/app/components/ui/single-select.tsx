"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "./utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

interface SingleSelectComboboxProps {
  options: string[];
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  /** Show a "Clear selection" footer when a value is set (needed for optional fields). */
  allowClear?: boolean;
}

export function SingleSelectCombobox({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  className,
  allowClear = true,
}: SingleSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full min-h-[42px] items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#032EA1]",
            !value && "text-gray-400",
            value && "text-gray-900",
            className
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={false}
        className="z-[200] w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value === option;
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer gap-2"
                  >
                    <span className="flex-1 text-gray-700">{option}</span>
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0 text-[#032EA1]",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        {allowClear && value && (
          <div className="flex items-center justify-end border-t border-gray-100 px-3 py-2">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-xs font-medium text-[#032EA1] hover:underline"
            >
              Clear selection
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
