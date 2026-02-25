[//]: # (title: 模組文件)

子專案整體的說明文件以及該子專案中的套件，可以透過獨立的 Markdown 檔案來提供。

## 檔案格式

在 Markdown 檔案中，子專案整體和各個套件的說明文件是由對應的第一級標題引導。標題的文字對於子專案**必須**是 **Module `<module name>`**，對於套件則**必須**是 **Package `<package qualified name>`**。 

檔案不一定要同時包含子專案和套件的說明。您可以建立僅包含套件或子專案說明的檔案。您甚至可以為每個子專案或套件建立一個 Markdown 檔案。

使用 [Markdown 語法](https://www.markdownguide.org/basic-syntax/)，您可以加入：
* 最高到第 6 級的標題
* 粗體或斜體格式的強調
* 連結
* 內嵌程式碼
* 程式碼區塊
* 引文區塊

以下是同時包含子專案和套件說明的檔案範例：

```text
# Module kotlin-demo

This content appears under your subproject name.

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

若要探索使用 Gradle 的範例專案，請參閱 [Dokka gradle 範例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example)。

## 將檔案傳遞給 Dokka

要將這些檔案傳遞給 Dokka，您需要針對 Gradle、Maven 或 CLI 使用相關的 **includes** 選項：

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

使用 [一般組態](dokka-gradle-configuration-options.md) 中的 `includes` 選項。

</tab>

<tab title="Maven" group-key="mvn">

使用 [一般組態](dokka-maven.md#general-configuration) 中的 `includes` 選項。

</tab>

<tab title="CLI" group-key="cli">

如果您使用的是命令列組態，請使用 [原始碼集選項](dokka-cli.md#source-set-options) 中的 `includes` 選項。

如果您使用的是 JSON 組態，請使用 [一般組態](dokka-cli.md#general-configuration) 中的 `includes` 選項。

</tab>
</tabs>