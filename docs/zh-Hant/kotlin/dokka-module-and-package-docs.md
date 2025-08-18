[//]: # (title: 模組文件)

整個模組以及該模組中套件的文件，可以作為獨立的 Markdown 檔案提供。

## 檔案格式

在 Markdown 檔案中，整個模組及個別套件的文件由對應的一級標題引入。模組的標題文字**必須**是 **Module `<module name>`**，而套件的標題文字則**必須**是 **Package `<package qualified name>`**。

該檔案不必同時包含模組與套件的文件。您可以只包含套件或模組文件的檔案。您甚至可以為每個模組或套件建立一個 Markdown 檔案。

使用 [Markdown 語法](https://www.markdownguide.org/basic-syntax/)，您可以新增：
* 高達 6 級的標題
* 以粗體或斜體格式進行強調
* 連結
* 行內程式碼
* 程式碼區塊
* 引言區塊

以下是一個包含模組與套件文件的範例檔案：

```text
# Module kotlin-demo

This content appears under your module name.

# Package org.jetbrains.kotlin.demo

This content appears under your package name in the packages list.
It also appears under the first-level heading on your package's page.

## Level 2 heading for package org.jetbrains.kotlin.demo

Content after this heading is also part of documentation for `org.jetbrains.kotlin.demo`

# Package org.jetbrains.kotlin.demo2

This content appears under your package name in the packages list.
It also appears under the first-level heading on your package's page.

## Level 2 heading for package org.jetbrains.kotlin.demo2

Content after this heading is also part of documentation for `org.jetbrains.kotlin.demo2`
```

若要探索使用 Gradle 的範例專案，請參閱 [Dokka Gradle 範例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example)。

## 將檔案傳遞給 Dokka

若要將這些檔案傳遞給 Dokka，您需要使用 Gradle、Maven 或 CLI 的對應 **includes** 選項：

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

在 [Source set configuration](dokka-gradle.md#includes) 中使用 [includes](dokka-gradle.md#source-set-configuration) 選項。

</tab>

<tab title="Maven" group-key="mvn">

在 [General configuration](dokka-maven.md#general-configuration) 中使用 [includes](dokka-maven.md#includes) 選項。

</tab>

<tab title="CLI" group-key="cli">

如果您使用命令列配置，請在 [Source set options](dokka-cli.md#source-set-options) 中使用 [includes](dokka-cli.md#includes-cli) 選項。

如果您使用 JSON 配置，請在 [General configuration](dokka-cli.md#general-configuration) 中使用 [includes](dokka-cli.md#includes-json) 選項。

</tab>
</tabs>