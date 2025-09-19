[//]: # (title: kapt 编译器插件)

> kapt 处于维护模式。我们使其与最新的 Kotlin 和 Java 版本保持同步，
> 但没有计划实现新特性。请使用 [Kotlin 符号处理 API (KSP)](ksp-overview.md) 进行注解处理。
> [请参见 KSP 支持的库列表](ksp-overview.md#supported-libraries)。
>
{style="warning"}

Kotlin 通过 _kapt_ 编译器插件支持注解处理器（请参见 [JSR 269](https://jcp.org/en/jsr/detail?id=269)）。

简而言之，kapt 能够通过启用基于 Java 的注解处理，帮助您在 Kotlin 项目中使用 [Dagger](https://google.github.io/dagger/)
和 [Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) 等库。

## 在 Gradle 中使用

要在 Gradle 中使用 kapt，请按照以下步骤操作：

1. 在您的构建脚本文件 `build.gradle(.kts)` 中应用 `kapt` Gradle 插件：

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

2. 在 `dependencies {}` 代码块中使用 `kapt` 配置添加相应的依赖项：

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

3. 如果您之前曾使用 [Android 对注解处理器的支持](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)，请将 `annotationProcessor` 配置的用法替换为 `kapt`。
   如果您的项目包含 Java 类，`kapt` 也会处理它们。

   如果您将注解处理器用于 `androidTest` 或 `test` 源代码，则相应的 `kapt` 配置名为
   `kaptAndroidTest` 和 `kaptTest`。请注意，`kaptAndroidTest` 和 `kaptTest` 扩展了 `kapt`，因此您可以提供
   `kapt` 依赖项，它将同时适用于生产源代码和测试。

## 注解处理器实参

在您的构建脚本文件 `build.gradle(.kts)` 中使用 `arguments {}` 代码块将实参传递给注解处理器：

```kotlin
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle 构建缓存支持

kapt 注解处理任务默认在 [Gradle 中缓存](https://guides.gradle.org/using-build-cache/)。
然而，注解处理器可以运行任意代码，这可能无法可靠地将任务输入转换为输出，
或者可能访问和修改 Gradle 未追踪的文件。
如果构建中使用的注解处理器无法正确缓存，
您可以通过在构建脚本中指定 `useBuildCache` 属性来完全禁用 kapt 的缓存。
这有助于防止 kapt 任务出现误报的缓存命中：

```groovy
kapt {
    useBuildCache = false
}
```

## 提高使用 kapt 的构建速度

### 并行运行 kapt 任务

为了提高使用 kapt 的构建速度，您可以为 kapt 任务启用 [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)。
使用 Worker API 可以让 Gradle 并行运行单个项目中独立的注解处理任务，
这在某些情况下能显著缩短执行时间。

当您在 Kotlin Gradle 插件中使用[自定义 JDK 主目录](gradle-configure-project.md#gradle-java-toolchains-support)特性时，
kapt 任务 Worker 仅使用[进程隔离模式](https://docs.gradle.com/current/userguide/worker_api.html#changing_the_isolation_mode)。
请注意，`kapt.workers.isolation` 属性会被忽略。

如果您想为 kapt Worker 进程提供额外的 JVM 实参，请使用 `KaptWithoutKotlincTask` 的输入 `kaptProcessJvmArgs`：

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

### 注解处理器类加载器的缓存

<primary-label ref="experimental-general"/>

注解处理器类加载器的缓存有助于 kapt 在您连续运行多个 Gradle 任务时更快地执行。

要启用此特性，请在您的 `gradle.properties` 文件中使用以下属性：

```none
# gradle.properties
#
# 任何正值都会启用缓存
# 使用与使用 kapt 的模块数量相同的值
kapt.classloaders.cache.size=5

# 禁用此项才能使缓存生效
kapt.include.compile.classpath=false
```

如果您遇到注解处理器缓存的任何问题，请禁用它们的缓存：

```none
# 指定注解处理器的完整名称以禁用它们的缓存
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

> 如果您遇到此特性相关的任何问题，
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 中提供反馈。
>
{style="note"}

### 测量注解处理器的性能

要获取注解处理器执行的性能统计信息，请使用 `-Kapt-show-processor-timings` 插件选项。
示例输出：

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

您可以使用插件选项 [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280) 将此报告转储到文件中。
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

### 测量注解处理器生成的文件数量

`kapt` Gradle 插件可以报告每个注解处理器生成的文件的数量统计信息。

这有助于追踪构建中是否包含了任何未使用的注解处理器。
您可以使用生成的报告来查找触发不必要注解处理器的模块，并更新这些模块以避免这种情况。

要启用统计信息报告：

1. 在您的 `build.gradle(.kts)` 中将 `showProcessorStats` 属性值设置为 `true`：

   ```kotlin
   // build.gradle.kts
   kapt {
       showProcessorStats = true
   }
   ```

2. 在您的 `gradle.properties` 中将 `kapt.verbose` Gradle 属性设置为 `true`：

   ```none
   # gradle.properties
   kapt.verbose=true
   ```

> 您也可以使用[命令行选项 `verbose`](#use-in-cli) 启用详细输出。
>
{style="note"}

统计信息以 `info` 级别出现在日志中。
您会看到 `Annotation processor stats:` 行，其后是每个注解处理器的执行时间统计信息。
在这些行之后，是 `Generated files report:` 行，其后是每个注解处理器生成的文件的数量统计信息。例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt 的编译规避

为了缩短 kapt 增量构建的时间，它可以使用 Gradle 的[编译规避](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。
启用编译规避后，Gradle 可以在重建项目时跳过注解处理。具体来说，注解
处理在以下情况下会跳过：

* 项目的源文件未更改。
* 依赖项中的更改是 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 兼容的。
   例如，唯一的更改仅在方法体中。

但是，编译规避不能用于在编译类路径中发现的注解处理器，因为它们的_任何更改_都需要运行注解处理任务。

要使用编译规避运行 kapt：
* [手动将注解处理器依赖项添加到 `kapt*` 配置中](#use-in-gradle)。
* 在 `gradle.properties` 文件中关闭在编译类路径中发现注解处理器：

   ```none
   # gradle.properties
   kapt.include.compile.classpath=false
   ```

## 增量注解处理

kapt 默认支持增量注解处理。
目前，注解处理仅当所有使用的注解处理器都是增量式时才能实现增量。

要禁用增量注解处理，请将此行添加到您的 `gradle.properties` 文件中：

```none
kapt.incremental.apt=false
```

请注意，增量注解处理也要求启用[增量编译](gradle-compilation-and-caches.md#incremental-compilation)。

## 从超配置继承注解处理器

您可以在独立的 Gradle 配置中定义一组通用的注解处理器作为超配置，并在您的子项目的 kapt 特有配置中进一步扩展它。

例如，对于使用 [Dagger](https://dagger.dev/) 的子项目，请在您的 `build.gradle(.kts)` 文件中使用以下配置：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此示例中，`commonAnnotationProcessors` Gradle 配置是您希望用于所有项目的通用注解处理超配置。您使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
方法将 `commonAnnotationProcessors` 添加为超配置。kapt 发现 `commonAnnotationProcessors`
Gradle 配置具有对 Dagger 注解处理器的依赖项。
因此，kapt 在其注解处理配置中包含了 Dagger 注解处理器。

## Java 编译器选项

kapt 使用 Java 编译器来运行注解处理器。
以下是您可以将任意选项传递给 javac 的方法：

```groovy
kapt {
    javacOptions {
        // 增加注解处理器的最大错误计数。
        // 默认值为 100。
        option("-Xmaxerrs", 500)
    }
}
```

## 不存在类型修正

一些注解处理器（例如 `AutoFactory`）依赖于声明签名中的精确类型。
默认情况下，kapt 会将每个未知类型（包括生成类的类型）替换为 `NonExistentClass`，但您可以更改此行为。
将该选项添加到 `build.gradle(.kts)` 文件中，以在存根中启用错误类型推断：

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用

在 `compile` 之前添加 kotlin-maven-plugin 中 `kapt` 目标的执行：

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- 如果为插件启用扩展，可以跳过 <goals> 元素 -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- 在此处指定您的注解处理器 -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

要配置注解处理级别，请在 `<configuration>` 代码块中将以下之一设置为 `aptMode`：

   * `stubs` – 仅生成注解处理所需的存根。
   * `apt` – 仅运行注解处理。
   * `stubsAndApt` – （默认）生成存根并运行注解处理。

例如：

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

## 在 IntelliJ 构建系统中使用

IntelliJ IDEA 自己的构建系统不支持 kapt。每当您想重新运行注解处理时，请从“Maven Projects”工具栏启动构建。

## 在命令行界面中使用

kapt 编译器插件在 Kotlin 编译器的二进制发行版中可用。

您可以通过使用 `Xplugin` kotlinc 选项提供插件 JAR 文件的路径来附加插件：

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

以下是可用选项的列表：

* `sources` （*必填*）：生成文件的输出路径。
* `classes` （*必填*）：生成类文件和资源的输出路径。
* `stubs` （*必填*）：存根文件的输出路径。换句话说，是某个临时目录。
* `incrementalData`：二进制存根的输出路径。
* `apclasspath` （*可重复*）：注解处理器 JAR 的路径。根据您拥有的 JAR 数量传递相应数量的 `apclasspath` 选项。
* `apoptions`：注解处理器选项的 Base64 编码列表。有关更多信息，请参见 [AP/javac 选项编码](#ap-javac-options-encoding)。
* `javacArguments`：传递给 javac 的选项的 Base64 编码列表。有关更多信息，请参见 [AP/javac 选项编码](#ap-javac-options-encoding)。
* `processors`：逗号分隔的注解处理器限定类名列表。如果指定，kapt 不会尝试在 `apclasspath` 中查找注解处理器。
* `verbose`：启用详细输出。
* `aptMode` （*必填*）
    * `stubs` – 仅生成注解处理所需的存根。
    * `apt` – 仅运行注解处理。
    * `stubsAndApt` – 生成存根并运行注解处理。
* `correctErrorTypes`：有关更多信息，请参见[不存在类型修正](#non-existent-type-correction)。默认禁用。
* `dumpFileReadHistory`：为每个文件转储注解处理期间使用的类列表的输出路径。

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

## 生成 Kotlin 源代码

kapt 可以生成 Kotlin 源代码。只需将生成的 Kotlin 源文件写入由 `processingEnv.options["kapt.kotlin.generated"]` 指定的目录，
这些文件将与主源代码一起编译。

请注意，kapt 不支持对生成的 Kotlin 文件进行多轮处理。

## AP/Javac 选项编码

`apoptions` 和 `javacArguments` 命令行界面选项接受编码的选项映射。
以下是您可以自行编码选项的方法：

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

默认情况下，kapt 运行所有注解处理器并禁用 javac 的注解处理。
然而，您可能需要某些 javac 的注解处理器正常工作（例如，[Lombok](https://projectlombok.org/)）。

在 Gradle 构建文件中，使用 `keepJavacAnnotationProcessors` 选项：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果您使用 Maven，则需要指定具体的插件设置。
请参见 [Lombok 编译器插件设置示例](lombok.md#using-with-kapt)。