🏦 BankMore: Plataforma Frontend (Angular)
==========================================

Este repositório contém a aplicação *frontend* do projeto BankMore, desenvolvida em **Angular** para consumir e interagir com as APIs de Microsserviços **BankMore.Services**. A aplicação utiliza uma abordagem reativa e modular para gerenciar o estado da conta corrente e as operações assíncronas de transações.

🗺️ Visão Geral da Arquitetura
------------------------------

O frontend Angular atua como o **Cliente** da arquitetura, responsável por gerenciar a experiência do usuário, a autenticação e o fluxo de dados em tempo real.

<img width="803" height="292" alt="image" src="https://github.com/user-attachments/assets/f9dd8ac6-b4b7-42f3-b84d-9c2b1d6939d9" />

# Resultado

![angular1](https://github.com/user-attachments/assets/3ef38d24-b3d4-4bc3-a16e-85a5a79391f2)

---

![angular2](https://github.com/user-attachments/assets/e1a02f29-1b55-45ae-b1df-11c4620b6b13)

---

![angular3](https://github.com/user-attachments/assets/b60ee2ec-4435-47aa-b3ad-807a5361a75d)

---

🚀 Como Rodar o Projeto
-----------------------

-   **Pré-requisitos:** Node.js, npm, Angular CLI.

-   **Instalação de Dependências:**

    Bash

    ```
    npm install

    ```

-   **Execução:**

    Bash

    ```
    ng serve

    ```

    ou execute o docker compose

    ```
    docker compose up --force-recreate --build
    ```

    O frontend estará disponível em `http://localhost:4200/`. Certifique-se de que os microsserviços do **BankMore.Services** estejam rodando e acessíveis via `environment.apiBFF`.


    # Projeto Backend

    <img width="1917" height="963" alt="image" src="https://github.com/user-attachments/assets/01409280-38f3-4a6a-b4c2-4ef9d80fac54" />


#💻 Documentação Detalhada do Projeto BankMore
---------------------------------------------

O repositório **phillrog/bankmore-desafio** na *branch* `identity-duende` implementa uma arquitetura de microsserviços bancários com foco em resiliência, consistência distribuída e segurança.

### 1\. 🌐 Arquitetura e Padrões de Domínio (DDD)

O projeto adota uma arquitetura em camadas e segue rigorosamente os padrões de **Domain-Driven Design (DDD)** e **CQRS (Command Query Responsibility Segregation)**.

-   **DDD:** A complexidade é gerenciada através da separação explícita de responsabilidades em: Domínio (regras e entidades *core*), Aplicação (Comandos e Queries via MediatR), e Infraestrutura (Persistência e Mensageria).

-   **CQRS:** Utilização do `MediatR` para dissociar as operações de escrita (`Commands`) das operações de consulta (`Queries`), otimizando ambas as naturezas de operações.

### 2\. 🔄 Transações Distribuídas e Consistência (SAGA)

O elemento central de complexidade e robustez é a garantia de que as transações de transferência sejam atomicamente consistentes, mesmo sendo distribuídas entre serviços.

-   **Padrão SAGA Orquestrado:** A transação de transferência é implementada como uma **SAGA** (Sequence of Atomic transactions) Orquestrada. O microsserviço `BankMore.Services.Api.Transferencias` atua como o Orquestrador, utilizando o Kafka para coordenar o débito e o crédito nos serviços de Contas Correntes.

-   **Atomicidade com Outbox Pattern (Kaflow):** Para garantir que a publicação de um evento no **Apache Kafka** só ocorra se a persistência no **MSSQL** for bem-sucedida, o projeto utiliza o **Outbox Pattern** (implementado com **Kaflow**). Isso previne a perda de mensagens e a inconsistência de dados.

-   **Resiliência e Idempotência:** As operações de débito e crédito são implementadas para serem **Idempotentes**, o que é vital em sistemas distribuídos. Isso permite que os *Workers* e serviços tentem repetir a operação (`retries` gerenciados pelo **Polly**) em caso de falha temporária, sem duplicar o efeito de negócio.

### 3\. 🔐 Segurança e Identidade (Duende Identity Server)

O Identity Server, neste caso **Duende**, é o ponto de segurança central:

-   **Implementação OIDC/OAuth 2.0:** O projeto utiliza o `BankMore.Services.Api.Identidade` como o Servidor de Autorização, responsável por todo o fluxo de Autenticação (Login) e Geração de Tokens JWT.

-   **Autorização Baseada em Políticas (Claims):** A segurança contextual é garantida através de *Policies* nos *Controllers* (como `OwnerOrMaster_Conta`). Essas *Policies* dependem das **Claims** injetadas no token JWT pelo Duende (incluindo `Roles` e o crucial `numero_conta`), permitindo que um usuário acesse apenas seus próprios recursos, a menos que possua a *Role* `Master` ou `Admin`.

### 4\. 🔗 Comunicação Assíncrona e Trabalhadores

A comunicação não bloqueante é fundamental para a performance e resiliência.

-   **Apache Kafka:** Usado como *Message Broker* para a troca de **Comandos** e **Eventos** entre os serviços.

-   **Workers Dedicados:** O `BankMore.Transferencias.Workers` é um consumidor dedicado de eventos Kafka, responsável por executar as etapas do SAGA de transferência em *background*. Por exemplo, após um evento de `TransferenciaIniciada`, o *Worker* inicia o processo de débito.

-- Acesse por aqui: [https://github.com/phillrog/bankmore-desafio/tree/identity-duende](https://github.com/phillrog/bankmore-desafio/tree/identity-duende)

