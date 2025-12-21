[//]: # (title: Dokka Gradle 故障排除)

本页面描述了在使用 Dokka 生成 Gradle 构建文档时可能遇到的常见问题。

如果您的问题未在此处列出，请在我们的[问题跟踪器](https://kotl.in/dokka-issues)中报告任何反馈或问题，或在官方 [Kotlin Slack](https://kotlinlang.slack.com/) 中与 Dokka 社区交流。在[此处](https://kotl.in/slack)获取 Slack 邀请。

## 内存问题

在大型项目中，Dokka 在生成文档时可能会消耗大量内存。
这可能会超出 Gradle 的内存限制，尤其是在处理大量数据时。

当 Dokka 生成内存不足时，构建会失败，并且 Gradle 可能会抛出诸如 `java.lang.OutOfMemoryError: Metaspace` 的异常。

正在积极努力改进 Dokka 的性能，尽管某些限制源于 Gradle。

如果您遇到内存问题，请尝试以下变通方法：

* [增加堆空间](#increase-heap-space)
* [在 Gradle 进程中运行 Dokka](#run-dokka-within-the-gradle-process)

### 增加堆空间

解决内存问题的一种方法是增加 Dokka 生成器进程的 Java 堆内存量。
在 `build.gradle.kts` 文件中，调整以下配置选项：

```kotlin
    dokka {
        // Dokka generates a new process managed by Gradle
        dokkaGeneratorIsolation = ProcessIsolation {
            // Configures heap size
            maxHeapSize = "4g"
        }
    }
```

在此示例中，最大堆大小设置为 4 GB (`"4g"`)。
调整并测试该值，以找到适用于您构建的最佳设置。

如果您发现 Dokka 需要显著扩大的堆大小，例如远高于 Gradle 自身的内存使用量，
请[在 Dokka 的 GitHub 版本库上创建问题](https://kotl.in/dokka-issues)。

> 您必须将此配置应用于每个子项目。
> 建议您在应用于所有子项目的约定插件中配置 Dokka。
>
{style="note"}

### 在 Gradle 进程中运行 Dokka

当 Gradle 构建和 Dokka 生成都需要大量内存时，它们可能会作为单独的进程运行，
在单台机器上消耗大量内存。

为了优化内存使用，您可以在同一个 Gradle 进程中运行 Dokka，而不是作为单独的进程。
这允许您一次性为 Gradle 配置内存，而不是为每个进程单独分配。

要在同一个 Gradle 进程中运行 Dokka，请在 `build.gradle.kts` 文件中调整以下配置选项：

```kotlin
    dokka {
        // Runs Dokka in the current Gradle process
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

与[增加堆空间](#increase-heap-space)一样，测试此配置以确认它适用于您的项目。

有关配置 Gradle 的 JVM 内存的更多详细信息，
请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)。

> 更改 Gradle 的 Java 选项会启动一个新的 Gradle 守护进程，该进程可能会长时间保持活跃。您可以[手动停止任何其他 Gradle 进程](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)。
>
> 此外，采用 `ClassLoaderIsolation()` 配置的 Gradle 问题可能会[导致内存泄漏](https://github.com/gradle/gradle/issues/18313)。
>
{style="note"}