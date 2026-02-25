[//]: # (title: 依存性注入)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="artifact_name" value="ktor-server-di" />

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:ktor-server-di</code>
</p>
</tldr>

依存性注入（DI）プラグインを使用すると、サービスや設定オブジェクトを一度登録するだけで、プロジェクト全体のアプリケーションモジュール、プラグイン、ルート、その他のコンポーネントに注入できるようになります。KtorのDIは、既存のアプリケーションライフサイクルと自然に統合されるように設計されており、標準でスコープ設定や構造化された構成をサポートしています。

## 依存関係の追加

DIを使用するには、ビルドスクリプトに `%artifact_name%` アーティファクトを含めます。

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

ラムダ、関数参照、またはコンストラクタ参照を使用して依存関係を登録できます。

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

## 設定ベースの依存関係の登録

設定ファイル内でクラスパス参照を使用して、宣言的に依存関係を構成できます。これは関数参照とクラス参照の両方をサポートしています。

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

Ktorは、DIコンテナを使用してコンストラクタと関数のパラメータを自動的に解決します。型だけでは値を区別できない場合など、特別なケースでパラメータをオーバーライドしたり明示的にバインドしたりするには、`@Property` や `@Named` などのアノテーションを使用できます。省略された場合、KtorはDIコンテナを使用して型によるパラメータの解決を試みます。

## 依存関係の解決と注入

### 依存関係の解決

依存関係を解決するには、プロパティ委譲または直接解決を使用できます。

```kotlin
// プロパティ委譲を使用する場合
val service: GreetingService by dependencies

// 直接解決する場合
val service = dependencies.resolve<GreetingService>()
```

### 非同期の依存関係の解決

非同期読み込みをサポートするために、suspend関数を使用できます。

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

DIプラグインは、すべての依存関係の準備が整うまで、`resolve()` の呼び出しを自動的にサスペンド（中断）します。

### アプリケーションモジュールへの注入

モジュール関数のパラメータを指定することで、依存関係をアプリケーションモジュールに直接注入できます。Ktorは、型マッチングに基づいてDIコンテナからこれらの依存関係を解決します。

まず、設定の `dependencies` セクションに依存関係プロバイダーを登録します。

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

特定のキーを持つ依存関係を注入するには、`@Named` を使用します。

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // "mongo" という名前の依存関係を使用
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

これにより、構造化された設定の扱いが簡素化され、プリミティブ型の自動パースもサポートされます。

## 高度な依存関係機能

### オプショナルおよび null 許容の依存関係

オプショナルな依存関係を適切に処理するには、null 許容型を使用します。

```kotlin
// プロパティ委譲を使用する場合
val config: Config? by dependencies

// または直接解決する場合
val config = dependencies.resolve<Config?>()
```

### 共変ジェネリクス

KtorのDIシステムは型の共変性をサポートしており、型パラメータが共変である場合に、値をそのスーパータイプの1つとして注入できます。これは、サブタイプを扱うコレクションやインターフェースにおいて特に有用です。

```kotlin
dependencies {
  provide<List<String>> { listOf("one", "two") }
}

// 型パラメータの共変性サポートにより、これは機能します
val stringList: List<CharSequence> by dependencies
// これも機能します
val stringCollection: Collection<CharSequence> by dependencies
```

共変性は、非ジェネリックなスーパータイプでも機能します。

```kotlin
dependencies {
    provide<BufferedOutputStream> { BufferedOutputStream(System.out) }
}

// BufferedOutputStream は OutputStream のサブタイプであるため、これは機能します
val outputStream: OutputStream by dependencies
```

#### 制限事項

DIシステムはジェネリック型の共変性をサポートしていますが、現在のところ、型引数のサブタイプにわたるパラメータ化された型の解決はサポートしていません。つまり、登録されたものよりも具体的、あるいはより一般的な型を使用して依存関係を取得することはできません。

例えば、次のコードは解決されません。

```kotlin
dependencies {
    provide<Sink<CharSequence>> { CsqSink() }
}

// 解決されません
val charSequenceSink: Sink<String> by dependencies
```

## リソースのライフサイクル管理

DIプラグインは、アプリケーションのシャットダウン時にライフサイクルとクリーンアップを自動的に処理します。

### AutoCloseable のサポート

デフォルトでは、`AutoCloseable` を実装するすべての依存関係は、アプリケーションの停止時に自動的にクローズされます。

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // 接続を閉じ、リソースを解放する
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### カスタムクリーンアップロジック

`cleanup` 関数を指定することで、カスタムのクリーンアップロジックを定義できます。

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### キーを使用したスコープ付きクリーンアップ

名前付きリソースとそのクリーンアップを管理するには、`key` を使用します。

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

適切なティアダウン（終了処理）を確実に行うため、依存関係は宣言された逆の順序でクリーンアップされます。

## 依存性注入を使用したテスト

DIプラグインはテストを簡素化するためのツールを提供します。アプリケーションモジュールを読み込む前に依存関係をオーバーライドできます。

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

### テストでの設定の読み込み

テストで設定ファイルを簡単に読み込むには、`configure()` を使用します。

```kotlin
fun test() = testApplication {
  // デフォルトの設定ファイルパスからプロパティを読み込む
  configure()
  // オーバーライドを含む複数のファイルを読み込む
  configure("root-config.yaml", "test-overrides.yaml")
}
```

競合する宣言はテストエンジンによって無視されるため、自由なオーバーライドが可能です。