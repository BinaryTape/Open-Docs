[//]: # (title: Compose Multiplatform 1.6.10 的新功能)

以下是此功能版本的重點摘要：

* [重大變更：新的 Compose 編譯器 Gradle 外掛程式](#breaking-change-new-compose-compiler-gradle-plugin)
* [支援多模組專案與 Compose Multiplatform 資源](#support-for-multimodule-projects-with-compose-multiplatform-resources)
* [實驗性導覽程式庫](#experimental-navigation-library)
* [包含實驗性通用 ViewModel 的生命週期程式庫](#lifecycle-library)
* [已知問題：MissingResourceException](#known-issue-missingresourceexception)

請參閱 [GitHub 上](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024)此版本的完整變更清單。

## 相依性

* Gradle 外掛程式 `org.jetbrains.compose` 版本 1.6.10。基於 Jetpack Compose 程式庫：
  * [Compiler 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
  * [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* 生命週期程式庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`。基於 [Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0)。
* 導覽程式庫 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`。基於 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)。

## 重大變更：新的 Compose 編譯器 Gradle 外掛程式

從 Kotlin 2.0.0 開始，Compose Multiplatform 需要新的 Compose 編譯器 Gradle 外掛程式。
詳情請參閱[遷移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)。

## 跨平台

### 資源

#### 穩定資源程式庫

[資源程式庫 API](compose-multiplatform-resources.md) 的大部分內容現在已被視為穩定。

#### 支援多模組專案與 Compose Multiplatform 資源

從 Compose Multiplatform 1.6.10 開始，
您可以將資源儲存在任何 Gradle 模組和任何原始碼集中，也可以發佈包含資源的專案和程式庫。

要啟用多模組支援，請將您的專案更新至 Kotlin 版本 2.0.0 或更新版本，以及 Gradle 7.6 或更新版本。

#### 多平台資源的配置 DSL

您現在可以微調專案中 `Res` 類別的產生：修改該類別的修飾符（modality）和指定的軟件包（package），以及選擇產生該類別的條件：一律產生、不產生，或僅在明確依賴資源程式庫時產生。

詳情請參閱[文件章節](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)。

#### 用於產生資源 URI 的公開函式

新的 `getUri()` 函式允許您將資源的平台相關 URI 傳遞給外部程式庫，以便它們可以直接存取該檔案。
詳情請參閱[文件](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)。

#### 字串資源的複數形式

您現在可以與其他多平台字串資源一起定義複數（數量字串）。
詳情請參閱[文件](compose-multiplatform-resources-usage.md#plurals)。

#### 支援三字母地區設定

[語言限定詞](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers)現在支援地區設定的 alpha-3 (ISO 639-2) 代碼。

#### 圖片與字體的實驗性位元組陣列函式

您可以嘗試兩個允許將字體和圖片作為位元組陣列獲取的函式：
`getDrawableResourceBytes()` 與 `getFontResourceBytes()`。
這些函式旨在協助從第三方程式庫存取多平台資源。

詳情請參閱 [提取要求 (PR)](https://github.com/JetBrains/compose-multiplatform/pull/4651)。

### 實驗性導覽程式庫

基於 Jetpack Compose 的通用導覽程式庫現已推出。
詳情請參閱[文件](compose-navigation-routing.md)。

此版本的關鍵限制：
* 尚未支援[深層連結](https://developer.android.com/guide/navigation/design/deep-link)（處理或跟隨連結）。
* [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 函式與[預測性返回手勢](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)僅在 Android 上受支援。

### 生命週期程式庫

基於 Jetpack lifecycle 的通用生命週期程式庫現已推出，詳情請參閱[文件](compose-lifecycle.md)。

該程式庫主要是為了支援通用導覽功能而引入的，但它也提供了一個實驗性的跨平台 `ViewModel` 實作，並包含一個可用於您專案的通用 `LifecycleOwner` 介面。

Compose Multiplatform 還提供了一個通用的 `ViewModelStoreOwner` 實作。

### 支援 Kotlin 2.0.0

Kotlin 2.0.0 與 Compose 編譯器的新 Gradle 外掛程式一同發佈。
要在最新的編譯器版本中使用 Compose Multiplatform，請將外掛程式套用於專案中的模組（詳情請參閱[遷移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)）。

## 桌面

### BasicTextField2 的基礎支援

`BasicTextField2` Compose 組件現在在桌面目標上提供基礎層級的支援。
如果您的專案絕對需要它或想進行測試，請使用它，但請記住可能存在未涵蓋的邊緣情況。
例如，`BasicTextField2` 目前不支援 IME 事件，因此您將無法使用中文、日文或韓文的虛擬鍵盤。

計畫在 Compose Multiplatform 1.7.0 版本中提供對該組件的完整支援以及對其他平台的支援。

### DialogWindow 的 alwaysOnTop 旗標

為了避免您的對話方塊視窗被覆蓋，您現在可以對 `DialogWindow` 可組合項使用 `alwaysOnTop` 旗標。

詳情請參閱 [提取要求 (PR)](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)。

## iOS

### 無障礙功能支援改進

在此版本中：

* 對話方塊和快顯視窗已與無障礙功能正確整合，
* 使用 `UIKitView` 和 `UIKitViewController` 建立的互操作檢視現在可以由無障礙服務存取，
* 無障礙 API 支援 `LiveRegion` 語意，
* 支援[無障礙捲動](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)，
* 支援 `HapticFeedback`。

### iOS 17 及更高版本的選取容器放大鏡

iOS 上的 Compose Multiplatform 選取容器現在會模擬原生的放大工具。

![iPhone 聊天應用程式在文字放大鏡啟動時的螢幕截圖](compose-1610-ios-magnifier.png){width=390}

### 用於 Dialog 居中的軟體鍵盤內嵌 (inset)

`Dialog` 可組合項的行為現在與 Android 一致：當軟體鍵盤出現在螢幕上時，對話方塊會考慮應用程式視窗的有效高度進行居中。
可以使用 `DialogProperties.useSoftwareKeyboardInset` 屬性來停用此功能。

## Web

### Alpha 階段的 Kotlin/Wasm 支援

實驗性的 Web 版 Compose Multiplatform 現在進入 Alpha 階段：

* 大部分的 Web 功能與桌面版 Compose Multiplatform 一致。
* 團隊致力於推動 Web 平台走向正式發佈。
* 下一步將是對大多數組件進行徹底的瀏覽器適配。

請參考[第一個應用程式教學](quickstart.md)以了解如何設定並執行具有共享 UI 程式碼的 Web 應用程式。

### 基礎 IME 鍵盤支援

Compose Multiplatform 的 Web 目標現在對虛擬 (IME) 鍵盤提供基礎支援。

## Gradle 外掛程式

### 可以修改 macOS 最低版本

在之前的版本中，如果不包含 Intel 版本，就無法將 macOS 應用程式上傳到 App Store。
您現在可以在平台特定的 Compose Multiplatform 選項中為您的應用程式設定最低 macOS 版本：

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

詳情請參閱 [提取要求 (PR)](https://github.com/JetBrains/compose-multiplatform/pull/4271)。

### 支援建立具有 Proguard 支援的 uber JAR

您現在可以使用 ProGuard Gradle 任務建立 uber JAR（包含應用程式及其所有相依性的 JAR 檔案的複雜軟件包）。

詳情請參閱[縮減與混淆](compose-native-distribution.md#minification-and-obfuscation)指南。

### 已知問題：MissingResourceException

從 Kotlin 1.9.x 切換到 2.0.0（或反向切換）後，您可能會遇到 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 錯誤。
要解決此問題，請刪除專案中所有的 `build` 目錄。
這包括位於專案根目錄和模組目錄中的目錄。