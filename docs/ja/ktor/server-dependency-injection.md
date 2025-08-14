[//]: # (title: 依存性注入)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="artifact_name" value="ktor-server-di" />

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-di</code>
</p>
</tldr>

依存性注入（DI）プラグインを使用すると、サービスと設定オブジェクトを一度登録するだけで、アプリケーションモジュール、プラグイン、ルート、およびプロジェクト全体の他のコンポーネントに注入できます。KtorのDIは、既存のアプリケーションライフサイクルと自然に統合されるように設計されており、スコープと構造化された設定をすぐに利用できます。

## 依存関係の追加

DIを使用するには、ビルドスクリプトに `%artifact_name%` アーティファクトを含めます。

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 依存関係の基本的な登録

ラムダ、関数参照、またはコンストラクタ参照を使用して依存関係を登録できます。

```kotlin
dependencies {
    // Lambda-based
    provide<GreetingService> { GreetingServiceImpl() }

    // Function references
    provide<GreetingService>(::GreetingServiceImpl)
    provide(BankServiceImpl::class)
    provide(::createBankTeller)

    // Registering a lambda as a dependency
    provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

## 設定ファイルベースの依存関係登録

設定ファイル内でクラスパス参照を使用して、依存関係を宣言的に設定できます。これは関数参照とクラス参照の両方をサポートしています。

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
  // implementation 
}
```

Ktorは、DIコンテナを使用してコンストラクタおよび関数のパラメータを自動的に解決します。型だけでは値を区別するのに十分ではない場合など、特殊なケースでは、`@Property`や`@Named`のようなアノテーションを使用してパラメータをオーバーライドしたり明示的にバインドしたりできます。省略された場合、KtorはDIコンテナを使用して型によってパラメータを解決しようとします。

## 依存関係の解決と注入

### 依存関係の解決

依存関係を解決するには、プロパティデリゲーションまたは直接解決を使用できます。

```kotlin
// Using property delegation
val service: GreetingService by dependencies

// Direct resolution
val service = dependencies.resolve<GreetingService>()
```

### 非同期の依存関係解決

非同期ロードをサポートするために、suspend関数を使用できます。

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection: EventsConnection = dependencies.resolve() // suspends until provided
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DIプラグインは、すべての依存関係が準備できるまで、自動的に`resolve()`呼び出しをサスペンドします。

### アプリケーションモジュールへの注入

モジュール関数でパラメータを指定することで、依存関係をアプリケーションモジュールに直接注入できます。Ktorは、型の一致に基づいてDIコンテナからこれらの依存関係を解決します。

まず、設定の`dependencies`セクションに依存関係プロバイダーを登録します。

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

特定のキーが付けられた依存関係を注入するには、`@Named`を使用します。

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // Uses the dependency named "mongo"
}
```

### プロパティと設定の注入

`@Property`を使用して設定値を直接注入します。

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

これにより、構造化された設定の操作が簡素化され、プリミティブ型の自動解析がサポートされます。

## 高度な依存関係機能

### オプションとnull許容の依存関係

オプションの依存関係を適切に処理するために、null許容型を使用します。

```kotlin
// Using property delegation
val config: Config? by dependencies

// Or direct resolution
val config = dependencies.resolve<Config?>()
```

### 共変ジェネリクス

KtorのDIシステムは型共変性をサポートしており、型パラメータが共変である場合、値をそのスーパークラス型の一つとして注入できます。これは、サブタイプで機能するコレクションやインターフェースにとって特に便利です。

```kotlin
dependencies {
  provide<List<String>> { listOf("one", "two") }
}

// 型パラメータの共変性サポートにより、これは機能します
val stringList: List<CharSequence> by dependencies
// これも機能します
val stringCollection: Collection<CharSequence> by dependencies
```

共変性は、非ジェネリックなスーパークラス型でも機能します。

```kotlin
dependencies {
    provide<BufferedOutputStream> { BufferedOutputStream(System.out) }
}

// BufferedOutputStreamはOutputStreamのサブタイプであるため、これは機能します
val outputStream: OutputStream by dependencies
```

#### 制限事項

DIシステムはジェネリック型の共変性をサポートしていますが、現在のところ、型引数のサブタイプをまたぐパラメータ化された型の解決はサポートしていません。つまり、登録された型よりも具体的または一般的な型を使用して依存関係を取得することはできません。

たとえば、次のコードは解決されません。

```kotlin
dependencies {
    provide<Sink<CharSequence>> { CsqSink() }
}

// 解決されません
val charSequenceSink: Sink<String> by dependencies
```

## リソースのライフサイクル管理

DIプラグインは、アプリケーションがシャットダウンする際にライフサイクルとクリーンアップを自動的に処理します。

### AutoCloseableのサポート

デフォルトでは、`AutoCloseable`を実装する依存関係は、アプリケーションが停止すると自動的に閉じられます。

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // Close connections, release resources
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### カスタムクリーンアップロジック

`cleanup`関数を指定することで、カスタムのクリーンアップロジックを定義できます。

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### キーによるスコープ付きクリーンアップ

`key`を使用して、名前付きリソースとそのクリーンアップを管理します。

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

依存関係は、適切なティアダウンを確実にするため、宣言の逆順でクリーンアップされます。

## 依存性注入によるテスト

DIプラグインは、テストを簡素化するためのツールを提供します。アプリケーションモジュールをロードする前に依存関係をオーバーライドできます。

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

`configure()`を使用して、テストで設定ファイルを簡単にロードできます。

```kotlin
fun test() = testApplication {
  // Load properties from the default config file path
  configure()
  // Load multiple files with overrides
  configure("root-config.yaml", "test-overrides.yaml")
}
```

競合する宣言はテストエンジンによって無視され、自由にオーバーライドできます。