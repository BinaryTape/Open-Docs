[//]: # (title: C 和 Objective-C 函式庫匯入的穩定性)
<primary-label ref="beta"/>

Kotlin/Native 提供 [匯入 C](native-c-interop.md) 和 [Objective-C](native-objc-interop.md) 函式庫的能力。這些函式庫的支援目前處於 [Beta](components-stability.md#kotlin-native) 階段。

處於 Beta 狀態的主要原因之一是，使用 C 和 Objective-C 函式庫可能會影響您的程式碼與不同版本的 Kotlin、依賴項和 Xcode 的相容性。本指南列出了在實踐中經常發生的相容性問題、僅在某些情況下發生的問題，以及假設性的潛在問題。

在本指南中，C 和 Objective-C 函式庫，為簡便起見，或稱 _原生函式庫_，分為：

*   [平台函式庫](#platform-libraries)，Kotlin 預設提供此類函式庫，用於存取每個平台上的「系統」原生函式庫。
*   [第三方函式庫](#third-party-libraries)，所有其他需要額外配置才能在 Kotlin 中使用的原生函式庫。

這兩種類型的原生函式庫具有不同的相容性細節。

## 平台函式庫

[_平台函式庫_](native-platform-libs.md) 隨附於 Kotlin/Native 編譯器。因此，在專案中使用不同版本的 Kotlin 會導致取得不同版本的平台函式庫。對於 Apple 目標（例如 iOS），平台函式庫是根據特定編譯器版本支援的 Xcode 版本生成的。

隨附於 Xcode SDK 的原生函式庫 API 隨每個 Xcode 版本而改變。即使當這些變更在原生語言內部是來源碼和二進位相容的，由於互通性實作，它們對於 Kotlin 而言可能會產生破壞性變更。

結果是，更新專案中的 Kotlin 版本可能會在平台函式庫中帶來破壞性變更。這可能在兩種情況下很重要：

*   平台函式庫中存在來源碼破壞性變更，影響專案中來源碼的編譯。通常，這很容易修復。
*   平台函式庫中存在二進位破壞性變更，影響您的一些依賴項。通常沒有簡單的解決方法，您需要等到函式庫開發人員在其端修復此問題，例如，透過更新 Kotlin 版本。

    > 此類二進位不相容性表現為連結警告和執行時異常。如果您希望在編譯時檢測它們，請使用 [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) 編譯器選項，將警告提升為錯誤。
    >
    {style="note"}

當 JetBrains 團隊更新用於生成平台函式庫的 Xcode 版本時，他們會盡力避免平台函式庫中出現破壞性變更。每當可能發生破壞性變更時，團隊會進行影響分析，並決定要麼忽略特定的變更（因為受影響的 API 不常用），要麼應用臨時修復。

平台函式庫中破壞性變更的另一個潛在原因，是將原生 API 轉譯為 Kotlin 的演算法發生變更。JetBrains 團隊在這些情況下也盡力避免破壞性變更。

### 從平台函式庫使用新的 Objective-C 類別

Kotlin 編譯器不會阻止您使用在您的部署目標中不可用的 Objective-C 類別。

例如，如果您的部署目標是 iOS 17.0，而您使用了一個僅在 iOS 18.0 中出現的類別，編譯器不會警告您，並且您的應用程式可能會在裝有 iOS 17.0 的裝置上啟動時崩潰。此外，即使執行從未達到那些用法，這種崩潰也會發生，因此僅透過版本檢查來保護它們是不夠的。

更多詳細資訊，請參閱 [強連結](native-objc-interop.md#strong-linking)。

## 第三方函式庫

除了系統平台函式庫之外，Kotlin/Native 還允許匯入第三方原生函式庫。例如，您可以使用 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) 或設定 [cinterops 配置](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops)。

### 匯入具有不符 Xcode 版本的函式庫

匯入第三方原生函式庫可能會導致與不同 Xcode 版本的相容性問題。

在處理原生函式庫時，編譯器通常使用來自本地安裝 Xcode 的標頭檔，因為幾乎所有原生函式庫標頭都會匯入來自 Xcode 的「標準」標頭（例如 `stdint.h`）。

這就是為什麼 Xcode 版本會影響原生函式庫匯入 Kotlin 的原因。這也是為什麼當使用第三方原生函式庫時，[從非 Mac 主機交叉編譯 Apple 目標](whatsnew21.md#ability-to-publish-kotlin-libraries-from-any-host) 仍然不可能的原因之一。

每個 Kotlin 版本與單一 Xcode 版本的相容性最佳。這是推薦版本，針對對應的 Kotlin 版本進行了最充分的測試。請在 [相容性表格](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#version-compatibility) 中檢查與特定 Xcode 版本的相容性。

使用更新或更舊的 Xcode 版本通常可行，但可能會導致問題，通常會影響第三方原生函式庫的匯入。

#### Xcode 版本比推薦版本新

使用比推薦版本新的 Xcode 版本可能會破壞某些 Kotlin 功能。匯入第三方原生函式庫受此影響最大。使用不支援的 Xcode 版本時，它通常根本無法運作。

#### Xcode 版本比推薦版本舊

通常，Kotlin 與較舊的 Xcode 版本運作良好。偶爾會出現問題，最常導致以下情況：

*   Kotlin API 參考到不存在的類型，如 [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694)。
*   系統函式庫中的類型被包含在原生函式庫的 Kotlin API 中。在這種情況下，專案編譯成功，但一個系統原生類型會被新增到您的原生函式庫套件中。例如，您可能隨後會在 IDE 自動完成中意外地看到此類型。

如果您的 Kotlin 函式庫成功編譯，即使使用較舊的 Xcode 版本，發布也是安全的，除非您在 [您的 Kotlin 函式庫 API 中使用來自第三方函式庫的類型](#using-native-types-in-library-api)。

### 使用傳遞的第三方原生依賴項

當您的專案中的 Kotlin 函式庫在其實作中匯入第三方原生函式庫時，您的專案也將獲得對該原生函式庫的存取權限。發生這種情況是因為 Kotlin/Native 不區分 `api` 和 `implementation` 依賴類型，因此原生函式庫總是最終成為 `api` 依賴項。

使用此類傳遞的原生依賴項更容易出現更多的相容性問題。例如，Kotlin 函式庫開發人員所做的變更可能會使原生函式庫的 Kotlin 表示形式不相容，導致您更新 Kotlin 函式庫時出現相容性問題。

因此，與其依賴於傳遞的依賴項，不如直接配置與相同原生函式庫的互通性。為此，請為原生函式庫使用另一個套件名稱，類似於 [使用自訂套件名稱](#use-custom-package-name) 以防止相容性問題。

### 在函式庫 API 中使用原生類型

如果您發布 Kotlin 函式庫，請注意您的函式庫 API 中的原生類型。此類用法預計將來會被破壞，以修復相容性及其他問題，這將影響您的函式庫使用者。

在某些情況下，在函式庫 API 中使用原生類型是必要的，因為函式庫的用途需要它，例如，當一個 Kotlin 函式庫基本上是為原生函式庫提供擴充功能時。如果這不是您的情況，請避免或限制在函式庫 API 中使用原生類型。

此建議僅適用於函式庫 API 中原生類型的用法，與應用程式碼無關。它也不適用於函式庫實作，例如：

```kotlin
// 請格外小心！函式庫 API 中使用了原生類型：
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// 照常小心；函式庫 API 中沒有使用原生類型：
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

### 發布使用第三方函式庫的函式庫

如果您發布使用第三方原生函式庫的 Kotlin 函式庫，您可以做幾件事來避免相容性問題。

#### 使用自訂套件名稱

為第三方原生函式庫使用自訂套件名稱可能有助於防止相容性問題。

當原生函式庫匯入 Kotlin 時，它會取得一個 Kotlin 套件名稱。如果它不唯一，函式庫使用者可能會遇到衝突。例如，如果在使用者專案中的其他位置或在其他依賴項中匯入了一個具有相同套件名稱的原生函式庫，這兩種用法將會衝突。

在這種情況下，編譯可能會失敗並出現 `Linking globals named '...': symbol multiply defined!` 錯誤。然而，可能會有其他錯誤，甚至成功編譯。

若要為第三方原生函式庫使用自訂名稱：

*   透過 CocoaPods 整合匯入原生函式庫時，請在 Gradle 建置指令碼的 `pod {}` 區塊中使用 [`packageName`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html#pod-function) 屬性。
*   使用 `cinterops` 配置匯入原生函式庫時，請在配置區塊中使用 [`packageName`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops) 屬性。

#### 檢查與舊版 Kotlin 的相容性

發布 Kotlin 函式庫時，使用第三方原生函式庫可能會影響函式庫與其他 Kotlin 版本的相容性，具體而言：

*   Kotlin Multiplatform 函式庫不保證向前相容性（指舊版編譯器可以使用由新版編譯器編譯的函式庫）。
    在實踐中，它在某些情況下是可行的；然而，使用原生函式庫可能會進一步限制向前相容性。
*   Kotlin Multiplatform 函式庫提供向後相容性（指新版編譯器可以使用由舊版編譯器產生的函式庫）。
    在 Kotlin 函式庫中使用原生函式庫通常不應影響其向後相容性。但這會增加更多影響相容性的編譯器錯誤的可能性。

#### 避免嵌入靜態函式庫

匯入原生函式庫時，可以使用 `-staticLibrary` 編譯器選項或 `.def` 檔案中的 `staticLibraries` 屬性來包含相關的 [靜態函式庫](native-definition-file.md#include-a-static-library)（`.a` 檔案）。在這種情況下，您的函式庫使用者無需處理原生依賴項和連結器選項。

然而，無法以任何方式配置所包含靜態函式庫的使用方式：既不能排除它，也不能替換（取代）它。因此，使用者將無法解決與包含相同靜態函式庫的其他 Kotlin 函式庫的潛在衝突，也無法調整其版本。

## 原生函式庫支援的演進

目前，在 Kotlin 專案中使用 C 和 Objective-C 可能會導致相容性問題；其中一些列於本指南中。為了解決這些問題，未來可能需要一些破壞性變更，這本身也導致了相容性問題。