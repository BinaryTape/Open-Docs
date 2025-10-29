[//]: # (title: Dokkaプラグイン)

Dokkaは、拡張が容易で高度にカスタマイズ可能であるようにゼロから構築されており、これにより、コミュニティは標準で提供されていない不足機能や非常に特定の機能のためのプラグインを実装できます。

Dokkaプラグインは、他のプログラミング言語ソースのサポートから、珍しい出力フォーマットまで多岐にわたります。独自のKDocタグやアノテーションのサポートを追加したり、KDocの説明に見られる異なるDSLをDokkaにレンダリングさせたり、Dokkaのページを視覚的に再設計して会社のウェブサイトにシームレスに統合したり、他のツールと統合したりと、できることは他にもたくさんあります。

Dokkaプラグインの作成方法については、[開発者ガイド](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)を参照してください。

## Dokkaプラグインの適用

Dokkaプラグインは個別の成果物として公開されているため、Dokkaプラグインを適用するには、それを依存関係として追加するだけで済みます。そこから、プラグインはDokkaをそれ自体で拡張します — それ以上の操作は不要です。

> 同じ拡張ポイントを使用する、または同様の方法で機能するプラグインは、互いに干渉する可能性があります。
> これにより、視覚的なバグ、一般的な未定義の動作、さらにはビルドの失敗につながる可能性があります。ただし、Dokkaは可変のデータ構造やオブジェクトを公開していないため、同時実行性の問題にはつながりません。
>
> このような問題に気づいた場合は、どのプラグインが適用されており、それらが何をするのかを確認することをお勧めします。
>
{style="note"}

プロジェクトに[mathjaxプラグイン](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)を適用する方法を見てみましょう。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

> これらの手順はDokka Gradleプラグインv1の構成とタスクを反映しています。Dokka 2.0.0以降、いくつかの構成オプション、Gradleタスク、およびドキュメント生成手順が更新されました。これには以下が含まれます:
>
> * [Dokkaプラグインの構成](dokka-migration.md#configure-dokka-plugins)
> * [マルチモジュールプロジェクトの操作](dokka-migration.md#share-dokka-configuration-across-modules)
>
> Dokka Gradle Plugin v2での変更点の詳細および完全なリストについては、[移行ガイド](dokka-migration.md)を参照してください。
>
> {style="note"}

Dokka用Gradleプラグインは、Dokkaプラグインを全体的に適用するか、特定の出力形式のみに適用することを可能にする便利な依存関係構成を作成します。

```kotlin
dependencies {
    // 全体的に適用されます
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%")

    // シングルモジュールのdokkaHtmlタスクにのみ適用されます
    dokkaHtmlPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")

    // マルチプロジェクトビルドのHTML形式に適用されます
    dokkaHtmlPartialPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")
}
```

> [マルチプロジェクト](dokka-gradle.md#multi-project-builds)ビルドをドキュメント化する場合、サブプロジェクト内およびその親プロジェクトでもDokkaプラグインを適用する必要があります。
>
{style="note"}

</tab>
<tab title="Groovy" group-key="groovy">

Dokka用Gradleプラグインは、Dokkaプラグインを全体的に適用するか、特定の出力形式のみに適用することを可能にする便利な依存関係構成を作成します。

```groovy
dependencies {
    // 全体的に適用されます
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%'

    // シングルモジュールのdokkaHtmlタスクにのみ適用されます
    dokkaHtmlPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'

    // マルチプロジェクトビルドのHTML形式に適用されます
    dokkaHtmlPartialPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'
}
```

> [マルチプロジェクト](dokka-gradle.md#multi-project-builds)ビルドをドキュメント化する場合、サブプロジェクト内およびその親プロジェクトでもDokkaプラグインを適用する必要があります。
>
{style="note"}

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>mathjax-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

[CLI](dokka-cli.md)ランナーを[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)で使用している場合、Dokkaプラグインは`.jar`ファイルとして`-pluginsClasspath`に渡す必要があります。

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を使用している場合、Dokkaプラグインは`pluginsClasspath`の下に指定する必要があります。

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./mathjax-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

</tab>
</tabs>

## Dokkaプラグインの設定

Dokkaプラグインは独自の構成オプションを持つこともできます。利用可能なオプションを確認するには、使用しているプラグインのドキュメントを参照してください。

[HTML](dokka-html.md)ドキュメントの生成を担当する`DokkaBase`プラグインを、アセットへのカスタム画像の追加 (`customAssets`オプション)、カスタムスタイルシートの追加 (`customStyleSheets`オプション)、フッターメッセージの変更 (`footerMessage`オプション) によって設定する方法を見てみましょう。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

GradleのKotlin DSLでは、タイプセーフなプラグイン設定が可能です。これは、プラグインの成果物を`buildscript`ブロック内のクラスパス依存関係に追加し、その後プラグインと構成クラスをインポートすることで実現できます。

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
    }
}
```

または、プラグインはJSON経由で設定することもできます。この方法では、追加の依存関係は不要です。

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType<DokkaTask>().configureEach {
    val dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
    }
    """
    pluginsMapConfiguration.set(
        mapOf(
            // 完全修飾プラグイン名からJSON設定へ
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
    }
    """
    pluginsMapConfiguration.set(
            // 完全修飾プラグイン名からJSON設定へ
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
            <!-- 完全修飾プラグイン名 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- オプション名 -->
                <customAssets>
                    <asset>${project.basedir}/my-image.png</asset>
                </customAssets>
                <customStyleSheets>
                    <stylesheet>${project.basedir}/my-styles.css</stylesheet>
                </customStyleSheets>
                <footerMessage>(c) MyOrg 2022 Maven</footerMessage>
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

[CLI](dokka-cli.md)ランナーを[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)で使用している場合、`fullyQualifiedPluginName=json`の形式でJSON設定を受け入れる`-pluginsConfiguration`オプションを使用します。

複数のプラグインを設定する必要がある場合は、`^^`で区切られた複数の値を渡すことができます。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を使用している場合、`values`でJSON設定を受け入れる同様の`pluginsConfiguration`配列が存在します。

```json
{
  "moduleName": "Dokka Example",
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\"}"
    }
  ]
}
```

</tab>
</tabs>

## 注目すべきプラグイン

以下は、役立つ可能性のある注目すべきDokkaプラグインです。

| **名前**                                                                                                                           | **説明**                                                                                              |
|:-----------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------|
| [Android documentation plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | Androidでのドキュメント作成体験を向上させます                                                             |
| [Versioning plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)                       | バージョンセレクタを追加し、アプリケーション/ライブラリの異なるバージョンのドキュメントを整理するのに役立ちます |
| [MermaidJS HTML plugin](https://github.com/glureau/dokka-mermaid)                                                                  | KDocs内の[MermaidJS](https://mermaid-js.github.io/mermaid/#/)図と視覚化をレンダリングします      |
| [Mathjax HTML plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)                        | KDocs内の数式をきれいに整形して表示します                                                                     |
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)              | Javaの視点から見たKotlinのシグネチャをレンダリングします                                                    |

Dokkaプラグインの作者で、ご自身のプラグインをこのリストに追加したい場合は、[Slack](dokka-introduction.md#community)または[GitHub](https://github.com/Kotlin/dokka/)経由でメンテナーにご連絡ください。