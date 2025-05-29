[//]: # (title: Dokkaプラグイン)

Dokkaは、最初から簡単に拡張でき、高度にカスタマイズできるように構築されています。これにより、コミュニティは標準では提供されていない機能や、非常に特定の機能のためのプラグインを実装できます。

Dokkaプラグインは、他のプログラミング言語のソースのサポートから、珍しい出力形式まで多岐にわたります。独自のKDocタグやアノテーションのサポートを追加したり、KDocの説明に含まれるさまざまなDSLのレンダリング方法をDokkaに教えたり、会社のウェブサイトにシームレスに統合されるようにDokkaのページを視覚的に再設計したり、他のツールと統合したり、その他にも多くのことができます。

Dokkaプラグインの作成方法を学びたい場合は、[開発者ガイド](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)を参照してください。

## Dokkaプラグインを適用する

Dokkaプラグインは別個のアーティファクトとして公開されているため、Dokkaプラグインを適用するには、それを依存関係として追加するだけです。そこから、プラグイン自体がDokkaを拡張します — それ以上の操作は不要です。

> 同じ拡張ポイントを使用するプラグインや、同様の方法で動作するプラグインは、互いに干渉する可能性があります。
> これは、視覚的なバグ、一般的な未定義の動作、さらにはビルドの失敗につながる可能性があります。ただし、Dokkaは可変なデータ構造やオブジェクトを公開しないため、並行処理の問題につながることはありません。
>
> このような問題に気づいた場合は、どのプラグインが適用されているか、そしてそれらが何をするかを確認することをお勧めします。
>
{style="note"}

プロジェクトに[mathjaxプラグイン](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)を適用する方法を見てみましょう。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

DokkaのGradleプラグインは、プラグインを普遍的に、または特定の出力形式にのみ適用できる便利な依存関係設定を作成します。

```kotlin
dependencies {
    // Is applied universally
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%")

    // Is applied for the single-module dokkaHtml task only
    dokkaHtmlPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")

    // Is applied for HTML format in multi-project builds
    dokkaHtmlPartialPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")
}
```

> [マルチプロジェクト](dokka-gradle.md#multi-project-builds)ビルドをドキュメント化する際は、サブプロジェクト内だけでなく、親プロジェクト内にもDokkaプラグインを適用する必要があります。
>
{style="note"}

</tab>
<tab title="Groovy" group-key="groovy">

DokkaのGradleプラグインは、Dokkaプラグインを普遍的に、または特定の出力形式にのみ適用できる便利な依存関係設定を作成します。

```groovy
dependencies {
    // Is applied universally
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%'

    // Is applied for the single-module dokkaHtml task only
    dokkaHtmlPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'

    // Is applied for HTML format in multi-project builds
    dokkaHtmlPartialPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'
}
```

> [マルチプロジェクト](dokka-gradle.md#multi-project-builds)ビルドをドキュメント化する際は、サブプロジェクト内だけでなく、親プロジェクト内にもDokkaプラグインを適用する必要があります。
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

[CLI](dokka-cli.md)ランナーを[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)で使用している場合、Dokkaプラグインは`.jar`ファイルとして`-pluginsClasspath`に渡される必要があります。

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を使用している場合、Dokkaプラグインは`pluginsClasspath`の下で指定される必要があります。

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

## Dokkaプラグインを設定する

Dokkaプラグインは、独自の構成オプションを持つこともできます。どのオプションが利用可能かを確認するには、使用しているプラグインのドキュメントを参照してください。

[HTML](dokka-html.md)ドキュメントの生成を担当する`DokkaBase`プラグインを、アセットへのカスタム画像の追加（`customAssets`オプション）、カスタムスタイルシートの追加（`customStyleSheets`オプション）、およびフッターメッセージの変更（`footerMessage`オプション）によって設定する方法を見てみましょう。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

GradleのKotlin DSLは、型安全なプラグイン構成を可能にします。これは、`buildscript`ブロックのクラスパス依存関係にプラグインのアーティファクトを追加し、その後プラグインと構成クラスをインポートすることで実現できます。

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

あるいは、プラグインはJSON経由で構成することもできます。この方法では、追加の依存関係は不要です。

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
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

[CLI](dokka-cli.md)ランナーを[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)で使用している場合、`-pluginsConfiguration`オプションを使用します。これは、`fullyQualifiedPluginName=json`の形式でJSON構成を受け入れます。

複数のプラグインを設定する必要がある場合は、`^^`で区切られた複数の値を渡すことができます。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を使用している場合、`values`にJSON構成を受け入れる類似の`pluginsConfiguration`配列が存在します。

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

| **名前** | **説明** |
|---|---|
| [Android documentation plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | Androidでのドキュメント作成体験を向上させます |
| [Versioning plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning) | バージョンセレクターを追加し、アプリケーション/ライブラリの異なるバージョンのドキュメントを整理するのに役立ちます |
| [MermaidJS HTML plugin](https://github.com/glureau/dokka-mermaid) | KDoc内に見つかる[MermaidJS](https://mermaid-js.github.io/mermaid/#/)の図や視覚化をレンダリングします |
| [Mathjax HTML plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax) | KDoc内に見つかる数式をきれいに整形して表示します |
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java) | Javaの視点から見たKotlinのシグネチャをレンダリングします |

Dokkaプラグインの作者で、このリストにプラグインを追加したい場合は、[Slack](dokka-introduction.md#community)または[GitHub](https://github.com/Kotlin/dokka/)を通じてメンテナーに連絡してください。