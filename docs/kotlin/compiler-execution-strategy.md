[//]: # (title: 编译器执行策略)

_Kotlin 编译器执行策略_ 定义了 Kotlin 编译器的运行位置。
诸如 [Gradle](gradle.md) 或 [Maven](maven.md) 等构建工具会配置该策略。

有两种编译器执行策略：

| 策略                          | Kotlin 编译器的运行位置  | 其他特性与说明                                                                                                                                                              |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Kotlin daemon](kotlin-daemon.md) | 在其自身的守护进程中运行   | Gradle 和 Maven 中*默认且最快的策略*。该守护进程可以在不同的构建系统进程和多个并行编译之间共享。                        |
| 进程内 (In process)                        | 在构建工具的进程中运行 | 从内存管理的角度来看，这是最简单的策略，但它与在同一进程中运行的其他逻辑的隔离性较差，因为它共享状态（例如 JVM 系统属性）。 |

## 在 Gradle 中配置

您可以使用以下属性之一来定义 Kotlin 编译器执行策略：

* `kotlin.compiler.execution.strategy` Gradle 属性。
* `compilerExecutionStrategy` 编译任务属性。

### 使用 Gradle 属性

`kotlin.compiler.execution.strategy` 属性的可选值为：

* `daemon`（默认）
* `in-process`

在 `gradle.properties` 中设置 `kotlin.compiler.execution.strategy` 属性：

```none
kotlin.compiler.execution.strategy=in-process
```

### 使用编译任务属性

`compilerExecutionStrategy` 任务属性的优先级高于 `kotlin.compiler.execution.strategy` Gradle 属性。

`compilerExecutionStrategy` 任务属性的可选值为：

* [`DAEMON`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-d-a-e-m-o-n/)（默认）
* [`IN_PROCESS`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-i-n_-p-r-o-c-e-s-s/)

在构建脚本中设置 `compilerExecutionStrategy` 任务属性：

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

### 回退策略

如果与 Kotlin daemon 的通信失败，编译器将回退到“进程内 (In process)”策略。

当发生此回退时，Gradle 会在构建输出中打印以下警告：

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

静默回退可能会消耗大量系统资源或导致构建结果不具有确定性。
要了解更多信息，请参阅此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。

要防止回退，请使用 `kotlin.daemon.useFallbackStrategy` Gradle 属性。默认值为 `true`。
当设置为 `false` 时，如果 daemon 的启动或通信出现问题，构建将失败。
在 `gradle.properties` 中声明此属性：

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlin 编译任务中还有一个 `useDaemonFallbackStrategy` 属性。如果您同时使用这两个属性，`useDaemonFallbackStrategy` 属性具有更高优先级。

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

如果内存不足以运行编译，日志中会显示相关消息。

## 在 Maven 中配置

<include from ="maven-kotlin-compiler.md" element-id="maven-configure-execution-strategy"/>