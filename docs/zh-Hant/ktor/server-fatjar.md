[//]: # (title: 透過 Ktor Gradle 插件建立 Fat JAR)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>學習如何使用 Ktor Gradle 插件建立及執行可執行 Fat JAR。</link-summary>

[Ktor Gradle 插件](https://github.com/ktorio/ktor-build-plugins) 允許您建立並執行一個包含所有程式碼依賴項的可執行 JAR (Fat JAR)。

## 配置 Ktor 插件 {id="configure-plugin"}

要建立 Fat JAR，您需要先配置 Ktor 插件：

1. 打開 `build.gradle.kts` 檔案並將插件加入 `plugins` 區塊：
   ```kotlin
   plugins {
       id("io.ktor.plugin") version "3.2.3"
   }
   ```

2. 確保已配置 [主要應用程式類別](server-dependencies.topic#create-entry-point)：
   ```kotlin
   application {
       mainClass.set("com.example.ApplicationKt")
   }
   ```

3. (可選) 您可以使用 `ktor.fatJar` 擴充功能配置要生成的 Fat JAR 的名稱：
   ```kotlin
   ktor {
       fatJar {
           archiveFileName.set("fat.jar")
       }
   }
   ```

> 如果您將 Ktor Gradle 插件與 Kotlin Multiplatform Gradle 插件一同應用，Fat JAR 建立功能會自動停用。
> 要能夠一同使用它們：
> 1. 建立一個僅限 JVM 的專案，並如上所示應用 Ktor Gradle 插件。
> 2. 將 Kotlin Multiplatform 專案作為依賴項加入該僅限 JVM 的專案。
> 
> 如果此變通方法未能為您解決問題，請在 [KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464) 中留言告知我們。
>
{style="warning"}

## 建立並執行 Fat JAR {id="build"}

Ktor 插件提供了以下任務用於建立和執行 Fat JAR：
- `buildFatJar`：建立專案和執行時依賴項的組合 JAR。當此建立完成時，您應該會在 `build/libs` 目錄中看到 `***-all.jar` 檔案。
- `runFatJar`：建立專案的 Fat JAR 並執行它。

> 要學習如何使用 ProGuard 最小化生成的 JAR，請參考 [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 範例。