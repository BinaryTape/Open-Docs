[//]: # (title: kapt 编译器插件)

> kapt 处于维护模式。我们正使其与最新的 Kotlin 和 Java 版本保持同步，但没有计划实现新功能。请使用 [Kotlin 符号处理 API (KSP)](ksp-overview.md) 进行注解处理。
> [查看 KSP 支持的库列表](ksp-overview.md#supported-libraries)。
>
{style="warning"}

Kotlin 通过 _kapt_ 编译器插件支持注解处理器（请参阅 [JSR 269](https://jcp.org/en/jsr/detail?id=269)）。

简而言之，你可以在 Kotlin 项目中使用 [Dagger](https://google.github.io/dagger/) 或 [Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) 等库。

请阅读下文，了解如何将 *kapt* 插件应用于你的 Gradle/Maven 构建。

## 在 Gradle 中使用

请按照以下步骤操作：
1. 应用 `kotlin-kapt` Gradle 插件：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   plugins {
       kotlin("kapt") version "%kotlinVersion%"
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "%kotlinVersion%"
   }
   ```

   </tab>
   </tabs>

2. 在 `dependencies` 代码块中使用 `kapt` 配置添加相应的依赖项：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       kapt("groupId:artifactId:version")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:version'
   }
   ```

   </tab>
   </tabs>

3. 如果你之前使用 [Android 支持](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)进行注解处理，请将 `annotationProcessor` 配置的用法替换为 `kapt`。
   如果你的项目包含 Java 类，`kapt` 也会处理它们。

   如果你将注解处理器用于 `androidTest` 或 `test` 源，相应的 `kapt` 配置名称为 `kaptAndroidTest` 和 `kaptTest`。请注意，`kaptAndroidTest` 和 `kaptTest` 扩展了 `kapt`，因此你只需提供 `kapt` 依赖项，它将同时适用于生产源和测试。

## 试用 Kotlin K2 编译器

> kapt 编译器插件对 K2 的支持是[实验性的 (Experimental)](components-stability.md)。需要选择启用（详情见下文），且你应仅将其用于评估目的。
>
{style="warning"}

从 Kotlin 1.9.20 开始，你可以尝试将 kapt 编译器插件与 [K2 编译器](https://blog.jetbrains.com/kotlin/2021/10/the-road-to-the-k2-compiler/)一起使用，它带来了性能改进和许多其他优势。要在 Gradle 项目中使用 K2 编译器，请将以下选项添加到 `gradle.properties` 文件中：

```kotlin
kapt.use.k2=true
```

如果你使用 Maven 构建系统，请更新 `pom.xml` 文件：

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

> 要在 Maven 项目中启用 kapt 插件，请参阅 [](#use-in-maven)。
>
{style="tip"}

如果在将 kapt 与 K2 编译器一起使用时遇到任何问题，请向我们的[问题追踪器](http://kotl.in/issue)报告。

## 注解处理器参数

使用 `arguments {}` 代码块将参数传递给注解处理器：

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle 构建缓存支持

kapt 注解处理任务在 Gradle 中默认是[缓存的](https://guides.gradle.org/using-build-cache/)。
然而，注解处理器会运行任意代码，这些代码可能不一定会将任务输入转换为输出，可能会访问和修改 Gradle 未跟踪的文件等。如果构建中使用的注解处理器无法正确缓存，可以通过在构建脚本中添加以下行来完全禁用 kapt 的缓存，以避免 kapt 任务的假阳性缓存命中：

```groovy
kapt {
    useBuildCache = false
}
```

## 提高使用 kapt 的构建速度

### 并行运行 kapt 任务

为了提高使用 kapt 的构建速度，你可以为 kapt 任务启用 [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)。使用 Worker API 允许 Gradle 并行运行单个项目中的独立注解处理任务，这在某些情况下可以显著缩短执行时间。

当你在 Kotlin Gradle 插件中使用[自定义 JDK 主目录](gradle-configure-project.md#gradle-java-toolchains-support)功能时，kapt 任务 worker 仅使用[进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)。
请注意，`kapt.workers.isolation` 属性将被忽略。

如果你想为 kapt worker 进程提供额外的 JVM 参数，请使用 `KaptWithoutKotlincTask` 的输入 `kaptProcessJvmArgs`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</tab>
</tabs>

### 注解处理器类加载器缓存

> kapt 中注解处理器类加载器的缓存是[实验性的 (Experimental)](components-stability.md)。它可能随时被删除或更改。请仅将其用于评估目的。
> 我们很感谢你能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 上提供反馈。
>
{style="warning"}

注解处理器类加载器缓存有助于在你连续运行多个 Gradle 任务时，使 kapt 执行得更快。

要启用此功能，请在 `gradle.properties` 文件中使用以下属性：

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

如果你在使用注解处理器缓存时遇到任何问题，请禁用它们的缓存：

```none
# specify annotation processors' full names to disable caching for them
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

### 衡量注解处理器性能

使用 `-Kapt-show-processor-timings` 插件选项获取注解处理器执行的性能统计信息。
示例输出：

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

你可以使用插件选项 [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280) 将此报告转储到文件中。
以下命令将运行 kapt 并将统计信息转储到 `ap-perf-report.file` 文件中：

```bash
kotlinc -cp $MY_CLASSPATH \
-Xplugin=kotlin-annotation-processing-SNAPSHOT.jar -P \
plugin:org.jetbrains.kotlin.kapt3:aptMode=stubsAndApt,\
plugin:org.jetbrains.kotlin.kapt3:apclasspath=processor/build/libs/processor.jar,\
plugin:org.jetbrains.kotlin.kapt3:dumpProcessorTimings=ap-perf-report.file \
-Xplugin=$JAVA_HOME/lib/tools.jar \
-d cli-tests/out \
-no-jdk -no-reflect -no-stdlib -verbose \
sample/src/main/
```

### 衡量注解处理器生成的文件数量

`kotlin-kapt` Gradle 插件可以报告每个注解处理器生成文件数量的统计信息。

这对于跟踪构建中是否存在未使用的注解处理器非常有用。
你可以使用生成的报告来查找触发不必要注解处理器的模块，并更新这些模块以防止这种情况发生。

分两步启用统计信息：
* 在 `build.gradle(.kts)` 中将 `showProcessorStats` 标志设置为 `true`：

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* 在 `gradle.properties` 中将 `kapt.verbose` Gradle 属性设置为 `true`：

  ```none
  kapt.verbose=true
  ```

> 你也可以通过[命令行选项 `verbose`](#use-in-cli) 启用详细输出。
>
> {style="note"}

统计信息将以 `info` 级别出现在日志中。你将看到 `Annotation processor stats:` 行，其后是每个注解处理器执行时间的统计信息。这些行之后，将有 `Generated files report:` 行，其后是每个注解处理器生成文件数量的统计信息。例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt 的编译规避

为了缩短使用 kapt 的增量构建时间，它可以使用 Gradle 的[编译规避](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。
启用编译规避后，Gradle 可以在重建项目时跳过注解处理。特别是，在以下情况下会跳过注解处理：

* 项目的源文件未更改。
* 依赖项中的更改与 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 兼容。
   例如，唯一的更改是在方法体中。

然而，对于在编译类路径中发现的注解处理器，不能使用编译规避，因为它们的_任何更改_都需要运行注解处理任务。

要使用编译规避运行 kapt：
* 如[上文](#use-in-gradle)所述，手动将注解处理器依赖项添加到 `kapt*` 配置中。
* 通过在 `gradle.properties` 文件中添加此行，关闭编译类路径中注解处理器的发现：

```none
kapt.include.compile.classpath=false
```

## 增量注解处理

kapt 支持增量注解处理，此功能默认启用。
目前，只有当所有使用的注解处理器都是增量式时，注解处理才能是增量式的。

要禁用增量注解处理，请在 `gradle.properties` 文件中添加此行：

```none
kapt.incremental.apt=false
```

请注意，增量注解处理也要求[增量编译](gradle-compilation-and-caches.md#incremental-compilation)启用。

## 从父配置继承注解处理器

你可以在单独的 Gradle 配置中定义一组公共的注解处理器作为父配置，并在子项目的 kapt 特定配置中进一步扩展它。

例如，对于使用 [Dagger](https://dagger.dev/) 的子项目，在 `build.gradle(.kts)` 文件中使用以下配置：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此示例中，`commonAnnotationProcessors` Gradle 配置是你希望所有项目都使用的注解处理的公共父配置。你使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) 方法将 `commonAnnotationProcessors` 添加为父配置。kapt 会看到 `commonAnnotationProcessors` Gradle 配置依赖于 Dagger 注解处理器。因此，kapt 将 Dagger 注解处理器包含在其注解处理配置中。

## Java 编译器选项

kapt 使用 Java 编译器来运行注解处理器。
以下是如何将任意选项传递给 javac：

```groovy
kapt {
    javacOptions {
        // Increase the max count of errors from annotation processors.
        // Default is 100.
        option("-Xmaxerrs", 500)
    }
}
```

## 不存在类型修正

一些注解处理器（如 `AutoFactory`）依赖于声明签名中的精确类型。
默认情况下，kapt 会将所有未知类型（包括生成类的类型）替换为 `NonExistentClass`，但你可以更改此行为。在 `build.gradle(.kts)` 文件中添加该选项以在存根中启用错误类型推断：

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用

在 `compile` 之前添加 kotlin-maven-plugin 的 `kapt` 目标执行：

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- You can skip the <goals> element
        if you enable extensions for the plugin -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- Specify your annotation processors here -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

要配置注解处理级别，请在 `<configuration>` 代码块中将 `aptMode` 设置为以下之一：

   * `stubs` – 仅生成注解处理所需的存根。
   * `apt` – 仅运行注解处理。
   * `stubsAndApt` – (默认) 生成存根并运行注解处理。

例如：

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

要使用 K2 编译器启用 kapt 插件，请添加 `-Xuse-k2-kapt` 编译器选项：

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

## 在 IntelliJ 构建系统中使用

IntelliJ IDEA 自己的构建系统不支持 kapt。每当你想要重新运行注解处理时，请从“Maven Projects”工具栏启动构建。

## 在 CLI 中使用

kapt 编译器插件在 Kotlin 编译器的二进制发行版中可用。

你可以通过使用 `Xplugin` kotlinc 选项提供其 JAR 文件的路径来附加插件：

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

以下是可用选项列表：

* `sources` (*必填*): 生成文件的输出路径。
* `classes` (*必填*): 生成的类文件和资源的输出路径。
* `stubs` (*必填*): 存根文件的输出路径。换句话说，一个临时目录。
* `incrementalData`: 二进制存根的输出路径。
* `apclasspath` (*可重复*): 注解处理器 JAR 的路径。根据你的 JAR 数量传递相同数量的 `apclasspath` 选项。
* `apoptions`: base64 编码的注解处理器选项列表。更多信息请参阅 [AP/javac 选项编码](#ap-javac-options-encoding)。
* `javacArguments`: base64 编码的传递给 javac 的选项列表。更多信息请参阅 [AP/javac 选项编码](#ap-javac-options-encoding)。
* `processors`: 逗号分隔的注解处理器完全限定类名列表。如果指定，kapt 不会尝试在 `apclasspath` 中查找注解处理器。
* `verbose`: 启用详细输出。
* `aptMode` (*必填*)
    * `stubs` – 仅生成注解处理所需的存根。
    * `apt` – 仅运行注解处理。
    * `stubsAndApt` – 生成存根并运行注解处理。
* `correctErrorTypes`: 更多信息请参阅 [不存在类型修正](#non-existent-type-correction)。默认禁用。
* `dumpFileReadHistory`: 用于为每个文件转储注解处理期间使用的类列表的输出路径。

插件选项格式为：`-P plugin:<plugin id>:<key>=<value>`。选项可以重复。

示例：

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## 生成 Kotlin 源文件

kapt 可以生成 Kotlin 源文件。只需将生成的 Kotlin 源文件写入 `processingEnv.options["kapt.kotlin.generated"]` 指定的目录，这些文件将与主源文件一起编译。

请注意，kapt 不支持对生成的 Kotlin 文件进行多轮处理。

## AP/Javac 选项编码

`apoptions` 和 `javacArguments` CLI 选项接受编码的选项映射。
以下是你如何自行编码选项：

```kotlin
fun encodeList(options: Map<String, String>): String {
    val os = ByteArrayOutputStream()
    val oos = ObjectOutputStream(os)

    oos.writeInt(options.size)
    for ((key, value) in options.entries) {
        oos.writeUTF(key)
        oos.writeUTF(value)
    }

    oos.flush()
    return Base64.getEncoder().encodeToString(os.toByteArray())
}
```

## 保留 Java 编译器的注解处理器

默认情况下，kapt 会运行所有注解处理器并禁用 javac 的注解处理。
但是，你可能需要一些 javac 的注解处理器工作（例如 [Lombok](https://projectlombok.org/)）。

在 Gradle 构建文件中，使用 `keepJavacAnnotationProcessors` 选项：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果你使用 Maven，你需要指定具体的插件设置。
请参阅此[关于 Lombok 编译器插件的设置示例](lombok.md#using-with-kapt)。