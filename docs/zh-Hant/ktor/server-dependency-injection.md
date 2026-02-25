[//]: # (title: 相依注入)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="artifact_name" value="ktor-server-di" />

<tldr>
<p>
<b>必要的相依性</b>：<code>io.ktor:ktor-server-di</code>
</p>
</tldr>

相依注入（DI）外掛程式允許您註冊一次服務和配置物件，並將其注入到整個專案的應用程式模組、外掛程式、路由和其他組件中。Ktor 的 DI 旨在與其現有的應用程式生命週期自然整合，開箱即用支援作用域和結構化配置。

## 新增相依性

若要使用 DI，請在建置指令碼中包含 `%artifact_name%` 構件：

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

## 基礎相依性註冊

您可以使用 Lambda 運算式、函式參照或建構函式參照來註冊相依性：

```kotlin
dependencies {
    // 基於 Lambda
    provide<GreetingService> { GreetingServiceImpl() }

    // 函式參照
    provide<GreetingService>(::GreetingServiceImpl)
    provide(BankServiceImpl::class)
    provide(::createBankTeller)

    // 將 Lambda 註冊為相依性
    provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

## 基於配置的相依性註冊

您可以在配置檔案中使用類別路徑參照來宣告式地配置相依性。這支援函式和類別參照：

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
  // 實作 
}
```

Ktor 會使用 DI 容器自動解析建構函式和函式參數。您可以使用 `@Property` 或 `@Named` 等註解在特殊情況下（例如僅憑型別不足以區分值時）覆寫或明確繫結參數。如果省略，Ktor 將嘗試使用 DI 容器按型別解析參數。

## 相依性解析與注入

### 解析相依性

若要解析相依性，您可以使用屬性委派或直接解析：

```kotlin
// 使用屬性委派
val service: GreetingService by dependencies

// 直接解析
val service = dependencies.resolve<GreetingService>()
```

### 非同步相依性解析

為了支援非同步載入，您可以使用掛起函式：

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection: EventsConnection = dependencies.resolve() // 掛起直到提供為止
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 外掛程式將自動掛起 `resolve()` 呼叫，直到所有相依性準備就緒。

### 注入到應用程式模組

您可以透過在模組函式中指定參數，將相依性直接注入到應用程式模組中。Ktor 將根據型別比對從 DI 容器中解析這些相依性。

首先，在配置的 `dependencies` 區段註冊您的相依性提供者：

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt.stdout
    modules:
      - com.example.LoggingKt.logging
```

以下是相依性提供者和模組函式的樣子：

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

使用 `@Named` 來注入特定金鑰的相依性：

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // 使用名為 "mongo" 的相依性
}
```

### 屬性與配置注入

使用 `@Property` 直接注入配置值：

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

這簡化了結構化配置的處理，並支援基本型別的自動剖析。

## 進階相依性功能

### 選用與可為 null 的相依性

使用可為 null 的型別來優雅地處理選用相依性：

```kotlin
// 使用屬性委派
val config: Config? by dependencies

// 或直接解析
val config = dependencies.resolve<Config?>()
```

### 協變泛型

Ktor 的 DI 系統支援型別協變，當型別參數是協變時，允許將值作為其父型別之一注入。這對於處理子型別的集合和介面特別有用。

```kotlin
dependencies {
  provide<List<String>> { listOf("one", "two") }
}

// 由於支援型別參數協變，這將可以運作
val stringList: List<CharSequence> by dependencies
// 這也可以運作
val stringCollection: Collection<CharSequence> by dependencies
```

協變也適用於非泛型父型別：

```kotlin
dependencies {
    provide<BufferedOutputStream> { BufferedOutputStream(System.out) }
}

// 這可以運作，因為 BufferedOutputStream 是 OutputStream 的子型別
val outputStream: OutputStream by dependencies
```

#### 限制

雖然 DI 系統支援泛型型別的協變，但它目前不支援跨型別引數子型別解析參數化型別。這意味著您無法使用比註冊時更具體或更通用的型別來擷取相依性。

例如，以下程式碼將無法解析：

```kotlin
dependencies {
    provide<Sink<CharSequence>> { CsqSink() }
}

// 將無法解析
val charSequenceSink: Sink<String> by dependencies
```

## 資源生命週期管理

當應用程式關閉時，DI 外掛程式會自動處理生命週期和清理。

### AutoCloseable 支援

預設情況下，任何實作 `AutoCloseable` 的相依性都會在應用程式停止時自動關閉：

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // 關閉連線，釋放資源
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### 自訂清理邏輯

您可以透過指定 `cleanup` 函式來定義自訂清理邏輯：

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### 使用金鑰進行作用域清理

使用 `key` 來管理具名資源及其清理：

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

相依性將按宣告的相反順序進行清理，以確保正確的拆卸。

## 使用相依注入進行測試

DI 外掛程式提供了簡化測試的工具。您可以在載入應用程式模組之前覆寫相依性：

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

### 在測試中載入配置

在測試中，使用 `configure()` 即可輕鬆載入配置檔案：

```kotlin
fun test() = testApplication {
  // 從預設配置檔案路徑載入屬性
  configure()
  // 載入多個檔案並進行覆寫
  configure("root-config.yaml", "test-overrides.yaml")
}
```

測試引擎會忽略衝突的宣告，讓您自由進行覆寫。