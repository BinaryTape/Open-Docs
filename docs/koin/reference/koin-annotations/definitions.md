---
title: 带有注解的定义
---

Koin Annotations 允许使用注解声明与常规 Koin DSL 相同类型的定义。只需使用所需的注解标记您的类，它就会为您生成一切！

例如，与 `single { MyComponent(get()) }` DSL 声明等效的操作只需使用 `@Single` 进行标记，如下所示：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin Annotations 保持与 Koin DSL 相同的语义。您可以使用以下定义来声明组件：

- `@Single` - 单例实例（在 DSL 中使用 `single { }` 声明）
- `@Factory` - factory 实例。例如，每次需要实例时都会重新创建。（在 DSL 中使用 `factory { }` 声明）
- `@KoinViewModel` - Android ViewModel 实例（在 DSL 中使用 `viewModel { }` 声明）
- `@KoinWorker` - Android Worker Workmanager 实例（在 DSL 中使用 `worker { }` 声明）

关于作用域，请查看 [声明作用域](/docs/reference/koin-core/scopes.md) 部分。

### 为 Kotlin Multiplatform 生成 Compose ViewModel（自 1.4.0 起）

`@KoinViewModel` 注解默认使用 `koin-core-viewmodel` 主 DSL 生成 ViewModel（自 2.2.0 起启用）。这提供了 Kotlin Multiplatform 兼容性并使用统一的 ViewModel API。

`KOIN_USE_COMPOSE_VIEWMODEL` 选项默认开启：

```groovy
ksp {
    // 这是自 2.2.0 以来的默认行为
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

这将使用 `org.koin.compose.viewmodel.dsl.viewModel` 生成 `viewModel` 定义，以实现多平台兼容性。

:::info
- 自 Annotations 2.2.0 起，`KOIN_USE_COMPOSE_VIEWMODEL` 默认开启
- 这确保了所有平台上统一 ViewModel API 的一致性
- 旧的 `USE_COMPOSE_VIEWMODEL` 键已被移除
:::

## 自动或特定绑定

声明组件时，所有检测到的“绑定”（关联的超类型）都将为您准备就绪。例如，对于以下定义：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin 会声明您的 `MyComponent` 组件也绑定到 `MyInterface`。等效的 DSL 为 `single { MyComponent(get()) } bind MyInterface::class`。

除了让 Koin 为您自动检测外，您还可以通过 `binds` 注解参数指定真正想要绑定的类型：

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## 可为 null 的依赖项

如果您的组件使用可为 null 的依赖项，请不用担心，它将为您自动处理。继续使用您的定义注解，Koin 会推断如何处理：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

生成的等效 DSL 将为 `single { MyComponent(getOrNull()) }`

> 请注意，这也适用于注入的参数和属性

## 带有 @Named 的限定符

您可以为定义添加“名称”（也称为限定符），以使用 `@Named` 注解区分相同类型的多个定义：

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

在解析依赖项时，只需通过 `named` 函数使用该限定符：

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

也可以创建自定义限定符注解。沿用之前的示例：

```kotlin
@Named
annotation class InMemoryLogger

@Named
annotation class DatabaseLogger

@Single
@InMemoryLogger
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@DatabaseLogger
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

```kotlin
val logger: LoggerDataSource by inject(named<InMemoryLogger>())
```

## 带有 @InjectedParam 的注入参数

您可以将构造函数成员标记为“注入参数”，这意味着在调用解析时，该依赖项将传递到图中。

例如：

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

然后您可以调用 `MyComponent` 并传入 `MyDependency` 的实例：

```kotlin
val m = MyDependency()
// 解析 MyComponent，同时传入 MyDependency
koin.get<MyComponent> { parametersOf(m) }
```

生成的等效 DSL 将为 `single { params -> MyComponent(params.get()) }`

## 注入 Lazy 依赖项 - `Lazy<T>`

Koin 可以自动检测并解析 Lazy 依赖项。例如，在这里我们想要延迟解析 `LoggerDataSource` 定义。您只需按照如下方式使用 `Lazy` Kotlin 类型：

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

在底层，它将生成类似于使用 `inject()` 而非 `get()` 的 DSL：

```kotlin
single { LoggerAggregator(inject()) }
```

## 注入依赖项列表 - `List<T>`

Koin 可以自动检测并解析依赖项列表。例如，在这里我们想要解析所有的 `LoggerDataSource` 定义。您只需按照如下方式使用 `List` Kotlin 类型：

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource

@Single
class LoggerAggregator(val datasource : List<LoggerDataSource>)
```

在底层，它将生成类似于使用 `getAll()` 函数的 DSL：

```kotlin
single { LoggerAggregator(getAll()) }
```

## 带有 @Property 的属性

要在定义中解析 Koin 属性，只需使用 `@Property` 标记构造函数成员。这将通过传递给注解的值来解析 Koin 属性：

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

生成的等效 DSL 将为 `factory { ComponentWithProps(getProperty("id")) }`

### @PropertyValue - 带有默认值的属性（自 1.4 起）

Koin Annotations 让您能够直接在代码中使用 `@PropertyValue` 注解为属性定义默认值。
让我们参考示例：

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
){
    public companion object {
        @PropertyValue("id")
        public const val DEFAULT_ID : String = "_empty_id"
    }
}
```

生成的等效 DSL 将为 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAULT_ID)) }`

## JSR-330 兼容性注解

Koin Annotations 通过 `koin-jsr330` 模块提供与 JSR-330 (Jakarta Inject) 兼容的注解。这些注解对于从 Hilt、Dagger 或 Guice 等其他兼容 JSR-330 的框架迁移的开发者特别有用。

### 设置

将 `koin-jsr330` 依赖项添加到您的项目中：

```kotlin
dependencies {
    implementation "io.insert-koin:koin-jsr330:$koin_version"
}
```

### 可用的 JSR-330 注解

#### @Singleton (jakarta.inject.Singleton)

JSR-330 标准单例注解，等效于 Koin 的 `@Single`：

```kotlin
import jakarta.inject.Singleton

@Singleton
class DatabaseService
```

这将生成与 `@Single` 相同的结果——Koin 中的单例实例。

#### @Named (jakarta.inject.Named)

用于基于字符串的限定符的 JSR-330 标准限定符注解：

```kotlin
import jakarta.inject.Named
import jakarta.inject.Singleton

@Singleton
@Named("inMemory")
class InMemoryCache : Cache

@Singleton  
@Named("redis")
class RedisCache : Cache
```

#### @Inject (jakarta.inject.Inject)

JSR-330 标准注入注解。虽然 Koin Annotations 不要求显式标记构造函数，但为了实现 JSR-330 兼容性，可以使用 `@Inject`：

```kotlin
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class UserService @Inject constructor(
    private val repository: UserRepository
)
```

#### @Qualifier (jakarta.inject.Qualifier)

用于创建自定义限定符注解的元注解：

```kotlin
import jakarta.inject.Qualifier

@Qualifier
annotation class Database

@Qualifier  
annotation class Cache

@Singleton
@Database
class DatabaseConfig

@Singleton
@Cache  
class CacheConfig
```

#### @Scope (jakarta.inject.Scope)

用于创建自定义作用域注解的元注解：

```kotlin
import jakarta.inject.Scope

@Scope
annotation class RequestScoped

// 与 Koin 的作用域系统配合使用
@Scope(name = "request") 
@RequestScoped
class RequestProcessor
```

### 混合使用

您可以在同一个项目中自由混合使用 JSR-330 注解和 Koin 注解：

```kotlin
// JSR-330 风格
@Singleton
@Named("primary")
class PrimaryDatabase : Database

// Koin 风格  
@Single
@Named("secondary")
class SecondaryDatabase : Database

// 在同一个类中混合使用
@Factory
class DatabaseManager @Inject constructor(
    @Named("primary") private val primary: Database,
    @Named("secondary") private val secondary: Database  
)
```

### 框架迁移优势

使用 JSR-330 注解为框架迁移提供了多项优势：

- **熟悉的 API**：来自 Hilt、Dagger 或 Guice 的开发者可以使用已知的注解
- **渐进式迁移**：现有的 JSR-330 注解代码只需极少改动即可工作
- **标准合规性**：遵循 JSR-330 可确保与依赖注入标准兼容
- **团队入门**：熟悉其他 DI 框架的团队更容易上手

:::info
Koin 中的 JSR-330 注解生成的底层 DSL 与其对应的 Koin 注解相同。选择 JSR-330 还是 Koin 注解纯粹是风格上的，取决于团队偏好或迁移需求。
:::