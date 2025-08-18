[//]: # (title: 資源概述)

Compose Multiplatform 提供了一個特殊的 `compose-multiplatform-resources` 程式庫和 Gradle 外掛程式支援，用於在所有支援的平台上的共享程式碼中存取資源。資源是靜態內容，例如圖片、字體和字串，您可以在應用程式中使用。

在 Compose Multiplatform 中處理資源時，請考慮以下當前情況：

*   幾乎所有資源都在呼叫執行緒中同步讀取。唯一的例外是原始檔案和非同步讀取的網路資源。
*   尚未支援以串流形式讀取大型原始檔案，例如長影片。使用 [`getUri()`](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries) 函式將獨立檔案傳遞給系統 API，例如 [kotlinx-io](https://github.com/Kotlin/kotlinx-io) 程式庫。
*   從 1.6.10 版本開始，只要您使用 Kotlin 2.0.0 或更新版本以及 Gradle 7.6 或更新版本，就可以將資源放置在任何模組或原始碼集中。

要了解如何在 Compose Multiplatform 中處理資源，請參閱以下主要章節：

*   [多平台資源的設定與組態](compose-multiplatform-resources-setup.md)

    添加 `resources` 程式庫相依性，並設定應用程式應能存取的所有資源。

*   [在您的應用程式中使用多平台資源](compose-multiplatform-resources-usage.md)

    了解如何使用自動生成的存取器直接在 UI 程式碼中存取資源。

*   [本地資源環境](compose-resource-environment.md)

    管理應用程式的資源環境，例如應用程式內的主題和語言。