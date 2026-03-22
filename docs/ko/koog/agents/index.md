# Agents

AI 에이전트는 특정 목표를 달성하기 위해 추론하고, 의사 결정을 내리며, 환경과 상호작용하고, 행동을 취할 수 있는 자율 시스템입니다.
Koog에서 AI 에이전트는 단순히 LLM을 감싸는 래퍼(wrapper) 이상의 의미를 갖습니다.
이는 JVM 생태계를 위해 설계된 구조화되고 타입 안전한(type-safe) 상태 머신입니다.

Koog 에이전트는 다음과 같은 핵심 개념을 중심으로 구축됩니다:

- [프롬프트 실행기(prompt executor)](../prompts/prompt-executors.md)는 프롬프트를 관리하고 실행하여 에이전트가 추론 및 의사 결정을 위해 LLM과 상호작용할 수 있도록 합니다.
- [전략(strategy)](../nodes-and-components.md)은 에이전트의 워크플로를 정의합니다. 유향 그래프(directed graph), 함수 또는 플래너 형태가 될 수 있습니다. [에이전트 유형](#agent-types)을 참조하세요.
- 에이전트는 외부 데이터 소스 및 서비스와 상호작용하기 위해 [도구](../tools-overview.md)를 사용할 수 있습니다.
- [기능(features)](../features/index.md)을 사용하여 AI 에이전트의 기능을 확장하고 강화할 수 있습니다.

!!! tip

    최소한의 에이전트를 생성하고 실행하는 방법에 대한 정보는 [퀵스타트](../quickstart.md)를 참조하세요.

## Agent types

수행해야 하는 작업에 따라 Koog는 여러 에이전트 유형을 제공합니다:

- [기본 에이전트(Basic agents)](basic-agents.md)는 커스텀 로직이 필요 없는 간단한 작업에 이상적입니다. 이 에이전트들은 대부분의 일반적인 사용 사례에 적합한 미리 정의된 전략을 구현합니다.
- [그래프 기반 에이전트(Graph-based agents)](graph-based-agents.md)는 에이전트의 워크플로, 상태 관리 및 시각화에 대한 완전한 제어와 유연성을 제공합니다.
- [함수형 에이전트(Functional agents)](functional-agents.md)는 에이전트의 컨텍스트에 접근할 수 있는 함수로서 커스텀 로직을 신속하게 프로토타이핑할 수 있게 해줍니다.
- [플래너 에이전트(Planner agents)](planner-agents/index.md)는 원하는 최종 상태에 도달할 때까지 반복적인 사이클을 통해 다단계 작업을 자율적으로 계획하고 실행할 수 있습니다.

## Agent configuration

에이전트 설정(Agent configuration)은 초기 프롬프트, 언어 모델, 반복 횟수 제한을 포함한 에이전트의 실행 파라미터를 정의합니다.

!!! tip

    최소한의 에이전트를 생성하고 실행하는 방법에 대한 정보는 [퀵스타트](../quickstart.md)를 참조하세요.

단순한 에이전트의 경우, 필수적인 프롬프트 실행기와 언어 모델 외에도 초기 시스템 프롬프트 및 기타 일부 파라미터를 에이전트 생성자에서 직접 지정할 수 있습니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        temperature = 0.7,
        maxIterations = 10
    )
    ```
    <!--- KNIT example-agent-config-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")))
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("You are a helpful assistant.")
        .temperature(0.7)
        .maxIterations(10)
        .build();
    ```
    <!--- KNIT example-agent-config-java-01.java -->

또는, [`AIAgentConfig`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.config/-a-i-agent-config/index.html)의 인스턴스를 생성하여 에이전트의 동작과 파라미터를 더 세밀하게 정의한 다음 에이전트 생성자에 전달할 수 있습니다. 이를 통해 여러 메시지가 포함된 복잡한 프롬프트, 대화 기록, LLM 파라미터 및 추가 실행 파라미터를 정의할 수 있습니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.agent.config.AIAgentConfig
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.prompt.params.LLMParams
    -->
    ```kotlin
    val agentConfig = AIAgentConfig(
        prompt = prompt(
            id = "assistant",
            params = LLMParams(
                temperature = 0.7
            )
        ) {
            system("You are a helpful assistant.")
        },
        model = OpenAIModels.Chat.GPT4o,
        maxAgentIterations = 10
    )

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        agentConfig = agentConfig
    )
    ```
    <!--- KNIT example-agent-config-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("assistant")
        .system("You are a helpful assistant.")
        .build()
        .withParams(new LLMParams(
            0.7,         // temperature
            null,        // maxTokens
            1,           // numberOfChoices
            null,        // speculation
            null,        // schema
            LLMParams.ToolChoice.Auto.INSTANCE, // toolChoice
            null,        // user
            null         // additionalProperties
        ));

    AIAgentConfig agentConfig = AIAgentConfig.builder(OpenAIModels.Chat.GPT4o)
        .prompt(prompt)
        .maxAgentIterations(10)
        .build();

    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .agentConfig(agentConfig)
        .build();
    ```
    <!--- KNIT example-agent-config-java-02.java -->

`AIAgentConfig`의 파라미터는 다음과 같습니다:

- `prompt`는 초기 [프롬프트](../prompts/prompt-creation/index.md) 및 [LLM 파라미터](../llm-parameters.md)를 정의합니다.

- `model`은 에이전트가 상호작용하는 언어 모델을 지정합니다. 미리 정의된 모델 중 하나를 사용하거나 [커스텀 모델 설정 생성](../model-capabilities.md#creating-a-model-llmodel-configuration)을 통해 설정할 수 있습니다.

- `maxAgentIterations`는 에이전트가 종료되기 전까지 취할 수 있는 최대 단계 수를 제한합니다. 각 단계는 에이전트 워크플로의 [노드](../nodes-and-components.md)입니다.

- `missingToolsConversionStrategy`는 에이전트 실행 중 누락된 도구를 처리하기 위한 전략을 정의합니다.

[//]: # (TODO: 도구 섹션에 누락된 도구에 대해 작성하고 여기서 링크 연결)

- `responseProcessor`는 커스텀 응답 프로세서를 정의하는 데 사용할 수 있습니다. 예를 들어, 응답 내용을 검토(moderate) 및 검증하거나, 응답 형식을 변경하거나, 응답을 기록(log)할 수 있습니다.

[//]: # (TODO: 응답 처리에 대해 어딘가에 작성?)