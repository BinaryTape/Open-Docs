[//]: # (title: HTML)

> このガイドはDokka Gradleプラグイン (DGP) v2モードに適用されます。DGP v1モードはサポートされなくなりました。
> v1からv2モードにアップグレードするには、[移行ガイド](dokka-migration.md)に従ってください。
>
{style="note"}

HTMLはDokkaのデフォルトかつ推奨される出力形式です。
Kotlin Multiplatform、Android、Javaプロジェクトをサポートします。
さらに、単一プロジェクトビルドとマルチプロジェクトビルドの両方を文書化するためにHTML形式を使用できます。

HTML出力形式の例については、以下のドキュメントを確認してください。
* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)
* [Gradle](https://docs.gradle.org/current/kotlin-dsl/index.html)

## HTMLドキュメントの生成

HTMLは出力形式としてすべてのランナーでサポートされています。HTMLドキュメントを生成するには、使用するビルドツールやランナーに応じて、以下の手順に従ってください。

* [Gradle](dokka-gradle.md#generate-documentation)の場合、以下のタスクを実行できます。
  * `dokkaGenerate` は、[適用されているプラグインに基づいて利用可能なすべての形式](dokka-gradle.md#configure-documentation-output-format)でドキュメントを生成します。
      これはほとんどのユーザーに推奨されるタスクです。IntelliJ IDEAでこのタスクを使用すると、出力へのクリック可能なリンクがログに記録されます。
  * `dokkaGeneratePublicationHtml` は、HTML形式のみでドキュメントを生成します。このタスクは、出力ディレクトリを`@OutputDirectory`として公開します。このタスクは、生成されたファイルを他のGradleタスクで利用する必要がある場合（例: サーバーへのアップロード、GitHub Pagesディレクトリへの移動、`javadoc.jar`へのパッケージ化など）に使用します。このタスクは、日常的な使用を意図していないため、意図的にGradleタスクグループにはリストされていません。

    > IntelliJ IDEAを使用している場合、`dokkaGenerateHtml` Gradleタスクが表示されることがあります。
    > このタスクは`dokkaGeneratePublicationHtml`の単なるエイリアスです。両方のタスクはまったく同じ操作を実行します。
    >
    {style="tip"}

* [Maven](dokka-maven.md#generate-documentation)の場合、`dokka:dokka`ゴールを実行します。
* [CLIランナー](dokka-cli.md#generate-documentation)の場合、HTMLの依存関係を設定して実行します。

> この形式で生成されたHTMLページは、すべてを正しくレンダリングするためにWebサーバーでホストする必要があります。
>
> [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)のような、任意の無料の静的サイトホスティングサービスを使用できます。
>
> ローカルでは、[IntelliJの組み込みWebサーバー](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)を使用できます。
>
{style="note"}

## 設定

HTML形式はDokkaの基本フォーマットです。以下のオプションを使用して設定できます。

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
            <!-- Fully qualified plugin name -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- Options by name -->
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

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)を使用:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}
"
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を使用:

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

以下の表には、利用可能なすべての設定オプションとその目的が含まれています。

| **オプション**                              | **説明**                                                                                                                                                                                                                                                                               |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets`                          | ドキュメントにバンドルされる画像アセットのパスのリスト。画像アセットは任意のファイル拡張子を持つことができます。詳細については、「[アセットのカスタマイズ](#customize-assets)」を参照してください。                                                                                                             |
| `customStyleSheets`                     | ドキュメントにバンドルされ、レンダリングに使用される`.css`スタイルシートのパスのリスト。詳細については、「[スタイルのカスタマイズ](#customize-styles)」を参照してください。                                                                                                                              |
| `templatesDir`                          | カスタムHTMLテンプレートを含むディレクトリへのパス。詳細については、「[テンプレート](#templates)」を参照してください。                                                                                                                                                                                    |
| `footerMessage`                         | フッターに表示されるテキスト。                                                                                                                                                                                                                                                             |
| `separateInheritedMembers`              | これは真偽値オプションです。`true`に設定すると、Dokkaはプロパティ/関数と継承されたプロパティ/関数を個別にレンダリングします。これはデフォルトで無効になっています。                                                                                                                          |
| `mergeImplicitExpectActualDeclarations` | これは真偽値オプションです。`true`に設定すると、Dokkaは[expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html)として宣言されていないが、同じ完全修飾名を持つ宣言を結合します。これはレガシーコードベースで役立つ場合があります。これはデフォルトで無効になっています。 |

Dokkaプラグインの設定に関する詳細については、「[Dokkaプラグインの設定](dokka-plugins.md#configure-dokka-plugins)」を参照してください。

## カスタマイズ

ドキュメントに独自の見た目と雰囲気を追加できるように、HTML形式はいくつかのカスタマイズオプションをサポートしています。

### スタイルのカスタマイズ

`customStyleSheets` [設定オプション](#configuration)を使用することで、独自のスタイルシートを使用できます。これらはすべてのページに適用されます。

Dokkaのデフォルトスタイルシートは、同じ名前のファイルを提供することで上書きすることも可能です。

| **スタイルシート名**  | **説明**                                                    |
|----------------------|--------------------------------------------------------------------|
| `style.css`          | メインスタイルシート。すべてのページで使用されるスタイルの大部分が含まれています。 |
| `logo-styles.css`    | ヘッダーロゴのスタイル設定。                                                |
| `prism.css`          | [PrismJS](https://prismjs.com/)構文ハイライターのスタイル。      |

Dokkaのすべてのスタイルシートのソースコードは[GitHubで入手可能](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles)です。

### アセットのカスタマイズ

`customAssets` [設定オプション](#configuration)を使用することで、ドキュメントにバンドルされる独自の画像を提供できます。

これらのファイルは`<output>/images`ディレクトリにコピーされます。

`customAssets`プロパティは、ファイルのコレクション ([`FileCollection`](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties)) とともに使用できます。

```kotlin
customAssets.from("example.png", "example2.png")
```

Dokkaの画像やアイコンは、同じ名前のファイルを提供することで上書きすることが可能です。最も有用で関連性の高いものは`logo-icon.svg`で、これはヘッダーで使用される画像です。残りはほとんどアイコンです。

Dokkaで使用されるすべての画像は[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images)で確認できます。

### ロゴの変更

ロゴをカスタマイズするには、まず`logo-icon.svg`用の[独自のアセットを提供](#customize-assets)することから始められます。

見た目が気に入らない場合や、デフォルトの`.svg`ファイルの代わりに`.png`ファイルを使用したい場合は、`logo-styles.css`スタイルシートを[上書き](#customize-styles)してカスタマイズできます。

その方法の例については、弊社の[カスタムフォーマットサンプルプロジェクト](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)を参照してください。

サポートされるロゴの最大寸法は幅120ピクセル、高さ36ピクセルです。より大きな画像を使用すると、自動的にサイズ変更されます。

### フッターの変更

`footerMessage` [設定オプション](#configuration)を使用することで、フッターのテキストを変更できます。

### テンプレート

Dokkaは、ドキュメントページを生成するために使用される[FreeMarker](https://freemarker.apache.org/)テンプレートを変更する機能を提供します。

ヘッダーを完全に変更したり、独自のバナー/メニュー/検索を追加したり、アナリティクスを読み込んだり、ボディのスタイルを変更したりできます。

Dokkaは以下のテンプレートを使用します。

| **テンプレート**                       | **説明**                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl`                         | レンダリングされるすべてのページの一般的なデザインを定義します。                                                               |
| `includes/header.ftl`              | デフォルトでロゴ、バージョン、ソースセットセレクター、ライト/ダークテーマスイッチ、検索を含むページヘッダー。 |
| `includes/footer.ftl`              | `footerMessage` [設定オプション](#configuration)と著作権情報を含むページフッター。               |
| `includes/page_metadata.ftl`       | `<head>`コンテナ内で使用されるメタデータ。                                                                              |
| `includes/source_set_selector.ftl` | ヘッダー内の[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)セレクター。 |

ベーステンプレートは`base.ftl`であり、残りのリストされたすべてのテンプレートを含みます。
Dokkaのすべてのテンプレートのソースコードは[GitHubで入手可能](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates)です。

`templatesDir` [設定オプション](#configuration)を使用することで、任意のテンプレートを上書きできます。Dokkaは指定されたディレクトリ内で正確なテンプレート名を検索します。ユーザー定義のテンプレートが見つからない場合、デフォルトのテンプレートを使用します。

#### 変数

以下の変数は、すべてのテンプレート内で利用可能です。

| **変数**       | **説明**                                                                                                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | ページ名。                                                                                                                                                                                      |
| `${footerMessage}` | `footerMessage` [設定オプション](#configuration)によって設定されるテキスト。                                                                                                                |
| `${sourceSets}`    | マルチプラットフォームページ用の[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)のnullableなリスト。各項目には、`name`、`platform`、`filter`プロパティがあります。 |
| `${projectName}`   | プロジェクト名。`template_cmd`ディレクティブ内でのみ利用可能です。                                                                                                                         |
| `${pathToRoot}`    | 現在のページからのルートへのパス。アセットを見つけるのに役立ち、`template_cmd`ディレクティブ内でのみ利用可能です。                                                                 |

変数`projectName`と`pathToRoot`は、より多くのコンテキストを必要とし、後の段階で解決される必要があるため、`template_cmd`ディレクティブ内でのみ利用可能です。

```html
<@template_cmd name="projectName">
    <span>${projectName}</span>
</@template_cmd>
```

#### ディレクティブ

以下のDokka定義[ディレクティブ](https://freemarker.apache.org/docs/ref_directive_userDefined.html)も使用できます。

| **変数**    | **説明**                                                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | メインページコンテンツ。                                                                                                                                                                                                |
| `<@resources/>` | スクリプトやスタイルシートなどのリソース。                                                                                                                                                                            |
| `<@version/>`   | 設定から取得したモジュールバージョン。[バージョン管理プラグイン](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)が適用されている場合、バージョンナビゲーターに置き換えられます。 |