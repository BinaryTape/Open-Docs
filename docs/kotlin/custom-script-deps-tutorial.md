[//]: # (title: Kotlin 自定义脚本入门 – 教程)

> Kotlin 自定义脚本是 [实验性](components-stability.md) 功能。它可能随时被移除或更改。
> 请仅将其用于评估目的。我们感谢您在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

_Kotlin 脚本_是一种技术，它允许将 Kotlin 代码作为脚本执行，无需事先编译或打包成可执行文件。

有关 Kotlin 脚本的概述及示例，请观看 Rodrigo Oliveira 在 KotlinConf'19 上的演讲 [实现 Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)。

在本教程中，您将创建一个 Kotlin 脚本项目，该项目使用 Maven 依赖项执行任意 Kotlin 代码。您将能够执行如下脚本：

```kotlin
@file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
@file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")

import kotlinx.html.*
import kotlinx.html.stream.*
import kotlinx.html.attributes.*

val addressee = "World"

print(
    createHTML().html {
        body {
            h1 { +"Hello, $addressee!" }
        }
    }
)
```

指定 Maven 依赖项（本例中为 `kotlinx-html-jvm`）将在执行期间从指定的 Maven 仓库或本地缓存中解析，并用于脚本的其余部分。

## 项目结构

一个最小的 Kotlin 自定义脚本项目包含两个部分：

*   _脚本定义_ – 一组参数和配置，定义了此脚本类型应如何被识别、处理、编译和执行。
*   _脚本宿主_ – 一个应用程序或组件，负责处理脚本编译和执行 – 实际运行此类型的脚本。

考虑到所有这些，最好将项目拆分为两个模块。

## 开始之前

下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 创建项目

1.  在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
2.  在左侧面板中，选择 **New Project**。
3.  命名新项目，并在必要时更改其位置。

    > 勾选 **Create Git repository** 复选框可将新项目置于版本控制之下。您稍后随时都可以进行此操作。
    >
    {style="tip"}

4.  从 **Language** 列表中，选择 **Kotlin**。
5.  选择 **Gradle** 构建系统。
6.  从 **JDK** 列表中，选择您想在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
    *   如果 JDK 已安装在您的计算机上，但未在 IDE 中定义，请选择 **Add JDK** 并指定 JDK 主目录的路径。
    *   如果您的计算机上没有所需的 JDK，请选择 **Download JDK**。
7.  为 **Gradle DSL** 选择 Kotlin 或 Gradle 语言。
8.  单击 **Create**。

![Create a root project for custom Kotlin scripting](script-deps-create-root-project.png){width=700}

## 添加脚本模块

现在您有一个空的 Kotlin/JVM Gradle 项目。添加所需的模块：脚本定义和脚本宿主：

1.  在 IntelliJ IDEA 中，选择 **File | New | Module**。
2.  在左侧面板中，选择 **New Module**。此模块将作为脚本定义。
3.  命名新模块，并在必要时更改其位置。
4.  从 **Language** 列表中，选择 **Java**。
5.  如果您想用 Kotlin 编写构建脚本，请选择 **Gradle** 构建系统和 Kotlin 作为 **Gradle DSL**。
6.  选择根模块作为模块的父级。
7.  单击 **Create**。

    ![Create script definition module](script-deps-module-definition.png){width=700}

8.  在模块的 `build.gradle(.kts)` 文件中，删除 Kotlin Gradle 插件的 `version`。它已存在于根项目的构建脚本中。

9.  再次重复上述步骤，为脚本宿主创建一个模块。

项目应具有以下结构：

![Custom scripting project structure](script-deps-project-structure.png){width=300}

您可以在 [kotlin-script-examples GitHub 仓库](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps) 中找到此类项目和更多 Kotlin 脚本示例。

## 创建脚本定义

首先，定义脚本类型：开发人员可以在此类型的脚本中编写什么以及如何处理。在本教程中，这包括在脚本中支持 `@Repository` 和 `@DependsOn` 注解。

1.  在脚本定义模块中，在 `build.gradle(.kts)` 文件的 `dependencies` 块中添加对 Kotlin 脚本组件的依赖项。这些依赖项提供了脚本定义所需的 API：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-scripting-common")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
        implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
        implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
        // coroutines dependency is required for this particular definition
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
        // coroutines dependency is required for this particular definition
        implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'

    }
    ```

    </tab>
    </tabs>

2.  在模块中创建 `src/main/kotlin/` 目录，并添加一个 Kotlin 源文件，例如 `scriptDef.kt`。

3.  在 `scriptDef.kt` 中创建一个类。它将作为此类型脚本的超类，因此请将其声明为 `abstract` 或 `open`。

    ```kotlin
    // abstract (or open) superclass for scripts of this type
    abstract class ScriptWithMavenDeps
    ```

    此类别稍后也将作为脚本定义的参考。

4.  要使该类成为脚本定义，请用 `@KotlinScript` 注解标记它。向该注解传递两个参数：
    *   `fileExtension` – 一个以 `.kts` 结尾的字符串，用于定义此脚本类型的文件扩展名。
    *   `compilationConfiguration` – 一个 Kotlin 类，它扩展了 `ScriptCompilationConfiguration` 并定义了此脚本定义的编译细节。您将在下一步中创建它。

    ```kotlin
    // @KotlinScript annotation marks a script definition class
    @KotlinScript(
        // File extension for the script type
        fileExtension = "scriptwithdeps.kts",
        // Compilation configuration for the script type
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
    ```

    > 在本教程中，我们只提供可运行的代码，不解释 Kotlin 脚本 API。
    > 您可以在 [GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) 上找到带有详细解释的相同代码。
    >
    {style="note"}

5.  如下所示定义脚本编译配置。

    ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            // Implicit imports for all scripts of this type
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                // Extract the whole classpath from context classloader and use it as dependencies
                dependenciesFromCurrentContext(wholeClasspath = true)
            }
            // Callbacks
            refineConfiguration {
                // Process specified annotations with the provided handler
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
    ```

    `configureMavenDepsOnAnnotations` 函数如下：

    ```kotlin
    // Handler that reconfigures the compilation on the fly
    fun configureMavenDepsOnAnnotations(context: ScriptConfigurationRefinementContext): ResultWithDiagnostics<ScriptCompilationConfiguration> {
        val annotations = context.collectedData?.get(ScriptCollectedData.collectedAnnotations)?.takeIf { it.isNotEmpty() }
            ?: return context.compilationConfiguration.asSuccess()
        return runBlocking {
            resolver.resolveFromScriptSourceAnnotations(annotations)
        }.onSuccess {
            context.compilationConfiguration.with {
                dependencies.append(JvmDependency(it))
            }.asSuccess()
        }
    }

    private val resolver = CompoundDependenciesResolver(FileSystemDependenciesResolver(), MavenDependenciesResolver())
    ```

    您可以在 [这里](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) 找到完整的代码。

## 创建脚本宿主

下一步是创建脚本宿主——负责处理脚本执行的组件。

1.  在脚本宿主模块中，在 `build.gradle(.kts)` 文件的 `dependencies` 块中添加依赖项：
    *   提供脚本宿主所需 API 的 Kotlin 脚本组件
    *   您之前创建的脚本定义模块

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-scripting-common")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
        implementation(project(":script-definition")) // the script definition module
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
        implementation project(':script-definition') // the script definition module
    }
    ```

    </tab>
    </tabs>

2.  在模块中创建 `src/main/kotlin/` 目录，并添加一个 Kotlin 源文件，例如 `host.kt`。

3.  定义应用程序的 `main` 函数。在其主体中，检查它是否有一个参数——脚本文件的路径——并执行脚本。您将在下一步中在单独的函数 `evalFile` 中定义脚本执行。现在将其声明为空。

    `main` 函数可以如下所示：

    ```kotlin
    fun main(vararg args: String) {
        if (args.size != 1) {
            println("usage: <app> <script file>")
        } else {
            val scriptFile = File(args[0])
            println("Executing script $scriptFile")
            evalFile(scriptFile)
        }
    }
    ```

4.  定义脚本评估函数。这里您将使用脚本定义。通过将脚本定义类作为类型参数调用 `createJvmCompilationConfigurationFromTemplate` 来获取它。然后调用 `BasicJvmScriptingHost().eval`，将脚本代码及其编译配置传递给它。 `eval` 返回 `ResultWithDiagnostics` 的实例，因此将其设置为您函数的返回类型。

    ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
    ```

5.  调整 `main` 函数以打印有关脚本执行的信息：

    ```kotlin
    fun main(vararg args: String) {
        if (args.size != 1) {
            println("usage: <app> <script file>")
        } else {
            val scriptFile = File(args[0])
            println("Executing script $scriptFile")
            val res = evalFile(scriptFile)
            res.reports.forEach {
                if (it.severity > ScriptDiagnostic.Severity.DEBUG) {
                    println(" : ${it.message}" + if (it.exception == null) "" else ": ${it.exception}")
                }
            }
        }
    }
    ```

您可以在 [这里](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt) 找到完整的代码。

## 运行脚本

为了检查您的脚本宿主如何工作，请准备一个要执行的脚本和一个运行配置。

1.  在项目根目录中创建文件 `html.scriptwithdeps.kts`，其内容如下：

    ```kotlin
    @file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
    @file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")

    import kotlinx.html.*; import kotlinx.html.stream.*; import kotlinx.html.attributes.*

    val addressee = "World"

    print(
        createHTML().html {
            body {
                h1 { +"Hello, $addressee!" }
            }
        }
    )
    ```

    它使用了 `kotlinx-html-jvm` 库中的函数，该库在 `@DependsOn` 注解参数中被引用。

2.  创建一个运行配置，用于启动脚本宿主并执行此文件：
    1.  打开 `host.kt` 并导航到 `main` 函数。它在左侧有一个 **Run** 槽口图标。
    2.  右键单击槽口图标，然后选择 **Modify Run Configuration**。
    3.  在 **Create Run Configuration** 对话框中，将脚本文件名添加到 **Program arguments** 并单击 **OK**。

    ![Scripting host run configuration](script-deps-run-config.png){width=800}

3.  运行创建的配置。

您将看到脚本是如何执行的，它会解析指定仓库中对 `kotlinx-html-jvm` 的依赖项，并打印调用其函数的结果：

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

首次运行时解析依赖项可能需要一些时间。随后的运行将快得多，因为它们使用了本地 Maven 仓库中已下载的依赖项。

## 接下来是什么？

创建了一个简单的 Kotlin 脚本项目后，请查找有关此主题的更多信息：
*   阅读 [Kotlin 脚本 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)
*   浏览更多 [Kotlin 脚本示例](https://github.com/Kotlin/kotlin-script-examples)
*   观看 Rodrigo Oliveira 的演讲 [实现 Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)