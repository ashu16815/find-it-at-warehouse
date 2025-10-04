# Conversational TWG Shopping Assistant

Natural-language shopping with TWG-first results. Uses Azure OpenAI Responses API (GPT-5) + tool calls.

## Run
1) Copy .env.example → .env.local; set AOAI_* values.
2) `npm run dev`.

## Notes
- Respect robots.txt; prefer official product feeds when available.
- External results must be clearly labelled and may be monetised (Skimlinks).
- Track via /api/redirect; wire telemetry to App Insights/Event Hubs.
