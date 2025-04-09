---
title: "Kotlin 自定义脚本入门教程"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::caution
Kotlin 自定义脚本是 [实验性功能](components-stability)。它可能随时被删除或更改。
仅用于评估目的。欢迎您在 [YouTrack](https://kotl.in/issue) 上提供反馈。

:::

_Kotlin 脚本_ 是一种技术，它允许将 Kotlin 代码作为脚本执行，而无需事先编译或打包成可执行文件。

有关带有示例的 Kotlin 脚本的概述，请查看 KotlinConf'19 上 Rodrigo Oliveira 的演讲 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)。

在本教程中，您将创建一个 Kotlin 脚本项目，该项目执行带有 Maven 依赖项的任意 Kotlin 代码。
您将能够执行如下的脚本：

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

指定的 Maven 依赖项（本例中为 `kotlinx-html-jvm`）将在执行期间从指定的 Maven 仓库或本地缓存中解析，并用于脚本的其余部分。

## 项目结构

一个最小的 Kotlin 自定义脚本项目包含两个部分：

* _脚本定义_ – 一组参数和配置，用于定义应如何识别、处理、编译和执行此脚本类型。
* _脚本宿主（Scripting host）_ – 一个应用程序或组件，用于处理脚本编译和执行——实际运行此类型的脚本。

考虑到所有这些，最好将项目拆分为两个模块。

## 开始之前

下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 创建一个项目

1. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
2. 在左侧的面板中，选择 **New Project**。
3. 命名新项目，并在必要时更改其位置。

   > 选中 **Create Git repository** 复选框，将新项目置于版本控制之下。 您可以随时在以后执行此操作。
   >
   

4. 从 **Language** 列表中，选择 **Kotlin**。
5. 选择 **Gradle** 构建系统。
6. 从 **JDK** 列表中，选择要在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
   * 如果 JDK 已安装在您的计算机上，但未在 IDE 中定义，请选择 **Add JDK** 并指定 JDK 主目录的路径。
   * 如果您的计算机上没有必要的 JDK，请选择 **Download JDK**。

7. 为 **Gradle DSL** 选择 Kotlin 或 Gradle 语言。
8. 点击 **Create**。

<img src="/img/script-deps-create-root-project.png" alt="Create a root project for custom Kotlin scripting" width="700" style={{verticalAlign: 'middle'}}/>

## 添加脚本模块

现在您有了一个空的 Kotlin/JVM Gradle 项目。 添加所需的模块，脚本定义和脚本宿主（Scripting host）：

1. 在 IntelliJ IDEA 中，选择 **File | New | Module**。
2. 在左侧的面板中，选择 **New Module**。 此模块将是脚本定义。
3. 命名新模块，并在必要时更改其位置。
4. 从 **Language** 列表中，选择 **Java**。
5. 如果要用 Kotlin 编写构建脚本，请选择 **Gradle** 构建系统和 Kotlin 作为 **Gradle DSL**。
6. 作为模块的父级，选择根模块。
7. 点击 **Create**。

   <img src="/img/script-deps-module-definition.png" alt="Create script definition module" width="700" style={{verticalAlign: 'middle'}}/>

8. 在模块的 `build.gradle(.kts)` 文件中，删除 Kotlin Gradle 插件的 `version`。 它已经在根项目的构建脚本中。

9. 再次重复之前的步骤，为脚本宿主（Scripting host）创建一个模块。

项目应具有以下结构：

<img src="/img/script-deps-project-structure.png" alt="Custom scripting project structure" width="300" style={{verticalAlign: 'middle'}}/>

您可以在 [kotlin-script-examples GitHub repository](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps) 中找到此类项目的示例以及更多 Kotlin 脚本示例。

## 创建一个脚本定义

首先，定义脚本类型：开发人员可以在这种类型的脚本中编写什么以及如何处理它。
在本教程中，这包括支持脚本中的 `@Repository` 和 `@DependsOn` 注解。

1. 在脚本定义模块中，在 `build.gradle(.kts)` 的 `dependencies` 块中添加对 Kotlin 脚本组件的依赖项。
   这些依赖项提供了您将需要的用于脚本定义的 API：

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
       // coroutines dependency is required for this particular definition
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1") 
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
       // coroutines dependency is required for this particular definition
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'

   }
   ```

   </TabItem>
   </Tabs>

2. 在模块中创建 `src/main/kotlin/` 目录，并添加一个 Kotlin 源文件，例如 `scriptDef.kt`。

3. 在 `scriptDef.kt` 中，创建一个类。 它将是这种类型脚本的超类，因此将其声明为 `abstract` 或 `open`。

    ```kotlin
    // abstract (or open) superclass for scripts of this type
    abstract class ScriptWithMavenDeps
    ```

   此类稍后也将用作对脚本定义的引用。

4. 要使该类成为脚本定义，请使用 `@KotlinScript` 注解标记它。 将两个参数传递给注解：
   * `fileExtension` – 以 `.kts` 结尾的字符串，用于定义此类型脚本的文件扩展名。
   * `compilationConfiguration` – 一个 Kotlin 类，它扩展了 `ScriptCompilationConfiguration` 并定义了此脚本定义的编译细节。 您将在下一步中创建它。

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
   
   > 在本教程中，我们仅提供可用的代码，而没有解释 Kotlin 脚本 API。
   > 您可以在 [GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) 上找到带有详细说明的相同代码。
   > 
   

5. 如下所示定义脚本编译配置。

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

   您可以在 [此处](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) 找到完整的代码。

## 创建一个脚本宿主（Scripting host）

下一步是创建脚本宿主（Scripting host）– 处理脚本执行的组件。

1. 在脚本宿主（Scripting host）模块中，在 `build.gradle(.kts)` 的 `dependencies` 块中添加依赖项：
   * Kotlin 脚本组件，提供脚本宿主（Scripting host）所需的 API
   * 您先前创建的脚本定义模块

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
       implementation(project(":script-definition")) // the script definition module
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
       implementation project(':script-definition') // the script definition module
   }
   ```

   </TabItem>
   </Tabs>

2. 在模块中创建 `src/main/kotlin/` 目录，并添加一个 Kotlin 源文件，例如 `host.kt`。

3. 为应用程序定义 `main` 函数。 在其主体中，检查它是否具有一个参数 – 脚本文件的路径 – 并执行该脚本。 您将在下一步的单独函数 `evalFile` 中定义脚本执行。
   现在将其声明为空。

   `main` 可以如下所示：

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

4. 定义脚本评估函数。 在这里您将使用脚本定义。 通过使用脚本定义类作为类型参数调用 `createJvmCompilationConfigurationFromTemplate` 来获取它。 然后调用 `BasicJvmScriptingHost().eval`，并将脚本代码及其编译配置传递给它。 `eval` 返回 `ResultWithDiagnostics` 的实例，因此将其设置为函数的返回类型。

   ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
   ```

5. 调整 `main` 函数以打印有关脚本执行的信息：

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

您可以在 [此处](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt) 找到完整的代码

## 运行脚本

要检查脚本宿主（Scripting host）的工作方式，请准备一个要执行的脚本和一个运行配置。

1. 在项目根目录中创建文件 `html.scriptwithdeps.kts`，其内容如下：

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
   
   它使用 `kotlinx-html-jvm` 库中的函数，该库在 `@DependsOn` 注解参数中引用。

2. 创建一个运行配置，该配置启动脚本宿主（Scripting host）并执行此文件：
   1. 打开 `host.kt` 并导航到 `main` 函数。 它在左侧有一个 **Run** 间距图标。
   2. 右键单击间距图标，然后选择 **Modify Run Configuration**。
   3. 在 **Create Run Configuration** 对话框中，将脚本文件名添加到 **Program arguments**，然后单击 **OK**。
   
      <img src="/img/script-deps-run-config.png" alt="Scripting host run configuration" width="800" style={{verticalAlign: 'middle'}}/>

3. 运行创建的配置。

您将看到脚本是如何执行的，从而解析指定仓库中对 `kotlinx-html-jvm` 的依赖关系并打印调用其函数的结果：

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

在首次运行时，解析依赖关系可能需要一些时间。 后续运行将更快地完成，因为它们使用从本地 Maven 仓库下载的依赖关系。

## 接下来是什么？

创建了一个简单的 Kotlin 脚本项目后，请查找有关此主题的更多信息：
* 阅读 [Kotlin scripting KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)
* 浏览更多 [Kotlin 脚本示例](https://github.com/Kotlin/kotlin-script-examples)
* 观看 Rodrigo Oliveira 的演讲 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)