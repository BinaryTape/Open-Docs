[//]: # (title: C、Objective-C 和 Swift 函式庫的匯入)

Kotlin/Native 提供了匯入 [C 函式庫](native-c-interop.md) 和 [Objective-C 函式庫](native-objc-interop.md) 的能力。
您也可以透過變通方法將純 [Swift 函式庫](#swift-library-import) 匯入您的 Kotlin/Native 專案。

## C 和 Objective-C 函式庫匯入的穩定性
<primary-label ref="beta"/>

目前對於匯入 C 和 Objective-C 函式庫的支援仍處於 [Beta 階段](components-stability.md#kotlin-native)。

處於 Beta 階段的主要原因之一是，使用 C 和 Objective-C 函式庫可能會影響您的程式碼與不同版本的 Kotlin、依賴項和 Xcode 之間的相容性。本指南列出了實務中經常發生的相容性問題、僅在某些情況下發生的問題，以及假設性的潛在問題。

為求簡潔，我們將此處的 C 和 Objective-C 函式庫，或稱 _原生函式庫_，分為：

*   [平台函式庫](#platform-libraries)，Kotlin 預設提供用於存取每個平台上的「系統」原生函式庫。
*   [第三方函式庫](#third-party-libraries)，所有其他需要額外配置才能在 Kotlin 中使用的原生函式庫。

這兩種原生函式庫具有不同的相容性特點。

### 平台函式庫

[_平台函式庫_](native-platform-libs.md) 隨 Kotlin/Native 編譯器一同發布。
因此，在專案中使用不同版本的 Kotlin 會導致取得不同版本的平台函式庫。
對於 Apple 目標（例如 iOS），平台函式庫是根據特定編譯器版本支援的 Xcode 版本生成的。

隨 Xcode SDK 發布的原生函式庫 API 會隨著每個 Xcode 版本而改變。
即使這些變更在原生語言內部是原始碼和二進位檔相容的，由於互通性實作的關係，它們對於 Kotlin 而言仍可能成為破壞性變更。

因此，在專案中更新 Kotlin 版本可能會導致平台函式庫發生破壞性變更。
這可能在兩種情況下產生影響：

*   平台函式庫中存在原始碼破壞性變更，影響您專案中原始碼的編譯。通常，這很容易修復。
*   平台函式庫中存在二進位檔破壞性變更，影響您的一些依賴項。通常沒有簡單的變通方法，您需要等待函式庫開發人員在其端修復此問題，例如透過更新 Kotlin 版本。

    > 這種二進位檔不相容性會表現為連結警告和執行時例外。
    > 如果您希望在編譯時偵測到它們，請使用 [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) 編譯器選項將警告提升為錯誤。
    >
    {style="note"}

當 JetBrains 團隊更新用於生成平台函式庫的 Xcode 版本時，會盡力避免平台函式庫中出現破壞性變更。每當可能發生破壞性變更時，團隊都會進行影響分析，並決定忽略特定變更（因為受影響的 API 不常用）或應用臨時修復。

平台函式庫中發生破壞性變更的另一個潛在原因是將原生 API 轉譯為 Kotlin 的演算法發生變更。JetBrains 團隊也會盡力避免在此類情況下發生破壞性變更。

#### 從平台函式庫中使用新的 Objective-C 類別

Kotlin 編譯器不會阻止您使用在您的部署目標上不可用的 Objective-C 類別。

例如，如果您的部署目標是 iOS 17.0，而您使用的類別僅在 iOS 18.0 中出現，編譯器不會警告您，您的應用程式可能會在 iOS 17.0 裝置上啟動時崩潰。
此外，即使執行從未到達這些使用之處，此類崩潰也會發生，因此僅靠版本檢查來保護是不夠的。

有關更多詳細資訊，請參閱 [強連結](native-objc-interop.md#strong-linking)。

### 第三方函式庫

除了系統平台函式庫之外，Kotlin/Native 還允許匯入第三方原生函式庫。
例如，您可以使用 [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 或設定 [cinterops 配置](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#cinterops)。

#### 匯入 Xcode 版本不符的函式庫

匯入第三方原生函式庫可能會導致與不同 Xcode 版本之間的相容性問題。

處理原生函式庫時，編譯器通常會使用本機安裝的 Xcode 中的標頭檔，因為幾乎所有原生函式庫標頭都會匯入來自 Xcode 的「標準」標頭（例如 `stdint.h`）。

這就是為什麼 Xcode 版本會影響原生函式庫匯入 Kotlin 的原因。這也是為什麼使用第三方原生函式庫時，[從非 Mac 主機交叉編譯 Apple 目標](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#compilation-for-apple-targets) 仍然不可能的原因之一。

每個 Kotlin 版本都與單一 Xcode 版本最相容。這是推薦版本，它針對相應的 Kotlin 版本進行了最多的測試。請在 [相容性表格](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#version-compatibility) 中檢查與特定 Xcode 版本的相容性。

使用更新或更舊的 Xcode 版本通常是可行的，但可能會導致問題，通常會影響第三方原生函式庫的匯入。

##### Xcode 版本比推薦的更新

使用比推薦版本更新的 Xcode 版本可能會破壞某些 Kotlin 功能。第三方原生函式庫的匯入受此影響最大。使用不支援的 Xcode 版本時，它通常根本無法工作。

##### Xcode 版本比推薦的更舊

通常，Kotlin 與較舊的 Xcode 版本配合良好。可能會出現一些偶爾的問題，這些問題最常導致：

*   Kotlin API 參考了不存在的類型，如 [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694) 中所示。
*   系統函式庫中的類型包含在原生函式庫的 Kotlin API 中。
    在這種情況下，專案會成功編譯，但系統原生類型會被新增到您的原生函式庫套件中。
    例如，您可能會在 IDE 自動完成中意外看到此類型。

如果您的 Kotlin 函式庫使用較舊的 Xcode 版本成功編譯，則可以安全發布，除非您在 [Kotlin 函式庫 API 中使用第三方函式庫的類型](#using-native-types-in-library-api)。

#### 使用推移性第三方原生依賴

當您專案中的 Kotlin 函式庫匯入第三方原生函式庫作為其實作的一部分時，您的專案也會取得該原生函式庫的存取權。
之所以會發生這種情況，是因為 Kotlin/Native 不區分 `api` 和 `implementation` 依賴類型，因此原生函式庫最終始終是 `api` 依賴項。

使用此類推移性原生依賴更容易產生更多相容性問題。
例如，Kotlin 函式庫開發人員所做的變更可能會使原生函式庫的 Kotlin 表示不相容，導致您更新 Kotlin 函式庫時出現相容性問題。

因此，與其依賴推移性依賴，不如直接配置與相同原生函式庫的互通性。為此，請為原生函式庫使用另一個套件名稱，類似於 [使用自訂套件名稱](#use-custom-package-name) 以防止相容性問題。

#### 在函式庫 API 中使用原生類型

如果您發布 Kotlin 函式庫，請務必小心您函式庫 API 中的原生類型。為了修復相容性和其他問題，預計這些用法將來會被破壞，這將影響您的函式庫使用者。

在某些情況下，在函式庫 API 中使用原生類型是必要的，因為這是函式庫目的所需，例如，當 Kotlin 函式庫基本上提供原生函式庫的擴充功能時。
如果情況並非如此，請避免或限制在函式庫 API 中使用原生類型。

此建議僅適用於函式庫 API 中原生類型的使用，與應用程式碼無關。它也不適用於函式庫實作，例如：

```kotlin
// 請格外小心！函式庫 API 中使用了原生類型：
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// 照常小心；函式庫 API 中未使用原生類型：
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

#### 發布使用第三方函式庫的函式庫

如果您發布使用第三方原生函式庫的 Kotlin 函式庫，可以採取一些措施來避免相容性問題。

##### 使用自訂套件名稱

為第三方原生函式庫使用自訂套件名稱可能會有助於防止相容性問題。

當原生函式庫匯入 Kotlin 時，它會取得一個 Kotlin 套件名稱。如果它不是唯一的，函式庫使用者可能會遇到衝突。例如，如果原生函式庫在使用者專案的其他位置或其他依賴項中以相同的套件名稱匯入，這兩個使用將會衝突。

在這種情況下，編譯可能會因 `Linking globals named '...': symbol multiply defined!` 錯誤而失敗。
但是，可能會有其他錯誤，甚至可能成功編譯。

要為第三方原生函式庫使用自訂名稱：

*   透過 CocoaPods 整合匯入原生函式庫時，請在您的 Gradle 建置腳本的 `pod {}` 區塊中使用 [`packageName`](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html#pod-function) 屬性。
*   透過 `cinterops` 配置匯入原生函式庫時，請在配置區塊中使用 [`packageName`](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#cinterops) 屬性。

##### 檢查與舊版 Kotlin 的相容性

發布 Kotlin 函式庫時，第三方原生函式庫的使用可能會影響函式庫與其他 Kotlin 版本的相容性，具體來說：

*   Kotlin Multiplatform 函式庫不保證向前相容性（即舊版編譯器可以使用新版編譯器編譯的函式庫）。

    在實務中，它在某些情況下是有效的；然而，使用原生函式庫可能會進一步限制向前相容性。

*   Kotlin Multiplatform 函式庫提供向後相容性（即新版編譯器可以使用舊版編譯的函式庫）。

    在 Kotlin 函式庫中使用原生函式庫通常不應影響其向後相容性。
    但它增加了更多影響相容性的編譯器錯誤的可能性。

##### 避免嵌入靜態函式庫

匯入原生函式庫時，可以使用 `-staticLibrary` 編譯器選項或 `.def` 檔案中的 `staticLibraries` 屬性來包含相關的 [靜態函式庫](native-definition-file.md#include-a-static-library)（`.a` 檔案）。
在這種情況下，您的函式庫使用者無需處理原生依賴項和連結器選項。

然而，無法以任何方式配置所包含靜態函式庫的使用：既不能排除也不能替換（取代）它。因此，使用者將無法解決與包含相同靜態函式庫的其他 Kotlin 函式庫的潛在衝突或調整其版本。

### 原生函式庫支援的演進

目前，在 Kotlin 專案中使用 C 和 Objective-C 可能會導致相容性問題；其中一些問題已在本指南中列出。
為了修復這些問題，未來可能需要進行一些破壞性變更，這本身就加劇了相容性問題。

## Swift 函式庫匯入

Kotlin/Native 不支援直接匯入純 Swift 函式庫。然而，有幾種變通方法可以解決這個問題。

一種方法是使用手動 Objective-C 橋接。使用此方法，您需要編寫自訂的 Objective-C 包裝器和 `.def` 檔案，並透過 cinterop 使用這些包裝器。

然而，在大多數情況下，我們建議使用 _反向匯入_ 方法：您在 Kotlin 端定義預期行為，在 Swift 端實作實際功能，然後將其傳回 Kotlin。

您可以透過兩種方式之一來定義預期部分：

*   建立介面。基於介面的方法對於多個函式和可測試性而言擴展性更好。
*   使用 Swift 閉包。它們非常適合快速原型製作，但這種方法有其局限性 — 例如，它不持有狀態。

請考慮將 [CryptoKit](https://developer.apple.com/documentation/cryptokit/) Swift 函式庫反向匯入 Kotlin 專案的範例：

<tabs>
<tab title="介面">

1.  在 Kotlin 端，建立一個介面來描述 Kotlin 對 Swift 的期望：

    ```kotlin
    // CryptoProvider.kt
    interface CryptoProvider {
        fun hashMD5(input: String): String
    }
    ```

2.  在 Swift 端，使用純 Swift 函式庫 CryptoKit 實作 MD5 雜湊功能：

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit
    
    class IosCryptoProvider: CryptoProvider {
        func hashMD5(input: String) -> String {
            guard let data = input.data(using: .utf8) else { return "failed" }
            return Insecure.MD5.hash(data: data).description
        }
    }
    ```

3.  將 Swift 實作傳遞給 Kotlin 元件：

    ```swift
    // iosApp/ContentView.swift
    struct ComposeView: UIViewControllerRepresentable {
        func makeUIViewController(context: Context) -> UIViewController {
            // 將 Swift 實作注入 Kotlin UI 進入點
            MainViewControllerKt.MainViewController(cryptoProvider: IosCryptoProvider())
        }

        func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
    }
    ```

</tab>
<tab title="Swift 閉包">

1.  在 Kotlin 端，宣告一個函式參數並在需要的地方使用它：

    ```kotlin
    // App.kt
    @Composable
    fun App(md5Hasher: (String) -> String) {
        // UI 內部使用範例
        val hashed = md5Hasher("Hello, world!")
        androidx.compose.material3.Text("Compose: $hashed")
    }
    ```

    ```kotlin
    // MainViewController.kt
    fun MainViewController(md5Hasher: (String) -> String) = ComposeUIViewController {
        App(md5Hasher)
    }
    ```

2.  在 Swift 端，使用 CryptoKit 函式庫建構 MD5 雜湊器，並將其作為閉包傳遞：

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit
    import SwiftUI

    struct ComposeView: UIViewControllerRepresentable {
        func makeUIViewController(context: Context) -> UIViewController {
            MainViewControllerKt.MainViewController(md5Hasher: { input in
                guard let data = input.data(using: .utf8) else { return "failed" }
                return Insecure.MD5.hash(data: data).description
            })
        }

        func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
    }
    ```

</tab>
</tabs>

在更複雜的專案中，使用依賴注入將 Swift 實作傳回 Kotlin 會更方便。
有關更多資訊，請參閱 [依賴注入框架](https://kotlinlang.org/docs/multiplatform/multiplatform-connect-to-apis.html#dependency-injection-framework) 或查閱 [Koin 框架](https://insert-koin.io/docs/reference/koin-mp/kmp/) 文件。