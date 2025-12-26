import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ToWords } from 'to-words';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function convertToWords(amount: number, currency: 'USD' | 'IDR' = 'USD') {
    const currencyOptions = currency === 'IDR' ? {
        name: 'Rupiah',
        plural: 'Rupiah',
        symbol: 'Rp',
        fractionalUnit: {
            name: 'Sen',
            plural: 'Sen',
            symbol: '',
        },
    } : {
        name: 'Dollar',
        plural: 'Dollars',
        symbol: '$',
        fractionalUnit: {
            name: 'Cent',
            plural: 'Cents',
            symbol: '',
        },
    };

    const converter = new ToWords({
        localeCode: 'en-US',
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
            currencyOptions: currencyOptions
        }
    });

    return 'Say : ' + converter.convert(amount);
}

export function formatDate(date: Date | string) {
    if (!date) return '';
    const d = new Date(date);
    // Format: Dec 09, 2025
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}
