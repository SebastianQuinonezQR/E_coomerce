import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number().int().positive(),
});

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const { categoryId, search, page = '1', limit = '12' } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = parseInt(categoryId as string);
  if (search) where.name = { contains: search as string, mode: 'insensitive' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, skip, take: parseInt(limit as string), orderBy: { createdAt: 'desc' } }),
    prisma.product.count({ where }),
  ]);
  res.json({ products, total, page: parseInt(page as string), pages: Math.ceil(total / parseInt(limit as string)) });
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) }, include: { category: true } });
  if (!product) { res.status(404).json({ message: 'Product not found' }); return; }
  res.json(product);
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ errors: parsed.error.flatten() }); return; }
  const product = await prisma.product.create({ data: parsed.data, include: { category: true } });
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ errors: parsed.error.flatten() }); return; }
  const product = await prisma.product.update({ where: { id: parseInt(req.params.id) }, data: parsed.data, include: { category: true } });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
};
