[//]: # (title: 测试您的多平台应用 – 教程)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中按照本教程进行操作 – 这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
</tldr>

在本教程中，您将学习如何在 Kotlin Multiplatform 应用程序中创建、配置和运行测试。

多平台项目的测试可以分为两类：

* **公共代码的测试**。这些测试可以使用任何支持的框架在任何平台上运行。
* **平台特定代码的测试**。这些对于测试平台特定逻辑至关重要。它们使用平台特定的框架，并可以受益于其附加功能，例如更丰富的 API 和更广泛的断言。

多平台项目支持这两个类别。本教程首先向您展示如何在一个简单的 Kotlin Multiplatform 项目中为公共代码设置、创建和运行单元测试。然后，您将处理一个更复杂的示例，该示例需要针对公共代码和平台特定代码进行测试。

> 本教程假设您熟悉：
> * Kotlin Multiplatform 项目的布局。如果不是这种情况，请在开始之前完成[此教程](multiplatform-create-first-app.md)。
> * 流行单元测试框架（如 [JUnit](https://junit.org/junit5/)）的基础知识。
>
{style="tip"}

## 测试简单的多平台项目

### 创建项目

1. 在[快速入门](quickstart.md)中，按照说明[设置您的 Kotlin Multiplatform 开发环境](quickstart.md#set-up-the-environment)。
2. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。
4. 在 **New Project** 窗口中指定以下字段：

    * **Name**: KotlinProject
    * **Group**: kmp.project.demo
    * **Artifact**: kotlinproject
    * **JDK**: Amazon Corretto version 17
        > 稍后添加的其中一个测试需要此 JDK 版本才能成功运行。
        >
        {style="note"}

5. 选择 **Android** 目标。
    * 如果您使用的是 Mac，请同时选择 **iOS**。确保已选择 **Do not share UI** 选项。
6. 取消选择 **Include tests** 并点击 **Create**。

   ![创建简单的多平台项目](create-test-multiplatform-project.png){width=800}

### 编写代码

在 `shared/src/commonMain/kotlin` 目录中，创建一个新的 `common.example.search` 目录。
在此目录中，创建一个 Kotlin 文件 `Grep.kt`，并添加以下函数：

```kotlin
fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
    val regex = pattern.toRegex()
    lines.filter(regex::containsMatchIn)
        .forEach(action)
}
```

此函数旨在模拟 [UNIX `grep` 命令](https://en.wikipedia.org/wiki/Grep)。在这里，该函数接收多行文本、一个用作正则表达式的模式，以及一个在每当某行匹配模式时调用的函数。

### 添加测试

现在，让我们测试公共代码。一个必不可少的部分是公共测试的源集，它将 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 库作为依赖项。

1. 在 `shared/build.gradle.kts` 文件中，检查是否存在对 `kotlin.test` 库的依赖：

    ```kotlin
   sourceSets {
       //...
       commonTest.dependencies {
           implementation(libs.kotlin.test)
       }
   }
   ```
   
2. `commonTest` 源集存储所有公共测试。您需要在项目中创建一个同名目录：

    1. 右键点击 `shared/src` 目录，然后选择 **New | Directory**。IDE 会显示一个选项列表。
    2. 开始输入 `commonTest/kotlin` 路径以缩小选择范围，然后从列表中选择它：

      ![创建公共测试目录](create-common-test-dir.png){width=350}

3. 在 `commonTest/kotlin` 目录中，创建一个新的 `common.example.search` 软件包。
4. 在此软件包中，创建 `Grep.kt` 文件并使用以下单元测试更新它：

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

如您所见，导入的注解和断言既不是平台特定的，也不是框架特定的。当您稍后运行此测试时，平台特定的框架将提供测试运行程序。

#### 探索 `kotlin.test` API {initial-collapse-state="collapsed" collapsible="true"}

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 库提供了与平台无关的注解和断言，供您在测试中使用。`Test` 等注解映射到所选框架提供的注解或其最接近的等效项。

断言通过 [`Asserter` 接口](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)的实现来执行。此接口定义了测试中常用的不同检查。该 API 有一个默认实现，但通常您将使用框架特定的实现。

例如，JVM 上支持 JUnit 4、JUnit 5 和 TestNG 框架。在 Android 上，对 `assertEquals()` 的调用可能会导致对 `asserter.assertEquals()` 的调用，其中 `asserter` 对象是 `JUnit4Asserter` 的一个实例。在 iOS 上，`Asserter` 类型的默认实现与 Kotlin/Native 测试运行程序配合使用。

### 运行测试

您可以通过以下方式执行测试：

* 使用装订区域中的 **Run** 图标运行 `shouldFindMatches()` 测试函数。
* 使用测试文件的上下文菜单运行该文件。
* 使用装订区域中的 **Run** 图标运行 `GrepTest` 测试类。

还有一个方便的快捷键 <shortcut>⌃ ⇧ F10</shortcut>/<shortcut>Ctrl+Shift+F10</shortcut>。无论您选择哪种选项，都会看到一个运行测试的目标列表：

![运行测试任务](run-test-tasks.png){width=300}

对于 `android` 选项，测试使用 JUnit 4 运行。对于 `iosSimulatorArm64`，Kotlin 编译器会检测测试注解并创建一个由 Kotlin/Native 自己的测试运行程序执行的“测试二进制文件”。

以下是成功运行测试生成的输出示例：

![测试输出](run-test-results.png){width=700}

## 处理更复杂的项目

### 为公共代码编写测试

您已经使用 `grep()` 函数创建了一个公共代码测试。现在，让我们考虑一个使用 `CurrentRuntime` 类的更高级公共代码测试。此类包含执行代码的平台的详细信息。例如，对于在本地 JVM 上运行的 Android 单元测试，它可能具有值 "OpenJDK" 和 "17.0"。

`CurrentRuntime` 的实例应使用作为字符串的平台名称和版本创建，其中版本是可选的。当存在版本时，如果可用，您只需要字符串开头的数字。

1. 在 `commonMain/kotlin` 目录中，创建一个新的 `org.kmp.testing` 目录。
2. 在此目录中，创建 `CurrentRuntime.kt` 文件并使用以下实现更新它：

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

3. 在 `commonTest/kotlin` 目录中，创建一个新的 `org.kmp.testing` 软件包。
4. 在此软件包中，创建 `CurrentRuntimeTest.kt` 文件并使用以下平台和框架无关的测试更新它：

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

您可以使用 [IDE 中提供的](#run-tests)任何方式运行此测试。

### 添加平台特定测试

> 这里为了简洁明了，使用了[预期声明与实际声明机制](multiplatform-connect-to-apis.md)。在更复杂的代码中，更好的方法是使用接口和工厂函数。
>
{style="note"}

现在您已经有了编写公共代码测试的经验，让我们探索为 Android 和 iOS 编写平台特定测试。

要创建 `CurrentRuntime` 实例，请在公共 `CurrentRuntime.kt` 文件中声明如下函数：

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

该函数应对每个受支持的平台具有单独的实现。否则，构建将失败。除了在每个平台上实现此函数外，您还应该提供测试。让我们为 Android 和 iOS 创建它们。

#### 针对 Android

1. 在 `androidMain/kotlin` 目录中，创建一个新的 `org.kmp.testing` 软件包。
2. 在此软件包中，创建 `AndroidRuntime.kt` 文件，并使用预期函数 `determineCurrentRuntime()` 的实际实现来更新它：

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3. 在 `shared/src` 目录中创建一个测试目录：
 
   1. 右键点击 `shared/src` 目录，然后选择 **New | Directory**。IDE 会显示一个选项列表。
   2. 开始输入 `androidUnitTest/kotlin` 路径以缩小选择范围，然后从列表中选择它：

   ![创建 Android 测试目录](create-android-test-dir.png){width=350}

4. 在 `kotlin` 目录中，创建一个新的 `org.kmp.testing` 软件包。
5. 在此软件包中，创建 `AndroidRuntimeTest.kt` 文件并使用以下 Android 测试更新它：

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
   
   > 如果您在教程开始时选择了不同的 JDK 版本，则可能需要更改测试的 `name` 和 `version` 才能成功运行。
   > 
   {style="note"}

Android 特定的测试在本地 JVM 上运行，这看起来可能很奇怪。这是因为这些测试在当前机器上作为本地单元测试运行。如 [Android Studio 文档](https://developer.android.com/studio/test/test-in-android-studio)中所述，这些测试与在设备或模拟器上运行的受检测测试 (instrumented tests) 不同。

您可以向项目添加其他类型的测试。要了解受检测测试，请参阅此 [Touchlab 指南](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)。

#### 针对 iOS

1. 在 `iosMain/kotlin` 目录中，创建一个新的 `org.kmp.testing` 目录。
2. 在此目录中，创建 `IOSRuntime.kt` 文件，并使用预期函数 `determineCurrentRuntime()` 的实际实现来更新它：

    ```kotlin
    import kotlin.experimental.ExperimentalNativeApi
    import kotlin.native.Platform
    
    @OptIn(ExperimentalNativeApi::class)
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3. 在 `shared/src` 目录中创建一个新目录：
   
   1. 右键点击 `shared/src` 目录，然后选择 **New | Directory**。IDE 会显示一个选项列表。
   2. 开始输入 `iosTest/kotlin` 路径以缩小选择范围，然后从列表中选择它：

   ![创建 iOS 测试目录](create-ios-test-dir.png){width=350}

4. 在 `iosTest/kotlin` 目录中，创建一个新的 `org.kmp.testing` 目录。
5. 在此目录中，创建 `IOSRuntimeTest.kt` 文件并使用以下 iOS 测试更新它：

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

在这个阶段，您已经拥有了公共、Android 和 iOS 实现的代码以及它们的测试。您项目中的目录结构应该如下所示：

![整个项目结构](code-and-test-structure.png){width=300}

您可以从上下文菜单运行单个测试或使用快捷键。另一个选项是使用 Gradle 任务。例如，如果您运行 `allTests` Gradle 任务，项目中的每个测试都将使用相应的测试运行程序运行：

![Gradle 测试任务](gradle-alltests.png){width=700}

运行测试时，除了 IDE 中的输出外，还会生成 HTML 报告。您可以在 `shared/build/reports/tests` 目录中找到它们：

![多平台测试的 HTML 报告](shared-tests-folder-reports.png){width=300}

运行 `allTests` 任务并检查其生成的报告：

* `allTests/index.html` 文件包含公共测试和 iOS 测试的合并报告（iOS 测试依赖于公共测试，并在公共测试之后运行）。
* `testDebugUnitTest` 和 `testReleaseUnitTest` 文件夹包含两个默认 Android 构建变体的报告。（目前，Android 测试报告不会自动与 `allTests` 报告合并。）

![多平台测试的 HTML 报告](multiplatform-test-report.png){width=700}

## 在多平台项目中使用测试的规则

您现在已经在 Kotlin Multiplatform 应用程序中创建、配置并执行了测试。在未来的项目中处理测试时，请记住：

* 编写公共代码的测试时，仅使用多平台库，例如 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/)。将依赖项添加到 `commonTest` 源集。
* `kotlin.test` API 中的 `Asserter` 类型只能间接使用。虽然 `Asserter` 实例是可见的，但您不需要在测试中使用它。
* 始终保持在测试库 API 范围内。幸运的是，编译器和 IDE 会阻止您使用框架特定的功能。
* 虽然使用哪个框架运行 `commonTest` 中的测试并不重要，但最好使用您打算使用的每个框架运行测试，以检查您的开发环境是否已正确设置。
* 考虑物理差异。例如，滚动惯性和摩擦值因平台和设备而异，因此设置相同的滚动速度可能会导致不同的滚动位置。请始终在目标平台上测试您的组件以确保预期行为。
* 编写平台特定代码的测试时，您可以使用相应框架的功能，例如注解和扩展。
* 您可以从 IDE 运行测试，也可以使用 Gradle 任务。
* 运行测试时，会自动生成 HTML 测试报告。

## 下一步

* 在[了解多平台项目结构](multiplatform-discover-project.md)中探索多平台项目的布局。
* 查看 [Kotest](https://kotest.io/)，这是 Kotlin 生态系统提供的另一个多平台测试框架。Kotest 允许以多种风格编写测试，并支持对常规测试的补充方法。其中包括[数据驱动型](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)测试和[基于属性的](https://kotest.io/docs/proptest/property-based-testing.html)测试。