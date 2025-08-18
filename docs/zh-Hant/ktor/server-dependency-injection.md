[//]: # (title: 依賴注入)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="artifact_name" value="ktor-server-di" />

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:ktor-server-di</code>
</p>
</tldr>

依賴注入 (DI) 外掛允許您註冊服務和配置物件一次，並將它們注入到您的應用程式模組、外掛、路由以及專案中的其他元件。Ktor 的 DI 旨在與其現有的應用程式生命週期自然整合，開箱即用地支援作用域和結構化配置。

## 新增依賴項

要使用 DI，請在您的建置腳本中包含 `%artifact_name%` artifact：

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

## 基本依賴項註冊

您可以使用 Lambda 表達式、函式參考或建構函式參考來註冊依賴項：

```kotlin
dependencies {
    // 基於 Lambda 的
    provide<GreetingService> { GreetingServiceImpl() }

    // 函式參考
    provide<GreetingService>(::GreetingServiceImpl)
    provide(BankServiceImpl::class)
    provide(::createBankTeller)

    // 將 Lambda 註冊為依賴項
    provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

## 基於配置的依賴項註冊

您可以在配置檔案中使用 classpath 參考，以宣告式方式配置依賴項。這支援函式和類別參考：

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

Ktor 使用 DI 容器自動解析建構函式和函式參數。在特殊情況下，例如僅憑類型不足以區分值時，您可以使用 `@Property` 或 `@Named` 等註解來覆寫或明確綁定參數。如果省略，Ktor 將嘗試使用 DI 容器按類型解析參數。

## 依賴項解析與注入

### 解析依賴項

要解析依賴項，您可以使用屬性委託或直接解析：

```kotlin
// 使用屬性委託
val service: GreetingService by dependencies

// 直接解析
val service = dependencies.resolve<GreetingService>()
```

### 非同步依賴項解析

為了支援非同步載入，您可以使用 suspend 函式：

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection: EventsConnection = dependencies.resolve() // 暫停直到提供
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 外掛將自動暫停 `resolve()` 呼叫，直到所有依賴項準備就緒。

### 注入到應用程式模組

您可以透過在模組函式中指定參數，將依賴項直接注入到應用程式模組。Ktor 將根據類型匹配從 DI 容器中解析這些依賴項。

首先，在配置的 `dependencies` 部分註冊您的依賴項提供者：

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt.stdout
    modules:
      - com.example.LoggingKt.logging
```

以下是依賴項提供者和模組函式的樣子：

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

使用 `@Named` 注入特定鍵值的依賴項：

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // 使用名為 "mongo" 的依賴項
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

這簡化了結構化配置的使用，並支援基本類型的自動解析。

## 進階依賴項功能

### 可選和可空依賴項

使用可空類型優雅地處理可選依賴項：

```kotlin
// 使用屬性委託
val config: Config? by dependencies

// 或直接解析
val config = dependencies.resolve<Config?>()
```

### 協變泛型

Ktor 的 DI 系統支援類型協變性，當類型參數是協變時，這允許將值注入為其超類型之一。這對於處理子類型的集合和介面特別有用。

```kotlin
dependencies {
  provide<List<String>> { listOf("one", "two") }
}

// 由於支援類型參數協變性，這將起作用
val stringList: List<CharSequence> by dependencies
// 這也將起作用
val stringCollection: Collection<CharSequence> by dependencies
```

協變性也適用於非泛型超類型：

```kotlin
dependencies {
    provide<BufferedOutputStream> { BufferedOutputStream(System.out) }
}

// 這之所以有效，是因為 BufferedOutputStream 是 OutputStream 的子類型
val outputStream: OutputStream by dependencies
```

#### 限制

儘管 DI 系統支援泛型類型的協變性，但它目前不支援跨類型參數子類型解析參數化類型。這表示您不能使用比已註冊類型更具體或更通用的類型來檢索依賴項。

例如，以下程式碼將無法解析：

```kotlin
dependencies {
    provide<Sink<CharSequence>> { CsqSink() }
}

// 將無法解析
val charSequenceSink: Sink<String> by dependencies
```

## 資源生命週期管理

當應用程式關閉時，DI 外掛會自動處理生命週期和清理。

### AutoCloseable 支援

預設情況下，任何實作 `AutoCloseable` 的依賴項在應用程式停止時都會自動關閉：

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

### 帶鍵的作用域清理

使用 `key` 來管理具名資源及其清理：

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

依賴項以宣告的反向順序進行清理，以確保正確的拆解。

## 使用依賴注入進行測試

DI 外掛提供了簡化測試的工具。您可以在載入應用程式模組之前覆寫依賴項：

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

在測試中使用 `configure()` 可以輕鬆載入配置檔案：

```kotlin
fun test() = testApplication {
  // 從預設配置檔案路徑載入屬性
  configure()
  // 載入多個帶有覆寫的檔案
  configure("root-config.yaml", "test-overrides.yaml")
}
```

測試引擎會忽略衝突的宣告，讓您可以自由覆寫。