# Datar Soluções Tecnológicas

Redes de computadores para pequenas e médias empresas de Cascavel-PR e região, com suporte técnico, manutenção preventiva e corretiva e atendimento residencial complementar. Atendimento disponível 24 horas.

**Sua rede em ordem. Seu negócio em movimento.**

## Executar

Requer Bun. Não há dependências de projeto para instalar.

```sh
bun run dev
bun run check
bun test
```

Abra http://localhost:3000. Para iniciar sem observar alterações, use `bun run start`. HTML, CSS e JavaScript são estáticos; atualize a página após editar. O servidor Bun é destinado ao desenvolvimento local, não à hospedagem de produção.

## Arquitetura

- `index.html`: wordmarks oficiais, conteúdo em pt-BR, metadados, dados estruturados, navegação, serviços, diferenciais, acolhimento, etapas, cobertura, FAQ, contato e privacidade.
- `styles.css`: paleta oficial, Manrope e Inter locais, componentes responsivos e estados de foco.
- `js/config.js`: nome, telefone, mensagens contextuais, catálogo de serviços e campos comerciais a preencher.
- `js/contact.js`: validação, formatação do telefone, construção única da URL e atualização segura do JSON-LD.
- `js/main.js`: menu, configuração dos CTAs, dados comerciais, prévia, cópia e mensagens do formulário.
- `brandig/datar/`: kit oficial recebido, preservado sem alterações. A pasta foi fornecida como `brandig`, não `branding`.
- `assets/fonts/`: fontes locais variáveis e licenças OFL; não há chamadas ao Google Fonts no site.
- `assets/digital-core.svg`: ilustração antiga preservada, sem uso na página.
- `favicon.svg`: cópia do favicon SVG oficial; ícone Apple também usa o kit.
- `scripts/serve.js`: servidor local restrito aos arquivos públicos.
- `scripts/check.js`: compilação JavaScript para navegador e verificação de imports, IDs, assets e âncoras.
- `tests/`: testes do formulário, mensagens, telefone, CTAs, identidade e dados estruturados.

## Configuração obrigatória antes de publicar

Edite `js/config.js`. `WHATSAPP_NUMBER` é a única fonte do telefone. Substitua `55DDXXXXXXXXX` por 55 + DDD + número real autorizado, somente dígitos, sem espaços, sinal de mais ou pontuação. A validação verifica o formato, não a existência da conta.

Enquanto o valor for provisório, vazio ou inválido, os nove CTAs apontam para a seção de contato, mostram um aviso de configuração e não abrem um número fictício. O formulário continua permitindo preparar e copiar uma mensagem. Com o número real configurado, os CTAs abrem o WhatsApp em outra aba com `noopener noreferrer`, texto codificado e rótulos acessíveis. O envio final sempre depende da ação do visitante.

As mensagens `general`, `network`, `support`, `hardware` e `other` (e a variante legada `consulting`, preservada por compatibilidade) ficam no mesmo arquivo. O telefone legível do contato e rodapé é gerado da constante, inclusive o formato provisório +55 (DD) XXXXX-XXXX. Não substitua esse texto diretamente no HTML.

### Campos a preencher

Todos os campos de `businessDetails` têm TODOs em inglês e começam vazios:

- `certifications`: opcional, somente nomes comprovados. Não há alegações de certificação no conteúdo padrão.
- `streetAddress` e `postalCode`: endereço e CEP reais, se puderem ser publicados.
- `cnpj`: CNPJ real, se for divulgado.
- `email`: endereço de e-mail público autorizado.
- `socialLinks`: URLs dos perfis oficiais; não há links fictícios.
- `servedCities`: apenas cidades vizinhas com cobertura confirmada. A lista sinalizada em `index.html` é substituída automaticamente ao preencher este campo.

CNPJ, e-mail, endereço e certificações só aparecem na página quando preenchidos. Endereço completo, CEP, telefone, e-mail, CNPJ e redes sociais não são inventados no JSON-LD: os campos opcionais só são incluídos quando configurados. O telefone e o link do WhatsApp são derivados da mesma constante. A localidade Cascavel/PR/BR, a referência genérica à região e a disponibilidade 24/7 já constam no JSON-LD estático; o JavaScript acrescenta os detalhes reais.

TODO: definir o domínio público e uma imagem social oficial antes de adicionar URL canônica, og:url ou og:image. Nenhum endereço de site foi presumido.

## Comportamento e privacidade

O contato direto pelo WhatsApp não exige preencher o formulário. O formulário opcional aceita nome de 2 a 100 caracteres, serviço do catálogo e descrição de 20 a 1.500 caracteres. Há resumo de erros, foco nos campos, prévia, cópia pela Clipboard API e seleção manual como alternativa. Alterar os campos invalida a prévia anterior. Os CTAs de serviços preservam a seleção do serviço no formulário quando o telefone está pendente.

Não há envio automático, backend, armazenamento local, cookies, analytics ou bibliotecas externas de runtime. O envio pelo WhatsApp depende do visitante e das políticas do serviço externo. Não solicite senhas. A hospedagem pode registrar dados técnicos de acesso.

Sem JavaScript, o conteúdo, as âncoras, as perguntas e a privacidade continuam acessíveis. O formulário fica desabilitado com explicação visível; os CTAs não apontam para nenhum número externo.

## Verificação e limites

`bun run check` verifica a compilação para navegador e referências locais, sem gerar artefatos. `bun test` executa os testes automatizados. Não há scripts separados de lint, type-check ou build. Não se adicionaram dependências ao projeto.

Consulte `VALIDACAO.md` para os resultados, métodos e limites da validação. Antes de publicar, preencha os dados, confirme os dados comerciais, cidades, condições de atendimento e texto de privacidade. Não há promessa de prazo fixo de resposta, recuperação de dados ou visita imediata durante a madrugada.
