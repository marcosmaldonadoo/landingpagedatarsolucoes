# Validação — chamadas para ação e experiência Datar

Revisão de 18/10/2026 na branch `fix/cta-and-ux`, baseada na main `23a9aa3`. Esta validação trata as alterações desta branch; os testes visuais da identidade feitos anteriormente não comprovam a aparência desta versão.

## Mudanças verificadas

- A chamada principal prioriza orçamento de rede. As demais chamadas preservam o contexto de rede, suporte, manutenção ou outro pedido.
- Com número válido, os links usam `wa.me`, mensagem codificada, nova aba e `noopener noreferrer`. O envio continua dependendo da ação do visitante no WhatsApp.
- Sem destinatário, os botões dizem “Preparar pedido”, levam ao formulário e não abrem outra aba. O aviso de indisponibilidade aparece junto à primeira chamada e no contato. Preparar e copiar não são apresentados como envio à Datar.
- O número começa vazio e só é exibido quando válido. O botão flutuante é ocultado no início, contato e rodapé; sem IntersectionObserver, permanece oculto.
- Cascavel é a única cidade da cobertura estática no JSON-LD. Cidades adicionais só aparecem após confirmação na configuração. Não há marcadores internos de preenchimento na página.
- Textos auxiliares usam 0,875rem (14px na configuração padrão), campos e corpo usam 1rem (16px). Tracking dos títulos é relativo ao tamanho da fonte. O menu móvel passa a ser usado abaixo de 1000px.
- Orientações repetidas foram reunidas nas quatro etapas. A aprovação prévia, os cuidados com arquivos e o atendimento residencial continuam presentes.
- A demonstração de rede mostra conexão do provedor, roteador, pontos de rede e equipamentos. É identificada como esquema ilustrativo, sem alegar projeto ou resultado de cliente.
- Logotipos, fontes e arquivos do kit oficial permanecem sem alterações.

## Verificação automatizada

Sem novas dependências no projeto. Bun foi executado por pacote temporário:

- `npx --yes --package=bun bun test`: 20 testes, zero falhas. Inclui configuração ausente/inválida/válida, mensagens contextuais, normalização, limites de campos, identidade, dados estruturados e pares de contraste.
- `npx --yes --package=bun bun run check`: JavaScript compilado para navegador; imports, assets, IDs e âncoras locais verificados.
- `node --check js/main.js` e `node --check js/contact.js`: sintaxe aprovada.
- `git diff --check`: sem erros.

Um harness temporário com jsdom executou o JavaScript compilado e o HTML desta branch, com destinatário ausente e destinatário exclusivo de teste. Foram aprovadas 176 verificações de comportamento: nove CTAs em cada estado, seleção de serviço, foco, erros, prévia, invalidação da prévia, cópia, alternativa manual, menu e Escape, cobertura vazia, ausência de JavaScript e ausência de IntersectionObserver. As interseções das seções e o media query foram simulados; esse teste não calcula layout, visibilidade geométrica nem contraste renderizado. Nenhuma mensagem externa foi enviada e o número de teste não foi persistido no código de produção.

## Impeccable e limite visual

Foi executado um único scan estático de `index.html` com o Impeccable. O detector apontou cinco avisos de padding e um de uso de Inter. O código usa `padding-block` nas seções e espaçamento na faixa de abertura, além de contêineres com margens laterais; os avisos estáticos não confirmam que o texto toca as bordas. Inter foi mantida por fazer parte da identidade aprovada, junto de Manrope. Nenhuma regra foi desabilitada para ocultar os avisos.

A política do navegador deste ambiente bloqueou a abertura da prévia dos arquivos locais. Por isso, esta versão **não teve revisão visual renderizada**, medição de overflow em diferentes larguras, teste de zoom de 200%, teste físico de toque ou auditoria com leitor de tela. A revisão responsiva foi limitada ao código e aos estados de DOM. Conferir esses pontos na prévia de publicação antes de integrar.

O teste de contraste cobre pares de tokens, incluindo branco sobre azul, texto sobre branco/fundo claro, turquesa, erros, sucesso e bordas dos campos. Isso não comprova conformidade integral com WCAG.

## Dependências comerciais

- `WHATSAPP_NUMBER` permanece vazio em `js/config.js`. O problema de conversão por falta de destinatário continua pendente do número real autorizado, com DDD e código do país. O fluxo e os rótulos já estão preparados para ativá-lo pela configuração.
- Cidades vizinhas, endereço, CEP, CNPJ, e-mail, perfis e certificações continuam dependentes de dados confirmados. Nenhum deles foi inventado.
- O site continua estático, sem backend de envio, cookies, armazenamento local ou analytics. A hospedagem pode registrar dados técnicos de acesso.
