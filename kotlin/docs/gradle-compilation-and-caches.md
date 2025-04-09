---
title: "Kotlin Gradle 插件中的编译和缓存"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

在本页中，您可以了解以下主题：
* [增量编译](#incremental-compilation)
* [Gradle 构建缓存支持](#gradle-build-cache-support)
* [Gradle 配置缓存支持](#gradle-configuration-cache-support)
* [Kotlin 守护进程以及如何在 Gradle 中使用它](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [回滚到先前的编译器](#rolling-back-to-the-previous-compiler)
* [定义 Kotlin 编译器执行策略](#defining-kotlin-compiler-execution-strategy)
* [Kotlin 编译器回退策略](#kotlin-compiler-fallback-strategy)
* [尝试最新的语言版本](#trying-the-latest-language-version)
* [构建报告](#build-reports)

## 增量编译

Kotlin Gradle 插件支持增量编译，默认情况下为 Kotlin/JVM 和 Kotlin/JS 项目启用。
增量编译跟踪构建之间 classpath 中文件的更改，以便仅编译受这些更改影响的文件。
此方法适用于 [Gradle 的构建缓存](#gradle-build-cache-support)，并支持 [编译避免](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。

对于 Kotlin/JVM，增量编译依赖于 classpath 快照，它捕获模块的 API 结构，以确定何时需要重新编译。
为了优化整个管道，Kotlin 编译器使用两种类型的 classpath 快照：

* **细粒度快照 (Fine-grained snapshots)**：包括有关类成员的详细信息，例如属性或函数。
  当检测到成员级别的更改时，Kotlin 编译器仅重新编译依赖于修改后的成员的类。
  为了保持性能，Kotlin Gradle 插件为 Gradle 缓存中的 `.jar` 文件创建粗粒度快照。
* **粗粒度快照 (Coarse-grained snapshots)**：仅包含类 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 哈希。
  当 ABI 的一部分发生更改时，Kotlin 编译器会重新编译所有依赖于更改的类的类。
  这对于不经常更改的类很有用，例如外部库。

:::note
Kotlin/JS 项目使用基于历史文件的不同增量编译方法。

:::

有几种方法可以禁用增量编译：

* 为 Kotlin/JVM 设置 `kotlin.incremental=false`。
* 为 Kotlin/JS 项目设置 `kotlin.incremental.js=false`。
* 使用 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false` 作为命令行参数。

  该参数应添加到每个后续构建中。

当您禁用增量编译时，增量缓存会在构建后失效。 第一次构建永远不是增量的。

:::note
有时，增量编译的问题会在失败发生后的几轮后变得可见。 使用 [构建报告](#build-reports)
来跟踪更改和编译的历史记录。 这可以帮助你提供可重现的错误报告。

要了解更多关于我们当前增量编译方法的工作原理以及与先前方法的比较，
请参阅我们的 [博客文章](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)。

## Gradle 构建缓存支持

Kotlin 插件使用 [Gradle 构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)，它存储构建输出，以便在将来的构建中重复使用。

要禁用所有 Kotlin 任务的缓存，请将系统属性 `kotlin.caching.enabled` 设置为 `false`
（使用参数 `-Dkotlin.caching.enabled=false` 运行构建）。

## Gradle 配置缓存支持

Kotlin 插件使用 [Gradle 配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)，
它通过重用后续构建的配置阶段的结果来加速构建过程。

请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)
以了解如何启用配置缓存。 启用此功能后，Kotlin Gradle 插件会自动开始使用它。

## Kotlin 守护进程以及如何在 Gradle 中使用它

Kotlin 守护进程：
* 与 Gradle 守护进程一起运行以编译项目。
* 当您使用 IntelliJ IDEA 内置构建系统编译项目时，与 Gradle 守护进程分开运行。

当其中一个 Kotlin 编译任务开始编译源文件时，Kotlin 守护进程在 Gradle [执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases) 启动。
Kotlin 守护进程与 Gradle 守护进程一起停止，或者在没有 Kotlin 编译的两个空闲小时后停止。

Kotlin 守护进程使用与 Gradle 守护进程相同的 JDK。

### 设置 Kotlin 守护进程的 JVM 参数

以下每种设置参数的方式都会覆盖之前的参数：
* [Gradle 守护进程参数继承](#gradle-daemon-arguments-inheritance)
* [`kotlin.daemon.jvm.options` 系统属性](#kotlin-daemon-jvm-options-system-property)
* [`kotlin.daemon.jvmargs` 属性](#kotlin-daemon-jvmargs-property)
* [`kotlin` 扩展](#kotlin-extension)
* [特定任务定义](#specific-task-definition)

#### Gradle 守护进程参数继承

默认情况下，Kotlin 守护进程从 Gradle 守护进程继承一组特定的参数，但会用直接为 Kotlin 守护进程指定的任何 JVM 参数覆盖它们。 例如，如果您在 `gradle.properties` 文件中添加以下 JVM 参数：

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

然后，这些参数将添加到 Kotlin 守护进程的 JVM 参数中：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

要了解更多关于 Kotlin 守护进程使用 JVM 参数的默认行为，请参阅 [Kotlin 守护进程使用 JVM 参数的行为](#kotlin-daemon-s-behavior-with-jvm-arguments)。

:::

#### kotlin.daemon.jvm.options 系统属性

如果 Gradle 守护进程的 JVM 参数具有 `kotlin.daemon.jvm.options` 系统属性，请在 `gradle.properties` 文件中使用它：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

传递参数时，请遵循以下规则：
* 仅在参数 `Xmx`、`XX:MaxMetaspaceSize` 和 `XX:ReservedCodeCacheSize` 之前使用减号 `-` **。
* 使用逗号 (`,`) 分隔参数，_不带_空格。 空格后的参数将用于 Gradle 守护进程，而不是 Kotlin 守护进程。

:::note
如果满足以下所有条件，Gradle 将忽略这些属性：
* Gradle 正在使用 JDK 1.9 或更高版本。
* Gradle 的版本介于 7.0 和 7.1.1 之间（包括 7.0 和 7.1.1）。
* Gradle 正在编译 Kotlin DSL 脚本。
* Kotlin 守护进程未运行。

要克服此问题，请将 Gradle 升级到 7.2（或更高版本），或使用 `kotlin.daemon.jvmargs` 属性 - 请参阅以下部分。

#### kotlin.daemon.jvmargs 属性

您可以在 `gradle.properties` 文件中添加 `kotlin.daemon.jvmargs` 属性：

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

请注意，如果您在此处或 Gradle 的 JVM 参数中未指定 `ReservedCodeCacheSize` 参数，则 Kotlin Gradle 插件将应用默认值 `320m`：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlin 扩展

您可以在 `kotlin` 扩展中指定参数：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</TabItem>
</Tabs>

#### 特定任务定义

您可以为特定任务指定参数：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(CompileUsingKotlinDaemon).configureEach { task `->`
    task.kotlinDaemonJvmArguments = ["-Xmx1g", "-Xms512m"]
}
```

</TabItem>
</Tabs>

在这种情况下，可以在任务执行时启动一个新的 Kotlin 守护进程实例。 了解更多关于 [Kotlin 守护进程使用 JVM 参数的行为](#kotlin-daemon-s-behavior-with-jvm-arguments)。

:::

### Kotlin 守护进程使用 JVM 参数的行为

配置 Kotlin 守护进程的 JVM 参数时，请注意：

* 当不同的子项目或任务具有不同的 JVM 参数集时，预计会同时运行 Kotlin 守护进程的多个实例。
* 仅当 Gradle 运行相关的编译任务且现有 Kotlin 守护进程没有相同的 JVM 参数集时，才会启动新的 Kotlin 守护进程实例。
  假设您的项目有很多子项目。 大多数子项目需要一些堆内存用于 Kotlin 守护进程，但一个模块需要很多（尽管很少编译）。
  在这种情况下，您应该为此类模块提供一组不同的 JVM 参数，因此仅当开发人员接触此特定模块时，才会启动具有较大堆大小的 Kotlin 守护进程。
  > 如果您已经在运行具有足够堆大小以处理编译请求的 Kotlin 守护进程，
  > 即使其他请求的 JVM 参数不同，也会重复使用此守护进程，而不是启动新的守护进程。
  >
  

如果未指定以下参数，则 Kotlin 守护进程会从 Gradle 守护进程继承它们：

* `-Xmx`
* `-XX:MaxMetaspaceSize`
* `-XX:ReservedCodeCacheSize`。 如果未指定或继承，则默认值为 `320m`。

Kotlin 守护进程具有以下默认 JVM 参数：
* `-XX:UseParallelGC`。 仅当未指定其他垃圾收集器时，才应用此参数。
* `-ea`
* `-XX:+UseCodeCacheFlushing`
* `-Djava.awt.headless=true`
* `-D{java.servername.property}={localhostip}`
* `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`。 此参数仅适用于 JDK 16 或更高版本。

:::note
Kotlin 守护进程的默认 JVM 参数列表可能因版本而异。 您可以使用诸如 [VisualVM](https://visualvm.github.io/) 之类的工具来检查正在运行的 JVM 进程（如 Kotlin 守护进程）的实际设置。

:::

## 回滚到先前的编译器

从 Kotlin 2.0.0 开始，默认情况下使用 K2 编译器。

要从 Kotlin 2.0.0 开始使用之前的编译器，请执行以下任一操作：

* 在 `build.gradle.kts` 文件中，[将语言版本设置为](gradle-compiler-options#example-of-setting-languageversion) `1.9`。

  或
* 使用以下编译器选项：`-language-version 1.9`。

要了解更多关于 K2 编译器的优势，请参阅 [K2 编译器迁移指南](k2-compiler-migration-guide)。

## 定义 Kotlin 编译器执行策略

_Kotlin 编译器执行策略 (Kotlin compiler execution strategy)_ 定义 Kotlin 编译器在何处执行，以及每种情况下是否支持增量编译。

有三种编译器执行策略：

| 策略 (Strategy)       | Kotlin 编译器在哪里执行                  | 增量编译 (Incremental compilation) | 其他特性和说明                                                                                                                                                                                                                                                |
|----------------|--------------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 守护进程 (Daemon)         | 在其自己的守护进程进程内                  | 是                     | _默认和最快的策略_。 可以在不同的 Gradle 守护进程和多个并行编译之间共享。                                                                                                                                                         |
| 进程内 (In process)     | 在 Gradle 守护进程进程内           | 否                      | 可能与 Gradle 守护进程共享堆。 "进程内" 执行策略比 "守护进程" 执行策略_慢_。 每个 [worker](https://docs.gradle.org/current/userguide/worker_api.html) 为每次编译创建一个单独的 Kotlin 编译器类加载器。 |
| 进程外 (Out of process) | 在每个编译的单独进程中 | 否                      | 最慢的执行策略。 类似于 "进程内"，但另外为每次编译在 Gradle worker 中创建一个单独的 Java 进程。                                                                                                                     |

要定义 Kotlin 编译器执行策略，您可以使用以下属性之一：
* `kotlin.compiler.execution.strategy` Gradle 属性。
* `compilerExecutionStrategy` 编译任务属性。

任务属性 `compilerExecutionStrategy` 优先于 Gradle 属性 `kotlin.compiler.execution.strategy`。

`kotlin.compiler.execution.strategy` 属性的可用值为：
1. `daemon`（默认）
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中使用 Gradle 属性 `kotlin.compiler.execution.strategy`：

```none
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任务属性的可用值为：
1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON`（默认）
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在构建脚本中使用任务属性 `compilerExecutionStrategy`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
} 
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
    .configureEach {
        compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
    }
```

</TabItem>
</Tabs>

## Kotlin 编译器回退策略

Kotlin 编译器的回退策略是在守护进程以某种方式失败时，在 Kotlin 守护进程之外运行编译。
如果 Gradle 守护进程已启动，则编译器使用 [“进程内”策略](#defining-kotlin-compiler-execution-strategy)。
如果 Gradle 守护进程已关闭，则编译器使用 “进程外” 策略。

当发生此回退时，您的 Gradle 构建输出中会有以下警告行：

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

但是，静默回退到另一种策略可能会消耗大量系统资源或导致非确定性构建。
请在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy) 中阅读有关此内容的更多信息。
为避免这种情况，有一个 Gradle 属性 `kotlin.daemon.useFallbackStrategy`，其默认值为 `true`。
当值为 `false` 时，构建在守护进程启动或通信出现问题时会失败。 在 `gradle.properties` 中声明此属性：

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlin 编译任务中还有一个 `useDaemonFallbackStrategy` 属性，如果您同时使用这两个属性，则该属性优先于 Gradle 属性。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }   
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```
</TabItem>
</Tabs>

如果运行编译的内存不足，您可以在日志中看到相关消息。

## 尝试最新的语言版本

从 Kotlin 2.0.0 开始，要尝试最新的语言版本，请在 `gradle.properties` 文件中设置 `kotlin.experimental.tryNext` 属性。
当您使用此属性时，Kotlin Gradle 插件会将语言版本增加到高于 Kotlin 版本的默认值。 例如，在 Kotlin 2.0.0 中，默认语言版本为 2.0，因此该属性配置语言版本 2.1。

或者，您可以运行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
```

在 [构建报告](#build-reports) 中，您可以找到用于编译每个任务的语言版本。

## 构建报告

构建报告包含不同编译阶段的持续时间以及编译无法增量化的任何原因。
当编译时间过长或同一项目的编译时间不同时，请使用构建报告来调查性能问题。

与以单个 Gradle 任务作为粒度单位的 [Gradle 构建扫描](https://scans.gradle.com/) 相比，Kotlin 构建报告可帮助您更有效地调查构建性能问题。

以下是分析构建报告以解决长时间运行的编译问题的两个常见案例：
* 构建不是增量的。 分析原因并解决根本问题。
* 构建是增量的，但花费了太多时间。 尝试重新组织源文件 - 分割大文件，
  将单独的类保存在不同的文件中，重构大型类，在不同的文件中声明顶级函数，等等。

构建报告还显示项目中使用的 Kotlin 版本。 此外，从 Kotlin 1.9.0 开始，
您可以在 [Gradle 构建扫描](https://scans.gradle.com/) 中看到用于编译代码的编译器。

了解 [如何阅读构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports)
以及 [JetBrains 如何使用构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains)。

### 启用构建报告

要启用构建报告，请在 `gradle.properties` 中声明在哪里保存构建报告输出：

```none
kotlin.build.report.output=file
```

以下值及其组合可用于输出：

| 选项 (Option) | 描述 (Description) |
|---|---|
| `file` | 以人类可读的格式将构建报告保存到本地文件。 默认情况下，它是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 以对象的格式将构建报告保存到指定的本地文件。 |
| `build_scan` | 将构建报告保存在 [构建扫描](https://scans.gradle.com/) 的 `custom values` 部分。 请注意，Gradle Enterprise 插件限制了自定义值的数量及其长度。 在大型项目中，某些值可能会丢失。 |
| `http` | 使用 HTTP(S) 发布构建报告。 POST 方法以 JSON 格式发送指标。 您可以在 [Kotlin 仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中看到发送数据的当前版本。 您可以在 [这篇博文](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports) 中找到 HTTP 端点的示例 |
| `json` | 以 JSON 格式将构建报告保存到本地文件。 在 `kotlin.build.report.json.directory` 中设置构建报告的位置（参见下文）。 默认情况下，其名称为 `${project_name}-build-<date-time>-<index>.json`。 |

以下是 `kotlin.build.report` 的可用选项列表：

```none
# 必需的输出。 允许任何组合
kotlin.build.report.output=file,single_file,http,build_scan,json

# 如果使用 single_file 输出，则为必需。 在哪里放置报告
# 使用此属性代替已弃用的 `kotlin.internal.single.build.metrics.file` 属性
kotlin.build.report.single_file=some_filename

# 如果使用 json 输出，则为必需。 在哪里放置报告
kotlin.build.report.json.directory=my/directory/path

# 可选。 基于文件的报告的输出目录。 默认值：build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# 可选。 用于标记构建报告的标签（例如，调试参数）
kotlin.build.report.label=some_label
```

仅适用于 HTTP 的选项：

```none
# 必需。 在哪里发布基于 HTTP(S) 的报告
kotlin.build.report.http.url=http://127.0.0.1:8080

# 可选。 如果 HTTP 端点需要身份验证，则为用户和密码
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# 可选。 将构建的 Git 分支名称添加到构建报告
kotlin.build.report.http.include_git_branch.name=true|false

# 可选。 将编译器参数添加到构建报告
# 如果项目包含许多模块，则其在报告中的编译器参数可能非常繁重且没有太大帮助
kotlin.build.report.include_compiler_arguments=true|false
```

### 自定义值的限制

为了收集构建扫描的统计信息，Kotlin 构建报告使用 [Gradle 的自定义值](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/)。
您和不同的 Gradle 插件都可以将数据写入自定义值。 自定义值的数量有限制。
请参阅 [构建扫描插件文档](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values) 中的当前最大自定义值计数。

如果您有一个大型项目，则此类自定义值的数量可能很大。 如果此数字超过限制，
您可以在日志中看到以下消息：

```text
Maximum number of custom values (1,000) exceeded
```

要减少 Kotlin 插件生成的自定义值的数量，您可以在 `gradle.properties` 中使用以下属性：

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### 关闭收集项目和系统属性

HTTP 构建统计日志可以包含一些项目和系统属性。 这些属性可以更改构建的行为，
因此在构建统计信息中记录它们很有用。
这些属性可以存储敏感数据，例如密码或项目的完整路径。

您可以通过将 `kotlin.build.report.http.verbose_environment` 属性添加到
`gradle.properties` 来禁用这些统计信息的收集。

:::note
JetBrains 不会收集这些统计信息。 您可以选择一个地方 [在哪里存储您的报告](#enabling-build-reports)。

:::

## 接下来做什么？

了解更多关于：
* [Gradle 基础知识和具体细节](https://docs.gradle.org/current/userguide/userguide.html)。
* [对 Gradle 插件变体的支持](gradle-plugin-variants)。