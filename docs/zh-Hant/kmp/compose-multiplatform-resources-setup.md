[//]: # (title: 多平台資源的設定與配置)

<show-structure depth="3"/>

若要正確配置專案以使用多平台資源：

1. 新增程式庫依賴項。
2. 為每種資源類型建立必要的目錄。
3. 為限定資源建立額外目錄 (例如，深色 UI 主題的不同影像或本地化字串)。

## 建置腳本與目錄設定

若要在您的多平台專案中存取資源，請新增程式庫依賴項並在專案目錄中組織檔案：

1. 在 `composeApp` 目錄中的 `build.gradle.kts` 檔案內，為 `commonMain` 原始碼集新增依賴項：

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
   
   > 若要直接引用該程式庫，請使用 [Maven Central 中的成品頁面](https://central.sonatype.com/artifact/org.jetbrains.compose.components/components-resources)上的完整合格名稱。
   {style="tip"}

2. 在您要新增資源的原始碼集目錄中 (本例中為 `commonMain`) 建立一個新目錄 `composeResources`：

   ![Compose resources project structure](compose-resources-structure.png){width=250}

3. 根據以下規則組織 `composeResources` 目錄結構：

   * 影像應放在 `drawable` 目錄中。Compose Multiplatform 支援點陣圖影像 (JPEG、PNG、位元圖和 WebP) 和向量 Android XML 影像 (不含對 Android 資源的引用)。
   * 字型應放在 `font` 目錄中。
   * 字串應放在 `values` 目錄中。
   * 其他檔案應放在 `files` 目錄中，可包含您認為適當的任何資料夾層級結構。

### 自訂資源目錄

在 `build.gradle.kts` 檔案的 `compose.resources {}` 區塊中，您可以為每個原始碼集指定自訂資源目錄。每個自訂目錄也應以與預設 `composeResources` 相同的方式包含檔案：為影像建立 `drawable` 子目錄，為字型建立 `font` 子目錄，依此類推。

一個簡單的範例是指向特定資料夾：

```kotlin
compose.resources {
    customDirectory(
        sourceSetName = "desktopMain",
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

### `androidLibrary` 目標中的資源
<secondary-label ref="Experimental"/>

從 Android Gradle 外掛程式 8.8.0 版開始，您可以在 `androidLibrary` 目標中使用生成的 `Res` 類別和資源存取器。若要在 `androidLibrary` 中啟用多平台資源支援，請更新您的配置如下：

```
kotlin {
  androidLibrary {
    androidResources.enable = true
  }
}
```

## 限定符

有時，相同的資源應根據環境以不同的方式呈現，例如地區設定、螢幕密度或介面主題。例如，您可能需要將文字本地化為不同語言，或為深色主題調整影像。為此，該程式庫提供了特殊的限定符。

> 了解如何在 [管理本地資源環境](compose-resource-environment.md) 教學中處理資源相關設定。
>
{style="note"}

除了 `files` 目錄中的原始檔案外，所有資源類型都支援限定符。使用連字號將限定符新增到目錄名稱中：

![Qualifiers in multiplatform resources](compose-resources-qualifiers.png){width=250}

該程式庫支援 (依優先順序) 以下限定符：[語言](#language-and-regional-qualifiers)、[主題](#theme-qualifier) 和 [密度](#density-qualifier)。

* 不同類型的限定符可以一起套用。例如，"drawable-en-rUS-mdpi-dark" 是一個適用於美國地區的英文影像，適合 160 DPI 螢幕的深色主題。
* 如果無法存取具有所需限定符的資源，則會改用預設資源 (不帶限定符)。

### 語言與地區限定符

您可以組合語言和地區限定符：
* 語言由兩字母 (ISO 639-1) 或三字母 (ISO 639-2) [語言代碼](https://www.loc.gov/standards/iso639-2/php/code_list.php)定義。
* 您可以將兩字母的 [ISO 3166-1-alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 地區代碼新增到您的語言代碼中。地區代碼必須具有小寫的 `r` 字首，例如：`drawable-spa-rMX`

語言和地區代碼區分大小寫。

### 主題限定符

您可以新增「light」或「dark」限定符。Compose Multiplatform 會根據當前系統主題選擇必要的資源。

### 密度限定符

您可以使用以下密度限定符：

* "ldpi" – 120 DPI，0.75x 密度
* "mdpi" – 160 DPI，1x 密度
* "hdpi" – 240 DPI，1.5x 密度
* "xhdpi" – 320 DPI，2x 密度
* "xxhdpi" – 480 DPI，3x 密度
* "xxxhdpi" – 640dpi，4x 密度

資源的選擇取決於系統中定義的螢幕密度。

## 發佈

從 Compose Multiplatform 1.6.10 版開始，所有必要的資源都包含在發佈的 Maven 成品中。

若要啟用此功能，您的專案需要使用 Kotlin 2.0.0 或更新版本以及 Gradle 7.6 或更新版本。

## 接下來是什麼？

* 了解如何在 [](compose-multiplatform-resources-usage.md) 頁面上存取您設定的資源以及如何自訂預設生成的存取器。
* 查看官方 [示範專案](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)，該專案展示了如何在針對 iOS、Android 和桌面平台的多平台 Compose 專案中處理資源。