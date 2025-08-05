# メモリ

## 機能概要

AgentMemory機能は、Koogフレームワークのコンポーネントであり、AIエージェントが会話を通じて情報を保存、取得、利用できるようにします。

### 目的

AgentMemory機能は、AIエージェントのインタラクションにおけるコンテキスト維持の課題に、以下の方法で対処します。

- 会話から抽出された重要な事実を保存する。
- コンセプト、サブジェクト、スコープによって情報を整理する。
- 将来のインタラクションで必要に応じて関連情報を取得する。
- ユーザーの好みと履歴に基づいてパーソナライズを可能にする。

### アーキテクチャ

AgentMemory機能は階層構造に基づいて構築されています。
この構造の要素は、以下のセクションでリストアップされ、説明されています。

#### ファクト

***ファクト***は、メモリに保存される個々の情報です。
ファクトは、実際に保存された情報を表します。
ファクトには2つのタイプがあります。

- **SingleFact**：コンセプトに関連付けられた単一の値。例えば、IDEユーザーの現在の推奨テーマ：
```kotlin
// Storing favorite IDE theme (single value)
val themeFact = SingleFact(
    concept = Concept(
        "ide-theme", 
        "User's preferred IDE theme", 
        factType = FactType.SINGLE),
    value = "Dark Theme",
    timestamp = DefaultTimeProvider.getCurrentTimestamp()
)
```
- **MultipleFacts**：コンセプトに関連付けられた複数の値。例えば、ユーザーが知っているすべての言語：
```kotlin
// Storing programming languages (multiple values)
val languagesFact = MultipleFacts(
    concept = Concept(
        "programming-languages",
        "Languages the user knows",
        factType = FactType.MULTIPLE
    ),
    values = listOf("Kotlin", "Java", "Python"),
    timestamp = DefaultTimeProvider.getCurrentTimestamp()
)
```

#### コンセプト

***コンセプト***は、関連するメタデータを持つ情報のカテゴリです。

- **キーワード**：コンセプトの一意な識別子。
- **説明**：そのコンセプトが何を表すかの詳細な説明。
- **ファクトタイプ**：コンセプトが単一のファクト（`FactType.SINGLE`）または複数のファクト（`FactType.MULTIPLE`）を保存するかどうか。

#### サブジェクト

***サブジェクト***は、ファクトを関連付けることができるエンティティです。

サブジェクトの一般的な例は次のとおりです。

- **ユーザー**：個人の好みと設定
- **環境**：アプリケーションの環境に関連する情報

すべてのファクトのデフォルトサブジェクトとして使用できる、事前定義された`MemorySubject.Everything`があります。
さらに、`MemorySubject`抽象クラスを拡張することで、独自のカスタムメモリーサブジェクトを定義できます。

```kotlin
object MemorySubjects {
    /**
     * ローカルマシン環境に特化した情報
     * 例：インストールされているツール、SDK、OS構成、利用可能なコマンド
     */
    @Serializable
    data object Machine : MemorySubject() {
        override val name: String = "machine"
        override val promptDescription: String =
            "Technical environment (installed tools, package managers, packages, SDKs, OS, etc.)"
        override val priorityLevel: Int = 1
    }
}
```
#### スコープ

***メモリースコープ***は、ファクトが関連するコンテキストです。

- **エージェント**：エージェントに固有のもの。
- **機能**：機能に固有のもの。
- **製品**：製品に固有のもの。
- **クロスプロダクト**：複数の製品間で関連するもの。

## 構成と初期化

この機能は、`AgentMemory`クラスを通じてエージェントパイプラインと統合されており、ファクトを保存およびロードするためのメソッドを提供し、エージェント設定で機能としてインストールできます。

### 構成

`AgentMemory.Config`クラスは、AgentMemory機能の構成クラスです。

```kotlin
class Config : FeatureConfig() {
    var memoryProvider: AgentMemoryProvider = NoMemory
    var scopesProfile: MemoryScopesProfile = MemoryScopesProfile()

    var agentName: String
    var featureName: String
    var organizationName: String
    var productName: String
}
```

### インストール

エージェントにAgentMemory機能をインストールするには、以下のコードサンプルで提供されているパターンに従ってください。

```kotlin
val agent = AIAgent(...) {
    install(AgentMemory) {
        memoryProvider = memoryProvider
        agentName = "your-agent-name"
        featureName = "your-feature-name"
        organizationName = "your-organization-name"
        productName = "your-product-name"
    }
}
```

## 例とクイックスタート

### 基本的な使い方

以下のコードスニペットは、メモリストレージの基本的な設定と、ファクトがメモリに保存されロードされる方法を示しています。

1.  メモリストレージを設定する
```kotlin
// Create a memory provider
val memoryProvider = LocalFileMemoryProvider(
    config = LocalMemoryConfig("customer-support-memory"),
    storage = SimpleStorage(JVMFileSystemProvider.ReadWrite),
    fs = JVMFileSystemProvider.ReadWrite,
    root = Path("path/to/memory/root")
)
```

2.  ファクトをメモリに保存する
```kotlin
memoryProvider.save(
    fact = SingleFact(
        concept = Concept("greeting", "User's name", FactType.SINGLE),
        value = "John",
        timestamp = DefaultTimeProvider.getCurrentTimestamp()
    ),
    subject = MemorySubject.User
)
```
3.  ファクトを取得する
```kotlin
// Get the stored information
try {
    val greeting = memoryProvider.load(
        concept = Concept("greeting", "User's name", FactType.SINGLE),
        subject = MemorySubjects.User
    )
    println("Retrieved: $greeting")
} catch (e: MemoryNotFoundException) {
    println("Information not found. First time here?")
} catch (e: Exception) {
    println("Error accessing memory: ${e.message}")
}
```

#### メモリノードの使用

AgentMemory機能は、エージェント戦略で使用できる以下の事前定義されたメモリーノードを提供します。

*   [nodeLoadAllFactsFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-all-facts-from-memory.html)：指定されたコンセプトについて、サブジェクトに関するすべてのファクトをメモリからロードします。
*   [nodeLoadFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-from-memory.html)：指定されたコンセプトについて、特定のファクトをメモリからロードします。
*   [nodeSaveToMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory.html)：ファクトをメモリに保存します。
*   [nodeSaveToMemoryAutoDetectFacts](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory-auto-detect-facts.html)：チャット履歴からファクトを自動的に検出し抽出し、それらをメモリに保存します。LLMを使用してコンセプトを識別します。

以下は、エージェント戦略でノードを実装する方法の例です。

```kotlin
val strategy = strategy("example-agent") {
        // Node to automatically detect and save facts
        val detectFacts by nodeSaveToMemoryAutoDetectFacts<Unit>(
            subjects = listOf(MemorySubjects.User, MemorySubjects.Project)
        )

        // Node to load specific facts
        val loadPreferences by node<Unit, Unit> {
            withMemory {
                loadFactsToAgent(
                    concept = Concept("user-preference", "User's preferred programming language", FactType.SINGLE),
                    subjects = listOf(MemorySubjects.User)
                )
            }
        }

        // Connect nodes in the strategy
        edge(nodeStart forwardTo detectFacts)
        edge(detectFacts forwardTo loadPreferences)
        edge(loadPreferences forwardTo nodeFinish)
}
```

#### メモリを安全にする

メモリプロバイダーが使用する暗号化されたストレージ内で機密情報が保護されることを確実にするために、暗号化を使用できます。

```kotlin
// Simple encrypted storage setup
val secureStorage = EncryptedStorage(
    fs = JVMFileSystemProvider.ReadWrite,
    encryption = Aes256GCMEncryption("your-secret-key")
)
```

#### 例：ユーザーの好みを記憶する

ここでは、AgentMemoryが実際のシナリオで、ユーザーの好み、特にユーザーのお気に入りのプログラミング言語を記憶するためにどのように使用されるかの例を示します。

```kotlin
memoryProvider.save(
    fact = SingleFact(
        concept = Concept("preferred-language", "What programming language is preferred by the user?", FactType.SINGLE),
        value = "Kotlin",
        timestamp = DefaultTimeProvider.getCurrentTimestamp()
    ),
    subject = MemorySubjects.User
)
```

### 高度な使い方

#### メモリを持つカスタムノード

任意のノード内で`withMemory`句からメモリを使用することもできます。すぐに使える`loadFactsToAgent`および`saveFactsFromHistory`という高レベルの抽象化は、履歴にファクトを保存し、そこからファクトをロードし、LLMチャットを更新します。

```kotlin
val loadProjectInfo by node<Unit, Unit> {
    withMemory {
        loadFactsToAgent(Concept("project-structure", ...))
    }
}

val saveProjectInfo by node<Unit, Unit> {
    withMemory {
        saveFactsFromHistory(Concept("project-structure", ...))
    }
}
```

#### ファクトの自動検出

`nodeSaveToMemoryAutoDetectFacts`メソッドを使用して、LLMにエージェントの履歴からすべてのファクトを検出するよう依頼することもできます。

```kotlin
val saveAutoDetect by nodeSaveToMemoryAutoDetectFacts<Unit>(
    subjects = listOf(MemorySubjects.User, MemorySubjects.Project)
)
```
上記の例では、LLMはユーザー関連のファクトとプロジェクト関連のファクトを検索し、コンセプトを決定し、それらをメモリに保存します。

## ベストプラクティス

1.  **シンプルに始める**
    -   暗号化なしの基本的なストレージから始める
    -   複数のファクトに移行する前に単一のファクトを使用する

2.  **よく整理する**
    -   明確なコンセプト名を使用する
    -   役立つ説明を追加する
    -   関連情報を同じサブジェクトの下に保持する

3.  **エラーを処理する**
   ```kotlin
   try {
       memoryProvider.save(fact, subject)
   } catch (e: Exception) {
       println("Oops! Couldn't save: ${e.message}")
   }
   ```
   エラー処理の詳細については、「[エラー処理とエッジケース](#error-handling-and-edge-cases)」を参照してください。

## エラー処理とエッジケース

AgentMemory機能には、エッジケースを処理するためのいくつかのメカニズムが含まれています。

1.  **NoMemoryプロバイダー**：何も保存しないデフォルトの実装で、メモリプロバイダーが指定されていない場合に使用されます。

2.  **サブジェクトの優先順位付け**：ファクトをロードする際、この機能は、定義された`priorityLevel`に基づいて、より具体的なサブジェクトからのファクトを優先します。

3.  **スコープフィルタリング**：関連情報のみがロードされるように、ファクトをスコープでフィルタリングできます。

4.  **タイムスタンプ追跡**：ファクトは、いつ作成されたかを追跡するためにタイムスタンプとともに保存されます。

5.  **ファクトタイプ処理**：この機能は、単一ファクトと複数ファクトの両方をサポートし、各タイプに適切な処理を行います。

## APIドキュメント

AgentMemory機能に関連する完全なAPIリファレンスについては、[agents-features-memory](https://api.koog.ai/agents/agents-features/agents-features-memory/index.html)モジュールのリファレンスドキュメントを参照してください。

特定のパッケージのAPIドキュメント：

-   [ai.koog.agents.local.memory.feature](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature/index.html)：`AgentMemory`クラスとAIエージェントメモリ機能のコア実装が含まれます。
-   [ai.koog.agents.local.memory.feature.nodes](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/index.html)：サブグラフで使用できる事前定義されたメモリ関連ノードが含まれます。
-   [ai.koog.agents.local.memory.config](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.config/index.html)：メモリ操作に使用されるメモリースコープの定義を提供します。
-   [ai.koog.agents.local.memory.model](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.model/index.html)：エージェントが異なるコンテキストや期間にわたって情報を保存、整理、取得できるようにするコアデータ構造とインターフェースの定義が含まれます。
-   [ai.koog.agents.local.memory.feature.history](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.history/index.html)：過去のセッション活動または保存されたメモリから特定のコンセプトに関する事実情報を取得し組み込むための履歴圧縮戦略を提供します。
-   [ai.koog.agents.local.memory.providers](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.providers/index.html)：構造化されたコンテキストアウェアな方法で知識を保存および取得するための基本的な操作を定義するコアインターフェースとその実装を提供します。
-   [ai.koog.agents.local.memory.storage](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.storage/index.html)：異なるプラットフォームおよびストレージバックエンドでのファイル操作のためのコアインターフェースと特定の実装を提供します。

## よくある質問とトラブルシューティング

### カスタムメモリプロバイダーを実装するにはどうすればよいですか？

カスタムメモリプロバイダーを実装するには、`AgentMemoryProvider`インターフェースを実装するクラスを作成します。

```kotlin
class MyCustomMemoryProvider : AgentMemoryProvider {
    override suspend fun save(fact: Fact, subject: MemorySubject, scope: MemoryScope) {
        // Implementation for saving facts
    }

    override suspend fun load(concept: Concept, subject: MemorySubject, scope: MemoryScope): List<Fact> {
        // Implementation for loading facts by concept
    }

    override suspend fun loadAll(subject: MemorySubject, scope: MemoryScope): List<Fact> {
        // Implementation for loading all facts
    }

    override suspend fun loadByDescription(
        description: String,
        subject: MemorySubject,
        scope: MemoryScope
    ): List<Fact> {
        // Implementation for loading facts by description
    }
}
```

### 複数のサブジェクトからロードする際、ファクトはどのように優先されますか？

ファクトはサブジェクトの特異性に基づいて優先されます。ファクトをロードする際、同じコンセプトが複数のサブジェクトからのファクトを持つ場合、最も具体的なサブジェクトからのファクトが使用されます。

### 同じコンセプトに複数の値を保存できますか？

はい、`MultipleFacts`タイプを使用することで可能です。コンセプトを定義する際に、`factType`を`FactType.MULTIPLE`に設定します。

```kotlin
val concept = Concept(
    keyword = "user-skills",
    description = "Programming languages the user is skilled in",
    factType = FactType.MULTIPLE
)
```

これにより、コンセプトに複数の値を保存でき、それらはリストとして取得されます。