[//]: # (title: 多平台資源的設定與配置)

<show-structure depth="3"/>

若要正確配置專案以使用多平台資源：

1. 新增程式庫相依性。
2. 為每種資源建立必要的目錄。
3. 為限定資源建立額外目錄（例如，用於深色 UI 佈景主題的不同影像或在地化字串）。

## 建置指令碼與目錄設定

若要在多平台專案中存取資源，請新增程式庫相依性並在專案目錄中組織檔案：

1. 在 `composeApp` 目錄下的 `build.gradle.kts` 檔案中，將相依性新增至 `commonMain` 原始碼集：

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
   
   > 若要直接引用該程式庫，請使用 [Maven Central 上的構件頁面](https://central.sonatype.com/artifact/org.jetbrains.compose.components/components-resources) 中的完全限定名稱。
   {style="tip"}

2. 在您想要新增資源的原始碼集目錄中（在此範例中為 `commonMain`），建立一個新目錄 `composeResources`：

   ![Compose 資源專案結構](compose-resources-structure.png){width=250}

3. 根據以下規則組織 `composeResources` 目錄結構：

   * 影像應放置在 `drawable` 目錄中。Compose Multiplatform 支援點陣圖（JPEG、PNG、bitmap 和 WebP）以及向量 Android XML 影像（不含對 Android 資源的參照）。
   * 字體應放置在 `font` 目錄中。
   * 字串應放置在 `values` 目錄中。
   * 其他檔案應放置在 `files` 目錄中，您可以根據需要建立任何資料夾階層。

### 自訂資源目錄

在 `build.gradle.kts` 檔案的 `compose.resources {}` 區塊中，您可以為每個原始碼集指定自訂資源目錄。每個自訂目錄也應以與預設 `composeResources` 相同的方式包含檔案：包含用於影像的 `drawable` 子目錄、用於字體的 `font` 子目錄，依此類推。

一個簡單的範例是指向特定資料夾：

```kotlin
compose.resources {
    customDirectory(
        sourceSetName = "jvmMain",
        directoryProvider = provider { layout.projectDirectory.dir("desktopResources") }
    )
}
```

您也可以設定一個由 Gradle 任務填入的資料夾，例如包含下載檔案的資料夾：

```kotlin
abstract class DownloadRemoteFiles : DefaultTask() {

    @get:OutputDirectory
    val outputDir = layout.buildDirectory.dir("downloadedRemoteFiles")

    @TaskAction
    fun run() { /* 您下載檔案的程式碼 */ }
}

compose.resources {
    customDirectory(
        sourceSetName = "iosMain",
        directoryProvider = tasks.register<DownloadRemoteFiles>("downloadedRemoteFiles").map { it.outputDir.get() }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="directoryProvider = tasks.register<DownloadRemoteFiles>"}

在 [存取與用法](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation) 中進一步了解如何自訂資源存取。

### 自訂 Web 資源路徑

您可以使用 `configureWebResources()` 函式為 Web 資源指定路徑和 URL：

* 使用相對路徑（以 `/` 開頭）來引用來自網域根目錄的資源。
* 使用絕對 URL（以 `http://` 或 `https://` 開頭）來引用託管在外部網域或 CDN 上的資源。

```kotlin
// 將資源對應到應用程式特定的路徑
configureWebResources {
    resourcePathMapping { path -> "/myApp/resources/$path" }
}

// 將資源對應到外部 CDN
configureWebResources {
    resourcePathMapping { path -> "https://mycdn.com/myApp/res/$path" }
}
```

### `androidLibrary` 目標中的資源
<primary-label ref="Experimental"/>

從 Android Gradle 外掛程式 8.8.0 版本開始，您可以在 `androidLibrary` 目標中使用產生的 `Res` 類別和資源存取子。若要在 `androidLibrary` 中啟用對多平台資源的支援，請按如下方式更新您的配置：

```
kotlin {
  androidLibrary {
    androidResources.enable = true
  }
}
```

## 限定詞

有時，同一種資源應根據環境（如地區、螢幕密度或介面主題）以不同方式呈現。例如，您可能需要為不同語言在地化文字，或針對深色主題調整影像。為此，該程式庫提供了特殊的限定詞 (qualifiers)。

> 在 [管理本機資源環境](compose-resource-environment.md) 教學中了解如何處理與資源相關的設定。
>
{style="note"}

除了 `files` 目錄中的原始檔案外，所有資源類型都支援限定詞。使用連字號將限定詞新增至目錄名稱：

![多平台資源中的限定詞](compose-resources-qualifiers.png){width=250}

該程式庫支援以下限定詞（按優先順序排列）：[語言](#language-and-regional-qualifiers)、[佈景主題](#theme-qualifier) 和 [密度](#density-qualifier)。

* 不同類型的限定詞可以組合使用。例如，「drawable-en-rUS-mdpi-dark」是適用於美國地區英語、160 DPI 螢幕且處於深色佈景主題下的影像。
* 如果無法存取具有所求限定詞的資源，則會改用預設資源（無限定詞）。

### 語言與地區限定詞

您可以結合語言與地區限定詞：

* 語言由兩字母 (ISO 639-1) 或三字母 (ISO 639-2) [語言代碼](https://www.loc.gov/standards/iso639-2/php/code_list.php) 定義。
* 您可以在語言代碼中新增兩字母的 [ISO 3166-1-alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 地區代碼。地區代碼必須帶有小寫 `r` 前綴，例如：`drawable-spa-rMX`。

語言和地區代碼區分大小寫。在 [在地化](compose-regional-format.md) 中進一步了解如何處理特定地區的格式。

### 佈景主題限定詞

您可以新增「light」或「dark」限定詞。Compose Multiplatform 隨後會根據目前的系統佈景主題選擇必要的資源。

### 密度限定詞

您可以使用以下密度限定詞：

* "ldpi" – 120 DPI，0.75x 密度
* "mdpi" – 160 DPI，1x 密度
* "hdpi" – 240 DPI，1.5x 密度
* "xhdpi" – 320 DPI，2x 密度
* "xxhdpi" – 480 DPI，3x 密度
* "xxxhdpi" – 640 DPI，4x 密度

資源是根據系統中定義的螢幕密度來選擇的。

## 發佈

從 Compose Multiplatform 1.6.10 開始，所有必要的資源都包含在發佈的 Maven 構件中。

若要啟用此功能，您的專案需要使用 Kotlin 2.0.0 或更新版本，以及 Gradle 7.6 或更新版本。

## 下一步？

* 在 [在您的應用程式中使用多平台資源](compose-multiplatform-resources-usage.md) 頁面中，了解如何存取您設定的資源，以及如何自訂預設產生的存取子。
* 查看官方的 [範例專案](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)，該專案展示了如何在針對 iOS、Android 和桌面平台的 Compose Multiplatform 專案中處理資源。