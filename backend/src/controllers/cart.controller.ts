import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.userId },
    include: { items: { include: { product: true } } },
  });
  res.json(cart || { items: [] });
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) { res.status(400).json({ message: 'productId required' }); return; }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) { res.status(404).json({ message: 'Product not found' }); return; }

  let cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: req.userId as number } });
  }

  const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (existingItem) {
    await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: existingItem.quantity + quantity } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
  }

  const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });
  res.json(updated);
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  const { quantity } = req.body;
  const itemId = parseInt(req.params.itemId);
  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    res.status(204).send();
    return;
  }
  const item = await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  res.json(item);
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  await prisma.cartItem.delete({ where: { id: parseInt(req.params.itemId) } });
  res.status(204).send();
};
