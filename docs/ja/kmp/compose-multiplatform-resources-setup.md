[//]: # (title: マルチプラットフォームリソースのセットアップと設定)

<show-structure depth="3"/>

マルチプラットフォームリソースを使用するためにプロジェクトを適切に設定するには、以下の手順に従います。

1. ライブラリの依存関係を追加します。
2. 各リソースの種類に必要なディレクトリを作成します。
3. 修飾されたリソース（qualified resources）用の追加ディレクトリを作成します（例：ダーク UI テーマ用の異なる画像やローカライズされた文字列など）。

## ビルドスクリプトとディレクトリのセットアップ

マルチプラットフォームプロジェクトでリソースにアクセスするには、ライブラリの依存関係を追加し、プロジェクトディレクトリ内のファイルを整理します。

1. `composeApp` ディレクトリ内の `build.gradle.kts` ファイルで、`commonMain` ソースセットに依存関係を追加します。

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
   
   > ライブラリを直接参照するには、[Maven Central のアーティファクトページ](https://central.sonatype.com/artifact/org.jetbrains.compose.components/components-resources)にある完全修飾名を使用してください。
   {style="tip"}

2. リソースを追加したいソースセットディレクトリ（この例では `commonMain`）に、新しいディレクトリ `composeResources` を作成します。

   ![Compose resources project structure](compose-resources-structure.png){width=250}

3. `composeResources` ディレクトリ構造を以下のルールに従って整理します。

   * 画像は `drawable` ディレクトリに配置する必要があります。Compose Multiplatform は、ラスタライズされた画像（JPEG、PNG、bitmap、WebP）およびベクター Android XML 画像（Android リソースへの参照を含まないもの）をサポートしています。
   * フォントは `font` ディレクトリに配置する必要があります。
   * 文字列は `values` ディレクトリに配置する必要があります。
   * その他のファイルは `files` ディレクトリに配置し、必要に応じて任意のフォルダ階層を作成できます。

### カスタムリソースディレクトリ

`build.gradle.kts` ファイルの `compose.resources {}` ブロックで、各ソースセットに対してカスタムリソースディレクトリを指定できます。
これらの各カスタムディレクトリも、デフォルトの `composeResources` と同じように、画像用の `drawable` サブディレクトリ、フォント用の `font` サブディレクトリなどを含める必要があります。

特定のフォルダを指す簡単な例は以下の通りです。

```kotlin
compose.resources {
    customDirectory(
        sourceSetName = "jvmMain",
        directoryProvider = provider { layout.projectDirectory.dir("desktopResources") }
    )
}
```

Gradle タスクによって生成されたフォルダ（例えばダウンロードされたファイルを含むフォルダなど）を設定することもできます。

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

リソースへのアクセスのカスタマイズについての詳細は、[アクセスと使用法](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)を参照してください。

### カスタム Web リソースパス

`configureWebResources()` 関数を使用して、Web リソースのパスと URL を指定できます。

* ドメインルートからのリソースを参照するには、相対パス（`/` で始まるパス）を使用します。
* 外部ドメインや CDN でホストされているリソースを参照するには、絶対 URL（`http://` または `https://` で始まる URL）を使用します。

```kotlin
// リソースをアプリケーション固有のパスにマッピングする
configureWebResources {
    resourcePathMapping { path -> "/myApp/resources/$path" }
}

// リソースを外部 CDN にマッピングする
configureWebResources {
    resourcePathMapping { path -> "https://mycdn.com/myApp/res/$path" }
}
```

### `androidLibrary` ターゲットでのリソース
<primary-label ref="Experimental"/>

Android Gradle プラグインのバージョン 8.8.0 以降、`androidLibrary` ターゲットで生成された `Res` クラスとリソースアクセサを使用できるようになりました。
`androidLibrary` でマルチプラットフォームリソースのサポートを有効にするには、次のように構成を更新します。

```
kotlin {
  androidLibrary {
    androidResources.enable = true
  }
}
```

## 修飾子（Qualifiers）

ロケール、画面密度、インターフェーステーマなど、環境に応じて同じリソースを異なる方法で表示する必要がある場合があります。例えば、言語ごとにテキストをローカライズしたり、ダークテーマに合わせて画像を調整したりする必要があるかもしれません。そのために、ライブラリは特別な修飾子（qualifiers）を提供しています。

> リソース関連の設定を処理する方法については、[ローカルリソース環境の管理](compose-resource-environment.md) チュートリアルを確認してください。
>
{style="note"}

`files` ディレクトリ内の生のファイルを除くすべてのリソースタイプが修飾子をサポートしています。ディレクトリ名にハイフンを使用して修飾子を追加します。

![Qualifiers in multiplatform resources](compose-resources-qualifiers.png){width=250}

ライブラリは（優先順位に従って）次の修飾子をサポートしています：[言語](#language-and-regional-qualifiers)、[テーマ](#theme-qualifier)、および[密度](#density-qualifier)。

* 異なる種類の修飾子を組み合わせて適用できます。例えば、"drawable-en-rUS-mdpi-dark" は、米国地域の英語で、ダークテーマの 160 DPI 画面に適した画像です。
* 要求された修飾子を持つリソースにアクセスできない場合は、代わりにデフォルトのリソース（修飾子なし）が使用されます。

### 言語および地域の修飾子

言語と地域の修飾子を組み合わせることができます。

* 言語は、2文字（ISO 639-1）または3文字（ISO 639-2）の[言語コード](https://www.loc.gov/standards/iso639-2/php/code_list.php)によって定義されます。
* 言語コードに2文字の [ISO 3166-1-alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 地域コードを追加できます。地域コードには、小文字の `r` プレフィックスを付ける必要があります（例：`drawable-spa-rMX`）。

言語コードと地域コードは大文字と小文字を区別します。
地域固有の形式の処理に関する詳細は、[ローカライゼーション](compose-regional-format.md)を参照してください。

### テーマ修飾子

"light" または "dark" 修飾子を追加できます。Compose Multiplatform は、現在のシステムテーマに応じて必要なリソースを選択します。

### 密度修飾子

以下の密度修飾子を使用できます。

* "ldpi" – 120 DPI, 0.75x 密度
* "mdpi" – 160 DPI, 1x 密度
* "hdpi" – 240 DPI, 1.5x 密度
* "xhdpi" – 320 DPI, 2x 密度
* "xxhdpi" – 480 DPI, 3x 密度
* "xxxhdpi" – 640dpi, 4x 密度

リソースは、システムで定義された画面密度に応じて選択されます。

## パブリケーション

Compose Multiplatform 1.6.10 以降、必要なすべてのリソースがパブリケーションの Maven アーティファクトに含まれるようになりました。

この機能を有効にするには、プロジェクトで Kotlin 2.0.0 以降および Gradle 7.6 以降を使用する必要があります。

## 次のステップ

* 設定したリソースにアクセスする方法や、デフォルトで生成されるアクセサをカスタマイズする方法については、[アプリでのマルチプラットフォームリソースの使用](compose-multiplatform-resources-usage.md) ページで確認してください。
* iOS、Android、デスクトップをターゲットとする Compose Multiplatform プロジェクトでのリソースの処理方法を示す公式の[デモプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)をチェックしてください。