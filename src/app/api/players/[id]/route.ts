import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { days = 7 } = body;

    const player = await prisma.player.findUnique({ where: { id } });

    if (!player) {
      return NextResponse.json({ error: 'Jogador não encontrado' }, { status: 404 });
    }

    // Se o plano já expirou, renova a partir de agora, senão adiciona aos dias restantes
    const baseDate = player.expiresAt > new Date() ? player.expiresAt : new Date();
    const newExpiresAt = addDays(baseDate, Number(days));

    const updatedPlayer = await prisma.player.update({
      where: { id },
      data: { expiresAt: newExpiresAt },
    });

    return NextResponse.json(updatedPlayer);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao renovar jogador' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.player.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar jogador' }, { status: 500 });
  }
}
