import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object

export function convertToPlainObject<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places

export function formatNumberWithDecimal(num: number): string {
	const [int, decimal] = num.toString().split(".");
	// string.padEnd(docelowaDługość, znakDoPełnienia)
	return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

/**
 * Formatuje różne typy błędów do czytelnych komunikatów
 * @param error - Błąd do sformatowania
 * @returns Sformatowany komunikat błędu
 */

/**
 * Bezpieczna wersja dla klienta - NIE importuje Prisma.
 *  Prisma działa tylko na serwerze, nie może być używana w komponentach klienckich
 * Używaj tego w utils.ts i innych plikach współdzielonych
 */

export function formatError(error: unknown): string {
	console.log("🚀 ~ formatError ~ error:", error);
	// 1. Obsługa błędów walidacji Zod
	if (error instanceof ZodError) {
		const messages = error.issues.map((issue) => {
			console.log("🚀 ~ formatError ~ issue:", issue)
			return `${issue.path.join(".")}: ${issue.message}`;
		});
		console.log("🚀 ~ formatError ~ messages:", messages);
		return messages.join("; ");
	}

	// 2. Obsługa błędów Prisma (sprawdzanie po właściwościach)
	// Nie używamy instanceof, żeby nie importować Prisma
	if (error && typeof error === "object" && "code" in error) {
		//  Operator "in" sprawdza czy klucz istnieje w obiekcie  const obj1 = { code: 'P2002', message: 'Error' }; 'code' in obj1;  // ✅ true
		const prismaError = error as {
			code: string;
			meta?: { target?: string[] };
			message?: string;
		};
		console.log("🚀 ~ formatError ~ prismaError:", prismaError);

		// P2002 - Unique constraint violation
		if (prismaError.code === "P2002") {
			const fields = prismaError.meta?.target;
			const fieldName = fields?.[0] || "Field";
			const capitalizedField =
				fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
			return `${capitalizedField} already exists.`;
		}

		// P2025 - Record not found
		if (prismaError.code === "P2025") {
			return "Record not found.";
		}

		// P2003 - Foreign key constraint failed
		if (prismaError.code === "P2003") {
			return "Related record does not exist.";
		}

		// P2014 - Invalid ID
		if (prismaError.code === "P2014") {
			return "Invalid ID provided.";
		}

		// Inne błędy z kodem
		return prismaError.message || "Database error occurred.";
	}

	// 3. Obsługa standardowych błędów JavaScript
	if (error instanceof Error) {
		return error.message;
	}

	// 4. Obsługa stringów
	if (typeof error === "string") {
		return error;
	}

	// 5. Fallback
	return "An unexpected error occurred.";
}

// Round number to 2 decimal places
export function round2(value: number | string) {
	if (typeof value === "number") {
		return Math.round((value + Number.EPSILON) * 100) / 100; // Epsilon to bardzo mała liczba dodawana, aby uniknąć błędów zaokrągleń
	} else if (typeof value === "string") {
		return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
	} else {
		throw new Error("Invalid value type");
	}
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
	// maximumFractionDigits: 2,
});

// Format currency using the formatter above
export function formatCurrency(amount: number | string | null) {
	if (typeof amount === "number") {
		return CURRENCY_FORMATTER.format(amount);
	} else if (typeof amount === "string") {
		return CURRENCY_FORMATTER.format(Number(amount));
	} else {
		// return CURRENCY_FORMATTER.format(0);
		return "NaN";
	}
}

// Format Number ( to ensure commas is in right place in thousands)
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function formatNumber(number: number) {
	return NUMBER_FORMATTER.format(number);
}

export function formatId(id: string) {
	return `..${id.substring(id.length - 6)}`;
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
	const dateTimeOptions: Intl.DateTimeFormatOptions = {
		month: "short", // abbreviated month name (e.g., 'Oct')
		year: "numeric", // abbreviated month name (e.g., 'Oct')
		day: "numeric", // numeric day of the month (e.g., '25')
		hour: "numeric", // numeric hour (e.g., '8')
		minute: "numeric", // numeric minute (e.g., '30')
		hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
	};
	const dateOptions: Intl.DateTimeFormatOptions = {
		weekday: "short", // abbreviated weekday name (e.g., 'Mon')
		month: "short", // abbreviated month name (e.g., 'Oct')
		year: "numeric", // numeric year (e.g., '2023')
		day: "numeric", // numeric day of the month (e.g., '25')
	};
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: "numeric", // numeric hour (e.g., '8')
		minute: "numeric", // numeric minute (e.g., '30')
		hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
	};
	const formattedDateTime: string = new Date(dateString).toLocaleString(
		"en-US",
		dateTimeOptions
	);
	const formattedDate: string = new Date(dateString).toLocaleString(
		"en-US",
		dateOptions
	);
	const formattedTime: string = new Date(dateString).toLocaleString(
		"en-US",
		timeOptions
	);
	return {
		dateTime: formattedDateTime,
		dateOnly: formattedDate,
		timeOnly: formattedTime,
	};
};

// Form the pagination links
export function formUrlQuery({
	params,
	key,
	value,
}: {
	params: string;
	key: string;
	value: string | null;
}) {
	const query = qs.parse(params);
	query[key] = value;

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query,
		},
		{ skipNull: true }
	);
}
