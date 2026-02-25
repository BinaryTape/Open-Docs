[//]: # (title: 在平台上分享程式碼)

透過 Kotlin 多平台，您可以使用 Kotlin 提供的機制來分享程式碼： 
 
* [在專案中使用的所有平台之間分享程式碼](#share-code-on-all-platforms)。用於分享適用於所有平台的通用商業邏輯。     
* [在某些平台之間分享程式碼](#share-code-on-similar-platforms)。您可以藉助階層結構在專案包含的部分（而非全部）相似平台中重複使用程式碼。

如果您需要從共享程式碼存取平台特定 API，請使用 Kotlin 的 [expected 與 actual 宣告](multiplatform-expect-actual.md)機制。

## 在所有平台上分享程式碼

如果您有適用於所有平台的通用商業邏輯，則無需為每個平台編寫相同的程式碼 —— 只需在 `common` 原始碼集（source set）中分享即可。

![在所有平台上分享程式碼](flat-structure.svg)

原始碼集的一些相依性是預設設定的。您不需要手動指定任何 `dependsOn` 關係：
* 適用於所有相依於 `common` 原始碼集的平台特定原始碼集，例如 `jvmMain`、`macosX64Main` 等。 
* 在特定目標的 `main` 和 `test` 原始碼集之間，例如 `androidMain` 和 `androidUnitTest`。

如果您需要從共享程式碼存取平台特定 API，請使用 Kotlin 的 [expected 與 actual 宣告](multiplatform-expect-actual.md)機制。

## 在相似平台上分享程式碼

您通常需要建立多個原生目標，這些目標可能會重複使用大量的通用邏輯和第三方 API。

例如，在一個以 iOS 為目標的典型多平台專案中，有兩個與 iOS 相關的目標：一個用於 iOS ARM64 裝置，另一個用於 x64 模擬器。它們有各自獨立的平台特定原始碼集，但在實踐中，很少需要為裝置和模擬器編寫不同的程式碼，且它們的相依性基本相同。因此，iOS 特定程式碼可以在它們之間分享。

顯然，在這種設定下，理想的做法是為兩個 iOS 目標提供一個共享原始碼集，其中包含 Kotlin/Native 程式碼，且仍能直接呼叫 iOS 裝置和模擬器共有的任何 API。

在這種情況下，您可以使用[階層結構](multiplatform-hierarchy.md)，透過以下方式之一在專案中的原生目標之間分享程式碼：

* [使用預設階層範本](multiplatform-hierarchy.md#default-hierarchy-template)
* [手動配置階層結構](multiplatform-hierarchy.md#manual-configuration)

進一步了解[在程式庫中分享程式碼](#share-code-in-libraries)以及[連接平台特定程式庫](#connect-platform-specific-libraries)。

## 在程式庫中分享程式碼

得益於專案階層結構，程式庫也可以為目標子集提供通用 API。當[程式庫發佈](multiplatform-publish-lib-setup.md)時，其中間原始碼集的 API 會與專案結構資訊一起嵌入到程式庫構件中。當您使用此程式庫時，您專案的中間原始碼集僅能存取該程式庫中適用於每個原始碼集目標的 API。

例如，查看來自 `kotlinx.coroutines` 存儲庫的以下原始碼集階層結構：

![程式庫階層結構](lib-hierarchical-structure.svg)

`concurrent` 原始碼集宣告了 `runBlocking` 函式，並針對 JVM 和原生目標進行編譯。一旦 `kotlinx.coroutines` 程式庫透過專案階層結構更新並發佈，您就可以相依於它，並從 JVM 與原生目標共享的原始碼集中呼叫 `runBlocking`，因為它與程式庫 `concurrent` 原始碼集的「目標簽章」相符。

## 連接平台特定程式庫

為了在不受平台特定相依性限制的情況下分享更多原生程式碼，請使用[平台程式庫](https://kotlinlang.org/docs/native-platform-libs.html)，例如 Foundation、UIKit 和 POSIX。這些程式庫隨 Kotlin/Native 一起提供，並且預設在共享原始碼集中可用。

此外，如果您在專案中使用 [Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md) 外掛程式，則可以使用透過 [`cinterop` 機制](https://kotlinlang.org/docs/native-c-interop.html)取用的第三方原生程式庫。

## 下一步

* [閱讀關於 Kotlin 的 expected 與 actual 宣告機制](multiplatform-expect-actual.md)
* [進一步了解專案階層結構](multiplatform-hierarchy.md)
* [設定多平台程式庫的發佈](multiplatform-publish-lib-setup.md)
* [查看我們關於多平台專案中原始碼檔案命名的建議](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)