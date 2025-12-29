import { Prisma } from '../generated/prisma/client';

import { prisma } from '@/db/prisma';

const PAGE_SIZE = 10; // przykładowa wartość

export async function getAllProducts({
	query,
	limit = PAGE_SIZE,
	page,
	category,
}: {
	query: string;
	limit?: number;
	page: number;
	category?: string;
}) {
	// Budowanie obiektu WHERE dla Prisma
	const whereClause: Prisma.ProductWhereInput = {};

	// Dodaj filtr wyszukiwania po nazwie
	if (query && query !== 'all') {
		whereClause.name = {
			contains: query,
			mode: 'insensitive', // case-insensitive search
		};
	}

	// Dodaj filtr kategorii (jeśli będzie potrzebny w przyszłości)
	if (category && category !== 'all') {
		whereClause.category = category;
	}

	// Pobierz przefiltrowane produkty
	const data = await prisma.product.findMany({
		where: whereClause,
		orderBy: { createdAt: 'desc' },
		skip: (page - 1) * limit,
		take: limit,
	});

	// ✅ POPRAWKA: Count musi używać tego samego filtra!
	const dataCount = await prisma.product.count({
		where: whereClause,
	});

	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	};
}

// ============================================
// ALTERNATYWNA WERSJA - bardziej czytelna
// ============================================

export async function getAllProductsV2({
	query,
	limit = PAGE_SIZE,
	page,
	category,
}: {
	query: string;
	limit?: number;
	page: number;
	category?: string;
}) {
	// Tworzenie filtrów jako osobne obiekty
	const filters: Prisma.ProductWhereInput[] = [];

	// Filtr wyszukiwania
	if (query && query !== 'all') {
		filters.push({
			name: {
				contains: query,
				mode: 'insensitive',
			},
		});
	}

	// Filtr kategorii
	if (category && category !== 'all') {
		filters.push({
			category: category,
		});
	}

	// Połączenie wszystkich filtrów (AND logic)
	const whereClause: Prisma.ProductWhereInput =
		filters.length > 0 ? { AND: filters } : {};

	// Wykonaj zapytania równolegle dla lepszej wydajności
	const [data, dataCount] = await Promise.all([
		prisma.product.findMany({
			where: whereClause,
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.product.count({
			where: whereClause,
		}),
	]);

	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	};
}
