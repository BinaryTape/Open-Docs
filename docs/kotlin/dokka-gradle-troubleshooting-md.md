[//]: # (title: Dokka Gradle 故障排除)

本页介绍了在 Gradle 构建中使用 Dokka 生成文档时可能遇到的常见问题。

如果此处未列出您的问题，请在我们的 [问题跟踪器](https://kotl.in/dokka-issues) 中提交反馈或报告问题，或者在官方 [Kotlin Slack](https://kotlinlang.slack.com/) 中与 Dokka 社区交流。点击 [此处](https://kotl.in/slack) 获取 Slack 邀请。

## 内存问题

在大型项目中，Dokka 生成文档可能会消耗大量内存。这可能会超出 Gradle 的内存限制，尤其是在处理海量数据时。

当 Dokka 生成导致内存不足时，构建将失败，且 Gradle 可能会抛出诸如 `java.lang.OutOfMemoryError: Metaspace` 之类的异常。

我们正在积极努力提升 Dokka 的性能，不过部分限制源于 Gradle 本身。

如果您遇到内存问题，请尝试以下权宜之计：

* [增加堆空间](#increase-heap-space)
* [在 Gradle 进程中运行 Dokka](#run-dokka-within-the-gradle-process)

### 增加堆空间

解决内存问题的一种方法是增加 Dokka 生成器进程的 Java 堆内存。在 `build.gradle.kts` 文件中，调整以下配置选项：

```kotlin
    dokka {
        // Dokka 会生成一个由 Gradle 管理的新进程
        dokkaGeneratorIsolation = ProcessIsolation {
            // 配置堆大小
            maxHeapSize = "4g"
        }
    }
```

在此示例中，最大堆大小被设置为 4 GB (`"4g"`)。请根据您的构建情况调整并测试该值，以找到最佳设置。

如果您发现 Dokka 需要大幅扩展堆大小（例如显著高于 Gradle 自身的内存使用量），请在 [Dokka 的 GitHub 仓库中创建问题](https://kotl.in/dokka-issues)。

> 您必须将此配置应用于每个子项目。建议您在一个应用于所有子项目的惯例插件 (convention plugin) 中配置 Dokka。
>
{style="note"}

### 在 Gradle 进程中运行 Dokka

当 Gradle 构建和 Dokka 生成都需要大量内存时，它们可能会作为独立的进程运行，从而在单台机器上消耗大量内存。

为优化内存使用，您可以在同一个 Gradle 进程中运行 Dokka，而不是将其作为独立进程。这样您只需为 Gradle 配置一次内存，而无需为每个进程分别分配。

若要在同一个 Gradle 进程中运行 Dokka，请在 `build.gradle.kts` 文件中调整以下配置选项：

```kotlin
    dokka {
        // 在当前 Gradle 进程中运行 Dokka
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

与 [增加堆空间](#increase-heap-space) 一样，请测试此配置以确认其在您的项目中运行良好。

有关配置 Gradle 的 JVM 内存的更多详细信息，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)。

> 更改 Gradle 的 Java 选项会启动一个新的 Gradle 守护进程 (daemon)，该进程可能会长时间保持活跃。您可以 [手动停止任何其他 Gradle 进程](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)。
>
> 此外，带有 `ClassLoaderIsolation()` 配置的 Gradle 问题可能会 [导致内存泄漏](https://github.com/gradle/gradle/issues/18313)。
>
{style="note"}