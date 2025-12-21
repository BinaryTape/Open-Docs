[//]: # (title: モジュール ドキュメント)

モジュール全体、およびそのモジュール内のパッケージに関するドキュメントは、個別のMarkdownファイルとして提供できます。

## ファイル形式

Markdownファイル内では、モジュール全体および個々のパッケージに関するドキュメントは、対応する第1レベルの見出しによって導入されます。見出しのテキストは、モジュールの場合は**Module `<module name>`**、パッケージの場合は**Package `<package qualified name>`**である**必要があります**。

ファイルには、モジュールとパッケージの両方のドキュメントを含める必要はありません。パッケージまたはモジュールのみを含むファイルを持つことができます。モジュールまたはパッケージごとにMarkdownファイルを持つことさえ可能です。

[Markdown構文](https://www.markdownguide.org/basic-syntax/)を使用して、以下を追加できます。
* レベル6までの見出し
* 太字または斜体による強調
* リンク
* インラインコード
* コードブロック
* 引用ブロック

モジュールとパッケージの両方のドキュメントを含むファイルの例を次に示します。

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

Gradleを使用したサンプルプロジェクトについては、[Dokka Gradleの例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example)を参照してください。

## ファイルをDokkaに渡す

これらのファイルをDokkaに渡すには、Gradle、Maven、またはCLIの関連する**includes**オプションを使用する必要があります。

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

[一般設定](dokka-gradle-configuration-options.md)で`includes`オプションを使用します。

</tab>

<tab title="Maven" group-key="mvn">

[一般設定](dokka-maven.md#general-configuration)で`includes`オプションを使用します。

</tab>

<tab title="CLI" group-key="cli">

コマンドライン設定を使用している場合は、[ソースセットオプション](dokka-cli.md#source-set-options)で`includes`オプションを使用します。

JSON設定を使用している場合は、[一般設定](dokka-cli.md#general-configuration)で`includes`オプションを使用します。

</tab>
</tabs>