# Cofrinho · Sistema de design (MASTER)

Fonte da verdade visual do app. Páginas ou telas novas seguem este documento.
Referência de boas práticas: skill [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (buscas nos domínios `ux`, `chart` e `typography`).

## Direção
Painel financeiro limpo, de baixa variação visual (minimalismo), movimento sutil e densidade média. Confiança e calma, com o dourado reservado para o progresso.

## Cores (tokens em `:root`, com tema escuro automático)
| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--bg` | #f3f5f4 | #0a1210 | Fundo da página |
| `--surface` | #ffffff | #111c18 | Cartões |
| `--ink` / `--muted` | #0f1d18 / #62716a | #e8f0ec / #8fa39a | Texto principal e secundário |
| `--hero` / `--hero-2` | #0b2a22 / #12382e | #0f2a21 / #16382c | Cartão de destaque e quadrados marcados |
| `--brand` | #127a55 | #3fbf8a | Ações, progresso, valores positivos |
| `--accent` | #e9b44c | #e9b44c | Anel de progresso e selo de marcado |
| `--warn` / `--ok` | #c2410c / #15803d | #fb923c / #4ade80 | Atraso e sucesso (sempre com texto, nunca só cor) |

## Tipografia
Sora (títulos e números) e Manrope (texto). Tamanho mínimo 12 px, corpo 15 px, linha 1,5. Números com `tabular-nums`.
A busca `fintech clean professional dashboard` sugeriu famílias sem serifa e técnicas; foi mantida a dupla atual por ser sem serifa, legível e de caráter financeiro. A tipografia manuscrita sugerida pela busca genérica foi descartada.

## Componentes e regras
- **Alvos de toque:** mínimo de 44×44 px em telas de toque, com 8 px ou mais entre alvos.
- **Feedback:** toda ação gera retorno visível. Marcar, desmarcar e remover mostram aviso com "Desfazer" por 6 s; marcos de 10%, 25%, 50%, 75% e 100% têm aviso próprio.
- **Formulários:** rótulo sempre visível, erro abaixo do campo com `aria-describedby` e foco no primeiro campo inválido.
- **Estado vazio:** o cartão "Como funciona" aparece só no primeiro uso e pode ser fechado.
- **Gráfico:** linha de saldo (contínua) contra o previsto (tracejada). Estilo de linha e texto distinguem as séries, não só a cor. Há resumo em texto e tabela equivalente.
- **Movimento:** transições de 150 a 400 ms, respeitando `prefers-reduced-motion`.
- **Acessibilidade:** foco visível, contraste de texto 4,5:1 ou mais, ícones só com rótulo (`aria-label`), sem emojis como ícones.

## Checklist antes de publicar
- [ ] Testado em 390, 768 e 1200 px, sem rolagem lateral
- [ ] Tema claro e escuro
- [ ] Navegação por teclado
- [ ] Alvos de toque de 44 px
- [ ] `prefers-reduced-motion` respeitado
