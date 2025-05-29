[//]: # (title: KSP 常见问题)

### 为什么选择 KSP？

KSP 相比 [kapt](kapt.md) 有多个优势：
* 它速度更快。
* API 对于 Kotlin 用户而言更流畅。
* 它支持对生成的 Kotlin 源码进行 [多轮处理](ksp-multi-round.md)。
* 它的设计考虑了多平台兼容性。

### 为什么 KSP 比 kapt 更快？

kapt 必须解析和解决每个类型引用以生成 Java 存根，而 KSP 则是按需解析引用。委托给 javac 也需要时间。

此外，KSP 的 [增量处理模型](ksp-incremental.md) 具有比单纯隔离和聚合更细的粒度。它能找到更多机会避免重新处理所有内容。而且，由于 KSP 动态追踪符号解析，一个文件中的更改不太可能污染其他文件，因此需要重新处理的文件集更小。这对于 kapt 是不可能的，因为它将处理委托给了 javac。

### KSP 是 Kotlin 特有的吗？

KSP 也可以处理 Java 源码。API 是统一的，这意味着当你解析一个 Java 类和一个 Kotlin 类时，在 KSP 中会得到一个统一的数据结构。

### 如何升级 KSP？

KSP 包含 API 和实现。API 很少改变并且向后兼容：可以有新的接口，但旧的接口永远不会改变。实现与特定的编译器版本绑定。随着新版本的发布，支持的编译器版本可能会改变。

处理器只依赖于 API，因此不与编译器版本绑定。然而，处理器的使用者在他们的项目中提升编译器版本时，需要提升 KSP 的版本。否则，将出现以下错误：

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> 处理器的使用者不需要提升处理器的版本，因为处理器只依赖于 API。
>
{style="note"}

例如，某个处理器是随 KSP 1.0.1 发布并测试的，KSP 1.0.1 严格依赖于 Kotlin 1.6.0。要使其与 Kotlin 1.6.20 协同工作，你唯一需要做的就是将 KSP 提升到为 Kotlin 1.6.20 构建的版本（例如，KSP 1.1.0）。

### 我可以使用更新的 KSP 实现与旧的 Kotlin 编译器吗？

如果语言版本相同，Kotlin 编译器应该向后兼容。大多数情况下，提升 Kotlin 编译器版本应该是微不足道的。如果你需要更新的 KSP 实现，请相应地升级 Kotlin 编译器。

### KSP 的更新频率如何？

KSP 尽量遵循 [语义化版本控制](https://semver.org/)。对于 KSP 版本 `major.minor.patch`，
* `major` 保留用于不兼容的 API 更改。没有预定的发布计划。
* `minor` 保留用于新功能。大约每季度更新一次。
* `patch` 保留用于错误修复和新的 Kotlin 版本发布。大约每月更新一次。

通常，在新的 Kotlin 版本发布后几天内，相应的 KSP 版本就会推出，包括 [预发布版本 (Beta 或 RC)](eap.md)。

### 除了 Kotlin，对库还有其他版本要求吗？

以下是针对库/基础设施的要求列表：
* Android Gradle Plugin 7.1.3+
* Gradle 6.8.3+

### KSP 的未来路线图是什么？

以下事项已列入计划：
* 支持 [新的 Kotlin 编译器](roadmap.md)
* 改进对多平台的支持。例如，在部分目标上运行 KSP / 或在不同目标之间共享计算。
* 提升性能。还有一系列优化工作要做！
* 持续修复错误。

如果您想讨论任何想法，欢迎通过 [#ksp Kotlin Slack 频道](https://kotlinlang.slack.com/archives/C013BA8EQSE)（[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）与我们联系。也欢迎提交 [GitHub issue/功能请求](https://github.com/google/ksp/issues) 或 pull request！