---
title: "配置 Gradle 项目"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

要使用 [Gradle](https://docs.gradle.org/current/userguide/userguide.html) 构建 Kotlin 项目，你需要在构建脚本文件 `build.gradle(.kts)` 中 [添加 Kotlin Gradle 插件](#apply-the-plugin) 并在此处 [配置项目依赖项](#configure-dependencies)。

:::note
要了解有关构建脚本内容的更多信息，请访问 [浏览构建脚本](get-started-with-jvm-gradle-project#explore-the-build-script) 部分。

:::

## 应用插件

要应用 Kotlin Gradle 插件（KGP），请使用 Gradle 插件 DSL 中的 [`plugins{}` block](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    // 将 `<...>` 替换为你目标环境适用的插件名称
    kotlin("<...>") version "2.1.20"
    // 例如，如果你的目标环境是 JVM：
    // kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    // 将 `<...>` 替换为你目标环境适用的插件名称
    id 'org.jetbrains.kotlin.<...>' version '2.1.20'
    // 例如，如果你的目标环境是 JVM： 
    // id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}
```

</TabItem>
</Tabs>

:::note
Kotlin Gradle 插件（KGP）和 Kotlin 共享相同的版本编号。

:::

配置项目时，请检查 Kotlin Gradle 插件（KGP）与可用 Gradle 版本的兼容性。下表列出了 Gradle 和 Android Gradle 插件（AGP）的最小和最大**完全支持**版本：

| KGP version   | Gradle min and max versions           | AGP min and max versions                            |
|---------------|---------------------------------------|-----------------------------------------------------|
| 2.1.20        | 7.6.3–8.11 | 7.3.1–8.7.2 |
| 2.1.0–2.1.10  | 7.6.3–8.10*                           | 7.3.1–8.7.2                                         |
| 2.0.20–2.0.21 | 6.8.3–8.8*                            | 7.1.3–8.5                                           |
| 2.0.0         | 6.8.3–8.5                             | 7.1.3–8.3.1                                         |
| 1.9.20–1.9.25 | 6.8.3–8.1.1                           | 4.2.2–8.1.0                                         |
| 1.9.0–1.9.10  | 6.8.3–7.6.0                           | 4.2.2–7.4.0                                         |
| 1.8.20–1.8.22 | 6.8.3–7.6.0                           | 4.1.3–7.4.0                                         |      
| 1.8.0–1.8.11  | 6.8.3–7.3.3                           | 4.1.3–7.2.1                                         |   
| 1.7.20–1.7.22 | 6.7.1–7.1.1                           | 3.6.4–7.0.4                                         |
| 1.7.0–1.7.10  | 6.7.1–7.0.2                           | 3.4.3–7.0.2                                         |
| 1.6.20–1.6.21 | 6.1.1–7.0.2                           | 3.4.3–7.0.2                                         |
:::note
*Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 完全兼容 Gradle 8.6 及以下版本。
Gradle 8.7–8.10 版本也受支持，但只有一个例外：如果你使用 Kotlin Multiplatform Gradle 插件，
你可能会在多平台项目中调用 JVM 目标中的 `withJava()` 函数时看到弃用警告。
有关更多信息，请参阅 [默认创建的 Java 源代码集](multiplatform-compatibility-guide#java-source-sets-created-by-default)。

你也可以使用 Gradle 和 AGP 的最新版本，但如果你这样做，请记住你可能会遇到
弃用警告或某些新功能可能无法正常工作。

例如，Kotlin Gradle 插件和 `kotlin-multiplatform` 插件 2.1.20 需要项目的最小 Gradle 版本为 7.6.3 才能编译。

同样，最大完全支持的版本是 8.11。它没有已弃用的 Gradle
方法和属性，并支持所有当前的 Gradle 功能。

### Kotlin Gradle 插件在项目中的数据

默认情况下，Kotlin Gradle 插件将持久性的项目特定数据存储在项目的根目录下的 `.kotlin` 目录中。

不要将 `.kotlin` 目录提交到版本控制。
例如，如果你正在使用 Git，请将 `.kotlin` 添加到项目的 `.gitignore` 文件中。

你可以将属性添加到项目的 `gradle.properties` 文件中，以配置此行为：

| Gradle property                                     | Description                                                                                                                                       |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 配置存储项目级别数据的位置。默认值：`<project-root-directory>/.kotlin`                                      |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 控制是否禁用将 Kotlin 数据写入 `.gradle` 目录（为了与旧版本的 IDEA 兼容）。默认值：false |

## 以 JVM 为目标

要以 JVM 为目标，请应用 Kotlin JVM 插件。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "2.1.20"
}
```

</TabItem>
</Tabs>

`version` 在此代码块中应该是字面量，不能从另一个构建脚本应用。

### Kotlin 和 Java 源代码

Kotlin 源代码和 Java 源代码可以存储在同一目录中，也可以放置在不同的目录中。

默认约定是使用不同的目录：

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

不要将 Java `.java` 文件存储在 `src/*/kotlin` 目录中，因为 `.java` 文件不会被编译。

相反，你可以使用 `src/main/java`。

 

如果你不使用默认约定，则应更新相应的 `sourceSets` 属性：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</TabItem>
</Tabs>

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 检查相关编译任务的 JVM 目标兼容性

在构建模块中，你可能具有相关的编译任务，例如：
* `compileKotlin` 和 `compileJava`
* `compileTestKotlin` 和 `compileTestJava`

`main` 和 `test` 源代码集编译任务不相关。

:::

对于像这样的相关任务，Kotlin Gradle 插件检查 JVM 目标兼容性。`kotlin` 扩展或任务中的 [`jvmTarget` 属性](gradle-compiler-options#attributes-specific-to-jvm) 和 `java` 扩展或任务中的 [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension) 的不同值会导致 JVM 目标不兼容。例如：
`compileKotlin` 任务具有 `jvmTarget=1.8`，并且 `compileJava` 任务具有（或 [继承](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)）`targetCompatibility=15`。

通过在 `build.gradle(.kts)` 文件中将 `kotlin.jvm.target.validation.mode` 属性设置为以下值来配置此检查对整个项目的行为：

* `error` – 插件将使构建失败；Gradle 8.0+ 上的项目的默认值。
* `warning` – 插件打印一条警告消息；Gradle 8.0 以下的项目的默认值。
* `ignore` – 插件跳过检查并且不产生任何消息。

你也可以在 `build.gradle(.kts)` 文件中的任务级别配置它：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>().configureEach {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</TabItem>
</Tabs>

要避免 JVM 目标不兼容，请 [配置工具链](#gradle-java-toolchains-support) 或手动对齐 JVM 版本。

#### 如果目标不兼容会发生什么

有两种手动设置 Kotlin 和 Java 源代码集的 JVM 目标的方法：
* 通过 [设置 Java 工具链](#gradle-java-toolchains-support) 的隐式方式。
* 通过在 `kotlin` 扩展或任务中设置 `jvmTarget` 属性以及在 `java` 扩展或任务中设置 `targetCompatibility` 的显式方式。

如果你执行以下操作，则会发生 JVM 目标不兼容：
* 显式设置 `jvmTarget` 和 `targetCompatibility` 的不同值。
* 具有默认配置，并且你的 JDK 不等于 `1.8`。

让我们考虑一下当你仅在构建脚本中具有 Kotlin JVM 插件并且没有 JVM 目标的其他设置时的 JVM 目标的默认配置：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "2.1.20"
}
```

</TabItem>
</Tabs>

当构建脚本中没有关于 `jvmTarget` 值的显式信息时，其默认值为 `null`，并且编译器将其转换为默认值 `1.8`。`targetCompatibility` 等于
当前的 Gradle 的 JDK 版本，该版本等于你的 JDK 版本（除非你使用 [Java 工具链方法](gradle-configure-project#gradle-java-toolchains-support)）。假设你的 JDK 版本是
`17`，你发布的库工件将 [声明自身与 JDK 17+ 兼容](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)：`org.gradle.jvm.version=17`，这是错误的。
在这种情况下，你必须在主项目中使用 Java 17 才能添加此库，即使字节码的版本是 `1.8`。[配置工具链](gradle-configure-project#gradle-java-toolchains-support)
以解决此问题。

### Gradle Java 工具链支持

:::note
对 Android 用户的警告。要使用 Gradle 工具链支持，请使用 Android Gradle 插件（AGP）版本 8.1.0-alpha09 或更高版本。

Gradle Java 工具链支持仅从 AGP 7.4.0 [可用](https://issuetracker.google.com/issues/194113162)。
然而，由于 [此问题](https://issuetracker.google.com/issues/260059413)，AGP 直到 8.1.0-alpha09 版本才将 `targetCompatibility`
设置为等于工具链的 JDK。
如果你使用的版本低于 8.1.0-alpha09，则需要通过 `compileOptions` 手动配置 `targetCompatibility`。
将占位符 `<MAJOR_JDK_VERSION>` 替换为你想要使用的 JDK 版本：

```kotlin
android {
    compileOptions {
        sourceCompatibility = <MAJOR_JDK_VERSION>
        targetCompatibility = <MAJOR_JDK_VERSION>
    }
}
```

 

Gradle 6.7 引入了 [Java 工具链支持](https://docs.gradle.org/current/userguide/toolchains.html)。
使用此功能，你可以：
* 使用与 Gradle 中不同的 JDK 和 JRE 来运行编译、测试和可执行文件。
* 使用尚未发布的语言版本编译和测试代码。

通过工具链支持，Gradle 可以自动检测本地 JDK 并安装 Gradle 构建所需的缺失 JDK。
现在 Gradle 本身可以在任何 JDK 上运行，并且仍然可以为依赖于主要 JDK 版本的任务重用 [远程构建缓存功能](gradle-compilation-and-caches#gradle-build-cache-support)。

Kotlin Gradle 插件支持 Kotlin/JVM 编译任务的 Java 工具链。JS 和 Native 任务不使用工具链。
Kotlin 编译器始终在 Gradle 守护程序运行的 JDK 上运行。
Java 工具链：
* 设置可用于 JVM 目标的 [`-jdk-home` 选项](compiler-reference#jdk-home-path)。
* 如果用户未显式设置 `jvmTarget` 选项，则将 [`compilerOptions.jvmTarget`](gradle-compiler-options#attributes-specific-to-jvm) 设置为工具链的 JDK 版本。
  如果用户未配置工具链，则 `jvmTarget` 字段使用默认值。
  了解有关 [JVM 目标兼容性](#check-for-jvm-target-compatibility-of-related-compile-tasks) 的更多信息。
* 设置要由任何 Java 编译、测试和 javadoc 任务使用的工具链。
* 影响 [`kapt` workers](kapt#run-kapt-tasks-in-parallel) 在哪个 JDK 上运行。

使用以下代码设置工具链。将占位符 `<MAJOR_JDK_VERSION>` 替换为你想要使用的 JDK 版本：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(17)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvmToolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(17)
}
```

</TabItem>
</Tabs>

请注意，通过 `kotlin` 扩展设置工具链也会更新 Java 编译任务的工具链。

你可以通过 `java` 扩展设置工具链，并且 Kotlin 编译任务将使用它：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) 
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

</TabItem>
</Tabs>

如果你使用 Gradle 8.0.2 或更高版本，你还需要添加一个 [工具链解析器插件](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)。
这种类型的插件管理从哪些存储库下载工具链。例如，将以下插件添加到你的 `settings.gradle(.kts)`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("0.9.0")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '0.9.0'
}
```

</TabItem>
</Tabs>

在 [Gradle 站点](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories) 上检查 `foojay-resolver-convention` 的版本是否与你的 Gradle 版本相对应。

要了解 Gradle 使用哪个工具链，请使用 [日志级别 `--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level) 运行你的 Gradle 构建，
并在输出中找到一个以 `[KOTLIN] Kotlin compilation 'jdkHome' argument:` 开头的字符串。
冒号后面的部分将是来自工具链的 JDK 版本。

:::

要为特定任务设置任何 JDK（甚至是本地 JDK），请使用 [Task DSL](#set-jdk-version-with-the-task-dsl)。

了解有关 [Kotlin 插件中 Gradle JVM 工具链支持](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/) 的更多信息。

### 使用 Task DSL 设置 JDK 版本

Task DSL 允许为任何实现 `UsesKotlinJavaToolchain` 接口的任务设置任何 JDK 版本。
目前，这些任务是 `KotlinCompile` 和 `KaptTask`。
如果你希望 Gradle 搜索主要的 JDK 版本，请替换构建脚本中的 `<MAJOR_JDK_VERSION>` 占位符：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
}
tasks.withType(UsesKotlinJavaToolchain::class).configureEach { task `->`
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</TabItem>
</Tabs>

或者你可以指定本地 JDK 的路径，并将占位符 `<LOCAL_JDK_VERSION>` 替换为此 JDK 版本：

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // 放置 JDK 的路径
        JavaVersion.<LOCAL_JDK_VERSION> // 例如，JavaVersion.17
    )
}
```

### 关联编译器任务

你可以通过设置编译任务之间的关系来*关联*编译，以便一个编译使用另一个编译的已编译输出。关联编译在它们之间建立 `internal` 可见性。

默认情况下，Kotlin 编译器会关联一些编译，例如每个目标的 `test` 和 `main` 编译。
如果你需要表达你的自定义编译之一连接到另一个编译，请创建你自己的关联编译。

为了使 IDE 支持关联的编译以推断源代码集之间的可见性，请将以下代码添加到你的 `build.gradle(.kts)`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
val integrationTestCompilation = kotlin.target.compilations.create("integrationTest") {
    associateWith(kotlin.target.compilations.getByName("main"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
integrationTestCompilation {
    kotlin.target.compilations.create("integrationTest") {
        associateWith(kotlin.target.compilations.getByName("main"))
    }
}
```

</TabItem>
</Tabs>

在这里，`integrationTest` 编译与 `main` 编译相关联，从而可以访问功能测试中的 `internal` 对象。

### 配置启用 Java 模块 (JPMS)

为了使 Kotlin Gradle 插件与 [Java 模块](https://www.oracle.com/corporate/features/understanding-java-9-modules.html) 一起使用，
请将以下行添加到你的构建脚本并将 `YOUR_MODULE_NAME` 替换为对你的 JPMS 模块的引用，例如 `org.company.module`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>
        
```kotlin
// 如果你使用的 Gradle 版本低于 7.0，请添加以下三行
java {
    modularity.inferModulePath.set(true)
}

tasks.named("compileJava", JavaCompile::class.java) {
    options.compilerArgumentProviders.add(CommandLineArgumentProvider {
        // 将已编译的 Kotlin 类提供给 javac – Java/Kotlin 混合源正常工作所必需的
        listOf("--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}")
    })
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// 如果你使用的 Gradle 版本低于 7.0，请添加以下三行
java {
    modularity.inferModulePath = true
}

tasks.named("compileJava", JavaCompile.class) {
    options.compilerArgumentProviders.add(new CommandLineArgumentProvider() {
        @Override
        Iterable<String> asArguments() {
            // 将已编译的 Kotlin 类提供给 javac – Java/Kotlin 混合源正常工作所必需的
            return ["--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}"]
        }
    })
}
```

</TabItem>
</Tabs>

:::note
像往常一样将 `module-info.java` 放入 `src/main/java` 目录中。

对于模块，Kotlin 文件中的包名称应等于 `module-info.java` 中的包名称，以避免
“包为空或不存在”构建失败。

:::

了解更多关于：
* [为 Java 模块系统构建模块](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [使用 Java 模块系统构建应用程序](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* [Kotlin 中“模块”的含义](visibility-modifiers#modules)

### 其他细节

了解有关 [Kotlin/JVM](jvm-get-started) 的更多信息。

#### 禁用在编译任务中使用工件

在某些罕见的情况下，你可能会遇到由循环依赖错误引起的构建失败。例如，当你有多个编译任务时，其中一个编译任务可以看到另一个编译任务的所有内部声明，并且生成的工件
依赖于两个编译任务的输出：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

为了解决此循环依赖错误，我们添加了一个 Gradle 属性：`archivesTaskOutputAsFriendModule`。
此属性控制在编译任务中对工件输入的使用，并确定是否因此创建了任务依赖。

默认情况下，此属性设置为 `true` 以跟踪任务依赖。如果遇到循环依赖错误，
你可以禁用在编译任务中使用工件以删除任务依赖并避免循环
依赖错误。

要禁用在编译任务中使用工件，请将以下内容添加到你的 `gradle.properties` 文件中：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

#### 延迟 Kotlin/JVM 任务创建

从 Kotlin 1.8.20 开始，Kotlin Gradle 插件注册所有任务，并且不会在 dry run（空运行）中配置它们。

#### 编译任务的 destinationDirectory 的非默认位置

如果你覆盖 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任务的 `destinationDirectory` 位置，
请更新你的构建脚本。你需要在 JAR 文件中显式地将 `sourceSets.main.kotlin.classesDirectories` 添加到 `sourceSets.main.outputs`：

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## 以多个平台为目标

以 [多个平台](multiplatform-dsl-reference#targets) 为目标的项目，称为 [多平台项目](multiplatform-intro)，
需要 `kotlin-multiplatform` 插件。

:::note
`kotlin-multiplatform` 插件适用于 Gradle 7.6.3 或更高版本。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

了解有关 [适用于不同平台的 Kotlin 多平台](multiplatform-intro) 和
[适用于 iOS 和 Android 的 Kotlin 多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html) 的更多信息。

## 以 Android 为目标

建议使用 Android Studio 创建 Android 应用程序。[了解如何使用 Android Gradle 插件](https://developer.android.com/studio/releases/gradle-plugin)。

## 以 JavaScript 为目标

当以 JavaScript 为目标时，也使用 `kotlin-multiplatform` 插件。[了解有关设置 Kotlin/JS 项目的更多信息](js-project-setup)

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

### 适用于 JavaScript 的 Kotlin 和 Java 源代码

此插件仅适用于 Kotlin 文件，因此建议你将 Kotlin 和 Java 文件分开保存（如果
项目包含 Java 文件）。如果你不将它们分开存储，请在 `sourceSets{}` 代码块中指定源文件夹：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("src/main/myKotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</TabItem>
</Tabs>

## 使用 KotlinBasePlugin 接口触发配置操作

要每当应用任何 Kotlin Gradle 插件（JVM、JS、Multiplatform、Native 等）时触发一些配置操作，
请使用所有 Kotlin 插件都继承的 `KotlinBasePlugin` 接口：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
    // 在此处配置你的操作
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
    // 在此处配置你的操作
}
```

</TabItem>
</Tabs>

## 配置依赖项

要添加对库的依赖项，请在源代码集的 DSL 的 `dependencies{}` 代码块中设置所需 [类型](#dependency-types) 的依赖项（例如，`implementation`）。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</TabItem>
</Tabs>

或者，你也可以 [在顶层设置依赖项](#set-dependencies-at-top-level)。

### 依赖项类型

根据你的要求选择依赖项类型。
<table>
<tr>
        <th>类型</th>
        <th>描述</th>
        <th>何时使用</th>
</tr>
<tr>
<td>
`api`
</td>
<td>
在编译和运行时都使用，并导出到库使用者。
</td>
<td>
如果依赖项中的任何类型在当前模块的公共 API 中使用，请使用 `api` 依赖项。
</td>
</tr>
<tr>
<td>
`implementation`
</td>
<td>
用于当前模块的编译和运行时，但不暴露于编译依赖于具有 `implementation` 依赖项的模块的其他模块。
</td>
<td>

<p>
   用于模块的内部逻辑所需的依赖项。
</p>
<p>
   如果模块是不发布的端点应用程序，请使用 `implementation` 依赖项而不是 `api` 依赖项。
</p>
</td>
</tr>
<tr>
<td>
`compileOnly`
</td>
<td>
用于当前模块的编译，在运行时或其他模块的编译期间不可用。
</td>
<td>
用于在运行时具有第三方实现的 API。
</td>
</tr>
<tr>
<td>
`runtimeOnly`
</td>
<td>
在运行时可用，但在任何模块的编译期间都不可见。
</td>
<td>
</td>
</tr>
</table>

### 对标准库的依赖项

对标准库（`stdlib`）的依赖项会自动添加到每个源代码集中。所使用的标准库的版本
与 Kotlin Gradle 插件的版本相同。

对于特定于平台的源代码集，使用该库的相应于特定于平台的变体，而将通用的标准
库添加到其余的库中。Kotlin Gradle 插件根据 Gradle 构建脚本的
`compilerOptions.jvmTarget` [编译器选项](gradle-compiler-options) 选择适当的 JVM 标准库。

如果你显式声明标准库依赖项（例如，如果你需要不同的版本），则 Kotlin Gradle
插件将不会覆盖它或添加第二个标准库。

如果你根本不需要标准库，则可以将以下 Gradle 属性添加到你的 `gradle.properties` 文件中：

```none
kotlin.stdlib.default.dependency=false
```

#### 传递依赖项的版本对齐

从 Kotlin 标准库版本 1.9.20 开始，Gradle 使用包含在标准库中的元数据来自动
对齐传递 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依赖项。

如果你为 1.8.0 – 1.9.10 之间的任何 Kotlin 标准库版本添加依赖项，例如：
`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，则 Kotlin Gradle 插件会将此 Kotlin 版本
用于传递 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依赖项。这避免了来自不同标准库版本的类重复。[了解有关将 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib` 中的更多信息](whatsnew18#updated-jvm-compilation-target)。
你可以使用 `gradle.properties` 文件中的 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 属性禁用此行为：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

##### 对齐版本的其他方法

* 如果你遇到版本对齐问题，你可以通过 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 对齐所有版本。
  在你的构建脚本中声明对 `kotlin-bom` 的平台依赖项：

  <Tabs groupId="build-script">
  <TabItem value="kotlin" label="Kotlin" default>

  ```kotlin
  implementation(platform("org.jetbrains.kotlin:kotlin-bom:2.1.20"))
  ```

  </TabItem>
  <TabItem value="groovy" label="Groovy" default>

  ```groovy
  implementation platform('org.jetbrains.kotlin:kotlin-bom:2.1.20')
  ```

  </TabItem>
  </Tabs>

* 如果你不为标准库版本添加依赖项，但你有两个不同的依赖项传递性地
  引入了不同旧版本的 Kotlin 标准库，那么你可以显式地要求 `2.1.20`
  版本的这些传递库：

  <Tabs groupId="build-script">
  <TabItem value="kotlin" label="Kotlin" default>

  ```kotlin
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("2.1.20")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("2.1.20")
              }
          }
      }
  }
  ```

  </TabItem>
  </Tabs>