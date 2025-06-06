[//]: # (title: モジュールドキュメント)

モジュール全体のドキュメント、およびそのモジュール内のパッケージのドキュメントは、個別のMarkdownファイルとして提供できます。

## ファイル形式

Markdownファイル内では、モジュール全体および個々のパッケージのドキュメントは、対応する第一レベルの見出しによって導入されます。見出しのテキストは、モジュールの場合**Module `<module name>`**、パッケージの場合**Package `<package qualified name>`**である**必要があります**。

ファイルは、モジュールとパッケージの両方のドキュメントを含む必要はありません。パッケージのみ、またはモジュールのみのドキュメントを含むファイルを持つことができます。モジュールまたはパッケージごとにMarkdownファイルを持つことさえできます。

[Markdown構文](https://www.markdownguide.org/basic-syntax/)を使用して、以下を追加できます。
* レベル6までの見出し
* 太字またはイタリックによる強調表示
* リンク
* インラインコード
* コードブロック
* 引用ブロック

モジュールとパッケージの両方のドキュメントを含むファイルの例を以下に示します。

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

Gradleを使用したプロジェクトの例を見るには、[Dokka gradle example](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example)を参照してください。

## ファイルをDokkaに渡す

これらのファイルをDokkaに渡すには、Gradle、Maven、またはCLIの関連する**includes**オプションを使用する必要があります。

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

[ソースセット構成](dokka-gradle.md#source-set-configuration)で、[includes](dokka-gradle.md#includes)オプションを使用します。

</tab>

<tab title="Maven" group-key="mvn">

[一般設定](dokka-maven.md#general-configuration)で、[includes](dokka-maven.md#includes)オプションを使用します。

</tab>

<tab title="CLI" group-key="cli">

コマンドライン設定を使用している場合は、[ソースセットオプション](dokka-cli.md#source-set-options)で[includes](dokka-cli.md#includes-cli)オプションを使用します。

JSON設定を使用している場合は、[一般設定](dokka-cli.md#general-configuration)で[includes](dokka-cli.md#includes-json)オプションを使用します。

</tab>
</tabs>