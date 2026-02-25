[//]: # (title: HTML)

> このガイドは Dokka Gradle plugin (DGP) v2 モードに適用されます。DGP v1 モードは現在サポートされていません。
> v1 から v2 モードへのアップグレードについては、[移行ガイド](dokka-migration.md)を参照してください。
>
{style="note"}

HTML は Dokka のデフォルトであり、推奨される出力形式です。
Kotlin マルチプラットフォーム、Android、および Java プロジェクトをサポートしています。
さらに、HTML 形式を使用して、シングルプロジェクトとマルチプロジェクトの両方のビルドをドキュメント化できます。

HTML 出力形式の例については、以下のドキュメントを確認してください：
* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)
* [Gradle](https://docs.gradle.org/current/kotlin-dsl/index.html)

## HTML ドキュメントの生成

出力形式としての HTML は、すべてのランナーでサポートされています。HTML ドキュメントを生成するには、ビルドツールまたはランナーに応じて以下の手順に従ってください：

* [Gradle](dokka-gradle.md#generate-documentation) の場合、以下のタスクを実行できます：
  * `dokkaGenerate`: [適用されているプラグインに基づき、利用可能なすべての形式](dokka-gradle.md#configure-documentation-output-format)でドキュメントを生成します。
      ほとんどのユーザーにとって、これが推奨されるタスクです。IntelliJ IDEA でこのタスクを使用すると、出力へのクリック可能なリンクがログに表示されます。
  * `dokkaGeneratePublicationHtml`: HTML 形式のみでドキュメントを生成します。このタスクは出力ディレクトリを `@OutputDirectory` として公開します。生成されたファイルを他の Gradle タスクで使用する必要がある場合（サーバーへのアップロード、GitHub Pages ディレクトリへの移動、`javadoc.jar` へのパッケージ化など）に、このタスクを使用してください。
    このタスクは、日常的な使用を想定していないため、意図的に Gradle のタスクグループにはリストされていません。

    > IntelliJ IDEA を使用している場合、`dokkaGenerateHtml` という Gradle タスクが表示されることがあります。
    > このタスクは単に `dokkaGeneratePublicationHtml` のエイリアスです。どちらのタスクもまったく同じ操作を実行します。
    >
    {style="tip"}

* [Maven](dokka-maven.md#generate-documentation) の場合、`dokka:dokka` ゴールを実行します。
* [CLI ランナー](dokka-cli.md#generate-documentation) の場合、HTML の依存関係を設定して実行します。

> この形式で生成された HTML ページは、すべてを正しくレンダリングするためにウェブサーバー上でホストされる必要があります。
>
> [GitHub Pages](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages) などの無料の静的サイトホスティングサービスを使用できます。
>
> ローカルでは、[IntelliJ 内蔵のウェブサーバー](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)を使用できます。
>
{style="note"}

## 設定

HTML 形式は Dokka の基本形式です。以下のオプションを使用して設定できます：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    pluginsConfiguration.html {
        customAssets.from("logo.png")
        customStyleSheets.from("styles.css")
        footerMessage.set("(c) Your Company")
        separateInheritedMembers.set(false)
        templatesDir.set(file("dokka/templates"))
        mergeImplicitExpectActualDeclarations.set(false)
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
// build.gradle

dokka {
    pluginsConfiguration {
        html {
            customAssets.from("logo.png")
            customStyleSheets.from("styles.css")
            footerMessage.set("(c) Your Company")
            separateInheritedMembers.set(false)
            templatesDir.set(file("dokka/templates"))
            mergeImplicitExpectActualDeclarations.set(false)
        }
    }
}
```

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <pluginsConfiguration>
            <!-- 完全修飾プラグイン名 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- 名前によるオプション -->
                <customAssets>
                    <asset>${project.basedir}/my-image.png</asset>
                </customAssets>
                <customStyleSheets>
                    <stylesheet>${project.basedir}/my-styles.css</stylesheet>
                </customStyleSheets>
                <footerMessage>(c) MyOrg 2022 Maven</footerMessage>
                <separateInheritedMembers>false</separateInheritedMembers>
                <templatesDir>${project.basedir}/dokka/templates</templatesDir>
                <mergeImplicitExpectActualDeclarations>false</mergeImplicitExpectActualDeclarations>
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)経由：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}
"
```

[JSON 設定](dokka-cli.md#run-with-json-configuration)経由：

```json
{
  "moduleName": "Dokka Example",
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}"
    }
  ]
}
```

</tab>
</tabs>

### 設定オプション

以下の表は、利用可能なすべての設定オプションとその目的をまとめたものです：

| **オプション** | **説明** |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets` | ドキュメントに同梱される画像アセットのパスのリスト。画像アセットのファイル拡張子に制限はありません。詳細については、[アセットのカスタマイズ](#customize-assets)を参照してください。 |
| `customStyleSheets` | ドキュメントに同梱され、レンダリングに使用される `.css` スタイルシートのパスのリスト。詳細については、[スタイルのカスタマイズ](#customize-styles)を参照してください。 |
| `templatesDir` | カスタム HTML テンプレートを含むディレクトリへのパス。詳細については、[テンプレート](#templates)を参照してください。 |
| `footerMessage` | フッターに表示されるテキスト。 |
| `separateInheritedMembers` | boolean オプションです。`true` に設定すると、Dokka はプロパティ/関数と、継承されたプロパティ/関数を分けてレンダリングします。デフォルトでは無効になっています。 |
| `mergeImplicitExpectActualDeclarations` | boolean オプションです。`true` に設定すると、[expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html) として宣言されていないが、同じ完全修飾名を持つ宣言を Dokka がマージします。これはレガシーなコードベースで役立つ場合があります。デフォルトでは無効になっています。 |

Dokka プラグインの設定に関する詳細は、[Dokka プラグインの設定](dokka-plugins.md#configure-dokka-plugins)を参照してください。

## カスタマイズ

ドキュメントに独自のルックアンドフィールを追加できるように、HTML 形式ではいくつかのカスタマイズオプションをサポートしています。

### スタイルのカスタマイズ

`customStyleSheets` [設定オプション](#configuration)を使用して、独自のスタイルシートを使用できます。これらはすべてのページに適用されます。

また、同じ名前のファイルを提供することで、Dokka のデフォルトのスタイルシートを上書きすることも可能です：

| **スタイルシート名** | **説明** |
|----------------------|--------------------------------------------------------------------|
| `style.css` | メインのスタイルシート。すべてのページで使用されるほとんどのスタイルが含まれています。 |
| `logo-styles.css` | ヘッダーロゴのスタイリング。 |
| `prism.css` | [PrismJS](https://prismjs.com/) シンタックスハイライターのスタイル。 |

Dokka のすべてのスタイルシートのソースコードは [GitHub で入手可能](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles)です。

### アセットのカスタマイズ

`customAssets` [設定オプション](#configuration)を使用して、ドキュメントに同梱する独自の画像を提供できます。

これらのファイルは `<output>/images` ディレクトリにコピーされます。

`customAssets` プロパティには、ファイルのコレクション（[`FileCollection`](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties)）を使用できます：

```kotlin
customAssets.from("example.png", "example2.png")
```

同じ名前のファイルを提供することで、Dokka の画像やアイコンを上書きすることが可能です。最も有用で関連性が高いのは `logo-icon.svg` で、これはヘッダーで使用される画像です。それ以外は主にアイコンです。

Dokka で使用されているすべての画像は [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images) で確認できます。

### ロゴの変更

ロゴをカスタマイズするには、まず `logo-icon.svg` 用に[独自のアセットを提供](#customize-assets)することから始めます。

見た目が気に入らない場合や、デフォルトの `.svg` ファイルの代わりに `.png` ファイルを使用したい場合は、[`logo-styles.css` スタイルシートを上書き](#customize-styles)してカスタマイズできます。

これを行う方法の例については、[カスタム形式のサンプルプロジェクト](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)を参照してください。

サポートされているロゴの最大寸法は、幅 120 ピクセル、高さ 36 ピクセルです。これより大きい画像を使用すると、自動的にリサイズされます。

### フッターの変更

`footerMessage` [設定オプション](#configuration)を使用して、フッターのテキストを変更できます。

### テンプレート

Dokka では、ドキュメントページの生成に使用される [FreeMarker](https://freemarker.apache.org/) テンプレートを修正することができます。

ヘッダーを完全に変更したり、独自のバナー/メニュー/検索を追加したり、アナリティクスを読み込んだり、ボディのスタイリングを変更したりすることなどが可能です。

Dokka は以下のテンプレートを使用します：

| **テンプレート** | **説明** |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl` | レンダリングされるすべてのページの一般的なデザインを定義します。 |
| `includes/header.ftl` | ページのヘッダー。デフォルトでは、ロゴ、バージョン、ソースセットセレクター、ライト/ダークテーマの切り替え、および検索が含まれます。 |
| `includes/footer.ftl` | ページのフッター。`footerMessage` [設定オプション](#configuration)と著作権情報が含まれます。 |
| `includes/page_metadata.ftl` | `<head>` コンテナ内で使用されるメタデータ。 |
| `includes/source_set_selector.ftl` | ヘッダーにある[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)セレクター。 |

ベーステンプレートは `base.ftl` であり、これにはリストされている残りのすべてのテンプレートが含まれています。
Dokka のすべてのテンプレートのソースコードは [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates) で確認できます。

`templatesDir` [設定オプション](#configuration)を使用して、任意のテンプレートを上書きできます。Dokka は指定されたディレクトリ内で正確なテンプレート名を検索します。ユーザー定義のテンプレートが見つからない場合は、デフォルトのテンプレートが使用されます。

#### 変数

すべてのテンプレート内で以下の変数を使用できます：

| **変数** | **説明** |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}` | ページ名。 |
| `${footerMessage}` | `footerMessage` [設定オプション](#configuration)によって設定されたテキスト。 |
| `${sourceSets}` | マルチプラットフォームページ用の[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)の null 許容リスト。各項目には `name`、`platform`、`filter` プロパティがあります。 |
| `${projectName}` | プロジェクト名。`template_cmd` ディレクティブ内でのみ利用可能です。 |
| `${pathToRoot}` | 現在のページからルートへのパス。アセットの場所を特定するのに役立ち、`template_cmd` ディレクティブ内でのみ利用可能です。 |

変数 `projectName` と `pathToRoot` は、より多くのコンテキストを必要とし、後の段階で解決される必要があるため、`template_cmd` ディレクティブ内でのみ利用可能です：

```html
<@template_cmd name="projectName">
    <span>${projectName}</span>
</@template_cmd>
```

#### ディレクティブ

Dokka が定義した以下の [ディレクティブ](https://freemarker.apache.org/docs/ref_directive_userDefined.html) も使用できます：

| **変数** | **説明** |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>` | メインページのコンテンツ。 |
| `<@resources/>` | スクリプトやスタイルシートなどのリソース。 |
| `<@version/>` | 設定から取得されたサブプロジェクトのバージョン。[バージョニングプラグイン](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)が適用されている場合は、バージョンナビゲーターに置き換えられます。 |