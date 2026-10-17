# Validação — Datar Soluções Tecnológicas

Verificação local em **17 de outubro de 2026**. O commit da paleta azul e branca já existia em `96fefd0`. As alterações desta etapa adaptam o site aos serviços de TI da Datar; não houve push nem criação de PR.

## Comandos do projeto

- `npx --yes --package=bun bun run check`: aprovado; compila JavaScript para navegador e verifica imports, assets, IDs e âncoras.
- `npx --yes --package=bun bun test`: **15 testes aprovados, 0 falhas e 157 asserções**.
- `git diff --check`: sem erros de whitespace. O Git pode emitir avisos da conversão LF/CRLF no Windows.
- `npx --yes --package=bun bun run start`: servidor disponível na porta 3000; resposta HTTP 200 conferida.
- Não há scripts separados de lint, type-check ou build no package.json. O check inclui compilação, mas não equivale a um linter.

Bun, Playwright e axe-core foram executados pelo cache temporário do npm; não foram adicionadas dependências nem arquivos de lock ao projeto.

## Navegador e responsividade

A prévia colaborativa falhou duas vezes com `Preview automation snapshot timed out after 15000ms.`. O fallback usou Playwright temporário com o Microsoft Edge instalado, em modo headless.

Larguras: **360, 390, 560, 768, 800, 1024, 1100 e 1440 px**. Nenhuma apresentou overflow horizontal. Houve inspeção de screenshots locais do hero em 390 e 1440 px. A marca é textual, sem logotipo inventado; o favicon usa a letra D.

O script temporário `node "$env:TEMP\datar-browser-audit.cjs"` verificou:

- Oito CTAs: cabeçalho, hero, três serviços, CTA final, contato no rodapé e botão flutuante.
- Telefone provisório: links ficam na seção de contato, sem URL externa nem abertura de outra aba; a exibição usa +55 (DD) XXXXX-XXXX.
- Menu móvel abre, fecha com Escape e mantém a navegação existente.
- O CTA de redes seleciona o serviço correspondente no formulário quando o telefone está pendente.
- Validação dos campos, resumo de erros, prévia contextual, invalidação após edição e FAQ nativo.
- Um número de teste foi aplicado apenas à resposta do módulo em uma sessão isolada do navegador. Os oito CTAs produziram a origem wa.me, o telefone correto, mensagens em pt-BR com a marca, target=_blank e rel=noopener noreferrer.
- Nessa sessão, o telefone formatado, o telefone do JSON-LD e a URL gerada pelo formulário ficaram consistentes com a configuração. O texto decodificado da URL foi igual à prévia.
- Cópia pela Clipboard API e alternativa de seleção manual verificadas. A comparação do clipboard normaliza as quebras CRLF do Windows.
- FAQ operável com Enter e formulário desabilitado com explicação quando o JavaScript está desligado.
- Nenhum erro de runtime capturado nos fluxos. Nenhuma mensagem foi enviada e nenhum contato externo foi aberto.

O número de teste não foi salvo no código de produção; `WHATSAPP_NUMBER` continua sendo um placeholder.

## Acessibilidade e contraste

`node "$env:TEMP\datar-accessibility.cjs"` executou axe-core **4.14.0** nas regras WCAG A/AA e WCAG 2.1 A/AA, em 1440 e 390 px, com os sete itens do FAQ abertos e também com erros do formulário visíveis. Resultado: **nenhuma violação automática nas regras executadas**. Um problema de correspondência entre o nome acessível e o texto do wordmark foi corrigido e revalidado.

A regra de contraste teve resultados inconclusivos em alguns elementos com gradientes; não se apresenta esse resultado como auditoria completa. Uma checagem adicional dos tokens calculou:

- Texto principal no branco: **14,41:1**.
- Texto secundário no tint azul: **6,46:1**.
- Texto sutil no tint azul: **5,28:1**.
- Branco no botão principal: **5,46:1**.
- Azul no fundo de hover secundário: **4,62:1**.
- Extremo mais claro do gradiente de título no tint azul: **4,22:1**, acima de 3:1 para texto grande.
- Borda de campo na superfície: **3,54:1**.
- Erro no fundo de erro: **5,91:1**.

O foco por teclado foi confirmado como visível, com contorno azul sólido. Os valores dos tokens da paleta não foram alterados nesta etapa. Novos estilos usam os tokens existentes.

## Conteúdo e SEO

- Um único h1, hierarquia de títulos, idioma pt-BR, nome consistente, título e descrições locais verificados.
- Dados estruturados LocalBusiness com Cascavel/PR/BR, área regional sem inventar cidades, disponibilidade semanal 24 horas e ContactPoint para WhatsApp.
- Campos comerciais desconhecidos ficam em `js/config.js` com TODOs; valores não confirmados não são publicados no JSON-LD. O telefone e a URL de contato são acrescentados quando o número real é configurado.
- Sete perguntas frequentes, três serviços, cinco diferenciais, seção de acolhimento, quatro etapas e lista de cidades explicitamente pendente.
- Busca por nome antigo, lorem ipsum e conteúdo demonstrativo: nenhuma ocorrência no conteúdo público. O nome antigo permanece apenas no teste negativo que impede sua reintrodução.

## Antes de publicar

Preencher o telefone real, confirmar certificações, cidades atendidas, endereço/CEP, CNPJ, e-mail e perfis oficiais conforme a intenção de divulgação. A lista pública de cidades ainda é um placeholder; os demais dados não foram inventados. Definir domínio público e imagem social antes de acrescentar metadados que dependem desses dados.

Não houve teste em dispositivo físico, Safari, Firefox, leitor de tela ou avaliação manual completa de conformidade. A verificação de formato de telefone não comprova a existência de uma conta de WhatsApp. A operação de atendimento e as certificações dependem de confirmação da empresa.
