import { NextResponse } from 'next/server';

// 玩家分數資料格式
export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  date: string;
}

// 在記憶體中暫存排行榜資料（重新整理伺服器時會重置）
let leaderboard: ScoreEntry[] = [
  { id: '1', name: '🐝 QueenBee', score: 9999, date: new Date().toISOString() },
  { id: '2', name: '🌻 HoneyBee', score: 8500, date: new Date().toISOString() },
  { id: '3', name: '🌸 WorkerBee', score: 6200, date: new Date().toISOString() },
];

// GET: 取得排行榜資料（依分數由高到低排序）
export async function GET() {
  const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
  return NextResponse.json(sorted);
}

// POST: 送出新的分數資料
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, score } = body;

    // 簡單的資料驗證
    if (!name || typeof score !== 'number' || isNaN(score)) {
      return NextResponse.json(
        { error: '請輸入有效的名字與分數！' },
        { status: 400 }
      );
    }

    const newEntry: ScoreEntry = {
      id: Date.now().toString(),
      name: String(name).trim(),
      score: Number(score),
      date: new Date().toISOString(),
    };

    leaderboard.push(newEntry);

    // 重新排序並回傳更新後的排行榜
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json(
      { error: '伺服器接收資料出錯' },
      { status: 500 }
    );
  }
}
