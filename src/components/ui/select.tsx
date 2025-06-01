// src/components/ui/select.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps {
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onChange?: (value: string) => void;
    label?: string;
    helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
                                                  options,
                                                  value,
                                                  defaultValue,
                                                  placeholder = "Seleccionar...",
                                                  disabled = false,
                                                  error = false,
                                                  className,
                                                  onChange,
                                                  label,
                                                  helperText,
                                              }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === selectedValue);

    useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        setSelectedValue(optionValue);
        setIsOpen(false);
        onChange?.(optionValue);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                    {label}
                </label>
            )}

            <div ref={selectRef} className="relative">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={clsx(
                        "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm",
                        "ring-offset-background placeholder:text-muted-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error ? "border-destructive" : "border-input",
                        className
                    )}
                >
                    <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <svg
                        className={clsx(
                            "h-4 w-4 transition-transform",
                            isOpen && "rotate-180"
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
                        <div className="max-h-60 overflow-auto py-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    disabled={option.disabled}
                                    onClick={() => handleSelect(option.value)}
                                    className={clsx(
                                        "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                                        "disabled:cursor-not-allowed disabled:opacity-50",
                                        selectedValue === option.value && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {error && helperText && (
                <p className="text-sm text-destructive mt-1">{helperText}</p>
            )}
            {!error && helperText && (
                <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
            )}
        </div>
    );
};