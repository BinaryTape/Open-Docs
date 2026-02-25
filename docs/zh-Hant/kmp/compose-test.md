[//]: # (title: 測試 Compose Multiplatform UI)

Compose Multiplatform 中的 UI 測試是使用與 Jetpack Compose 測試 API 相同的 finders、assertions、actions 與 matchers 來實作的。如果您對這些內容還不熟悉，在繼續閱讀本文之前，請先閱讀 [Jetpack Compose 指南](https://developer.android.com/jetpack/compose/testing)。

> 此 API 為[實驗性 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)。
> 未來可能會有所變動。
>
{style="warning"}

## Compose Multiplatform 測試與 Jetpack Compose 的不同之處

Compose Multiplatform 通用測試 API 並不依賴 JUnit 的 `TestRule` 類別。取而代之的是，您需要呼叫 `runComposeUiTest` 函式，並在 `ComposeUiTest` 接收者上呼叫測試函式。

不過，[桌面目標 (desktop targets)](compose-desktop-ui-testing.md) 仍可使用基於 JUnit 的 API。

## 使用 Compose Multiplatform 編寫並執行測試

首先，為模組新增測試用的原始碼集 (source set) 與必要的相依性。然後，編寫並執行範例測試，並嘗試對其進行自訂。

### 建立測試原始碼集並將測試程式庫新增至相依性

為了提供具體的範例，此頁面上的說明遵循 [Kotlin Multiplatform 精靈](https://kmp.jetbrains.com/)產生的專案結構。如果您是將測試新增到現有專案中，您可能需要將路徑和指令中的 `composeApp` 替換為您正在測試的模組名稱（例如 `shared`）。

建立通用測試原始碼集並新增必要的相依性：

1. 為通用測試原始碼集建立目錄：`composeApp/src/commonTest/kotlin`。
2. 在 `composeApp/build.gradle.kts` 檔案中，新增以下配置：

    ```kotlin
    kotlin {
        //...
        sourceSets { 
            val jvmTest by getting
   
            // 新增通用測試相依性
            commonTest.dependencies {
                implementation(kotlin("test"))
            
                @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
                implementation(compose.uiTest)
            }
   
            // 新增桌面測試相依性
            jvmTest.dependencies { 
                implementation(compose.desktop.currentOs)
            }
        }
    }
    ```

3. 如果您需要為 Android 執行檢測 (instrumented)（模擬器）測試，請按如下方式修正您的 Gradle 配置：
   1. 將以下程式碼新增至 `androidTarget {}` 區塊，以將檢測測試原始碼集配置為依賴通用測試原始碼集。

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
   2. 按照 IDE 的建議新增任何缺失的匯入。
   3. 將以下程式碼新增至 `android.defaultConfig {}` 區塊，以配置 Android 測試檢測執行器：

      ```kotlin
      android {
          //...
          defaultConfig {
              //...
              testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
          }
      }
      ```

   4. 在根目錄的 `dependencies {}` 區塊中新增所需的相依性：

       ```kotlin
       dependencies { 
           androidTestImplementation("androidx.compose.ui:ui-test-junit4-android:%androidx.compose%")
           debugImplementation("androidx.compose.ui:ui-test-manifest:%androidx.compose%")
       }
       ```
4. 在主選單中選取 **Build | Sync Project with Gradle Files**，或點擊建置指令碼編輯器中的 Gradle 重新整理按鈕。

現在，您已準備好為 Compose Multiplatform UI 編寫並執行通用測試。

### 編寫並執行通用測試

在 `composeApp/src/commonTest/kotlin` 目錄中，建立一個名為 `ExampleTest.kt` 的檔案，並將以下程式碼複製到其中：

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
        // 宣告模擬 UI 以示範 API 呼叫
        //
        // 替換為您自己的宣告以測試您的專案程式碼
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

        // 使用 Compose Multiplatform 測試 API 的 assertions 與 actions 來測試宣告的 UI
        onNodeWithTag("text").assertTextEquals("Hello")
        onNodeWithTag("button").performClick()
        onNodeWithTag("text").assertTextEquals("Compose")
    }
}
```

執行測試：

<Tabs>
<TabItem title="iOS 模擬器">

您有兩種選擇：
* 在 Android Studio 中，您可以點擊 `myTest()` 函式旁裝訂邊上的綠色執行圖示，選擇 **Run | ExampleTest.myTest**，然後選取測試的 iOS 目標。
* 在終端中執行以下指令：

   ```shell
   ./gradlew :composeApp:iosSimulatorArm64Test
   ```

</TabItem>
<TabItem title="Android 模擬器">

在終端中執行此指令：

```shell
./gradlew :composeApp:connectedAndroidTest
```

目前，您無法使用 `android (local)` 測試配置來執行通用的 Compose Multiplatform 測試，因此 Android Studio 中的裝訂邊圖示等功能將無法運作。

</TabItem>
<TabItem title="桌面">

您有兩種選擇：
* 點擊 `myTest()` 函式旁裝訂邊上的綠色執行圖示，選擇 **Run | ExampleTest.myTest**，然後選取 JVM 目標。
* 在終端中執行以下指令：

   ```shell
   ./gradlew :composeApp:jvmTest
   ```

</TabItem>
<TabItem title="Wasm (無周邊瀏覽器)">

在終端中執行此指令：

```shell
./gradlew :composeApp:wasmJsTest
```

</TabItem>
</Tabs>

## 下一步

既然您已經掌握了 Compose Multiplatform UI 測試的要領，您可能想查看更多與測試相關的資源：
* 有關 Kotlin Multiplatform 專案測試的總體概述，請參閱[了解基本專案結構](multiplatform-discover-project.md#integration-with-tests)與[測試您的多平台應用程式](multiplatform-run-tests.md)教學。
* 有關為桌面目標設定並執行基於 JUnit 測試的詳細資訊，請參閱[使用 JUnit 測試 Compose Multiplatform UI](compose-desktop-ui-testing.md)。
* 有關在地化測試，請參閱 [undefined](compose-localization-tests.md#testing-locales-on-different-platforms)。
* Android Studio 中的進階測試（包括自動化測試）涵蓋在 Android Studio 文件的[測試您的應用程式](https://developer.android.com/studio/test)文章中。