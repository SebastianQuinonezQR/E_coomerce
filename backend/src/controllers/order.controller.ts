import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.userId },
    include: { items: { include: { product: true } } },
  });
  if (!cart || cart.items.length === 0) {
    res.status(400).json({ message: 'Cart is empty' });
    return;
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: req.userId as number,
      total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  // Clear cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  res.status(201).json(order);
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
};

export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(req.params.id), userId: req.userId },
    include: { items: { include: { product: true } } },
  });
  if (!order) { res.status(404).json({ message: 'Order not found' }); return; }
  res.json(order);
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  const order = await prisma.order.update({
    where: { id: parseInt(req.params.id) },
    data: { status },
    include: { items: { include: { product: true } } },
  });
  res.json(order);
};
