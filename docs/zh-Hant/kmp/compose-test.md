[//]: # (title: 測試 Compose Multiplatform UI)

Compose Multiplatform 中的 UI 測試是使用與 Jetpack Compose 測試 API 相同的尋找器、斷言、動作和比對器來實現的。如果您不熟悉這些內容，請在繼續閱讀本文之前，先閱讀 [Jetpack Compose 指南](https://developer.android.com/jetpack/compose/testing)。

> 此 API 處於 [實驗性](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 階段。
> 未來可能會有所變動。
>
{style="warning"}

## Compose Multiplatform 測試與 Jetpack Compose 的不同之處

Compose Multiplatform 通用測試 API 不依賴於 JUnit 的 `TestRule` 類別。相反地，您需要呼叫 `runComposeUiTest` 函數，並在 `ComposeUiTest` 接收器上呼叫測試函數。

然而，基於 JUnit 的 API 可用於 [桌面目標](compose-desktop-ui-testing.md)。

## 使用 Compose Multiplatform 編寫和執行測試

首先，為模組新增測試的原始碼集和必要的相依性。然後，編寫並執行範例測試，並嘗試自訂它。

### 建立測試原始碼集並將測試函式庫新增至相依性

為了提供具體範例，本頁上的說明遵循 [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/) 產生的專案結構。如果您要為現有專案新增測試，則可能需要將路徑和指令中的 `composeApp` 替換為您正在測試的模組名稱（例如 `shared`）。

建立一個通用測試原始碼集並新增必要的相依性：

1.  為通用測試原始碼集建立目錄：`composeApp/src/commonTest/kotlin`。
2.  在 `composeApp/build.gradle.kts` 檔案中，新增以下相依性：

    ```kotlin
    kotlin {
        //...
        sourceSets {
            val desktopTest by getting

            // Adds common test dependencies
            commonTest.dependencies {
                implementation(kotlin("test"))

                @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
                implementation(compose.uiTest)
            }

            // Adds the desktop test dependency
            desktopTest.dependencies {
                implementation(compose.desktop.currentOs)
            }
        }
    }
    ```

3.  如果您需要為 Android 執行儀器化 (模擬器) 測試，請修改您的 Gradle 組態，如下所示：
    1.  將以下程式碼新增到 `androidTarget {}` 區塊，以組態儀器化測試原始碼集，使其依賴於通用測試原始碼集。然後，按照 IDE 的建議新增任何缺失的 import。

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

    2.  將以下程式碼新增到 `android.defaultConfig {}` 區塊，以組態 Android 測試儀器化執行器：

        ```kotlin
        android {
            //...
            defaultConfig {
                //...
                testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
            }
        }
        ```

    3.  為 `androidTarget` 新增所需的相依性：

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

現在，您已準備好為 Compose Multiplatform UI 編寫和執行通用測試。

### 編寫和執行通用測試

在 `composeApp/src/commonTest/kotlin` 目錄中，建立一個名為 `ExampleTest.kt` 的檔案，並將以下程式碼複製到其中：

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
        // Declares a mock UI to demonstrate API calls
        //
        // Replace with your own declarations to test the code of your project
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

        // Tests the declared UI with assertions and actions of the Compose Multiplatform testing API
        onNodeWithTag("text").assertTextEquals("Hello")
        onNodeWithTag("button").performClick()
        onNodeWithTag("text").assertTextEquals("Compose")
    }
}
```

要執行測試：

<Tabs>
<TabItem title="iOS 模擬器">

您有兩個選項：
*   在 Android Studio 中，您可以按一下 `myTest()` 函數旁邊行號區中的綠色執行圖示，選擇 **Run** 並選擇 iOS 目標進行測試。
*   在終端中執行以下指令：

    ```shell
    ./gradlew :composeApp:iosSimulatorArm64Test
    ```

</TabItem>
<TabItem title="Android 模擬器">

在終端中執行此指令：

```shell
./gradlew :composeApp:connectedAndroidTest
```

目前，您無法使用 `android (local)` 測試組態執行通用 Compose Multiplatform 測試，因此 Android Studio 中的行號區圖示等將無濟於事。

</TabItem>
<TabItem title="桌面">

您有兩個選項：
*   按一下 `myTest()` 函數旁邊行號區中的綠色執行圖示，然後選擇 **Run&nbsp;|&nbsp;desktop**。
*   在終端中執行以下指令：

    ```shell
    ./gradlew :composeApp:desktopTest
    ```

</TabItem>
<TabItem title="Wasm (無頭瀏覽器)">

在終端中執行此指令：

```shell
./gradlew :composeApp:wasmJsTest
```

</TabItem>
</Tabs>

## 後續步驟

現在您已經掌握了 Compose Multiplatform UI 測試的訣竅，您可能想查看更多與測試相關的資源：
*   有關 Kotlin Multiplatform 專案中測試的總體概述，請參閱 [了解基本專案結構](multiplatform-discover-project.md#integration-with-tests) 和 [測試您的多平台應用程式](multiplatform-run-tests.md) 教學課程。
*   有關設定和執行桌面目標的 JUnit 測試的詳細資訊，請參閱 [使用 JUnit 測試 Compose Multiplatform UI](compose-desktop-ui-testing.md)。
*   有關本地化測試，請參閱 [undefined](compose-localization-tests.md#testing-locales-on-different-platforms)。
*   Android Studio 文件中的 [測試您的應用程式](https://developer.android.com/studio/test) 文章涵蓋了 Android Studio 中更進階的測試，包括自動化。