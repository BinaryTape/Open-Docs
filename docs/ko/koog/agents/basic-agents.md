# 기본 에이전트

기본 에이전트(Basic agent)는 대부분의 일반적인 유스케이스에 적합한 단순한 실행 흐름을 가진 미리 정의된 전략을 사용합니다.
이 에이전트는 문자열 입력(질문, 요청 또는 작업 설명)을 받아 이를 설정된 LLM(대규모 언어 모델)으로 보냅니다.
LLM은 제공된 도구(tools)를 호출하기로 결정할 수 있습니다.
에이전트는 도구를 실행하고 그 결과를 다시 LLM으로 보냅니다.
이 과정은 LLM이 더 이상 도구 호출을 요청하지 않고 문자열 응답을 반환할 때까지 반복됩니다.
그 후 에이전트는 이 응답을 출력합니다.

[그래프 기반 에이전트](graph-based-agents.md)에서는 기본 에이전트가 사용하는 미리 정의된 전략 그래프를 다시 만드는 방법을 확인할 수 있습니다.

??? note "사전 요구 사항"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    이 페이지의 예제들은 `OPENAI_API_KEY` 환경 변수가 설정되어 있다고 가정합니다.

## 최소한의 에이전트 생성하기

가장 기본적인 에이전트를 생성하려면, [`AIAgent`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/index.html)를 인스턴스화하고 [언어 모델](../model-capabilities.md#creating-a-model-llmodel-configuration)이 포함된 [프롬프트 실행기(prompt executor)](../prompts/prompt-executors.md)를 제공하세요.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        llmModel = OpenAIModels.Chat.GPT4o
    )
    ```

    이 에이전트는 입력으로 문자열을 기대하고 출력으로 문자열을 반환합니다.
    에이전트를 실행하려면 사용자 입력과 함께 `run()` 함수를 사용하세요.

    ```kotlin
    fun main() = runBlocking {
        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
    ```
    <!--- KNIT example-basic-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava01 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .llmModel(OpenAIModels.Chat.GPT4o)
        .build();
    ```

    이 에이전트는 입력으로 문자열을 기대하고 출력으로 문자열을 반환합니다.
    에이전트를 실행하려면 사용자 입력과 함께 `run()` 메서드를 사용하세요.

    ```java
    String result = agent.run("Hello! How can you help me?");
    System.out.println(result);
    ```
    <!--- KNIT exampleBasicJava01.java -->

에이전트는 다음과 같은 일반적인 답변을 반환합니다.

```text
I can assist with a wide range of topics and tasks. Here are some examples:

1. **Answering questions**: I can provide information on various subjects, from science and history to entertainment and culture.
2. **Generating text**: I can help with writing tasks, such as suggesting alternative phrases, providing definitions, or even creating entire articles or stories.
3. **Translation**: I can translate text from one language to another, including popular languages such as Spanish, French, German, Chinese, and many more.
4. **Conversation**: I can engage in natural-sounding conversations, using context and understanding to respond to questions and statements.
5. **Brainstorming**: I can help generate ideas for creative projects, such as writing stories, composing music, or coming up with business ideas.
6. **Learning**: I can help with language learning, explaining grammar rules, vocabulary, and pronunciation.
7. **Calculations**: I can perform mathematical calculations, including basic arithmetic, algebra, and more advanced math concepts.

What's on your mind? Do you have a specific question, topic, or task you'd like to tackle?
```
<!--- KNIT example-basic-01.txt -->

## 시스템 프롬프트 추가하기

작업과 관련된 지침, 문맥, 목적뿐만 아니라 에이전트의 역할을 정의하기 위해 [시스템 메시지](../prompts/prompt-creation/index.md#system-message)를 제공하세요.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o
    )
    ```
    <!--- KNIT example-basic-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava02 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .build();
    ```
    <!--- KNIT exampleBasicJava02.java -->

시스템 프롬프트의 지침은 에이전트의 응답을 가이드합니다.

```text
I'm here to help you navigate the wild world of internet memes!

What's on your mind? Are you trying to understand a specific meme, need help finding a popular joke, or perhaps want some recommendations for trending memes? Let me know, and I'll do my best to provide you with some LOLs!
```
<!--- KNIT example-basic-02.txt -->

## LLM 출력 구성하기

LLM의 동작을 커스텀하기 위해 에이전트 생성자(Kotlin)에 몇 가지 [LLM 파라미터](../llm-parameters.md#llm-parameter-reference)를 직접 제공하거나 빌더 메서드(Java)를 통해 제공할 수 있습니다.
예를 들어, 생성된 응답의 무작위성을 조정하려면 `temperature` 파라미터를 사용하세요.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7
    )
    ```
    <!--- KNIT example-basic-java-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava03 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .temperature(0.7)
        .build();
    ```
    <!--- KNIT exampleBasicJava03.java -->

다음은 서로 다른 temperature 값에 따른 응답 예시입니다.

=== "0.4"
    
    ```text
    I'm here to help you navigate the wild world of internet memes! Whether you're looking for explanations, examples, or just want to share a meme with someone, I'm your go-to expert. What's on your mind? Got a specific meme in mind that's got you curious? Or maybe you need some meme-related advice? Fire away!
    ```
    <!--- KNIT example-basic-03.txt -->

=== "0.7"

    ```text
    I'm here to help you navigate the wild world of internet memes!
    
    What's on your mind? Need help understanding a specific meme, finding a popular joke or trend, or maybe even creating your own meme? Let's get this meme party started!
    ```
    <!--- KNIT example-basic-04.txt -->

=== "1.0"

    ```text
    I'd be happy to help you navigate the wild world of internet memes!
    
    Whether you're looking for explanations of classic memes, suggestions for new ones to try out, or just want to discuss your favorite meme culture trends, I'm here to assist. What's on your mind?
    
    Do you have a specific question about memes (e.g., "What does this meme mean?"), or are you looking for some meme-related recommendations (e.g., "Can you recommend a funny meme to share with friends?"). Let me know how I can help!
    ```
    <!--- KNIT example-basic-05.txt -->

## 도구 추가하기

에이전트는 특정 작업을 수행하기 위해 [도구(tools)](../tools-overview.md)를 사용할 수 있습니다.

먼저, 함수(Kotlin) 또는 메서드(Java)에 [`@Tool`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools.annotations/-tool/index.html) 어노테이션을 달아 도구를 생성합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    -->
    ```kotlin
    @Tool
    @LLMDescription("Ask the user a question by sending it to stdout and return the answer from stdin")
    fun askUser(
        @LLMDescription("Question from the agent")
        question: String
    ): String {
        println(question)
        return readln()
    }
    ```

    그런 다음, [`ToolRegistry`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html)를 사용하여 에이전트가 이 도구를 사용할 수 있도록 만듭니다.

    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = ToolRegistry {
            tool(::askUser)
        }
    )
    ```
    <!--- KNIT example-basic-03.kt -->

    이 예제에서 `askUser`는 에이전트가 콘솔에서 출력 및 입력을 통해 사용자와 대화를 유지하도록 돕는 도구입니다.
    에이전트가 사용자에게 질문하기로 결정하면, `println()`을 통해 `stdout`에 쓰고 `readln()`을 통해 `stdin`으로부터 읽는 이 도구를 호출할 수 있습니다.

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import java.util.Scanner;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava04 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // ToolSet 클래스 생성
    class UserConversationTools implements ToolSet {
        @Tool
        @LLMDescription("Ask the user a question by sending it to stdout and return the answer from stdin")
        public String askUser(
            @LLMDescription("Question from the agent")
            String question
        ) {
            System.out.println(question);
            Scanner scanner = new Scanner(System.in);
            return scanner.nextLine();
        }
    }
    ```
    
    그런 다음, [`ToolRegistry`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html)를 사용하여 에이전트가 이 도구를 사용할 수 있도록 만듭니다.

    ```java
    UserConversationTools askUser = new UserConversationTools();

    ToolRegistry toolRegistry = ToolRegistry.builder()
            .tools(askUser)
            .build();

    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .temperature(0.7)
        .toolRegistry(toolRegistry)
        .build();
    ```
    <!--- KNIT exampleBasicJava04.java -->

    이 예제에서 `askUser`는 에이전트가 콘솔에서 출력 및 입력을 통해 사용자와 대화를 유지하도록 돕는 도구입니다.

다음은 에이전트와의 상호작용 예시입니다.

```text
Agent: Which meme would you like me to explain? Please choose from: Grumpy Cat, Success Kid, or Doge.

User: Explain Doge

Agent:

**Doge**

Doge is a popular internet meme that originated on the imageboard website 4chan in 2013. The meme features a picture of a Shiba Inu dog with a caption written in a playful, exaggerated style.

The typical format of a Doge meme includes:

* A photo of a Shiba Inu dog
* A caption written in all capital letters, using a intentionally simplistic and childlike tone
* Exaggerated or made-up words or phrases, often used to convey a humorous or nonsensical idea

Examples of Doge memes might include:

* "Such wow. Such happy."
* "I had fun today!"
* "Wow, I am good at napping."

The meme is known for its lighthearted and playful tone, and is often used to express excitement, happiness, or silliness. The meme has since become a cultural phenomenon, with countless variations and parodies emerging online.
```
<!--- KNIT example-basic-06.txt -->

## 에이전트 반복 횟수 조정하기

무한 루프를 방지하기 위해 Koog는 모든 에이전트가 제한된 횟수의 단계(기본값 50회)만 수행하도록 허용합니다.
에이전트가 더 많은 단계(도구 호출 및 LLM 요청 등)를 필요로 할 것으로 예상되면 `maxIterations` 파라미터를 사용하여 이 제한을 늘리거나, 몇 단계만 필요한 에이전트의 경우에는 줄일 수 있습니다.
예를 들어, 여기에 설명된 단순한 에이전트는 10단계 이상 필요하지 않을 것입니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    @Tool
    @LLMDescription("Asks the user a question by sending it to stdout and returns the answer from stdin")
    fun askUser(
        @LLMDescription("Question from the agent")
        question: String
    ): String {
        println(question)
        return readln()
    }
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = ToolRegistry {
            tool(::askUser)
        },
        maxIterations = 10
    )
    ```
    <!--- KNIT example-basic-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import java.util.Scanner;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava05 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // ToolSet 클래스 생성
    class UserConversationTools implements ToolSet {
        @Tool
        @LLMDescription("Ask the user a question by sending it to stdout and return the answer from stdin")
        public String askUser(
            @LLMDescription("Question from the agent")
            String question
        ) {
            System.out.println(question);
            Scanner scanner = new Scanner(System.in);
            return scanner.nextLine();
        }
    }

    // main 메서드 내부:
    UserConversationTools askUser = new UserConversationTools();

    ToolRegistry toolRegistry = ToolRegistry.builder()
            .tools(askUser)
            .build();

    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .temperature(0.7)
        .toolRegistry(toolRegistry)
        .maxIterations(10)
        .build();
    ```
    <!--- KNIT exampleBasicJava05.java -->

!!! tip

    모델, temperature, 최대 반복 횟수 및 기타 파라미터들을 Kotlin 생성자나 Java 빌더에 직접 전달하는 대신, 별도의 구성 객체로 정의하여 전달할 수도 있습니다.
    자세한 내용은 [에이전트 구성](index.md#agent-configuration)을 참조하세요.

## 에이전트 실행 중 이벤트 처리하기

테스트 및 디버깅을 돕고 체인으로 연결된 에이전트 상호작용을 위한 후크(hook)를 만들기 위해, Koog는 [EventHandler](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler/index.html) 기능을 제공합니다.

=== "Kotlin"

    에이전트 생성자 람다 내부에서 `handleEvents()` 함수를 호출하여 기능을 설치하고 이벤트 핸들러를 등록하세요.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.features.eventHandler.feature.handleEvents
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    @Tool
    @LLMDescription("Asks the user a question by sending it to stdout and returns the answer from stdin")
    fun askUser(
        @LLMDescription("Question from the agent")
        question: String
    ): String {
        println(question)
        return readln()
    }
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        systemPrompt = "You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = ToolRegistry {
            tool(::askUser)
        },
        maxIterations = 10
    ){
        handleEvents {
            // 도구 호출 처리
            onToolCallStarting { eventContext ->
                println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
            }
        }
    }
    ```
    <!--- KNIT example-basic-05.kt -->

=== "Java"
    에이전트 빌더에서 `.install()` 메서드를 사용하여 `EventHandler.Feature`에 이벤트 핸들러를 등록하세요.

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.agents.features.eventHandler.feature.EventHandler;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import java.util.Scanner;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;
    class exampleBasicJava06 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // ToolSet 클래스 생성
    class UserConversationTools implements ToolSet {
        @Tool
        @LLMDescription("Ask the user a question by sending it to stdout and return the answer from stdin")
        public String askUser(
            @LLMDescription("Question from the agent")
            String question
        ) {
            System.out.println(question);
            Scanner scanner = new Scanner(System.in);
            return scanner.nextLine();
        }
    }

    // main 메서드 내부:
    UserConversationTools askUser = new UserConversationTools();

    ToolRegistry toolRegistry = ToolRegistry.builder()
            .tools(askUser)
            .build();

    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are an expert in internet memes. Be helpful, friendly, and answer user questions concisely, showing your knowledge of memes.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .temperature(0.7)
        .toolRegistry(toolRegistry)
        .maxIterations(10)
        .install(EventHandler.Feature, config -> {
            config.onToolCallStarting(eventContext -> {
                System.out.println("Tool called: " + eventContext.getToolName() +
                    " with args " + eventContext.getToolArgs());
            });
        })
        .build();
    ```
    <!--- KNIT exampleBasicJava06.java -->

이제 에이전트가 `askUser` 도구를 호출할 때 다음과 유사한 내용을 출력합니다.

```text
Tool called: askUser with args {"question":"Which meme would you like me to explain?"}
```
<!--- KNIT example-basic-07.txt -->

Koog 에이전트 기능에 대한 자세한 내용은 [기능](../features/index.md)을 참조하세요.

## 다음 단계

- [그래프 기반 에이전트](graph-based-agents.md) 및 [함수형 에이전트](functional-agents.md) 구축에 대해 자세히 알아보기