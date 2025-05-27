---
title: 带注解的定义
---

Koin 注解允许你声明与常规 Koin DSL 相同类型的定义，但通过注解完成。只需为你的类添加所需的注解标签，它就会为你生成所有内容！

例如，等同于 `single { MyComponent(get()) }` DSL 声明，只需像这样添加 `@Single` 标签即可：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin 注解与 Koin DSL 保持相同的语义。你可以使用以下定义声明你的组件：

-   `@Single` - 单例实例（在 DSL 中使用 `single { }` 声明）
-   `@Factory` - 工厂实例。每次需要实例时都会重新创建的实例。（在 DSL 中使用 `factory { }` 声明）
-   `@KoinViewModel` - Android ViewModel 实例（在 DSL 中使用 `viewModel { }` 声明）
-   `@KoinWorker` - Android Worker Workmanager 实例（在 DSL 中使用 `worker { }` 声明）

关于作用域，请查看 [声明作用域](/docs/reference/koin-core/scopes.md) 小节。

### 为 Kotlin Multipaltform 生成 Compose ViewModel (从 1.4.0 版本开始)

`@KoinViewModel` 注解可用于生成 Android 或 Compose KMP ViewModel。要使用 `org.koin.compose.viewmodel.dsl.viewModel` 而不是常规的 `org.koin.androidx.viewmodel.dsl.viewModel` 来生成 `viewModel` Koin 定义，你需要激活 `KOIN_USE_COMPOSE_VIEWMODEL` 选项：

```groovy
ksp {
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

:::note
    `USE_COMPOSE_VIEWMODEL` 键已弃用，请使用 `KOIN_USE_COMPOSE_VIEWMODEL`。
:::

:::note
    Koin 4.0 应该会将这两个 ViewModel DSL 合并为一个，因为 ViewModel 类型参数来自同一个库。
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
val m = MyDependency
// Resolve MyComponent while passing  MyDependency
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

生成的 DSL 等价物将是 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAAULT_ID)) }`