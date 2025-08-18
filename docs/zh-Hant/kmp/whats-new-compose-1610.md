[//]: # (title: Compose Multiplatform 1.6.10 新功能)

以下是此功能版本的主要亮點：

* [破壞性變更：新的 Compose 編譯器 Gradle 外掛程式](#breaking-change-new-compose-compiler-gradle-plugin)
* [支援具有 Compose Multiplatform 資源的多模組專案](#support-for-multimodule-projects-with-compose-multiplatform-resources)
* [實驗性導航函式庫](#experimental-navigation-library)
* [具實驗性通用 ViewModel 的生命週期函式庫](#lifecycle-library)
* [已知問題：MissingResourceException](#known-issue-missingresourceexception)

請參閱此版本的完整變更列表 [在 GitHub 上](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024)。

## 依賴項

* Gradle 外掛程式 `org.jetbrains.compose`，版本 1.6.10。基於 Jetpack Compose 函式庫：
  * [Compiler 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
  * [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* 生命週期函式庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`。基於 [Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0)。
* 導航函式庫 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`。基於 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)。

## 破壞性變更：新的 Compose 編譯器 Gradle 外掛程式

從 Kotlin 2.0.0 開始，Compose Multiplatform 需要新的 Compose 編譯器 Gradle 外掛程式。
請參閱 [遷移指南](compose-compiler.md#migrating-a-compose-multiplatform-project) 以獲取詳細資訊。

## 跨平台

### 資源

#### 穩定資源函式庫

[資源函式庫 API](compose-multiplatform-resources.md) 的大部分現在被認為是穩定的。

#### 支援具有 Compose Multiplatform 資源的多模組專案

從 Compose Multiplatform 1.6.10 開始，
您可以在任何 Gradle 模組和任何來源集 (source set) 中儲存資源，並發佈包含資源的專案和函式庫。

若要啟用多模組支援，請將您的專案更新至 Kotlin 2.0.0 或更新版本，以及 Gradle 7.6 或更新版本。

#### 多平台資源的配置 DSL

您現在可以微調專案中的 `Res` 類別生成：更改類別的模態 (modality) 和指定套件，並選擇生成條件：始終、從不，或僅在明確依賴資源函式庫時。

請參閱 [文件章節](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation) 以獲取詳細資訊。

#### 用於生成資源 URI 的公共函數

新的 `getUri()` 函數允許您將資源的平台相關 URI 傳遞給外部函式庫，以便它們可以直接存取檔案。
請參閱 [文件](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries) 以獲取詳細資訊。

#### 字串資源的複數形式

您現在可以與其他多平台字串資源一同定義複數形式（數量字串）。
請參閱 [文件](compose-multiplatform-resources-usage.md#plurals) 以獲取詳細資訊。

#### 支援三字母語系

[語言限定符](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers) 現在支援語系的 alpha-3 (ISO 639-2) 代碼。

#### 影像與字型的實驗性位元組陣列函數

您可以嘗試兩個允許將字型和影像作為位元組陣列擷取的函數：`getDrawableResourceBytes()` 和 `getFontResourceBytes()`。
這些函數旨在幫助從第三方函式庫存取多平台資源。

請參閱 [pull request](https://github.com/JetBrains/compose-multiplatform/pull/4651) 以獲取詳細資訊。

### 實驗性導航函式庫

基於 Jetpack Compose 的通用導航函式庫現已可用。
欲了解詳情，請參閱 [文件](compose-navigation-routing.md)。

此版本的關鍵限制：
* [深層連結](https://developer.android.com/guide/navigation/design/deep-link)（處理或追蹤）尚不支援。
* [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 函數和 [預測性返回手勢](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture) 僅在 Android 上支援。

### 生命週期函式庫

基於 Jetpack 生命週期的通用生命週期函式庫現已可用，請參閱 [文件](compose-lifecycle.md) 以獲取詳細資訊。

此函式庫主要為支援通用導航功能而引入，但也提供實驗性的跨平台 `ViewModel` 實作，並包含一個您可以為專案實作的通用 `LifecycleOwner` 介面。

Compose Multiplatform 也提供通用的 `ViewModelStoreOwner` 實作。

### 支援 Kotlin 2.0.0

Kotlin 2.0.0 隨 Compose 編譯器的新 Gradle 外掛程式一同發布。
若要將 Compose Multiplatform 與最新編譯器版本一起使用，請將外掛程式應用於專案中的模組（請參閱 [遷移指南](compose-compiler.md#migrating-a-compose-multiplatform-project) 以獲取詳細資訊）。

## 桌面

### 對 BasicTextField2 的基本支援

在桌面目標上，現在已基本支援 `BasicTextField2` Compose 元件。
如果您的專案絕對需要它，或只是想測試它，都可以使用，但請記住可能存在未涵蓋的邊緣情況。
例如，`BasicTextField2` 目前不支援 IME 事件，因此您將無法使用虛擬鍵盤輸入中文、日文或韓文。

該元件的完整支援及對其他平台的支援計畫在 Compose Multiplatform 1.7.0 版本中實現。

### DialogWindow 的 alwaysOnTop 旗標

為避免您的對話視窗被覆蓋，您現在可以為 `DialogWindow` 可組合項使用 `alwaysOnTop` 旗標。

請參閱 [pull request](https://github.com/JetBrains/compose-multiplatform-core/pull/1120) 以獲取詳細資訊。

## iOS

### 輔助功能支援改進

在此版本中：

* 對話框和彈出視窗已正確整合輔助功能，
* 使用 `UIKitView` 和 `UIKitViewController` 建立的互操作視圖現在可由輔助服務 (Accessibility Services) 存取，
* 輔助功能 API 支援 `LiveRegion` 語義，
* 支援 [輔助功能捲動](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)，
* 支援 `HapticFeedback`。

### iOS 17 及更高版本選取容器放大鏡

iOS 上的 Compose Multiplatform 選取容器現在可模擬原生放大工具。

![Screenshot of iPhone chat app with the text magnifier active](compose-1610-ios-magnifier.png){width=390}

### 對話框置中的軟體鍵盤內嵌

對話框可組合項 `Dialog` 的行為現在與 Android 一致：當軟體鍵盤出現在螢幕上時，對話框會考慮應用程式視窗的有效高度進行置中。
可以使用 `DialogProperties.useSoftwareKeyboardInset` 屬性來停用此功能。

## 網頁

### Kotlin/Wasm 支援處於 Alpha 階段

實驗性的網頁版 Compose Multiplatform 現已進入 Alpha 階段：

* 大多數網頁功能反映了桌面版 Compose Multiplatform。
* 團隊致力於將網頁平台推向正式發布。
* 下一步，將對大多數元件進行徹底的瀏覽器適應。

請依照 [第一個應用程式教學](quickstart.md) 查看如何設定和執行具有共用 UI 程式碼的網頁應用程式。

### 基本 IME 鍵盤支援

Compose Multiplatform 的網頁目標現在對虛擬（IME）鍵盤具有基本支援。

## Gradle 外掛程式

### 修改 macOS 最低版本的可能性

在舊版本中，如果不包含 Intel 版本，則無法將 macOS 應用程式上傳到 App Store。
您現在可以在特定平台 Compose Multiplatform 選項中為您的應用程式設定最低 macOS 版本：

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

請參閱 [pull request](https://github.com/JetBrains/compose-multiplatform/pull/4271) 以獲取詳細資訊。

### 支援 Proguard 建立 Uber JARs 的選項

您現在可以使用 ProGuard Gradle 任務建立 Uber JARs（包含應用程式及其所有依賴項 JAR 檔的複雜套件）。

請參閱 [縮減與混淆](compose-native-distribution.md#minification-and-obfuscation) 指南以獲取詳細資訊。

### 已知問題：MissingResourceException

在從 Kotlin 1.9.x 切換到 2.0.0（或反之）後，您可能會遇到 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 錯誤。
為了解決此問題，請刪除專案中所有的 `build` 目錄。
這包括位於專案根目錄和模組目錄中的目錄。