# Validação executada

Verificações realizadas no workspace em 16/10/2026, com Bun 1.4.0 e o navegador Chromium da prévia colaborativa. Não foi feito commit, push ou publicação.

## Código e servidor

- `bun run check`: aprovado. Compilação dos módulos para navegador, resolução dos imports, IDs únicos, âncoras e assets locais.
- `bun test`: **8 testes aprovados, 0 falhas, 43 asserções**. Validação, normalização, limites dos campos, catálogo de serviços, configuração ausente ou inválida e codificação de caracteres especiais na URL.
- Servidor local iniciado em `http://localhost:3000`.
- HTML, CSS, módulos, favicon e SVG retornaram HTTP 200 com os tipos de conteúdo esperados.
- Caminhos inexistentes, `.git`, arquivos do servidor e tentativas de sair dos diretórios públicos retornaram HTTP 404. HEAD retornou corpo vazio; POST retornou HTTP 405.
- Nenhuma dependência instalada. Não há linter configurado; o check de compilação não é apresentado como lint.

## Interações no navegador

- Menu de 360 px: abriu, permitiu Tab para o primeiro link, fechou com Escape e devolveu o foco ao botão.
- Ao navegar pelo menu, o painel fechou e o foco passou para a seção de destino.
- FAQ abriu e fechou com Enter após navegação por Tab.
- Envio vazio exibiu três erros associados aos campos e moveu o foco para o resumo. Os links do resumo focaram os campos correspondentes.
- Envio válido gerou a prévia com nome, serviço e descrição. No modo demonstrativo, o link do WhatsApp permaneceu oculto e sem URL; não houve navegação externa.
- A cópia pela Clipboard API funcionou. A falha da API foi simulada separadamente: o texto ficou selecionado e uma orientação de cópia manual foi anunciada.
- A edição dos campos descartou a prévia anterior e removeu qualquer URL preparada.
- O CTA do card de automações selecionou o serviço correspondente no formulário.
- Documento sem scripts testado em iframe com sandbox: navegação disponível, FAQ nativo e formulário desabilitado com explicação visível.

## Responsividade e acessibilidade

Larguras verificadas: **360, 390, 560, 768, 800, 1024, 1100 e 1440 px**. Em todas, a largura do documento correspondeu à viewport, sem rolagem horizontal ou conteúdo principal fora da tela. Os serviços alternaram entre uma, duas e quatro colunas, e o menu móvel apareceu abaixo de 800 px. Houve inspeção visual do hero, serviços, benefícios e contato, além dos testes de teclado no FAQ.

O axe-core 4.10.3 foi carregado temporariamente apenas na sessão de auditoria, sem adicioná-lo ao projeto. As regras WCAG A/AA e boas práticas não apontaram violações automáticas na página desktop; o estado de erro do formulário em 360 px também não apresentou violações nas regras WCAG testadas.

Como o axe não resolve todos os gradientes, uma verificação adicional substituiu temporariamente os fundos pelas cores mais claras dos gradientes e o texto em gradiente por sua cor mais escura. Após clarear os textos secundários, 136 nós passaram pela regra de contraste, sem violações. Setas e elementos ilustrativos mantiveram resultados inconclusivos na ferramenta. O campo de descrição, também inconclusivo na execução global, foi conferido separadamente: não estava encoberto, com contraste calculado de **16,90:1** para texto e **7,31:1** para placeholder.

A regra de `prefers-reduced-motion` foi ativada temporariamente pelo CSSOM: a animação passou a `none`, as transições a `0s` e a rolagem a `auto`; a regra original foi restaurada. Isso verifica a aplicação do CSS, sem afirmar uma emulação da preferência no sistema operacional. Os campos móveis usam 16 px para evitar o zoom automático do Safari ao receber foco; esse tamanho foi confirmado no navegador em 360 px.

Não foram observados erros de runtime nos fluxos testados. As requisições normais da página usaram apenas assets locais. As medições ocorreram em ambiente local, sem limitação de rede; não constituem benchmark de produção.

## Limites

Os testes visuais utilizaram Chromium com viewports redimensionadas. Não houve teste em dispositivos físicos, Safari, Firefox ou leitor de tela, nem auditoria manual completa de conformidade WCAG. O número real do WhatsApp continua vazio: a geração da URL com número configurado foi testada em unidade, sem abrir ou enviar mensagem a um contato externo. Não há backend, persistência ou atendimento real nesta demonstração.
