[//]: # (title: 在平台間共享程式碼)

藉助 Kotlin Multiplatform，您可以使用 Kotlin 提供的機制來共享程式碼：
 
* [在專案中所有使用的平台間共享程式碼](#share-code-on-all-platforms)。用於共享適用於所有平台的通用業務邏輯。     
* [在專案中部分平台間（而非全部）共享程式碼](#share-code-on-similar-platforms)。您可以借助階層式結構在類似平台中重用程式碼。

如果需要從共享程式碼存取平台特定的 API，請使用 Kotlin 的 [expected and actual declarations](multiplatform-expect-actual.md) 機制。

## 在所有平台間共享程式碼

如果您有適用於所有平台的通用業務邏輯，則無需為每個平台編寫相同的程式碼 – 只需將其在通用原始碼集 (common source set) 中共享即可。

![為所有平台共享的程式碼](flat-structure.svg)

一些原始碼集的依賴項是預設設定的。您無需手動指定任何 `dependsOn` 關係：
* 對於所有依賴於通用原始碼集的平台特定原始碼集，例如 `jvmMain`、`macosX64Main` 等。 
* 在特定目標的 `main` 和 `test` 原始碼集之間，例如 `androidMain` 和 `androidUnitTest`。

如果需要從共享程式碼存取平台特定的 API，請使用 Kotlin 的 [expected and actual declarations](multiplatform-expect-actual.md) 機制。

## 在類似平台間共享程式碼

您經常需要建立多個原生目標，這些目標可能會重用大量通用邏輯和第三方 API。

例如，在一個典型的以 iOS 為目標的多平台專案中，有兩個與 iOS 相關的目標：一個用於 iOS ARM64 裝置，另一個用於 x64 模擬器。它們有獨立的平台特定原始碼集，但實際上很少需要針對裝置和模擬器使用不同的程式碼，而且它們的依賴項也大致相同。因此，iOS 特定的程式碼可以在它們之間共享。

顯然，在這種設定下，最好為兩個 iOS 目標擁有一個共享原始碼集，其中包含的 Kotlin/Native 程式碼仍然可以直接呼叫 iOS 裝置和模擬器通用的任何 API。

在這種情況下，您可以使用 [階層式結構](multiplatform-hierarchy.md) 在專案中跨原生目標共享程式碼，方法有以下兩種：

* [使用預設階層範本](multiplatform-hierarchy.md#default-hierarchy-template)
* [手動配置階層式結構](multiplatform-hierarchy.md#manual-configuration)

深入了解[在函式庫中共享程式碼](#share-code-in-libraries)以及[連接平台特定函式庫](#connect-platform-specific-libraries)。

## 在函式庫中共享程式碼

由於階層式專案結構，函式庫也可以為目標子集提供通用 API。當[函式庫發佈](multiplatform-publish-lib-setup.md)時，其中間原始碼集的 API 會連同專案結構的資訊一起嵌入到函式庫構件中。當您使用此函式庫時，您專案的中間原始碼集僅存取那些可供每個原始碼集目標使用的函式庫 API。

例如，請查看 `kotlinx.coroutines` 儲存庫中的以下原始碼集階層：

![函式庫階層式結構](lib-hierarchical-structure.svg)

`concurrent` 原始碼集宣告了 `runBlocking` 函式，並為 JVM 和原生目標進行編譯。一旦 `kotlinx.coroutines` 函式庫使用階層式專案結構更新並發佈，您就可以依賴於它，並從在 JVM 和原生目標之間共享的原始碼集呼叫 `runBlocking`，因為它符合函式庫 `concurrent` 原始碼集的「目標簽章 (targets signature)」。

## 連接平台特定函式庫

為了共享更多原生程式碼而不受平台特定依賴項限制，請使用 [平台函式庫](https://kotlinlang.org/docs/native-platform-libs.html)，例如 Foundation、UIKit 和 POSIX。這些函式庫隨 Kotlin/Native 附帶，並預設在共享原始碼集中可用。

此外，如果您在專案中使用 [Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md) 外掛程式，則可以使用透過 [`cinterop` 機制](https://kotlinlang.org/docs/native-c-interop.html) 使用的第三方原生函式庫。

## 接下來是什麼？

* [閱讀有關 Kotlin 的 expected and actual declarations 機制](multiplatform-expect-actual.md)
* [深入了解階層式專案結構](multiplatform-hierarchy.md)
* [設定多平台函式庫的發佈](multiplatform-publish-lib-setup.md)
* [查看我們關於多平台專案中原始碼檔命名的建議](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)