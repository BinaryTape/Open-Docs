[//]: # (title: Kotlin daemon)

Kotlin daemon 是一个后台进程，构建系统可以使用它来缩短构建时间，方法是让编译器及其环境保持就绪状态以进行编译。这种方法避免了为每次编译都启动一个新的 Java 虚拟机 (JVM) 实例并重新初始化编译器，从而减少了增量构建或频繁进行小范围更改时的构建时间。

某些构建系统有自己的 daemon 来帮助降低启动开销，例如 [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html) 和 [Maven daemon](https://maven.apache.org/tools/mvnd.html)。使用 Kotlin daemon 可以降低启动开销，同时还能将构建系统进程与编译器完全隔离。这种隔离在系统设置可能在运行时发生变化的动态环境中非常有用。

虽然 Kotlin daemon 没有直接面向用户的接口，但您可以通过构建系统或[构建工具 API](build-tools-api.md) 来使用它。

## Kotlin daemon 配置

可以通过多种方式为 Gradle 或 Maven 配置 Kotlin daemon 的某些设置。

### 内存管理

Kotlin daemon 是一个独立的进程，拥有自己的内存空间，与客户端隔离。默认情况下，Kotlin daemon 会尝试继承启动它的 JVM 进程的堆 (heap) 大小 (`-Xmx`)。

要配置特定的内存限制（如 `-Xmx` 和 `-XX:MaxMetaspaceSize`），请使用以下属性：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin.daemon.jvmargs=-Xmx1500m
```

要了解更多信息，请参阅 [`kotlin.daemon.jvmargs` 属性](gradle-compilation-and-caches.md#kotlin-daemon-jvmargs-property)。

</tab>
<tab title="Maven" group-key="maven">

```xml
<kotlin.compiler.daemon.jvmArgs>-Xmx1500m</kotlin.compiler.daemon.jvmArgs>
```

</tab>
</tabs>

### 生存期

Kotlin daemon 有两种常见的生存期策略：

* **附着式 daemon (Attached daemon)**：在客户端进程关闭后不久或 daemon 一段时间未使用时关闭 daemon。在客户端长期运行时使用。 
* **分离式 daemon (Detached daemon)**：让 daemon 保持存活更长时间，以等待潜在的后续请求。在客户端运行时间较短时使用。 

要配置生存期策略，可以使用以下选项：

| 选项 | 描述 | 默认值 |
|-----------------------------|----------------------------------------------------------------------------------------------------|---------------|
| `autoshutdownIdleSeconds`   | 当客户端仍处于连接状态时，daemon 在最后一次编译后应保持存活的时间。 | 2 小时 |
| `autoshutdownUnusedSeconds` | 新启动的 daemon 在未使用的情况下，在关闭前等待第一个客户端的时间。 | 1 分钟 |
| `shutdownDelayMilliseconds` | 在所有客户端断开连接后，daemon 等待关闭的时间。 | 1 秒 |

要配置附着式 daemon 生存期策略，请将 `autoshutdownIdleSeconds` 设置为**高**值，并将 `shutdownDelayMilliseconds` 设置为**低**值。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

将以下内容添加到您的 `gradle.properties` 文件中：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
<tab title="Maven" group-key="maven">

使用以下命令：

```bash
 mvn package -Dkotlin.daemon.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
</tabs>

要配置分离式 daemon 生存期策略，请将 `shutdownDelayMilliseconds` 设置为**高**值。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

将以下内容添加到您的 `gradle.properties` 文件中：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=shutdownDelayMilliseconds=7200
```

</tab>
<tab title="Maven" group-key="maven">

将以下属性添加到您的 `pom.xml` 文件中：

```xml
<kotlin.compiler.daemon.shutdownDelayMs>7200</kotlin.compiler.daemon.shutdownDelayMs>
```

</tab>
</tabs>