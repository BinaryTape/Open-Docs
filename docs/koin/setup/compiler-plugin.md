---
title: 编译器插件设置
---

# Koin 编译器插件设置

**Koin 编译器插件**是所有新 Kotlin 2.x 项目的推荐方式。它提供了自动装配、编译时安全和更简洁的 DSL 语法。

## 什么是编译器插件？

Koin 编译器插件是一个**原生 Kotlin 编译器插件 (K2)**，它可以：

- 自动检测构造函数依赖项
- 提供编译时分析
- 同时支持 DSL 和注解
- 不生成可见文件

有关功能和优势的详细信息，请参阅 [Koin 编译器插件简介](/docs/intro/koin-compiler-plugin)。

:::tip IDE 插件
为 Android Studio 和 IntelliJ IDEA 安装 **[Koin IDE 插件](https://plugins.jetbrains.com/plugin/26131-koin-dependency-injection-official-)** —— 它支持定义与注入点之间的代码导航、实时安全检查以及依赖图可视化。
:::

## 要求

- **Kotlin 2.3.20+**（K2 编译器）
- **Gradle 8.x+**

## 设置

### 步骤 1：将 Koin 添加到版本目录 (Version Catalog)

首先，检查最新版本：
- Koin：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- Koin 编译器插件：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compiler-plugin?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-compiler-plugin)

然后，在您的 `gradle/libs.versions.toml` 中：

```toml
[versions]
koin = "<KOIN_VERSION>"
koin-plugin = "<KOIN_PLUGIN_VERSION>"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

### 步骤 2：配置设置

在您的 `settings.gradle.kts` 中：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### 步骤 3：应用插件

在您的模块级 `build.gradle.kts` 中：

```kotlin
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // 用于注解支持
}
```

:::tip
**正在使用 `@KoinViewModel` 或 `@KoinWorker`？** 这些注解需要它们的运行时 DSL 位于类路径上：

- `@KoinViewModel` → `implementation("io.insert-koin:koin-core-viewmodel")`
- `@KoinWorker` → `implementation("io.insert-koin:koin-android-workmanager")`

如果您添加了注解但没有对应的运行时，编译器将失败并显示指明缺少构件的明确错误 —— 启动时不再会出现静默的 `NoDefinitionFoundException`。
:::

## 完整示例

### gradle/libs.versions.toml

```toml
[versions]
koin = "<KOIN_VERSION>"
koin-plugin = "<KOIN_PLUGIN_VERSION>"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

### settings.gradle.kts

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### build.gradle.kts

```kotlin
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

## 使用编译器插件

### DSL 风格

从编译器插件软件包导入：

```kotlin
import org.koin.plugin.module.dsl.*
import org.koin.dsl.module

val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::info
编译器插件 DSL 位于软件包 **`org.koin.plugin.module.dsl`** 中。传统的 DSL 仍保留在 `org.koin.dsl` 中。
:::

### 注解风格

在您的类上使用注解：

```kotlin
@Singleton
class Database

@Singleton
class ApiClient

@Singleton
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

### 使用注解启动 Koin

使用编译器插件时，请使用类型化 API 来启动 Koin —— **无需生成代码**：

```kotlin
@KoinApplication
@ComponentScan("com.myapp")
class MyApp

// 使用类型化 API 启动 Koin
startKoin<MyApp>()

// 或者进行额外配置
startKoin<MyApp> {
    androidContext(this@MyApplication)
    printLogger()
}
```

**可用的类型化 API：**

| API | 说明 |
|-----|-------------|
| `startKoin<T>()` | 使用应用程序 T 全局启动 Koin |
| `startKoin<T> { }` | 使用应用程序 T 和配置块启动 Koin |
| `koinApplication<T>()` | 使用 T 创建隔离的 KoinApplication |
| `koinConfiguration<T>()` | 从 T 创建 KoinConfiguration（用于 Compose KoinApplication、Ktor 等） |

其中 `T` 是一个带有 `@KoinApplication` 注解的类。

**加载单个模块：**

您还可以直接加载 `@Module` 类而无需 `@KoinApplication`，只需使用 `module<T>()` 或 `modules()`：

```kotlin
startKoin {
    module<NetworkModule>()                              // 加载单个模块
    modules(DataModule::class, CacheModule::class)       // 加载多个模块
}
```

| API | 说明 |
|-----|-------------|
| `module<T>()` | 将单个 `@Module` 类加载到 KoinApplication 中 |
| `modules(vararg KClass)` | 将多个 `@Module` 类加载到 KoinApplication 中 |

其中 `T` / 每个 `KClass` 是一个带有 `@Module` 注解的类。这对于测试或混合使用注解和 DSL 模块非常有用：

```kotlin
// 在测试中
@get:Rule
val koinTestRule = KoinTestRule.create {
    module<NetworkModule>()
}
```

## 配置选项

在您的 `build.gradle.kts` 中配置编译器插件：

```kotlin
koinCompiler {
    userLogs = true
    debugLogs = false
    unsafeDslChecks = true
}
```

### 可用选项

| 选项 | 说明 | 默认值 |
|--------|-------------|---------|
| `compileSafety` | 编译时依赖项验证 (A2/A3/A4) | `true` |
| `strictSafety` | 强制聚合器的安全检查在每次构建时重新运行（绕过 Kotlin 增量编译） | 在聚合器模块上自动检测 |
| `skipDefaultValues` | 跳过对带有 Kotlin 默认值的形参进行注入 | `true` |
| `userLogs` | 启用组件检测和 DSL/注解处理的日志 | `false` |
| `debugLogs` | 启用插件内部处理的详细调试日志 | `false` |
| `unsafeDslChecks` | 验证 lambda 表达式内部的 `create()` 调用是否为唯一指令 | `true` |

:::tip
在开发期间将 `userLogs = true` 设置为 true，以查看插件检测并处理了哪些组件。
:::

## 编译时安全

Koin 编译器插件提供**编译时依赖项验证** —— 验证您的所有依赖项是否可以在构建时解析，而不是在运行时失败。此功能默认启用。

```kotlin
koinCompiler {
    compileSafety = true       // 默认启用
    skipDefaultValues = true   // 默认启用
}
```

该插件在三个级别验证您的图：每个模块 (A2)、`startKoin<T>()` 时的完整图 (A3) 以及每个调用站点 (A4)。有关完整详细信息，请参阅[编译时安全](/docs/reference/koin-compiler/compile-safety)。

## 多模块项目

对于具有多个 Gradle 模块的项目：

### 库模块

```kotlin
// feature/build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

```kotlin
// feature/src/main/kotlin/FeatureModule.kt
@Module
@ComponentScan("com.myapp.feature")
class FeatureModule
```

### 应用模块

```kotlin
// app/build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(project(":feature"))
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

```kotlin
// app/src/main/kotlin/MyModule.kt
@Module
@Configuration
class MyModule

// app/src/main/kotlin/MyApp.kt
@KoinApplication
class MyApp

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin<MyApp>()
    }
}
```

对主应用程序类使用 `@KoinApplication`，并配合类型化启动 API 使用。

## Kotlin 多平台

编译器插件适用于 KMP 项目：

```kotlin
// shared/build.gradle.kts
plugins {
    id("org.jetbrains.kotlin.multiplatform")
    alias(libs.plugins.koin.compiler)
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            implementation(libs.koin.annotations)
        }
    }
}
```

## 故障排除

### 未找到插件

确保该插件已包含在您的插件库中：

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### Kotlin 版本不匹配

编译器插件需要 Kotlin 2.3.20+。检查您的 Kotlin 版本：

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.3.20"  // 需要 2.3.20+
}
```

### 导入错误

确保您从正确的软件包导入：

```kotlin
// 编译器插件 DSL
import org.koin.plugin.module.dsl.*

// 传统 DSL
import org.koin.dsl.*
```

### 增量编译与缓存问题

与其他 Kotlin 编译器插件（如 Compose 编译器、Metro）一样，Koin 编译器插件在 IR 级别运行。Kotlin 的增量编译有时可能会在某些更改后产生**陈旧或不一致的结果**：

**现象：**
- 出现不应出现的编译安全错误（误报）
- 移除定义后缺少编译安全错误（漏报）
- 重构后在运行时出现 `NoSuchMethodError` 或 `ClassNotFoundException`

**通常发生的时间：**
- 更改类上的注解（`@Single` → `@Factory`，添加/移除 `@Named`）
- 在包之间移动类（影响 `@ComponentScan` 发现）
- 更改模块 `includes` 或 `@Configuration` 标签
- 在另一个模块依赖的库模块中添加/移除定义

**修复：** 运行清理构建：

```bash
./gradlew clean build
```

或者在 Android Studio 中：点击 **Build → Clean Project**，然后点击 **Build → Rebuild Project**。

:::tip
如果您在重构后遇到意外的编译安全错误，请先尝试清理构建。这是编译器插件增量编译的一个已知局限性 —— 并非 Koin 所特有。

对于图级别的更改（`module { }` lambda 内部的 DSL 定义，添加到 `@ComponentScan` 软件包中的类），插件的 `strictSafety` 选项会在聚合器模块上自动启用，以强制完整图安全检查在每次构建时重新运行。有关详细信息，请参阅 [`strictSafety`](/docs/reference/koin-annotations/options#strictsafety)。
:::

### 多模块项目中的编译安全误报

如果插件报告库模块中存在的依赖项缺失，请确保：

1. **库模块也应用了 Koin 编译器插件** —— 它会生成下游模块读取的提示函数
2. **库模块在消费模块之前构建** —— Gradle 通常通过 `implementation(project(":lib"))` 处理此问题，但请检查您的任务依赖项
3. 首次将插件添加到库模块后，**运行清理构建**

## 迁移

### 从传统 DSL 迁移

1. 添加编译器插件
2. 将导入更新为 `org.koin.plugin.module.dsl.*`
3. 将 `single { Class(get() ...) }` 或 `singleOf(::Class)` 替换为 `single<Class>()`

请参阅上方的[DSL 风格](#dsl-style)参考以获取编译时安全的语法。

### 从 KSP 处理器 (koin-ksp-compiler) 迁移

1. 移除 KSP 插件和 `koin-ksp-compiler` 依赖项
2. 添加 Koin 编译器插件
3. 将 `startKoin { modules(...) }` 更新为 `startKoin<MyApp>()`
4. **您的注解保持不变！** `koin-annotations` 库仍然保留 —— 只有处理器发生了变化。

请参阅 **[从 KSP 迁移到编译器插件](/docs/migration/from-ksp-to-compiler-plugin)** 完整指南。

## 后续步骤

- **[DSL 参考](/docs/reference/dsl-reference)** —— 完整的 DSL 文档
- **[注解参考](/docs/reference/annotations-reference)** —— 完整的注解文档
- **[启动 Koin](/docs/reference/koin-core/starting-koin)** —— 配置您的应用程序