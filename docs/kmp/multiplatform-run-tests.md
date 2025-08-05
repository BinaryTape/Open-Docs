[//]: # (title: 测试你的多平台应用 – 教程)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中按照操作步骤进行——这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
</tldr>

在本教程中，你将学习如何在 Kotlin Multiplatform 应用程序中创建、配置和运行测试。

多平台项目的测试可以分为两类：

*   公共代码的测试。这些测试可以使用任何受支持的框架在任何平台上运行。
*   平台特有的代码的测试。这些对于测试平台特有的逻辑至关重要。它们使用平台特有的框架，并能受益于其附加特性，例如更丰富的 API 和更广泛的断言范围。

这两类都在多平台项目中受支持。本教程将首先展示如何在一个简单的 Kotlin Multiplatform 项目中为公共代码设置、创建和运行单元测试。然后，你将处理一个更复杂的示例，它需要对公共和平台特有的代码进行测试。

> 本教程假设你熟悉：
> *   Kotlin Multiplatform 项目的布局。如果不是，请在开始前完成[此教程](multiplatform-create-first-app.md)。
> *   流行的单元测试框架（例如 [JUnit](https://junit.org/junit5/)）的基础知识。
>
{style="tip"}

## 测试一个简单的多平台项目

### 创建一个项目

1.  在[快速入门](quickstart.md)中，完成[设置 Kotlin Multiplatform 开发环境](quickstart.md#set-up-the-environment)的说明。
2.  在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
3.  在左侧面板中，选择 **Kotlin Multiplatform**。
4.  在 **New Project** 窗口中指定以下字段：

    *   **Name**：KotlinProject
    *   **Group**：kmp.project.demo
    *   **Artifact**：kotlinproject
    *   **JDK**：Amazon Corretto version 17
        > 此 JDK 版本是确保你稍后添加的某个测试能够成功运行所必需的。
        >
        {style="note"}

5.  选择 **Android** 目标。
    *   如果你使用的是 Mac，也选择 **iOS**。确保选中了 **Do not share UI** 选项。
6.  取消选择 **Include tests** 并点击 **Create**。

   ![Create simple multiplatform project](create-test-multiplatform-project.png){width=800}

### 编写代码

在 `shared/src/commonMain/kotlin` 目录下，创建一个新的 `common.example.search` 目录。
在该目录中，创建一个 Kotlin 文件 `Grep.kt`，其中包含以下函数：

```kotlin
fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
    val regex = pattern.toRegex()
    lines.filter(regex::containsMatchIn)
        .forEach(action)
}
```

此函数旨在模拟 [UNIX `grep` 命令](https://en.wikipedia.org/wiki/Grep)。此处，该函数接受文本行、用作正则表达式的模式，以及一个每当某行匹配该模式时都会调用的函数。

### 添加测试

现在，让我们来测试公共代码。一个重要的部分将是用于公共测试的源代码集，它将 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 库作为依赖项。

1.  在 `shared/build.gradle.kts` 文件中，检测是否存在对 `kotlin.test` 库的依赖项：

    ```kotlin
   sourceSets {
       //...
       commonTest.dependencies {
           implementation(libs.kotlin.test)
       }
   }
   ```

2.  `commonTest` 源代码集存储所有公共测试。你需要创建一个与项目同名的目录：

    1.  右键点击 `shared/src` 目录，然后选择 **New | Directory**。IDE 会显示一个选项列表。
    2.  开始键入 `commonTest/kotlin` 路径以缩小选择范围，然后从列表中选择它：

      ![Creating common test directory](create-common-test-dir.png){width=350}

3.  在 `commonTest/kotlin` 目录中，创建一个新的 `common.example.search` 包。
4.  在该包中，创建 `Grep.kt` 文件并使用以下单元测试更新它：

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class GrepTest {
        companion object {
            val sampleData = listOf(
                "123 abc",
                "abc 123",
                "123 ABC",
                "ABC 123"
            )
        }
    
        @Test
        fun shouldFindMatches() {
            val results = mutableListOf<String>()
            grep(sampleData, "[a-z]+") {
                results.add(it)
            }
    
            assertEquals(2, results.size)
            for (result in results) {
                assertContains(result, "abc")
            }
        }
    }
    ```

如你所见，导入的注解和断言既不是平台特有的，也不是框架特有的。当你稍后运行此测试时，一个平台特有的框架将提供测试运行器。

#### 探查 `kotlin.test` API {initial-collapse-state="collapsed" collapsible="true"}

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 库提供了平台无关的注解和断言供你在测试中使用。像 `Test` 这样的注解，会映射到所选框架提供的注解或其最接近的等效项。

断言通过 [`Asserter` 接口](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)的一个实现来执行。此接口定义了测试中通常执行的不同检测。该 API 有一个默认实现，但通常你会使用框架特有的实现。

例如，JUnit 4、JUnit 5 和 TestNG 框架都在 JVM 上受支持。在 Android 上，对 `assertEquals()` 的调用可能会导致对 `asserter.assertEquals()` 的调用，其中 `asserter` 对象是 `JUnit4Asserter` 的实例。在 iOS 上，`Asserter` 类型的默认实现与 Kotlin/Native 测试运行器结合使用。

### 运行测试

你可以通过以下方式执行测试：

*   使用 gutter 中的 **Run** 图标运行 `shouldFindMatches()` 测试函数。
*   使用上下文菜单运行测试文件。
*   使用 gutter 中的 **Run** 图标运行 `GrepTest` 测试类。

还有一个便捷的 <shortcut>⌃ ⇧ F10</shortcut>/<shortcut>Ctrl+Shift+F10</shortcut> 快捷键。无论你选择哪种选项，都会看到一个用于运行测试的目标列表：

![Run test task](run-test-tasks.png){width=300}

对于 `android` 选项，测试使用 JUnit 4 运行。对于 `iosSimulatorArm64`，Kotlin 编译器会检测测试注解并创建一个由 Kotlin/Native 自己的测试运行器执行的_测试二进制文件_。

以下是成功测试运行生成的输出示例：

![Test output](run-test-results.png){width=700}

## 使用更复杂的项目

### 编写公共代码的测试

你已经为 `grep()` 函数创建了一个公共代码测试。现在，让我们考虑一个更高级的公共代码测试，使用 `CurrentRuntime` 类。此类包含代码执行所在平台的详细信息。例如，对于在本地 JVM 上运行的 Android 单元测试，它可能包含“OpenJDK”和“17.0”的值。

`CurrentRuntime` 的实例应使用平台名称和版本（字符串形式）创建，其中版本是可选的。当版本存在时，如果字符串开头有数字，你只需要该数字。

1.  在 `commonMain/kotlin` 目录中，创建一个新的 `org.kmp.testing` 目录。
2.  在该目录中，创建 `CurrentRuntime.kt` 文件并使用以下实现更新它：

    ```kotlin
    class CurrentRuntime(val name: String, rawVersion: String?) {
        companion object {
            val versionRegex = Regex("^[0-9]+(\\.[0-9]+)?")
        }
    
        val version = parseVersion(rawVersion)
    
        override fun toString() = "$name version $version"
    
        private fun parseVersion(rawVersion: String?): String {
            val result = rawVersion?.let { versionRegex.find(it) }
            return result?.value ?: "unknown"
        }
    }
    ```

3.  在 `commonTest/kotlin` 目录中，创建一个新的 `org.kmp.testing` 包。
4.  在该包中，创建 `CurrentRuntimeTest.kt` 文件并使用以下平台和框架无关的测试更新它：

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertEquals
    
    class CurrentRuntimeTest {
        @Test
        fun shouldDisplayDetails() {
            val runtime = CurrentRuntime("MyRuntime", "1.1")
            assertEquals("MyRuntime version 1.1", runtime.toString())
        }
    
        @Test
        fun shouldHandleNullVersion() {
            val runtime = CurrentRuntime("MyRuntime", null)
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    
        @Test
        fun shouldParseNumberFromVersionString() {
            val runtime = CurrentRuntime("MyRuntime", "1.2 Alpha Experimental")
            assertEquals("MyRuntime version 1.2", runtime.toString())
        }
    
        @Test
        fun shouldHandleMissingVersion() {
            val runtime = CurrentRuntime("MyRuntime", "Alpha Experimental")
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    }
    ```

你可以使用[IDE 中可用的](#run-tests)任何方式运行此测试。

### 添加平台特有的测试

> 这里，[expected 和 actual 声明机制](multiplatform-connect-to-apis.md)用于简洁和简单性。在更复杂的代码中，更好的方法是使用接口和工厂函数。
>
{style="note"}

现在你有了编写公共代码测试的经验，让我们探查为 Android 和 iOS 编写平台特有的测试。

要创建 `CurrentRuntime` 的实例，请在公共 `CurrentRuntime.kt` 文件中声明一个函数，如下所示：

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

该函数应为每个受支持的平台提供单独的实现。否则，构建将失败。除了在每个平台上实现此函数外，你还应该提供测试。让我们为 Android 和 iOS 创建它们。

#### 对于 Android

1.  在 `androidMain/kotlin` 目录中，创建一个新的 `org.kmp.testing` 包。
2.  在该包中，创建 `AndroidRuntime.kt` 文件并使用预期的 `determineCurrentRuntime()` 函数的实际实现更新它：

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3.  在 `shared/src` 目录内部创建一个测试目录：
 
   1.  右键点击 `shared/src` 目录，然后选择 **New | Directory**。IDE 会显示一个选项列表。
   2.  开始键入 `androidUnitTest/kotlin` 路径以缩小选择范围，然后从列表中选择它：

   ![Creating Android test directory](create-android-test-dir.png){width=350}

4.  在 `kotlin` 目录中，创建一个新的 `org.kmp.testing` 包。
5.  在该包中，创建 `AndroidRuntimeTest.kt` 文件并使用以下 Android 测试更新它：

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class AndroidRuntimeTest {
        @Test
        fun shouldDetectAndroid() {
            val runtime = determineCurrentRuntime()
            assertContains(runtime.name, "OpenJDK")
            assertEquals(runtime.version, "17.0")
        }
    }
    ```
   
   > 如果你在教程开头选择了不同的 JDK 版本，你可能需要更改 `name` 和 `version` 以使测试成功运行。
   > 
   {style="note"}

Android 特有的测试在本地 JVM 上运行可能看起来很奇怪。这是因为这些测试作为本地单元测试在当前机器上运行。正如 [Android Studio 文档](https://developer.android.com/studio/test/test-in-android-studio)中描述的，这些测试与在设备或模拟器上运行的插桩测试不同。

你可以向项目添加其他类型的测试。要了解插桩测试，请参阅此 [Touchlab 指南](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)。

#### 对于 iOS

1.  在 `iosMain/kotlin` 目录中，创建一个新的 `org.kmp.testing` 目录。
2.  在该目录中，创建 `IOSRuntime.kt` 文件并使用预期的 `determineCurrentRuntime()` 函数的实际实现更新它：

    ```kotlin
    import kotlin.experimental.ExperimentalNativeApi
    import kotlin.native.Platform
    
    @OptIn(ExperimentalNativeApi::class)
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3.  在 `shared/src` 目录中创建一个新目录：
   
   1.  右键点击 `shared/src` 目录，然后选择 **New | Directory**。IDE 会显示一个选项列表。
   2.  开始键入 `iosTest/kotlin` 路径以缩小选择范围，然后从列表中选择它：

   ![Creating iOS test directory](create-ios-test-dir.png){width=350}

4.  在 `iosTest/kotlin` 目录中，创建一个新的 `org.kmp.testing` 目录。
5.  在该目录中，创建 `IOSRuntimeTest.kt` 文件并使用以下 iOS 测试更新它：

    ```kotlin 
    import kotlin.test.Test
    import kotlin.test.assertEquals
    
    class IOSRuntimeTest {
        @Test
        fun shouldDetectOS() {
            val runtime = determineCurrentRuntime()
            assertEquals(runtime.name, "ios")
            assertEquals(runtime.version, "unknown")
        }
    }
    ```

### 运行多个测试并分析报告

在此阶段，你拥有公共、Android 和 iOS 实现的代码及其测试。
你的项目目录结构应类似于：

![Whole project structure](code-and-test-structure.png){width=300}

你可以从上下文菜单运行单个测试或使用快捷键。另一个选项是使用 Gradle 任务。例如，如果你运行 `allTests` Gradle 任务，项目中的每个测试都将使用相应的测试运行器运行：

![Gradle test tasks](gradle-alltests.png){width=700}

当你运行测试时，除了 IDE 中的输出外，还会生成 HTML 报告。你可以在 `shared/build/reports/tests` 目录中找到它们：

![HTML reports for multiplatform tests](shared-tests-folder-reports.png){width=300}

运行 `allTests` 任务并检查它生成的报告：

*   `allTests/index.html` 文件包含公共测试和 iOS 测试的合并报告
    （iOS 测试依赖于公共测试并在其之后运行）。
*   `testDebugUnitTest` 和 `testReleaseUnitTest` 文件夹包含两个默认 Android 构建变体的报告。
    （目前，Android 测试报告不会自动与 `allTests` 报告合并。）

![HTML report for multiplatform tests](multiplatform-test-report.png){width=700}

## 在多平台项目中使用测试的规则

你现在已经创建、配置并在 Kotlin Multiplatform 应用程序中执行了测试。
在你未来的项目中处理测试时，请记住：

*   编写公共代码的测试时，只使用多平台库，如 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/)。将依赖项添加到 `commonTest` 源代码集。
*   `kotlin.test` API 中的 `Asserter` 类型应仅间接使用。
    尽管 `Asserter` 实例可见，但你无需在测试中直接使用它。
*   始终保持在测试库 API 的范围内。幸运的是，
    编译器和 IDE 会阻止你使用框架特有的功能。
*   尽管在 `commonTest` 中使用哪个框架运行测试并不重要，但最好使用你打算使用的每个框架运行测试，以检测你的开发环境是否设置正确。
*   考虑物理差异。例如，滚动惯性和摩擦值因平台和设备而异，
    因此设置相同的滚动速度可能会导致不同的滚动位置。请务必在目标平台上测试你的组件，以确保预期行为。
*   编写平台特有的代码测试时，你可以使用相应框架的功能，例如注解和扩展。
*   你可以在 IDE 中和使用 Gradle 任务来运行测试。
*   当你运行测试时，HTML 测试报告会自动生成。

## 下一步是什么？

*   在[理解多平台项目结构](multiplatform-discover-project.md)中探查多平台项目的布局。
*   查看 [Kotest](https://kotest.io/)，这是 Kotlin 生态系统提供的另一个多平台测试框架。
    Kotest 允许以多种样式编写测试，并支持常规测试的补充方法。
    这包括[数据驱动测试](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)
    和[基于属性的测试](https://kotest.io/docs/proptest/property-based-testing.html)。