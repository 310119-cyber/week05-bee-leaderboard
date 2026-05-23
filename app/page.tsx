"use client";

import { useEffect, useState } from "react";

interface Score {
  id: string;
  name: string;
  score: number;
  date: string;
}

export default function Home() {
  const [scores, setScores] = useState<Score[]>([]);
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // 載入時取得排行榜資料
  useEffect(() => {
    async function loadScores() {
      try {
        const res = await fetch("/api/scores");
        if (res.ok) {
          const data = await res.json();
          setScores(data);
        } else {
          console.error("無法取得分數");
        }
      } catch (err) {
        console.error("連線 API 出錯", err);
      } finally {
        setLoading(false);
      }
    }
    loadScores();
  }, []);

  // 送出表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage({ text: "⚠️ 請輸入玩家名稱！", isError: true });
      return;
    }

    const scoreNum = Number(score);
    if (score === "" || isNaN(scoreNum) || scoreNum < 0) {
      setMessage({ text: "⚠️ 請輸入大於等於 0 的整數分數！", isError: true });
      return;
    }

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          score: scoreNum,
        }),
      });

      if (res.ok) {
        const updatedScores = await res.json();
        setScores(updatedScores);
        setName("");
        setScore("");
        setMessage({ text: "🎉 登記成功！你太棒了！", isError: false });
        // 3 秒後自動清除訊息
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errData = await res.json();
        setMessage({ text: `⚠️ ${errData.error || "送出失敗"}`, isError: true });
      }
    } catch (err) {
      setMessage({ text: "⚠️ 無法連線至伺服器", isError: true });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* 可愛蜂巢背景裝飾 */}
      <div className="honeycomb-pattern absolute inset-0 pointer-events-none" />

      <main className="relative max-w-4xl mx-auto z-10">
        {/* 標題區 */}
        <div className="text-center mb-10">
          <div className="inline-block bee-float text-6xl mb-4">
            🐝
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-900 tracking-tight drop-shadow-sm">
            小蜜蜂嗡嗡排行榜
          </h1>
          <p className="mt-2 text-md text-amber-800 font-semibold pulse-soft">
            快來挑戰，留下你的最高分紀錄吧！🍯🌻
          </p>
        </div>

        {/* 主要內容：左右並排（大螢幕）或上下排列（小螢幕） */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* 左側：登錄分數表單 */}
          <div className="md:col-span-5">
            <div className="game-card p-6 bg-amber-50">
              <h2 className="text-2xl font-bold text-amber-950 mb-6 flex items-center gap-2">
                <span>📝</span> 登錄成績
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name-input" className="text-sm font-bold text-amber-900">
                    🐝 玩家名稱
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    placeholder="輸入玩家代號..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="game-input text-amber-950 font-bold"
                    maxLength={15}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="score-input" className="text-sm font-bold text-amber-900">
                    🍯 獲得分數
                  </label>
                  <input
                    id="score-input"
                    type="number"
                    placeholder="例如：5000"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="game-input text-amber-950 font-bold"
                    min="0"
                  />
                </div>

                <button
                  type="submit"
                  className="game-button w-full py-3 mt-4 text-lg font-bold flex items-center justify-center gap-2"
                >
                  <span>🍯</span> 送出分數
                </button>
              </form>

              {/* 狀態訊息提示 */}
              {message && (
                <div
                  className={`mt-4 p-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                    message.isError
                      ? "bg-red-50 text-red-700 border-red-400"
                      : "bg-green-50 text-green-700 border-green-400"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </div>

          {/* 右側：排行榜顯示 */}
          <div className="md:col-span-7">
            <div className="game-card p-6 bg-white">
              <h2 className="text-2xl font-bold text-amber-950 mb-6 flex items-center gap-2">
                <span>🏆</span> 嗡嗡高手榜
              </h2>

              {loading ? (
                <div className="text-center py-10 text-amber-800 font-bold pulse-soft">
                  正在讀取排行榜中... 🍯
                </div>
              ) : scores.length === 0 ? (
                <div className="text-center py-10 text-amber-800 font-bold">
                  目前還沒有成績喔，快來當第一隻小蜜蜂吧！🐝
                </div>
              ) : (
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {scores.map((item, index) => {
                    // 前三名名次勳章
                    const getRankBadge = (rank: number) => {
                      if (rank === 0) return "🥇";
                      if (rank === 1) return "🥈";
                      if (rank === 2) return "🥉";
                      return `${rank + 1}.`;
                    };

                    // 前三名底色樣式
                    const getRankBg = (rank: number) => {
                      if (rank === 0) return "bg-amber-100 border-amber-400 text-amber-950";
                      if (rank === 1) return "bg-slate-100 border-slate-300 text-slate-900";
                      if (rank === 2) return "bg-orange-50 border-orange-300 text-orange-950";
                      return "bg-amber-50/30 border-gray-200 text-gray-800";
                    };

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 font-bold transition-all hover:scale-[1.01] ${getRankBg(
                          index
                        )}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl w-8 text-center flex items-center justify-center">
                            {getRankBadge(index)}
                          </span>
                          <span className="truncate max-w-[120px] sm:max-w-[200px]">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-600 font-extrabold text-lg">
                            {item.score.toLocaleString()}
                          </span>
                          <span className="text-xs text-amber-900/60 font-normal hidden sm:inline">
                            分
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 底部裝飾 */}
        <footer className="mt-12 text-center text-sm font-semibold text-amber-800/80">
          蜂巢系統運作中 • 開發學習專案 🌻🐝
        </footer>
      </main>
    </div>
  );
}
