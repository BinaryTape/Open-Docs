[//]: # (title: Compose Multiplatform 1.6.10 有什麼新功能)

以下是本次功能發佈的重點：

* [破壞性變更：新的 Compose 編譯器 Gradle 外掛程式](#breaking-change-new-compose-compiler-gradle-plugin)
* [支援具有 Compose 多平台資源的多模組專案](#support-for-multimodule-projects-with-compose-multiplatform-resources)
* [實驗性導航函式庫](#experimental-navigation-library)
* [具有實驗性通用 ViewModel 的生命週期函式庫](#lifecycle-library)
* [已知問題：MissingResourceException](#known-issue-missingresourceexception)

請參閱此版本在 [GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024) 上的完整變更清單。

## 依賴項

* Gradle 外掛程式 `org.jetbrains.compose`，版本 1.6.10。基於 Jetpack Compose 函式庫：
  * [編譯器 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
  * [執行時 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* 生命週期函式庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`。基於 [Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0)。
* 導航函式庫 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`。基於 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)。

## 破壞性變更：新的 Compose 編譯器 Gradle 外掛程式

從 Kotlin 2.0.0 開始，Compose 多平台需要新的 Compose 編譯器 Gradle 外掛程式。
詳情請參閱[遷移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)。

## 跨平台

### 資源

#### 穩定資源函式庫

[資源函式庫 API](compose-multiplatform-resources.md) 的大部分內容現在已被視為穩定版。

#### 支援具有 Compose 多平台資源的多模組專案

從 Compose 多平台 1.6.10 開始，
您可以在任何 Gradle 模組和任何原始碼集中儲存資源，並發佈包含資源的專案和函式庫。

若要啟用多模組支援，請將您的專案更新至 Kotlin 2.0.0 或更高版本以及 Gradle 7.6 或更高版本。

#### 多平台資源的組態 DSL

您現在可以微調專案中的 `Res` 類別產生：更改該類別的模態和分配的套件，以及選擇產生它的條件：始終、從不或僅在明確依賴資源函式庫時。

詳情請參閱[文件章節](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)。

#### 產生資源 URI 的公開函式

新的 `getUri()` 函式允許您將資源的平台相關 URI 傳遞給外部函式庫，
以便它們可以直接存取檔案。
詳情請參閱[文件](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)。

#### 字串資源的複數形式

您現在可以與其他多平台字串資源一同定義複數形式（數量字串）。
詳情請參閱[文件](compose-multiplatform-resources-usage.md#plurals)。

#### 支援三字母語系

[語言限定符](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers) 現在支援語系的 alpha-3 (ISO 639-2) 代碼。

#### 圖片與字型的實驗性位元組陣列函式

您可以試用兩個允許以位元組陣列形式擷取字型和圖片的函式：
`getDrawableResourceBytes()` 和 `getFontResourceBytes()`。
這些函式旨在協助從第三方函式庫存取多平台資源。

詳情請參閱[拉取請求](https://github.com/JetBrains/compose-multiplatform/pull/4651)。

### 實驗性導航函式庫

基於 Jetpack Compose 的通用導航函式庫現已可用。
詳情請參閱[文件](compose-navigation-routing.md)。

此版本的關鍵限制：
* [深層連結](https://developer.android.com/guide/navigation/design/deep-link)（處理或追蹤）尚未支援。
* [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 函式和[預測式返回手勢](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture) 僅在 Android 上受支援。

### 生命週期函式庫

基於 Jetpack 生命週期的通用生命週期函式庫現已可用，詳情請參閱[文件](compose-lifecycle.md)。

此函式庫主要用於支援通用導航功能，但它也提供了一個實驗性的跨平台 `ViewModel` 實作，並包含一個您可以在專案中實作的通用 `LifecycleOwner` 介面。

Compose 多平台還提供了一個通用的 `ViewModelStoreOwner` 實作。

### 支援 Kotlin 2.0.0

Kotlin 2.0.0 隨 Compose 編譯器的新 Gradle 外掛程式一同發佈。
若要將 Compose 多平台與最新的編譯器版本搭配使用，請將該外掛程式應用於專案中的模組（詳情請參閱[遷移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)）。

## 桌面

### BasicTextField2 的基本支援

`BasicTextField2` Compose 元件現在已在桌面目標上獲得基礎支援。
如果您的專案絕對需要它，或者只是為了測試，請使用它，但請記住，可能存在未涵蓋的邊緣情況。
例如，`BasicTextField2` 目前不支援 IME 事件，因此您將無法使用虛擬鍵盤輸入中文、日文或韓文。

該元件的完整支援以及對其他平台的支援計畫在 Compose 多平台 1.7.0 版本中發佈。

### DialogWindow 的 alwaysOnTop 旗標

為避免您的對話方塊視窗被覆蓋，您現在可以為 `DialogWindow` 可組合項使用 `alwaysOnTop` 旗標。

詳情請參閱[拉取請求](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)。

## iOS

### 無障礙功能支援改進

在此版本中：

* 對話方塊和彈出視窗已正確整合無障礙功能，
* 使用 `UIKitView` 和 `UIKitViewController` 建立的互通視圖現在可由 Accessibility Services 存取，
* `LiveRegion` 語義受到無障礙 API 的支援，
* [無障礙捲動](https://github.com/JetBrains/compose-multiplatform-core/pull/1169) 受支援，
* `HapticFeedback` 受支援。

### 適用於 iOS 17 及更高版本的選取容器放大鏡

iOS 上的 Compose 多平台選取容器現在可模擬原生放大工具。

![Screenshot of iPhone chat app with the text magnifier active](compose-1610-ios-magnifier.png){width=390}

### 用於對話方塊置中的軟體鍵盤內嵌

`Dialog` 可組合項的行為現在與 Android 對齊：當軟體鍵盤出現在螢幕上時，對話方塊會考慮應用程式視窗的有效高度進行置中。
有一個選項可以停用此功能，即使用 `DialogProperties.useSoftwareKeyboardInset` 屬性。

## Web

### Kotlin/Wasm 在 Alpha 階段的支援

用於 Web 的實驗性 Compose 多平台現已處於 Alpha 階段：

* 大部分 Web 功能都與桌面版 Compose 多平台相符。
* 團隊致力於將 Web 平台發佈。
* 下一步是徹底地將大多數元件進行瀏覽器適配。

請依照[第一個應用程式教學](quickstart.md) 來了解如何設定並執行具有共享 UI 程式碼的 Web 應用程式。

### 基本 IME 鍵盤支援

Compose 多平台的 Web 目標現在具備對虛擬 (IME) 鍵盤的基本支援。

## Gradle 外掛程式

### 修改 macOS 最低版本的可能性

在先前的版本中，若不包含 Intel 版本，則無法將 macOS 應用程式上傳至 App Store。
您現在可以在平台專屬的 Compose 多平台選項中，為您的應用程式設定最低 macOS 版本：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                minimumSystemVersion = "12.0"
            }
        }
    }
}
```

詳情請參閱[拉取請求](https://github.com/JetBrains/compose-multiplatform/pull/4271)。

### 支援 Proguard 建立 uber JARs 的選項

您現在可以使用 ProGuard Gradle 任務建立 uber JARs（包含應用程式及其所有依賴項 JARs 的複雜套件）。

詳情請參閱[最小化和混淆](compose-native-distribution.md#minification-and-obfuscation) 指南。

### 已知問題：MissingResourceException

從 Kotlin 1.9.x 切換到 2.0.0（或反之）後，您可能會遇到 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 錯誤。
若要解決此問題，請刪除專案中的所有 `build` 目錄。
這包括位於專案根目錄和模組目錄中的目錄。