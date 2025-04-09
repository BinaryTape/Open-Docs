---
title: 在平台上分享程式碼
---
透過 Kotlin Multiplatform，您可以使用 Kotlin 提供的機制來共享程式碼：

* [在專案中使用的所有平台之間共享程式碼](#share-code-on-all-platforms)。 使用它來共享適用於所有平台的通用業務邏輯（business logic）。
* [在專案中包含的某些平台之間共享程式碼](#share-code-on-similar-platforms)，但不是所有平台。 您可以在層次結構的幫助下，在相似的平台上重複使用程式碼。

如果您需要從共享程式碼存取平台特定的 API，請使用 Kotlin 的 [expected 和 actual 宣告](multiplatform-expect-actual)機制。

## 在所有平台共享程式碼

如果您有所有平台通用的業務邏輯（business logic），則無需為每個平台編寫相同的程式碼 – 只需在通用來源集合中共享即可。

<img src="/img/flat-structure.svg" alt="Code shared for all platforms" style={{verticalAlign: 'middle'}}/>

某些來源集合的依賴項是預設設定的。 您無需手動指定任何 `dependsOn` 關係：
* 對於所有依賴於通用來源集合的平台特定來源集合，例如 `jvmMain`、`macosX64Main` 等。
* 在特定目標的 `main` 和 `test` 來源集合之間，例如 `androidMain` 和 `androidUnitTest`。

如果您需要從共享程式碼存取平台特定的 API，請使用 Kotlin 的 [expected 和 actual 宣告](multiplatform-expect-actual)機制。

## 在相似平台上共享程式碼

您經常需要建立多個原生目標，這些目標可能會重複使用大量通用邏輯和第三方 API。

例如，在典型的以 iOS 為目標的多平台專案中，有兩個與 iOS 相關的目標：一個用於 iOS ARM64 設備，另一個用於 x64 模擬器。 它們具有單獨的平台特定來源集合，但實際上很少需要為設備和模擬器編寫不同的程式碼，並且它們的依賴項大致相同。 因此，可以在它們之間共享特定於 iOS 的程式碼。

顯然，在這種設定中，最好為兩個 iOS 目標設定一個共享來源集合，其中 Kotlin/Native 程式碼仍然可以直接呼叫 iOS 設備和模擬器共有的任何 API。

在這種情況下，您可以使用 [層次結構](multiplatform-hierarchy)透過以下方式之一在專案中的原生目標之間共享程式碼：

* [使用預設層次結構範本](multiplatform-hierarchy#default-hierarchy-template)
* [手動配置層次結構](multiplatform-hierarchy#manual-configuration)

瞭解更多關於[在函式庫中共享程式碼](#share-code-in-libraries)和[連接平台特定函式庫](#connect-platform-specific-libraries)的資訊。

## 在函式庫中共享程式碼

由於層次結構專案結構，函式庫還可以為目標的子集提供通用 API。 當[函式庫發佈](multiplatform-publish-lib)時，其中間來源集合的 API 會與專案結構的相關資訊一起嵌入到函式庫成品（artifact）中。 當您使用此函式庫時，專案的中間來源集合只會存取函式庫中每個來源集合的目標可用的那些 API。

例如，查看來自 `kotlinx.coroutines` 儲存庫的以下來源集合層次結構：

<img src="/img/lib-hierarchical-structure.svg" alt="Library hierarchical structure" style={{verticalAlign: 'middle'}}/>

`concurrent` 來源集合宣告了函數 runBlocking，並為 JVM 和原生目標編譯。 一旦使用層次結構專案結構更新並發佈了 `kotlinx.coroutines` 函式庫，您就可以依賴它並從 JVM 和原生目標之間共享的來源集合呼叫 `runBlocking`，因為它符合函式庫 `concurrent` 來源集合的「目標簽章」。

## 連接平台特定函式庫

要共享更多原生程式碼而不受平台特定依賴項的限制，請使用[平台函式庫](native-platform-libs)，例如 Foundation、UIKit 和 POSIX。 這些函式庫隨 Kotlin/Native 一起提供，並且預設情況下可在共享來源集合中使用。

此外，如果您在專案中使用 [Kotlin CocoaPods Gradle](native-cocoapods) 外掛程式，則可以使用 [`cinterop` 機制](native-c-interop)使用第三方原生函式庫。

## 接下來做什麼？

* [閱讀關於 Kotlin 的 expected 和 actual 宣告機制](multiplatform-expect-actual)
* [瞭解更多關於層次結構專案結構的資訊](multiplatform-hierarchy)
* [設定您的多平台函式庫的發佈](multiplatform-publish-lib)
* [查看我們關於在多平台專案中命名原始檔的建議](coding-conventions#source-file-names)