"""Split skill knowledge text into overlapping chunks for vector indexing."""

from __future__ import annotations


def chunk_text(text: str, *, max_chars: int = 700, overlap: int = 100) -> list[str]:
    """
    Greedy character windows with overlap. Keeps paragraphs together when possible.
    """
    t = text.strip()
    if not t:
        return []
    if len(t) <= max_chars:
        return [t]

    chunks: list[str] = []
    start = 0
    while start < len(t):
        end = min(start + max_chars, len(t))
        piece = t[start:end]
        if end < len(t):
            cut = piece.rfind("\n\n")
            if cut > max_chars // 2:
                piece = piece[: cut + 2].rstrip()
                end = start + len(piece)
            else:
                cut = piece.rfind(" ")
                if cut > max_chars // 2:
                    piece = piece[: cut].rstrip()
                    end = start + len(piece)
        piece = piece.strip()
        if piece:
            chunks.append(piece)
        if end >= len(t):
            break
        start = max(0, end - overlap)
        if start >= len(t) - 1:
            break
    return chunks
