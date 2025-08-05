[//]: # (title: 測試 Compose Multiplatform UI)

Compose Multiplatform 中的 UI 測試是使用與 Jetpack Compose 測試 API 相同的尋找器 (finders)、斷言 (assertions)、動作 (actions) 和匹配器 (matchers) 來實作的。如果您不熟悉這些內容，請在繼續閱讀本文之前，先閱讀 [Jetpack Compose 指南](https://developer.android.com/jetpack/compose/testing)。

> 該 API 尚處於 [實驗階段 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)。
> 未來可能會有所變更。
>
{style="warning"}

## Compose Multiplatform 測試與 Jetpack Compose 有何不同

Compose Multiplatform 的通用測試 API 不依賴於 JUnit 的 `TestRule` 類別。相反地，您會呼叫 `runComposeUiTest` 函數，並在 `ComposeUiTest` 接收器上調用測試函數。

然而，基於 JUnit 的 API 可用於 [桌面目標 (desktop targets)](compose-desktop-ui-testing.md)。

## 使用 Compose Multiplatform 編寫和執行測試

首先，為測試新增來源集 (source set) 並將所需的依賴項 (dependencies) 添加到模組中。然後，編寫並執行範例測試，並嘗試自訂它。

### 建立測試來源集並將測試函式庫添加到依賴項

為提供具體範例，本頁上的說明遵循 [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/) 所生成的專案結構。如果您要為現有專案新增測試，則可能需要將路徑和指令中的 `composeApp` 替換為您正在測試的模組名稱（例如 `shared`）。

建立一個通用測試來源集並新增所需的依賴項：

1. 建立通用測試來源集的目錄：`composeApp/src/commonTest/kotlin`。
2. 在 `composeApp/build.gradle.kts` 檔案中，新增以下依賴項：

    ```kotlin
    kotlin {
        //...
        sourceSets { 
            val desktopTest by getting
   
            // 新增通用測試依賴項
            commonTest.dependencies {
                implementation(kotlin("test"))
            
                @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
                implementation(compose.uiTest)
            }
   
            // 新增桌面測試依賴項
            desktopTest.dependencies { 
                implementation(compose.desktop.currentOs)
            }
        }
    }
    ```

3. 如果您需要執行 Android 的儀器化 (emulator) 測試，請按如下方式修改您的 Gradle 配置：
   1. 將以下程式碼新增到 `androidTarget {}` 區塊，以配置儀器化測試來源集依賴於通用測試來源集。然後，按照 IDE 的建議新增任何缺少的 import。

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

   2. 將以下程式碼新增到 `android.defaultConfig {}` 區塊，以配置 Android 測試儀器運行器：

      ```kotlin
      android {
          //...
          defaultConfig {
              //...
              testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
          }
      }
      ```

   3. 為 `androidTarget` 新增所需的依賴項：

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

現在，您已準備好為 Compose Multiplatform UI 編寫並執行通用測試。

### 編寫並執行通用測試

在 `composeApp/src/commonTest/kotlin` 目錄中，建立一個名為 `ExampleTest.kt` 的檔案並將以下程式碼複製到其中：

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
        // 聲明一個模擬 UI 以演示 API 呼叫
        //
        // 將其替換為您自己的聲明以測試專案程式碼
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

        // 使用 Compose Multiplatform 測試 API 的斷言和動作來測試聲明的 UI
        onNodeWithTag("text").assertTextEquals("Hello")
        onNodeWithTag("button").performClick()
        onNodeWithTag("text").assertTextEquals("Compose")
    }
}
```

要執行測試：

<tabs>
<tab title="iOS 模擬器">

您有兩種選擇：
* 在 Android Studio 中，您可以點擊 `myTest()` 函數旁側邊欄中的綠色執行圖示，選擇 **Run** 和測試的 iOS 目標。
* 在終端機中執行以下指令：

   ```shell
   ./gradlew :composeApp:iosSimulatorArm64Test
   ```

</tab>
<tab title="Android 模擬器">

在終端機中執行此指令：

```shell
./gradlew :composeApp:connectedAndroidTest
```

目前，您無法使用 `android (local)` 測試配置來執行通用的 Compose Multiplatform 測試，因此 Android Studio 中的側邊欄圖示（例如）將不會有幫助。

</tab>
<tab title="桌面">

您有兩種選擇：
* 點擊 `myTest()` 函數旁側邊欄中的綠色執行圖示，然後選擇 **Run&nbsp;|&nbsp;desktop**。
* 在終端機中執行以下指令：

   ```shell
   ./gradlew :composeApp:desktopTest
   ```

</tab>
<tab title="Wasm（無頭瀏覽器）">

在終端機中執行此指令：

```shell
./gradlew :composeApp:wasmJsTest
```

</tab>
</tabs>

## 接下來

既然您已經掌握了 Compose Multiplatform UI 測試的訣竅，您可能希望查看更多與測試相關的資源：
* 有關 Kotlin Multiplatform 專案中測試的總體概述，請參閱 [了解基本專案結構](multiplatform-discover-project.md#integration-with-tests) 和 [測試您的多平台應用程式](multiplatform-run-tests.md) 教學課程。
* 有關為桌面目標設定和執行基於 JUnit 測試的詳細資訊，請參閱 [](compose-desktop-ui-testing.md)。
* 有關本地化測試，請參閱 [](compose-localization-tests.md#testing-locales-on-different-platforms)。
* Android Studio 文件中的 [測試您的應用程式](https://developer.android.com/studio/test) 文章涵蓋了 Android Studio 中更進階的測試，包括自動化。