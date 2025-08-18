[//]: # (title: 依存性注入)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="artifact_name" value="ktor-server-di" />

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-di</code>
</p>
</tldr>

依存性注入（DI）プラグインを使用すると、サービスと設定オブジェクトを一度登録し、それらをアプリケーションモジュール、プラグイン、ルート、およびプロジェクト全体の他のコンポーネントに注入できます。Ktor の DI は、既存のアプリケーションライフサイクルと自然に統合するように設計されており、スコープと構造化された設定を標準でサポートしています。

## 依存関係の追加

DI を使用するには、ビルドスクリプトに `%artifact_name%` アーティファクトを含めます。

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 基本的な依存関係の登録

ラムダ、関数参照、またはコンストラクター参照を使用して依存関係を登録できます。

```kotlin
dependencies {
    // ラムダベース
    provide<GreetingService> { GreetingServiceImpl() }

    // 関数参照
    provide<GreetingService>(::GreetingServiceImpl)
    provide(BankServiceImpl::class)
    provide(::createBankTeller)

    // ラムダを依存関係として登録
    provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

## 設定ベースの依存関係登録

設定ファイルでクラスパス参照を使用して、依存関係を宣言的に構成できます。これは関数参照とクラス参照の両方をサポートします。

```yaml
# application.yaml
ktor:
  application:
    dependencies:
      - com.example.RepositoriesKt.provideDatabase
      - com.example.UserRepository
database:
  connectionUrl: postgres://localhost:3037/admin
```

```kotlin
// Repositories.kt
fun provideDatabase(@Property("database.connectionUrl") connectionUrl: String): Database =
  PostgresDatabase(connectionUrl)

class UserRepository(val db: Database) {
  // 実装
}
```

Ktor は DI コンテナを使用してコンストラクターと関数のパラメーターを自動的に解決します。型だけでは値を区別するのに不十分な場合など、特殊なケースでパラメーターをオーバーライドしたり明示的にバインドしたりするために、`@Property` や `@Named` のようなアノテーションを使用できます。省略された場合、Ktor は DI コンテナを使用して型でパラメーターを解決しようとします。

## 依存関係の解決と注入

### 依存関係の解決

依存関係を解決するには、プロパティ委譲または直接解決を使用できます。

```kotlin
// プロパティ委譲を使用
val service: GreetingService by dependencies

// 直接解決
val service = dependencies.resolve<GreetingService>()
```

### 非同期依存関係の解決

非同期ロードをサポートするには、中断関数を使用できます。

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection: EventsConnection = dependencies.resolve() // 提供されるまで中断
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI プラグインは、すべての依存関係が準備できるまで `resolve()` 呼び出しを自動的に中断します。

### アプリケーションモジュールへの注入

モジュール関数でパラメーターを指定することにより、依存関係をアプリケーションモジュールに直接注入できます。Ktor は型の一致に基づいて DI コンテナからこれらの依存関係を解決します。

まず、設定の `dependencies` セクションで依存関係プロバイダーを登録します。

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt.stdout
    modules:
      - com.example.LoggingKt.logging
```

依存関係プロバイダーとモジュール関数は次のようになります。

```kotlin
// com.example.PrintStreamProvider.kt
fun stdout(): () -> PrintStream = { System.out }
```

```kotlin
// com.example.Logging.kt
fun Application.logging(printStreamProvider: () -> PrintStream) {
    dependencies {
        provide<Logger> { SimpleLogger(printStreamProvider()) }
    }
}
```

特定のキー付き依存関係を注入する際に `@Named` を使用します。

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // 「mongo」という名前の依存関係を使用
}
```

### プロパティと設定の注入

`@Property` を使用して、設定値を直接注入します。

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

これにより、構造化された設定の扱いが簡素化され、プリミティブ型の自動解析をサポートします。

## 高度な依存関係機能

### オプションおよび Null許容の依存関係

オプションの依存関係を適切に処理するために、Null許容型を使用します。

```kotlin
// プロパティ委譲を使用
val config: Config? by dependencies

// または直接解決
val config = dependencies.resolve<Config?>()
```

### 共変ジェネリクス

Ktor の DI システムは型共変性をサポートしており、型パラメーターが共変である場合に、値をそのスーパータイプの1つとして注入できます。これはサブタイプを扱うコレクションやインターフェースに特に役立ちます。

```kotlin
dependencies {
  provide<List<String>> { listOf("one", "two") }
}

// 型パラメーターの共変性サポートにより、これは機能します
val stringList: List<CharSequence> by dependencies
// これも機能します
val stringCollection: Collection<CharSequence> by dependencies
```

共変性は非ジェネリックのスーパータイプでも機能します。

```kotlin
dependencies {
    provide<BufferedOutputStream> { BufferedOutputStream(System.out) }
}

// BufferedOutputStream が OutputStream のサブタイプであるため、これは機能します
val outputStream: OutputStream by dependencies
```

#### 制限事項

DI システムはジェネリック型の共変性をサポートしていますが、現在のところ、型引数のサブタイプ間でパラメーター化された型を解決することはサポートしていません。つまり、登録された型よりも具体的または一般的な型を使用して依存関係を取得することはできません。

たとえば、次のコードは解決されません。

```kotlin
dependencies {
    provide<Sink<CharSequence>> { CsqSink() }
}

// 解決されません
val charSequenceSink: Sink<String> by dependencies
```

## リソースのライフサイクル管理

DI プラグインは、アプリケーションがシャットダウンするときに、ライフサイクルとクリーンアップを自動的に処理します。

### AutoCloseable のサポート

デフォルトでは、`AutoCloseable` を実装するすべての依存関係は、アプリケーションが停止したときに自動的に閉じられます。

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // 接続を閉じ、リソースを解放
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### カスタムクリーンアップロジック

`cleanup` 関数を指定することで、カスタムクリーンアップロジックを定義できます。

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### キーによるスコープ付きクリーンアップ

`key` を使用して、名前付きリソースとそのクリーンアップを管理します。

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

依存関係は、適切なティアダウンを確実にするため、宣言の逆順でクリーンアップされます。

## 依存性注入を使用したテスト

DI プラグインは、テストを簡素化するツールを提供します。アプリケーションモジュールをロードする前に依存関係をオーバーライドできます。

```kotlin
fun test() = testApplication {
  application {
    dependencies.provide<MyService> {
      MockService()
    }
    loadServices()
  }
}
```

### テストでの設定のロード

`configure()` を使用して、テストで設定ファイルを簡単にロードできます。

```kotlin
fun test() = testApplication {
  // デフォルトの設定ファイルパスからプロパティをロード
  configure()
  // 複数のファイルをオーバーライドしてロード
  configure("root-config.yaml", "test-overrides.yaml")
}
```

競合する宣言はテストエンジンによって無視され、これにより自由にオーバーライドできます。