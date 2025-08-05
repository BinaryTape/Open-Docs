[//]: # (title: 適用於 iOS 應用程式的隱私權清單)

如果您的應用程式 intended for Apple App Store 且使用了 [必要理由 API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)，
App Store Connect 可能會發出警告，指出該應用程式沒有正確的隱私權清單：

![必要理由警告](app-store-required-reasons-warning.png){width=700}

這可能會影響任何 Apple 生態系統應用程式，無論是原生或多平台。您的應用程式可能透過
第三方函式庫或 SDK 使用了必要理由 API，這可能不明顯。Kotlin Multiplatform 可能是其中一個使用了您未察覺的 API 的框架。

在本頁面上，您將找到問題的詳細描述和處理建議。

> 此頁面反映了 Kotlin 團隊對此問題的當前理解。
> 隨著我們獲得更多關於公認方法和解決方案的資料和知識，我們將更新此頁面以反映這些資訊。
>
{style="tip"}

## 問題為何

Apple 對 App Store 提交的要求已於 [2024 年春季有所變更](https://developer.apple.com/news/?id=r1henawx)。
[App Store Connect](https://appstoreconnect.apple.com) 不再接受未在其隱私權清單中指定使用必要理由 API 的應用程式。

這是一個自動檢查，而非人工審核：您的應用程式程式碼會被分析，然後您會收到一封包含問題列表的電子郵件。該電子郵件將提及「ITMS-91053：遺失 API 宣告」問題，並列出應用程式中屬於
[必要理由](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api) 類別的所有 API 類別。

理想情況下，您的應用程式使用的所有 SDK 都會提供自己的隱私權清單，這樣您就不需要擔心。
但是，如果您的某些依賴項沒有這樣做，您的 App Store 提交可能會被標記（flagged）。

## 如何解決

在您嘗試提交應用程式並從 App Store 收到詳細問題列表後，您可以根據 Apple 文件建立您的清單：

*   [隱私權清單檔案概覽](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
*   [描述隱私權清單中的資料使用](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests)
*   [描述必要理由 API 的使用](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

產生的檔案是字典的集合。對於每種存取的 API 類型，從提供的列表中選擇一個或多個使用原因。Xcode 透過提供視覺佈局和包含每個欄位有效值的下拉式列表來幫助編輯 `.xcprivacy` 檔案。

您可以使用一個[特殊工具](#find-usages-of-required-reason-apis)來尋找您的 Kotlin 框架依賴項中必要理由 API 的使用情況，以及一個[獨立的外掛程式](#place-the-xcprivacy-file-in-your-kotlin-artifacts)來將
`.xcprivacy` 檔案與您的 Kotlin 構件捆綁。

如果新的隱私權清單未能滿足 App Store 的要求，或者您無法弄清楚如何執行這些步驟，請聯繫我們，並在[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-67603)中分享您的案例。

## 尋找必要理由 API 的使用情況

您的應用程式中的 Kotlin 程式碼或其中一個依賴項可能會從諸如 `platform.posix` 等函式庫存取必要理由 API，例如 `fstat`：

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

在某些情況下，可能很難確定哪些依賴項使用了必要理由 API。
為幫助您找到它們，我們建立了一個簡單的工具。

要使用它，請在專案中宣告 Kotlin 框架的目錄中執行以下命令：

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

您也可以[單獨下載此腳本](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)，檢查它，然後使用 `python3` 執行它。

## 將 .xcprivacy 檔案放置在您的 Kotlin 構件中

如果您需要將 `PrivacyInfo.xcprivacy` 檔案與您的 Kotlin 構件捆綁，請使用 `apple-privacy-manifests` 外掛程式：

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

此外掛程式會將隱私權清單檔案複製到[對應的輸出位置](https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk?language=objc)。

## 已知使用情況

### Compose Multiplatform

使用 Compose Multiplatform 可能會導致您的二進位檔中使用 `fstat`、`stat` 和 `mach_absolute_time`。
即使這些函數未用於追蹤或指紋識別，也未從裝置發送，Apple 仍可能將它們標記為缺少必要理由的 API。

如果您必須為 `stat` 和 `fstat` 的使用指定理由，請使用 `0A2A.1`。對於 `mach_absolute_time`，請使用 `35F9.1`。

有關 Compose Multiplatform 中使用的必要理由 API 的進一步更新，請關注[此問題](https://github.com/JetBrains/compose-multiplatform/issues/4738)。

### Kotlin/Native 執行時 1.9.10 或更早版本

`mach_absolute_time` API 在 Kotlin/Native 執行時的 `mimalloc` 分配器中使用了。這是 Kotlin 1.9.10 及更早版本中的預設分配器。

我們建議升級到 Kotlin 1.9.20 或更高版本。如果無法升級，請更改記憶體分配器。
為此，請在您的 Gradle 建置腳本中為當前 Kotlin 分配器設定 `-Xallocator=custom` 編譯選項，或為系統分配器設定 `-Xallocator=std`。

如需更多資訊，請參閱 [Kotlin/Native 記憶體管理](https://kotlinlang.org/docs/native-memory-manager.html)。