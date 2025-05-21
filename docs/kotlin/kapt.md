---
title: kapt编译器插件
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip
kapt 处于维护模式。我们会使其与最新的 Kotlin 和 Java 版本保持同步，但没有计划实现新功能。请使用 [Kotlin 符号处理 API (KSP)](ksp-overview) 进行注解处理。
[查看 KSP 支持的库的列表](ksp-overview#supported-libraries)。

Kotlin 通过 _kapt_ 编译器插件支持注解处理器（参见 [JSR 269](https://jcp.org/en/jsr/detail?id=269)）。

简而言之，你可以在 Kotlin 项目中使用 [Dagger](https://google.github.io/dagger/) 或
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) 等库。

请阅读以下内容，了解如何将 *kapt* 插件应用到你的 Gradle/Maven 构建中。

## 在 Gradle 中使用

按照以下步骤操作：
1. 应用 `kotlin-kapt` Gradle 插件：

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   plugins {
       kotlin("kapt") version "2.1.20"
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "2.1.20"
   }
   ```

   </TabItem>
   </Tabs>

2. 在你的 `dependencies` 代码块中使用 `kapt` 配置添加相应的依赖项：

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       kapt("groupId:artifactId:version")
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:version'
   }
   ```

   </TabItem>
   </Tabs>

3. 如果你之前使用 [Android 支持](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)
   进行注解处理，请将 `annotationProcessor` 配置的用法替换为 `kapt`。
   如果你的项目包含 Java 类，`kapt` 也会处理它们。

   如果你为你的 `androidTest` 或 `test` 源码使用注解处理器，则相应的 `kapt` 配置名为 `kaptAndroidTest` 和 `kaptTest`。
   请注意，`kaptAndroidTest` 和 `kaptTest` 扩展了 `kapt`，因此你可以只提供 `kapt` 依赖项，它将同时适用于生产源码和测试。

## 尝试 Kotlin K2 编译器

kapt 编译器插件中对 K2 的支持是 [实验性的](components-stability)。 需要选择启用（参见下面的详细信息），
并且你应该仅将其用于评估目的。

从 Kotlin 1.9.20 开始，你可以尝试将 kapt 编译器插件与 [K2 编译器](https://blog.jetbrains.com/kotlin/2021/10/the-road-to-the-k2-compiler/) 一起使用，
这带来了性能改进和许多其他好处。 要在你的 Gradle 项目中使用 K2 编译器，请将以下
选项添加到你的 `gradle.properties` 文件中：

```kotlin
kapt.use.k2=true
```

如果你使用 Maven 构建系统，请更新你的 `pom.xml` 文件：

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

要在你的 Maven 项目中启用 kapt 插件，请参阅 [](#use-in-maven)。

:::

如果你在使用带有 K2 编译器的 kapt 时遇到任何问题，请将它们报告给我们的
[问题跟踪器](http://kotl.in/issue)。

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

默认情况下，kapt 注解处理任务在 [Gradle 中缓存](https://guides.gradle.org/using-build-cache/)。
但是，注解处理器运行任意代码，这些代码可能不一定将任务输入转换为输出，
可能会访问和修改 Gradle 未跟踪的文件等。 如果构建中使用的注解处理器无法
正确缓存，则可以通过将以下行添加到构建脚本中来完全禁用 kapt 的缓存，
以避免 kapt 任务的误报缓存命中：

```groovy
kapt {
    useBuildCache = false
}
```

## 提高使用 kapt 的构建速度

### 并行运行 kapt 任务

要提高使用 kapt 的构建速度，你可以为 kapt 任务启用 [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)。
使用 Worker API 允许 Gradle 并行运行来自单个项目的独立注解处理任务，
在某些情况下，这会显着减少执行时间。

当你在 Kotlin Gradle 插件中使用 [自定义 JDK home](gradle-configure-project#gradle-java-toolchains-support) 功能时，
kapt 任务 worker 仅使用 [进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)。
请注意，`kapt.workers.isolation` 属性将被忽略。

如果你想为 kapt worker 进程提供额外的 JVM 参数，请使用 `KaptWithoutKotlincTask` 的输入 `kaptProcessJvmArgs`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</TabItem>
</Tabs>

### 缓存注解处理器的类加载器

:::caution
kapt 中注解处理器类加载器的缓存是 [实验性的](components-stability)。
它可能随时被删除或更改。 仅将其用于评估目的。
我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 上对此的反馈。

:::

如果你连续运行许多 Gradle 任务，则缓存注解处理器的类加载器有助于 kapt 执行得更快。

要启用此功能，请在你的 `gradle.properties` 文件中使用以下属性：

```none
# 正值将启用缓存
# 使用与使用 kapt 的模块数量相同的值
kapt.classloaders.cache.size=5

# 禁用以使缓存工作
kapt.include.compile.classpath=false
```

如果你在使用注解处理器缓存时遇到任何问题，请禁用它们的缓存：

```none
# 指定注解处理器的完整名称以禁用它们的缓存
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

### 衡量注解处理器的性能

使用 `-Kapt-show-processor-timings` 插件选项获取有关注解处理器执行的性能统计信息。
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

### 衡量使用注解处理器生成的文件数

`kotlin-kapt` Gradle 插件可以报告每个注解处理器生成的文件数的统计信息。

这有助于跟踪构建中是否存在未使用的注解处理器。
你可以使用生成的报告来查找触发不必要注解处理器的模块，并更新这些模块以防止这种情况。

分两步启用统计信息：
* 在你的 `build.gradle(.kts)` 中将 `showProcessorStats` 标志设置为 `true`：

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* 在你的 `gradle.properties` 中将 `kapt.verbose` Gradle 属性设置为 `true`：

  ```none
  kapt.verbose=true
  ```

> 你还可以通过 [命令行选项 `verbose`](#use-in-cli) 启用详细输出。
>
> 

统计信息将以 `info` 级别出现在日志中。 你将看到 `Annotation processor stats:` 行，后跟
有关每个注解处理器执行时间的统计信息。 在这些行之后，将显示 `Generated files report:` 行，
后跟有关每个注解处理器生成的文件数的统计信息。 例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt 的编译避免

为了改善使用 kapt 的增量构建时间，它可以使用 Gradle [编译避免](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。
启用编译避免后，Gradle 可以在重建项目时跳过注解处理。 特别是，当以下情况时，将跳过注解
处理：

* 项目的源文件未更改。
* 依赖项中的更改与 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 兼容。
   例如，唯一的更改是在方法体中。

但是，编译避免不能用于在编译 classpath 中发现的注解处理器，因为它们中的 _任何更改_
都需要运行注解处理任务。

要使用编译避免运行 kapt：
* 如 [上文](#use-in-gradle) 所述，手动将注解处理器依赖项添加到 `kapt*` 配置中。
* 通过将此行添加到你的 `gradle.properties` 文件中，关闭在编译 classpath 中发现注解处理器：

```none
kapt.include.compile.classpath=false
```

## 增量注解处理

kapt 支持默认启用的增量注解处理。
目前，只有所有正在使用的注解处理器都是增量的情况下，注解处理才能是增量的。

要禁用增量注解处理，请将此行添加到你的 `gradle.properties` 文件中：

```none
kapt.incremental.apt=false
```

请注意，增量注解处理还需要启用 [增量编译](gradle-compilation-and-caches#incremental-compilation)。

## 从超配置继承注解处理器

你可以在单独的 Gradle 配置中定义一组常见的注解处理器作为
超配置，并在子项目的特定于 kapt 的配置中进一步扩展它。

例如，对于使用 [Dagger](https://dagger.dev/) 的子项目，在你的 `build.gradle(.kts)` 文件中，使用以下配置：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此示例中，`commonAnnotationProcessors` Gradle 配置是你的通用超配置，用于你希望用于所有项目的注解处理。
你使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
方法将 `commonAnnotationProcessors` 添加为超配置。 kapt 看到 `commonAnnotationProcessors`
Gradle 配置依赖于 Dagger 注解处理器。 因此，kapt 在其用于注解处理的配置中包含 Dagger 注解处理器。

## Java 编译器选项

kapt 使用 Java 编译器来运行注解处理器。
以下是如何将任意选项传递给 javac：

```groovy
kapt {
    javacOptions {
        // 增加来自注解处理器的最大错误计数。
        // 默认为 100。
        option("-Xmaxerrs", 500)
    }
}
```

## 不存在的类型更正

一些注解处理器（例如 `AutoFactory`）依赖于声明签名中的精确类型。
默认情况下，kapt 将每个未知类型（包括为生成的类提供的类型）替换为 `NonExistentClass`，
但你可以更改此行为。 将选项添加到 `build.gradle(.kts)` 文件以在存根中启用错误类型推断：

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用

在 `compile` 之前从 kotlin-maven-plugin 添加 `kapt` 目标的执行：

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- 如果你为插件启用扩展，则可以跳过 <goals> 元素 -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- 在此处指定你的注解处理器 -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

要配置注解处理的级别，请在 `<configuration>` 代码块中将以下之一设置为 `aptMode`：

   * `stubs` – 仅生成注解处理所需的存根。
   * `apt` – 仅运行注解处理。
   * `stubsAndApt` –（默认）生成存根并运行注解处理。

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

IntelliJ IDEA 自己的构建系统不支持 kapt。 每当你想要重新运行注解处理时，请从“Maven Projects”
工具栏启动构建。

## 在 CLI 中使用

kapt 编译器插件在 Kotlin 编译器的二进制发行版中可用。

你可以使用 `Xplugin` kotlinc 选项提供其 JAR 文件的路径来附加插件：

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

以下是可用选项的列表：

* `sources`（*必需*）：生成文件的输出路径。
* `classes`（*必需*）：生成类文件和资源的输出路径。
* `stubs`（*必需*）：存根文件的输出路径。 换句话说，一些临时目录。
* `incrementalData`：二进制存根的输出路径。
* `apclasspath`（*可重复*）：注解处理器 JAR 的路径。 传递与你拥有的 JAR 数量一样多的 `apclasspath` 选项。
* `apoptions`：注解处理器选项的 base64 编码列表。 有关更多信息，请参见 [AP/javac 选项编码](#ap-javac-options-encoding)。
* `javacArguments`：传递给 javac 的选项的 base64 编码列表。 有关更多信息，请参见 [AP/javac 选项编码](#ap-javac-options-encoding)。
* `processors`：注解处理器限定类名的逗号分隔列表。 如果指定，kapt 不会尝试在 `apclasspath` 中查找注解处理器。
* `verbose`：启用详细输出。
* `aptMode`（*必需*）
    * `stubs` – 仅生成注解处理所需的存根。
    * `apt` – 仅运行注解处理。
    * `stubsAndApt` – 生成存根并运行注解处理。
* `correctErrorTypes`：有关更多信息，请参见 [不存在的类型更正](#non-existent-type-correction)。 默认禁用。
* `dumpFileReadHistory`：转储的文件（列表包含了注解处理期间使用的类）的输出路径。

插件选项格式为：`-P plugin:<plugin id>:<key>=<value>`。 可以重复选项。

一个例子：

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## 生成 Kotlin 源码

kapt 可以生成 Kotlin 源码。 只需将生成的 Kotlin 源码文件写入 `processingEnv.options["kapt.kotlin.generated"]` 指定的目录，
这些文件将与主源码一起编译。

请注意，kapt 不支持为生成的 Kotlin 文件进行多轮处理。

## AP/Javac 选项编码

`apoptions` 和 `javacArguments` CLI 选项接受选项的编码映射。
以下是你自己编码选项的方式：

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
但是，你可能需要一些 javac 的注解处理器才能工作（例如，[Lombok](https://projectlombok.org/)）。

在 Gradle 构建文件中，使用选项 `keepJavacAnnotationProcessors`：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果你使用 Maven，则需要指定具体的插件设置。
请参阅此 [Lombok 编译器插件的设置示例](lombok#using-with-kapt)。