[//]: # (title: 使用 JUnit 测试 Compose Multiplatform UI)

Compose Multiplatform 桌面端提供了一个基于 JUnit 和 Jetpack Compose 测试 API 的测试 API。
有关实现的更多详细信息，请参阅 Jetpack Compose 文档中的[测试 Compose 布局](https://developer.android.com/develop/ui/compose/testing)指南。

> 有关所有受支持平台上可用的 UI 测试功能，请参阅[测试 Compose Multiplatform UI](compose-test.md)一文。
>
{style="tip"}

要了解基于 JUnit 的测试如何运作，让我们从 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/)生成的项目开始。
如果您是在现有项目中添加测试，则可能需要将路径和命令中的 `composeApp` 替换为您正在测试的模块名称（例如 `shared`）。

创建测试源集并添加必要的依赖项：

1. 创建一个测试目录：`composeApp/src/desktopTest/kotlin`。
2. 在 `composeApp/build.gradle.kts` 文件中，添加以下依赖项：

   ```kotlin
   kotlin { 
       //...
       sourceSets { 
           //...
           val desktopTest by getting { 
               dependencies {
                   implementation(compose.desktop.uiTestJUnit4)
                   implementation(compose.desktop.currentOs)
               }
           }
       }
   }
   ```

3. 创建一个名为 `ExampleTest.kt` 的测试文件，并将以下代码复制到其中：

    ```kotlin
    import androidx.compose.material.*
    import androidx.compose.runtime.*
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.test.*
    import androidx.compose.ui.platform.testTag
    import androidx.compose.ui.test.junit4.createComposeRule
    import org.junit.Rule
    import org.junit.Test
    
    class ExampleTest {
        @get:Rule
        val rule = createComposeRule()
    
        @Test
        fun myTest(){
            // 声明一个模拟 UI 以演示 API 调用
            //
            // 替换为您自己的声明，以测试项目中的代码
            rule.setContent {
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
    
            // 使用基于 JUnit 的测试 API 的断言和操作来测试声明的 UI
            rule.onNodeWithTag("text").assertTextEquals("Hello")
            rule.onNodeWithTag("button").performClick()
            rule.onNodeWithTag("text").assertTextEquals("Compose")
        }
    }
    ```

4. 要运行测试，点击 `myTest()` 函数旁边装订区域中的运行图标，或者在终端中运行以下命令：

   ```shell
   ./gradlew desktopTest
   ```
   
## 下一步？

* 详细了解如何[创建和运行多平台测试](multiplatform-run-tests.md)。
* 有关 Kotlin 项目中基于 JUnit 测试的一般概述，请参阅[在 JVM 中使用 JUnit 测试代码](https://kotlinlang.org/docs/jvm-test-using-junit.html)教程。