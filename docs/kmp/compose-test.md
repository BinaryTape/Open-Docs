[//]: # (title: 测试 Compose Multiplatform UI)

Compose Multiplatform 中的 UI 测试使用与 Jetpack Compose 测试 API 相同的查找器、断言、操作和匹配器实现。如果你还不熟悉它们，请在继续阅读本文之前，阅读 [Jetpack Compose 指南](https://developer.android.com/jetpack/compose/testing)。

> 该 API 处于 [实验性的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 阶段。
> 未来可能会有所变化。
> {style="warning"}

## Compose Multiplatform 测试与 Jetpack Compose 有何不同

Compose Multiplatform 通用测试 API 不依赖于 JUnit 的 `TestRule` 类。相反，你需要调用 `runComposeUiTest` 函数，并在 `ComposeUiTest` 接收者上调用测试函数。

然而，基于 JUnit 的 API 可用于 [桌面目标](compose-desktop-ui-testing.md)。

## 使用 Compose Multiplatform 编写和运行测试

首先，为测试添加源代码集，并向模块添加所需的依赖项。然后，编写并运行示例测试，并尝试自定义它。

### 创建测试源代码集并将测试库添加到依赖项

为了提供具体的示例，本页上的说明遵循 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/) 生成的项目结构。如果你正在向现有项目添加测试，你可能需要在路径和命令中将 `composeApp` 替换为你正在测试的模块名称（例如，`shared`）。

创建一个通用测试源代码集并添加所需的依赖项：

1.  创建一个用于通用测试源代码集的目录：`composeApp/src/commonTest/kotlin`。
2.  在 `composeApp/build.gradle.kts` 文件中，添加以下依赖项：

    ```kotlin
    kotlin {
        //...
        sourceSets { 
            val desktopTest by getting
   
            // 添加通用测试依赖项
            commonTest.dependencies {
                implementation(kotlin("test"))
            
                @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
                implementation(compose.uiTest)
            }
   
            // 添加桌面测试依赖项
            desktopTest.dependencies { 
                implementation(compose.desktop.currentOs)
            }
        }
    }
    ```

3.  如果你需要为 Android 运行仪器化（模拟器）测试，请按如下方式修改你的 Gradle 配置：
    1.  将以下代码添加到 `androidTarget {}` 代码块中，以配置仪器化测试源代码集依赖于通用测试源代码集。然后，按照 IDE 的建议添加任何缺失的导入。

        ```kotlin
        kotlin {
            //...
            androidTarget { 
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                instrumentedTestVariant.sourceSetTree.set(KotlinSourceSetTree.test)
                //...
            }
            //... 
        }
        ```

    2.  将以下代码添加到 `android.defaultConfig {}` 代码块中，以配置 Android 测试仪器化运行器：

        ```kotlin
        android {
            //...
            defaultConfig {
                //...
                testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
            }
        }
        ```

    3.  为 `androidTarget` 添加所需的依赖项：

        ```kotlin
        kotlin {
             // ...
             androidTarget {
                 // ...
                 dependencies { 
                     androidTestImplementation("androidx.compose.ui:ui-test-junit4-android:%androidx.compose%")
                     debugImplementation("androidx.compose.ui:ui-test-manifest:%androidx.compose%")
                 }
             }
         }
        ```

现在，你已准备好为 Compose Multiplatform UI 编写并运行通用测试。

### 编写并运行通用测试

在 `composeApp/src/commonTest/kotlin` 目录中，创建一个名为 `ExampleTest.kt` 的文件，并将以下代码复制到其中：

```kotlin
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.*
import kotlin.test.Test

class ExampleTest {

    @OptIn(ExperimentalTestApi::class)
    @Test
    fun myTest() = runComposeUiTest {
        // 声明一个模拟 UI 以演示 API 调用
        //
        // 请替换为你自己的声明以测试项目代码
        setContent {
            var text by remember { mutableStateOf("Hello") }
            Text(
                text = text,
                modifier = Modifier.testTag("text")
            )
            Button(
                onClick = { text = "Compose" },
                modifier = Modifier.testTag("button")
            ) {
                Text("Click me")
            }
        }

        // 使用 Compose Multiplatform 测试 API 的断言和操作测试所声明的 UI
        onNodeWithTag("text").assertTextEquals("Hello")
        onNodeWithTag("button").performClick()
        onNodeWithTag("text").assertTextEquals("Compose")
    }
}
```

运行测试：

<Tabs>
<TabItem title="iOS 模拟器">

你有两个选项：
*   在 Android Studio 中，你可以单击行号槽中 `myTest()` 函数旁边的绿色运行图标，选择 **Run** 和该测试的 iOS 目标。
*   在终端中运行以下命令：

    ```shell
    ./gradlew :composeApp:iosSimulatorArm64Test
    ```

</TabItem>
<TabItem title="Android 模拟器">

在终端中运行此命令：

```shell
./gradlew :composeApp:connectedAndroidTest
```

目前，你无法使用 `android (local)` 测试配置运行通用 Compose Multiplatform 测试，因此，例如 Android Studio 中的行号槽图标将不起作用。

</TabItem>
<TabItem title="桌面">

你有两个选项：
*   单击行号槽中 `myTest()` 函数旁边的绿色运行图标，并选择 **Run&nbsp;|&nbsp;desktop**。
*   在终端中运行以下命令：

    ```shell
    ./gradlew :composeApp:desktopTest
    ```

</TabItem>
<TabItem title="Wasm（无头浏览器）">

在终端中运行此命令：

```shell
./gradlew :composeApp:wasmJsTest
```

</TabItem>
</Tabs>

## 接下来

既然你已经掌握了 Compose Multiplatform UI 测试的诀窍，你可能想查看更多与测试相关的资源：
*   关于 Kotlin Multiplatform 项目中测试的概览，请参见 [了解基本项目结构](multiplatform-discover-project.md#integration-with-tests) 和 [测试你的多平台应用](multiplatform-run-tests.md) 教程。
*   有关为桌面目标设置和运行基于 JUnit 测试的详细信息，请参见 [使用 JUnit 测试 Compose Multiplatform UI](compose-desktop-ui-testing.md)。
*   对于本地化测试，请参见 [未定义](compose-localization-tests.md#testing-locales-on-different-platforms)。
*   Android Studio 中更高级的测试，包括自动化，在 Android Studio 文档的 [测试你的应用](https://developer.android.com/studio/test) 一文中有所介绍。