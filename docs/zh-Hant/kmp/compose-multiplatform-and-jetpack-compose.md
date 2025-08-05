[//]: # (title: Compose Multiplatform 與 Jetpack Compose)

<web-summary>本文解釋了 Compose Multiplatform 與 Jetpack Compose 之間的關係。您將了解這兩個工具包以及它們如何協同運作。</web-summary>

![Compose Multiplatform 由 JetBrains 建立，Jetpack Compose 由 Google 建立](compose-multiplatform-and-jetpack-compose.png){width=730}

<tldr>
本文解釋了 Compose Multiplatform 與 Jetpack Compose 之間的關係。
您將了解這兩個工具包如何協同運作、函式庫如何在不同目標平台處理，
以及如何為多平台專案建立或調整自己的 UI 函式庫。
</tldr>

Compose Multiplatform 是由 JetBrains 開發的跨平台 UI 工具包。
它透過支援額外的目標平台，擴展了 Google 針對 Android 的 [Jetpack Compose](https://developer.android.com/jetpack/compose) 工具包。

Compose Multiplatform 使 Compose API 可從 [通用 Kotlin 程式碼](multiplatform-discover-project.md#common-code) 中使用，
讓您能夠編寫可在 Android、iOS、桌面和網頁上執行的共享 Compose UI 程式碼。

|                  | **Compose Multiplatform**  | **Jetpack Compose** |
|------------------|----------------------------|---------------------|
| **平台**         | Android、iOS、桌面、網頁   | Android             |
| **支援者**       | JetBrains                  | Google              |

## Jetpack Compose 與可組合項

Jetpack Compose 是一個宣告式 UI 工具包，用於建構原生 Android 介面。
其基礎是帶有 `@Composable` 註解的 _可組合_ 函數。
這些函數定義了 UI 的部分，並在底層資料變更時自動更新。
您可以結合可組合項來建立佈局、處理使用者輸入、管理狀態及應用動畫。
Jetpack Compose 包含了常見的 UI 元件，例如 `Text`、`Button`、`Row` 和 `Column`，您可以使用修飾符進行自訂。

Compose Multiplatform 基於相同的原則。
它與 Jetpack Compose 共享 Compose 編譯器和執行時，並使用相同的 API — `@Composable` 函數、
像 `remember` 這樣的狀態管理工具、佈局元件、修飾符和動畫支援。
這意味著您可以將您的 Jetpack Compose 知識應用於 Compose Multiplatform，以建構適用於 Android、
iOS、桌面和網頁的跨平台 UI。

## Compose Multiplatform 與 Jetpack Compose 功能

> 您可以從幾乎任何 Jetpack Compose 資料中學習這兩個 UI 框架的基本原理，
> 包括 [Google 的官方文件](https://developer.android.com/jetpack/compose/documentation)。
> 
{style="tip"}

當然，Compose Multiplatform 具有平台特定功能和考量：

*   [僅限 Android 的元件](compose-android-only-components.md) 頁面列出了與 Android 平台緊密相關的 API，因此無法從通用 Compose Multiplatform 程式碼中使用。
*   某些平台特定 API，例如桌面版的視窗處理 API 或 iOS 的 UIKit 相容性 API，僅在其各自的平台上可用。

以下是常用元件和 API 的可用性概覽：

|                                                                                                                     | **Compose Multiplatform**                                                                                 | **Jetpack Compose**                                                                                    |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Compose Animation](https://developer.android.com/jetpack/androidx/releases/compose-animation)                      | 是                                                                                                        | 是                                                                                                     |
| [Compose Compiler](https://developer.android.com/jetpack/androidx/releases/compose-compiler)                        | 是                                                                                                        | 是                                                                                                     |
| [Compose Foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation)                    | 是                                                                                                        | 是                                                                                                     |
| [Compose Material](https://developer.android.com/jetpack/androidx/releases/compose-material)                        | 是                                                                                                        | 是                                                                                                     |
| [Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material30)                    | 是                                                                                                        | 是                                                                                                     |
| [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)                          | 是，`androidx.compose.runtime.rxjava2` 和 `androidx.compose.runtime.rxjava3` 除外                        | 是                                                                                                     |
| [Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui)                                    | 是                                                                                                        | 是                                                                                                     |
| [Jetpack Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                              | [是](compose-lifecycle.md)                                                                                | 是                                                                                                     |
| [Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)                           | [是](compose-viewmodel.md)                                                                                | 是                                                                                                     |
| [Jetpack Navigation Compose](https://developer.android.com/jetpack/androidx/releases/navigation)                    | [是](compose-navigation-routing.md)                                                                       | 是                                                                                                     |
| 資源                                                                                                                | 使用 `Res` 類別的 [Compose Multiplatform 資源函式庫](compose-multiplatform-resources.md)                  | 使用 `R` 類別的 [Android 資源系統](https://developer.android.com/jetpack/compose/resources)              |
| [Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose)                           | 否                                                                                                        | 是                                                                                                     |
| [第三方函式庫](#libraries-for-compose-multiplatform) 用於 UI 元件、導覽、架構等 | [Compose Multiplatform 函式庫](https://github.com/terrakok/kmp-awesome?tab=readme-ov-file#-compose-ui) | Jetpack Compose 和 Compose Multiplatform 函式庫                                                      |

## 技術細節

Compose Multiplatform 建立在 Google 發布的程式碼和版本之上。
雖然 Google 的重點是針對 Android 的 Jetpack Compose，
但 Google 和 JetBrains 之間有著密切的合作，以啟用 Compose Multiplatform。

Jetpack 包含了 Foundation 和 Material 等第一方函式庫，
Google 針對 Android 發布了這些函式庫。
為了使 [這些函式庫](https://github.com/JetBrains/compose-multiplatform-core) 提供的 API 可從通用程式碼中使用，
JetBrains 維護這些函式庫的多平台版本，這些版本發布給 Android 以外的目標平台。

> 在 [相容性與版本控制](compose-compatibility-and-versioning.md#jetpack-compose-and-compose-multiplatform-release-cycles) 頁面了解更多關於發布週期的資訊。
> 
{style="tip"}

當您為 Android 建構 Compose Multiplatform 應用程式時，您會使用 Google 發布的 Jetpack Compose 構件。
例如，如果您將 `compose.material3` 加入您的依賴項，您的專案在 Android 目標上將使用 `androidx.compose.material3:material3`，
而在其他目標上則使用 `org.jetbrains.compose.material3:material3`。
這是根據多平台構件中的 Gradle 模組中繼資料自動完成的。

## Compose Multiplatform 的函式庫

透過使用 Compose Multiplatform，您可以將使用 Compose API 的函式庫發布為 [Kotlin 多平台函式庫](multiplatform-publish-lib-setup.md)。
這使得它們可從通用 Kotlin 程式碼中使用，針對多個平台。

因此，如果您正在使用 Compose API 建構一個新的函式庫，請考慮利用此優勢並使用 Compose Multiplatform 將其建構為多平台函式庫。
如果您已經為 Android 建構了一個 Jetpack Compose 函式庫，請考慮將該函式庫多平台化。
生態系中已有很多 [Compose Multiplatform 函式庫](https://github.com/terrakok/kmp-awesome#-compose-ui) 可用。

當函式庫以 Compose Multiplatform 形式發布時，僅使用 Jetpack Compose 的應用程式仍然可以無縫使用它；
它們只是使用該函式庫的 Android 構件。

## 接下來

閱讀更多關於以下元件的 Compose Multiplatform 實作：
  * [](compose-lifecycle.md)
  * [資源](compose-multiplatform-resources.md)
  * [](compose-viewmodel.md)
  * [](compose-navigation-routing.md)