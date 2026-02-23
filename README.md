# NestJS Swagger DX

O **NestJS Swagger DX** é uma biblioteca focada em melhorar a Experiência do Desenvolvedor (DX) ao unificar as ferramentas `@nestjs/swagger`, `class-validator` e `class-transformer`.

Ao invés de empilhar dezenas de decoradores para documentar, validar e transformar uma única propriedade, você utiliza uma interface única, inteligente e inferida, mantendo seus DTOs limpos e focados nas regras de negócio.

## Get Started

```bash
npm i nestjs-swagger-dx
# OU
pnpm add nestjs-swagger-dx
# Ou
yarn add nestjs-swagger-dx
```

---

### `SDXValidationModule`

Com o `SDXValidationModule` é possível definir uma configuração global para todas as suas validações, evitando repetições de mensagens de erro ou regras de negócio espalhadas pelo código.

```ts
import { SDXValidationModule } from 'nestjs-swagger-dx';

// IMPORTANTE: O SDXValidationModule precisa ser construído antes das demais
// importações. Isso garante que as configurações globais existam na memória
// antes do TypeScript avaliar e injetar os decoradores nas suas classes DTO.
SDXValidationModule.setup({
  IsEmail: { options: { host_whitelist: ['company.org'] } },
  IsPhoneNumber: { region: 'BR' },
  IsUUID: { version: '4' },
});

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // Necessário para habilitar transformações.
      transform: true,
      // Recomendado: Remove propriedades não mapeadas.
      whitelist: true,
      // Recomendado: Lança erro se houver propriedades não mapeadas.
      forbidNonWhitelisted: true,
      // Recomendado: Permite conversões implícitas.
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ... Restante das suas configurações do Swagger
  app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

---

## `@SDXProperty`

O decorador `@SDXProperty` substitui o `@ApiProperty` do _Swagger_, absorvendo suas opções e injetando configurações de transformações e validações de forma prática e centralizada. Além disso, o `@SDXProperty` consegue inferir diversas validações de forma automática que espelham as informações entregues ao _Swagger_, aprimorando muito a sincronia entre comportamento e documentação.

```ts
import { SDXProperty } from 'nestjs-swagger-dx';

export class UserRegisterDto {
  @SDXProperty({
    maxLength: 100, // Injeta @MaxLength(100)
    transformers: [
      'ToNormalized', // Limpa espaços extras
      'ToUppercase', // Converte para maiúsculas
    ],
    validators: 'IsNotEmpty', // Injeção interna de @IsNotEmpty()
  })
  name: string;

  @SDXProperty({
    minLength: 11, // Injeta @MinLength(11)
    maxLength: 11, // Injeta @MaxLength(11)
    transformers: 'ToCleanOfSymbols', // Limpa todos os caracteres não numéricos
  })
  cpf: string;

  @SDXProperty({
    validators: 'IsEmail', // Injeção interna de @IsEmail()
  })
  email: string;

  @SDXProperty({
    required: false, // Injeta @IsOptional
    transformers: 'ToCleanOfSymbols', // Limpa todos os caracteres não numéricos
    validators: 'IsPhoneNumber', // Injeção interna de @IsPhoneNumber()
  })
  phone?: string;

  @SDXProperty({
    validators: 'IsStrongPassword', // Injeção interna de @IsStrongPassword()
  })
  password: string;
}
```

### Validação de Tipo Automatizada

A biblioteca utiliza _Reflection_ para ler a tipagem nativa do TypeScript. Se você definir uma propriedade como `string`, `number`, `boolean` ou um `Array`, o `@SDXProperty` injetará silenciosamente os validadores correspondentes (`@IsString()`, `@IsNumber()`, `@IsBoolean()`, etc.).

Se a propriedade for uma classe complexa, ele aplica automaticamente `@ValidateNested()` e `@Type(() => SuaClasse)`. Se você passar `nullable: true` para a documentação, ele aplica `@ValidateIf(({ value }) => value !== null)`, validando qualquer `null` explicito.

- **Performance (Type Deactivators):** Para evitar redundância e perda de performance, o pacote conta com uma lógica de desativação inteligente. Se você solicitar o validador `IsEmail`, o pacote entende que _"todo e-mail é uma string"_, e desativa a injeção redundante do `@IsString()`, mantendo a pilha de validação no _runtime_ extremamente rápida e limpa.

### Lógica Facilitada de Transformação e Validação

- `transformers`: Aceita chaves predefinidas (como `'ToNormalized'`, `'ToCleanOfSymbols'`, `'ToUppercase'`) ou funções customizadas. Ele aplica o `@Transform()` do `class-transformer` de forma limpa. Ideal para remover espaços em branco, limpar formatação de CPFs/Telefones ou fazer parse de dados antes que eles cheguem na camada de validação.
- `validators`: Reduz a necessidade de dezenas de imports no topo do arquivo. Você pode passar uma única string (ex: `'IsNotEmpty'`) ou um array de regras (`['IsEmail', 'IsNotEmpty']`) mapeadas nativamente para o `class-validator`.

### Válvulas de Escape

Existem cenários onde o tipo de entrada na API difere do tipo de uso interno. Para esses casos avançados, o `@SDXProperty` fornece duas válvulas de escape:

- `docType`: Permite que você sobrescreva **apenas** a tipagem exibida na documentação do Swagger, mantendo a validação e a inferência interna intactas.
- `ignoreTypeValidations`: Quando definido como `true`, impede que o sistema infira validações primitivas baseadas no tipo do TypeScript. Muito útil quando necessário trabalhar com _Union Types_ (`number | string`) ou `oneOf`, nativo do `ApiProperty`. O Typescript não consegue inferir corretamente um tipo para uniões complexas, normalmente retornando `object` como default.

---

## `@SDXValidator` & `@SDXTransformer`

Caso você precise aplicar uma regra de validação ou transformação em um contexto que não exija documentação no Swagger, você pode consumir as interfaces utilitárias diretamente, aproveitando a tipagem forte e o mapeamento global:

```ts
import { SDXValidator, SDXTransformer } from 'nestjs-swagger-dx';

export class SimpleDto {
  @SDXTransformer.ToCleanOfSymbols()
  @SDXValidator.IsPhoneNumber('US') // Sobrescreve o valor global localmente
  telefoneLocal: string;

  // Transformador genérico com inferência e segurança de tipo
  @SDXTransformer.StringTo(val => val.split(','))
  @SDXValidator.IsArray()
  tags: string[];
}
```

O `@SDXValidator` espelha diretamente os decoradores do `class-validator` na versão `0.14.3` (`@SDXValidator.IsEmail()`, `@SDXValidator.IsUUID()`, `@SDXValidator.IsCurrency()`, etc.), a única diferença, é que usando o `@SDXValidator`, os validadores aplicam as validações globais definidas.

Já o `@SDXTransformer` possui transformações exclusivas descritas na tabela abaixo:

| `@SDXTransformer`    | Descrição                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'ToUppercase'`      | Converte o valor para letras maiúsculas. Aplica-se apenas se a entrada original for do tipo `string`.                                                                     |
| `'ToLowercase'`      | Converte o valor para letras minúsculas. Aplica-se apenas se a entrada original for do tipo `string`.                                                                     |
| `'ToNormalized'`     | Remove espaços em branco desnecessários nas extremidades (`trim`) e substitui múltiplos espaços internos consecutivos por um único espaço.                                |
| `'ToCleanOfSymbols'` | Remove todos os caracteres não numéricos (regex `\D`) de uma string. Ideal para higienizar dados como CPFs, CNPJs, CEPs e telefones.                                      |
| `'ToParsedJSON'`     | Tenta executar `JSON.parse()` no valor de entrada. Se a conversão falhar ou o valor não for uma string, ele retorna o dado original intacto, evitando quebras de runtime. |
| `StringTo<T, U>`     | Função de ordem superior que recebe um callback customizado. O callback só é executado se o dado original da requisição for do tipo `string`.                             |
| `NumberTo<T, U>`     | Função de ordem superior que recebe um callback customizado. O callback só é executado se o dado original da requisição for do tipo `number`.                             |
| `BooleanTo<T, U>`    | Função de ordem superior que recebe um callback customizado. O callback só é executado se o dado original da requisição for do tipo `boolean`.                            |
| `ObjectTo<T, U>`     | Função de ordem superior que recebe um callback customizado. O callback só é executado se o dado original da requisição for do tipo `object`.                             |

---

## Rotas e Controllers

Este projeto incorpora todas as funcionalidades de uma outra biblioteca que construí há algum tempo, a agora descontinuada `nestjs-swagger-clean`.

O Swagger oferece decoradores para documentar parametros de rota e de busca, tipos de respostas das suas requisições, além de informações e metadados das rotas, permitindo oferecer ao usuário final um escopo completo da funcionalidade da sua API.

O único contra dos decoradores nativos, na minha visão, é a verbosidade que criam ao exigir decoradores para cada parametro e cada tipo resposta e cada rota. É comum que rotas complexas fiquem lotadas de decoração que muitas vezes refere-se somente a documentação e não à lógica de negócio, o que pode atrapalhar a compreensão e legibilidade do código.

A `nestjs-swagger-dx` agora oferece uma forma de centralizar a sua documentação em um arquivo separado, limpando seu Controller dessa verbosidade.

### `SDXRoute` & `@SDXRoute`

Vamos supor a construção da documentação das rotas de usuário de uma aplicação. Dentro do _resource_ de usuário vamos criar um arquivo `user.swagger.ts`:

```ts
import { SDXParams, SDXResponses, SDXRoute } from 'nestjs-swagger-dx';

const USER = {
  name: 'John Doe',
  cpf: '01234567890',
  email: 'john.doe@company.org',
  password: 'Password@123',
};
const { password: _, ...rest } = USER;
const USER_MOCK = { ...rest };

const SIGN_IN: SDXRoute<{
  responses: SDXResponses<'OK' | 'CONFLICT'>; // As chaves
}> = {
  summary: 'Realiza a autenticação do usuário', // Propriedade herdada de ApiOperationOptions
  statusCode: 200, // Redefine o status de resposta padrão da rota para `OK`
  responses: {
    // A Intellisense auxilia no preenchimento, graças ao tipo definido.
    OK: {
      description: 'Autenticação realizada com sucesso',
    },
    CONFLICT: {
      description:
        'As credenciais fornecidas conflitam com os registros atuais',
    },
  },
};

const READ_ONE: SDXRoute<{
  params: SDXParams<'identifier'>;
  responses: SDXResponses<'OK' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN'>;
}> = {
  summary: 'Retorna um usuário específico pelo identificador',
  params: {
    identifier: { description: 'O ID, CPF ou E-mail do usuário buscado' },
  },
  responses: {
    OK: { description: 'Usuário encontrado com sucesso', example: USER_MOCK },
    NOT_FOUND: { description: 'Usuário não encontrado na base de dados' },
    UNAUTHORIZED: { description: 'Token de autenticação inválido ou ausente' },
    FORBIDDEN: { description: 'Acesso negado por falta de privilégios' },
  },
};

export default { SIGN_IN, READ_ONE };
```

```ts
import UserSwagger from './user.swagger';

@Controller()
export class UserController {
  // A implementação da documentação no Controller é feita com um único decorator
  @Post('sign-in')
  @SDXRoute(UserSwagger.SIGN_IN) // Injeta @HttpCode(200)
  SIGN_IN() {
    // lógica de negócio ...
  }

  @Get('users/:identifier')
  @SDXRoute(UserSwagger.READ_ONE)
  READ_ONE(@Param('identifier') identifier: string) {
    // lógica de negócio ...
  }
}
```

## Licenciamento

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes. Sinta-se livre para usar, estudar, modificar e distribuir este pacote em seus projetos pessoais ou comerciais. Apenas peço humildemente que se lembre de mencionar esse
repositório na sua documentação.

## Colaboração

Contribuições são super bem-vindas! O objetivo desta biblioteca é melhorar a vida de toda a comunidade NestJS, então se você tem ideias, encontrou algum bug ou quer adicionar um novo _transformer/validator_, siga os passos:

1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para sua modificação (`git checkout -b feature/MinhaNovaIdeia`).
3. Faça o **Commit** das suas alterações (`git commit -m 'feat: adiciona um novo validador incrível'`).
4. Faça o **Push** para a branch (`git push origin feature/MinhaNovaIdeia`).
5. Abra um **Pull Request** detalhando o que foi feito.

Você também pode contribuir abrindo [Issues](https://github.com/biamaxine/nestjs-swagger-dx/issues) com sugestões, dúvidas ou relatos de bugs. Toda ajuda é valiosa!

## Nota da Autora

Oie, eu me chamo Bianca Maxine, mas todo mundo me chama só de Bia.

Então... Desenvolver o `nestjs-swagger-dx` foi uma jornada muito divertida, gratificante e bastante desafiadora. Os útimos três dias foram pura dor de cabeça para conseguir terminar o decorator `@SDXProperty`, e depois precisei virar uma noite acordada com muito café para corrigir todos os bugs.

Essa ideia surgiu por conta de um projeto em que estou trabalhando e que começou a crescer muito. De repente, tornou-se uma dor ter que mexer nos meus DTOs e sincronizar as validações e as transformação com a documentação... sério!? Tava cada vez mais difícil entender e manter tudo funcionando.

Como Dev, mas também como UX Designer, eu realmente acho que a experiência de desenvolver precisa ser agradável e intuitiva. Eu tenho muita sorte de amar o meu trabalho, e estou sempre em busca de ferramentas que o tornem mais prático, ágil e melhor, e se essa ferramenta não existe, por que não cria-la eu mesma?!

Eu realmente espero de coração que essa biblioteca poupe horas do seu dia, evite dores de cabeça com redundância de código e deixe os seus DTOs lindíssimos assim como os meus estão ficando.

Se esse projeto te ajudou no dia a dia, considere deixar uma ⭐ lá no [repositório](https://github.com/biamaxine/nestjs-swagger-dx). Bons códigos e até a próxima! ✨

> **OBS:** Todo este projeto foi desenvolvido num notebook bem batata com 8GB de RAM, Celeron Quad Core e Zero GPU, e isso só foi possível graças ao _[Firebase Studio (Project IDX da Google)](https://firebase.studio/)_. Fica minha recomendação.
