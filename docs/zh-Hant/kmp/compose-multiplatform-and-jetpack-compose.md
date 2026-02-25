[//]: # (title: Compose Multiplatform 與 Jetpack Compose 之間的關係)

<web-summary>本文說明 Compose Multiplatform 與 Jetpack Compose 之間的關係。您將進一步了解這兩個工具集以及它們如何保持一致。</web-summary>

![Compose Multiplatform 由 JetBrains 建立，Jetpack Compose 由 Google 建立](compose-multiplatform-and-jetpack-compose.png){width=730}

<tldr>
本文說明 Compose Multiplatform 與 Jetpack Compose 之間的關係。
您將了解這兩個工具集如何保持一致、程式庫如何跨目標處理，
以及如何為多平台專案建立或調整您自己的 UI 程式庫。
</tldr>

Compose Multiplatform 是由 JetBrains 開發的跨平台 UI 工具集。
它透過支援額外的目標平台，擴充了 Google 為 Android 打造的 [Jetpack Compose](https://developer.android.com/jetpack/compose) 工具集。

Compose Multiplatform 讓 compose API 可用於 [common Kotlin 程式碼](multiplatform-discover-project.md#common-code)，讓您能夠撰寫可在 Android、iOS、桌面端和 Web 上執行的共享 compose UI 程式碼。

|                  | **Compose Multiplatform**  | **Jetpack Compose** |
|------------------|----------------------------|---------------------|
| **平台**    | Android、iOS、桌面端、Web | Android             |
| **支援者** | JetBrains                  | Google              |

## Jetpack Compose 與 composable

Jetpack Compose 是一個用於建置原生 Android 介面的宣告式 UI 工具集。
它的基礎是 `composable` 函式，並以 `@Composable` 註解標記。
這些函式定義了 UI 的各個部分，並在底層資料變更時自動更新。
您可以組合 `composable` 來組建佈局、處理使用者輸入、管理狀態以及套用動畫。
Jetpack Compose 包含常見的 UI 組建，如 `Text`、`Button`、`Row` 和 `Column`，您可以使用 `modifier` 對其進行自訂。

Compose Multiplatform 以相同的原理為基礎。 
它與 Jetpack Compose 共用 Compose 編譯器和 runtime，並使用相同的 API — `@Composable` 函式、
如 `remember` 等狀態管理工具、佈局組建、`modifier` 以及動畫支援。
這意味著您可以將 Jetpack Compose 的知識複用到 Compose Multiplatform 中，為 Android、
iOS、桌面端和 Web 建置跨平台 UI。

## Compose Multiplatform 與 Jetpack Compose 功能

> 您可以從幾乎任何 Jetpack Compose 材料中了解這兩個 UI 架構的基礎知識，
> 包括 [Google 的官方文件](https://developer.android.com/jetpack/compose/documentation)。
> 
{style="tip"}

自然地，Compose Multiplatform 具有平台特定的功能與注意事項：

* [僅限 Android 的組建](compose-android-only-components.md)頁面列出了與 
Android 平台緊密連結的 API，因此無法在 common Compose Multiplatform 程式碼中使用。
* 某些平台特定的 API，例如用於桌面端的視窗處理 API 或用於 iOS 的 UIKit 相容性 API，
僅在各自的平台上可用。

以下是熱門組建和 API 可用性的概覽：

|                                                                                                                     | **Compose Multiplatform**                                                                                 | **Jetpack Compose**                                                                                    |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Compose Animation](https://developer.android.com/jetpack/androidx/releases/compose-animation)                      | 是                                                                                                       | 是                                                                                                    |
| [Compose Compiler](https://developer.android.com/jetpack/androidx/releases/compose-compiler)                        | 是                                                                                                       | 是                                                                                                    |
| [Compose Foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation)                    | 是                                                                                                       | 是                                                                                                    |
| [Compose Material](https://developer.android.com/jetpack/androidx/releases/compose-material)                        | 是                                                                                                       | 是                                                                                                    |
| [Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material30)                    | 是                                                                                                       | 是                                                                                                    |
| [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)                          | 是，除了 `androidx.compose.runtime.rxjava2` 與 `androidx.compose.runtime.rxjava3` 之外                 | 是                                                                                                    |
| [Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui)                                    | 是                                                                                                       | 是                                                                                                    |
| [Jetpack Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                              | [是](compose-lifecycle.md)                                                                               | 是                                                                                                    |
| [Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)                           | [是](compose-viewmodel.md)                                                                               | 是                                                                                                    |
| [Jetpack Navigation Compose](https://developer.android.com/jetpack/androidx/releases/navigation)                    | [是](compose-navigation-routing.md)                                                                      | 是                                                                                                    |
| 資源                                                                                                           | [Compose Multiplatform 資源程式庫](compose-multiplatform-resources.md)，使用 `Res` 類別       | [Android 資源系統](https://developer.android.com/jetpack/compose/resources)，使用 `R` 類別 |
| [Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose)                           | 否                                                                                                        | 是                                                                                                    |
| 用於 UI 組建、導覽、架構等的[第三方程式庫](#libraries-for-compose-multiplatform) | [Compose Multiplatform 程式庫](https://github.com/terrakok/kmp-awesome?tab=readme-ov-file#-compose-ui) | Jetpack Compose 與 Compose Multiplatform 程式庫                                                    |

## 技術細節

Compose Multiplatform 以 Google 發佈的程式碼和版本為基礎。
雖然 Google 的重點是針對 Android 的 Jetpack Compose，
但 Google 與 JetBrains 之間有著密切的合作，以實現 Compose Multiplatform。

Jetpack 包含第一方程式庫，例如 Foundation 和 Material，
Google 為 Android 發佈了這些程式庫。
為了讓[這些程式庫](https://github.com/JetBrains/compose-multiplatform-core)提供的 API 可用於 common 程式碼，
JetBrains 維護了這些程式庫的多平台版本，並為 Android 以外的目標發佈。

> 在[相容性與版本](compose-compatibility-and-versioning.md#jetpack-compose-and-compose-multiplatform-release-cycles)頁面進一步了解發佈週期。
> 
{style="tip"}

當您為 Android 建置 Compose Multiplatform 應用程式時，您會使用 Google 發佈的 Jetpack Compose 構件。
例如，如果您將 `compose.material3` 新增到相依性中，您的專案將在 Android 目標中使用 `androidx.compose.material3:material3`，
而在其他目標中使用 `org.jetbrains.compose.material3:material3`。
這會根據多平台構件中的 Gradle 模組元資料自動完成。

## Compose Multiplatform 程式庫

透過使用 Compose Multiplatform，您可以將使用 compose API 的程式庫作為 [Kotlin Multiplatform 程式庫](multiplatform-publish-lib-setup.md)發佈。 
這使得它們可以從 common Kotlin 程式碼中使用，並以多個平台為目標。

因此，如果您正在使用 compose API 建置新的程式庫，請考慮利用這一點，並使用 Compose Multiplatform 將其建置為多平台程式庫。
如果您已經為 Android 建置了 Jetpack Compose 程式庫，請考慮將該程式庫改為多平台。 
在生態系統中已經有[許多 Compose Multiplatform 程式庫](https://github.com/terrakok/kmp-awesome#-compose-ui)可用。

當程式庫使用 Compose Multiplatform 發佈時，僅使用 Jetpack Compose 的應用程式仍然可以順暢地取用它；
它們只需使用該程式庫的 Android 構件即可。

## 下一步

閱讀更多關於以下組建的 Compose Multiplatform 實作：
  * [Lifecycle](compose-lifecycle.md)
  * [資源](compose-multiplatform-resources.md)
  * [Common ViewModel](compose-viewmodel.md)
  * [導覽與路由](compose-navigation-routing.md)