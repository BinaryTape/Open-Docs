[//]: # (title: KSP 常见问题)

### 为什么选择 KSP？

KSP 相较于 [kapt](kapt.md) 有以下几点优势：
* 速度更快。
* API 对 Kotlin 用户来说更流畅。
* 它支持对生成的 Kotlin 源代码进行 [多轮处理](ksp-multi-round.md)。
* 它的设计考虑了多平台兼容性。

### 为什么 KSP 比 kapt 更快？

kapt 必须解析和解析每个类型引用才能生成 Java 存根，而 KSP 则是按需解析引用。将任务委托给 javac 也会耗费时间。

此外，KSP 的 [增量处理模型](ksp-incremental.md) 比单纯的隔离和聚合具有更细的粒度。它能找到更多机会来避免重新处理所有内容。此外，由于 KSP 动态跟踪符号解析，文件中的更改不太可能污染其他文件，因此需要重新处理的文件集也更小。这对于 kapt 是不可能的，因为它将处理委托给 javac。

### KSP 是 Kotlin 特有的吗？

KSP 也可以处理 Java 源代码。API 是统一的，这意味着当你解析 Java 类和 Kotlin 类时，KSP 会提供统一的数据结构。

### 如何升级 KSP？

KSP 包含 API 和实现。API 很少更改并向后兼容：可能会有新接口，但旧接口永不更改。实现与特定的编译器版本绑定。随着新版本的发布，支持的编译器版本可能会更改。

处理器仅依赖于 API，因此不与编译器版本绑定。然而，处理器用户在项目中提升编译器版本时，需要同时提升 KSP 版本。否则，将出现以下错误：

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> 处理器用户无需提升处理器的版本，因为处理器仅依赖于 API。
>
{style="note"}

例如，某个处理器发布并经过 KSP 1.0.1 测试，该版本严格依赖于 Kotlin 1.6.0。为了使其与 Kotlin 1.6.20 兼容，你唯一需要做的就是将 KSP 提升到针对 Kotlin 1.6.20 构建的版本（例如 KSP 1.1.0）。

### 我可以使用较新的 KSP 实现与较旧的 Kotlin 编译器吗？

如果语言版本相同，Kotlin 编译器应向后兼容。提升 Kotlin 编译器版本通常是微不足道的。如果你需要更新的 KSP 实现，请相应地升级 Kotlin 编译器。

### KSP 的更新频率如何？

KSP 尽可能遵循 [语义化版本控制](https://semver.org/)。
对于 KSP 版本 `major.minor.patch`：
* `major` 版本号保留给不兼容的 API 更改。对此没有预设的发布计划。
* `minor` 版本号保留给新特性。大约每季度更新一次。
* `patch` 版本号保留给错误修复和新的 Kotlin 发布。大约每月更新一次。

通常，在新 Kotlin 版本发布后的几天内，就会发布相应的 KSP 版本，包括 [预发布版本（Beta 或 RC）](eap.md)。

### 除了 Kotlin，还有其他库的版本要求吗？

以下是库/基础设施的版本要求列表：
* Android Gradle Plugin 7.1.3+
* Gradle 6.8.3+

### KSP 的未来路线图是什么？

已规划以下事项：
* 支持 [新的 Kotlin 编译器](roadmap.md)
* 改进对多平台的支持。例如，在目标子集上运行 KSP/在目标之间共享计算。
* 提升性能。还有大量的优化工作要做！
* 持续修复错误。

如果你想讨论任何想法，请随时通过 [Kotlin Slack 中的 #ksp 频道](https://kotlinlang.slack.com/archives/C013BA8EQSE)（[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）联系我们。也欢迎提交 [GitHub issue/特性请求](https://github.com/google/ksp/issues) 或拉取请求！