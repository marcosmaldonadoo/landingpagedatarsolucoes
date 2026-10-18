# Validação — identidade oficial Datar

Verificação local em 17/10/2026, na branch `feat/identidade-oficial-datar`. Nenhum merge, push ou publicação foi realizado.

## Escopo

- Wordmark Próximo e favicon oficiais, sem alteração da geometria. SHA-256 dos 35 arquivos recebidos em `brandig/datar/`: nenhum arquivo modificado. O nome da pasta recebida foi preservado.
- Paleta aprovada centralizada em CSS, Manrope e Inter locais com licenças OFL. Cores semânticas de erro e sucesso preservadas para os estados do formulário.
- Posicionamento principal em redes empresariais para comércio e pequenas e médias empresas de Cascavel-PR. Suporte técnico, manutenção, outros serviços de TI e atendimento residencial complementam a oferta.
- Slogan oficial no hero, rodapé e JSON-LD. Sem alegações de certificação, clientes, resultados ou prazos de resposta garantidos.

## Comandos e resultados

Bun não está no PATH deste ambiente; executado pelo pacote temporário, sem adicionar dependências ao projeto:

- `npx --yes --package=bun bun run check`: aprovado; compilação JavaScript para navegador, imports, assets, IDs e âncoras locais.
- `npx --yes --package=bun bun test`: 17 testes aprovados, zero falhas, 202 asserções, três arquivos.
- `git diff --check`: sem erros de whitespace; Git apenas informa a conversão de LF para CRLF configurada no Windows.
- `npx --yes --package=bun bun run start`: servidor local disponível em localhost:3000.
- Checagem HTTP por Node/fetch: página, favicon, dois logotipos, ícone Apple e duas fontes retornaram 200 e os tipos MIME esperados.
- Não existem comandos separados de lint, type-check ou build no package.json.

## Navegador e responsividade

O preview colaborativo permitiu validar DOM, fontes, formulário, FAQ, menu e ausência de overflow. As capturas iniciais apresentaram distorções; duas tentativas posteriores retornaram `Preview automation snapshot timed out after 15000ms.`. Por isso a revisão visual foi concluída com Playwright temporário e Microsoft Edge local, sem instalar dependências no repositório.

Comandos de auditoria temporários:

- `node "$env:TEMP/datar-identity-audit.cjs"`: aprovado. Larguras 360, 390, 560, 768, 800, 1024, 1100 e 1440 px, sem rolagem horizontal. Capturas desktop e mobile inspecionadas em `$env:TEMP/datar-desktop.png` e `$env:TEMP/datar-mobile.png`.
- Menu móvel e Escape; seleção contextual de serviço; erros, prévia e invalidação do formulário; cópia e alternativa manual; FAQ por teclado; alternativa sem JavaScript: aprovados.
- Nove CTAs verificados com um número exclusivamente de teste, substituído apenas na resposta de rede da sessão do navegador. URLs wa.me, texto codificado, nova aba, noopener/noreferrer, telefone formatado e JSON-LD consistentes. Número de teste não persistido e nenhuma mensagem enviada.
- Manrope e Inter carregadas localmente; logotipos carregados com proporções preservadas. Sem requisições externas de fontes em produção. Nenhum erro de runtime nos fluxos auditados.

## Acessibilidade e contraste

`node "$env:TEMP/datar-accessibility.cjs"`: axe-core 4.14.0, regras WCAG A/AA e WCAG 2.1 A/AA em 1440 e 390 px, FAQ aberto e estado de erros do formulário. Zero violações automáticas nas regras executadas. Foco por teclado visível, sólido, em #315B83.

Há um resultado inconclusivo de contraste na seta decorativa de voltar ao topo; a auditoria automática não comprova conformidade completa. Teste adicional em `tests/contrast.test.js` verifica os pares de tokens de texto, botões, campos, erro e sucesso:

| Par | Contraste |
| --- | --- |
| Texto #183247 no branco | 13,24:1 |
| Azul #315B83 no fundo #E7F0F3 | 6,14:1 |
| Branco no azul principal | 7,11:1 |
| Texto #183247 no turquesa #4FC3C8 | 6,29:1 |

Azul secundário e turquesa não são usados para texto pequeno sobre branco. O card principal usa texto e foco brancos no azul. A decoração de rede é ocultada de leitores de tela; os logotipos têm texto alternativo.

## Pendências antes de publicar

- Preencher `WHATSAPP_NUMBER` em `js/config.js`: permanece `55DDXXXXXXXXX`. Até lá, CTAs levam ao formulário e nenhum telefone fictício é aberto.
- Confirmar cidades atendidas e, se houver intenção de divulgação, endereço/CEP, CNPJ, e-mail e perfis oficiais. Campos desconhecidos continuam vazios, sem inventar dados estruturados.
- Certificações são opcionais: o conteúdo padrão não as alega; preencher somente com comprovação.
- Definir domínio e imagem social oficial antes de incluir canonical, og:url ou og:image.
- Não foram realizados testes em dispositivos físicos, Safari, Firefox ou leitor de tela, nem auditoria manual integral de WCAG. Disponibilidade de atendimento e abrangência comercial dependem da operação da empresa.
