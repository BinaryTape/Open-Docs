---
title: 使用注解的定义
---
Koin Annotations 允许声明与常规 Koin DSL 相同类型的定义，但使用注解。只需使用所需的注解标记你的类，它就会为你生成一切！

例如，等效于 `single { MyComponent(get()) }` DSL 声明，只需使用 `@Single` 标记，如下所示：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin Annotations 与 Koin DSL 保持相同的语义。你可以使用以下定义声明你的组件：

- `@Single` - 单例实例（在 DSL 中用 `single { }` 声明）
- `@Factory` - 工厂实例。对于每次需要实例时重新创建的实例。（在 DSL 中用 `factory { }` 声明）
- `@KoinViewModel` - Android ViewModel 实例（在 DSL 中用 `viewModel { }` 声明）
- `@KoinWorker` - Android Worker Workmanager 实例（在 DSL 中用 `worker { }` 声明）

对于作用域（Scopes），请查看 [Declaring Scopes](/reference/koin-core/scopes.md) 部分。

### 为 Kotlin Multiplatform 生成 Compose ViewModel (自 1.4.0 起)

`@KoinViewModel` 注解可用于生成 Android 或 Compose KMP ViewModel。要生成带有 `org.koin.compose.viewmodel.dsl.viewModel` 而不是常规 `org.koin.androidx.viewmodel.dsl.viewModel` 的 `viewModel` Koin 定义，你需要激活 `KOIN_USE_COMPOSE_VIEWMODEL` 选项：

```groovy
ksp {
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

:::note
    `USE_COMPOSE_VIEWMODEL` 键已弃用，建议使用 `KOIN_USE_COMPOSE_VIEWMODEL`
:::

:::note
    Koin 4.0 应该会将这 2 个 ViewModel DSL 合并为一个，因为 ViewModel 类型参数来自同一个库
:::

## 自动或特定绑定（Binding）

在声明组件时，所有检测到的“绑定”（关联的超类型）都将为你准备好。例如，以下定义：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin 将声明你的 `MyComponent` 组件也与 `MyInterface` 绑定。DSL 等效项为 `single { MyComponent(get()) } bind MyInterface::class`。

除了让 Koin 为你检测之外，你还可以使用 `binds` 注解参数指定你真正想要绑定的类型：

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## 可空的依赖（Nullable Dependencies）

如果你的组件使用可空的依赖，请不要担心，它将自动为你处理。继续使用你的定义注解，Koin 会猜测该怎么做：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

生成的 DSL 等效项将是 `single { MyComponent(getOrNull()) }`

> 请注意，这也适用于注入的参数（Parameters）和属性（properties）

## 使用 @Named 的限定符（Qualifier）

你可以向定义添加一个“名称”（也称为限定符），以便区分同一类型的多个定义，使用 `@Named` 注解：

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

在解析依赖时，只需使用带有 `named` 函数的限定符：

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

也可以创建自定义限定符注解。使用前面的示例：

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

你可以将构造函数成员标记为“注入参数”，这意味着在调用解析时，依赖项将在图中传递。

例如：

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

然后你可以调用你的 `MyComponent` 并传递一个 `MyDependency` 的实例：

```kotlin
val m = MyDependency
// 解析 MyComponent，同时传递 MyDependency
koin.get<MyComponent> { parametersOf(m) }
```

生成的 DSL 等效项将是 `single { params -> MyComponent(params.get()) }`

## 注入一个延迟依赖 - `Lazy<T>`

Koin 可以自动检测和解析一个延迟依赖。例如，这里我们想要延迟解析 `LoggerDataSource` 定义。你只需要使用 `Lazy` Kotlin 类型，如下所示：

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

在底层，它将生成类似于使用 `inject()` 而不是 `get()` 的 DSL：

```kotlin
single { LoggerAggregator(inject()) }
```

## 注入一个依赖列表 - `List<T>`

Koin 可以自动检测和解析所有依赖的列表。例如，这里我们想要解析所有 `LoggerDataSource` 定义。你只需要使用 `List` Kotlin 类型，如下所示：

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

## 使用 @Property 的属性

要在你的定义中解析一个 Koin 属性，只需使用 `@Property` 标记构造函数成员。这将借助传递给注解的值来解析 Koin 属性：

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

生成的 DSL 等效项将是 `factory { ComponentWithProps(getProperty("id")) }`

### @PropertyValue - 带有默认值的属性（自 1.4 起）

Koin Annotations 允许你直接从你的代码中使用 `@PropertyValue` 注解为一个属性定义一个默认值。
让我们继续看我们的示例：

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

生成的 DSL 等效项将是 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAAULT_ID)) }`