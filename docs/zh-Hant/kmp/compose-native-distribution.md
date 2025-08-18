[//]: # (title: 原生發佈)

您將在這裡了解原生發佈：如何為所有支援的系統建立安裝程式和套件，以及如何以與發佈相同的設定在本機執行應用程式。

請繼續閱讀以下主題的詳細資訊：

*   [什麼是 Compose Multiplatform Gradle plugin](#gradle-plugin)？
*   [基本任務的詳細資訊](#basic-tasks)，例如在本機執行應用程式，以及[進階任務](#minification-and-obfuscation)，例如縮小化和混淆處理。
*   [如何包含 JDK 模組](#including-jdk-modules)並處理 `ClassNotFoundException`。
*   [如何指定發佈屬性](#specifying-distribution-properties)：套件版本、JDK 版本、輸出目錄、啟動器屬性和中繼資料。
*   [如何管理資源](#managing-resources)，透過資源庫、JVM 資源載入或將檔案新增至已封裝應用程式。
*   [如何自訂原始碼集](#custom-source-sets)，透過 Gradle 原始碼集、Kotlin JVM 目標或手動方式。
*   [如何為每個作業系統指定應用程式圖示](#application-icon)。
*   [平台特定選項](#platform-specific-options)，例如 Linux 上套件維護者的電子郵件，以及 macOS 上 Apple App Store 的應用程式類別。
*   [macOS 特定配置](#macos-specific-configuration)：簽章、公證和 `Info.plist`。

## Gradle plugin

本指南主要著重於使用 Compose Multiplatform Gradle plugin 封裝 Compose 應用程式。
`org.jetbrains.compose` plugin 提供基本封裝、混淆處理和 macOS 程式碼簽章的任務。

此 plugin 簡化了使用 `jpackage` 將應用程式封裝為原生發佈以及在本機執行應用程式的流程。
可發佈的應用程式是自我包含、可安裝的二進位檔，其中包含所有必要的 Java 執行階段元件，無需在目標系統上安裝 JDK。

為了最小化套件大小，Gradle plugin 使用 [jlink](https://openjdk.org/jeps/282) 工具，該工具確保只將必要的 Java 模組捆綁在可發佈套件中。
但是，您仍然必須配置 Gradle plugin 以指定您需要的模組。
更多資訊請參閱 [undefined](#including-jdk-modules) 章節。

或者，您也可以使用 [Conveyor](https://www.hydraulic.software)，這是一個非 JetBrains 開發的外部工具。
Conveyor 支援線上更新、跨平台建置和各種其他功能，但對於非開放原始碼專案需要[授權](https://hydraulic.software/pricing.html)。
更多資訊請參考 [Conveyor 文件](https://conveyor.hydraulic.dev/latest/tutorial/hare/jvm)。

## 基本任務

Compose Multiplatform Gradle plugin 中最基本的配置單元是 `application` (不要與已棄用的 [Gradle application](https://docs.gradle.org/current/userguide/application_plugin.html) plugin 混淆)。

`application` DSL 方法定義了一組最終二進位檔的共用配置，這表示它允許您將一組檔案連同 JDK 發佈捆綁成各種格式的壓縮二進位安裝程式。

以下格式適用於支援的作業系統：

*   **macOS**：`.dmg` (`TargetFormat.Dmg`)、`.pkg` (`TargetFormat.Pkg`)
*   **Windows**：`.exe` (`TargetFormat.Exe`)、`.msi` (`TargetFormat.Msi`)
*   **Linux**：`.deb` (`TargetFormat.Deb`)、`.rpm` (`TargetFormat.Rpm`)

以下是帶有基本桌面配置的 `build.gradle.kts` 檔案範例：

```kotlin
import org.jetbrains.compose.desktop.application.dsl.TargetFormat

plugins {
    kotlin("jvm")
    id("org.jetbrains.compose")
}

dependencies {
    implementation(compose.desktop.currentOs)
}

compose.desktop {
    application {
        mainClass = "example.MainKt"

        nativeDistributions {
            targetFormats(TargetFormat.Dmg, TargetFormat.Msi, TargetFormat.Exe)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="compose.desktop { application { mainClass = "}

當您建置專案時，plugin 會建立以下任務：

<table>
    
<tr>
<td>Gradle task</td>
        <td>Description</td>
</tr>

    
<tr>
<td><code>package&lt;FormatName&gt;</code></td> 
        <td>將應用程式封裝成對應的 <code>FormatName</code> 二進位檔。目前不支援跨平台編譯，
            這表示您只能使用對應的相容作業系統建置特定格式。
            例如，要建置 <code>.dmg</code> 二進位檔，您必須在 macOS 上執行 <code>packageDmg</code> 任務。
            如果任何任務與目前的作業系統不相容，它們會預設跳過。</td>
</tr>

    
<tr>
<td><code>packageDistributionForCurrentOS</code></td>
        <td>彙總應用程式的所有封裝任務。它是一個 <a href="https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:task_categories">生命週期任務</a>。</td>
</tr>

    
<tr>
<td><code>packageUberJarForCurrentOS</code></td>
        <td>建立一個包含所有適用於目前作業系統之依賴項的單一 `jar` 檔案。
        此任務預期將 <code>compose.desktop.currentOS</code> 用作 <code>compile</code>、<code>implementation</code> 或 <code>runtime</code> 依賴項。</td>
</tr>

    
<tr>
<td><code>run</code></td>
        <td>從 <code>mainClass</code> 中指定的入口點在本機執行應用程式。<code>run</code> 任務會啟動一個具有完整執行階段的非封裝 JVM 應用程式。
        與建立帶有縮小化執行階段的緊湊二進位映像相比，此方法更快且更容易偵錯。
        要執行最終二進位映像，請改用 <code>runDistributable</code> 任務。</td>
</tr>

    
<tr>
<td><code>createDistributable</code></td>
        <td>建立最終應用程式映像而不建立安裝程式。</td>
</tr>

    
<tr>
<td><code>runDistributable</code></td>
        <td>執行預先封裝的應用程式映像。</td>
</tr>

</table>

所有可用的任務都列在 Gradle 工具視窗中。執行任務後，Gradle 會在 `${project.buildDir}/compose/binaries` 目錄中生成輸出二進位檔。

## 包含 JDK 模組

為了減少可發佈的大小，Gradle plugin 使用 [jlink](https://openjdk.org/jeps/282) 來幫助捆綁只必要的 JDK 模組。

目前，Gradle plugin 不會自動判斷必要的 JDK 模組。雖然這不會導致編譯問題，
但無法提供必要的模組可能導致執行階段的 `ClassNotFoundException`。

如果您在執行已封裝應用程式或 `runDistributable` 任務時遇到 `ClassNotFoundException`，
您可以使用 `modules` DSL 方法包含額外的 JDK 模組：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("java.sql")
            // Alternatively: includeAllModules = true
        }
    }
}
```

您可以手動指定所需的模組，或執行 `suggestModules`。`suggestModules` 任務使用 [jdeps](https://docs.oracle.com/javase/9/tools/jdeps.htm) 靜態分析工具來判斷可能遺失的模組。
請注意，此工具的輸出可能不完整或列出不必要的模組。

如果可發佈的大小不是關鍵因素且可以忽略，您可以選擇透過使用 `includeAllModules` DSL 屬性來包含所有執行階段模組。

## 指定發佈屬性

### 套件版本

原生發佈套件必須具有特定的套件版本。
要指定套件版本，您可以使用以下 DSL 屬性，從最高優先順序到最低優先順序列出：

*   `nativeDistributions.<os>.<packageFormat>PackageVersion` 為單一套件格式指定版本。
*   `nativeDistributions.<os>.packageVersion` 為單一目標作業系統指定版本。
*   `nativeDistributions.packageVersion` 為所有套件指定版本。

在 macOS 上，您還可以使用以下 DSL 屬性指定建置版本，同樣從最高優先順序到最低優先順序列出：

*   `nativeDistributions.macOS.<packageFormat>PackageBuildVersion` 為單一套件格式指定建置版本。
*   `nativeDistributions.macOS.packageBuildVersion` 為所有 macOS 套件指定建置版本。

如果您未指定建置版本，Gradle 會改用套件版本。更多關於 macOS 上的版本控制資訊，請參閱
[`CFBundleShortVersionString`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring)
和 [`CFBundleVersion`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion) 文件。

以下是依優先順序指定套件版本的範本：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            // Version for all packages
            packageVersion = "..." 
          
            macOS {
              // Version for all macOS packages
              packageVersion = "..."
              // Version for the dmg package only
              dmgPackageVersion = "..." 
              // Version for the pkg package only
              pkgPackageVersion = "..." 
              
              // Build version for all macOS packages
              packageBuildVersion = "..."
              // Build version for the dmg package only
              dmgPackageBuildVersion = "..." 
              // Build version for the pkg package only
              pkgPackageBuildVersion = "..." 
            }
            windows {
              // Version for all Windows packages
              packageVersion = "..."  
              // Version for the msi package only
              msiPackageVersion = "..."
              // Version for the exe package only
              exePackageVersion = "..." 
            }
            linux {
              // Version for all Linux packages
              packageVersion = "..."
              // Version for the deb package only
              debPackageVersion = "..."
              // Version for the rpm package only
              rpmPackageVersion = "..."
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="compose.desktop { application { nativeDistributions { packageVersion ="}

要定義套件版本，請遵循以下規則：

<table>
    
<tr>
<td>檔案類型</td>
        <td>版本格式</td>
        <td>詳細資訊</td>
</tr>

    
<tr>
<td><code>dmg</code>, <code>pkg</code></td>
        <td><code>MAJOR[.MINOR][.PATCH]</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code> 是大於 0 的整數</li>
                <li><code>MINOR</code> 是可選的非負整數</li>
                <li><code>PATCH</code> 是可選的非負整數</li>
            </ul>
        </td>
</tr>

    
<tr>
<td><code>msi</code>, <code>exe</code></td>
        <td><code>MAJOR.MINOR.BUILD</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code> 是最大值為 255 的非負整數</li>
                <li><code>MINOR</code> 是最大值為 255 的非負整數</li>
                <li><code>BUILD</code> 是最大值為 65535 的非負整數</li>
            </ul>
        </td>
</tr>

    
<tr>
<td><code>deb</code></td>
        <td><code>[EPOCH:]UPSTREAM_VERSION[-DEBIAN_REVISION]</code></td>
        <td>
            <ul>
                <li><code>EPOCH</code> 是可選的非負整數</li>
                <li><code>UPSTREAM_VERSION</code>：
                    <ul>
                        <li>只能包含字母數字和 <code>.</code>、<code>+</code>、<code>-</code>、<code>~</code> 字元</li>
                        <li>必須以數字開頭</li>
                    </ul>
                </li>
                <li><code>DEBIAN_REVISION</code>：
                    <ul>
                        <li>可選</li>
                        <li>只能包含字母數字和 <code>.</code>、<code>+</code>、<code>~</code> 字元</li>
                    </ul>
                </li>
            </ul>
            更多詳細資訊請參閱 <a href="https://www.debian.org/doc/debian-policy/ch-controlfields.html#version">Debian 文件</a>。
        </td>
</tr>

    
<tr>
<td><code>rpm</code></td>
        <td>任何格式</td>
        <td>版本不得包含 <code>-</code> (連字號) 字元。</td>
</tr>

</table>

### JDK 版本

此 plugin 使用 `jpackage`，它要求 JDK 版本不低於 [JDK 17](https://openjdk.java.net/projects/jdk/17/)。
指定 JDK 版本時，請確保您至少符合以下其中一項要求：

*   `JAVA_HOME` 環境變數指向相容的 JDK 版本。
*   `javaHome` 屬性透過 DSL 設定：

    ```kotlin
    compose.desktop {
        application {
            javaHome = System.getenv("JDK_17")
        }
    }
    ```

### 輸出目錄

若要為原生發佈使用自訂輸出目錄，請如下所示配置 `outputBaseDir` 屬性：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            outputBaseDir.set(project.layout.buildDirectory.dir("customOutputDir"))
        }
    }
}
```

### 啟動器屬性

為自訂應用程式啟動流程，您可以自訂以下屬性：

<table>
  
<tr>
<td>屬性</td>
    <td>描述</td>
</tr>

  
<tr>
<td><code>mainClass</code></td>
    <td>包含 <code>main</code> 方法的類別完整名稱。</td>
</tr>

  
<tr>
<td><code>args</code></td>
    <td>應用程式 <code>main</code> 方法的引數。</td>
</tr>

  
<tr>
<td><code>jvmArgs</code></td>
    <td>應用程式 JVM 的引數。</td>
</tr>

</table>

以下是一個配置範例：

```kotlin
compose.desktop {
    application {
        mainClass = "MainKt"
        args += listOf("-customArgument")
        jvmArgs += listOf("-Xmx2G")
    }
}
```

### 中繼資料

在 `nativeDistributions` DSL 區塊內，您可以配置以下屬性：

<table>
  
<tr>
<td>屬性</td>
    <td>描述</td>
    <td>預設值</td>
</tr>

  
<tr>
<td><code>packageName</code></td>
    <td>應用程式的名稱。</td>
    <td>Gradle 專案的 <a href="https://docs.gradle.org/current/javadoc/org/gradle/api/Project.html#getName--">名稱</a></td>
</tr>

  
<tr>
<td><code>packageVersion</code></td>
    <td>應用程式的版本。</td>
    <td>Gradle 專案的 <a href="https://docs.gradle.org/current/javadoc/org/gradle/api/Project.html#getVersion--">版本</a></td>
</tr>

  
<tr>
<td><code>description</code></td>
    <td>應用程式的描述。</td>
    <td>無</td>
</tr>

  
<tr>
<td><code>copyright</code></td>
    <td>應用程式的著作權資訊。</td>
    <td>無</td>
</tr>

  
<tr>
<td><code>vendor</code></td>
    <td>應用程式的供應商。</td>
    <td>無</td>
</tr>

  
<tr>
<td><code>licenseFile</code></td>
    <td>應用程式的授權檔案。</td>
    <td>無</td>
</tr>

</table> 

以下是一個配置範例：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            packageName = "ExampleApp"
            packageVersion = "0.1-SNAPSHOT"
            description = "Compose Multiplatform App"
            copyright = "© 2024 My Name. All rights reserved."
            vendor = "Example vendor"
            licenseFile.set(project.file("LICENSE.txt"))
        }
    }
}
```

## 管理資源

要封裝和載入資源，您可以使用 Compose Multiplatform 資源庫、JVM 資源載入，或將檔案新增至已封裝應用程式。

### 資源庫

設定專案資源最直接的方法是使用資源庫。
有了資源庫，您可以在所有支援的平台上透過通用程式碼存取資源。
詳情請參閱 [多平台資源](compose-multiplatform-resources.md)。

### JVM 資源載入

Compose Multiplatform for desktop 在 JVM 平台上運作，這表示您可以使用 `java.lang.Class` API 從 `.jar` 檔案載入資源。您可以透過
[`Class::getResource`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResource(java.lang.String))
或 [`Class::getResourceAsStream`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResourceAsStream(java.lang.String))
存取 `src/main/resources` 目錄中的檔案。

### 將檔案新增至已封裝應用程式

在某些情況下，從 `.jar` 檔案載入資源可能不太實際，例如，當您有特定目標的資產，並且需要只將檔案包含在 macOS 套件中，而不包含在 Windows 套件中。

在這些情況下，您可以配置 Gradle plugin 以在安裝目錄中包含額外的資源檔案。
如下所示透過 DSL 指定根資源目錄：

```kotlin
compose.desktop {
    application {
        mainClass = "MainKt"
        nativeDistributions {
            targetFormats(TargetFormat.Dmg, TargetFormat.Msi, TargetFormat.Deb)
            packageVersion = "1.0.0"

            appResourcesRootDir.set(project.layout.projectDirectory.dir("resources"))
        }
    }
}
```

在上述範例中，根資源目錄定義為 `<PROJECT_DIR>/resources`。

Gradle plugin 將從資源子目錄中包含檔案，如下所示：

1.  **共用資源：**
    位於 `<RESOURCES_ROOT_DIR>/common` 中的檔案將包含在所有套件中，無論目標作業系統或架構為何。

2.  **作業系統特定資源：**
    位於 `<RESOURCES_ROOT_DIR>/<OS_NAME>` 中的檔案將只包含在為特定作業系統建置的套件中。
    `<OS_NAME>` 的有效值為：`windows`、`macos` 和 `linux`。

3.  **作業系統和架構特定資源：**
    位於 `<RESOURCES_ROOT_DIR>/<OS_NAME>-<ARCH_NAME>` 中的檔案將只包含在為特定作業系統和 CPU 架構組合建置的套件中。
    `<ARCH_NAME>` 的有效值為：`x64` 和 `arm64`。
    例如，位於 `<RESOURCES_ROOT_DIR>/macos-arm64` 中的檔案將只包含在適用於 Apple Silicon Macs 的套件中。

您可以使用 `compose.application.resources.dir` 系統屬性存取包含的資源：

```kotlin
import java.io.File

val resourcesDir = File(System.getProperty("compose.application.resources.dir"))

fun main() {
    println(resourcesDir.resolve("resource.txt").readText())
}
```

## 自訂原始碼集

如果您使用 `org.jetbrains.kotlin.jvm` 或 `org.jetbrains.kotlin.multiplatform` plugins，您可以依賴預設配置：

*   使用 `org.jetbrains.kotlin.jvm` 的配置包含來自 `main` [原始碼集](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets)的內容。
*   使用 `org.jetbrains.kotlin.multiplatform` 的配置包含來自單一 [JVM 目標](multiplatform-dsl-reference.md#targets)的內容。
    如果您定義多個 JVM 目標，預設配置將會停用。在這種情況下，您需要手動配置 plugin，
    或指定單一目標 (請參閱下方)。

如果預設配置模糊不清或不足，您可以透過幾種方式自訂它：

使用 Gradle [原始碼集](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets)：

``` kotlin
plugins {
    kotlin("jvm")
    id("org.jetbrains.compose")
}
val customSourceSet = sourceSets.create("customSourceSet")
compose.desktop {
    application {
        from(customSourceSet)
    }
}
``` 

使用 Kotlin [JVM 目標](multiplatform-dsl-reference.md#targets)：

``` kotlin
plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose")
} 
kotlin {
    jvm("customJvmTarget") {}
}
compose.desktop {
    application {
        from(kotlin.targets["customJvmTarget"])
    }
}
```

手動：

*   使用 `disableDefaultConfiguration` 停用預設設定。
*   使用 `fromFiles` 指定要包含的檔案。
*   指定 `mainJar` 檔案屬性以指向包含 `main` 類別的 `.jar` 檔案。
*   使用 `dependsOn` 將任務依賴項新增至所有 plugin 任務。
``` kotlin
compose.desktop {
    application {
        disableDefaultConfiguration()
        fromFiles(project.fileTree("libs/") { include("**/*.jar") })
        mainJar.set(project.file("main.jar"))
        dependsOn("mainJarTask")
    }
}
```

## 應用程式圖示

確保您的應用程式圖示以以下作業系統特定格式提供：

*   `.icns` 適用於 macOS
*   `.ico` 適用於 Windows
*   `.png` 適用於 Linux

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                iconFile.set(project.file("icon.icns"))
            }
            windows {
                iconFile.set(project.file("icon.ico"))
            }
            linux {
                iconFile.set(project.file("icon.png"))
            }
        }
    }
}
```

## 平台特定選項

平台特定設定可以使用對應的 DSL 區塊進行配置：

``` kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                // Options for macOS
            }
            windows {
                // Options for Windows
            }
            linux {
                // Options for Linux
            }
        }
    }
}
```

下表描述了所有支援的平台特定選項。**不建議**使用未經文件記載的屬性。

<table>
    
<tr>
<td>平台</td>
        <td>選項</td>
        <td width="500">描述</td>
</tr>

    
<tr>
<td rowspan="3">所有平台</td>
        <td><code>iconFile.set(File("PATH_TO_ICON"))</code></td>
        <td>指定應用程式的平台特定圖示路徑。詳情請參閱<a href="#application-icon">應用程式圖示</a>章節。</td>
</tr>

    
<tr>
<td><code>packageVersion = "1.0.0"</code></td>
        <td>設定平台特定套件版本。詳情請參閱<a href="#package-version">套件版本</a>章節。</td>
</tr>

    
<tr>
<td><code>installationPath = "PATH_TO_INST_DIR"</code></td>
        <td>指定預設安裝目錄的絕對或相對路徑。
            在 Windows 上，您還可以使用 <code>dirChooser = true</code> 來啟用在安裝期間自訂路徑。</td>
</tr>

    
<tr>
<td rowspan="8">Linux</td>
        <td><code>packageName = "custom-package-name"</code></td>
        <td>覆寫預設應用程式名稱。</td>
</tr>

    
<tr>
<td><code>debMaintainer = "maintainer@example.com"</code></td>
        <td>指定套件維護者的電子郵件。</td>
</tr>

    
<tr>
<td><code>menuGroup = "my-example-menu-group"</code></td>
        <td>定義應用程式的功能表群組。</td>
</tr>

    
<tr>
<td><code>appRelease = "1"</code></td>
        <td>設定 rpm 套件的發佈值或 deb 套件的修訂值。</td>
</tr>

    
<tr>
<td><code>appCategory = "CATEGORY"</code></td>
        <td>為 rpm 套件分配群組值或為 deb 套件分配區段值。</td>
</tr>

    
<tr>
<td><code>rpmLicenseType = "TYPE_OF_LICENSE"</code></td>
        <td>指示 rpm 套件的授權類型。</td>
</tr>

    
<tr>
<td><code>debPackageVersion = "DEB_VERSION"</code></td>
        <td>設定 deb 特定套件版本。詳情請參閱<a href="#package-version">套件版本</a>章節。</td>
</tr>

    
<tr>
<td><code>rpmPackageVersion = "RPM_VERSION"</code></td>
        <td>設定 rpm 特定套件版本。詳情請參閱<a href="#package-version">套件版本</a>章節。</td>
</tr>

    
<tr>
<td rowspan="15">macOS</td>
        <td><code>bundleID</code></td>
        <td>
            指定唯一的應用程式識別碼，其中只能包含字母數字字元
            (<code>A-Z</code>、<code>a-z</code>、<code>0-9</code>)、連字號 (<code>-</code>) 和
            句點 (<code>.</code>)。建議使用反向 DNS 標記法 (<code>com.mycompany.myapp</code>)。
        </td>
</tr>

    
<tr>
<td><code>packageName</code></td>
        <td>應用程式的名稱。</td>
</tr>

    
<tr>
<td><code>dockName</code></td>
        <td>
            應用程式在選單列、「關於 &lt;App&gt;」選單項目，
            以及在 Dock 中顯示的名稱。預設值為 <code>packageName</code>。
        </td>
</tr>

    
<tr>
<td><code>minimumSystemVersion</code></td>
        <td>
            執行應用程式所需的最低 macOS 版本。詳情請參閱
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsminimumsystemversion">
                <code>LSMinimumSystemVersion</code></a>。
        </td>
</tr>

    
<tr>
<td><code>signing</code>、<code>notarization</code>、<code>provisioningProfile</code>、<code>runtimeProvisioningProfile</code></td>
        <td>
            請參閱
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               《macOS 發佈的簽章和公證》</a>教學課程。
        </td>
</tr>

    
<tr>
<td><code>appStore = true</code></td>
        <td>指定是否為 Apple App Store 建置和簽署應用程式。至少需要 JDK 17。</td>
</tr>

    
<tr>
<td><code>appCategory</code></td>
        <td>
            Apple App Store 的應用程式類別。為 App Store 建置時，預設值為
            <code>public.app-category.utilities</code>，否則為 <code>Unknown</code>。
            請參閱
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsapplicationcategorytype">
                <code>LSApplicationCategoryType</code>
            </a> 以取得有效類別列表。
        </td>
</tr>

    
<tr>
<td><code>entitlementsFile.set(File("PATH_ENT"))</code></td>
        <td>
            指定包含簽章時使用的授權檔案路徑。當您提供自訂檔案時，
            請務必新增 Java 應用程式所需的授權。請參閱
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a> 以取得為 App Store 建置時使用的預設檔案。請注意，此預設檔案可能因您的 JDK 版本而異。
            如果未指定檔案，plugin 將使用 <code>jpackage</code> 提供的預設授權。詳情請參閱
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               《macOS 發佈的簽章和公證》</a>教學課程。
        </td>
</tr>

    
<tr>
<td><code>runtimeEntitlementsFile.set(File("PATH_R_ENT"))</code></td>
        <td>
            指定包含簽署 JVM 執行階段時使用的授權檔案路徑。當您提供自訂檔案時，
            請務必新增 Java 應用程式所需的授權。請參閱
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a> 以取得為 App Store 建置時使用的預設檔案。請注意，此預設檔案可能因您的 JDK 版本而異。
            如果未指定檔案，plugin 將使用 <code>jpackage</code> 提供的預設授權。詳情請參閱
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               《macOS 發佈的簽章和公證》</a>教學課程。
        </td>
</tr>

    
<tr>
<td><code>dmgPackageVersion = "DMG_VERSION"</code></td>
        <td>
            設定 DMG 特定套件版本。詳情請參閱<a href="#package-version">套件版本</a>章節。
        </td>
</tr>

    
<tr>
<td><code>pkgPackageVersion = "PKG_VERSION"</code></td>
        <td>
            設定 PKG 特定套件版本。詳情請參閱<a href="#package-version">套件版本</a>章節。
        </td>
</tr>

    
<tr>
<td><code>packageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            設定套件建置版本。詳情請參閱<a href="#package-version">套件版本</a>章節。
        </td>
</tr>

    
<tr>
<td><code>dmgPackageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            設定 DMG 特定套件建置版本。詳情請參閱<a href="#package-version">套件版本</a>章節。
        </td>
</tr>

    
<tr>
<td><code>pkgPackageBuildVersion = "PKG_VERSION"</code></td>
        <td>
            設定 PKG 特定套件建置版本。詳情請參閱<a href="#package-version">套件版本</a>章節。
        </td>
</tr>

    
<tr>
<td><code>infoPlist</code></td>
        <td>請參閱<a href="#information-property-list-on-macos"><code>Info.plist</code> on macOS</a>章節。</td>
</tr>

        
<tr>
<td rowspan="7">Windows</td>
            <td><code>console = true</code></td>
            <td>為應用程式新增控制台啟動器。</td>
</tr>

        
<tr>
<td><code>dirChooser = true</code></td>
            <td>啟用在安裝期間自訂安裝路徑。</td>
</tr>

        
<tr>
<td><code>perUserInstall = true</code></td>
            <td>啟用應用程式的按使用者安裝。</td>
</tr>

        
<tr>
<td><code>menuGroup = "start-menu-group"</code></td>
            <td>將應用程式新增至指定的開始功能表群組。</td>
</tr>

        
<tr>
<td><code>upgradeUuid = "UUID"</code></td>
            <td>指定一個唯一 ID，當有比已安裝版本更新的版本時，
            允許使用者透過安裝程式更新應用程式。該值對於單一應用程式必須保持不變。
            詳情請參閱 <a href="https://wixtoolset.org/documentation/manual/v3/howtos/general/generate_guids.html">如何：產生 GUID</a>。</td>
</tr>

        
<tr>
<td><code>msiPackageVersion = "MSI_VERSION"</code></td>
            <td>設定 MSI 特定套件版本。詳情請參閱<a href="#package-version">套件版本</a>章節。</td>
</tr>

        
<tr>
<td><code>exePackageVersion = "EXE_VERSION"</code></td>
            <td>設定 EXE 特定套件版本。詳情請參閱<a href="#package-version">套件版本</a>章節。</td>
</tr>

</table>

## macOS 特定配置

### macOS 上的簽章和公證

現代 macOS 版本不允許使用者執行從網際網路下載的未簽章應用程式。如果您嘗試執行此類應用程式，將會遇到
以下錯誤：「YourApp 已損壞，無法開啟。您應退出磁碟映像檔」。

要了解如何簽章和公證您的應用程式，請參閱我們的[教學課程](https://github.com/JetBrains/compose-multiplatform/blob/master/tutorials/Signing_and_notarization_on_macOS/README.md)。

### macOS 上的資訊屬性清單 (`Info.plist`)

儘管 DSL 支援必要的平台特定自訂，但仍可能存在超出提供功能範圍的案例。
如果您需要指定 DSL 中未表示的 `Info.plist` 值，
您可以包含一段原始 XML 片段作為解決方案。此 XML 將附加到應用程式的 `Info.plist`。

#### 範例：深度連結

1.  在 `build.gradle.kts` 檔案中定義自訂 URL 配置：

    ``` kotlin
    compose.desktop {
        application {
            mainClass = "MainKt"
            nativeDistributions {
                targetFormats(TargetFormat.Dmg)
                packageName = "Deep Linking Example App"
                macOS {
                    bundleID = "org.jetbrains.compose.examples.deeplinking"
                    infoPlist {
                        extraKeysRawXml = macExtraPlistKeys
                    }
                }
            }
        }
    }
    
    val macExtraPlistKeys: String
        get() = """
          <key>CFBundleURLTypes</key>
          <array>
            <dict>
              <key>CFBundleURLName</key>
              <string>Example deep link</string>
              <key>CFBundleURLSchemes</key>
              <array>
                <string>compose</string>
              </array>
            </dict>
          </array>
        """
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="infoPlist { extraKeysRawXml = macExtraPlistKeys"}

2.  在 `src/main/main.kt` 檔案中使用 `java.awt.Desktop` 類別設定 URI 處理程式：

    ``` kotlin 
    import androidx.compose.material.MaterialTheme
    import androidx.compose.material.Text
    import androidx.compose.runtime.getValue
    import androidx.compose.runtime.mutableStateOf
    import androidx.compose.runtime.setValue
    import androidx.compose.ui.window.singleWindowApplication
    import java.awt.Desktop
    
    fun main() {
        var text by mutableStateOf("Hello, World!")
    
        try {
            Desktop.getDesktop().setOpenURIHandler { event ->
                text = "Open URI: " + event.uri
            }
        } catch (e: UnsupportedOperationException) {
            println("setOpenURIHandler is unsupported")
        }
    
        singleWindowApplication {
            MaterialTheme {
                Text(text)
            }
        }
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="Desktop.getDesktop().setOpenURIHandler { event ->"}

3.  執行 `runDistributable` 任務：`./gradlew runDistributable`。

結果，像 `compose://foo/bar` 這樣的連結現在可以從瀏覽器重新導向到您的應用程式。

## 縮小化和混淆處理

Compose Multiplatform Gradle plugin 內建支援 [ProGuard](https://www.guardsquare.com/proguard)。
ProGuard 是一個用於程式碼縮小化和混淆處理的[開放原始碼工具](https://github.com/Guardsquare/proguard)。

對於每個*預設*（無 ProGuard）封裝任務，Gradle plugin 都提供一個*發佈*任務（帶 ProGuard）：

<table>
  
<tr>
<td width="400">Gradle task</td>
    <td>描述</td>
</tr>

  
<tr>
<td>
        <p>預設：<code>createDistributable</code></p>
        <p>發佈：<code>createReleaseDistributable</code></p>
    </td>
    <td>建立帶有捆綁 JDK 和資源的應用程式映像。</td>
</tr>

  
<tr>
<td>
        <p>預設：<code>runDistributable</code></p>
        <p>發佈：<code>runReleaseDistributable</code></p>
    </td>
    <td>執行帶有捆綁 JDK 和資源的應用程式映像。</td>
</tr>

  
<tr>
<td>
        <p>預設：<code>run</code></p>
        <p>發佈：<code>runRelease</code></p>
    </td>
    <td>使用 Gradle JDK 執行非封裝應用程式 <code>.jar</code>。</td>
</tr>

  
<tr>
<td>
        <p>預設：<code>package&lt;FORMAT_NAME&gt;</code></p>
        <p>發佈：<code>packageRelease&lt;FORMAT_NAME&gt;</code></p>
    </td>
    <td>將應用程式映像封裝為 <code>&lt;FORMAT_NAME&gt;</code> 檔案。</td>
</tr>

  
<tr>
<td>
        <p>預設：<code>packageDistributionForCurrentOS</code></p>
        <p>發佈：<code>packageReleaseDistributionForCurrentOS</code></p>
    </td>
    <td>將應用程式映像封裝為與目前作業系統相容的格式。</td>
</tr>

  
<tr>
<td>
        <p>預設：<code>packageUberJarForCurrentOS</code></p>
        <p>發佈：<code>packageReleaseUberJarForCurrentOS</code></p>
    </td>
    <td>將應用程式映像封裝為一個 uber (fat) <code>.jar</code>。</td>
</tr>

  
<tr>
<td>
        <p>預設：<code>notarize&lt;FORMAT_NAME&gt;</code></p>
        <p>發佈：<code>notarizeRelease&lt;FORMAT_NAME&gt;</code></p>
    </td>
    <td>上傳 <code>&lt;FORMAT_NAME&gt;</code> 應用程式映像以進行公證 (僅限 macOS)。</td>
</tr>

  
<tr>
<td>
        <p>預設：<code>checkNotarizationStatus</code></p>
        <p>發佈：<code>checkReleaseNotarizationStatus</code></p>
    </td>
    <td>檢查公證是否成功 (僅限 macOS)。</td>
</tr>

</table>

預設配置啟用了一些預定義的 ProGuard 規則：

*   應用程式映像已縮小化，這表示未使用的類別會被移除。
*   `compose.desktop.application.mainClass` 用作入口點。
*   包含多個 `keep` 規則，以確保 Compose 執行階段保持正常運作。

在大多數情況下，您不需要任何額外配置即可獲得縮小化應用程式。
但是，ProGuard 可能無法追蹤位元組碼中的某些用法，例如，當類別透過反射使用時。
如果您遇到僅在 ProGuard 處理後發生的問題，您可能需要新增自訂規則。

要指定自訂配置檔案，請使用如下所示的 DSL：

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            configurationFiles.from(project.file("compose-desktop.pro"))
        }
    }
}
```

更多關於 ProGuard 規則和配置選項的資訊，請參考 Guardsquare [手冊](https://www.guardsquare.com/manual/configuration/usage)。

混淆處理預設為停用。要啟用它，請透過 Gradle DSL 設定以下屬性：

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            obfuscate.set(true)
        }
    }
}
```

ProGuard 的優化預設為啟用。要停用它們，請透過 Gradle DSL 設定以下屬性：

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            optimize.set(false)
        }
    }
}
```

預設停用產生 uber JAR，ProGuard 會為每個輸入的 `.jar` 檔案產生一個對應的 `.jar` 檔案。要啟用它，請透過 Gradle DSL 設定以下屬性：

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            joinOutputJars.set(true)
        }
    }
}
```

## 接下來是什麼？

探索關於[桌面元件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)的教學課程。