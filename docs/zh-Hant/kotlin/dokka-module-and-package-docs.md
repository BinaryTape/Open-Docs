[//]: # (title: 模組文件)

整個模組及其中的套件之說明文件，可以以獨立的 Markdown 檔案提供。

## 檔案格式

在 Markdown 檔案中，整個模組及個別套件的說明文件由對應的第一級標題引入。對於模組，標題文字**必須**是 **Module `<module name>`**；對於套件，則**必須**是 **Package `<package qualified name>`**。

該檔案不需同時包含模組和套件說明文件。您可以有僅包含套件或模組說明文件的檔案。您甚至可以為每個模組或套件建立一個 Markdown 檔案。

使用 [Markdown 語法](https://www.markdownguide.org/basic-syntax/)，您可以加入：
*   標題最多可達六級
*   粗體或斜體格式的強調
*   連結
*   行內程式碼
*   程式碼區塊
*   引用區塊

這是一個包含模組和套件說明文件的範例檔案：

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

若要將這些檔案傳遞給 Dokka，您需要使用 Gradle、Maven 或 CLI 中相關的 **includes** 選項：

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

在 [來源集配置](dokka-gradle.md#source-set-configuration) 中使用 [includes](dokka-gradle.md#includes) 選項。

</tab>

<tab title="Maven" group-key="mvn">

在 [一般配置](dokka-maven.md#general-configuration) 中使用 [includes](dokka-maven.md#includes) 選項。

</tab>

<tab title="CLI" group-key="cli">

如果您使用命令列配置，請在 [來源集選項](dokka-cli.md#source-set-options) 中使用 [includes](dokka-cli.md#includes-cli) 選項。

如果您使用 JSON 配置，請在 [一般配置](dokka-cli.md#general-configuration) 中使用 [includes](dokka-cli.md#includes-json) 選項。

</tab>
</tabs>