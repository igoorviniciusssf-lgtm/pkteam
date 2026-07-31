import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { expiresAt: 'asc' },
    });
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar jogadores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nick, days = 7 } = body;

    if (!nick) {
      return NextResponse.json({ error: 'Nick é obrigatório' }, { status: 400 });
    }

    const expiresAt = addDays(new Date(), Number(days));

    const player = await prisma.player.upsert({
      where: { nick },
      update: { expiresAt },
      create: { nick, expiresAt },
    });

    return NextResponse.json(player);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Jogador já cadastrado' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro ao adicionar jogador' }, { status: 500 });
  }
}
