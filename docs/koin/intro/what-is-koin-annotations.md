---
title: 什么是 Koin Annotations？
---

# 什么是 Koin Annotations？

### 熟悉的注解风格 —— Koin 主项目的一部分

**Koin Annotations** 是在 Koin 中基于注解定义依赖项的方式。如果您更喜欢 `@Singleton`、`@Factory`、`@KoinViewModel` 的风格而非 Kotlin DSL，那么它非常适合您。

它是 **Koin 主项目的一部分** —— 相同的 GitHub 仓库、相同的发布周期、相同的 Koin 版本、相同的维护者。不是副作用项目，不是社区分支，也不是独立的框架。它由 **Koin 编译器插件**处理，以实现编译时安全性，就像 DSL 一样。

## 简而言之

```kotlin
@Singleton
class UserRepository(private val api: ApiService)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

这就是核心思想：为您的类添加注解，声明一个模块，Koin 编译器插件会在构建时完成剩余的装配工作。

## Koin 主项目的一部分

`koin-annotations` 库是 **Koin 主项目的一部分**。它位于同一个仓库中，以与 `koin-core` **相同的 Koin 版本**发布，遵循相同的发布周期，并包含在 Koin BOM 中：

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
    implementation("io.insert-koin:koin-annotations") // 相同的 Koin 版本，相同的 BOM
}
```

在实践中，这意味着：

- **未弃用** —— 注解是一种一等的、完全受支持的风格
- **不是独立的产品** —— 没有需要单独跟踪的 “Koin Annotations” 项目
- **版本保持同步** —— `koin-core` 和 `koin-annotations` 始终匹配
- **与 DSL 的功能完全对等** —— 您可以使用 DSL 完成的任何操作，都可以通过注解完成

## 现由 Koin 编译器插件提供支持

Koin Annotations 由 **Koin 编译器插件**处理 —— 这是一个直接与 Kotlin 编译器集成的原生 **Kotlin 编译器插件 (K2)**。无需 KSP，无需提交生成的代码文件，也无需额外的处理步骤。

您将获得：

- **自动装配** —— 自动检测并解析构造函数参数
- **编译时安全性** —— 在构建时捕获缺失的依赖项、限定符不匹配和错误的绑定
- **更简单的 KMP 设置** —— 无需针对每个目标进行 KSP 配置
- **相同的注解** —— `@Singleton`、`@Factory`、`@KoinViewModel`、`@Module`、`@ComponentScan`、`@Named`、`@InjectedParam` 等。

请参阅 [Koin 编译器插件](/docs/intro/koin-compiler-plugin) 了解其工作原理和生成内容的完整图景。

## `koin-ksp-compiler` 已弃用

:::warning
旧版 KSP 处理器 `koin-ksp-compiler` 已**弃用**，并将在未来的 Koin 版本中移除。
:::

注解本身**并未**弃用 —— 只有以前用于处理它们的基于 KSP 的处理器被弃用了。迁移是机械性的：

- **相同的注解** —— 您的 `@Singleton`、`@Module`、`@ComponentScan` 代码保持完全一致
- **停用 KSP 插件** —— 替换为 Koin 编译器插件
- **删除生成的文件** —— 编译器插件不会产生可见的生成源代码

请参阅[从 KSP 迁移到编译器插件](/docs/migration/from-ksp-to-compiler-plugin)了解详细步骤。

## 何时选择注解

注解和 DSL 都是一等的。在以下情况下请选择注解：

- 您来自 Hilt、Dagger 或 Spring，并希望使用熟悉的风格
- 您更喜欢将定义与其描述的类放在一起
- 您的团队在基于注解的配置上实现了标准化

如果您更喜欢 Kotlin 原生的、纯代码风格，请选择 DSL。您还可以在同一个项目中**混合使用两者** —— 它们由同一个编译器插件处理。

## 后续步骤

- **[Koin 编译器插件](/docs/intro/koin-compiler-plugin)** —— 插件如何为您的注解提供支持
- **[注解参考](/docs/reference/koin-annotations/start)** —— 完整的注解目录和模式
- **[从 KSP 迁移到编译器插件](/docs/migration/from-ksp-to-compiler-plugin)** —— 从 `koin-ksp-compiler` 升级的路径
- **[什么是 Koin？](/docs/intro/what-is-koin)** —— 宏观图景