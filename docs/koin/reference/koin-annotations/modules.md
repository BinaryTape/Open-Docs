---
title: 应用、配置与模块
---

## 使用 @KoinApplication 进行应用引导 (Bootstrap)

使用 `@KoinApplication` 来定义您的应用程序入口点：

```kotlin
@KoinApplication(modules = [MyModule::class])
class MyApp
```

使用类型化 API 启动 Koin：

```kotlin
fun main() {
    startKoin<MyApp>()

    // 或者使用配置
    startKoin<MyApp> {
        printLogger()
    }
}
```

### 可用的类型化 API

| API | 描述 |
|-----|-------------|
| `startKoin<T>()` | 全局启动 Koin |
| `startKoin<T> { }` | 使用配置块启动 |
| `koinApplication<T>()` | 创建隔离的 KoinApplication |
| `koinConfiguration<T>()` | 创建配置（适用于 Compose、Ktor） |

### @KoinApplication 参数

- `modules`：要包含的模块类数组
- `configurations`：要加载的配置标签数组

```kotlin
@KoinApplication(
    modules = [CoreModule::class],
    configurations = ["production"]
)
class ProdApp
```

:::info
未指定配置时，会自动加载标记有 `@Configuration`（默认标签）的模块。
:::

## 使用 @Configuration 进行配置管理

`@Configuration` 注解允许您将模块组织到不同的配置（环境、变体等）中。这对于按部署环境或功能集组织模块非常有用。

### 基础配置用法

```kotlin
// 将模块放入默认配置中
@Module
@Configuration
class CoreModule
```

:::info
默认配置名为 "default"，可以配合 `@Configuration` 或 `@Configuration("default")` 使用
:::

您需要使用 `@KoinApplication` 才能从配置中扫描模块：

```kotlin
// 模块 A
@Module
@Configuration
class ModuleA

// 模块 B
@Module
@Configuration
class ModuleB

// 模块 App，扫描所有 @Configuration 模块
@KoinApplication
object MyApp
```

### 多配置支持

一个模块可以与多个配置关联：

```kotlin
// 此模块在 "prod" 和 "test" 配置中均可用
@Module
@Configuration("prod", "test")
class DatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 此模块在 default、test 和 development 中均可用
@Module
@Configuration("default", "test", "development") 
class LoggingModule {
    @Single
    fun logger() = Logger()
}
```

### 特定环境的配置

```kotlin
// 仅限开发环境的配置
@Module
@Configuration("development")
class DevDatabaseModule {
    @Single
    fun database() = InMemoryDatabase()
}

// 仅限生产环境的配置  
@Module
@Configuration("production")
class ProdDatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 在多个环境中可用
@Module
@Configuration("default", "production", "development")
class CoreModule {
    @Single
    fun logger() = Logger()
}
```

### 在 @KoinApplication 中使用配置

默认情况下，`@KoinApplication` 会加载所有默认配置（标记有 `@Configuration` 的模块）。

您也可以在应用引导中引用这些配置：

```kotlin
@KoinApplication(configurations = ["default", "production"])
class ProductionApp

@KoinApplication(configurations = ["default", "development"])  
class DevelopmentApp

// 仅加载默认配置（与不带参数的 @KoinApplication 相同）
@KoinApplication
class SimpleApp
```

:::info
- 空的 `@Configuration` 等同于 `@Configuration("default")`
- 未指定具体配置时，会自动加载 "default" 配置
- 模块可以通过在注解中列出配置来属于多个配置
:::

## 使用模块进行组织

始终使用 `@Module` 在显式模块中组织您的定义：

## 使用 @Module 的类模块

要声明一个模块，只需在类上标记 `@Module` 注解：

```kotlin
@Module
class MyModule
```

在您的 `@KoinApplication` 中引用模块：

```kotlin
@KoinApplication(modules = [MyModule::class])
class MyApp

fun main() {
    startKoin<MyApp>()
}
```

## 使用 @ComponentScan 进行组件扫描

使用 `@ComponentScan` 自动发现带注解的组件：

```kotlin
@Module
@ComponentScan
class MyModule
```

这将扫描当前软件包及其子软件包中的带注解组件。也可以显式指定软件包：

```kotlin
@Module
@ComponentScan("com.myapp.features")
class FeatureModule
```

:::info
`@ComponentScan` 会遍历同一软件包下的所有 Gradle 模块。
:::

## 类模块中的定义

要直接在代码中定义一个定义 (definition)，您可以使用定义注解来标注函数：

```kotlin
// 假设有 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> **注意**：`@InjectedParam`（用于来自 startKoin 的注入参数）和 `@Property`（用于属性注入）也可用于函数成员。有关这些注解的更多详细信息，请参阅定义文档。

## 包含模块

使用 `includes` 属性来组合模块：

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

在您的应用程序中引用根模块：

```kotlin
@KoinApplication(modules = [ModuleB::class])  // 自动包含 ModuleA
class MyApp

fun main() {
    startKoin<MyApp>()
}