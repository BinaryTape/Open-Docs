[//]: # (title: 测试您的多平台应用 – 教程)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教程 – 两个 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
</tldr>

在本教程中，您将学习如何在 Kotlin Multiplatform 应用程序中创建、配置和运行测试。

多平台项目的测试可以分为两类：

*   公共代码的测试。这些测试可以使用任何支持的框架在任何平台上运行。
*   平台特有的代码的测试。这些测试对于测试平台特有逻辑至关重要。它们使用平台特有的框架，并可以受益于其额外的特性，例如更丰富的 API 和更广泛的断言范围。

这两类都在多平台项目中受支持。本教程将首先向您展示如何在简单的 Kotlin Multiplatform 项目中设置、创建和运行公共代码的单元测试。然后，您将使用一个更复杂的示例，它需要同时测试公共代码和平台特有的代码。

> 本教程假设您熟悉：
> *   Kotlin Multiplatform 项目的布局。如果不是，请在开始前完成[此教程](multiplatform-create-first-app.md)。
> *   流行的单元测试框架（例如 [JUnit](https://junit.org/junit5/)）的基础知识。
>
{style="tip"}

## 测试一个简单的多平台项目

### 创建项目

1.  在[快速入门](quickstart.md)中，完成[设置 Kotlin Multiplatform 开发环境](quickstart.md#set-up-the-environment)的说明。
2.  在 IntelliJ IDEA 中，选择 **文件** | **新建** | **项目**。
3.  在左侧面板中，选择 **Kotlin Multiplatform**。
4.  在 **新建项目** 窗口中指定以下字段：

    *   **Name**: KotlinProject
    *   **Group**: kmp.project.demo
    *   **Artifact**: kotlinproject
    *   **JDK**: Amazon Corretto version 17
        > 此 JDK 版本是后续您添加的测试成功运行所必需的。
        >
        {style="note"}

5.  选择 **Android** 目标。
    *   如果您使用的是 Mac，也选择 **iOS**。确保选中 **Do not share UI** 选项。
6.  取消选择 **Include tests**，然后点击 **Create**。

   ![Create simple multiplatform project](create-test-multiplatform-project.png){width=800}

### 编写代码

在 `shared/src/commonMain/kotlin` 目录中，创建一个新的 `common.example.search` 目录。
在此目录中，创建一个 Kotlin 文件 `Grep.kt`，其中包含以下函数：

```kotlin
fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
    val regex = pattern.toRegex()
    lines.filter(regex::containsMatchIn)
        .forEach(action)
}
```

此函数旨在模拟 [UNIX `grep` 命令](https://en.wikipedia.org/wiki/Grep)。在这里，函数接受文本行、用作正则表达式的模式，以及一个每当一行匹配该模式时都会调用的函数。

### 添加测试

现在，让我们测试公共代码。一个重要的部分是公共测试的源代码集，它将 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 库作为依赖项。

1.  在 `shared/build.gradle.kts` 文件中，检测是否存在对 `kotlin.test` 库的依赖项：

    ```kotlin
   sourceSets {
       //...
       commonTest.dependencies {
           implementation(libs.kotlin.test)
       }
   }
   ```
   
2.  `commonTest` 源代码集存储所有公共测试。您需要在项目中创建一个同名目录：

    1.  右键点击 `shared/src` 目录，然后选择 **新建 | 目录**。IDE 会提供选项列表。
    2.  开始输入 `commonTest/kotlin` 路径以缩小选择范围，然后从列表中选择它：

      ![Creating common test directory](create-common-test-dir.png){width=350}

3.  在 `commonTest/kotlin` 目录中，创建一个新的 `common.example.search` 包。
4.  在此包中，创建 `Grep.kt` 文件并使用以下单元测试更新它：

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

如您所见，导入的注解和断言既不是平台特有的，也不是框架特有的。当您稍后运行此测试时，平台特有的框架将提供测试运行器。

#### 探查 `kotlin.test` API {initial-collapse-state="collapsed" collapsible="true"}

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 库提供了平台无关的注解和断言供您在测试中使用。注解（例如 `Test`）会映射到所选框架提供的注解或其最接近的等效项。

断言通过 [`Asserter` 接口](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)的实现来执行。此接口定义了测试中常用的各种检测。API 有一个默认实现，但通常您将使用框架特有的实现。

例如，JUnit 4、JUnit 5 和 TestNG 框架都受 JVM 支持。在 Android 上，对 `assertEquals()` 的调用可能会导致对 `asserter.assertEquals()` 的调用，其中 `asserter` 对象是 `JUnit4Asserter` 的实例。在 iOS 上，`Asserter` 类型的默认实现与 Kotlin/Native 测试运行器结合使用。

### 运行测试

您可以通过运行以下方式执行测试：

*   使用边栏中的 **运行** 图标运行 `shouldFindMatches()` 测试函数。
*   使用其右键菜单运行测试文件。
*   使用边栏中的 **运行** 图标运行 `GrepTest` 测试类。

还有一个方便的快捷键 <shortcut>⌃ ⇧ F10</shortcut>/<shortcut>Ctrl+Shift+F10</shortcut>。
无论您选择哪个选项，都会看到一个可供运行测试的目标列表：

![Run test task](run-test-tasks.png){width=300}

对于 `android` 选项，测试使用 JUnit 4 运行。对于 `iosSimulatorArm64`，Kotlin 编译器会检测测试注解并创建一个由 Kotlin/Native 自己的测试运行器执行的*测试二进制文件*。

以下是成功测试运行生成的输出示例：

![Test output](run-test-results.png){width=700}

## 处理更复杂的项目

### 编写公共代码的测试

您已经为 `grep()` 函数的公共代码创建了一个测试。现在，让我们考虑一个更高级的公共代码测试，使用 `CurrentRuntime` 类。此类包含代码执行所在平台的详细信息。例如，对于在本地 JVM 上运行的 Android 单元测试，它可能具有 "OpenJDK" 和 "17.0" 的值。

`CurrentRuntime` 的实例应使用平台名称和版本（字符串形式）创建，其中版本是可选的。当版本存在时，如果可用，您只需要字符串开头的数字。

1.  在 `commonMain/kotlin` 目录中，创建一个新的 `org.kmp.testing` 目录。
2.  在此目录中，创建 `CurrentRuntime.kt` 文件并使用以下实现更新它：

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
4.  在此包中，创建 `CurrentRuntimeTest.kt` 文件并使用以下平台和框架无关的测试更新它：

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

您可以使用[IDE 中可用的任何方式](#run-tests)运行此测试。

### 添加平台特有的测试

> 这里，为了简洁和简单，使用了 [expected 和 actual 声明机制](multiplatform-connect-to-apis.md)。在更复杂的代码中，更好的方法是使用接口和工厂函数。
>
{style="note"}

现在您已经有了编写公共代码测试的经验，接下来让我们探查如何编写 Android 和 iOS 的平台特有测试。

要创建 `CurrentRuntime` 的实例，请在公共 `CurrentRuntime.kt` 文件中声明一个函数，如下所示：

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

该函数应该为每个支持的平台提供单独的实现。否则，构建将失败。除了在每个平台上实现此函数外，您还应该提供测试。让我们为 Android 和 iOS 创建它们。

#### 对于 Android

1.  在 `androidMain/kotlin` 目录中，创建一个新的 `org.kmp.testing` 包。
2.  在此包中，创建 `AndroidRuntime.kt` 文件并使用预期的 `determineCurrentRuntime()` 函数的实际实现更新它：

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3.  在 `shared/src` 目录内创建一个测试目录：
 
    1.  右键点击 `shared/src` 目录，然后选择 **新建 | 目录**。IDE 会提供选项列表。
    2.  开始输入 `androidUnitTest/kotlin` 路径以缩小选择范围，然后从列表中选择它：

   ![Creating Android test directory](create-android-test-dir.png){width=350}

4.  在 `kotlin` 目录中，创建一个新的 `org.kmp.testing` 包。
5.  在此包中，创建 `AndroidRuntimeTest.kt` 文件并使用以下 Android 测试更新它：

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
   
    > 如果您在本教程开始时选择了不同的 JDK 版本，您可能需要更改 `name` 和 `version` 以使测试成功运行。
    > 
    {style="note"}

Android 特有的测试在本地 JVM 上运行可能看起来很奇怪。这是因为这些测试作为本地单元测试在当前机器上运行。如 [Android Studio 文档](https://developer.android.com/studio/test/test-in-android-studio)所述，这些测试与在设备或模拟器上运行的插桩测试不同。

您可以向您的项目添加其他类型的测试。要了解有关插桩测试的信息，请参阅此 [Touchlab 指南](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)。

#### 对于 iOS

1.  在 `iosMain/kotlin` 目录中，创建一个新的 `org.kmp.testing` 目录。
2.  在此目录中，创建 `IOSRuntime.kt` 文件并使用预期的 `determineCurrentRuntime()` 函数的实际实现更新它：

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
   
    1.  右键点击 `shared/src` 目录，然后选择 **新建 | 目录**。IDE 会提供选项列表。
    2.  开始输入 `iosTest/kotlin` 路径以缩小选择范围，然后从列表中选择它：

   ![Creating iOS test directory](create-ios-test-dir.png){width=350}

4.  在 `iosTest/kotlin` 目录中，创建一个新的 `org.kmp.testing` 目录。
5.  在此目录中，创建 `IOSRuntimeTest.kt` 文件并使用以下 iOS 测试更新它：

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

在此阶段，您已经拥有公共、Android 和 iOS 实现的代码及其测试。
您的项目中的目录结构应如下所示：

![Whole project structure](code-and-test-structure.png){width=300}

您可以从右键菜单运行单个测试或使用快捷键。另一个选项是使用 Gradle 任务。例如，如果您运行 `allTests` Gradle 任务，项目中的每个测试都将使用相应的测试运行器运行：

![Gradle test tasks](gradle-alltests.png){width=700}

当您运行测试时，除了 IDE 中的输出外，还会生成 HTML 报告。您可以在 `shared/build/reports/tests` 目录中找到它们：

![HTML reports for multiplatform tests](shared-tests-folder-reports.png){width=300}

运行 `allTests` 任务并检查其生成的报告：

*   `allTests/index.html` 文件包含公共测试和 iOS 测试的组合报告
    （iOS 测试依赖于公共测试，并在其后运行）。
*   `testDebugUnitTest` 和 `testReleaseUnitTest` 文件夹包含两个默认 Android 构建变体的报告。
    （目前，Android 测试报告不会自动与 `allTests` 报告合并。）

![HTML report for multiplatform tests](multiplatform-test-report.png){width=700}

## 在多平台项目中使用测试的规则

您现在已经创建、配置和执行了 Kotlin Multiplatform 应用程序中的测试。
在您未来的项目中使用测试时，请记住：

*   编写公共代码的测试时，只使用多平台库，例如 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/)。将依赖项添加到 `commonTest` 源代码集。
*   `kotlin.test` API 中的 `Asserter` 类型应该只被间接使用。
    尽管 `Asserter` 实例是可见的，但您无需在测试中使用它。
*   始终遵守测试库 API。幸运的是，
    编译器和 IDE 会阻止您使用框架特有的功能。
*   虽然在 `commonTest` 中运行测试使用哪个框架都无所谓，但最好使用您打算使用的每个框架运行测试，以检测您的开发环境是否已正确设置。
*   考虑物理差异。例如，滚动惯性和摩擦值因平台和设备而异，
    因此设置相同的滚动速度可能会导致不同的滚动位置。请务必在目标平台上测试您的组件，以确保预期行为。
*   编写平台特有的代码的测试时，您可以使用相应框架的功能，例如
    注解和扩展。
*   您可以既可以从 IDE 运行测试，也可以使用 Gradle 任务运行测试。
*   当您运行测试时，HTML 测试报告会自动生成。

## 接下来是什么？

*   探查多平台项目的布局：[理解多平台项目结构](multiplatform-discover-project.md)。
*   了解 [Kotest](https://kotest.io/)，这是 Kotlin 生态系统提供的另一个多平台测试框架。
    Kotest 允许以多种风格编写测试，并支持对常规测试的补充方法。
    这包括[数据驱动的](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)
    和[基于属性的](https://kotest.io/docs/proptest/property-based-testing.html)测试。