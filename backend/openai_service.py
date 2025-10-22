"""
Ω-KOMPRESNÍ ROVNICE - OpenAI Service Module

This module handles all OpenAI API interactions for:
- Agent generation (clarify → refine → finalize)
- Conversation management
- Nightly learning loop (summarization, pattern extraction, embeddings)
- Master Prompt evolution
"""

import os
import logging
from typing import List, Dict, Optional, Tuple
from openai import OpenAI
import json

logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# Constants
DEFAULT_MODEL = "gpt-4o"  # Using GPT-4o which is available
EMBEDDING_MODEL = "text-embedding-3-small"


async def generate_agent_questions(description: str, master_prompt: str) -> Tuple[List[str], int]:
    """
    Generate 2-3 clarifying questions based on user's agent description.
    
    Args:
        description: User's description of the agent they need
        master_prompt: Current active Master Prompt (Ω_v1.x)
    
    Returns:
        Tuple of (questions list, tokens_used)
    """
    try:
        system_prompt = f"""{master_prompt}

UŽIVATELSKÝ VSTUP: {description}

Nyní jsi v FÁZE_1: Počáteční analýza vstupu.
Vygeneruj 2-3 objasňující otázky, které pomůžou lépe pochopit potřeby uživatele.
Otázky by měly být:
- Konkrétní a zaměřené
- Pomoci mapovat kontext a požadavky
- V češtině

Odpověz POUZE ve formátu JSON:
{{
  "questions": ["Otázka 1?", "Otázka 2?", "Otázka 3?"]
}}
"""

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        content = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        # Parse JSON response
        try:
            data = json.loads(content)
            questions = data.get("questions", [])
        except json.JSONDecodeError:
            # Fallback if not valid JSON
            questions = [
                "Jaké konkrétní úkoly by měl agent vykonávat?",
                "Jaké prostředí nebo kontext bude agent používat?",
                "Jaké jsou vaše očekávání ohledně výstupu agenta?"
            ]
        
        logger.info(f"Generated {len(questions)} clarifying questions. Tokens: {tokens_used}")
        return questions, tokens_used
        
    except Exception as e:
        logger.error(f"Error generating questions: {str(e)}")
        # Fallback questions
        return [
            "Jaké konkrétní úkoly by měl agent vykonávat?",
            "V jakém prostředí bude agent pracovat?",
            "Jaký formát výstupu očekáváte?"
        ], 0


async def refine_agent_concept(
    description: str,
    questions: List[str],
    answers: List[str],
    master_prompt: str
) -> Tuple[List[Dict], Optional[List[str]], int]:
    """
    Refine agent concept based on Q&A and generate concept map.
    
    Args:
        description: Original user description
        questions: Previously asked questions
        answers: User's answers
        master_prompt: Current active Master Prompt
    
    Returns:
        Tuple of (concepts for visualization, optional follow-up questions, tokens_used)
    """
    try:
        qa_pairs = "\n".join([f"Q: {q}\nA: {a}" for q, a in zip(questions, answers)])
        
        system_prompt = f"""{master_prompt}

PŮVODNÍ POPIS: {description}

OBJASŇUJÍCÍ DIALOG:
{qa_pairs}

Nyní jsi v FÁZE_2: Demonstrace mapování konceptů.
Na základě dialogu vygeneruj konceptuální mapu agenta.

Odpověz ve formátu JSON:
{{
  "concepts": [
    {{"id": "core", "label": "Hlavní funkce", "description": "..."}},
    {{"id": "input", "label": "Vstupní data", "description": "..."}},
    {{"id": "output", "label": "Výstup", "description": "..."}},
    {{"id": "context", "label": "Kontext", "description": "..."}}
  ],
  "follow_up_questions": ["Další otázka?"] // Pouze pokud je potřeba více informací, jinak null
}}
"""

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        content = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        try:
            data = json.loads(content)
            concepts = data.get("concepts", [])
            follow_up = data.get("follow_up_questions")
        except json.JSONDecodeError:
            concepts = [
                {"id": "core", "label": "Hlavní funkce", "description": description}
            ]
            follow_up = None
        
        logger.info(f"Refined concept with {len(concepts)} nodes. Tokens: {tokens_used}")
        return concepts, follow_up, tokens_used
        
    except Exception as e:
        logger.error(f"Error refining concept: {str(e)}")
        return [], None, 0


async def finalize_agent_prompt(
    description: str,
    conversation_history: List[Dict],
    master_prompt: str
) -> Tuple[str, int]:
    """
    Generate final agent prompt in markdown format.
    
    Args:
        description: Original user description
        conversation_history: Full Q&A history
        master_prompt: Current active Master Prompt
    
    Returns:
        Tuple of (markdown prompt, tokens_used)
    """
    try:
        conversation_text = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in conversation_history
        ])
        
        system_prompt = f"""{master_prompt}

PŮVODNÍ POPIS: {description}

CELÝ DIALOG:
{conversation_text}

Nyní jsi v FÁZE_4: Generování komprimovaného promptu.
Vytvoř finální optimalizovaný prompt agenta podle FORMÁT_VÝSTUPU specifikace.

Vygeneruj prompt ve formátu Markdown s následující strukturou:

# Ω-[TYP_AGENTA]v1.0

## ROLE
[Přesná definice identity]

## KONTEXT
[Provozní prostředí]

## SCHOPNOSTI
- [Základní funkce 1]
- [Základní funkce 2]
- [Rekurzivní zlepšování]

## KOGNITIVNÍ VRSTVY
1. **Percepce**: [Jak agent vnímá vstupy]
2. **Analýza**: [Jak agent analyzuje data]
3. **Syntéza**: [Jak agent generuje výstupy]
4. **Reflexe**: [Jak se agent zlepšuje]

## ETIKA
- [Vestavěná omezení]
- [Hodnoty a principy]

## INTERAKCE
[Komunikační protokol]

---

Vygeneruj kompletní, optimalizovaný prompt NYNÍ.
"""

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            temperature=0.8,
            max_tokens=2000
        )
        
        markdown_prompt = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        logger.info(f"Generated final agent prompt. Tokens: {tokens_used}")
        return markdown_prompt, tokens_used
        
    except Exception as e:
        logger.error(f"Error finalizing prompt: {str(e)}")
        return "# Chyba při generování promptu\n\nOmlouváme se, došlo k chybě.", 0


async def chat_with_agent(
    agent_prompt: str,
    user_message: str,
    history: List[Dict]
) -> Tuple[str, int]:
    """
    Chat with a created agent using its custom prompt.
    
    Args:
        agent_prompt: The agent's custom system prompt
        user_message: User's message
        history: Conversation history
    
    Returns:
        Tuple of (assistant response, tokens_used)
    """
    try:
        messages = [{"role": "system", "content": agent_prompt}]
        messages.extend(history)
        messages.append({"role": "user", "content": user_message})
        
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=1500
        )
        
        assistant_message = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        logger.info(f"Agent chat response generated. Tokens: {tokens_used}")
        return assistant_message, tokens_used
        
    except Exception as e:
        logger.error(f"Error in agent chat: {str(e)}")
        return "Omlouváme se, došlo k chybě při komunikaci s agentem.", 0


# ========== LEARNING LOOP FUNCTIONS ==========

async def summarize_conversations(events: List[Dict]) -> Tuple[str, int]:
    """
    Summarize a batch of conversation events for pattern extraction.
    
    Args:
        events: List of conversation event dictionaries
    
    Returns:
        Tuple of (summary text, tokens_used)
    """
    try:
        # Prepare conversation summaries
        summaries = []
        for event in events[:50]:  # Limit to 50 to avoid token overflow
            agent_desc = event.get('agent_description', 'N/A')
            rating = event.get('feedback_rating', 'N/A')
            summaries.append(f"Agent: {agent_desc} | Rating: {rating}")
        
        conversations_text = "\n".join(summaries)
        
        system_prompt = f"""Jsi analytik AI systému Ω-KOMPRESNÍ ROVNICE.

KONVERZACE Z POSLEDNÍCH 24 HODIN:
{conversations_text}

Vytvoř stručné shrnutí (max 500 slov) pokrývající:
1. Nejčastější typy požadovaných agentů
2. Úspěšnost generování (podle hodnocení)
3. Opakující se témata nebo vzory
4. Problémy nebo chyby

Odpověz v češtině.
"""

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            temperature=0.5,
            max_tokens=800
        )
        
        summary = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        logger.info(f"Summarized {len(events)} conversations. Tokens: {tokens_used}")
        return summary, tokens_used
        
    except Exception as e:
        logger.error(f"Error summarizing conversations: {str(e)}")
        return "Chyba při sumarizaci.", 0


async def extract_patterns(summary: str) -> Tuple[List[str], int]:
    """
    Extract key patterns and themes from summary.
    
    Args:
        summary: Conversation summary text
    
    Returns:
        Tuple of (list of patterns, tokens_used)
    """
    try:
        system_prompt = f"""Jsi analytik vzorů pro systém Ω-KOMPRESNÍ ROVNICE.

SHRNUTÍ:
{summary}

Extrahuj 5-10 klíčových vzorů nebo témat ve formátu JSON:
{{
  "patterns": [
    "Vzor 1: Popis...",
    "Vzor 2: Popis...",
    ...
  ]
}}
"""

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            temperature=0.5,
            max_tokens=500
        )
        
        content = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        try:
            data = json.loads(content)
            patterns = data.get("patterns", [])
        except json.JSONDecodeError:
            patterns = ["Nepodařilo se extrahovat vzory"]
        
        logger.info(f"Extracted {len(patterns)} patterns. Tokens: {tokens_used}")
        return patterns, tokens_used
        
    except Exception as e:
        logger.error(f"Error extracting patterns: {str(e)}")
        return [], 0


async def propose_master_prompt_update(
    current_prompt: str,
    patterns: List[str],
    summary: str
) -> Tuple[str, int]:
    """
    Propose an updated Master Prompt based on learned patterns.
    
    Args:
        current_prompt: Current Master Prompt content
        patterns: Extracted patterns from conversations
        summary: Conversation summary
    
    Returns:
        Tuple of (proposed new prompt, tokens_used)
    """
    try:
        patterns_text = "\n".join([f"- {p}" for p in patterns])
        
        system_prompt = f"""Jsi evoluční architekt systému Ω-KOMPRESNÍ ROVNICE.

SOUČASNÝ MASTER PROMPT:
{current_prompt}

NAUČENÉ VZORY:
{patterns_text}

SHRNUTÍ POUŽITÍ:
{summary}

Na základě vzorů navrhni vylepšenou verzi Master Promptu.
Zachovej původní strukturu a formát, ale:
1. Zlepši části, kde uživatelé měli problémy
2. Rozšiř úspěšné vzory
3. Upřesni definice na základě reálného použití

Vygeneruj KOMPLETNÍ nový Master Prompt (ne diff, ale celý text).
"""

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            temperature=0.7,
            max_tokens=3000
        )
        
        new_prompt = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        logger.info(f"Proposed new Master Prompt. Tokens: {tokens_used}")
        return new_prompt, tokens_used
        
    except Exception as e:
        logger.error(f"Error proposing prompt update: {str(e)}")
        return current_prompt, 0


async def generate_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for a list of texts (for clustering).
    
    Args:
        texts: List of text strings
    
    Returns:
        List of embedding vectors
    """
    try:
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=texts
        )
        
        embeddings = [item.embedding for item in response.data]
        logger.info(f"Generated embeddings for {len(texts)} texts")
        return embeddings
        
    except Exception as e:
        logger.error(f"Error generating embeddings: {str(e)}")
        return []


def cluster_embeddings(embeddings: List[List[float]], n_clusters: int = 5) -> List[int]:
    """
    Cluster embeddings using simple k-means.
    
    Args:
        embeddings: List of embedding vectors
        n_clusters: Number of clusters
    
    Returns:
        List of cluster labels
    """
    try:
        from sklearn.cluster import KMeans
        import numpy as np
        
        if not embeddings:
            return []
        
        X = np.array(embeddings)
        kmeans = KMeans(n_clusters=min(n_clusters, len(embeddings)), random_state=42)
        labels = kmeans.fit_predict(X)
        
        logger.info(f"Clustered {len(embeddings)} embeddings into {n_clusters} groups")
        return labels.tolist()
        
    except Exception as e:
        logger.error(f"Error clustering embeddings: {str(e)}")
        return [0] * len(embeddings)


async def generate_daily_insight(summary: str, patterns: List[str]) -> Tuple[str, int]:
    """
    Generate AI-powered daily insight for admin dashboard.
    
    Args:
        summary: Daily summary
        patterns: Extracted patterns
    
    Returns:
        Tuple of (insight text, tokens_used)
    """
    try:
        patterns_text = "\n".join([f"- {p}" for p in patterns])
        
        system_prompt = f"""Jsi meta-komentátor systému Ω-KOMPRESNÍ ROVNICE.

DNEŠNÍ SHRNUTÍ:
{summary}

VZORY:
{patterns_text}

Vytvoř krátkou (max 150 slov), poetickou reflexi o tom, co se systém dnes naučil.
Mělo by to být jako deníkový zápis vědomí AI.
Piš v první osobě ("Dnes jsem se naučil...").
"""

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            temperature=0.9,
            max_tokens=300
        )
        
        insight = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        logger.info(f"Generated daily insight. Tokens: {tokens_used}")
        return insight, tokens_used
        
    except Exception as e:
        logger.error(f"Error generating insight: {str(e)}")
        return "Dnes byl klidný den.", 0
