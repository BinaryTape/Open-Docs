[//]: # (title: モジュールのドキュメント)

サブプロジェクト全体、およびそのサブプロジェクト内のパッケージのドキュメントは、個別のMarkdownファイルとして提供できます。

## ファイル形式

Markdownファイル内では、サブプロジェクト全体および個々のパッケージのドキュメントは、対応する第1レベルの見出しによって導入されます。見出しのテキストは、サブプロジェクトの場合は **Module `<module name>`**、パッケージの場合は **Package `<package qualified name>`** である**必要があります**。

ファイルにはサブプロジェクトとパッケージの両方のドキュメントを含める必要はありません。パッケージまたはサブプロジェクトのドキュメントのみを含むファイルにすることもできます。また、サブプロジェクトやパッケージごとに個別のMarkdownファイルを用意することも可能です。

[Markdown構文](https://www.markdownguide.org/basic-syntax/)を使用して、以下を追加できます：
* レベル6までの見出し
* 太字または斜体による強調
* リンク
* インラインコード
* コードブロック
* 引用 (Blockquotes)

以下は、サブプロジェクトとパッケージの両方のドキュメントを含むファイルの例です：

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

Gradleを使用したプロジェクト例については、[Dokka gradle example](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example) を参照してください。

## Dokkaへのファイルの渡し方

これらのファイルをDokkaに渡すには、Gradle、Maven、またはCLIの関連する **includes** オプションを使用する必要があります：

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

[全般設定 (General configuration)](dokka-gradle-configuration-options.md) 内の `includes` オプションを使用します。

</tab>

<tab title="Maven" group-key="mvn">

[全般設定 (General configuration)](dokka-maven.md#general-configuration) 内の `includes` オプションを使用します。

</tab>

<tab title="CLI" group-key="cli">

コマンドライン設定を使用している場合は、[ソースセットオプション (Source set options)](dokka-cli.md#source-set-options) 内の `includes` オプションを使用します。

JSON設定を使用している場合は、[全般設定 (General configuration)](dokka-cli.md#general-configuration) 内の `includes` オプションを使用します。

</tab>
</tabs>