[//]: # (title: 依赖注入)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="artifact_name" value="ktor-server-di" />

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-server-di</code>
</p>
</tldr>

依赖注入（DI）插件允许你一次性注册服务和配置对象，并将其注入到应用程序模块、插件、路由以及整个项目中的其他组件。Ktor 的 DI 设计旨在与现有应用程序生命周期自然集成，开箱即用地支持作用域和结构化配置。

## 添加依赖项

要使用 DI，请在构建脚本中包含 `%artifact_name%` artifact：

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

## 基本依赖项注册

你可以使用 lambda 表达式、函数引用或构造函数引用来注册依赖项：

```kotlin
dependencies {
    // 基于 lambda 表达式
    provide<GreetingService> { GreetingServiceImpl() }

    // 函数引用
    provide<GreetingService>(::GreetingServiceImpl)
    provide(BankServiceImpl::class)
    provide(::createBankTeller)

    // 将 lambda 表达式注册为依赖项
    provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

## 基于配置的依赖项注册

你可以在配置文件中声明式地使用类路径引用来配置依赖项。这支持函数和类引用：

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
  // 实现
}
```

Ktor 会自动解析构造函数和函数形参，使用 DI 容器。你可以使用像 `@Property` 或 `@Named` 这样的注解来覆盖或显式绑定形参，特别是在仅凭类型不足以区分值的情况下。如果省略，Ktor 将尝试使用 DI 容器按类型解析形参。

## 依赖项解析和注入

### 解析依赖项

要解析依赖项，你可以使用属性委托或直接解析：

```kotlin
// 使用属性委托
val service: GreetingService by dependencies

// 直接解析
val service = dependencies.resolve<GreetingService>()
```

### 异步依赖项解析

为支持异步加载，你可以使用挂起函数：

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection: EventsConnection = dependencies.resolve() // 挂起直到提供
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI 插件将自动挂起 `resolve()` 调用，直到所有依赖项就绪。

### 注入到应用程序模块中

你可以通过在模块函数中指定形参，将依赖项直接注入到应用程序模块中。Ktor 将根据类型匹配从 DI 容器中解析这些依赖项。

首先，在配置的 `dependencies` 部分注册你的依赖项提供器：

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt.stdout
    modules:
      - com.example.LoggingKt.logging
```

以下是依赖项提供器和模块函数的示例：

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

使用 `@Named` 注入特定键的依赖项：

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // 使用名为 "mongo" 的依赖项
}
```

### 属性和配置注入

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

这简化了结构化配置的使用，并支持基本类型的自动解析。

## 高级依赖项特性

### 可选和可空依赖项

使用可空类型优雅地处理可选依赖项：

```kotlin
// 使用属性委托
val config: Config? by dependencies

// 或直接解析
val config = dependencies.resolve<Config?>()
```

### 协变泛型

Ktor 的 DI 系统支持类型协变，这允许在类型形参协变时，将值作为其超类型之一注入。这对于处理子类型的集合和接口特别有用。

```kotlin
dependencies {
  provide<List<String>> { listOf("one", "two") }
}

// 由于支持类型形参协变，这将起作用
val stringList: List<CharSequence> by dependencies
// 这也将起作用
val stringCollection: Collection<CharSequence> by dependencies
```

协变也适用于非泛型超类型：

```kotlin
dependencies {
    provide<BufferedOutputStream> { BufferedOutputStream(System.out) }
}

// 这之所以有效，是因为 BufferedOutputStream 是 OutputStream 的子类型
val outputStream: OutputStream by dependencies
```

#### 限制

尽管 DI 系统支持泛型类型的协变，但它目前不支持跨类型实参子类型解析参数化类型。这意味着你无法使用比已注册类型更具体或更通用的类型来检索依赖项。

例如，以下代码将无法解析：

```kotlin
dependencies {
    provide<Sink<CharSequence>> { CsqSink() }
}

// 将无法解析
val charSequenceSink: Sink<String> by dependencies
```

## 资源生命周期管理

DI 插件会在应用程序关闭时自动处理生命周期和清理。

### AutoCloseable 支持

默认情况下，任何实现 `AutoCloseable` 的依赖项在应用程序停止时都会自动关闭：

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // 关闭连接，释放资源
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### 自定义清理逻辑

你可以通过指定一个 `cleanup` 函数来定义自定义清理逻辑：

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### 带键的作用域清理

使用 `key` 来管理命名资源及其清理：

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

依赖项按照声明的逆序进行清理，以确保正确销毁。

## 使用依赖注入进行测试

DI 插件提供简化测试的工具。你可以在加载应用程序模块之前覆盖依赖项：

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

### 在测试中加载配置

在测试中，使用 `configure()` 可以轻松加载配置文件：

```kotlin
fun test() = testApplication {
  // 从默认配置文件路径加载属性
  configure()
  // 加载多个文件并覆盖
  configure("root-config.yaml", "test-overrides.yaml")
}
```

测试引擎会忽略冲突的声明，以便你可以自由覆盖。