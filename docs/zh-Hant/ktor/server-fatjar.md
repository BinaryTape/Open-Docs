[//]: # (title: 使用 Ktor Gradle 插件建立大型 JAR 檔)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>了解如何使用 Ktor Gradle 插件建立並執行可執行的大型 JAR 檔。</link-summary>

[Ktor Gradle 插件](https://github.com/ktorio/ktor-build-plugins) 允許您建立並執行一個包含所有程式碼依賴項的可執行 JAR 檔（大型 JAR 檔）。

## 設定 Ktor 插件 {id="configure-plugin"}

為了建立大型 JAR 檔，您需要先設定 Ktor 插件：

1. 開啟 `build.gradle.kts` 檔案並將插件新增到 `plugins` 區塊：
   [object Promise]

2. 確保已設定[主要應用程式類別](server-dependencies.topic#create-entry-point)：
   [object Promise]

3. 您可以選擇性地使用 `ktor.fatJar` 擴充功能來設定將要產生的大型 JAR 檔的名稱：
   [object Promise]

> 如果您同時應用 Ktor Gradle 插件和 Kotlin Multiplatform Gradle 插件，大型 JAR 檔的建立功能會自動停用。
> 為了能夠同時使用它們：
> 1. 建立一個僅限 JVM 的專案，並如上所示套用 Ktor Gradle 插件。
> 2. 將 Kotlin Multiplatform 專案作為依賴項新增到該僅限 JVM 的專案中。
> 
> 如果這個解決方法無法解決您的問題，請在 [KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464) 中留言告知我們。
>
{style="warning"}

## 建立並執行大型 JAR 檔 {id="build"}

Ktor 插件提供了以下用於建立和執行大型 JAR 檔的任務：
- `buildFatJar`：建立專案和執行時依賴項的合併 JAR 檔。此建置完成後，您應該會在 `build/libs` 目錄中看到 `***-all.jar` 檔案。
- `runFatJar`：建立專案的大型 JAR 檔並執行它。

> 若要了解如何使用 ProGuard 最小化產生的 JAR 檔，請參閱 [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 範例。