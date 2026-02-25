---
title: 应用、配置与模块
---

## 使用 @KoinApplication 进行应用引导 (Bootstrap)

要创建一个完整的 Koin 应用引导，您可以在入口类上使用 `@KoinApplication` 注解。该注解有助于生成 Koin 应用引导函数：

```kotlin
@KoinApplication // 加载默认配置
object MyApp

@KoinApplication(
    configurations = ["default", "production"], 
    modules = [MyModule::class]
)
object MyApp
```

这将生成 **两个** 用于启动 Koin 应用程序的函数：

```kotlin
// 以下导入让您可以访问生成的扩展函数
import org.koin.ksp.generated.*

fun main() {
    // 选项 1：直接启动 Koin
    MyApp.startKoin()
    
    // 选项 2：获取 KoinApplication 实例
    val koinApp = MyApp.koinApplication()
}
```

生成的两个函数都支持自定义配置：

```kotlin
fun main() {
    MyApp.startKoin {
        printLogger()
        // 添加其他 Koin 配置
    }
    
    // 或者使用 koinApplication
    MyApp.koinApplication {
        printLogger()
    }
}
```

`@KoinApplication` 注解支持：
- `configurations`：要扫描并加载的配置名称数组
- `modules`：要直接包含的模块类数组（除配置外）

:::info
未指定配置时，它会自动加载 "default" 配置。
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

## 默认模块（自 1.3.0 起弃用）

:::warning
自 Annotations 1.3.0 起，默认模块方法已被弃用。我们建议使用带有 `@Module` 和 `@Configuration` 注解的显式模块，以获得更好的组织和清晰度。
:::

在使用定义 (definition) 时，您可能需要将它们组织在模块中，也可能不需要。以前，您可以使用生成的 "default" 模块来承载定义，而无需显式模块。

如果您不想指定任何模块，Koin 提供了一个默认模块来承载您的所有定义。`defaultModule` 可以直接使用：

```kotlin
// 以下导入让您可以访问生成的扩展函数
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// 或者 

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
```

**推荐做法**：不要使用默认模块，而是将您的定义组织在显式模块中：

```kotlin
@Module
@Configuration
class MyModule {
    // 您的定义写在这里
}

// 然后使用 @KoinApplication
@KoinApplication
object MyApp
```

:::info
不要忘记使用 `import org.koin.ksp.generated.*` 导入
:::

## 使用 @Module 的类模块

要声明一个模块，只需在类上标记 `@Module` 注解：

```kotlin
@Module
class MyModule
```

要在 Koin 中加载您的模块，只需使用为任何 `@Module` 类生成的 `.module` 扩展。只需创建一个模块的新实例 `MyModule().module`：

```kotlin
// 使用 Koin 生成
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> 不要忘记使用 `import org.koin.ksp.generated.*` 导入

## 使用 @ComponentScan 进行组件扫描

要扫描带注解的组件并将其收集到模块中，只需在模块上使用 `@ComponentScan` 注解：

```kotlin
@Module
@ComponentScan
class MyModule
```

这将扫描当前软件包及其子软件包中的带注解组件。您可以通过 `@ComponentScan("com.my.package")` 指定扫描特定的软件包。

:::info
使用 `@ComponentScan` 注解时，KSP 会遍历同一软件包下的所有 Gradle 模块。（自 1.4 起）
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

要在您的模块中包含其他类模块，请使用 `@Module` 注解的 `includes` 属性：

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

这样您只需运行根模块：

```kotlin
// 使用 Koin 生成
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // 将加载 ModuleB 和 ModuleA
          ModuleB().module
        )
    }
}