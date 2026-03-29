# アノテーションベースのツール

アノテーションベースのツールは、Kotlin と Java の両方において、関数やメソッドを大規模言語モデル（LLM）用のツールとして公開するための宣言的な手法を提供します。
アノテーションを使用することで、あらゆる関数やメソッドを LLM が理解して利用できるツールに変換できます。

このアプローチは、ツールの説明を手動で実装することなく、Kotlin または Java の既存の機能を LLM に公開する必要がある場合に便利です。

!!! note
    アノテーションベースのツールは JVM 専用であり、他のプラットフォームでは利用できません。マルチプラットフォーム対応については、[クラスベースのツール API](class-based-tools.md) を使用してください。

## 主要なアノテーション

プロジェクトでアノテーションベースのツールの使用を開始するには、以下の主要なアノテーションを理解する必要があります。

| アノテーション | 説明 |
|-------------------|-------------------------------------------------------------------------|
| `@Tool`           | LLM にツールとして公開する関数をマークします。 |
| `@LLMDescription` | ツールとそのコンポーネントに関する説明情報を提供します。 |

## @Tool アノテーション

`@Tool` アノテーションは、LLM にツールとして公開する Kotlin の関数、または Java のメソッドをマークするために使用されます。
`@Tool` でアノテーションされた関数およびメソッドは、`ToolSet` インターフェースを実装するオブジェクトからリフレクションによって収集されます。詳細は、[ToolSet インターフェースの実装](#1-toolset-インターフェースの実装) を参照してください。

### 定義

```kotlin
@Target(AnnotationTarget.FUNCTION)
public annotation class Tool(val customName: String = "")
```
<!--- KNIT example-annotation-based-tools-01.txt -->

### パラメータ

| <div style="width:100px">名前</div> | 必須 | 説明 |
|-------------------------------------|----------|------------------------------------------------------------------------------------------|
| `customName`                        | いいえ | ツールのカスタム名を指定します。指定しない場合は、関数名が使用されます。 |

### 使用方法

関数またはメソッドをツールとしてマークするには、`ToolSet` インターフェースを実装するクラス内の関数またはメソッドに `@Tool` アノテーションを適用します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    -->
    ```kotlin
    class MyToolSet : ToolSet {
        @Tool
        fun myTool(): String {
            // ツールの実装
            return "Result"
        }
    
        @Tool(customName = "customToolName")
        fun anotherTool(): String {
            // ツールの実装
            return "Result"
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    public class MyToolSet implements ToolSet {
        @Tool
        public String myTool() {
            // ツールの実装
            return "Result";
        }
    
        @Tool(customName = "customToolName")
        public String anotherTool() {
            // ツールの実装
            return "Result";
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-java-01.java -->

## @LLMDescription アノテーション

`@LLMDescription` アノテーションは、コード要素（クラス、関数、メソッド、パラメータなど）に関する説明情報を LLM に提供します。
これにより、LLM がこれらの要素の目的や使用方法を理解するのに役立ちます。

### 定義

```kotlin
@Target(
    AnnotationTarget.PROPERTY,
    AnnotationTarget.CLASS,
    AnnotationTarget.TYPE,
    AnnotationTarget.VALUE_PARAMETER,
    AnnotationTarget.FUNCTION
)
public annotation class LLMDescription(val description: String)
```
<!--- KNIT example-annotation-based-tools-02.txt -->

### パラメータ

| 名前 | 必須 | 説明 |
|---------------|----------|------------------------------------------------|
| `description` | はい | アノテーションされた要素を説明する文字列。 |

### 使用方法

`@LLMDescription` アノテーションは、さまざまなレベルで適用できます。例：

* 関数レベル：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    -->
    ```kotlin
    @Tool
    @LLMDescription("特定の操作を実行し、結果を返します")
    fun myTool(): String {
        // 関数の実装
        return "Result"
    }
    ```
    <!--- KNIT example-annotation-based-tools-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    @Tool
    @LLMDescription(description = "特定の操作を実行し、結果を返します")
    public String myTool() {
        // 関数の実装
        return "Result";
    }
    ```
    <!--- KNIT example-annotation-based-tools-java-02.java -->

    
* パラメータレベル：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    -->
    ```kotlin
    @Tool
    @LLMDescription("入力データを処理します")
    fun processTool(
        @LLMDescription("処理する入力データ")
        input: String,
    
        @LLMDescription("オプションの構成パラメータ")
        config: String = ""
    ): String {
        // 関数の実装
        return "Processed: $input with config: $config"
    }
    ```
    <!--- KNIT example-annotation-based-tools-03.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    @Tool
    @LLMDescription(description = "入力データを処理します")
    public String processTool(
            @LLMDescription(description = "処理する入力データ") String input,
            @LLMDescription(description = "オプションの構成パラメータ") String config
    ) {
        // 関数の実装
        return "Processed: " + input + " with config: " + config;
    }
    ```
    <!--- KNIT example-annotation-based-tools-java-03.java -->

## ツールの作成手順

### 1. ToolSet インターフェースの実装

[`ToolSet`](api:agents-tools::ai.koog.agents.core.tools.reflect.ToolSet) インターフェースを実装するクラスを作成します。
このインターフェースは、そのクラスがツールのコンテナであることを示します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.reflect.ToolSet
    -->
    ```kotlin
    class MyFirstToolSet : ToolSet {
        // ここにツールを記述します
    }
    ```
    <!--- KNIT example-annotation-based-tools-04.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    public class MyFirstToolSet implements ToolSet {
        // ここにツールを記述します
    }
    ```
    <!--- KNIT example-annotation-based-tools-java-04.java -->

### 2. ツール関数の追加

クラスに関数またはメソッドを追加し、`@Tool` アノテーションを付けてツールとして公開します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    -->
    ```kotlin
    class MyFirstToolSet : ToolSet {
        @Tool
        fun getWeather(location: String): String {
            // 実際の実装では、ここで天気 API を呼び出します
            return "The weather in $location is sunny and 72°F"
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-05.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    public class MyFirstToolSet implements ToolSet {
        @Tool
        public String getWeather(String location) {
            // 実際の実装では、ここで天気 API を呼び出します
            return "The weather in " + location + " is sunny and 72°F";
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-java-05.java -->

### 3. 説明の追加

`@LLMDescription` アノテーションを追加して、LLM にコンテキストを提供します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.reflect.ToolSet
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    -->
    ```kotlin
    @LLMDescription("天気情報を取得するためのツール")
    class MyFirstToolSet : ToolSet {
        @Tool
        @LLMDescription("指定された場所の現在の天気を取得します")
        fun getWeather(
            @LLMDescription("都市と州/国")
            location: String
        ): String {
            // 実際の実装では、ここで天気 API を呼び出します
            return "The weather in $location is sunny and 72°F"
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-06.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    @LLMDescription(description = "天気情報を取得するためのツール")
    public class MyFirstToolSet implements ToolSet {
        @Tool
        @LLMDescription(description = "指定された場所の現在の天気を取得します")
        public String getWeather(
                @LLMDescription(description = "都市と州/国") String location
        ) {
            // 実際の実装では、ここで天気 API を呼び出します
            return "The weather in " + location + " is sunny and 72°F";
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-java-06.java -->

### 4. エージェントでツールを使用する

作成したツールをエージェントで使用できるようになります。

=== "Kotlin"
    
    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.example.exampleAnnotationBasedTools06.MyFirstToolSet
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    const val apiToken = ""
    -->
    ```kotlin
    fun main() {
        runBlocking {
            // ツールセットの作成
            val weatherTools = MyFirstToolSet()
    
            // ツールを組み込んだエージェントの作成
    
            val agent = AIAgent(
                promptExecutor = simpleOpenAIExecutor(apiToken),
                systemPrompt = "Provide weather information for a given location.",
                llmModel = OpenAIModels.Chat.GPT4o,
                toolRegistry = ToolRegistry {
                    tools(weatherTools)
                }
            )
    
            // エージェントが天気ツールを使用できるようになります
            agent.run("What's the weather like in New York?")
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-07.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    String apiToken = System.getenv("OPENAI_API_KEY");

    // ツールセットの作成
     MyFirstToolSet weatherTools = new MyFirstToolSet();

    ToolRegistry toolRegistry = ToolRegistry.builder()
        .tools(weatherTools)
        .build();

    // ツールを組み込んだエージェントの作成
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("Provide weather information for a given location.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .toolRegistry(toolRegistry)
        .build();

    // エージェントが天気ツールを使用できるようになります
    String result = agent.run("What's the weather like in New York?");
    System.out.println(result);
    ```
    <!--- KNIT example-annotation-based-tools-java-07.java -->

## 使用例

以下は、ツールアノテーションの実践的な例です。

### 基本的な例：スイッチコントローラー

この例では、スイッチを制御するためのシンプルなツールセットを示します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.reflect.ToolSet
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    class Switch(private var state: Boolean) {
        fun switch(state: Boolean) {
            this.state = state
        }
        fun isOn(): Boolean {
            return state
        }
    }
    -->
    ```kotlin
    @LLMDescription("スイッチを制御するためのツール")
    class SwitchTools(val switch: Switch) : ToolSet {
        @Tool
        @LLMDescription("スイッチの状態を切り替えます")
        fun switch(
            @LLMDescription("設定する状態（オンの場合は true、オフの場合は false）")
            state: Boolean
        ): String {
            switch.switch(state)
            return "Switched to ${if (state) "on" else "off"}"
        }
    
        @Tool
        @LLMDescription("スイッチの現在の状態を返します")
        fun switchState(): String {
            return "Switch is ${if (switch.isOn()) "on" else "off"}"
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-08.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    public class Switch {
        private boolean state;

        public Switch(boolean state) {
            this.state = state;
        }

        // "switch" は Java の予約語であるため、別のメソッド名を使用します
        public void setState(boolean state) {
            this.state = state;
        }

        public boolean isOn() {
            return state;
        }
    }
    
    @LLMDescription(description = "スイッチを制御するためのツール")
    public class SwitchTools implements ToolSet {
        private final Switch sw;

        public SwitchTools(Switch sw) {
            this.sw = sw;
        }

        @Tool
        @LLMDescription(description = "スイッチの状態を切り替えます")
        public String switchStateTo(
                @LLMDescription(description = "設定する状態（オンの場合は true、オフの場合は false）") boolean state
        ) {
            sw.setState(state);
            return "Switched to " + (state ? "on" : "off");
        }

        @Tool
        @LLMDescription(description = "スイッチの現在の状態を返します")
        public String switchState() {
            return "Switch is " + (sw.isOn() ? "on" : "off");
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-java-08.java -->

LLM がスイッチを制御する必要がある場合、提供された説明から以下の情報を理解できます。

- ツールの目的と機能。
- ツールを使用するために必要なパラメータ。
- 各パラメータの許容値。
- 実行時に期待される戻り値。

### 応用例：診断ツール

この例では、デバイス診断のためのより複雑なツールセットを示します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.reflect.ToolSet
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    -->
    ```kotlin
    @LLMDescription("デバイスの診断とトラブルシューティングを実行するためのツール")
    class DiagnosticToolSet : ToolSet {
        @Tool
        @LLMDescription("デバイスの診断を実行してステータスを確認し、問題を特定します")
        fun runDiagnostic(
            @LLMDescription("診断するデバイスの ID")
            deviceId: String,
    
            @LLMDescription("診断のための追加情報（オプション）")
            additionalInfo: String = ""
        ): String {
            // 実装
            return "Diagnostic results for device $deviceId"
        }
    
        @Tool
        @LLMDescription("エラーコードを分析して、その意味と可能な解決策を特定します")
        fun analyzeError(
            @LLMDescription("分析するエラーコード（例：'E1001'）")
            errorCode: String
        ): String {
            // 実装
            return "Analysis of error code $errorCode"
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-09.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    @LLMDescription(description = "デバイスの診断とトラブルシューティングを実行するためのツール")
    public class DiagnosticToolSet implements ToolSet {
        // 便利なオーバーロード（ツールとしては公開されません）
        public String runDiagnostic(String deviceId) {
            return runDiagnostic(deviceId, "");
        }
    
        @Tool
        @LLMDescription(description = "デバイスの診断を実行してステータスを確認し、問題を特定します")
        public String runDiagnostic(
                @LLMDescription(description = "診断するデバイスの ID") String deviceId,
                @LLMDescription(description = "診断のための追加情報（オプション）") String additionalInfo
        ) {
            // 実装
            return "Diagnostic results for device " + deviceId;
        }
    
        @Tool
        @LLMDescription(description = "エラーコードを分析して、その意味と可能な解決策を特定します")
        public String analyzeError(
                @LLMDescription(description = "分析するエラーコード（例：'E1001'）") String errorCode
        ) {
            // 実装
            return "Analysis of error code " + errorCode;
        }
    }
    ```
    <!--- KNIT example-annotation-based-tools-java-09.java -->

## ベストプラクティス

* **明確な説明を提供する**: ツール、パラメータ、戻り値の目的と動作を説明する、明確で簡潔な説明を記述してください。
* **すべてのパラメータを説明する**: すべてのパラメータに `@LLMDescription` を追加して、各パラメータが何のためにあるのかを LLM が理解できるようにします。
* **一貫した命名を使用する**: ツールとパラメータに一貫した命名規則を使用し、より直感的に理解できるようにします。
* **関連するツールをグループ化する**: 関連するツールを同じ `ToolSet` 実装にグループ化し、クラスレベルの説明を提供します。
* **有益な結果を返す**: ツールの戻り値が、操作の結果について明確な情報を提供していることを確認してください。
* **エラーを適切に処理する**: ツール内にエラー処理を含め、有益なエラーメッセージを返すようにします。
* **デフォルト値を文書化する**: パラメータにデフォルト値がある場合（Kotlin）やオーバーロードがある場合（Java）は、説明の中でその旨を記述してください。
* **ツールを特化させる**: 各ツールは、多くのことをこなそうとするのではなく、特定の定義されたタスクを実行するようにすべきです。

## 一般的な問題のトラブルシューティング

ツールアノテーションを使用する際に、いくつかの一般的な問題に遭遇することがあります。

### ツールが認識されない

エージェントがツールを認識しない場合は、以下を確認してください。

- クラスが `ToolSet` インターフェースを実装しているか。
- すべてのツール関数またはメソッドに `@Tool` アノテーションが付いているか。
- ツール関数またはメソッドが適切な戻り値の型を持っているか（シンプルにするために `String` が推奨されます）。
- ツールがエージェントに適切に登録されているか。

### ツールの説明が不明確

LLM がツールを正しく使用しない、または目的を誤解している場合は、以下を試してください。

- 可能な限りプリミティブなパラメータ型（Kotlin では `String`、`Boolean`、`Int`、Java では `String`、`boolean`、`int`）を使用する。
- パラメータの説明で期待される形式を明確に記述する。
- 複雑な型の場合は、特定の形式の `String` パラメータを使用することを検討し、ツール内でパースするようにします。
- パラメータの説明に有効な入力の例を含める。
- Java はデフォルトパラメータをサポートしていないことに注意してください。代わりにメソッドのオーバーロードを使用してください。

### パラメータ型の問題

LLM が正しくないパラメータ型を提供した場合は、以下を試してください。

- 可能な限りシンプルなパラメータ型（`String`、`Boolean`、`Int`）を使用する。
- パラメータの説明で期待される形式を明確に記述する。
- 複雑な型の場合は、特定の形式の `String` パラメータを使用することを検討し、ツール内でパースするようにします。
- パラメータの説明に有効な入力の例を含める。

### パフォーマンスの問題

ツールがパフォーマンスの問題を引き起こす場合は、以下を試してください。

- ツールの実装を軽量に保つ。
- リソースを大量に消費する操作の場合は、非同期処理の実装を検討する。
- 適切な場合に結果をキャッシュする。
- ツールの使用状況をログに記録し、ボトルネックを特定する。