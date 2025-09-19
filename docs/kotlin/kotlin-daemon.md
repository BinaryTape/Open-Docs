[//]: # (title: Kotlin 守护进程)

Kotlin 守护进程是一个后台进程，构建系统可以使用它来缩短构建时间，方法是使编译器及其环境保持就绪状态，随时可以编译。这种方法避免了每次编译都启动新的 Java 虚拟机 (JVM) 实例并重新初始化编译器，从而缩短了增量构建或频繁小幅改动的构建时间。

一些构建系统有自己的守护进程，例如 [Gradle 守护进程](https://docs.gradle.org/current/userguide/gradle_daemon.html) 和 [Maven 守护进程](https://maven.apache.org/tools/mvnd.html)，它们有助于降低启动成本。使用 Kotlin 守护进程可以降低启动成本，同时还能将构建系统进程与编译器完全隔离。这种分离在动态环境中非常有用，因为系统设置在运行时可能会更改。

尽管 Kotlin 守护进程没有直接的用户界面，但你可以通过构建系统或 [build tools API](build-tools-api.md) 使用它。

## Kotlin 守护进程配置

有多种方法可以为 Gradle 或 Maven 配置 Kotlin 守护进程的一些设置。

### 内存管理

Kotlin 守护进程是一个独立进程，它拥有自己的内存空间，与客户端隔离。默认情况下，Kotlin 守护进程会尝试继承启动 JVM 进程的堆大小 (`-Xmx`)。

要配置特定的内存限制，例如 `-Xmx` 和 `-XX:MaxMetaspaceSize`，请使用以下属性：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin.daemon.jvmargs=-Xmx1500m
```

关于更多信息，请参见 [`kotlin.daemon.jvmargs` 属性](gradle-compilation-and-caches.md#kotlin-daemon-jvmargs-property)。

</tab>
<tab title="Maven" group-key="maven">

```xml
<kotlin.compiler.daemon.jvmArgs>-Xmx1500m</kotlin.compiler.daemon.jvmArgs>
```

</tab>
</tabs>

### 生命周期

Kotlin 守护进程有两种常见的生命周期策略：

*   **附着式守护进程**：在客户端进程关闭后不久关闭守护进程，或守护进程一段时间未使用后关闭。当客户端是长期运行的程序时使用。
*   **分离式守护进程**：让守护进程存活更长时间以等待潜在的后续请求。当客户端是短期运行的程序时使用。

要配置生命周期策略，你可以使用以下选项：

| 选项                        | 描述                                                                           | 默认值   |
|-----------------------------|--------------------------------------------------------------------------------|----------|
| `autoshutdownIdleSeconds`   | 当客户端仍连接时，守护进程在最后一次编译后应保持活跃多长时间。                 | 2 hours  |
| `autoshutdownUnusedSeconds` | 一个新启动的守护进程，在未使用时，等待第一个客户端连接多长时间后关闭。         | 1 minute |
| `shutdownDelayMilliseconds` | 所有客户端断开连接后，守护进程等待多长时间后关闭。                             | 1 second |

要配置附着式守护进程的生命周期策略，请将 `autoshutdownIdleSeconds` 设置为 **高** 值，并将 `shutdownDelayMilliseconds` 设置为 **低** 值。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

将以下内容添加到你的 `gradle.properties` 文件中：

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

要配置分离式守护进程的生命周期策略，请将 `shutdownDelayMilliseconds` 设置为 **高** 值。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

将以下内容添加到你的 `gradle.properties` 文件中：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=shutdownDelayMilliseconds=7200
```

</tab>
<tab title="Maven" group-key="maven">

将以下属性添加到你的 `pom.xml` 文件中：

```xml
<kotlin.compiler.daemon.shutdownDelayMs>7200</kotlin.compiler.daemon.shutdownDelayMs>
```

</tab>
</tabs>