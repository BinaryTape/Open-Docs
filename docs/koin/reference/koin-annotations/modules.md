---
title: 应用程序、配置和模块
---

## 使用 @KoinApplication 引导应用程序

要创建完整的 Koin 应用程序引导，您可以在入口点类上使用 `@KoinApplication` 注解。此注解有助于生成 Koin 应用程序引导函数：

```kotlin
@KoinApplication // load default configuration
object MyApp

@KoinApplication(
    configurations = ["default", "production"], 
    modules = [MyModule::class]
)
object MyApp
```

这会生成**两个**用于启动 Koin 应用程序的函数：

```kotlin
// 下面的导入让您可以访问生成的扩展函数
import org.koin.ksp.generated.*

fun main() {
    // 选项 1：直接启动 Koin
    MyApp.startKoin()
    
    // 选项 2：获取 KoinApplication 实例
    val koinApp = MyApp.koinApplication()
}
```

两个生成的函数都支持自定义配置：

```kotlin
fun main() {
    MyApp.startKoin {
        printLogger()
        // 添加其他 Koin 配置
    }
    
    // 或与 koinApplication 一起使用
    MyApp.koinApplication {
        printLogger()
    }
}
```

`@KoinApplication` 注解支持：
- `configurations`：要扫描和加载的配置项名称数组
- `modules`：要直接包含的模块类数组（除了配置项之外）

:::info
当未指定配置项时，它会自动加载“default”配置项。
:::

## 使用 @Configuration 进行配置管理

`@Configuration` 注解允许您将模块组织到不同的配置项（环境、特性变种等）中。这对于按部署环境或特性集组织模块很有用。

### 基本配置项用法

```kotlin
// 将模块放入默认配置项中
@Module
@Configuration
class CoreModule
```

:::info
默认配置项名为“default”，可以与 `@Configuration` 或 `@Configuration("default")` 一起使用。
:::

您需要使用 `@KoinApplication` 才能从配置项中扫描模块：

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

### 多配置项支持

一个模块可以与多个配置项关联：

```kotlin
// 此模块在“prod”和“test”配置项中都可用
@Module
@Configuration("prod", "test")
class DatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 此模块在 default、test 和 development 中都可用
@Module
@Configuration("default", "test", "development") 
class LoggingModule {
    @Single
    fun logger() = Logger()
}
```

### 环境特有的配置项

```kotlin
// 仅限开发环境的配置项
@Module
@Configuration("development")
class DevDatabaseModule {
    @Single
    fun database() = InMemoryDatabase()
}

// 仅限生产环境的配置项  
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

### 将配置项与 @KoinApplication 结合使用

默认情况下，`@KoinApplication` 会加载所有默认配置项（标记有 `@Configuration` 的模块）。

您也可以在应用程序引导中引用这些配置项：

```kotlin
@KoinApplication(configurations = ["default", "production"])
class ProductionApp

@KoinApplication(configurations = ["default", "development"])  
class DevelopmentApp

// 仅加载默认配置项（与不带参数的 @KoinApplication 相同）
@KoinApplication
class SimpleApp
```

:::info
- 空的 `@Configuration` 等同于 `@Configuration("default")`
- 当未指定特定配置项时，“default”配置项会自动加载
- 模块可以通过在注解中列出，从而属于多个配置项
:::

## 默认模块（自 1.3.0 版本起已废弃）

:::warning
自 Annotations 1.3.0 版本起，默认模块方法已被废弃。我们建议使用带有 `@Module` 和 `@Configuration` 注解的显式模块，以实现更好的组织和清晰度。
:::

在使用定义时，您可能需要或不需要将它们组织到模块中。以前，您可以使用“默认”生成的模块来承载不带显式模块的定义。

如果您不想指定任何模块，Koin 会提供一个默认模块来承载您的所有定义。`defaultModule` 可以直接使用：

```kotlin
// 下面的导入让您可以访问生成的扩展函数
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// 或 

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
```

**推荐方法**：与其使用默认模块，不如将您的定义组织到显式模块中：

```kotlin
@Module
@Configuration
class MyModule {
    // 您的定义在此处
}

// 然后使用 @KoinApplication
@KoinApplication
object MyApp
```

:::info
不要忘记使用 `org.koin.ksp.generated.*` 导入
:::

## 带有 @Module 的类模块

要声明一个模块，只需使用 `@Module` 注解标记一个类：

```kotlin
@Module
class MyModule
```

要在 Koin 中加载您的模块，只需使用为任何 `@Module` 类生成的 `.module` 扩展。只需创建模块的新实例 `MyModule().module` 即可：

```kotlin
// 使用 Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> 不要忘记使用 `org.koin.ksp.generated.*` 导入

## 带有 @ComponentScan 的组件扫描

要扫描并将带注解的组件收集到一个模块中，只需在模块上使用 `@ComponentScan` 注解：

```kotlin
@Module
@ComponentScan
class MyModule
```

这将扫描当前包及其子包中带注解的组件。您可以指定扫描一个给定的包 `@ComponentScan("com.my.package")`

:::info
当使用 `@ComponentScan` 注解时，KSP 会遍历所有 Gradle 模块以查找相同的包。（自 1.4 版起）
:::

## 类模块中的定义

要直接在代码中定义一个定义，您可以使用定义注解标记一个函数：

```kotlin
// 假设 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> **注意**：`@InjectedParam`（用于从 `startKoin` 注入的形参）和 `@Property`（用于属性注入）也可以在函数成员上使用。有关这些注解的更多详细信息，请参见定义文档。

## 包含模块

要将其他类模块包含到您的模块中，请使用 `@Module` 注解的 `includes` 属性：

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

这样您就可以直接运行您的根模块：

```kotlin
// 使用 Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // 将加载 ModuleB 和 ModuleA
          ModuleB().module
        )
    }
}