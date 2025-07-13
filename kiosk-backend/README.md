# Kiosk Backend (FastAPI)

Este diretório conterá o backend do Quiosque, desenvolvido em Python com FastAPI para servir fotos, carrinho e integração futura com pagamentos.

## Funcionalidades previstas
- Servir lista de fotos (mock inicialmente)
- Endpoints REST para galeria, carrinho, checkout
- Integração futura com banco SQLite e sistema de ingestão

## Como rodar
1. Instale as dependências:
   ```bash
   pip install fastapi uvicorn
   ```
2. Rode o servidor de desenvolvimento:
   ```bash
   uvicorn main:app --reload
   ```

## Estrutura sugerida
- `main.py` - API principal
- `models.py` - modelos de dados
- `routes/` - rotas REST
- `static/` - imagens de exemplo (mock)

---

Dúvidas ou sugestões, entre em contato com o time de desenvolvimento.
