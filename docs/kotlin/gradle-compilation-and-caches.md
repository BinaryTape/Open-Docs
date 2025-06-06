[//]: # (title: Kotlin Gradle 插件中的编译与缓存)

本页将介绍以下主题：
* [增量编译](#incremental-compilation)
* [Gradle 构建缓存支持](#gradle-build-cache-support)
* [Gradle 配置缓存支持](#gradle-configuration-cache-support)
* [Kotlin 守护进程及如何与 Gradle 配合使用](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [回滚到旧版编译器](#rolling-back-to-the-previous-compiler)
* [定义 Kotlin 编译器执行策略](#defining-kotlin-compiler-execution-strategy)
* [Kotlin 编译器回退策略](#kotlin-compiler-fallback-strategy)
* [尝试最新语言版本](#trying-the-latest-language-version)
* [构建报告](#build-reports)

## 增量编译

Kotlin Gradle 插件支持增量编译，默认情况下，此功能在 Kotlin/JVM 和 Kotlin/JS 项目中启用。
增量编译会跟踪构建之间类路径中文件的更改，从而只编译受这些更改影响的文件。
此方法与 [Gradle 的构建缓存](#gradle-build-cache-support)兼容，并支持[编译规避](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。

对于 Kotlin/JVM，增量编译依赖于类路径快照，它捕获模块的 API 结构以确定何时需要重新编译。
为优化整体管道，Kotlin 编译器使用两种类型的类路径快照：

*   **细粒度快照：** 包含有关类成员的详细信息，例如属性或函数。当检测到成员级别更改时，Kotlin 编译器只重新编译依赖于修改成员的类。为保持性能，Kotlin Gradle 插件会为 Gradle 缓存中的 `.jar` 文件创建粗粒度快照。
*   **粗粒度快照：** 只包含类的 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 哈希。当 ABI 的一部分发生更改时，Kotlin 编译器会重新编译所有依赖于更改类的类。这对于不常更改的类（例如外部库）非常有用。

> Kotlin/JS 项目使用基于历史文件的不同增量编译方法。
>
{style="note"}

有几种方法可以禁用增量编译：

*   对于 Kotlin/JVM，设置 `kotlin.incremental=false`。
*   对于 Kotlin/JS 项目，设置 `kotlin.incremental.js=false`。
*   使用 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false` 作为命令行参数。

    该参数应添加到每个后续构建中。

禁用增量编译后，增量缓存将在构建后失效。第一个构建永远不是增量的。

> 有时，增量编译的问题会在故障发生数轮后才显现出来。使用[构建报告](#build-reports)来跟踪更改和编译的历史记录。这有助于您提供可重现的 bug 报告。
>
{style="tip"}

要了解当前增量编译方法的工作原理以及与旧方法的比较，请参阅我们的[博客文章](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)。

## Gradle 构建缓存支持

Kotlin 插件使用 [Gradle 构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)，它存储构建输出以供未来构建重用。

要禁用所有 Kotlin 任务的缓存，请将系统属性 `kotlin.caching.enabled` 设置为 `false`（使用参数 `-Dkotlin.caching.enabled=false` 运行构建）。

## Gradle 配置缓存支持

Kotlin 插件使用 [Gradle 配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)，通过重用配置阶段的结果来加快后续构建的构建过程。

请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)了解如何启用配置缓存。启用此功能后，Kotlin Gradle 插件会自动开始使用它。

## Kotlin 守护进程及如何与 Gradle 配合使用

Kotlin 守护进程：
*   与 Gradle 守护进程一起运行以编译项目。
*   当您使用 IntelliJ IDEA 内置构建系统编译项目时，与 Gradle 守护进程分开运行。

当某个 Kotlin 编译任务开始编译源文件时，Kotlin 守护进程会在 Gradle 的[执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases)启动。
Kotlin 守护进程会随 Gradle 守护进程一起停止，或者在没有 Kotlin 编译的两个小时空闲后停止。

Kotlin 守护进程使用与 Gradle 守护进程相同的 JDK。

### 设置 Kotlin 守护进程的 JVM 参数

以下设置参数的每种方式都会覆盖之前的设置：
*   [Gradle 守护进程参数继承](#gradle-daemon-arguments-inheritance)
*   [`kotlin.daemon.jvm.options` 系统属性](#kotlin-daemon-jvm-options-system-property)
*   [`kotlin.daemon.jvmargs` 属性](#kotlin-daemon-jvmargs-property)
*   [`kotlin` 扩展](#kotlin-extension)
*   [特定任务定义](#specific-task-definition)

#### Gradle 守护进程参数继承

默认情况下，Kotlin 守护进程会从 Gradle 守护进程继承一组特定参数，但会用直接为 Kotlin 守护进程指定的任何 JVM 参数覆盖它们。例如，如果您在 `gradle.properties` 文件中添加以下 JVM 参数：

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

这些参数随后会添加到 Kotlin 守护进程的 JVM 参数中：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

> 要了解有关 Kotlin 守护进程在 JVM 参数方面的默认行为，请参阅[Kotlin 守护进程在 JVM 参数方面的行为](#kotlin-daemon-s-behavior-with-jvm-arguments)。
>
{style="note"}

#### kotlin.daemon.jvm.options 系统属性

如果 Gradle 守护进程的 JVM 参数包含 `kotlin.daemon.jvm.options` 系统属性，请在 `gradle.properties` 文件中使用它：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

传递参数时，请遵循以下规则：
*   仅在 `Xmx`、`XX:MaxMetaspaceSize` 和 `XX:ReservedCodeCacheSize` 参数前使用负号 `-`。
*   用逗号 (`,`) 分隔参数，_不_留空格。空格后的参数将用于 Gradle 守护进程，而非 Kotlin 守护进程。

> 如果满足以下所有条件，Gradle 将忽略这些属性：
> *   Gradle 使用 JDK 1.9 或更高版本。
> *   Gradle 版本在 7.0 到 7.1.1（含）之间。
> *   Gradle 正在编译 Kotlin DSL 脚本。
> *   Kotlin 守护进程未运行。
>
> 为解决此问题，请将 Gradle 升级到 7.2（或更高）版本，或者使用 `kotlin.daemon.jvmargs` 属性——请参阅下一节。
>
{style="warning"}

#### kotlin.daemon.jvmargs 属性

您可以在 `gradle.properties` 文件中添加 `kotlin.daemon.jvmargs` 属性：

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

请注意，如果您在此处或 Gradle 的 JVM 参数中未指定 `ReservedCodeCacheSize` 参数，Kotlin Gradle 插件将应用默认值 `320m`：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlin 扩展

您可以在 `kotlin` 扩展中指定参数：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</tab>
</tabs>

#### 特定任务定义

您可以为特定任务指定参数：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(CompileUsingKotlinDaemon).configureEach { task ->
    task.kotlinDaemonJvmArguments = ["-Xmx1g", "-Xms512m"]
}
```

</tab>
</tabs>

> 在这种情况下，任务执行时可能会启动新的 Kotlin 守护进程实例。了解更多关于[Kotlin 守护进程在 JVM 参数方面的行为](#kotlin-daemon-s-behavior-with-jvm-arguments)。
>
{style="note"}

### Kotlin 守护进程在 JVM 参数方面的行为

配置 Kotlin 守护进程的 JVM 参数时，请注意：

*   当不同的子项目或任务具有不同的 JVM 参数集时，预期会同时运行多个 Kotlin 守护进程实例。
*   新的 Kotlin 守护进程实例仅在 Gradle 运行相关编译任务且现有 Kotlin 守护进程不具有相同 JVM 参数集时启动。
    假设您的项目有许多子项目。大多数都需要一些堆内存来供 Kotlin 守护进程使用，但其中一个模块需要很多（尽管它很少被编译）。
    在这种情况下，您应该为此类模块提供一组不同的 JVM 参数，这样具有更大堆大小的 Kotlin 守护进程将仅为接触此特定模块的开发人员启动。
    > 如果您已运行一个具有足够堆大小来处理编译请求的 Kotlin 守护进程，即使请求的其他 JVM 参数不同，该守护进程也将被重用，而不会启动新的守护进程。
    >
    {style="note"}

如果未指定以下参数，Kotlin 守护进程会从 Gradle 守护进程继承它们：

*   `-Xmx`
*   `-XX:MaxMetaspaceSize`
*   `-XX:ReservedCodeCacheSize`。如果未指定或继承，默认值为 `320m`。

Kotlin 守护进程具有以下默认 JVM 参数：
*   `-XX:UseParallelGC`。此参数仅在未指定其他垃圾收集器时应用。
*   `-ea`
*   `-XX:+UseCodeCacheFlushing`
*   `-Djava.awt.headless=true`
*   `-D{java.servername.property}={localhostip}`
*   `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`。此参数仅适用于 JDK 16 或更高版本。

> Kotlin 守护进程的默认 JVM 参数列表可能因版本而异。您可以使用 [VisualVM](https://visualvm.github.io/) 等工具检查正在运行的 JVM 进程（例如 Kotlin 守护进程）的实际设置。
>
{style="note"}

## 回滚到旧版编译器

从 Kotlin 2.0.0 开始，K2 编译器默认启用。

要在 Kotlin 2.0.0 或更高版本中使用旧版编译器，您可以选择以下方法之一：

*   在您的 `build.gradle.kts` 文件中，将[语言版本](gradle-compiler-options.md#example-of-setting-languageversion)设置为 `1.9`。

    或者
*   使用以下编译器选项：`-language-version 1.9`。

要了解 K2 编译器的更多优点，请参阅 [K2 编译器迁移指南](k2-compiler-migration-guide.md)。

## 定义 Kotlin 编译器执行策略

_Kotlin 编译器执行策略_定义了 Kotlin 编译器在哪里执行，以及在每种情况下是否支持增量编译。

有三种编译器执行策略：

| 策略           | Kotlin 编译器执行位置                 | 增量编译 | 其他特性和注意事项                                                                                                                                                                                                                                                           |
|--------------|--------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 守护进程 (Daemon) | 在其自己的守护进程中                   | 是       | _默认且最快的策略_。可以在不同的 Gradle 守护进程和多个并行编译之间共享。                                                                                                                                                                                    |
| 进程内 (In process) | 在 Gradle 守护进程中                  | 否       | 可能与 Gradle 守护进程共享堆内存。"进程内"执行策略比"守护进程"执行策略_慢_。每个[工作进程](https://docs.gradle.org/current/userguide/worker_api.html)为每个编译创建一个单独的 Kotlin 编译器类加载器。 |
| 进程外 (Out of process) | 为每个编译单独启动一个进程             | 否       | 最慢的执行策略。类似于"进程内"策略，但额外在 Gradle 工作进程内为每个编译创建一个单独的 Java 进程。                                                                                                                                                            |

要定义 Kotlin 编译器执行策略，您可以使用以下属性之一：
*   `kotlin.compiler.execution.strategy` Gradle 属性。
*   `compilerExecutionStrategy` 编译任务属性。

任务属性 `compilerExecutionStrategy` 优先于 Gradle 属性 `kotlin.compiler.execution.strategy`。

`kotlin.compiler.execution.strategy` 属性的可用值为：
1.  `daemon`（默认）
2.  `in-process`
3.  `out-of-process`

在 `gradle.properties` 中使用 Gradle 属性 `kotlin.compiler.execution.strategy`：

```none
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任务属性的可用值为：
1.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON`（默认）
2.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在您的构建脚本中使用任务属性 `compilerExecutionStrategy`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
    .configureEach {
        compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
    }
```

</tab>
</tabs>

## Kotlin 编译器回退策略

Kotlin 编译器的回退策略是，如果守护进程出现故障，则在 Kotlin 守护进程之外运行编译。
如果 Gradle 守护进程处于开启状态，编译器会使用[“进程内”策略](#defining-kotlin-compiler-execution-strategy)。
如果 Gradle 守护进程处于关闭状态，编译器会使用“进程外”策略。

发生此回退时，您的 Gradle 构建输出中会出现以下警告行：

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

然而，静默回退到另一种策略可能会消耗大量系统资源或导致非确定性构建。
在此 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy) 中了解更多信息。
为避免此问题，有一个 Gradle 属性 `kotlin.daemon.useFallbackStrategy`，其默认值为 `true`。
当值为 `false` 时，构建会因守护进程启动或通信问题而失败。在 `gradle.properties` 中声明此属性：

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlin 编译任务中还有一个 `useDaemonFallbackStrategy` 属性，如果您同时使用这两个属性，则该属性优先于 Gradle 属性。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```
</tab>
</tabs>

如果内存不足以运行编译，您会在日志中看到相关消息。

## 尝试最新语言版本

从 Kotlin 2.0.0 开始，要尝试最新语言版本，请在 `gradle.properties` 文件中设置 `kotlin.experimental.tryNext` 属性。当您使用此属性时，Kotlin Gradle 插件会将语言版本增加到您的 Kotlin 版本的默认值之上。例如，在 Kotlin 2.0.0 中，默认语言版本是 2.0，因此该属性会配置语言版本 2.1。

或者，您可以运行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
```

在[构建报告](#build-reports)中，您可以找到用于编译每个任务的语言版本。

## 构建报告

构建报告包含不同编译阶段的持续时间以及编译无法增量的任何原因。
当编译时间过长或同一项目的编译时间不同时，可以使用构建报告来调查性能问题。

Kotlin 构建报告可帮助您更高效地调查构建性能问题，相比之下，[Gradle 构建扫描](https://scans.gradle.com/)以单个 Gradle 任务作为粒度单位，效率较低。

分析长时间运行的编译的构建报告可以帮助您解决两种常见情况：
*   构建不是增量的。分析原因并解决潜在问题。
*   构建是增量的但耗时过长。尝试重新组织源文件——拆分大文件，将单独的类保存在不同的文件中，重构大型类，在不同的文件中声明顶层函数等等。

构建报告还显示项目中使用的 Kotlin 版本。此外，从 Kotlin 1.9.0 开始，您可以在 [Gradle 构建扫描](https://scans.gradle.com/)中看到用于编译代码的编译器。

了解[如何阅读构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports)以及 [JetBrains 如何使用构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains)。

### 启用构建报告

要启用构建报告，请在 `gradle.properties` 中声明保存构建报告输出的位置：

```none
kotlin.build.report.output=file
```

以下值及其组合可用于输出：

| 选项         | 描述                                                                                                                                                                                                       |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file`     | 以人类可读的格式将构建报告保存到本地文件。默认情况下，它位于 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`。                                                              |
| `single_file` | 以对象格式将构建报告保存到指定的本地文件。                                                                                                                                                                |
| `build_scan` | 将构建报告保存到 [构建扫描](https://scans.gradle.com/)的 `custom values` 部分。请注意，Gradle Enterprise 插件限制了自定义值的数量和长度。在大型项目中，某些值可能会丢失。                                       |
| `http`     | 使用 HTTP(S) 发布构建报告。POST 方法以 JSON 格式发送指标。您可以在 [Kotlin 仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)中查看发送数据的当前版本。您可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#enable_build_reports)中找到 HTTP 端点示例。 |
| `json`     | 以 JSON 格式将构建报告保存到本地文件。在 `kotlin.build.report.json.directory` 中设置构建报告的位置（参见下文）。默认情况下，其名称为 `${project_name}-build-<date-time>-<index>.json`。               |

以下是 `kotlin.build.report` 的可用选项列表：

```none
# Required outputs. Any combination is allowed
kotlin.build.report.output=file,single_file,http,build_scan,json

# Mandatory if single_file output is used. Where to put reports
# Use instead of the deprecated `kotlin.internal.single.build.metrics.file` property
kotlin.build.report.single_file=some_filename

# Mandatory if json output is used. Where to put reports
kotlin.build.report.json.directory=my/directory/path

# Optional. Output directory for file-based reports. Default: build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# Optional. Label for marking your build report (for example, debug parameters)
kotlin.build.report.label=some_label
```

仅适用于 HTTP 的选项：

```none
# Mandatory. Where to post HTTP(S)-based reports
kotlin.build.report.http.url=http://127.0.0.1:8080

# Optional. User and password if the HTTP endpoint requires authentication
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# Optional. Add a Git branch name of a build to a build report
kotlin.build.report.http.include_git_branch.name=true|false

# Optional. Add compiler arguments to a build report
# If a project contains many modules, its compiler arguments in the report can be very heavy and not that helpful
kotlin.build.report.include_compiler_arguments=true|false
```

### 自定义值限制

为了收集构建扫描的统计信息，Kotlin 构建报告使用 [Gradle 的自定义值](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/)。
您和不同的 Gradle 插件都可以将数据写入自定义值。自定义值的数量是有限制的。
请在 [构建扫描插件文档](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values)中查看当前自定义值的最大数量。

如果您的项目很大，此类自定义值的数量可能会非常大。如果此数量超出限制，您可能会在日志中看到以下消息：

```text
Maximum number of custom values (1,000) exceeded
```

为了减少 Kotlin 插件生成的自定义值数量，您可以在 `gradle.properties` 中使用以下属性：

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### 关闭项目和系统属性的收集

HTTP 构建统计日志可能包含一些项目和系统属性。这些属性可以改变构建行为，因此将它们记录在构建统计信息中很有用。
这些属性可能存储敏感数据，例如密码或项目的完整路径。

您可以通过将 `kotlin.build.report.http.verbose_environment` 属性添加到 `gradle.properties` 中来禁用这些统计信息的收集。

> JetBrains 不会收集这些统计信息。您选择[存储报告的位置](#enabling-build-reports)。
>
{style="note"}

## 接下来？

了解更多关于：
*   [Gradle 基础知识和细节](https://docs.gradle.org/current/userguide/userguide.html)。
*   [Gradle 插件变体支持](gradle-plugin-variants.md)。