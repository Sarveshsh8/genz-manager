"""
SmolLM-135M-Instruct inference.
Local inference, JSON-structured output with fallback parsing.
"""

import json
import re
from typing import Any, Optional

# Lazy load to avoid startup cost when not using model
_model = None
_tokenizer = None


def _get_model():
    global _model, _tokenizer
    if _model is None:
        from transformers import AutoModelForCausalLM, AutoTokenizer

        checkpoint = "HuggingFaceTB/SmolLM-135M-Instruct"
        _tokenizer = AutoTokenizer.from_pretrained(checkpoint)
        _model = AutoModelForCausalLM.from_pretrained(checkpoint)
        _model.eval()
    return _model, _tokenizer


def generate_json(
    system_prompt: str,
    user_prompt: str,
    max_new_tokens: int = 256,
    temperature: float = 0.2,
    top_p: float = 0.9,
    device: str = "cpu",
) -> str:
    """Generate text and extract JSON from model output."""
    model, tokenizer = _get_model()
    model.to(device)

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    input_text = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    inputs = tokenizer.encode(input_text, return_tensors="pt").to(device)

    import torch
    with torch.no_grad():
        outputs = model.generate(
            inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
        )

    raw = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return _extract_json(raw)


def _extract_json(raw: str) -> str:
    """Extract first valid JSON object from raw text."""
    # Try to find JSON block
    patterns = [
        r"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}",
        r"\{[\s\S]*?\}",
    ]
    for pat in patterns:
        matches = re.findall(pat, raw)
        for m in matches:
            try:
                json.loads(m)
                return m
            except json.JSONDecodeError:
                continue
    return "{}"


def run_evaluation_prompt(system: str, user: str) -> dict[str, Any]:
    """Run evaluation and return parsed dict. Fallback on parse failure."""
    raw_json = generate_json(system, user)
    try:
        return json.loads(raw_json)
    except json.JSONDecodeError:
        return {
            "hike_score": 50,
            "verdict": "Review parse failed - manual check needed",
            "serious_feedback": "The AI could not parse the comparison. Please review manually.",
            "genz_feedback": "Oops, something broke. Human review time.",
            "risk_flags": [],
        }
