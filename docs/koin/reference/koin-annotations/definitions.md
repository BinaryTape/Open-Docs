---
title: 带注解的定义
---

Koin 注解允许声明与常规 Koin DSL 相同类型的定义，但通过注解完成。只需为你的类添加所需的注解标签，它就会为你生成所有内容！

例如，等同于 `single { MyComponent(get()) }` DSL 声明，只需像这样添加 `@Single` 标签即可：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin 注解与 Koin DSL 保持相同的语义。你可以使用以下定义声明你的组件：

- `@Single` - 单例实例（在 DSL 中使用 `single { }` 声明）
- `@Factory` - 工厂实例。每次需要实例时都会重新创建的实例。（在 DSL 中使用 `factory { }` 声明）
- `@KoinViewModel` - Android ViewModel 实例（在 DSL 中使用 `viewModel { }` 声明）
- `@KoinWorker` - Android Worker Workmanager 实例（在 DSL 中使用 `worker { }` 声明）

关于作用域，请查看 [声明作用域](/docs/reference/koin-core/scopes.md) 小节。

### 为 Kotlin Multiplatform 生成 Compose ViewModel (从 1.4.0 版本开始)

默认情况下，`@KoinViewModel` 注解使用 `koin-core-viewmodel` 主 DSL 生成 ViewModel（自 2.2.0 版起启用）。这提供了 Kotlin Multiplatform 兼容性并使用统一的 ViewModel API。

`KOIN_USE_COMPOSE_VIEWMODEL` 选项默认启用：

```groovy
ksp {
    // This is the default behavior since 2.2.0
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

这将使用 `org.koin.compose.viewmodel.dsl.viewModel` 生成 `viewModel` 定义，以实现多平台兼容性。

:::info
- `KOIN_USE_COMPOSE_VIEWMODEL` 自 Annotations 2.2.0 起默认启用
- 这确保了与所有平台统一的 ViewModel API 的一致性
- 旧的 `USE_COMPOSE_VIEWMODEL` 键已被移除
:::

## 自动绑定或特定绑定

声明组件时，所有检测到的“绑定”（关联的超类型）都将为你准备好。例如，以下定义：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin 将声明你的 `MyComponent` 组件也绑定到 `MyInterface`。等同的 DSL 是 `single { MyComponent(get()) } bind MyInterface::class`。

除了让 Koin 自动检测外，你还可以使用 `binds` 注解参数指定你真正想要绑定的类型：

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## 可空依赖

如果你的组件使用了可空依赖，不用担心，它将自动为你处理。继续使用你的定义注解，Koin 将推断该怎么做：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

生成的 DSL 等价物将是 `single { MyComponent(getOrNull()) }`

> 请注意，这也适用于注入的参数和属性。

## 使用 @Named 的限定符

你可以为定义添加一个“名称”（也称为限定符），以使用 `@Named` 注解区分同一类型的多个定义：

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

解决依赖时，只需使用 `named` 函数配合限定符即可：

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

也可以创建自定义限定符注解。使用之前的示例：

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

## 使用 @InjectedParam 注入参数

你可以将构造函数成员标记为“注入参数”，这意味着在调用解析时，依赖项将被传递到图 (graph) 中。

例如：

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

然后你可以调用你的 `MyComponent` 并传入 `MyDependency` 的实例：

```kotlin
val m = MyDependency()
// Resolve MyComponent while passing MyDependency
koin.get<MyComponent> { parametersOf(m) }
```

生成的 DSL 等价物将是 `single { params -> MyComponent(params.get()) }`

## 注入懒加载依赖 - `Lazy<T>`

Koin 可以自动检测并解析懒加载依赖。例如，在这里我们想要懒加载地解析 `LoggerDataSource` 定义。你只需按如下方式使用 Kotlin `Lazy` 类型即可：

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

在底层，它会生成像使用 `inject()` 而不是 `get()` 的 DSL：

```kotlin
single { LoggerAggregator(inject()) }
```

## 注入依赖列表 - `List<T>`

Koin 可以自动检测并解析所有依赖列表。例如，在这里我们想要解析所有 `LoggerDataSource` 定义。你只需按如下方式使用 Kotlin `List` 类型即可：

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

在底层，它会生成像使用 `getAll()` 函数的 DSL：

```kotlin
single { LoggerAggregator(getAll()) }
```

## 使用 @Property 的属性

要在你的定义中解析 Koin 属性，只需将构造函数成员标记为 `@Property`。这将通过传递给注解的值来解析 Koin 属性：

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

生成的 DSL 等价物将是 `factory { ComponentWithProps(getProperty("id")) }`

### @PropertyValue - 具有默认值的属性 (从 1.4 版本开始)

Koin 注解让你能够直接从你的代码中通过 `@PropertyValue` 注解为属性定义默认值。
让我们来看这个示例：

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

生成的 DSL 等价物将是 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAULT_ID)) }`

## JSR-330 兼容性注解

Koin 注解通过 `koin-jsr330` 模块提供了 JSR-330 (Jakarta Inject) 兼容的注解。这些注解对于从 Hilt、Dagger 或 Guice 等其他 JSR-330 兼容框架迁移的开发者来说尤其有用。

### 设置

将 `koin-jsr330` 依赖项添加到你的项目：

```kotlin
dependencies {
    implementation "io.insert-koin:koin-jsr330:$koin_version"
}
```

### 可用的 JSR-330 注解

#### `@Singleton` (`jakarta.inject.Singleton`)

JSR-330 标准单例注解，等同于 Koin 的 `@Single`：

```kotlin
import jakarta.inject.Singleton

@Singleton
class DatabaseService
```

这会生成与 `@Single` 相同的结果——Koin 中的一个单例实例。

#### `@Named` (`jakarta.inject.Named`)

JSR-330 标准的限定符注解，用于基于字符串的限定符：

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

#### `@Inject` (`jakarta.inject.Inject`)

JSR-330 标准注入注解。虽然 Koin 注解不需要显式标记构造函数，但 `@Inject` 可用于 JSR-330 兼容性：

```kotlin
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class UserService @Inject constructor(
    private val repository: UserRepository
)
```

#### `@Qualifier` (`jakarta.inject.Qualifier`)

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

#### `@Scope` (`jakarta.inject.Scope`)

用于创建自定义作用域注解的元注解：

```kotlin
import jakarta.inject.Scope

@Scope
annotation class RequestScoped

// Use with Koin's scope system
@Scope(name = "request") 
@RequestScoped
class RequestProcessor
```

### 混合使用

你可以在同一个项目中自由混合 JSR-330 注解和 Koin 注解：

```kotlin
// JSR-330 style
@Singleton
@Named("primary")
class PrimaryDatabase : Database

// Koin style  
@Single
@Named("secondary")
class SecondaryDatabase : Database

// Mixed in same class
@Factory
class DatabaseManager @Inject constructor(
    @Named("primary") private val primary: Database,
    @Named("secondary") private val secondary: Database  
)
```

### 框架迁移优势

使用 JSR-330 注解为框架迁移提供了多项优势：

- **熟悉的 API**：来自 Hilt、Dagger 或 Guice 的开发者可以使用已知的注解
- **渐进式迁移**：现有的 JSR-330 注解代码只需少量修改即可工作
- **标准合规性**：遵循 JSR-330 确保与依赖注入标准的兼容性
- **团队入职**：方便熟悉其他 DI 框架的团队快速上手

:::info
Koin 中的 JSR-330 注解会生成与其 Koin 等价物相同的底层 DSL。JSR-330 和 Koin 注解之间的选择纯粹是风格上的，并基于团队偏好或迁移要求。
:::