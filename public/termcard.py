#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["typer>=0.9.0", "rich>=13.0.0"]
# ///

"""
TermCard - 터미널 스타일 ASCII 명함 생성기 (neofetch 감성)
Usage:
  uv run termcard.py --name "홍길동" --title "프론트엔드 개발자" --github "gildong" --skills "React,TypeScript,파이썬"
  uv run termcard.py --style box --theme cyan --name "Jane" --title "Backend Dev"
"""

import unicodedata
from enum import Enum
from typing import Optional

import typer
from rich.console import Console
from rich.text import Text

app = typer.Typer(help="TermCard - 터미널 ASCII 명함 생성기")
console = Console()


class Style(str, Enum):
    neofetch = "neofetch"
    box = "box"
    dotart = "dotart"
    biglogo = "biglogo"


class Theme(str, Enum):
    green = "green"
    cyan = "cyan"
    amber = "amber"
    rose = "rose"
    blue = "blue"
    purple = "purple"


THEMES = {
    "green":  {"fg": "green",         "accent": "bright_green",  "info": "cyan",          "art": "yellow"},
    "cyan":   {"fg": "bright_cyan",   "accent": "cyan",          "info": "bright_magenta","art": "bright_blue"},
    "amber":  {"fg": "yellow",        "accent": "bright_yellow", "info": "bright_red",    "art": "bright_yellow"},
    "rose":   {"fg": "bright_red",    "accent": "red",           "info": "bright_magenta","art": "magenta"},
    "blue":   {"fg": "bright_blue",   "accent": "blue",          "info": "bright_cyan",   "art": "bright_magenta"},
    "purple": {"fg": "bright_magenta","accent": "magenta",       "info": "bright_red",    "art": "bright_magenta"},
}

BLOCK_COLORS = ["red", "bright_red", "yellow", "green", "cyan", "blue", "magenta", "bright_magenta"]


def display_width(s: str) -> int:
    """한글 등 전각 문자를 2칸으로 계산"""
    w = 0
    for ch in s:
        eaw = unicodedata.east_asian_width(ch)
        w += 2 if eaw in ("W", "F") else 1
    return w


def pad(s: str, width: int) -> str:
    w = display_width(s)
    return s + " " * max(0, width - w)


def center_pad(s: str, width: int) -> str:
    w = display_width(s)
    if w >= width:
        return s
    left = (width - w) // 2
    right = width - w - left
    return " " * left + s + " " * right


def color_blocks(t: dict) -> Text:
    """색상 블록 렌더링"""
    text = Text()
    for i, color in enumerate(BLOCK_COLORS):
        if i > 0:
            text.append(" ")
        text.append("███", style=color)
    return text


def generate_box(name: str, title: str, github: str, email: str, website: str, skills: list[str]) -> list[str]:
    INNER = 44
    top = "+" + "-" * (INNER + 2) + "+"
    bottom = top
    empty = "|" + " " * (INNER + 2) + "|"
    divider = "| " + "-" * INNER + " |"

    lines = [top, empty]
    lines.append("| " + center_pad(name, INNER) + " |")
    lines.append("| " + center_pad(title, INNER) + " |")
    lines.extend([empty, divider, empty])

    if github:
        lines.append("| " + pad(f"GitHub: github.com/{github}", INNER) + " |")
    if email:
        lines.append("| " + pad(f"Email: {email}", INNER) + " |")
    if website:
        lines.append("| " + pad(f"Web: {website}", INNER) + " |")
    if skills:
        lines.append("| " + pad(f"Stack: {', '.join(skills)}", INNER) + " |")

    lines.extend([empty, "| " + center_pad("### ### ### ### ### ###", INNER) + " |", empty, bottom])
    return lines


def generate_neofetch(name: str, title: str, github: str, email: str, website: str, skills: list[str]) -> list[str]:
    ascii_art = [
        "   .+------+.   ",
        "   |  ><>   |   ",
        "   |   .--. |   ",
        "   |   |##| |   ",
        "   |   '--' |   ",
        "   |  TERM  |   ",
        "   |  CARD  |   ",
        "   '+------+'   ",
    ]
    info = [name, "-" * display_width(name)]
    if title:
        info.append(f"Title: {title}")
    if github:
        info.append(f"GitHub: github.com/{github}")
    if email:
        info.append(f"Email: {email}")
    if website:
        info.append(f"Web: {website}")
    if skills:
        info.append(f"Stack: {', '.join(skills)}")
    info.append("")
    info.append("### ### ### ### ### ### ### ###")

    max_lines = max(len(ascii_art), len(info))
    result = []
    for i in range(max_lines):
        left = ascii_art[i] if i < len(ascii_art) else " " * 17
        right = info[i] if i < len(info) else ""
        result.append(left + right)
    return result


def generate_dotart(name: str, title: str, github: str, email: str, website: str, skills: list[str]) -> list[str]:
    lines = [
        ". . . . . . . . . . . . . . . .",
        "",
        "    .  . . .  .  ",
        "   . .       . . ",
        "  .    o   o    .",
        "  .      v      .",
        "   . .       . . ",
        "    .  . . .  .  ",
        "",
    ]
    lines.append("  " + center_pad(f"~ {name} ~", 28))
    lines.append("  " + center_pad(title, 28))
    lines.append("")
    if github:
        lines.append(f"  * github.com/{github}")
    if email:
        lines.append(f"  * {email}")
    if website:
        lines.append(f"  * {website}")
    if skills:
        lines.append(f"  * {', '.join(skills)}")
    lines.append("")
    lines.append(". . . . . . . . . . . . . . . .")
    return lines


def generate_biglogo(name: str, title: str, github: str, email: str, website: str, skills: list[str]) -> list[str]:
    INNER = 35
    logo = [
        " ######  ###### ",
        "   ##   ##      ",
        "   ##   ##      ",
        "   ##   ##      ",
        "   ##    ###### ",
    ]
    lines = ["+" + "=" * (INNER + 4) + "+"]
    for row in logo:
        lines.append("|  " + pad(row, INNER) + "  |")
    lines.append("|" + " " * (INNER + 4) + "|")
    lines.append("|  " + pad(name, INNER) + "  |")
    lines.append("|  " + pad(title, INNER) + "  |")
    lines.append("|" + " " * (INNER + 4) + "|")
    lines.append("|  " + pad("-" * INNER, INNER) + "  |")
    lines.append("|" + " " * (INNER + 4) + "|")

    if github:
        lines.append("|  " + pad(f"> github.com/{github}", INNER) + "  |")
    if email:
        lines.append("|  " + pad(f"> {email}", INNER) + "  |")
    if website:
        lines.append("|  " + pad(f"> {website}", INNER) + "  |")
    if skills:
        lines.append("|  " + pad(f"> {' | '.join(skills)}", INNER) + "  |")

    lines.append("|" + " " * (INNER + 4) + "|")
    lines.append("|  " + pad("### ### ### ### ### ###", INNER) + "  |")
    lines.append("|" + " " * (INNER + 4) + "|")
    lines.append("+" + "=" * (INNER + 4) + "+")
    return lines


def render_rich(lines: list[str], style_name: str, theme_name: str) -> None:
    t = THEMES[theme_name]

    for line in lines:
        rich_line = Text()

        if "###" in line and "######" not in line:
            # Color blocks line
            parts = line.split("###")
            for j, part in enumerate(parts):
                rich_line.append(part, style=t["fg"])
                if j < len(parts) - 1:
                    rich_line.append("███", style=BLOCK_COLORS[j % len(BLOCK_COLORS)])
            console.print(rich_line)
            continue

        if style_name == "neofetch":
            art_part = line[:17]
            info_part = line[17:]
            rich_line.append(art_part, style=t["art"])

            # Check for label
            if ": " in info_part and not info_part.startswith("-"):
                colon_idx = info_part.index(": ")
                label = info_part[:colon_idx]
                value = info_part[colon_idx + 2:]
                if label.isalpha():
                    rich_line.append(label, style=f"bold {t['info']}")
                    rich_line.append(": ", style=f"dim {t['fg']}")
                    rich_line.append(value, style=t["fg"])
                else:
                    rich_line.append(info_part, style=f"bold {t['fg']}")
            elif info_part.replace("-", "") == "":
                rich_line.append(info_part, style=f"dim {t['fg']}")
            else:
                rich_line.append(info_part, style=f"bold {t['fg']}")

        elif style_name == "box":
            if line.startswith("+"):
                rich_line.append(line, style=f"dim {t['fg']}")
            elif ": " in line and line.startswith("|"):
                pipe1 = line[0:2]
                rest = line[2:-2]
                pipe2 = line[-2:]
                if ": " in rest:
                    colon_idx = rest.index(": ")
                    label = rest[:colon_idx]
                    value = rest[colon_idx + 2:]
                    rich_line.append(pipe1, style=f"dim {t['fg']}")
                    rich_line.append(label, style=f"bold {t['info']}")
                    rich_line.append(": ", style=f"dim {t['fg']}")
                    rich_line.append(value, style=t["fg"])
                    rich_line.append(pipe2, style=f"dim {t['fg']}")
                else:
                    rich_line.append(line, style=t["fg"])
            elif line.startswith("|"):
                rich_line.append("|", style=f"dim {t['fg']}")
                rich_line.append(line[1:-1], style=t["fg"])
                rich_line.append("|", style=f"dim {t['fg']}")
            else:
                rich_line.append(line, style=t["fg"])

        elif style_name == "dotart":
            if line.startswith("  *"):
                rich_line.append("  *", style=t["info"])
                rich_line.append(line[3:], style=t["fg"])
            elif "o" in line or "v" in line:
                rich_line.append(line, style=t["art"])
            elif "~" in line:
                rich_line.append(line, style=f"bold {t['accent']}")
            else:
                rich_line.append(line, style=f"dim {t['fg']}" if line.strip().replace(".", "").strip() == "" else t["fg"])

        elif style_name == "biglogo":
            if "######" in line:
                rich_line.append(line, style=t["art"])
            elif line.startswith("|") and ">" in line:
                idx = line.index(">")
                rich_line.append(line[:idx], style=f"dim {t['fg']}")
                rich_line.append(">", style=t["info"])
                rich_line.append(line[idx + 1:], style=t["fg"])
            elif line.startswith("+") or "===" in line:
                rich_line.append(line, style=f"dim {t['fg']}")
            else:
                rich_line.append(line, style=t["fg"])

        else:
            rich_line.append(line, style=t["fg"])

        console.print(rich_line)


@app.command()
def generate(
    name: str = typer.Option(..., "--name", "-n", help="이름"),
    title: str = typer.Option("Developer", "--title", "-t", help="직함"),
    github: str = typer.Option("", "--github", "-g", help="GitHub 사용자명"),
    email: str = typer.Option("", "--email", "-e", help="이메일"),
    website: str = typer.Option("", "--web", "-w", help="웹사이트 URL"),
    skills: str = typer.Option("", "--skills", "-s", help="기술 스택 (쉼표 구분)"),
    style: Style = typer.Option(Style.neofetch, "--style", help="카드 스타일"),
    theme: Theme = typer.Option(Theme.green, "--theme", help="색상 테마"),
    plain: bool = typer.Option(False, "--plain", help="색상 없이 텍스트만 출력"),
):
    """터미널 스타일 ASCII 명함을 생성합니다."""
    skill_list = [s.strip() for s in skills.split(",") if s.strip()] if skills else []

    generators = {
        "neofetch": generate_neofetch,
        "box": generate_box,
        "dotart": generate_dotart,
        "biglogo": generate_biglogo,
    }

    lines = generators[style.value](name, title, github, email, website, skill_list)

    console.print()
    console.print(f"  [dim]$ termcard --generate --style={style.value} --theme={theme.value}[/dim]")
    console.print()

    if plain:
        for line in lines:
            # Replace ### with ███ for plain output too
            print(line.replace("###", "███"))
    else:
        render_rich(lines, style.value, theme.value)

    console.print()


if __name__ == "__main__":
    app()
