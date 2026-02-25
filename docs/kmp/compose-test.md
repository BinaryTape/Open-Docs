[//]: # (title: 测试 Compose Multiplatform UI)

Compose Multiplatform 中的 UI 测试使用与 Jetpack Compose 测试 API 相同的查找器 (finders)、断言 (assertions)、操作 (actions) 和匹配器 (matchers) 实现。如果您还不熟悉它们，在继续阅读本文之前，请先阅读 [Jetpack Compose 指南](https://developer.android.com/jetpack/compose/testing)。

> 该 API 是[实验性](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)的。
> 未来可能会发生变化。
>
{style="warning"}

## Compose Multiplatform 测试与 Jetpack Compose 的区别

Compose Multiplatform 公共测试 API 不依赖于 JUnit 的 `TestRule` 类。相反，您需要调用 `runComposeUiTest` 函数，并在 `ComposeUiTest` 接收者上调用测试函数。

不过，基于 JUnit 的 API 可用于[桌面目标](compose-desktop-ui-testing.md)。

## 使用 Compose Multiplatform 编写和运行测试

首先，将测试源集和必要的依赖项添加到模块中。然后，编写并运行示例测试，并尝试对其进行自定义。

### 创建测试源集并将测试库添加到依赖项

为了提供具体的示例，本页面的说明遵循 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/) 生成的项目结构。如果您要在现有项目中添加测试，可能需要将路径和命令中的 `composeApp` 替换为您正在测试的模块名称（例如 `shared`）。

创建一个公共测试源集并添加必要的依赖项：

1. 为公共测试源集创建目录：`composeApp/src/commonTest/kotlin`。
2. 在 `composeApp/build.gradle.kts` 文件中，添加以下配置：

    ```kotlin
    kotlin {
        //...
        sourceSets { 
            val jvmTest by getting
   
            // 添加公共测试依赖项
            commonTest.dependencies {
                implementation(kotlin("test"))
            
                @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
                implementation(compose.uiTest)
            }
   
            // 添加桌面测试依赖项
            jvmTest.dependencies { 
                implementation(compose.desktop.currentOs)
            }
        }
    }
    ```

3. 如果您需要为 Android 运行仪器化 (模拟器) 测试，请按如下方式修改您的 Gradle 配置：
   1. 将以下代码添加到 `androidTarget {}` 代码块中，以配置仪器化测试源集依赖于公共测试源集。

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
   2. 按照 IDE 的建议添加任何缺失的导入。
   3. 将以下代码添加到 `android.defaultConfig {}` 代码块中，以配置 Android 测试仪器化运行程序：

      ```kotlin
      android {
          //...
          defaultConfig {
              //...
              testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
          }
      }
      ```

   4. 在根 `dependencies {}` 代码块中添加所需的依赖项：

       ```kotlin
       dependencies { 
           androidTestImplementation("androidx.compose.ui:ui-test-junit4-android:%androidx.compose%")
           debugImplementation("androidx.compose.ui:ui-test-manifest:%androidx.compose%")
       }
       ```
4. 在主菜单中选择 **Build | Sync Project with Gradle Files**，或点击构建脚本编辑器中的 Gradle 刷新按钮。

现在，您已经准备好为 Compose Multiplatform UI 编写并运行公共测试了。

### 编写并运行公共测试

在 `composeApp/src/commonTest/kotlin` 目录中，创建一个名为 `ExampleTest.kt` 的文件，并将以下代码复制到其中：

```kotlin
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.assertTextEquals
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.runComposeUiTest
import kotlin.test.Test

class ExampleTest {

    @OptIn(ExperimentalTestApi::class)
    @Test
    fun myTest() = runComposeUiTest {
        // 声明一个模拟 UI 以演示 API 调用
        //
        // 替换为您自己的声明以测试您项目的代码
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

        // 使用 Compose Multiplatform 测试 API 的断言和操作来测试声明的 UI
        onNodeWithTag("text").assertTextEquals("Hello")
        onNodeWithTag("button").performClick()
        onNodeWithTag("text").assertTextEquals("Compose")
    }
}
```

运行测试：

<Tabs>
<TabItem title="iOS 模拟器">

您有两种选择：
* 在 Android Studio 中，您可以点击 `myTest()` 函数旁边的装订区域中的绿色运行图标，选择 **Run | ExampleTest.myTest**，然后选择该测试的 iOS 目标。
* 在终端中运行以下命令：

   ```shell
   ./gradlew :composeApp:iosSimulatorArm64Test
   ```

</TabItem>
<TabItem title="Android 模拟器">

在终端中运行此命令：

```shell
./gradlew :composeApp:connectedAndroidTest
```

目前，您无法使用 `android (local)` 测试配置运行公共 Compose Multiplatform 测试，因此 Android Studio 中的装订区域图标等功能将无法使用。

</TabItem>
<TabItem title="桌面">

您有两种选择：
* 点击 `myTest()` 函数旁边的装订区域中的绿色运行图标，选择 **Run | ExampleTest.myTest**，然后选择 JVM 目标。
* 在终端中运行以下命令：

   ```shell
   ./gradlew :composeApp:jvmTest
   ```

</TabItem>
<TabItem title="Wasm (无头浏览器)">

在终端中运行此命令：

```shell
./gradlew :composeApp:wasmJsTest
```

</TabItem>
</Tabs>

## 下一步

现在您已经掌握了 Compose Multiplatform UI 测试，您可能还想查看更多与测试相关的资源：
* 有关 Kotlin Multiplatform 项目中测试的总体概述，请参阅[了解基本项目结构](multiplatform-discover-project.md#integration-with-tests)和[测试多平台应用](multiplatform-run-tests.md)教程。
* 有关为桌面目标设置和运行基于 JUnit 的测试的详细信息，请参阅[使用 JUnit 测试 Compose Multiplatform UI](compose-desktop-ui-testing.md)。
* 有关本地化测试，请参阅[在不同平台上测试区域性](compose-localization-tests.md#testing-locales-on-different-platforms)。
* Android Studio 文档中的[测试您的应用](https://developer.android.com/studio/test)一文介绍了在 Android Studio 中进行更高级的测试（包括自动化）。