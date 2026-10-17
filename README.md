# TechNova — landing page demonstrativa

Empresa fictícia de soluções digitais. O projeto não apresenta clientes, depoimentos, métricas, certificações ou resultados reais.

## Executar localmente

Pré-requisito: [Bun](https://bun.sh/). Não há pacotes para instalar.

```sh
bun run dev
```

Abra **http://localhost:3000**. O servidor observa alterações no código do servidor; atualize a aba para ver mudanças no HTML, CSS ou JavaScript. Para usar outra porta:

```sh
PORT=3001 bun run dev
```

Como alternativa, por serem arquivos estáticos, é possível servir com Python 3:

```sh
python3 -m http.server 3000 --bind 127.0.0.1
```

Use um servidor HTTP em vez de abrir `index.html` diretamente: os módulos JavaScript precisam de uma origem HTTP. O servidor Bun é uma ferramenta local de desenvolvimento e não deve ser usado como servidor de produção.

## Arquitetura

HTML semântico, CSS e módulos JavaScript nativos, sem framework, dependências de runtime, fontes remotas ou etapa de build obrigatória. A solução mantém a página leve e permite hospedagem estática. O Bun serve os arquivos e executa os testes.

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Conteúdo, SEO, navegação, serviços, benefícios, processo, FAQ, formulário e privacidade |
| `styles.css` | Tokens visuais, layout mobile-first, estados de foco e responsividade |
| `assets/digital-core.svg` | Ilustração tecnológica original, vetorial e local |
| `favicon.svg` | Símbolo da marca fictícia |
| `js/config.js` | Número do WhatsApp e catálogo de serviços |
| `js/contact.js` | Validação, normalização, mensagem e URL de WhatsApp |
| `js/main.js` | Menu, interação do formulário, seleção de serviço e cópia da prévia |
| `scripts/serve.js` | Servidor local Bun, restrito aos arquivos públicos |
| `scripts/check.js` | Verificação de JavaScript, imports, assets e âncoras |
| `tests/contact.test.js` | Testes das regras de contato e dos limites de validação |

## Configurar o WhatsApp

Edite apenas `whatsappNumber` em `js/config.js`. Use um número real autorizado com DDI e DDD, apenas dígitos, sem `+`, espaços ou pontuação. O formato aceito é de 8 a 15 dígitos, sem zero inicial; a aplicação não verifica se existe uma conta nesse número.

- **Vazio:** modo demonstrativo, com prévia e cópia; nenhum link externo é criado.
- **Formato inválido:** aviso de contato indisponível; a prévia e a cópia continuam disponíveis.
- **Número configurado:** o visitante revisa a prévia e pode abrir `https://wa.me/…?text=…` em outra aba. A mensagem usa `encodeURIComponent`. O envio final é uma ação do visitante no WhatsApp.

Não há redirecionamento automático, contato fictício, backend ou envio de dados do formulário a um servidor pela aplicação. A prévia é descartada quando os campos mudam. Os campos aceitam nome de 2 a 100 caracteres, serviço válido e descrição de 20 a 1.500 caracteres, após remover espaços nas extremidades.

## Acessibilidade e comportamento

- Link para pular ao conteúdo, landmarks semânticos e foco visível.
- Menu móvel com `aria-expanded`, Escape, fechamento ao sair e links acessíveis sem JavaScript.
- FAQ e privacidade com `details`/`summary` nativos, operáveis por teclado.
- Campos rotulados, mensagens individuais e resumo de erros com links e foco após envio inválido.
- Animação de entrada finita e respeito a `prefers-reduced-motion`.
- Formulário desabilitado com explicação quando o JavaScript não executa, evitando envio acidental dos campos pela URL.
- Cópia com Clipboard API e seleção manual como alternativa quando a API não estiver disponível.

Não há cookies, analytics, fontes externas nem armazenamento no navegador. A hospedagem pode registrar dados técnicos de acesso. O botão opcional do WhatsApp compartilha o texto no endereço do serviço externo, apenas após ação do visitante. Não inclua dados sensíveis no teste.

## Verificar

```sh
bun run check
bun test
```

`check` valida a compilação dos módulos para navegador, os imports e as referências locais, sem gerar arquivos de build. Não há linter instalado. Os testes cobrem validação de campos, serviço desconhecido, normalização, modo demonstrativo, configuração inválida e codificação da URL. A revisão visual e interativa deve usar o servidor local nas larguras de 360 a 1440 px.

Consulte [VALIDACAO.md](./VALIDACAO.md) para os resultados efetivamente obtidos, os métodos usados e os limites das verificações no navegador.

## Limites da demonstração

O formulário depende de JavaScript e não armazena solicitações. Não há atendimento real ou número de contato configurado. Domínio canônico, imagem social, conteúdo jurídico definitivo e infraestrutura de hospedagem devem ser definidos antes de uma eventual publicação. Nenhum serviço externo ou auditoria manual completa com leitor de tela está incluído.
