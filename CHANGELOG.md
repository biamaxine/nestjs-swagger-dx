# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato baseia-se no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-03-27

### 🚀 Features (Funcionalidades)

- **Integração Básica com Prisma ORM (Opt-in):** Adição de utilitários nativos para facilitar a construção de paginação e ordenação de buscas em projetos que utilizam o Prisma.
  - Criação do `PrismaPaginationDto` com abstração automática de `page` e `limit` para os computados `skip` e `take`.
  - Adição dos validadores de ordenação `IsPrismaSortOrder` e `IsPrismaSortOrderInput`, com suporte a tipos complexos (ex: lidando com valores nulos) e renderização automática no Swagger usando `oneOf`.
  - A integração foi desenhada como opcional, mantendo a biblioteca agnóstica e sem adicionar o Prisma como dependência direta do projeto.

### 🐞 Bug Fixes (Correções)

- **Validação de Nulos (`nullable: true`):** Correção na aplicação da propriedade `nullable`, que estava injetando o decorador `@ValidateIf` de forma inadequada e causando comportamentos indesejados e erros de validação na aplicação.
- **Comportamento de Arrays (`isArray: true`):** Correção na propagação da opção `each: true`. Anteriormente, ela estava sendo aplicada indevidamente a todos os validadores, incluindo o próprio `@IsArray` e validadores de escopo de array como `@ArrayMinSize` e `@ArrayMaxSize`.
- **Inferência de Tipos em Arrays:** Corrigido o problema onde a presença da opção `isArray: true` desabilitava erroneamente a identificação e inferência automática do parâmetro `type` pelo sistema.

### ✅ Tests (Testes)

- **Suíte de Validação e Transformação:** Implementação de mais de 70 testes unitários para o decorator `@SDXProperty`, garantindo o funcionamento estrito da injeção de tipagem inferida, metadados do Swagger, validadores customizados e transformadores.
- **Herança de DTOs:** Adição de testes comprovando a manutenção impecável dos metadados e regras de validação ao utilizar funções utilitárias do NestJS como o `PickType` (ex: `InjectByInferedTypeDto`, `InjectBySwaggerPropsDto`).
- **Controllers e Rotas:** Criação de testes unitários focados no `TestController`, assegurando que a abstração de roteamento (`@SDXRoute`) preserva as instâncias e referências reais dos DTOs injetados nos métodos.

## [1.0.3] - 2026-02-27

### 🐞 Bug Fixes (Correções)

- **Visibilidade da API Pública:** Correção da exposição dos decorators essenciais no ponto de entrada da biblioteca (`index.ts`). Agora, `SDXParams`, `SDXQueries`, `SDXResponses` e `SDXRoute` estão devidamente exportados para uso externo, resolvendo problemas de importação em projetos que consomem a lib.

## [1.0.1] - 2026-02-27

### ♻️ Refactoring (Refatorações)

- **Compatibilidade Expandida do Ecossistema:** Ampliação das `peerDependencies` no `package.json` para garantir suporte oficial e estável tanto para o NestJS v10 quanto para a v11.
- **Suporte Multiversão (class-validator):** Ajuste dos intervalos de versão para aceitar `class-validator` v0.14 e v0.15, garantindo funcionamento pleno mesmo com as mudanças internas da biblioteca de validação.

### ⚙️ Configurações & Setup (Chores)

- **Otimização de Workspace:** Refatoração do `pnpm-workspace.yaml` com a configuração de `onlyBuiltDependencies` e exclusão do `@scarf/scarf` para instalações mais limpas e seguras.
- **DX (Developer Experience):** Atualização do ambiente de desenvolvimento no `.idx/dev.nix` com a inclusão da extensão **Jest Runner**, facilitando a execução de testes unitários diretamente pela interface.

## [1.0.0] - 2026-02-23

### 🚀 Features (Funcionalidades)

- **Integração de Roteamento (Swagger Clean):** Criação dos decorators `@SDXParams`, `@SDXQueries`, `@SDXResponses` e `@SDXRoute` em `shared/decorators`, centralizando e tipando a documentação dos Controllers.
- **Ecossistema de Testes (UserResource):** Implementação completa do módulo de usuários (`UserService`, `UserController`, `UserEntity`) e bateria de DTOs (`UserRegisterDto`, `UserSignInDto`, `UserFiltersDto`, `UserUpdateMeDto`, `UserUpdateOneDto`, `UserEnableDto`) para validação real e testes da biblioteca. Adição de contratos no `UserSwagger`.
- **Decorator Core (`@SDXProperty`):** Criação do decorator principal para DTOs e suas interfaces (`SDXPropertyOptions`). Adição dos desativadores de tipo dinâmicos (`SDX_TYPE_DEACTIVATORS`) para otimização de performance.
- **Utilitários Globais (`SDXValidator` & `SDXTransformer`):** Mapeamento completo dos validadores do `class-validator` e construção de transformadores customizados de alta performance.
- **Módulo de Configuração (`SDXValidationModule`):** Criação do módulo global para setup de regras padronizadas (ex: região para telefones, whitelists, etc).

### ♻️ Refactoring (Refatorações)

- **Padronização de Constantes:** Renomeação e refatoração de mapeamentos internos para o padrão uppercase (ex: `SDXClassValidatorMap` para `SDX_CLASS_VALIDATOR`, `SDXValidator` para `SDX_VALIDATOR`, `SDXTransformer` para `SDX_TRANSFORMER`).
- **Correções no `@SDXProperty`:** Correção do `SDX_TYPE_DEACTIVATORS` para excluir a duplicação do tipo `PropertyDecoratorFn` e refatoração geral nas lógicas de opções do decorador.

### ⚙️ Configurações & Setup (Chores)

- **Dependências Base:** Instalação e configuração de `@nestjs/swagger`, `class-validator`, `class-transformer` e `libphonenumber-js`.
- **Ambiente de Desenvolvimento:** Configuração de previews e suporte no `.idx/dev.nix` (Firebase Studio / Project IDX).
- **Inicialização:** Criação da fundação do projeto NPM via Nest CLI (`nest new`).
