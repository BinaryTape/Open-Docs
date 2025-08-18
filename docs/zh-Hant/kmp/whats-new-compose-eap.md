[//]: # (title: Compose Multiplatform 1.6.10-rc02 的新功能)

以下是本次 EAP 功能發布的重點：

*   [支援帶有 Compose Multiplatform 資源的多模組專案](#support-for-multimodule-projects-with-compose-multiplatform-resources)
*   [實驗性導航庫](#experimental-navigation-library)
*   [帶有實驗性通用 ViewModel 的生命週期庫](#lifecycle-library)
*   [已知問題](#known-issues)

請參閱本次發布的完整變更列表 [在 GitHub 上](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-beta01-april-2024)。

## 依賴項

*   Gradle 外掛程式 `org.jetbrains.compose`，版本 1.6.10-rc01。基於 Jetpack Compose 庫：
    *   [Compiler 1.5.13](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.13)
    *   [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
    *   [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
    *   [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
    *   [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
    *   [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
*   Lifecycle 庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0-rc02`。基於 [Jetpack Lifecycle 2.8.0-rc01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0-rc01)。
*   Navigation 庫 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha05`。基於 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)。

## 破壞性變更

### Kotlin 2.0.0 需要新的 Compose 編譯器 Gradle 外掛程式

從 Kotlin 2.0.0-RC2 開始，Compose Multiplatform 需要新的 Compose 編譯器 Gradle 外掛程式。
有關詳細資訊，請參閱[遷移指南](compose-compiler.md#migrating-a-compose-multiplatform-project)。

## 跨平台

### 資源

#### 穩定的資源庫

[資源庫 API](compose-multiplatform-resources.md) 的大部分內容現已視為穩定。

#### 支援帶有 Compose Multiplatform 資源的多模組專案

從 Compose Multiplatform 1.6.10-beta01 開始，
您可以將資源儲存在任何 Gradle 模組和任何來源集 (source set) 中，並發布包含資源的專案和庫。

若要啟用多模組支援，請將您的專案更新至 Kotlin 2.0.0 或更新版本，以及 Gradle 7.6 或更新版本。

#### 多平台資源的配置 DSL

您現在可以微調專案中的 `Res` 類別生成：更改類別的模態 (modality) 和指定套件，
以及選擇生成條件：始終生成、永不生成或僅在明確依賴資源庫時生成。

有關詳細資訊，請參閱[文件部分](compose-multiplatform-resources.md#configuration)。

#### 用於生成資源 URI 的公開函式

新的 `getUri()` 函式允許您將資源的平台相關 URI 傳遞給外部庫，
以便它們可以直接存取檔案。
有關詳細資訊，請參閱[文件](compose-multiplatform-resources.md#accessing-multiplatform-resources-from-external-libraries)。

#### 字串資源的複數形式

您現在可以定義複數形式 (數量字串) 以及其他多平台字串資源。
有關詳細資訊，請參閱[文件](compose-multiplatform-resources.md#plurals)。

#### 支援三字母語系代碼

[語言限定符](compose-multiplatform-resources.md#language-and-regional-qualifiers) 現已支援用於語系代碼的 alpha-3 (ISO 639-2) 代碼。

#### 圖像和字體的實驗性位元組陣列函式

您可以試用兩個允許將字體和圖像作為位元組陣列獲取的函式：
`getDrawableResourceBytes` 和 `getFontResourceBytes`。
這些函式旨在協助從第三方庫存取多平台資源。

有關詳細資訊，請參閱 [pull request](https://github.com/JetBrains/compose-multiplatform/pull/4651)。

### 實驗性導航庫

基於 Jetpack Compose 的通用導航庫現已可用。
有關詳細資訊，請參閱[文件](compose-navigation-routing.md)。

此版本的關鍵限制：
*   [深度連結](https://developer.android.com/guide/navigation/design/deep-link) (處理或追蹤它們) 尚未支援。
*   [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 函式
    和 [預測性返回手勢](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)
    僅在 Android 上支援。

### 生命週期庫

基於 Jetpack lifecycle 的通用生命週期庫現已可用，有關詳細資訊，請參閱[文件](compose-lifecycle.md)。

該庫的引入主要是為了支援通用導航功能，但它也提供了實驗性的
跨平台 `ViewModel` 實作，並包含一個您可以為專案實作的通用 `LifecycleOwner` 介面。

Compose Multiplatform 也提供了通用的 `ViewModelStoreOwner` 實作。

### 支援 Kotlin 2.0.0

Kotlin 2.0.0-RC2 與新的 Compose 編譯器 Gradle 外掛程式一同發布。
若要將 Compose Multiplatform 與最新編譯器版本一起使用，請將外掛程式應用於專案中的模組
(有關詳細資訊，請參閱[遷移指南](compose-compiler.md#migrating-a-compose-multiplatform-project))。

## 桌面

### BasicTextField2 的基本支援

`BasicTextField2` Compose 元件現在在桌面目標上獲得了基本級別的支援。
如果您的專案絕對需要它，或者想測試它，請使用它，但請記住可能存在未涵蓋的邊緣情況。
例如，`BasicTextField2` 目前不支援 IME 事件，因此您將無法使用虛擬鍵盤進行中文、日文或韓文輸入。

該元件的完整支援以及對其他平台的支援計劃在 Compose Multiplatform 1.7.0 版本中實現。

### DialogWindow 的 alwaysOnTop 旗標

為了避免您的對話方塊視窗被覆蓋，您現在可以為 `DialogWindow` 可組合項使用 `alwaysOnTop` 旗標。

有關詳細資訊，請參閱 [pull request](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)。

## iOS

### 無障礙支援改進

在此版本中：

*   對話方塊和彈出視窗已正確整合無障礙功能，
*   使用 `UIKitView` 和 `UIKitViewController` 建立的互通視圖現在可透過 Accessibility Services 存取，
*   Accessibility API 支援 `LiveRegion` 語義，
*   支援[無障礙捲動](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)，
*   支援 `HapticFeedback`。

### 適用於 iOS 17 及更高版本的選取容器放大鏡

Compose Multiplatform 在 iOS 上的選取容器現在可模擬原生放大工具。

![iPhone 聊天應用程式的螢幕截圖，文字放大鏡處於啟用狀態](compose-1610-ios-magnifier.png){width=390}

### 對話方塊置中的軟體鍵盤內嵌

`Dialog` 可組合項的行為現在與 Android 一致：當軟體鍵盤出現在螢幕上時，對話方塊會考慮應用程式視窗的有效高度進行置中。
可以使用 `DialogProperties.useSoftwareKeyboardInset` 屬性禁用此功能。

## 網頁

### 基本 IME 鍵盤支援

Compose Multiplatform 的網頁目標現在支援基本虛擬 (IME) 鍵盤。

## Gradle 外掛程式

### 修改 macOS 最低版本的可能性

在以前的版本中，macOS 應用程式無法在不包含 Intel 版本的情況下上傳到 App Store。
您現在可以在平台特定的 Compose Multiplatform 選項中設定應用程式的最低 macOS 版本：

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

有關詳細資訊，請參閱 [pull request](https://github.com/JetBrains/compose-multiplatform/pull/4271)。

### 支援 Proguard 的 uber JAR 創建選項

您現在可以使用 ProGuard Gradle 任務創建 uber JAR (包含應用程式及其所有依賴項 JAR 的複雜套件)。

有關詳細資訊，請參閱 [pull request](https://github.com/JetBrains/compose-multiplatform/pull/4136)。

<!--TODO add link to the GitHub tutorial mentioned in PR when it's updated  -->

## 已知問題

### MissingResourceException

將 Kotlin 版本從 1.9.x 更改為 2.0.0 (或反之) 後，您可能會遇到 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 錯誤。
若要解決此問題，請刪除專案中的 `build` 目錄：這包括位於專案根目錄和模組資料夾中的資料夾。

### NativeCodeGeneratorException

某些專案的 iOS 編譯可能會因以下錯誤而失敗：

```
org.jetbrains.kotlin.backend.konan.llvm.NativeCodeGeneratorException: Exception during generating code for following declaration: private fun $init_global()
```

有關詳細資訊，請關注 [GitHub 問題](https://github.com/JetBrains/compose-multiplatform/issues/4809)。