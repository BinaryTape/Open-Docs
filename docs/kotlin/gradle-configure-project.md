[//]: # (title: 配置 Gradle 项目)

要使用 [Gradle](https://docs.gradle.org/current/userguide/userguide.html) 构建 Kotlin 项目，你需要将 [Kotlin Gradle 插件](#apply-the-plugin)添加到你的构建脚本文件 `build.gradle(.kts)` 中，并在其中[配置项目的依赖项](#configure-dependencies)。

> 要了解更多关于构建脚本内容的信息，
> 请访问[探索构建脚本](get-started-with-jvm-gradle-project.md#explore-the-build-script)部分。
>
{style="note"}

## 应用插件

要应用 Kotlin Gradle 插件，请使用 Gradle 插件 DSL 中的 [`plugins{}` 块](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // 替换 `<...>` 为适用于你的目标环境的插件名称
    kotlin("<...>") version "%kotlinVersion%"
    // 例如，如果你的目标环境是 JVM：
    // kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // 替换 `<...>` 为适用于你的目标环境的插件名称
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // 例如，如果你的目标环境是 JVM： 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}
```

</tab>
</tabs>

> Kotlin Gradle 插件 (KGP) 和 Kotlin 共享相同的版本号。
>
{style="note"}

配置项目时，请检查 Kotlin Gradle 插件 (KGP) 与可用 Gradle 版本的兼容性。下表列出了 Gradle 和 Android Gradle 插件 (AGP) **完全支持**的最小和最大版本：

| KGP 版本      | Gradle 最小和最大版本 | AGP 最小和最大版本                         |
| ------------- | --------------------- | ------------------------------------------ |
| 2.1.20        | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% |
| 2.1.0–2.1.10  | 7.6.3–8.10*           | 7.3.1–8.7.2                                |
| 2.0.20–2.0.21 | 6.8.3–8.8*            | 7.1.3–8.5                                  |
| 2.0.0         | 6.8.3–8.5             | 7.1.3–8.3.1                                |
| 1.9.20–1.9.25 | 6.8.3–8.1.1           | 4.2.2–8.1.0                                |
| 1.9.0–1.9.10  | 6.8.3–7.6.0           | 4.2.2–7.4.0                                |
| 1.8.20–1.8.22 | 6.8.3–7.6.0           | 4.1.3–7.4.0                                |
| 1.8.0–1.8.11  | 6.8.3–7.3.3           | 4.1.3–7.2.1                                |
| 1.7.20–1.7.22 | 6.7.1–7.1.1           | 3.6.4–7.0.4                                |
| 1.7.0–1.7.10  | 6.7.1–7.0.2           | 3.4.3–7.0.2                                |
| 1.6.20–1.6.21 | 6.1.1–7.0.2           | 3.4.3–7.0.2                                |

> *Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 完全兼容 Gradle 8.6 及以下版本。
> Gradle 8.7–8.10 版本也受支持，只有一个例外：如果你使用 Kotlin Multiplatform Gradle 插件，
> 你的多平台项目在 JVM 目标中调用 `withJava()` 函数时可能会看到弃用警告。
> 欲了解更多信息，请参阅 [默认创建的 Java 源集](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。
>
{style="warning"}

你也可以使用最新版本的 Gradle 和 AGP，但如果你这样做，请记住你可能会遇到弃用警告或某些新功能可能无法正常工作。

例如，Kotlin Gradle 插件和 `kotlin-multiplatform` 插件 %kotlinVersion% 要求你的项目编译所需的最低 Gradle 版本为 %minGradleVersion%。

类似地，完全支持的最大版本是 %maxGradleVersion%。它没有弃用的 Gradle 方法和属性，并支持所有当前的 Gradle 功能。

### 项目中的 Kotlin Gradle 插件数据

默认情况下，Kotlin Gradle 插件将持久化的项目特定数据存储在项目的根目录中的 `.kotlin` 目录中。

> 不要将 `.kotlin` 目录提交到版本控制。
> 例如，如果你使用 Git，请将 `.kotlin` 添加到你项目的 `.gitignore` 文件中。
>
{style="warning"}

你可以将以下属性添加到项目的 `gradle.properties` 文件中，以配置此行为：

| Gradle 属性                                 | 描述                                                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `kotlin.project.persistent.dir`             | 配置项目级别数据存储的位置。默认值：`<项目根目录>/.kotlin`                                                  |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 控制是否禁用将 Kotlin 数据写入 `.gradle` 目录（为了向后兼容旧版 IDEA）。默认值：false |

## 面向 JVM

要面向 JVM，请应用 Kotlin JVM 插件。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

</tab>
</tabs>

`version` 在此块中应该是字面量，且不能从另一个构建脚本应用。

### Kotlin 和 Java 源文件

Kotlin 源文件和 Java 源文件可以存储在同一个目录中，也可以放在不同的目录中。

默认约定是使用不同的目录：

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

> 不要在 `src/*/kotlin` 目录中存储 Java `.java` 文件，因为 `.java` 文件将不会被编译。
>
> 相反，你可以使用 `src/main/java`。
>
{style="warning"}

如果你没有使用默认约定，则应更新相应的 `sourceSets` 属性：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</tab>
</tabs>

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 检查相关编译任务的 JVM 目标兼容性

在构建模块中，你可能拥有相关的编译任务，例如：
* `compileKotlin` 和 `compileJava`
* `compileTestKotlin` 和 `compileTestJava`

> `main` 和 `test` 源集编译任务不相关。
>
{style="note"}

对于像这些相关的任务，Kotlin Gradle 插件会检查 JVM 目标兼容性。`kotlin` 扩展或任务中的 [`jvmTarget` 属性](gradle-compiler-options.md#attributes-specific-to-jvm)与 `java` 扩展或任务中的 [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension) 值不同会导致 JVM 目标不兼容。例如：
`compileKotlin` 任务的 `jvmTarget=1.8`，并且
`compileJava` 任务的 `targetCompatibility=15`（或[继承](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)）。

通过将 `gradle.properties` 文件中的 `kotlin.jvm.target.validation.mode` 属性设置为以下值，可以配置此检查的全局行为：

* `error` – 插件会使构建失败；Gradle 8.0+ 项目的默认值。
* `warning` – 插件会打印警告消息；Gradle 8.0 以下项目的默认值。
* `ignore` – 插件跳过检查且不生成任何消息。

你也可以在 `build.gradle(.kts)` 文件中的任务级别配置它：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>().configureEach {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</tab>
</tabs>

为了避免 JVM 目标不兼容，请[配置工具链](#gradle-java-toolchains-support)或手动对齐 JVM 版本。

#### 如果目标不兼容会发生什么问题 {initial-collapse-state="collapsed" collapsible="true"}

有两种手动设置 Kotlin 和 Java 源集 JVM 目标的方法：
* 通过[设置 Java 工具链](#gradle-java-toolchains-support)的隐式方式。
* 通过在 `kotlin` 扩展或任务中设置 `jvmTarget` 属性以及在 `java` 扩展或任务中设置 `targetCompatibility` 的显式方式。

如果你出现以下情况，就会发生 JVM 目标不兼容：
* 显式设置不同的 `jvmTarget` 和 `targetCompatibility` 值。
* 使用默认配置，并且你的 JDK 不等于 `1.8`。

让我们考虑 JVM 目标的默认配置，当你的构建脚本中只有 Kotlin JVM 插件且没有为 JVM 目标设置其他配置时：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

</tab>
</tabs>

当构建脚本中没有关于 `jvmTarget` 值的明确信息时，它的默认值为 `null`，编译器会将其转换为默认值 `1.8`。`targetCompatibility` 等于当前 Gradle 的 JDK 版本，这与你的 JDK 版本相同（除非你使用 [Java 工具链方法](gradle-configure-project.md#gradle-java-toolchains-support)）。假设你的 JDK 版本是 `%jvmLTSVersionSupportedByKotlin%`，你发布的库构件将[声明其与](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) JDK %jvmLTSVersionSupportedByKotlin% 及更高版本兼容：`org.gradle.jvm.version=%jvmLTSVersionSupportedByKotlin%`，这是错误的。在这种情况下，你必须在主项目中使用 Java %jvmLTSVersionSupportedByKotlin% 来添加此库，即使字节码版本是 `1.8`。[配置工具链](gradle-configure-project.md#gradle-java-toolchains-support)以解决此问题。

### Gradle Java 工具链支持

> 对 Android 用户的一个警告。要使用 Gradle 工具链支持，请使用 Android Gradle 插件 (AGP) 8.1.0-alpha09 或更高版本。
>
> Gradle Java 工具链支持仅从 AGP 7.4.0 [开始可用](https://issuetracker.google.com/issues/194113162)。
> 然而，由于[此问题](https://issuetracker.google.com/issues/260059413)，AGP 直到 8.1.0-alpha09 版本才将 `targetCompatibility`
> 设置为与工具链的 JDK 相等。
> 如果你使用的版本低于 8.1.0-alpha09，你需要通过 `compileOptions` 手动配置 `targetCompatibility`。
> 将占位符 `<MAJOR_JDK_VERSION>` 替换为你想要使用的 JDK 版本：
>
> ```kotlin
> android {
>     compileOptions {
>         sourceCompatibility = <MAJOR_JDK_VERSION>
>         targetCompatibility = <MAJOR_JDK_VERSION>
>     }
> }
> ```
>
{style="warning"}

Gradle 6.7 引入了 [Java 工具链支持](https://docs.gradle.org/current/userguide/toolchains.html)。
使用此功能，你可以：
* 使用与 Gradle 中不同的 JDK 和 JRE 来运行编译、测试和可执行文件。
* 使用尚未发布的语言版本编译和测试代码。

借助工具链支持，Gradle 可以自动检测本地 JDK 并安装 Gradle 构建所需的缺失 JDK。
现在 Gradle 本身可以在任何 JDK 上运行，并且仍然可以重复使用[远程构建缓存功能](gradle-compilation-and-caches.md#gradle-build-cache-support)来处理依赖于主要 JDK 版本的任务。

Kotlin Gradle 插件支持用于 Kotlin/JVM 编译任务的 Java 工具链。JS 和 Native 任务不使用工具链。
Kotlin 编译器始终在 Gradle 守护进程正在运行的 JDK 上运行。
Java 工具链会：
* 为 JVM 目标设置可用的 [`-jdk-home` 选项](compiler-reference.md#jdk-home-path)。
* 如果用户没有显式设置 `jvmTarget` 选项，则将 [`compilerOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) 设置为工具链的 JDK 版本。
  如果用户未配置工具链，`jvmTarget` 字段将使用默认值。了解更多关于 [JVM 目标兼容性](#check-for-jvm-target-compatibility-of-related-compile-tasks)。
* 设置任何 Java 编译、测试和 javadoc 任务要使用的工具链。
* 影响 [`kapt` worker](kapt.md#run-kapt-tasks-in-parallel) 在哪个 JDK 上运行。

使用以下代码设置工具链。将占位符 `<MAJOR_JDK_VERSION>` 替换为你想要使用的 JDK 版本：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
    // 或者更短：
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // 例如：
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
    // 或者更短：
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // 例如：
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
</tabs>

请注意，通过 `kotlin` 扩展设置工具链也会更新 Java 编译任务的工具链。

你也可以通过 `java` 扩展设置工具链，Kotlin 编译任务也将使用它：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

</tab>
</tabs>

如果你使用 Gradle 8.0.2 或更高版本，你还需要添加一个[工具链解析器插件](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)。这种类型的插件管理从哪些仓库下载工具链。例如，在你的 `settings.gradle(.kts)` 中添加以下插件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("%foojayResolver%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '%foojayResolver%'
}
```

</tab>
</tabs>

请检查 `foojay-resolver-convention` 的版本是否与你的 Gradle 版本在 [Gradle 网站](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)上对应。

> 要了解 Gradle 使用哪个工具链，请使用[日志级别 `--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level) 运行你的 Gradle 构建，
> 并在输出中查找以 `[KOTLIN] Kotlin compilation 'jdkHome' argument:` 开头的字符串。
> 冒号后面的部分将是工具链中的 JDK 版本。
>
{style="note"}

要为特定任务设置任何 JDK（甚至是本地的），请使用[任务 DSL](#set-jdk-version-with-the-task-dsl)。

了解更多关于 [Kotlin 插件中的 Gradle JVM 工具链支持](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/)。

### 使用任务 DSL 设置 JDK 版本

任务 DSL 允许为任何实现了 `UsesKotlinJavaToolchain` 接口的任务设置任何 JDK 版本。
目前，这些任务是 `KotlinCompile` 和 `KaptTask`。
如果你想让 Gradle 搜索主要的 JDK 版本，请替换你的构建脚本中的 `<MAJOR_JDK_VERSION>` 占位符：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
}
tasks.withType(UsesKotlinJavaToolchain::class).configureEach { task ->
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
</tabs>

或者你可以指定本地 JDK 的路径，并将占位符 `<LOCAL_JDK_VERSION>` 替换为这个 JDK 版本：

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // 放入你的 JDK 路径
        JavaVersion.<LOCAL_JDK_VERSION> // 例如，JavaVersion.17
    )
}
```

### 关联编译器任务

你可以通过在编译之间建立一种关系来_关联_编译，使得一个编译使用另一个的编译输出。关联编译会在它们之间建立 `internal` 可见性。

Kotlin 编译器默认关联一些编译，例如每个目标的 `test` 和 `main` 编译。
如果你需要表达你的自定义编译之一与另一个相关联，请创建你自己的关联编译。

为了让 IDE 支持关联编译以推断源集之间的可见性，请在你的 `build.gradle(.kts)` 中添加以下代码：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val integrationTestCompilation = kotlin.target.compilations.create("integrationTest") {
    associateWith(kotlin.target.compilations.getByName("main"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
integrationTestCompilation {
    kotlin.target.compilations.create("integrationTest") {
        associateWith(kotlin.target.compilations.getByName("main"))
    }
}
```

</tab>
</tabs>

在这里，`integrationTest` 编译与 `main` 编译关联，这使得功能测试能够访问 `internal` 对象。

### 启用 Java 模块 (JPMS) 配置

要使 Kotlin Gradle 插件与 [Java 模块](https://www.oracle.com/corporate/features/understanding-java-9-modules.html)一起工作，请在你的构建脚本中添加以下行，并将 `YOUR_MODULE_NAME` 替换为你的 JPMS 模块的引用，例如 `org.company.module`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">
        
```kotlin
// 如果你使用 Gradle 版本低于 7.0，请添加以下三行
java {
    modularity.inferModulePath.set(true)
}

tasks.named("compileJava", JavaCompile::class.java) {
    options.compilerArgumentProviders.add(CommandLineArgumentProvider {
        // 向 javac 提供已编译的 Kotlin 类——Java/Kotlin 混合源文件工作所需
        listOf("--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}")
    })
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 如果你使用 Gradle 版本低于 7.0，请添加以下三行
java {
    modularity.inferModulePath = true
}

tasks.named("compileJava", JavaCompile.class) {
    options.compilerArgumentProviders.add(new CommandLineArgumentProvider() {
        @Override
        Iterable<String> asArguments() {
            // 向 javac 提供已编译的 Kotlin 类——Java/Kotlin 混合源文件工作所需
            return ["--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}"]
        }
    })
}
```

</tab>
</tabs>

> 像往常一样将 `module-info.java` 放入 `src/main/java` 目录中。
>
> 对于模块，Kotlin 文件中的包名应与 `module-info.java` 中的包名相同，以避免“包为空或不存在”的构建失败。
>
{style="note"}

了解更多关于：
* [为 Java 模块系统构建模块](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [使用 Java 模块系统构建应用程序](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* [Kotlin 中“模块”的含义](visibility-modifiers.md#modules)

### 其他细节

了解更多关于 [Kotlin/JVM](jvm-get-started.md)。

#### 禁用编译任务中构件的使用

在某些罕见情况下，你可能会遇到由循环依赖错误引起的构建失败。例如，当你有多个编译，其中一个编译可以看到另一个的所有内部声明，并且生成的构件依赖于两个编译任务的输出时：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

为了修复这个循环依赖错误，我们添加了一个 Gradle 属性：`archivesTaskOutputAsFriendModule`。
此属性控制编译任务中构件输入的使用，并决定是否因此创建任务依赖。

默认情况下，此属性设置为 `true` 以跟踪任务依赖。如果你遇到循环依赖错误，你可以禁用编译任务中构件的使用，以移除任务依赖并避免循环依赖错误。

要禁用编译任务中构件的使用，请将以下内容添加到你的 `gradle.properties` 文件中：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

#### 延迟 Kotlin/JVM 任务创建

从 Kotlin 1.8.20 开始，Kotlin Gradle 插件注册所有任务，并且在空运行时不配置它们。

#### 编译任务 destinationDirectory 的非默认位置

如果你覆盖了 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任务的 `destinationDirectory` 位置，请更新你的构建脚本。你需要显式地将 `sourceSets.main.kotlin.classesDirectories` 添加到 JAR 文件中的 `sourceSets.main.outputs`：

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## 面向多平台

面向 [多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)的项目，称为 [多平台项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)，需要 `kotlin-multiplatform` 插件。

> `kotlin-multiplatform` 插件适用于 Gradle %minGradleVersion% 或更高版本。
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

了解更多关于 [针对不同平台的 Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 和 [针对 iOS 和 Android 的 Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html)。

## 面向 Android

建议使用 Android Studio 创建 Android 应用程序。[了解如何使用 Android Gradle 插件](https://developer.android.com/studio/releases/gradle-plugin)。

## 面向 JavaScript

当面向 JavaScript 时，也使用 `kotlin-multiplatform` 插件。[了解更多关于设置 Kotlin/JS 项目](js-project-setup.md)。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

### 用于 JavaScript 的 Kotlin 和 Java 源文件

此插件仅适用于 Kotlin 文件，因此建议你将 Kotlin 和 Java 文件分开存放（如果项目包含 Java 文件）。如果你不将它们分开存放，请在 `sourceSets{}` 块中指定源文件夹：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("src/main/myKotlin")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</tab>
</tabs>

## 使用 KotlinBasePlugin 接口触发配置操作

要触发某些配置操作，每当应用任何 Kotlin Gradle 插件（JVM、JS、Multiplatform、Native 等）时，请使用所有 Kotlin 插件都继承的 `KotlinBasePlugin` 接口：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
    // 在此处配置你的操作
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
    // 在此处配置你的操作
}
```

</tab>
</tabs>

## 配置依赖

要添加对库的依赖，请在源集 DSL 的 `dependencies{}` 块中设置所需[类型](#dependency-types)的依赖项（例如，`implementation`）。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

或者，你可以在[顶层设置依赖](#set-dependencies-at-top-level)。

### 依赖类型

根据你的需求选择依赖类型。

<table>
    <tr>
        <th>类型</th>
        <th>描述</th>
        <th>何时使用</th>
    </tr>
    <tr>
        <td><code>api</code></td>
        <td>在编译和运行时都使用，并导出给库的消费者。</td>
        <td>如果依赖项中的任何类型在当前模块的公共 API 中使用，请使用 <code>api</code> 依赖项。
        </td>
    </tr>
    <tr>
        <td><code>implementation</code></td>
        <td>在编译和运行时用于当前模块，但不暴露给依赖于此 <code>implementation</code> 依赖项的模块的编译。</td>
        <td>
            <p>用于模块内部逻辑所需的依赖项。</p>
            <p>如果模块是未发布的终点应用程序，请使用 <code>implementation</code> 依赖项而非 <code>api</code> 依赖项。</p>
        </td>
    </tr>
    <tr>
        <td><code>compileOnly</code></td>
        <td>用于当前模块的编译，在运行时和编译其他模块时均不可用。</td>
        <td>用于在运行时有第三方实现可用的 API。</td>
    </tr>
    <tr>
        <td><code>runtimeOnly</code></td>
        <td>在运行时可用，但在任何模块编译时不可见。</td>
        <td></td>
    </tr>
</table>

### 标准库依赖

对标准库 (`stdlib`) 的依赖会自动添加到每个源集。使用的标准库版本与 Kotlin Gradle 插件的版本相同。

对于特定于平台的源集，会使用该库相应的平台特定变体，同时将一个通用标准库添加到其余部分。Kotlin Gradle 插件会根据你的 Gradle 构建脚本的 `compilerOptions.jvmTarget` [编译器选项](gradle-compiler-options.md)选择合适的 JVM 标准库。

如果你显式声明了标准库依赖（例如，如果你需要一个不同的版本），Kotlin Gradle 插件将不会覆盖它或添加第二个标准库。

如果你根本不需要标准库，你可以将以下 Gradle 属性添加到你的 `gradle.properties` 文件中：

```none
kotlin.stdlib.default.dependency=false
```

#### 传递性依赖的版本对齐

从 Kotlin 标准库 1.9.20 版本开始，Gradle 使用标准库中包含的元数据自动对齐传递性 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依赖。

如果你添加了 1.8.0 – 1.9.10 之间任何 Kotlin 标准库版本的依赖，例如：`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，那么 Kotlin Gradle 插件将使用此 Kotlin 版本用于传递性 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依赖。这避免了不同标准库版本造成的类重复。[了解更多关于将 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib`](whatsnew18.md#updated-jvm-compilation-target)。你可以使用 `gradle.properties` 文件中的 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 属性禁用此行为：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

##### 其他版本对齐方式 {initial-collapse-state="collapsed" collapsible="true"}

* 如果版本对齐存在问题，可以通过 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 对齐所有版本。在你的构建脚本中声明对 `kotlin-bom` 的平台依赖：

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  implementation(platform("org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%"))
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  implementation platform('org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%')
  ```

  </tab>
  </tabs>

* 如果你没有为标准库版本添加依赖，但有两个不同的依赖项传递性地引入了不同旧版本的 Kotlin 标准库，那么你可以显式要求这些传递性库的 `%kotlinVersion%` 版本：

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  </tabs>
  
* 如果你添加了 Kotlin 标准库版本 `%kotlinVersion%` 的依赖项：`implementation("org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%")`，并且使用了旧版本（早于 `1.8.0`）的 Kotlin Gradle 插件，请更新 Kotlin Gradle 插件以匹配标准库版本：

  
  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  plugins {
      // 将 `<...>` 替换为插件名称
      kotlin("<...>") version "%kotlinVersion%"
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  plugins {
      // 将 `<...>` 替换为插件名称
      id "org.jetbrains.kotlin.<...>" version "%kotlinVersion%"
  }
  ```

  </tab>
  </tabs>

* 如果你使用 `kotlin-stdlib-jdk7`/`kotlin-stdlib-jdk8` 的 1.8.0 之前的版本，例如 `implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:SOME_OLD_KOTLIN_VERSION")`，并且有一个传递性引入 `kotlin-stdlib:1.8+` 的依赖项，请[将你的 `kotlin-stdlib-jdk<7/8>:SOME_OLD_KOTLIN_VERSION` 替换为 `kotlin-stdlib-jdk*:%kotlinVersion%`](whatsnew18.md#updated-jvm-compilation-target) 或从引入它的库中[排除](https://docs.gradle.org/current/userguide/dependency_downgrade_and_exclude.html#sec:excluding-transitive-deps)传递性的 `kotlin-stdlib:1.8+`：

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude(group = "org.jetbrains.kotlin", module = "kotlin-stdlib")
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude group: "org.jetbrains.kotlin", module: "kotlin-stdlib"
      }
  }
  ```

  </tab>
  </tabs>

### 设置测试库依赖

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 可用于在所有支持的平台上测试 Kotlin 项目。
将 `kotlin-test` 依赖项添加到 `commonTest` 源集，以便 Gradle 插件可以推断每个测试源集相应的测试依赖项。

Kotlin/Native 目标不需要额外的测试依赖项，并且 `kotlin.test` API 实现是内置的。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
         commonTest.dependencies {
             implementation(kotlin("test")) // 这会自动引入所有平台依赖
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 这会自动引入所有平台依赖
            }
        }
    }
}
```

</tab>
</tabs>

> 你可以使用 Kotlin 模块依赖的简写形式，例如，`kotlin("test")` 代表 "org.jetbrains.kotlin:kotlin-test"。
>
{style="note"}

你也可以在任何共享或特定于平台的源集中使用 `kotlin-test` 依赖项。

#### kotlin-test 的 JVM 变体

对于 Kotlin/JVM，Gradle 默认使用 JUnit 4。因此，`kotlin("test")` 依赖项解析为 JUnit 4 的变体，即 `kotlin-test-junit`。

你可以在构建脚本的测试任务中通过调用 [`useJUnitPlatform()`]( https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform) 或 [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG) 来选择 JUnit 5 或 TestNG。
以下示例适用于 Kotlin Multiplatform 项目：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test"))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test")
            }
        }
    }
}
```

</tab>
</tabs>

以下示例适用于 JVM 项目：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    testImplementation(kotlin("test"))
}

tasks {
    test {
        useTestNG()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
}

test {
    useTestNG()
}
```

</tab>
</tabs>

[了解如何在 JVM 上使用 JUnit 测试代码](jvm-test-using-junit.md)。

自动 JVM 变体解析有时可能会导致你的配置出现问题。在这种情况下，你可以显式指定所需的框架，并通过将此行添加到项目的 `gradle.properties` 文件来禁用自动解析：

```text
kotlin.test.infer.jvm.variant=false
```

如果你在构建脚本中显式使用了 `kotlin("test")` 的变体，并且你的项目构建因兼容性冲突而停止工作，请参阅[兼容性指南中的此问题](compatibility-guide-15.md#do-not-mix-several-jvm-variants-of-kotlin-test-in-a-single-project)。

### 设置对 kotlinx 库的依赖

如果你使用多平台库并且需要依赖共享代码，只在共享源集中设置一次依赖。使用库的基本构件名称，例如 `kotlinx-coroutines-core` 或 `ktor-client-core`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

如果你需要一个 kotlinx 库用于特定于平台的依赖项，你仍然可以在相应的平台源集中使用库的基本构件名称：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

### 在顶层设置依赖

或者，你可以在顶层指定依赖项，使用以下模式作为配置名称：`<sourceSetName><DependencyType>`。这对于某些 Gradle 内置依赖项（如 `gradleApi()`、`localGroovy()` 或 `gradleTestKit()`）很有帮助，这些依赖项在源集的依赖 DSL 中不可用。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    "commonMainImplementation"("com.example:my-library:1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    commonMainImplementation 'com.example:my-library:1.0'
}
```

</tab>
</tabs>

## 声明仓库

你可以声明一个公开可用的仓库以使用其开源依赖项。在 `repositories{}` 块中，设置仓库的名称：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}
```

</tab>
</tabs>

流行的仓库有 [Maven Central](https://central.sonatype.com/) 和 [Google 的 Maven 仓库](https://maven.google.com/web/index.html)。

> 如果你也使用 Maven 项目，我们建议避免将 `mavenLocal()` 添加为仓库，因为你在 Gradle 和 Maven 项目之间切换时可能会遇到问题。如果你必须添加 `mavenLocal()` 仓库，请将其作为 `repositories{}` 块中的最后一个仓库添加。欲了解更多信息，请参阅 [The case for mavenLocal()](https://docs.gradle.org/current/userguide/declaring_repositories.html#sec:case-for-maven-local)。
>
{style="warning"}

如果你需要在多个子项目中声明相同的仓库，请在你的 `settings.gradle(.kts)` 文件中的 `dependencyResolutionManagement{}` 块中集中声明仓库：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```

</tab>
</tabs>

子项目中声明的任何仓库都会覆盖集中声明的仓库。有关如何控制此行为以及可用选项的更多信息，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/declaring_repositories.html#sub:centralized-repository-declaration)。

## 接下来是什么？

了解更多关于：
* [编译器选项及其传递方式](gradle-compiler-options.md)。
* [增量编译、缓存支持、构建报告和 Kotlin 守护进程](gradle-compilation-and-caches.md)。
* [Gradle 基础知识和细节](https://docs.gradle.org/current/userguide/userguide.html)。
* [Gradle 插件变体支持](gradle-plugin-variants.md)。