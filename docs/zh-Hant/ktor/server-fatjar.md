[//]: # (title: 使用 Ktor Gradle 插件建立 fat JAR)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>瞭解如何使用 Ktor Gradle 插件建立並執行一個可執行的 fat JAR。</link-summary>

[Ktor Gradle 插件](https://github.com/ktorio/ktor-build-plugins) 允許您建立並執行一個包含所有程式碼依賴項的可執行 JAR (稱為 fat JAR)。

## 配置 Ktor 插件 {id="configure-plugin"}
要建立 fat JAR，您需要先配置 Ktor 插件：
1. 開啟 `build.gradle.kts` 檔案並將插件新增到 `plugins` 區塊：
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="4,7-8"}

2. 確保 [主應用程式類別](server-dependencies.topic#create-entry-point) 已配置：
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="10-12"}

3. 您可以選擇使用 `ktor.fatJar` 擴充功能配置要生成的 fat JAR 的名稱：
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28-31,53"}

## 建立並執行 fat JAR {id="build"}

Ktor 插件提供了以下用於建立和執行 fat JAR 的任務：
- `buildFatJar`：建立專案及其執行時依賴項的組合 JAR。此建置完成後，您應該會在 `build/libs` 目錄中看到 `***-all.jar` 檔案。
- `runFatJar`：建立專案的 fat JAR 並執行它。

> 要瞭解如何使用 ProGuard 最小化生成的 JAR，請參閱 [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 範例。