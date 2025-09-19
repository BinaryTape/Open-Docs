[//]: # (title: Kotlin Gradle 插件中的编译与缓存)

在此页面上，你可以了解以下主题：
* [增量编译](#incremental-compilation)
* [Gradle 构建缓存支持](#gradle-build-cache-support)
* [Gradle 配置缓存支持](#gradle-configuration-cache-support)
* [Kotlin daemon 及其在 Gradle 中的使用](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [回滚到之前的编译器](#rolling-back-to-the-previous-compiler)
* [定义 Kotlin 编译器执行策略](#defining-kotlin-compiler-execution-strategy)
* [Kotlin 编译器回退策略](#kotlin-compiler-fallback-strategy)
* [尝试最新的语言版本](#trying-the-latest-language-version)
* [构建报告](#build-reports)

## 增量编译

Kotlin Gradle 插件支持增量编译，此特性默认已为 Kotlin/JVM 和 Kotlin/JS 项目启用。
增量编译会跟踪构建之间类路径中文件的更改，以便只编译受这些更改影响的文件。
此方法适用于 [Gradle 的构建缓存](#gradle-build-cache-support) 并支持 [编译避免](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。

对于 Kotlin/JVM，增量编译依赖于类路径快照，
这些快照捕获模块的 API 结构，以确定何时需要重新编译。
为了优化整体流水线，Kotlin 编译器使用两种类型的类路径快照：

*   **细粒度快照：** 包含有关类成员（例如属性或函数）的详细信息。
    当检测到成员级别更改时，Kotlin 编译器仅重新编译依赖于修改后成员的类。
    为了保持性能，Kotlin Gradle 插件会为 Gradle 缓存中的 `.jar` 文件创建粗粒度快照。
*   **粗粒度快照：** 仅包含类 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 散列值。
    当 ABI 的一部分发生更改时，Kotlin 编译器会重新编译所有依赖于已更改类的类。
    这对于不经常更改的类（例如外部库）非常有用。

> Kotlin/JS 项目使用一种基于历史文件的不同增量编译方法。
>
{style="note"}

有几种方法可以禁用增量编译：

*   为 Kotlin/JVM 设置 `kotlin.incremental=false`。
*   为 Kotlin/JS 项目设置 `kotlin.incremental.js=false`。
*   使用 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false` 作为命令行实参。

    此实参应添加到每个后续构建中。

禁用增量编译后，增量缓存将在构建后失效。首次构建永远不会是增量的。

> 有时，增量编译的问题会在故障发生数轮后才显现出来。使用[构建报告](#build-reports)
> 来追踪更改和编译的历史记录。这有助于你提供可复现的 Bug 报告。
>
{style="tip"}

关于我们当前增量编译方法的运作方式以及与之前方法的比较的更多信息，
请参见我们的[博客文章](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)。

## Gradle 构建缓存支持

Kotlin 插件使用 [Gradle 构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)，它存储
构建输出以供未来构建复用。

要禁用所有 Kotlin 任务的缓存，请将系统属性 `kotlin.caching.enabled` 设置为 `false`
（使用实参 `-Dkotlin.caching.enabled=false` 运行构建）。

## Gradle 配置缓存支持

Kotlin 插件使用 [Gradle 配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)，
它通过复用配置阶段的结果来加速后续构建的构建过程。

关于如何启用配置缓存，请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)。启用此特性后，Kotlin Gradle 插件将自动
开始使用它。

## Kotlin daemon 及其在 Gradle 中的使用

[Kotlin daemon](kotlin-daemon.md)：
*   与 Gradle daemon 一起运行以编译项目。
*   当你使用 IntelliJ IDEA 内置构建系统编译项目时，它会与 Gradle daemon 分开运行。

Kotlin daemon 在 Gradle [执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases)启动，
此时其中一个 Kotlin 编译任务开始编译源代码。
Kotlin daemon 会随 Gradle daemon 一起停止，或者在没有 Kotlin 编译的两个空闲小时后停止。

Kotlin daemon 使用与 Gradle daemon 相同的 JDK。

### 设置 Kotlin daemon 的 JVM 实参

以下每种设置实参的方式都会覆盖之前设置的方式：
*   [Gradle daemon 实参继承](#gradle-daemon-arguments-inheritance)
*   [`kotlin.daemon.jvm.options` 系统属性](#kotlin-daemon-jvm-options-system-property)
*   [`kotlin.daemon.jvmargs` 属性](#kotlin-daemon-jvmargs-property)
*   [`kotlin` 扩展](#kotlin-extension)
*   [特定任务定义](#specific-task-definition)

#### Gradle daemon 实参继承

默认情况下，Kotlin daemon 从 Gradle daemon 继承一组特定实参，但会用为 Kotlin daemon 直接指定的任何 JVM 实参覆盖它们。例如，如果你在 `gradle.properties` 文件中添加以下 JVM 实参：

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

这些实参随后会被添加到 Kotlin daemon 的 JVM 实参中：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

> 关于 Kotlin daemon 的 JVM 实参默认行为的更多信息，请参见[Kotlin daemon 的 JVM 实参行为](#kotlin-daemon-s-behavior-with-jvm-arguments)。
>
{style="note"}

#### kotlin.daemon.jvm.options 系统属性

如果 Gradle daemon 的 JVM 实参包含 `kotlin.daemon.jvm.options` 系统属性，则在 `gradle.properties` 文件中使用它：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

传递实参时，请遵循以下规则：
*   仅在实参 `Xmx`、`XX:MaxMetaspaceSize` 和 `XX:ReservedCodeCacheSize` 前使用减号 `-`。
*   使用逗号 (`,`) 分隔实参，**不要**留有空格。空格后的实参将用于 Gradle daemon，而不是 Kotlin daemon。

> 如果满足以下所有条件，Gradle 将忽略这些属性：
> *   Gradle 正在使用 JDK 1.9 或更高版本。
> *   Gradle 的版本在 7.0 到 7.1.1 之间（含）。
> *   Gradle 正在编译 Kotlin DSL 脚本。
> *   Kotlin daemon 未运行。
>
> 为了解决此问题，请将 Gradle 升级到 7.2 版（或更高版本），或使用 `kotlin.daemon.jvmargs` 属性——请参见下一节。
>
{style="warning"}

#### kotlin.daemon.jvmargs 属性

你可以在 `gradle.properties` 文件中添加 `kotlin.daemon.jvmargs` 属性：

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

请注意，如果你在此处或 Gradle 的 JVM 实参中未指定 `ReservedCodeCacheSize` 实参，Kotlin Gradle 插件将应用默认值 `320m`：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlin 扩展

你可以在 `kotlin` 扩展中指定实参：

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

你可以为特定任务指定实参：

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

> 在这种情况下，任务执行时可能会启动新的 Kotlin daemon 实例。关于[Kotlin daemon 的 JVM 实参行为](#kotlin-daemon-s-behavior-with-jvm-arguments)的更多信息，请参阅。
>
{style="note"}

### Kotlin daemon 的 JVM 实参行为

配置 Kotlin daemon 的 JVM 实参时，请注意：

*   当不同的子项目或任务具有不同的 JVM 实参集时，可能会有多个 Kotlin daemon 实例同时运行。
*   仅当 Gradle 运行相关编译任务且现有 Kotlin daemons 不具有相同的 JVM 实参集时，才会启动新的 Kotlin daemon 实例。
    假设你的项目有很多子项目。其中大多数都需要一些堆内存用于 Kotlin daemon，但有一个模块需要很多（尽管很少编译）。
    在这种情况下，你应该为此模块提供不同的 JVM 实参集，这样具有更大堆大小的 Kotlin daemon 将仅为接触此特定模块的开发者启动。
    > 如果你已在运行一个具有足够堆大小来处理编译请求的 Kotlin daemon，
    > 即使其他请求的 JVM 实参不同，此 daemon 也将被复用，而不是启动新的。
    >
    {style="note"}

如果未指定以下实参，Kotlin daemon 将从 Gradle daemon 继承它们：

*   `-Xmx`
*   `-XX:MaxMetaspaceSize`
*   `-XX:ReservedCodeCacheSize`。如果未指定或继承，默认值为 `320m`。

Kotlin daemon 具有以下默认 JVM 实参：
*   `-XX:UseParallelGC`。此实参仅在未指定其他垃圾收集器时应用。
*   `-ea`
*   `-XX:+UseCodeCacheFlushing`
*   `-Djava.awt.headless=true`
*   `-D{java.servername.property}={localhostip}`
*   `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`。此实参仅适用于 JDK 16 或更高版本。

> Kotlin daemon 的默认 JVM 实参列表可能因版本而异。你可以使用 [VisualVM](https://visualvm.github.io/) 等工具来检查正在运行的 JVM 进程（例如 Kotlin daemon）的实际设置。
>
{style="note"}

## 回滚到之前的编译器

从 Kotlin 2.0.0 开始，K2 编译器默认启用。

要从 Kotlin 2.0.0 起使用之前的编译器，可以：

*   在 `build.gradle.kts` 文件中，将[语言版本](gradle-compiler-options.md#example-of-setting-languageversion)设置为 `1.9`。

    或者
*   使用以下编译器选项：`-language-version 1.9`。

关于 K2 编译器优点的更多信息，请参见 [K2 编译器迁移指南](k2-compiler-migration-guide.md)。

## 定义 Kotlin 编译器执行策略

_Kotlin 编译器执行策略_ 定义了 Kotlin 编译器的执行位置以及每种情况下是否支持增量编译。

共有三种编译器执行策略：

| 策略       | Kotlin 编译器执行位置          | 增量编译 | 其他特点和注意事项                                                                                                                                                                                                                                                |
|------------|--------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Kotlin daemon  | 在其自己的 daemon 进程内              | 是       | _默认且最快的策略_。可在不同的 Gradle daemon 和多个并行编译之间共享。                                                                                                                                                                                        |
| 进程内     | 在 Gradle daemon 进程内           | 否       | 可能与 Gradle daemon 共享堆。“进程内”执行策略_比“Kotlin daemon”执行策略慢_。每个 [worker](https://docs.gradle.org/current/userguide/worker_api.html) 为每次编译创建一个单独的 Kotlin 编译器类加载器。 |
| 进程外     | 为每次编译创建单独的进程 | 否       | 最慢的执行策略。类似于“进程内”策略，但额外在 Gradle worker 中为每次编译创建一个单独的 Java 进程。                                                                                                                     |

要定义 Kotlin 编译器执行策略，你可以使用以下属性之一：
*   `kotlin.compiler.execution.strategy` Gradle 属性。
*   `compilerExecutionStrategy` 编译任务属性。

任务属性 `compilerExecutionStrategy` 的优先级高于 Gradle 属性 `kotlin.compiler.execution.strategy`。

`kotlin.compiler.execution.strategy` 属性的可用值有：
1.  `daemon` （默认）
2.  `in-process`
3.  `out-of-process`

在 `gradle.properties` 中使用 Gradle 属性 `kotlin.compiler.execution.strategy`：

```none
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任务属性的可用值有：
1.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` （默认）
2.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在构建脚本中使用任务属性 `compilerExecutionStrategy`：

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

Kotlin 编译器的回退策略是，如果 daemon 出现故障，则在 Kotlin daemon 之外运行编译。
如果 Gradle daemon 已开启，编译器将使用[“进程内”策略](#defining-kotlin-compiler-execution-strategy)。
如果 Gradle daemon 已关闭，编译器将使用“进程外”策略。

当发生此回退时，你会在 Gradle 的构建输出中看到以下警告行：

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

然而，静默回退到另一种策略可能会消耗大量系统资源或导致非确定性构建。
关于此问题的更多信息，请参见此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。
为避免此问题，有一个 Gradle 属性 `kotlin.daemon.useFallbackStrategy`，其默认值为 `true`。
当值为 `false` 时，构建会在 daemon 启动或通信出现问题时失败。在 `gradle.properties` 中声明此属性：

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlin 编译任务中还有一个 `useDaemonFallbackStrategy` 属性，如果你同时使用这两个属性，此任务属性的优先级更高。

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

如果运行编译的内存不足，你可以在日志中看到相关消息。

## 尝试最新的语言版本

从 Kotlin 2.0.0 开始，要尝试最新的语言版本，请在 `gradle.properties` 文件中设置 `kotlin.experimental.tryNext` 属性。
当你使用此属性时，Kotlin Gradle 插件会将语言版本增加到高于你的 Kotlin 版本的默认值。
例如，在 Kotlin 2.0.0 中，默认语言版本是 2.0，因此该属性将配置语言版本 2.1。

或者，你可以运行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
```

在[构建报告](#build-reports)中，你可以找到用于编译每个任务的语言版本。

## 构建报告

构建报告包含不同编译阶段的持续时间以及编译无法增量的任何原因。
当编译时间过长或对于同一项目而言编译时间不同时，可以使用构建报告来调查性能问题。

Kotlin 构建报告可以帮助你更高效地调查构建性能问题，相比之下，[Gradle 构建扫描](https://scans.gradle.com/) 的粒度单位是单个 Gradle 任务，效率较低。

分析长时间运行的编译的构建报告可以帮助你解决两种常见情况：
*   构建不是增量的。分析原因并修复潜在问题。
*   构建是增量的但耗时过长。尝试重组源文件——拆分大文件，
    将单独的类保存在不同文件中，重构大型类，在不同文件中声明顶层函数等等。

构建报告还会显示项目中使用的 Kotlin 版本。此外，从 Kotlin 1.9.0 开始，
你可以在 [Gradle 构建扫描](https://scans.gradle.com/) 中看到用于编译代码的编译器。

了解[如何阅读构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports)
以及 [JetBrains 如何使用构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains)。

### 启用构建报告

要启用构建报告，请在 `gradle.properties` 中声明构建报告输出的保存位置：

```none
kotlin.build.report.output=file
```

以下值及其组合可用于输出：

| 选项          | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file`      | 将构建报告以人类可读的格式保存到本地文件。默认情况下，它是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`                                                                                                                                                                                                                                                                                                                                                                              |
| `single_file` | 将构建报告以对象格式保存到指定的本地文件。                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `build_scan`| 将构建报告保存到 [构建扫描](https://scans.gradle.com/) 的 `custom values` 部分。请注意，Gradle Enterprise 插件限制了自定义值的数量和长度。在大型项目中，一些值可能会丢失。                                                                                                                                                                                                                                                                                                                               |
| `http`      | 使用 HTTP(S) 发布构建报告。POST 方法以 JSON 格式发送指标。你可以在 [Kotlin 版本库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中查看发送数据的当前版本。你可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#enable_build_reports)中找到 HTTP 端点示例。 |
| `json`      | 将构建报告以 JSON 格式保存到本地文件。在 `kotlin.build.report.json.directory` 中设置构建报告的位置（参见下文）。默认情况下，其名称为 `${project_name}-build-<date-time>-<index>.json`。                                                                                                                                                                                                                                                                                                            |

以下是 `kotlin.build.report` 的可用选项列表：

```none
# 必选输出。允许任意组合
kotlin.build.report.output=file,single_file,http,build_scan,json

# 如果使用 single_file 输出，则此项为必填。报告存放位置 
# 用此项替代已弃用的 `kotlin.internal.single.build.metrics.file` 属性
kotlin.build.report.single_file=some_filename

# 如果使用 json 输出，则此项为必填。报告存放位置 
kotlin.build.report.json.directory=my/directory/path

# 可选。基于文件的报告输出目录。默认值：build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# 可选。用于标记构建报告的标签（例如，调试实参）
kotlin.build.report.label=some_label
```

仅适用于 HTTP 的选项：

```none
# 必填。HTTP(S) 报告的发布位置
kotlin.build.report.http.url=http://127.0.0.1:8080

# 可选。如果 HTTP 端点需要认证，则为用户和密码
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# 可选。将构建的 Git 分支名称添加到构建报告
kotlin.build.report.http.include_git_branch.name=true|false

# 可选。将编译器实参添加到构建报告
# 如果一个项目包含多个模块，其报告中的编译器实参可能非常庞大且帮助不大
kotlin.build.report.include_compiler_arguments=true|false
```

### 自定义值限制

为了收集构建扫描的统计信息，Kotlin 构建报告使用 [Gradle 的自定义值](https://docs.gradle.org/current/userguide/tutorials/extending-build-scans/)。
你和不同的 Gradle 插件都可以将数据写入自定义值。自定义值的数量有上限。
请参见 [Build scan plugin docs](https://docs.gradle.org/current/userguide/gradle-plugin/#adding_custom_values) 中当前最大自定义值计数。

如果你有一个大型项目，此类自定义值的数量可能相当大。如果此数量超过限制，
你可能会在日志中看到以下消息：

```text
Maximum number of custom values (1,000) exceeded
```

为了减少 Kotlin 插件生成的自定义值数量，你可以在 `gradle.properties` 中使用以下属性：

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### 关闭项目和系统属性收集

HTTP 构建统计日志可能包含一些项目和系统属性。这些属性可以更改构建的行为，
因此将它们记录在构建统计信息中很有用。
这些属性可能存储敏感数据，例如密码或项目的完整路径。

你可以通过在 `gradle.properties` 中添加 `kotlin.build.report.http.verbose_environment` 属性来禁用这些统计信息的收集。

> JetBrains 不收集这些统计信息。你选择一个[存储报告的位置](#enabling-build-reports)。
>
{style="note"}

## 下一步？

了解更多关于：
*   [Gradle 基础知识与特性](https://docs.gradle.org/current/userguide/userguide.html)。
*   [对 Gradle 插件变体的支持](gradle-plugin-variants.md)。