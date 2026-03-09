import { useState } from "react";
import CardForm from "@/components/CardForm";
import AsciiCardDisplay from "@/components/AsciiCardDisplay";
import type { CardData } from "@/lib/ascii-card";
import { Terminal, Download } from "lucide-react";

const Index = () => {
  const [cardData, setCardData] = useState<CardData | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 py-6 flex items-center gap-3">
          <Terminal className="w-6 h-6 text-primary text-glow" />
          <h1 className="font-mono-terminal text-xl font-bold text-foreground text-glow">
            TermCard
          </h1>
          <span className="text-xs text-muted-foreground font-mono-terminal ml-auto">
            v1.0.0
          </span>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <p className="font-mono-terminal text-muted-foreground text-sm">
            <span className="text-terminal-prompt">$</span> 터미널 스타일 ASCII 명함 생성기
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <CardForm onGenerate={setCardData} />
          </div>
          <div>
            {cardData ? (
              <AsciiCardDisplay data={cardData} />
            ) : (
              <div className="terminal-window h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center space-y-3">
                  <Terminal className="w-10 h-10 text-muted-foreground mx-auto" />
                  <p className="font-mono-terminal text-sm text-muted-foreground">
                    정보를 입력하고
                    <br />
                    <span className="text-primary">generate</span>를 눌러주세요
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Python CLI section */}
        <div className="mt-16 terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot terminal-dot-red" />
            <div className="terminal-dot terminal-dot-yellow" />
            <div className="terminal-dot terminal-dot-green" />
            <span className="font-mono-terminal text-xs text-muted-foreground ml-2">
              ~/termcard/cli
            </span>
          </div>
          <div className="terminal-body space-y-3">
            <p className="text-foreground font-mono-terminal text-sm font-bold">
              Python CLI로도 사용할 수 있습니다
            </p>
            <pre className="text-xs font-mono-terminal text-foreground bg-muted p-3 rounded-sm overflow-x-auto">
{`# 실행 권한 부여
chmod +x termcard.py

# 실행
./termcard.py --name "홍길동" --title "개발자" --github "gildong" --skills "React,TypeScript"

# 스타일과 테마 선택
./termcard.py --style box --theme cyan --name "Jane" --title "Backend Dev"

# 도움말
./termcard.py --help`}
            </pre>
            <a
              href="/termcard.py"
              download="termcard.py"
              className="btn-terminal-primary inline-flex items-center gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              termcard.py 다운로드
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <p className="font-mono-terminal text-xs text-muted-foreground text-center">
            neofetch 감성의 ASCII 명함 · made with TermCard
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
