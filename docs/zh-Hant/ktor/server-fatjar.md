[//]: # (title: 使用 Ktor Gradle 外掛程式建立 fat JAR)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>了解如何使用 Ktor Gradle 外掛程式建立並執行可執行的 fat JAR。</link-summary>

[Ktor Gradle 外掛程式](https://github.com/ktorio/ktor-build-plugins) 允許您建立並執行包含所有程式碼相依性 (fat JAR) 的可執行 JAR。

## 設定 Ktor 外掛程式 {id="configure-plugin"}

若要建置 fat JAR，您需要先設定 Ktor 外掛程式：

1. 開啟 `build.gradle.kts` 檔案並將外掛程式新增至 `plugins` 區塊：
   ```kotlin
   plugins {
       id("io.ktor.plugin") version "3.4.0"
   }
   ```

2. 確保已設定 [主應用程式類別](server-dependencies.topic#create-entry-point)：
   ```kotlin
   application {
       mainClass.set("com.example.ApplicationKt")
   }
   ```

3. （選填）您可以使用 `ktor.fatJar` 擴充來設定要產生的 fat JAR 名稱：
   ```kotlin
   ktor {
       fatJar {
           archiveFileName.set("fat.jar")
       }
   }
   ```

> 如果您將 Ktor Gradle 外掛程式與 Kotlin Multiplatform Gradle 外掛程式一起套用，fat JAR 建立功能將會自動停用。
> 若要同時使用它們：
> 1. 建立一個僅限 JVM 的專案，並如上所述套用 Ktor Gradle 外掛程式。
> 2. 將 Kotlin Multiplatform 專案作為相依性新增到該僅限 JVM 的專案中。
> 
> 如果此權宜之計無法解決您的問題，請在 [KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464) 中留下評論讓我們知道。
>
{style="warning"}

## 組建並執行 fat JAR {id="build"}

Ktor 外掛程式提供以下任務來建立與執行 fat JAR：
- `buildFatJar`：組建專案與執行階段相依性的合併 JAR。當此組建完成時，您應該會在 `build/libs` 目錄中看到 `***-all.jar` 檔案。
- `runFatJar`：組建專案的 fat JAR 並執行。

> 若要了解如何使用 ProGuard 最小化產生的 JAR，請參閱 [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 範例。