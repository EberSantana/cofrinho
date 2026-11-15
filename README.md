# Cofrinho

Sistema web de economia no formato de **desafio de cartela**: o usuário define uma meta (padrão **R$ 40.000 em 2027**) e marca cada quadrado ao guardar o valor correspondente, acompanhando o progresso em tempo real.

**Acesse:** https://ebersantana.github.io/cofrinho/

## Funcionalidades

- **Três modelos de desafio**
  - Cartela de 100 quadrados com valores embaralhados
  - 52 semanas com valor crescente
  - 52 semanas com valor fixo
- **Soma exata da meta**: os valores são ajustados para que a cartela feche exatamente o total definido.
- **Painel de resumo**: anel de progresso, total guardado, quanto falta, ritmo (adiantado, no ritmo ou atrasado em relação ao previsto para a data) e valor necessário por semana para chegar à meta.
- **Marcos de progresso**: 10%, 25%, 50%, 75% e 100%, com a marca de onde você deveria estar hoje.
- **Filtros da cartela**: todos, pendentes ou guardados.
- **Depósitos extras**: registro de valores fora da cartela (13º, bônus, vendas), com histórico.
- **Configuração livre**: meta, data de início, data final e modelo.
- **Gráfico de evolução**: saldo guardado contra o previsto pelo calendário, com tabela equivalente.
- **Avisos com desfazer**: marcar, desmarcar e remover depósitos podem ser desfeitos na hora; marcos de progresso são celebrados.
- **App instalável (PWA)**: pode ser adicionado à tela inicial do celular, abre em tela cheia e funciona sem internet depois da primeira visita.
- **Backup**: exportação e importação dos dados em arquivo JSON.
- **Tema claro e escuro** automáticos e layout responsivo para celular.

## Como usar

1. Abra o site e ajuste a meta e as datas em *Ajustar o desafio*, se quiser.
2. Toque em um quadrado sempre que guardar aquele valor.
3. Acompanhe o ritmo e o valor semanal sugerido no painel superior.
4. Registre depósitos extras na seção própria.

## Privacidade

Todos os dados ficam **apenas no navegador** do usuário (`localStorage`). Nada é enviado a servidores. Limpar os dados do navegador apaga o progresso; por isso há exportação e importação de backup.

## Tecnologia

Página única em HTML, CSS e JavaScript puro, sem dependências nem etapa de build, mais `manifest.webmanifest`, `sw.js` e a pasta `icons/` do PWA. Para rodar localmente, sirva a pasta com qualquer servidor estático (por exemplo `python3 -m http.server`); abrir o `index.html` direto também funciona, só sem o modo offline.

## Instalar no celular

- **iPhone (Safari):** toque em Compartilhar e depois em **Adicionar à Tela de Início**.
- **Android (Chrome):** toque em **Instalar** no topo do app, ou no menu do navegador em **Instalar app**.

Para publicar uma nova versão do app, aumente o valor de `CACHE` em `sw.js`; assim os aparelhos baixam os arquivos novos.

## Design

O sistema visual e as regras de UX estão em [`design-system/cofrinho/MASTER.md`](design-system/cofrinho/MASTER.md).

## Autor

Prof. Eber Santana · Instagram [@prof.ebersantana](https://www.instagram.com/prof.ebersantana/)
