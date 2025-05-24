---
title: "KSP 常见问题"
---
### 为什么选择 KSP？

KSP 相较于 [kapt](kapt) 有以下几个优势：
* 速度更快。
* 对于 Kotlin 用户来说，API 更加流畅。
* 支持对生成的 Kotlin 源码进行[多轮处理](ksp-multi-round)（multiple round processing）。
* 在设计时考虑了多平台兼容性（multiplatform compatibility）。

### 为什么 KSP 比 kapt 快？

kapt 必须解析并解析每个类型引用才能生成 Java 存根（stubs），而 KSP 则按需解析引用。委托给 javac 也需要时间。

此外，KSP 的[增量处理模型](ksp-incremental)（incremental processing model）比仅仅隔离和聚合具有更细的粒度。它可以找到更多避免重新处理一切的机会。而且，由于 KSP 动态地跟踪符号解析，因此文件中发生的更改不太可能污染其他文件，因此需要重新处理的文件集更小。这对于 kapt 来说是不可能的，因为它将处理委托给 javac。

### KSP 是 Kotlin 特有的吗？

KSP 也可以处理 Java 源码。API 是统一的，这意味着当您解析 Java 类和 Kotlin 类时，您会在 KSP 中获得统一的数据结构。

### 如何升级 KSP？

KSP 有 API 和实现。API 很少更改，并且向后兼容：可以有新的接口，但旧的接口永远不会更改。实现与特定的编译器版本相关联。在新版本中，支持的编译器版本可能会更改。

处理器（Processor）仅依赖于 API，因此不受编译器版本的限制。但是，处理器（Processor）的用户需要在升级项目中的编译器版本时升级 KSP 版本。否则，将发生以下错误：

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

:::note
处理器（Processor）的用户无需升级处理器（Processor）的版本，因为处理器（Processor）仅依赖于 API。

:::

例如，某些处理器（Processor）已发布并通过 KSP 1.0.1 进行了测试，该版本严格依赖于 Kotlin 1.6.0。要使其与 Kotlin 1.6.20 一起使用，您只需将 KSP 升级到为 Kotlin 1.6.20 构建的版本（例如，KSP 1.1.0）。

### 我可以在较旧的 Kotlin 编译器中使用较新的 KSP 实现吗？

如果语言版本相同，则 Kotlin 编译器应该是向后兼容的。在大多数情况下，升级 Kotlin 编译器应该是很简单的。如果您需要更新的 KSP 实现，请相应地升级 Kotlin 编译器。

### 你们多久更新一次 KSP？

KSP 尽量遵循 [Semantic Versioning](https://semver.org/)。对于 KSP 版本 `major.minor.patch`，
* `major` 保留用于不兼容的 API 更改。对此没有预定的时间表。
* `minor` 保留用于新功能。这将大约每季度更新一次。
* `patch` 保留用于错误修复和新的 Kotlin 版本。它大约每月更新一次。

通常，在发布新 Kotlin 版本后的几天内，包括[预发布版本 (Beta 或 RC)](eap)，都会提供相应的 KSP 版本。

### 除了 Kotlin 之外，对库还有其他版本要求吗？

以下是库/基础设施的要求列表：
* Android Gradle Plugin 7.1.3+
* Gradle 6.8.3+

### KSP 未来的发展路线图是什么？

以下项目已经计划好：
* 支持[新的 Kotlin 编译器](https://kotlinlang.org/docs/roadmap.html)
* 改进对多平台的支持。例如，在目标的子集上运行 KSP/在目标之间共享计算。
* 提高性能。有很多优化要做！
* 持续修复 Bug。

如果您想讨论任何想法，请随时通过 [#ksp channel in Kotlin Slack](https://kotlinlang.slack.com/archives/C013BA8EQSE) 联系我们（[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。也欢迎提交 [GitHub issues/feature requests](https://github.com/google/ksp/issues) 或 pull requests！