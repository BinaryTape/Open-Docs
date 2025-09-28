# Unity + Koog: Kotlinエージェントでゲームを動かす

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/UnityMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/UnityMcp.ipynb
){ .md-button }

このノートブックでは、Model Context Protocol (MCP) を使用してKoogでUnityに精通したAIエージェントを構築する手順を説明します。Unity MCPサーバーに接続し、ツールを検出し、LLMで計画を立て、開いているシーンに対してアクションを実行します。

> 前提条件
> - Unity-MCPサーバープラグインがインストールされたUnityプロジェクト
> - JDK 17以降
> - 環境変数 `OPENAI_API_KEY` に設定されたOpenAI APIキー

```kotlin
%useLatestDescriptors
%use koog

```

```kotlin
lateinit var process: Process

```

## 1) OpenAI APIキーを提供する
APIキーは環境変数 `OPENAI_API_KEY` から読み込まれるため、ノートブックからシークレットを分離できます。

```kotlin
val token = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")
val executor = simpleOpenAIExecutor(token)
```

## 2) Unityエージェントを構成する
Unity向けに、コンパクトなシステムプロンプトとエージェント設定を定義します。

```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt("cook_agent_system_prompt") {
        system {
            "You are a Unity assistant. You can execute different tasks by interacting with tools from the Unity engine."
        }
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 1000
)
```

```kotlin

```

## 3) Unity MCPサーバーを起動する
UnityプロジェクトディレクトリからUnity MCPサーバーを起動し、stdio経由で接続します。

```kotlin
// https://github.com/IvanMurzak/Unity-MCP
val pathToUnityProject = "path/to/unity/project"
val process = ProcessBuilder(
    "$pathToUnityProject/com.ivanmurzak.unity.mcp.server/bin~/Release/net9.0/com.IvanMurzak.Unity.MCP.Server",
    "60606"
).start()
```

## 4) Koogから接続してエージェントを実行する
Unity MCPサーバーからツールを検出し、小さなプラン優先戦略を構築し、開いているシーンを変更するためにツールのみを使用するエージェントを実行します。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    // MCPサーバーのツールでToolRegistryを作成します
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultStdioTransport(process)
    )

    toolRegistry.tools.forEach {
        println(it.name)
        println(it.descriptor)
    }

    val strategy = strategy<String, String>("unity_interaction") {
        val nodePlanIngredients by nodeLLMRequest(allowToolCalls = false)
        val interactionWithUnity by subgraphWithTask<String, String>(
            // プランで作業
            tools = toolRegistry.tools,
        ) { input ->
            "Start interacting with Unity according to the plan: $input"
        }

        edge(
            nodeStart forwardTo nodePlanIngredients transformed {
                "Create detailed plan for " + agentInput + "" +
                    "using the following tools: ${toolRegistry.tools.joinToString("
") {
                        it.name + "
description:" + it.descriptor
                    }}"
            }
        )
        edge(nodePlanIngredients forwardTo interactionWithUnity onAssistantMessage { true })
        edge(interactionWithUnity forwardTo nodeFinish)
    }

    val agent = AIAgent(
        promptExecutor = executor,
        strategy = strategy,
        agentConfig = agentConfig,
        toolRegistry = toolRegistry,
        installFeatures = {
            install(Tracing)

            install(EventHandler) {
                onBeforeAgentStarted { eventContext ->
                    println("OnBeforeAgentStarted first (strategy: ${strategy.name})")
                }

                onBeforeAgentStarted { eventContext ->
                    println("OnBeforeAgentStarted second (strategy: ${strategy.name})")
                }

                onAgentFinished { eventContext ->
                    println(
                        "OnAgentFinished (agent id: ${eventContext.agentId}, result: ${eventContext.result})"
                    )
                }
            }
        }
    )

    val result = agent.run(
        " extend current opened scene for the towerdefence game. " +
            "Add more placements for the towers, change the path for the enemies"
    )

    result
}
```

## 5) MCPプロセスをシャットダウンする
実行の最後には、必ず外部のUnity MCPサーバープロセスをクリーンアップしてください。

```kotlin
// Unity MCPプロセスをシャットダウンします
process.destroy()