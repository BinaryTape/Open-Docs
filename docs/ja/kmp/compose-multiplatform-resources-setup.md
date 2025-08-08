[//]: # (title: マルチプラットフォームリソースのセットアップと設定)

<show-structure depth="3"/>

マルチプラットフォームリソースを使用するようにプロジェクトを適切に設定するには：

1.  ライブラリの依存関係を追加します。
2.  各種類のリソースに必要なディレクトリを作成します。
3.  修飾子付きリソース用の追加ディレクトリを作成します（例えば、ダークUIテーマ用の異なる画像やローカライズされた文字列など）。

## ビルドスクリプトとディレクトリのセットアップ

マルチプラットフォームプロジェクトでリソースにアクセスするには、ライブラリの依存関係を追加し、プロジェクトディレクトリ内のファイルを整理します。

1.  `composeApp` ディレクトリ内の `build.gradle.kts` ファイルで、`commonMain` ソースセットに依存関係を追加します。

    ```kotlin
    kotlin {
        //...
        sourceSets {
            commonMain.dependencies {
                implementation(compose.components.resources)
            }
        }
    }
    ```

    > ライブラリを直接参照するには、[Maven Central のアーティファクトページ](https://central.sonatype.com/artifact/org.jetbrains.compose.components/components-resources)から完全修飾名を使用してください。
    {style="tip"}

2.  リソースを追加したいソースセットディレクトリ（この例では `commonMain`）に、新しいディレクトリ `composeResources` を作成します。

    ![Compose resources project structure](compose-resources-structure.png){width=250}

3.  これらのルールに従って `composeResources` ディレクトリ構造を整理します。

    *   画像は `drawable` ディレクトリに配置します。Compose Multiplatform は、ラスタライズ画像（JPEG、PNG、ビットマップ、WebP）およびベクターAndroid XML画像（Androidリソースへの参照なし）をサポートしています。
    *   フォントは `font` ディレクトリに配置します。
    *   文字列は `values` ディレクトリに配置します。
    *   その他のファイルは `files` ディレクトリに、適切なフォルダ階層で配置します。

### カスタムリソースディレクトリ

`build.gradle.kts` ファイルの `compose.resources {}` ブロックで、各ソースセットのカスタムリソースディレクトリを指定できます。
これらのカスタムディレクトリはそれぞれ、デフォルトの `composeResources` と同じ方法でファイルを格納する必要があります。つまり、画像用の `drawable` サブディレクトリ、フォント用の `font` サブディレクトリなどです。

簡単な例として、特定のフォルダを指定する方法を示します。

```kotlin
compose.resources {
    customDirectory(
        sourceSetName = "desktopMain",
        directoryProvider = provider { layout.projectDirectory.dir("desktopResources") }
    )
}
```

また、Gradleタスクによってファイルが配置されるフォルダを設定することもできます。例えば、ダウンロードされたファイルがある場合などです。

```kotlin
abstract class DownloadRemoteFiles : DefaultTask() {

    @get:OutputDirectory
    val outputDir = layout.buildDirectory.dir("downloadedRemoteFiles")

    @TaskAction
    fun run() { /* your code for downloading files */ }
}

compose.resources {
    customDirectory(
        sourceSetName = "iosMain",
        directoryProvider = tasks.register<DownloadRemoteFiles>("downloadedRemoteFiles").map { it.outputDir.get() }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="directoryProvider = tasks.register<DownloadRemoteFiles>"}

### `androidLibrary` ターゲット内のリソース
<secondary-label ref="Experimental"/>

Android Gradleプラグインバージョン 8.8.0 以降では、`androidLibrary` ターゲットで生成された `Res` クラスとリソースアクセサーを使用できます。
`androidLibrary` でマルチプラットフォームリソースのサポートを有効にするには、次のように設定を更新します。

```
kotlin {
  androidLibrary {
    androidResources.enable = true
  }
}
```

## 修飾子

ロケール、画面密度、UIテーマなど、環境に応じて同じリソースを異なる方法で表示する必要がある場合があります。例えば、異なる言語向けにテキストをローカライズしたり、ダークテーマ向けに画像を調整したりする必要があるかもしれません。そのために、ライブラリは特別な修飾子を提供します。

> リソース関連の設定を処理する方法については、[ローカルリソース環境の管理](compose-resource-environment.md)チュートリアルで学んでください。
>
{style="note"}

`files` ディレクトリ内の生ファイルを除くすべてのリソースタイプが修飾子をサポートしています。ハイフンを使用してディレクトリ名に修飾子を追加します。

![Qualifiers in multiplatform resources](compose-resources-qualifiers.png){width=250}

ライブラリは（優先順位順に）以下の修飾子をサポートしています：[言語](#language-and-regional-qualifiers)、[テーマ](#theme-qualifier)、[密度](#density-qualifier)。

*   異なる種類の修飾子を組み合わせて適用できます。例えば、「drawable-en-rUS-mdpi-dark」は、米国地域の英語向け画像で、ダークテーマの160 DPI画面に適しています。
*   要求された修飾子を持つリソースがアクセスできない場合、代わりにデフォルトのリソース（修飾子なし）が使用されます。

### 言語および地域修飾子

言語と地域の修飾子を組み合わせることができます。
*   言語は、2文字（ISO 639-1）または3文字（ISO 639-2）の[言語コード](https://www.loc.gov/standards/iso639-2/php/code_list.php)で定義されます。
*   言語コードに2文字の[ISO 3166-1-alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)地域コードを追加できます。地域コードは小文字の `r` をプレフィックスとして持つ必要があります。例：`drawable-spa-rMX`

言語および地域コードは大文字と小文字を区別します。

### テーマ修飾子

「light」または「dark」の修飾子を追加できます。Compose Multiplatform は、現在のシステムテーマに応じて必要なリソースを選択します。

### 密度修飾子

以下の密度修飾子を使用できます。

*   "ldpi" – 120 DPI、0.75倍の密度
*   "mdpi" – 160 DPI、1倍の密度
*   "hdpi" – 240 DPI、1.5倍の密度
*   "xhdpi" – 320 DPI、2倍の密度
*   "xxhdpi" – 480 DPI、3倍の密度
*   "xxxhdpi" – 640 DPI、4倍の密度

リソースは、システムで定義された画面密度に応じて選択されます。

## 公開

Compose Multiplatform 1.6.10以降、必要なすべてのリソースが公開用のMavenアーティファクトに含まれるようになりました。

この機能を有効にするには、プロジェクトでKotlin 2.0.0以降およびGradle 7.6以降を使用する必要があります。

## 次のステップ

*   設定したリソースにアクセスする方法と、デフォルトで生成されるアクセサーをカスタマイズする方法については、[](compose-multiplatform-resources-usage.md)ページをご覧ください。
*   iOS、Android、デスクトップをターゲットとするCompose Multiplatformプロジェクトでリソースを処理する方法を示す公式の[デモプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)を確認してください。