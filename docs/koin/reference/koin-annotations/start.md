---
title: Koin Annotations 入门
---

:::info Koin Annotations 状态
**Koin Annotations 现在是 Koin 项目的一部分。** `koin-annotations` 库随 Koin 主版本一起发布，并得到完全支持。

旧版 KSP 处理器 (`koin-ksp-compiler`) 已被**弃用**，取而代之的是 **Koin 编译器插件** —— 您的注解保持不变；仅构建配置发生变化。请参阅[从 KSP 迁移到编译器插件](/docs/migration/from-ksp-to-compiler-plugin)。
:::

Koin Annotations 允许您在类上使用注解来声明定义。Koin 编译器插件会在编译时处理这些注解，并为您生成所有底层的 Koin DSL。

## 开始使用

还不熟悉 Koin？首先，请查看 [Koin 快速入门](https://insert-koin.io/docs/quickstart/kotlin/)

### 设置

将 Koin 编译器插件添加到您的项目中。有关完整说明，请参阅[编译器插件设置](/docs/setup/compiler-plugin)。

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

### 标记组件

使用定义注解标记您的组件：

```kotlin
@Singleton
class MyRepository

@Singleton
class MyService(val repository: MyRepository)

@Factory
class MyUseCase(val service: MyService)
```

### 声明模块

创建一个模块来组织您的定义：

```kotlin
@Module
@ComponentScan("com.myapp")
class AppModule
```

### 启动 Koin

将 `@KoinApplication` 与类型化启动 API 配合使用：

```kotlin
@KoinApplication(modules = [AppModule::class])
class MyApp

fun main() {
    startKoin<MyApp> {
        printLogger()
    }

    // 像往常一样使用您的 Koin API
    KoinPlatform.getKoin().get<MyService>()
}
```

## 配置标签

使用 `@Configuration` 创建根据标签加载的模块：

```kotlin
@Module
@Configuration  // 默认配置
class CoreModule

@Module
@Configuration("prod")
class ProdModule

@Module
@Configuration("test")
class TestModule
```

加载特定配置：

```kotlin
@KoinApplication(
    modules = [CoreModule::class],
    configurations = ["prod"]  // 仅加载标记有 @Configuration("prod") 的模块
)
class ProdApp

fun main() {
    startKoin<ProdApp>()
}
```

## 类型化启动 API

编译器插件提供了用于启动 Koin 的类型化 API：

| API | 说明 |
|-----|-------------|
| `startKoin<T>()` | 全局启动 Koin |
| `startKoin<T> { }` | 使用配置块启动 |
| `koinApplication<T>()` | 创建隔离的 `KoinApplication` |
| `koinConfiguration<T>()` | 创建配置（适用于 Compose、Ktor） |
| `module<T>()` | 加载单个 `@Module` 类 |
| `modules(A::class, B::class)` | 加载多个 `@Module` 类 |

其中 `T` 是一个标记有 `@KoinApplication`（用于启动 API）或 `@Module`（用于模块加载 API）的类。

### 加载单个模块

您可以直接加载 `@Module` 类而无需使用 `@KoinApplication`：

```kotlin
startKoin {
    module<NetworkModule>()
    modules(DataModule::class, CacheModule::class)
}
```

这对于**测试**特别有用：

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    module<NetworkModule>()
}
```

## 编译时安全性

编译器插件会在编译时验证您的 Koin 配置，检查所有依赖项是否已声明且可访问。

### 使用 @Provided 绕过

使用 `@Provided` 表示依赖项是由外部提供的：

```kotlin
class ExternalComponent  // 在别处声明

@Factory
class MyPresenter(@Provided val external: ExternalComponent)
```

## 编译器插件选项

有关所有配置选项，请参阅 **[编译器插件选项](/docs/reference/koin-annotations/options)**。

## ProGuard 规则

对于使用 ProGuard/R8 的 SDK 开发：

```
# 保留注解定义
-keep class org.koin.core.annotation.** { *; }

# 保留使用 Koin 注解标记的类
-keep @org.koin.core.annotation.* class * { *; }
```

## 另请参阅

- **[编译器插件设置](/docs/setup/compiler-plugin)** – 完整设置指南
- **[定义](/docs/reference/koin-annotations/definitions)** – 所有定义注解
- **[模块](/docs/reference/koin-annotations/modules)** – 模块组织
- **[KMP 支持](/docs/reference/koin-annotations/kmp)** – Kotlin 多平台