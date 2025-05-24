---
title: "iOS 應用程式的隱私權宣告 (Privacy manifest)"
---
如果你的 App 預計發佈到 Apple App Store，並且使用了[需要提供理由的 API (required reasons APIs)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)，
App Store Connect 可能會發出警告，指出該 App 沒有正確的隱私權資訊清單（privacy manifest）：

<img src="/img/app-store-required-reasons-warning.png" alt="Required reasons warning" width="700" style={{verticalAlign: 'middle'}}/>

這可能會影響任何 Apple 生態系統 App，不論是原生或多平台。你的 App 可能是透過第三方函式庫或 SDK 使用了需要提供理由的 API，這可能並不明顯。Kotlin Multiplatform 可能是使用了你未察覺的 API 的框架之一。

在本頁面中，你將找到問題的詳細描述以及處理建議。

:::tip
本頁面反映了 Kotlin 團隊目前對此問題的理解。
隨著我們獲得更多關於可接受的方法和解決方案的數據和知識，我們將更新此頁面以反映它們。

:::

## 問題是什麼

Apple 對 App Store 提交的要求[已於 2024 年春季變更](https://developer.apple.com/news/?id=r1henawx)。
[App Store Connect](https://appstoreconnect.apple.com) 不再接受未在其隱私權資訊清單中指定使用需要提供理由的 API 原因的 App。

這是一個自動檢查，而不是人工審核：你的 App 的程式碼會被分析，並且你會收到一封包含問題清單的電子郵件。該電子郵件將引用「ITMS-91053：缺少 API 宣告」問題，列出 App 中使用的所有屬於[需要提供理由](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)類別的 API 類別。

理想情況下，你的 App 使用的所有 SDK 都會提供自己的隱私權資訊清單，你無需擔心。但是，如果你的某些依賴項沒有這樣做，你的 App Store 提交可能會被標記。

## 如何解決

在你嘗試提交你的 App 並收到來自 App Store 的詳細問題清單後，你可以按照 Apple 的文件建立你的資訊清單：

* [隱私權資訊清單檔案概述 (Privacy manifest files overview)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
* [在隱私權資訊清單中描述資料使用 (Describing data use in privacy manifests)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests)
* [描述使用需要提供理由的 API (Describing use of required reason API)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)

產生的檔案是字典的集合。對於每個被訪問的 API 類型，從提供的清單中選擇一個或多個使用它的理由。Xcode 透過提供視覺化佈局和每個欄位有效值的下拉式清單來幫助編輯 `.xcprivacy` 檔案。

你可以使用[特殊工具](#find-usages-of-required-reason-apis)來尋找 Kotlin 框架的依賴項中需要提供理由的 API 的使用情況，並使用[單獨的插件](#place-the-xcprivacy-file-in-your-kotlin-artifacts)將 `.xcprivacy` 檔案與你的 Kotlin artifacts 捆綁在一起。

如果新的隱私權資訊清單無法滿足 App Store 的要求，或者你無法弄清楚如何完成這些步驟，請聯繫我們並在[這個 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-67603)中分享你的案例。

## 尋找需要提供理由的 API 的使用情況

你的 App 或其中一個依賴項中的 Kotlin 程式碼可能會從 `platform.posix` 等函式庫訪問需要提供理由的 API，例如 `fstat`：

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

在某些情況下，可能難以確定哪些依賴項使用需要提供理由的 API。為了幫助你找到它們，我們建立了一個簡單的工具。

要使用它，請在你的專案中宣告 Kotlin 框架的目錄中執行以下命令：

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

你也可以[單獨下載此腳本](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)，檢查它，然後使用 `python3` 執行它。

## 將 .xcprivacy 檔案放置在你的 Kotlin artifacts 中

如果你需要將 `PrivacyInfo.xcprivacy` 檔案與你的 Kotlin artifacts 捆綁在一起，請使用 `apple-privacy-manifests` 插件：

```kotlin
plugins {
    kotlin("multiplatform")
    kotlin("apple-privacy-manifests") version "1.0.0"
}

kotlin {
    privacyManifest {
        embed(
            privacyManifest = layout.projectDirectory.file("PrivacyInfo.xcprivacy").asFile,
        )
    }
}
```

該插件會將隱私權資訊清單檔案複製到[相應的輸出位置](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/adding_a_privacy_manifest_to_your_app_or_third-party_sdk?language=objc)。

## 已知的使用情況

### Compose Multiplatform

使用 Compose Multiplatform 可能會導致你的二進位檔中使用 `fstat`、`stat` 和 `mach_absolute_time`。即使這些函式不用於追蹤或指紋識別，也不會從裝置發送，Apple 仍然可以將它們標記為缺少所需理由的 API。

如果你必須指定使用 `stat` 和 `fstat` 的理由，請使用 `0A2A.1`。對於 `mach_absolute_time`，請使用 `35F9.1`。

有關 Compose Multiplatform 中使用的需要提供理由的 API 的更多更新，請關注[此 issue](https://github.com/JetBrains/compose-multiplatform/issues/4738)。

### Kotlin/Native runtime 在 1.9.10 或更早版本

`mach_absolute_time` API 在 Kotlin/Native runtime 的 `mimalloc` allocator 中使用。這是 Kotlin 1.9.10 及更早版本中的預設 allocator。

我們建議升級到 Kotlin 1.9.20 或更高版本。如果無法升級，請更改記憶體 allocator。為此，請在當前 Kotlin allocator 的 Gradle 建置腳本中設定 `-Xallocator=custom` 編譯選項，或為系統 allocator 設定 `-Xallocator=std`。

更多資訊，請參閱 [Kotlin/Native 記憶體管理 (Kotlin/Native memory management)](native-memory-manager)。