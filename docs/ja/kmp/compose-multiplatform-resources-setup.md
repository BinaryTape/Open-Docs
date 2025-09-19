[//]: # (title: マルチプラットフォームリソースのセットアップと構成)

<show-structure depth="3"/>

マルチプラットフォームリソースを使用するようにプロジェクトを適切に構成するには：

1.  ライブラリの依存関係を追加します。
2.  各種類のリソースに必要なディレクトリを作成します。
3.  修飾されたリソース（例えば、ダークUIテーマ用の異なる画像やローカライズされた文字列など）のための追加ディレクトリを作成します。

## ビルドスクリプトとディレクトリのセットアップ

マルチプラットフォームプロジェクトでリソースにアクセスするには、ライブラリの依存関係を追加し、プロジェクトディレクトリ内にファイルを整理します。

1.  `composeApp` ディレクトリにある `build.gradle.kts` ファイルで、`commonMain` ソースセットに依存関係を追加します。

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

3.  `composeResources` ディレクトリ構造を以下のルールに従って整理します。

    *   画像は `drawable` ディレクトリに配置します。Compose Multiplatform は、ラスタライズ画像（JPEG、PNG、ビットマップ、WebP）およびベクター形式のAndroid XML画像（Androidリソースへの参照なし）をサポートします。
    *   フォントは `font` ディレクトリに配置します。
    *   文字列は `values` ディレクトリに配置します。
    *   その他のファイルは `files` ディレクトリに、適切と思われる任意のフォルダ階層で配置します。

### カスタムリソースディレクトリ

`build.gradle.kts` ファイルの `compose.resources {}` ブロックで、各ソースセットのカスタムリソースディレクトリを指定できます。これらのカスタムディレクトリも、デフォルトの `composeResources` と同じようにファイルを含む必要があります：画像用の `drawable` サブディレクトリ、フォント用の `font` サブディレクトリなどです。

簡単な例として、特定のフォルダを指定する方法です：

```kotlin
compose.resources {
    customDirectory(
        sourceSetName = "jvmMain",
        directoryProvider = provider { layout.projectDirectory.dir("desktopResources") }
    )
}
```

また、Gradleタスクによって生成されるフォルダ（例えば、ダウンロードされたファイルを含むフォルダ）を設定することもできます：

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

### カスタムウェブ・リソース・パス

`configureWebResources()` 関数を使用して、ウェブ・リソースのパスとURLを指定できます。

*   ドメインのルートからのリソースを参照するには、相対パス (`/` で始まる) を使用します。
*   外部ドメインまたはCDNでホストされているリソースを参照するには、絶対URL (`http://` または `https://` で始まる) を使用します。

```kotlin
// Maps resources to an application-specific path
configureWebResources {
    resourcePathMapping { path -> "/myApp/resources/$path" }
}

// Maps resources to an external CDN
configureWebResources {
    resourcePathMapping { path -> "https://mycdn.com/myApp/res/$path" }
}
```

### `androidLibrary` ターゲット内のリソース
<secondary-label ref="Experimental"/>

Android Gradle プラグインバージョン 8.8.0 以降では、`androidLibrary` ターゲットで生成された `Res` クラスとリソースアクセサを使用できます。`androidLibrary` でマルチプラットフォームリソースのサポートを有効にするには、次のように構成を更新します：

```
kotlin {
  androidLibrary {
    androidResources.enable = true
  }
}
```

## 修飾子

環境（ロケール、画面密度、インターフェーステーマなど）に応じて、同じリソースを異なる方法で表示する必要がある場合があります。例えば、異なる言語にテキストをローカライズしたり、ダークテーマ用に画像を調整したりする必要があるかもしれません。そのため、ライブラリは特別な修飾子を提供しています。

> リソース関連の設定を処理する方法については、[ローカルリソース環境の管理](compose-resource-environment.md)チュートリアルで学習してください。
>
{style="note"}

`files` ディレクトリ内の生ファイルを除くすべてのリソースタイプは、修飾子をサポートしています。ハイフンを使用してディレクトリ名に修飾子を追加します：

![Qualifiers in multiplatform resources](compose-resources-qualifiers.png){width=250}

ライブラリは、以下の修飾子を（優先順位順に）サポートしています：[言語](#language-and-regional-qualifiers)、[テーマ](#theme-qualifier)、[密度](#density-qualifier)。

*   異なる種類の修飾子を組み合わせて適用できます。例えば、"drawable-en-rUS-mdpi-dark" は、米国地域向けの英語用画像で、ダークテーマの160 DPIスクリーンに適しています。
*   要求された修飾子を持つリソースがアクセスできない場合、代わりにデフォルトのリソース（修飾子なし）が使用されます。

### 言語および地域修飾子

言語修飾子と地域修飾子を組み合わせることができます：
*   言語は、2文字（ISO 639-1）または3文字（ISO 639-2）の[言語コード](https://www.loc.gov/standards/iso639-2/php/code_list.php)によって定義されます。
*   言語コードに2文字の[ISO 3166-1-alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)地域コードを追加できます。地域コードには小文字の `r` プレフィックスが必要です。例：`drawable-spa-rMX`

言語および地域コードは大文字と小文字を区別します。

### テーマ修飾子

"light" または "dark" 修飾子を追加できます。Compose Multiplatform は、現在のシステムテーマに応じて必要なリソースを選択します。

### 密度修飾子

以下の密度修飾子を使用できます：

*   "ldpi" – 120 DPI, 0.75x density
*   "mdpi" – 160 DPI, 1x density
*   "hdpi" – 240 DPI, 1.5x density
*   "xhdpi" – 320 DPI, 2x density
*   "xxhdpi" – 480 DPI, 3x density
*   "xxxhdpi" – 640dpi, 4x density

リソースは、システムで定義されている画面密度に応じて選択されます。

## 公開

Compose Multiplatform 1.6.10 以降、必要なすべてのリソースが公開されるMavenアーティファクトに含まれるようになりました。

この機能を有効にするには、プロジェクトでKotlin 2.0.0以降およびGradle 7.6以降を使用する必要があります。

## 次のステップ

*   セットアップしたリソースにアクセスする方法、およびデフォルトで生成されるアクセサをカスタマイズする方法については、[アプリでマルチプラットフォームリソースを使用する](compose-multiplatform-resources-usage.md)ページを参照してください。
*   iOS、Android、デスクトップをターゲットとするCompose Multiplatformプロジェクトでリソースを処理する方法を示す公式の[デモプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)を確認してください。