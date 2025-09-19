[//]: # (title: 多平台資源的設定與配置)

<show-structure depth="3"/>

若要正確配置專案以使用多平台資源：

1.  新增函式庫依賴。
2.  為每種資源建立必要的目錄。
3.  為限定資源建立額外目錄（例如，用於深色 UI 主題的不同影像或本地化字串）。

## 建置腳本與目錄設定

若要在多平台專案中存取資源，請新增函式庫依賴並在專案目錄中組織檔案：

1.  在 `composeApp` 目錄下的 `build.gradle.kts` 檔案中，為 `commonMain` 原始碼集新增依賴：

    ```kotlin
    kotlin {
        //...
        sourceSets {
            commonMain.dependencies {
                implementation(compose.components.resources)
            }
        }
    }
    ```

    > 若要直接引用此函式庫，請使用 [Maven Central 上的構件頁面](https://central.sonatype.com/artifact/org.jetbrains.compose.components/components-resources)中的完整限定名稱。
    {style="tip"}

2.  在您想要新增資源的原始碼集目錄中（此範例中為 `commonMain`）建立一個新目錄 `composeResources`：

    ![Compose resources project structure](compose-resources-structure.png){width=250}

3.  根據這些規則組織 `composeResources` 目錄結構：

    *   影像應放在 `drawable` 目錄中。Compose Multiplatform 支援點陣圖影像（JPEG、PNG、位元圖和 WebP）以及向量 Android XML 影像（不包含對 Android 資源的引用）。
    *   字型應放在 `font` 目錄中。
    *   字串應放在 `values` 目錄中。
    *   其他檔案應放在 `files` 目錄中，可包含任何您認為合適的資料夾層級結構。

### 自訂資源目錄

在 `build.gradle.kts` 檔案的 `compose.resources {}` 區塊中，您可以為每個原始碼集指定自訂資源目錄。每個這些自訂目錄也應以與預設 `composeResources` 相同的方式包含檔案：為影像包含一個 `drawable` 子目錄，為字型包含一個 `font` 子目錄，以此類推。

一個簡單的範例是指向一個特定資料夾：

```kotlin
compose.resources {
    customDirectory(
        sourceSetName = "jvmMain",
        directoryProvider = provider { layout.projectDirectory.dir("desktopResources") }
    )
}
```

您也可以設定一個由 Gradle 任務填充的資料夾，例如，包含已下載的檔案：

```kotlin
abstract class DownloadRemoteFiles : DefaultTask() {

    @get:OutputDirectory
    val outputDir = layout.buildDirectory.dir("downloadedRemoteFiles")

    @TaskAction
    fun run() { /* your code for downloading files */ }
}

compose.resources {
    customDirectory(
        sourceSetName = "iosMain",
        directoryProvider = tasks.register<DownloadRemoteFiles>("downloadedRemoteFiles").map { it.outputDir.get() }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="directoryProvider = tasks.register<DownloadRemoteFiles>"}

### 自訂網頁資源路徑

您可以使用 `configureWebResources()` 函式指定網頁資源的路徑與 URL：

*   使用相對路徑（以 `/` 開頭）來引用網域根目錄下的資源。
*   使用絕對 URL（以 `http://` 或 `https://` 開頭）來引用託管在外部網域或 CDN 上的資源。

```kotlin
// Maps resources to an application-specific path
configureWebResources {
    resourcePathMapping { path -> "/myApp/resources/$path" }
}

// Maps resources to an external CDN
configureWebResources {
    resourcePathMapping { path -> "https://mycdn.com/myApp/res/$path" }
}
```

### `androidLibrary` 目標中的資源
<secondary-label ref="Experimental"/>

從 Android Gradle plugin 8.8.0 版開始，您可以在 `androidLibrary` 目標中使用生成的 `Res` 類別和資源存取器。
若要啟用 `androidLibrary` 中多平台資源的支援，請依照以下方式更新您的配置：

```
kotlin {
  androidLibrary {
    androidResources.enable = true
  }
}
```

## 限定詞

有時，相同的資源應根據環境（例如語系、螢幕密度或 UI 主題）以不同方式呈現。例如，您可能需要為不同語言本地化文字或為深色主題調整影像。為此，函式庫提供了特殊的限定詞。

> 了解如何在 [管理本地資源環境](compose-resource-environment.md) 教學中處理資源相關設定。
>
{style="note"}

除了 `files` 目錄中的原始檔案外，所有資源類型都支援限定詞。使用連字號將限定詞新增到目錄名稱：

![Qualifiers in multiplatform resources](compose-resources-qualifiers.png){width=250}

函式庫支援（按優先級順序）以下限定詞：[語言](#language-and-regional-qualifiers)、[主題](#theme-qualifier)和[密度](#density-qualifier)。

*   不同類型的限定詞可以一起應用。例如，「drawable-en-rUS-mdpi-dark」是適用於美國地區英語、在深色主題下用於 160 DPI 螢幕的影像。
*   如果無法存取具有所請求限定詞的資源，則會改用預設資源（不帶限定詞的資源）。

### 語言和地區限定詞

您可以組合語言和地區限定詞：
*   語言由兩字母（ISO 639-1）或三字母（ISO 639-2）[語言代碼](https://www.loc.gov/standards/iso639-2/php/code_list.php)定義。
*   您可以將兩字母 [ISO 3166-1-alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 地區代碼新增到您的語言代碼中。地區代碼必須具有小寫 `r` 前綴，例如：`drawable-spa-rMX`

語言和地區代碼區分大小寫。

### 主題限定詞

您可以新增「light」或「dark」限定詞。Compose Multiplatform 會根據目前的系統主題選擇必要的資源。

### 密度限定詞

您可以使用以下密度限定詞：

*   「ldpi」– 120 DPI，0.75x 密度
*   「mdpi」– 160 DPI，1x 密度
*   「hdpi」– 240 DPI，1.5x 密度
*   「xhdpi」– 320 DPI，2x 密度
*   「xxhdpi」– 480 DPI，3x 密度
*   「xxxhdpi」– 640dpi，4x 密度

資源是根據系統中定義的螢幕密度選擇的。

## 發布

從 Compose Multiplatform 1.6.10 版開始，所有必要的資源都包含在發布 Maven 構件中。

若要啟用此功能，您的專案需要使用 Kotlin 2.0.0 或更新版本以及 Gradle 7.6 或更新版本。

## 後續步驟？

*   了解如何在[在您的應用程式中使用多平台資源](compose-multiplatform-resources-usage.md)頁面上存取您設定的資源以及如何自訂預設生成的存取器。
*   查看官方的 [示範專案](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)，該專案展示了如何在針對 iOS、Android 和桌上型電腦的 Compose Multiplatform 專案中處理資源。