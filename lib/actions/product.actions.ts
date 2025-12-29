'use server';

import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
// import {  PrismaClient } from "../generated/prisma/client"
import { convertToPlainObject, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { insertProductSchema, updateProductSchema } from '../validators';
import { Prisma } from '../generated/prisma/client';

// Get latest products
export async function getLatestProducts() {
	// const prisma = new PrismaClient();

	const data = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: { createdAt: 'desc' },
	});
	return convertToPlainObject(data);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
	return await prisma.product.findFirst({
		where: { slug: slug },
	});
}
// Get single product by it's ID
export async function getProductById(productId: string) {
	const data = await prisma.product.findFirst({
		where: { id: productId },
	});

	return convertToPlainObject(data);
}

// Get all products
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
	//NOTE:
	// type ProductWhereInput jest AUTO-GENEROWANY przez Prisma na podstawie schema.prisma np: type ProductWhereInput = {
	// id?: StringFilter | string
	// name?: StringFilter | string
	// category?: StringFilter | string
	// price?: FloatFilter | number
	// createdAt?: DateTimeFilter | Date
	// AND?: ProductWhereInput[]
	// OR?: ProductWhereInput[]
	// NOT?: ProductWhereInput[]
	// }

	//NOTE:
	// AND?: ProductWhereInput[]   // Tablica tych samych warunków
	// OR?: ProductWhereInput[]    // Tablica tych samych warunków
	// NOT?: ProductWhereInput[]   // Tablica tych samych warunków
	// Typy są rekurencyjne - AND przyjmuje tablicę ProductWhereInput[], co oznacza, że możesz w środku AND użyć kolejnego AND, OR, NOT itd.  Pozwalają one  budować **bardzo złożone zapytania SQL**

	// NOTE:
	// Prisma.StringFilter czyli type StringFilter = {
	// equals?: string              // dokładne dopasowanie
	// contains?: string            // zawiera tekst (LIKE %text%)
	// startsWith?: string          // zaczyna się od
	// endsWith?: string            // kończy się na
	// mode?: 'default' | 'insensitive'  // case sensitivity
	// not?: StringFilter | string  // negacja
	// in?: string[]               // wartość z listy
	// notIn?: string[]            // wartość spoza listy
	// }
	const queryFilter: Prisma.ProductWhereInput =
		query && query !== 'all'
			? {
					name: {
						contains: query,
						mode: 'insensitive',
					} as Prisma.StringFilter,
				}
			: {};
	const data = await prisma.product.findMany({
		where: {
			...queryFilter,
		},
		orderBy: { createdAt: 'desc' },
		skip: (page - 1) * limit,
		take: limit,
	});

	const dataCount = await prisma.product.count();

	return {
		data,
		totalPages: Math.ceil(dataCount / limit), //TODO: TOTAL PAGES DOESN'T INCLUDE FILTERS - FIX LATER!
	};
}

// Delete a product
export async function deleteProduct(id: string) {
	try {
		const productExists = await prisma.product.findFirst({
			where: { id },
		});

		if (!productExists) throw new Error('Product not found');
		await prisma.product.delete({ where: { id } });

		revalidatePath('/admin/products');
		return { success: true, message: 'Product deleted successfully' };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

// Create a new product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
	try {
		const product = insertProductSchema.parse(data);
		await prisma.product.create({ data: product });

		revalidatePath('/admin/products');
		return { success: true, message: 'Product created successfully' };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
	try {
		const product = updateProductSchema.parse(data);
		const productExists = await prisma.product.findFirst({
			where: { id: product.id },
		});
		if (!productExists) throw new Error('Product not found');

		await prisma.product.update({
			where: { id: product.id },
			data: product,
		});

		revalidatePath('/admin/products');
		return { success: true, message: 'Product updated successfully' };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
