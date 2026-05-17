[//]: # (title: Compose Multiplatform 1.11.0 的新功能)

以下是此功能發佈的亮點：

* [原生 iOS 文字輸入](#native-text-input)
* [Compose UI 測試 API v2 版本](#compose-ui-tests-v2)
* [改進 Web 目標上的捲動](#scroll-on-web-targets-brought-in-line-with-native-ui)

您可以在 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.11.0) 上找到完整的變更清單。
此版本的特定元件版本列在[相依性](#dependencies)部分。

## 破壞性變更與棄用

### 非 Android 目標的著色器（Shader）包裝類別

對於非 Android 目標，`Shader` 型別已從 `org.jetbrains.skia.Shader` 的 `actual typealias` 重構為 Compose 特定的包裝類別。此變更將通用 API 與直接的 Skia/Skiko 相依性解耦。

遷移步驟：

* 要在 Compose API 中使用 Skia/Skiko 著色器，請使用 `SkShader.asComposeShader()` 進行封裝。
* 要從 Compose `Shader` 存取低階 Skia 型別，請使用 `Shader.skiaShader` 擴充屬性。
* 如果您使用的第三方程式庫依賴於 `Shader` API，請將其更新至較新的相容版本。

### 最低 Kotlin 版本提升

如果您的專案包含原生或 Web 目標，最新功能需要升級至 Kotlin 2.3.10。

### iOS 目標支援變更

Compose Multiplatform 不再支援 Apple x86_64 目標，因為這些目標在 Kotlin 中已被棄用。因此，`iosX64` 和 `macosX64` 目標已從所有模組中完全移除。

我們還將最低支援的 iOS 版本從 13.0 提升至 14.0。

### 棄用

* 在 Compose Multiplatform 1.9.0 中，我們[引入了 `WebElementView`](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html#new-api-for-embedding-html-content) 可組合項，以便將 HTML 元素無縫整合到您的 Web 應用程式中。事實證明所選的名稱有些不明確，因此我們將其更名為 `HtmlElementView`，以更好地反映其特定於 HTML 的用途。`WebElementView` 版本已被棄用，建議改用 `HtmlElementView`。
* `Key.Home` 已被棄用，因為其對應錯誤。請使用 `Key.MoveHome` 進行鍵盤導覽，或使用 `Key.SystemHome` 進行系統級操作。

## 跨平台

### Compose UI 測試 v2

Compose Multiplatform 在非 Android 目標上引入了對 [v2 `ComposeUiTest` API](https://developer.android.com/develop/ui/compose/testing/migrate-v2) 的支援。這些新 API 使用 `StandardTestDispatcher` 作為預設測試分配器，而非 `UnconfinedTestDispatcher`。此變更確保協同程式（coroutine）根據事件佇列按順序執行，從而提高測試的可靠性並與正式環境行為保持一致。

我們還在 Compose UI 測試 v2 中增加了對 `effectContext` 參數的支援。此參數允許您在執行組合（composition）時指定自訂的協同程式內容（coroutine context）。

先前提供的測試 API，例如 `runComposeUiTest`、`runSkikoComposeUiTest` 和 `runDesktopComposeUiTest`，現在已被棄用，建議改用其 v2 版本。

### Skia 更新至 Milestone 144

Compose Multiplatform 透過 Skiko 使用的 Skia 版本已更新至 Milestone 144。

先前使用的 Skia 版本為 Milestone 138。
您可以在[版本說明](https://skia.googlesource.com/skia/+/refs/heads/chrome/m144/RELEASE_NOTES.md)中查看這些版本之間的變更。

## iOS

### 原生文字輸入
<primary-label ref="Experimental"/>

Compose Multiplatform 引入了一種新的文字輸入實作，使用原生 iOS `UIView` 透過 `UITextInput` 和 `UIKeyInput` 協定來管理輸入。這實現了完全原生的 iOS 文字編輯行為，包括精確的插入號移動、原生手勢、原生選取處理，以及帶有 `Autofill`、`Translate` 和 `Search` 等項目的系統操作功能表。這種新方法符合原生 iOS 的外觀與感受，同時也提高了與未來 Apple 更新的相容性。

雖然現有的 Compose Multiplatform 文字輸入仍然是保持跨平台一致性的穩定選擇，但原生方法則側重於專為 iOS 量身定制的使用者體驗。

要啟用新的文字輸入，請在 iOS 原始碼集（source set）中使用 `usingNativeTextInput` 選項：

```kotlin
@ExperimentalComposeUiApi
BasicTextField(
    value = state,
    keyboardOptions = KeyboardOptions(
        platformImeOptions = PlatformImeOptions {
            usingNativeTextInput(true)
        }
    )
)
```

新的原生文字輸入同時支援 `BasicTextField(TextFieldValue)` 和 `BasicTextField(TextFieldState)` API，並且與透過 `isNewContextMenuEnabled` 旗標啟用的新操作功能表 API 相容。

### 預設啟用並行渲染

在 Compose Multiplatform 1.8.0 中，我們[引入了](whats-new-compose-180.md#opt-in-concurrent-rendering)將渲染任務卸載到專用渲染執行緒的實驗性功能，作為一種選擇性加入（opt-in）功能。

從 Compose Multiplatform 1.11.0 開始，並行渲染已改為預設啟用。

## Web

### Web 目標上的捲動已與原生 UI 保持一致

在 Compose Multiplatform 中，Web 上的捲動效能一直落後於原生 UI。在 1.11.0 版本中，我們對觸控處理進行了大量重構和修正，使 Compose Web 應用程式的捲動與其他可用目標保持一致。您可以在最新[網頁版的 KotlinConf 應用程式](https://jetbrains.github.io/kotlinconf-app/)中看到這些改進的效果。

作為這項工作的一部分，[Coil 在 Web 上的圖片解碼也得到了改進](https://github.com/coil-kt/coil/pull/3305)。如果您使用 Coil，請確保更新至 3.4.0 版本以獲得最佳體驗。

修正清單以及改進的說明與示範可在問題 [CMP-9727](https://youtrack.jetbrains.com/issue/CMP-9727) 中找到。

## 相依性

| 程式庫 | Maven 座標 | 基於 Jetpack 版本 |
|--------------------|-----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Runtime            | `org.jetbrains.compose.runtime:runtime*:1.11.0`                       | [Runtime 1.11.1](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.11.1)                                     |
| UI                 | `org.jetbrains.compose.ui:ui*:1.11.0`                                 | [UI 1.11.1](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.11.1)                                               |
| Foundation         | `org.jetbrains.compose.foundation:foundation*:1.11.0`                 | [Foundation 1.11.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.11.1)                               |
| Material           | `org.jetbrains.compose.material:material*:1.11.0`                     | [Material 1.11.1](https://developer.android.com/jetpack/androidx/releases/compose-material#1.11.1)                                   |
| Material3          | `org.jetbrains.compose.material3:material3*:1.11.0-alpha07`           | [Material3 1.5.0-alpha17](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha17)                   |
| Material3 Adaptive | `org.jetbrains.compose.material3.adaptive:adaptive*:1.3.0-alpha07`    | [Material3 Adaptive 1.3.0-alpha10](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.3.0-alpha10) |
| Lifecycle          | `org.jetbrains.androidx.lifecycle:lifecycle-*:2.11.0-beta01`          | [Lifecycle 2.11.0-beta01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.11.0-beta01)                           |
| Navigation         | `org.jetbrains.androidx.navigation:navigation-*:2.9.2`                | [Navigation 2.9.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.7)                                         |
| Navigation3        | `org.jetbrains.androidx.navigation3:navigation3-*:1.1.1`              | [Navigation3 1.1.1](https://developer.android.com/jetpack/androidx/releases/navigation3#1.1.1)                                       |
| Navigation Event   | `org.jetbrains.androidx.navigationevent:navigationevent-compose:1.1.0` | [Navigation Event 1.1.1](https://developer.android.com/jetpack/androidx/releases/navigationevent#1.1.1)                              |
| Savedstate         | `org.jetbrains.androidx.savedstate:savedstate*:1.4.0`                 | [Savedstate 1.4.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.4.0)                                         |
| WindowManager Core | `org.jetbrains.androidx.window:window-core:1.5.1`                     | [WindowManager 1.5.1](https://developer.android.com/jetpack/androidx/releases/window#1.5.1)                                          |