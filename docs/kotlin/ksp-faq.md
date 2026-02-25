[//]: # (title: KSP 常见问题解答)

### 为什么选择 KSP？

相比 [kapt](kapt.md)，KSP 具有以下几个优势：
* 速度更快。
* 对于 Kotlin 用户，其 API 更加流畅。
* 它支持对生成的 Kotlin 源代码进行[多轮次处理](ksp-multi-round.md)。
* 它在设计时就考虑了多平台兼容性。

### 为什么 KSP 比 kapt 快？

kapt 必须解析并处理每个类型引用以生成 Java 存根，而 KSP 按需解析引用。委托给 javac 也会耗费时间。

此外，KSP 的[增量处理模型](ksp-incremental.md)比单纯的隔离与聚合具有更细的粒度。它能找到更多避免重新处理所有内容的机会。此外，由于 KSP 动态跟踪符号解析，文件更改不太可能污染其他文件，因此需要重新处理的文件集更小。由于 kapt 将处理任务委托给了 javac，因此无法做到这一点。

### KSP 是 Kotlin 专用的吗？

KSP 也可以处理 Java 源代码。其 API 是统一的，这意味着当您解析 Java 类和 Kotlin 类时，会在 KSP 中获得统一的数据结构。

### 如何升级 KSP？

KSP 包含 API 和实现。API 极少发生变化且向后兼容：可能会有新接口，但旧接口永不改变。其实现与特定的编译器版本绑定。随着新版本的发布，支持的编译器版本可能会发生变化。

处理器仅依赖于 API，因此不与编译器版本绑定。
但是，当处理器用户在项目中升级编译器版本时，也需要升级 KSP 版本。
否则，将出现以下错误：

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> 处理器用户不需要升级处理器的版本，因为处理器仅依赖于 API。
>
{style="note"}

例如，某个处理器发布时是使用 KSP 1.0.1 进行测试的，该版本严格依赖于 Kotlin 1.6.0。为了使其适用于 Kotlin 1.6.20，您唯一需要做的就是将 KSP 升级到为 Kotlin 1.6.20 构建的版本（例如，KSP 1.1.0）。

### 我可以在旧版 Kotlin 编译器中使用新版 KSP 实现吗？

如果语言版本相同，Kotlin 编译器应该是向后兼容的。大多数情况下，升级 Kotlin 编译器应该是很简单的。如果您需要更新的 KSP 实现，请相应地升级 Kotlin 编译器。

### KSP 多久更新一次？

KSP 尽可能遵循[语义化版本控制 (Semantic Versioning)](https://semver.org/)。
对于版本号为 `major.minor.patch` 的 KSP：
* `major`（主版本号）预留给不兼容的 API 变更。目前没有预定的发布计划。
* `minor`（次版本号）预留给新功能。大约每季度更新一次。
* `patch`（修订号）预留给错误修复和新的 Kotlin 版本发布。大约每月更新一次。

通常在新的 Kotlin 版本（包括[预览版（Beta 或 RC）](eap.md)）发布后的几天内，就会提供相应的 KSP 版本。

### 除了 Kotlin，库还有其他版本要求吗？

以下是库/基础架构的要求列表：
* Android Gradle 插件 7.1.3+
* Gradle 6.8.3+

### KSP 未来的路线图是什么？

已计划以下项目：
* 支持[新 Kotlin 编译器](roadmap.md)
* 改进对多平台的支持。例如，在目标子集上运行 KSP/在目标之间共享计算。
* 提升性能。还有大量的优化工作要做！
* 持续修复错误。

如果您想讨论任何想法，欢迎随时在 [Kotlin Slack 的 #ksp 频道](https://kotlinlang.slack.com/archives/C013BA8EQSE)（[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）中联系我们。也欢迎提交 [GitHub 问题/功能请求](https://github.com/google/ksp/issues)或拉取请求 (PR)！