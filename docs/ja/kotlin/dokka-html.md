[//]: # (title: HTML)

HTMLはDokkaのデフォルトかつ推奨される出力フォーマットです。現在ベータ版であり、安定版のリリースが近づいています。

出力の例は、[kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)のドキュメントを閲覧することで確認できます。

## HTMLドキュメントの生成

HTML出力フォーマットは、すべてのランナーでサポートされています。HTMLドキュメントを生成するには、使用するビルドツールまたはランナーに応じて、以下の手順に従ってください。

*   [Gradle](dokka-gradle.md#generate-documentation)の場合、`dokkaHtml`または`dokkaHtmlMultiModule`タスクを実行します。
*   [Maven](dokka-maven.md#generate-documentation)の場合、`dokka:dokka`ゴールを実行します。
*   [CLIランナー](dokka-cli.md#generate-documentation)の場合、HTMLの依存関係を設定して実行します。

> このフォーマットで生成されたHTMLページは、すべてを正しくレンダリングするためにウェブサーバーでホストする必要があります。
>
> [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)のような、任意の無料の静的サイトホスティングサービスを利用できます。
>
> ローカルでは、[IntelliJの組み込みウェブサーバー](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)を使用できます。
>
{style="note"}

## 設定

HTMLフォーマットはDokkaの基本フォーマットです。そのため、`DokkaBase`および`DokkaBaseConfiguration`クラスを介して設定可能です。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

型安全なKotlin DSL経由：

```kotlin
import org.jetbrains.dokka.base.DokkaBase
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.base.DokkaBaseConfiguration

buildscript {
    dependencies {
        classpath("org.jetbrains.dokka:dokka-base:%dokkaVersion%")
    }
}

tasks.withType<DokkaTask>().configureEach {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customAssets = listOf(file("my-image.png"))
        customStyleSheets = listOf(file("my-styles.css"))
        footerMessage = "(c) 2022 MyOrg"
        separateInheritedMembers = false
        templatesDir = file("dokka/templates")
        mergeImplicitExpectActualDeclarations = false
    }
}
```

JSON経由：

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType<DokkaTask>().configureEach {
    val dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg",
      "separateInheritedMembers": false,
      "templatesDir": "${file("dokka/templates")}",
      "mergeImplicitExpectActualDeclarations": false
    }
    """
    pluginsMapConfiguration.set(
        mapOf(
            // fully qualified plugin name to json configuration
            "org.jetbrains.dokka.base.DokkaBase" to dokkaBaseConfiguration
        )
    )
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType(DokkaTask.class) {
    String dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
      "separateInheritedMembers": false,
      "templatesDir": "${file("dokka/templates")}",
      "mergeImplicitExpectActualDeclarations": false
    }
    """
    pluginsMapConfiguration.set(
            // fully qualified plugin name to json configuration
            ["org.jetbrains.dokka.base.DokkaBase": dokkaBaseConfiguration]
    )
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

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)経由：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}
"
```

[JSON設定](dokka-cli.md#run-with-json-configuration)経由：

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

下の表は、利用可能なすべての設定オプションとその目的を示しています。

| **オプション**                           | **説明**                                                                                                                                                                                                                                                                               |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets`                           | ドキュメントにバンドルされる画像アセットのパスのリストです。画像アセットは任意のファイル拡張子を持つことができます。詳細については、[アセットのカスタマイズ](#customize-assets)を参照してください。                                                                                             |
| `customStyleSheets`                      | ドキュメントにバンドルされ、レンダリングに使用される`.css`スタイルシートのパスのリストです。詳細については、[スタイルのカスタマイズ](#customize-styles)を参照してください。                                                                                                                              |
| `templatesDir`                           | カスタムHTMLテンプレートを含むディレクトリへのパスです。詳細については、[テンプレート](#templates)を参照してください。                                                                                                                                                                                    |
| `footerMessage`                          | フッターに表示されるテキストです。                                                                                                                                                                                                                                                             |
| `separateInheritedMembers`               | これはブール値オプションです。`true`に設定すると、Dokkaはプロパティ/関数と継承されたプロパティ/継承された関数を個別にレンダリングします。これはデフォルトで無効になっています。                                                                                                                          |
| `mergeImplicitExpectActualDeclarations`  | これはブール値オプションです。`true`に設定すると、Dokkaは[expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html)として宣言されていないが、同じ完全修飾名を持つ宣言をマージします。これはレガシーコードベースで役立つ場合があります。これはデフォルトで無効になっています。 |

Dokkaプラグインの設定に関する詳細については、[Dokkaプラグインの設定](dokka-plugins.md#configure-dokka-plugins)を参照してください。

## カスタマイズ

ドキュメントに独自のルックアンドフィールを追加できるように、HTMLフォーマットはいくつかのカスタマイズオプションをサポートしています。

### スタイルのカスタマイズ

`customStyleSheets`[設定オプション](#configuration)を使用して、独自のスタイルシートを使用できます。これらはすべてのページに適用されます。

同じ名前のファイルを提供することで、Dokkaのデフォルトスタイルシートをオーバーライドすることも可能です。

| **スタイルシート名** | **説明**                                                                 |
|----------------------|--------------------------------------------------------------------------|
| `style.css`          | メインスタイルシート。すべてのページで使用されるスタイルのほとんどが含まれています。 |
| `logo-styles.css`    | ヘッダーロゴのスタイル設定                                               |
| `prism.css`          | [PrismJS](https://prismjs.com/)シンタックスハイライターのスタイル      |

Dokkaのすべてのスタイルシートのソースコードは、[GitHubで入手可能](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles)です。

### アセットのカスタマイズ

`customAssets`[設定オプション](#configuration)を使用して、ドキュメントにバンドルする独自の画像を提供できます。

これらのファイルは`<output>/images`ディレクトリにコピーされます。

同じ名前のファイルを提供することで、Dokkaの画像やアイコンをオーバーライドすることが可能です。最も有用で関連性の高いものは`logo-icon.svg`で、これはヘッダーで使用される画像です。残りはほとんどアイコンです。

Dokkaが使用するすべての画像は[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images)で確認できます。

### ロゴの変更

ロゴをカスタマイズするには、まず`logo-icon.svg`に[独自のアセットを提供](#customize-assets)することから始められます。

見た目が気に入らない場合や、デフォルトの`.svg`ファイルの代わりに`.png`ファイルを使用したい場合は、`logo-styles.css`スタイルシートを[オーバーライド](#customize-styles)してカスタマイズできます。

これを行う方法の例については、[カスタムフォーマットのサンプルプロジェクト](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)を参照してください。

サポートされているロゴの最大寸法は、幅120ピクセル、高さ36ピクセルです。これより大きい画像を使用すると、自動的にサイズが変更されます。

### フッターの変更

`footerMessage`[設定オプション](#configuration)を使用して、フッターのテキストを変更できます。

### テンプレート

Dokkaは、ドキュメントページを生成するために使用される[FreeMarker](https://freemarker.apache.org/)テンプレートを変更する機能を提供します。

ヘッダーを完全に変更したり、独自のバナー/メニュー/検索を追加したり、アナリティクスをロードしたり、ボディのスタイルを変更したりすることができます。

Dokkaは以下のテンプレートを使用します。

| **テンプレート**                       | **説明**                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl`                         | レンダリングされるすべてのページの一般的なデザインを定義します。                                                               |
| `includes/header.ftl`              | デフォルトでロゴ、バージョン、ソースセットセレクター、ライト/ダークテーマ切り替え、検索を含むページヘッダーです。 |
| `includes/footer.ftl`              | `footerMessage`[設定オプション](#configuration)と著作権情報を含むページフッターです。               |
| `includes/page_metadata.ftl`       | `<head>`コンテナ内で使用されるメタデータです。                                                                              |
| `includes/source_set_selector.ftl` | ヘッダー内の[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)セレクターです。 |

ベーステンプレートは`base.ftl`であり、リストされている残りのすべてのテンプレートを含みます。Dokkaのすべてのテンプレートのソースコードは、[GitHubで入手可能](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates)です。

`templatesDir`[設定オプション](#configuration)を使用して、任意のテンプレートをオーバーライドできます。Dokkaは指定されたディレクトリ内で正確なテンプレート名を検索します。ユーザー定義のテンプレートが見つからない場合、デフォルトのテンプレートを使用します。

#### 変数

すべてのテンプレート内で以下の変数が利用可能です。

| **変数**           | **説明**                                                                                                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | ページ名                                                                                                                                                                                      |
| `${footerMessage}` | `footerMessage`[設定オプション](#configuration)によって設定されるテキスト                                                                                                                |
| `${sourceSets}`    | マルチプラットフォームページ用の[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)のnullableリストです。各項目は`name`、`platform`、`filter`プロパティを持ちます。 |
| `${projectName}`   | プロジェクト名。`template_cmd`ディレクティブ内でのみ利用可能です。                                                                                                                         |
| `${pathToRoot}`    | 現在のページからルートへのパスです。アセットの配置に役立ち、`template_cmd`ディレクティブ内でのみ利用可能です。                                                                                 |

変数`projectName`と`pathToRoot`は、より多くのコンテキストを必要とし、そのため[MultiModule](dokka-gradle.md#multi-project-builds)タスクによって後段階で解決される必要があるため、`template_cmd`ディレクティブ内でのみ利用可能です。

```html
<@template_cmd name="projectName">
   <span>${projectName}</span>
</@template_cmd>
```

#### ディレクティブ

以下のDokka定義の[ディレクティブ](https://freemarker.apache.org/docs/ref_directive_userDefined.html)も使用できます。

| **変数**        | **説明**                                                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | メインページコンテンツです。                                                                                                                                                                                                |
| `<@resources/>` | スクリプトやスタイルシートなどのリソースです。                                                                                                                                                                            |
| `<@version/>`   | 設定から取得したモジュールのバージョンです。[バージョニングプラグイン](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)が適用されている場合、バージョンナビゲーターに置き換えられます。 |