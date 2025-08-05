[//]: # (title: 資源概覽)

Compose Multiplatform 提供了特殊的 `compose-multiplatform-resources` 函式庫和 Gradle 外掛支援，用於在所有支援的平台上的共同程式碼中存取資源。資源是靜態內容，例如圖片、字體和字串，您可以在應用程式中使用它們。

在 Compose Multiplatform 中使用資源時，請考慮目前的條件：

*   幾乎所有資源都在呼叫執行緒中同步讀取。唯一的例外是原始檔案和網路資源，它們是非同步讀取的。
*   尚不支援將大型原始檔案（例如長影片）作為串流讀取。
    使用 [`getUri()`](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries) 函式將獨立檔案傳遞給系統 API，例如 [kotlinx-io](https://github.com/Kotlin/kotlinx-io) 函式庫。
*   從 1.6.10 版開始，只要您使用 Kotlin 2.0.0 或更新版本，以及 Gradle 7.6 或更新版本，就可以將資源放置在任何模組或原始碼集中。

要了解如何在 Compose Multiplatform 中使用資源，請參考以下關鍵章節：

*   [](compose-multiplatform-resources-setup.md)

    新增 `resources` 函式庫依賴項並設定您的應用程式應該能夠存取的所有資源。

*   [](compose-multiplatform-resources-usage.md)

    了解如何使用自動生成的存取器直接在您的 UI 程式碼中存取資源。

*   [本機資源環境](compose-resource-environment.md)

    管理您應用程式的資源環境，例如應用程式內的主題和語言。