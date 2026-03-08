[//]: # (title: Compose UI 預覽)

您可以建立 _預覽 (preview)_ 可組合項，以便在 IDE（IntelliJ IDEA 和 Android Studio）中查看轉譯後的 UI，而無需執行模擬器。
此 [Jetpack Compose 核心功能](https://developer.android.com/develop/ui/compose/tooling/previews) 可讓您在各種配置中透過測試資料輕鬆呈現個別元件的可視化效果。
此外，您可以使用 [Compose Hot Reload](compose-hot-reload.md) 立即在執行於桌面 JVM 目標的即時應用程式中查看程式碼變更。

> 若要在 Kotlin Multiplatform 專案的共用程式碼中啟用 Compose 預覽，您需要一個 Android 目標，因為預覽相依於 Android 程式庫。
> 
{style="note"}

Compose Multiplatform 最初將有限的 `@Preview` 註解實作為自訂程式庫，但從 1.10.0 版本開始，此實作已被棄用，因為原始的 AndroidX 註解現在已完全支援多平台。

在此頁面中，您可以找到：

* [如何在不同專案配置的共用程式碼中啟用預覽](#preview-setup)，
* [如何使用和自訂預覽](#use-previews) 以及其他參數，
* [支援的 Compose Multiplatform、AGP 和註解組合概覽](#supported-configurations)。

## 預覽設定

如果您是從頭開始，可以使用 IDE 精靈建立 **新專案**，該專案已預先配置完成。

若要開始使用，只需安裝 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)，該外掛程式適用於 IntelliJ IDEA 和 Android Studio。
新專案將包含一個標註有 `@Preview` 的即用型 `App` 函式：

![IDE 中的預覽可組合項](compose-preview-split.png){width=700 style="block"}

若要在 **現有專案** 中啟用預覽支援，請將必要的相依性新增至 KMP 模組的 `build.gradle.kts` 檔案：

1. `commonMain` 原始碼集的註解相依性：根據 Compose Multiplatform 版本，選擇舊的或新的註解。
2. classpath 上的工具相依性，其宣告取決於 Android 配置。

註解相依性應指向其中一個 `@Preview` 實作，例如：

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            // 新的註解，可在 CMP 1.10.0 及更高版本中使用
            implementation("org.jetbrains.compose.ui:ui-tooling-preview:1.10.0")
            // 若要匯入新註解：
            // import androidx.compose.ui.tooling.preview.Preview

            // 舊的註解，在 CMP 1.10.0 中已棄用
            implementation("org.jetbrains.compose.components:components-ui-tooling-preview:1.10.0")
            // 若要匯入舊註解：
            // import org.jetbrains.compose.ui.tooling.preview.Preview
        }
    }
}
```

工具相依性應宣告在共用程式碼模組 `build.gradle.kts` 檔案的根 `dependencies {}` 區塊中，有兩種方式，具體取決於您的 [Android 目標配置](#android-target-configurations)：

* 如果您使用 `com.android.application` 或 `com.android.library` 外掛程式：

    ```kotlin
    dependencies {
        debugImplementation("org.jetbrains.compose.ui:ui-tooling:1.10.0")
    }
    ```
* 如果您使用 `com.android.kotlin.multiplatform.library` 外掛程式：

    ```kotlin
    dependencies {
        androidRuntimeClasspath("org.jetbrains.compose.ui:ui-tooling:1.10.0")
    }
    ```

## 使用預覽

Compose Multiplatform 允許使用 Android 工具提供的完整預覽功能。
您可以讓預覽具有互動性、將預覽複製為圖片，或以不同參數顯示相同 `@Preview` 可組合項的多個版本。
如需可用功能的詳細資訊，請參閱 [Android 預覽指南](https://developer.android.com/develop/ui/compose/tooling/previews)。

<video src="compose_preview_interactive_mode.mp4" alt="Interactive mode" width="350" preview-src="compose_preview_interactive_mode.png"/>

透過配置其他參數，您可以控制 `@Composable` 函式在設計時預覽中的呈現方式。
Compose Multiplatform 支援 `@Preview` 註解的以下參數：

* `name`：預覽的顯示名稱。
* `group`：預覽的群組名稱，可實現邏輯組織並選擇性顯示相關預覽。
* `widthDp`：最大寬度，單位為 [dp](https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/Dp)。
* `heightDp`：最大高度，單位為 dp。
* `locale`：應用程式的目前語系。
* `showBackground`：決定是否對預覽套用預設背景顏色的旗標。
* `backgroundColor`：定義預覽背景顏色的 32 位元 ARGB 顏色整數。

## 支援的配置

根據您的相依性版本和專案的配置樣式，有幾種支援的組合可用於啟用 Compose 預覽：

* Compose Multiplatform 1.9，使用舊的 `@Preview` 註解，且 Android 使用 `androidTarget {}` 配置。
* Compose Multiplatform 1.10，使用舊的 `@Preview` 註解，且 Android 使用 `androidTarget {}` 配置。
* Compose Multiplatform 1.10，使用新的 `@Preview` 註解，且 Android 使用 `androidTarget {}` 配置。
* Compose Multiplatform 1.10，使用新的 `@Preview` 註解，且 Android 配合 AGP 9.0 使用 `androidLibrary {}` 配置。有關升級 KMP 應用程式的詳細資訊，請參閱我們的 [AGP 9.0 遷移指南](multiplatform-project-agp-9-migration.md)。

> IntelliJ IDEA 即將支援 AGP 9.0，預計將於 2026 年第 1 季推出。
>
{style="note"}

### 可用的註解

Compose Multiplatform 中有兩種 `@Preview` 註解可用：

* `androidx.compose.ui.tooling.preview.Preview`
  * 這是原始的 Android Jetpack 註解，自 Compose Multiplatform 1.10 起支援多平台。它支援共用程式碼中 Android 宣告的所有參數。
  * 必要的執行時相依性為 `org.jetbrains.compose.ui:ui-tooling-preview`。
  * 這是未來建議使用的註解。 
* `org.jetbrains.compose.ui.tooling.preview.Preview`
  * 這是該註解的第一個多平台實作，模擬了僅限 Android 的體驗。它支援有限數量的參數，但提供基本的預覽功能。
  * 必要的執行時相依性為 `org.jetbrains.compose.components:components-ui-tooling-preview`。
  * 此註解在 Compose Multiplatform 1.10 中已棄用。

若要在您的共用程式碼中使用其中一個註解，請為您的 `commonMain` 原始碼集新增適當的執行時相依性，[如上所示](#preview-setup)。

### Android 目標配置

如果您的專案使用 Android Gradle 外掛程式 8.x，則專案的 Kotlin Multiplatform 部分應使用 Android 應用程式 (`com.android.application`) 或 Android 程式庫 (`com.android.library`) 外掛程式，且 Android 配置包含在 `build.gradle.kts` 檔案的 `androidTarget {}` 區塊中。

對於 Android Gradle 外掛程式 9.0，有一個新的 [KMP Android 程式庫外掛程式](https://developer.android.com/kotlin/multiplatform/plugin) (`com.android.kotlin.multiplatform.library`)，它引入了用於 Android 配置的 `androidLibrary {}` 區塊。雖然也可以在 AGP 8.x 中使用此外掛程式，但該組合存在已知問題，不建議使用。 

> 最新穩定版的 Android Studio 已支援 AGP 9.0，但 IntelliJ IDEA 尚未支援，預計將於 2026 年第 1 季推出。
>
{style="note"}

有關升級到 AGP 9.0 的詳細資訊，請參閱 [我們的遷移頁面](multiplatform-project-agp-9-migration.md)。