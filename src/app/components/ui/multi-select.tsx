"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

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

interface MultiSelectComboboxProps {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const remove = (value: string, e: React.SyntheticEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left outline-none focus:border-transparent focus:ring-2 focus:ring-[#032EA1]",
            className
          )}
        >
          {selected.length === 0 ? (
            <span className="text-sm text-gray-400">{placeholder}</span>
          ) : (
            selected.map((value) => (
              <span
                key={value}
                className="inline-flex items-center gap-1 rounded-md border border-[#032EA1]/20 bg-[#032EA1]/10 px-2 py-0.5 text-xs font-medium text-[#032EA1]"
              >
                {value}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-[#021c5e]"
                  onClick={(e) => remove(value, e)}
                />
              </span>
            ))
          )}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-gray-400" />
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
                const isSelected = selected.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => toggle(option)}
                    className="cursor-pointer gap-2"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        isSelected
                          ? "border-[#032EA1] bg-[#032EA1] text-white"
                          : "border-gray-300"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="text-gray-700">{option}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        {selected.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2">
            <span className="text-xs text-gray-500">
              {selected.length} selected
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-medium text-[#032EA1] hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
