import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={clsx(
                        'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
                        'text-gray-900 placeholder:text-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
                        'disabled:bg-gray-50 disabled:cursor-not-allowed',
                        error
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 hover:border-gray-400',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
