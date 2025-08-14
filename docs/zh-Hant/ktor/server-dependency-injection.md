[//]: # (title: 依賴注入)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="artifact_name" value="ktor-server-di" />

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:ktor-server-di</code>
</p>
</tldr>

依賴注入 (DI) 插件允許您註冊服務和配置物件一次，並將它們注入到您的應用程式模組、插件、路由以及專案中的其他元件。Ktor 的 DI 旨在與其現有的應用程式生命週期自然整合，開箱即用地支援作用域和結構化配置。

## 新增依賴項

要使用 DI，請在您的建構腳本中包含 `%artifact_name%` 構件：

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
    

## 基本依賴註冊

您可以使用 Lambda 表達式、函數引用或建構子引用來註冊依賴項：

```kotlin
dependencies {
    // 基於 Lambda
    provide<GreetingService> { GreetingServiceImpl() }

    // 函數引用
    provide<GreetingService>(::GreetingServiceImpl)
    provide(BankServiceImpl::class)
    provide(::createBankTeller)

    // 將 Lambda 註冊為依賴項
    provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

## 基於配置的依賴註冊

您可以在配置檔中使用類路徑引用以宣告方式配置依賴項。這支援函數引用和類別引用：

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

Ktor 會使用 DI 容器自動解析建構子和函數參數。在特殊情況下，例如當單憑型別不足以區分一個值時，您可以使用 `@Property` 或 `@Named` 等註解來覆寫或明確綁定參數。如果省略，Ktor 將嘗試使用 DI 容器按型別解析參數。

## 依賴解析和注入

### 解析依賴項

要解析依賴項，您可以使用屬性委託或直接解析：

```kotlin
// 使用屬性委託
val service: GreetingService by dependencies

// 直接解析
val service = dependencies.resolve<GreetingService>()
```

### 非同步依賴解析

為了支援非同步載入，您可以使用懸掛函數：

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection: EventsConnection = dependencies.resolve() // 懸掛直到提供
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 插件會自動懸掛 `resolve()` 呼叫，直到所有依賴項準備就緒。

### 注入到應用程式模組中

您可以透過在模組函數中指定參數，將依賴項直接注入應用程式模組中。Ktor 將根據型別匹配從 DI 容器中解析這些依賴項。

首先，在配置的 `dependencies` 部分註冊您的依賴提供者：

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt.stdout
    modules:
      - com.example.LoggingKt.logging
```

以下是依賴提供者和模組函數的樣子：

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

使用 `@Named` 注入特定鍵的依賴項：

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // 使用名為 "mongo" 的依賴項
}
```

### 屬性和配置注入

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

這簡化了與結構化配置的互動，並支援基本型別的自動解析。

## 進階依賴功能

### 可選和可空依賴項

使用可空型別優雅地處理可選依賴項：

```kotlin
// 使用屬性委託
val config: Config? by dependencies

// 或直接解析
val config = dependencies.resolve<Config?>()
```

### 協變泛型

Ktor 的 DI 系統支援型別協變，這允許在型別參數是協變時，將值注入為其超型別之一。這對於處理子型別的集合和介面特別有用。

```kotlin
dependencies {
  provide<List<String>> { listOf("one", "two") }
}

// 由於支援型別參數協變，這將會生效
val stringList: List<CharSequence> by dependencies
// 這也將會生效
val stringCollection: Collection<CharSequence> by dependencies
```

協變也適用於非泛型超型別：

```kotlin
dependencies {
    provide<BufferedOutputStream> { BufferedOutputStream(System.out) }
}

// 這會生效，因為 BufferedOutputStream 是 OutputStream 的子型別
val outputStream: OutputStream by dependencies
```

#### 限制

儘管 DI 系統支援泛型型別的協變，但目前它不支援跨型別引數子型別解析參數化型別。這表示您無法使用比已註冊型別更具體或更一般的型別來擷取依賴項。

例如，以下程式碼將無法解析：

```kotlin
dependencies {
    provide<Sink<CharSequence>> { CsqSink() }
}

// 將無法解析
val charSequenceSink: Sink<String> by dependencies
```

## 資源生命週期管理

當應用程式關閉時，DI 插件會自動處理生命週期和清理。

### 支援 AutoCloseable

預設情況下，任何實作 `AutoCloseable` 的依賴項在您的應用程式停止時都會自動關閉：

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

您可以透過指定一個 `cleanup` 函數來定義自訂清理邏輯：

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### 帶鍵的範圍清理

使用 `key` 來管理具名資源及其清理：

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

依賴項會以反向宣告順序清理，以確保適當的拆解。

## 使用依賴注入進行測試

DI 插件提供工具來簡化測試。您可以在載入應用程式模組之前覆寫依賴項：

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

使用 `configure()` 在測試中輕鬆載入配置檔：

```kotlin
fun test() = testApplication {
  // 從預設配置檔路徑載入屬性
  configure()
  // 載入多個附帶覆寫的檔案
  configure("root-config.yaml", "test-overrides.yaml")
}
```

測試引擎會忽略衝突的宣告，讓您可以自由覆寫。