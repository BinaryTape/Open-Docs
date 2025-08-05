[//]: # (title: 在平台間共享程式碼)

使用 Kotlin Multiplatform，您可以使用 Kotlin 提供的機制共享程式碼：
 
* [在專案中使用的所有平台間共享程式碼](#share-code-on-all-platforms)。用於共享適用於所有平台的共同業務邏輯。     
* [在專案中一些但非所有平台間共享程式碼](#share-code-on-similar-platforms)。您可以藉助分層結構在類似平台上重複使用程式碼。

如果您需要從共享程式碼存取平台特定的 API，請使用 Kotlin 的 [expected 和 actual 宣告](multiplatform-expect-actual.md)機制。

## 在所有平台間共享程式碼

如果您有適用於所有平台的共同業務邏輯，則無需為每個平台編寫相同的程式碼 – 只需在共同原始碼集（common source set）中共享它即可。

![所有平台共享的程式碼](flat-structure.svg)

某些原始碼集（source set）的依賴項是預設設定的。您無需手動指定任何 `dependsOn` 關係：
* 對於所有依賴於共同原始碼集（common source set）的平台特定原始碼集，例如 `jvmMain`、`macosX64Main` 等。 
* 在特定目標的 `main` 和 `test` 原始碼集（source set）之間，例如 `androidMain` 和 `androidUnitTest`。

如果您需要從共享程式碼存取平台特定的 API，請使用 Kotlin 的 [expected 和 actual 宣告](multiplatform-expect-actual.md)機制。

## 在類似平台間共享程式碼

您經常需要建立多個原生成目標（native target），它們可能重複使用大量的共同邏輯和第三方 API。

例如，在一個典型的以 iOS 為目標的多平台專案中，有兩個與 iOS 相關的目標：一個用於 iOS ARM64 裝置，另一個用於 x64 模擬器。它們有獨立的平台特定原始碼集（source set），但實際上，很少需要為裝置和模擬器編寫不同的程式碼，並且它們的依賴項也大致相同。因此，可以在它們之間共享 iOS 特定程式碼。

顯然，在此設定中，最好為兩個 iOS 目標設置一個共享原始碼集（shared source set），其中 Kotlin/Native 程式碼仍然可以直接呼叫 iOS 裝置和模擬器共同的任何 API。

在這種情況下，您可以使用 [分層結構（hierarchical structure）](multiplatform-hierarchy.md)以以下其中一種方式在專案中的原生成目標（native target）之間共享程式碼：

* [使用預設分層範本（default hierarchy template）](multiplatform-hierarchy.md#default-hierarchy-template)
* [手動配置分層結構（hierarchical structure）](multiplatform-hierarchy.md#manual-configuration)

了解更多關於[在函式庫中共享程式碼](#share-code-in-libraries)和[連接平台特定函式庫](#connect-platform-specific-libraries)的資訊。

## 在函式庫中共享程式碼

由於分層專案結構（hierarchical project structure），函式庫也可以為目標的子集提供共同的 API。當函式庫[發布時](multiplatform-publish-lib-setup.md)，其中間原始碼集（intermediate source sets）的 API 會連同專案結構資訊一起嵌入到函式庫構件（library artifacts）中。當您使用此函式庫時，您專案的中間原始碼集（intermediate source sets）僅存取該函式庫中對每個原始碼集（source set）的目標可用的那些 API。

例如，請參閱 `kotlinx.coroutines` 儲存庫的以下原始碼集（source set）層次結構：

![函式庫分層結構](lib-hierarchical-structure.svg)

`concurrent` 原始碼集（source set）宣告了函式 `runBlocking`，並為 JVM 和原生成目標（native target）編譯。一旦 `kotlinx.coroutines` 函式庫使用分層專案結構（hierarchical project structure）更新並發布後，您可以依賴它並從 JVM 和原生成目標（native target）之間共享的原始碼集（source set）呼叫 `runBlocking`，因為它與該函式庫 `concurrent` 原始碼集（source set）的「目標簽名」（targets signature）相符。

## 連接平台特定函式庫

為了共享更多原生成程式碼而不受平台特定依賴項的限制，請使用 [平台函式庫（platform libraries）](https://kotlinlang.org/docs/native-platform-libs.html)，例如 Foundation、UIKit 和 POSIX。這些函式庫隨 Kotlin/Native 一同發布，並預設在共享原始碼集（shared source sets）中可用。

此外，如果您在專案中使用 [Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md) 外掛程式，則可以使用透過 [`cinterop` 機制](https://kotlinlang.org/docs/native-c-interop.html)消耗的第三方原生成函式庫。

## 接下來是什麼？

* [閱讀有關 Kotlin 的 expected 和 actual 宣告機制](multiplatform-expect-actual.md)
* [了解更多關於分層專案結構（hierarchical project structure）的資訊](multiplatform-hierarchy.md)
* [設定您的多平台函式庫的發布](multiplatform-publish-lib-setup.md)
* [參閱我們關於多平台專案中原始碼檔命名（naming source files）的建議](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)