[//]: # (title: 使用 JUnit 測試 Compose Multiplatform UI)

適用於桌面版的 Compose Multiplatform 提供了基於 JUnit 和 Jetpack Compose 測試 API 的測試 API。有關實作的更多詳細資訊，請參閱 Jetpack Compose 文件中的 [測試您的 Compose 版面配置](https://developer.android.com/develop/ui/compose/testing) 指南。

> 對於所有支援平台上可用的 UI 測試功能，請參考 [測試 Compose Multiplatform UI](compose-test.md) 一文。
>
{style="tip"}

為了實際體驗基於 JUnit 的測試，讓我們從 [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/) 生成的專案開始。如果您要將測試新增到現有專案中，您可能需要將路徑和指令中的 `composeApp` 替換為您正在測試的模組名稱（例如 `shared`）。

建立測試源集並新增必要的依賴項：

1. 建立測試目錄：`composeApp/src/desktopTest/kotlin`。
2. 在 `composeApp/build.gradle.kts` 檔案中，新增以下依賴項：

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

3. 建立一個名為 `ExampleTest.kt` 的測試檔案並將以下程式碼複製到其中：

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
            // 宣告一個模擬 UI 來展示 API 呼叫
            //
            // 將其替換為您自己的宣告以測試專案中的程式碼
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
    
            // 使用基於 JUnit 的測試 API 的斷言和操作來測試宣告的 UI
            rule.onNodeWithTag("text").assertTextEquals("Hello")
            rule.onNodeWithTag("button").performClick()
            rule.onNodeWithTag("text").assertTextEquals("Compose")
        }
    }
    ```

4. 若要執行測試，請點擊 `myTest()` 函式旁邊側邊欄中的執行圖示，或在終端機中執行以下指令：

   ```shell
   ./gradlew desktopTest
   ```
   
## 接下來？

* 了解如何 [建立和執行多平台測試](multiplatform-run-tests.md)。
* 有關 Kotlin 專案中基於 JUnit 的測試的總體概覽，請參閱 [在 JVM 中使用 JUnit 測試程式碼](https://kotlinlang.org/docs/jvm-test-using-junit.html) 教學。