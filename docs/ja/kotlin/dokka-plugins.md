[//]: # (title: Dokkaプラグイン)

> このガイドは、Dokka Gradleプラグイン (DGP) v2モードに適用されます。DGP v1モードは現在サポートされていません。
> v1からv2モードにアップグレードするには、[移行ガイド](dokka-migration.md)に従ってください。
>
{style="note"}

Dokkaは、容易な拡張性と高度なカスタマイズ性を備えるようゼロから構築されており、コミュニティが標準では提供されていない不足している機能や非常に特殊な機能をプラグインとして実装できるようになっています。

Dokkaプラグインは、他のプログラミング言語ソースのサポートから、特殊な出力形式まで多岐にわたります。独自のKDocタグやアノテーションのサポートを追加したり、KDocの説明文に含まれるさまざまなDSLのレンダリング方法をDokkaに教えたり、自社のウェブサイトにシームレスに統合されるようにDokkaのページを視覚的に再設計したり、他のツールと統合したりするなど、さまざまなことが可能です。

Dokkaプラグインの作成方法について詳しく知りたい場合は、[開発者ガイド](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)（英語）を参照してください。

## Dokkaプラグインの適用

Dokkaプラグインは個別のアーティファクトとして公開されているため、Dokkaプラグインを適用するには、単にそれを依存関係として追加するだけです。追加すると、プラグイン自体がDokkaを拡張します。それ以上の操作は必要ありません。

> 同じ拡張ポイントを使用したり、同様の動作をしたりするプラグインは、互いに干渉する可能性があります。
> これにより、表示上の不具合や一般的な未定義の動作、さらにはビルドの失敗につながる可能性があります。ただし、Dokkaはミュータブル（可変）なデータ構造やオブジェクトを公開していないため、並行性の問題にはつながらないはずです。
>
> このような問題に気づいた場合は、どのプラグインが適用され、何を行っているかを確認することをお勧めします。
> 
{style="note"}

[mathjaxプラグイン](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)をプロジェクトに適用する方法を見てみましょう。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dependencies {
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin")
}
```

> * HTMLやJavadocなどの組み込みプラグインは、常に自動的に適用されます。これらは設定のみを行い、依存関係を宣言する必要はありません。
>
> * マルチモジュールプロジェクト（マルチプロジェクトビルド）のドキュメントを作成する場合、[サブプロジェクト間でDokkaの設定とプラグインを共有](dokka-gradle.md#multi-project-configuration)する必要があります。
> 
{style="note"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dependencies {
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin'
}
```

> [マルチプロジェクト](dokka-gradle.md#multi-project-configuration)ビルドのドキュメントを作成する場合、[サブプロジェクト間でDokkaの設定を共有](dokka-gradle.md#multi-project-configuration)する必要があります。
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

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)を指定して[CLI](dokka-cli.md)ランナーを使用している場合、Dokkaプラグインは`.jar`ファイルとして`-pluginsClasspath`に渡す必要があります。

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

Dokkaプラグインには独自の設定オプションがある場合があります。どのようなオプションが利用可能かについては、使用しているプラグインのドキュメントを参照してください。

組み込みのHTMLプラグインを設定し、カスタムイメージをアセット（`customAssets`オプション）に追加し、カスタムスタイルシート（`customStyleSheets`オプション）を追加し、フッターメッセージ（`footerMessage`オプション）を変更する方法を見てみましょう。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

型安全な方法でDokkaプラグインを設定するには、`dokka.pluginsConfiguration {}`ブロックを使用します。

```kotlin
dokka {
    pluginsConfiguration.html {
        customAssets.from("logo.png")
        customStyleSheets.from("styles.css")
        footerMessage.set("(c) Your Company")
    }
}
```

Dokkaプラグイン設定の例については、[Dokkaのバージョニングプラグインの例](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)（英語）を参照してください。

Dokkaでは、[カスタムプラグインを設定](https://github.com/Kotlin/dokka/blob/v2.2.0/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)（英語）することで、機能を拡張し、ドキュメント生成プロセスを変更することができます。

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    pluginsConfiguration {
        html {
            customAssets.from("logo.png")
            customStyleSheets.from("styles.css")
            footerMessage.set("(c) Your Company")
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
            <!-- プラグインの完全修飾名 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- 名前によるオプション -->
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

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)を指定して[CLI](dokka-cli.md)ランナーを使用している場合は、`fullyQualifiedPluginName=json`の形式でJSON設定を受け入れる`-pluginsConfiguration`オプションを使用します。

複数のプラグインを設定する必要がある場合は、`^^`で区切って複数の値を渡すことができます。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を使用している場合は、`values`にJSON設定を受け入れる同様の`pluginsConfiguration`配列が存在します。

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

以下は、便利と思われる注目のDokkaプラグインです。

| **名前** | **説明** |
|------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [Android documentation plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | Android上でのドキュメント体験を向上させます |
| [Versioning plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)                       | バージョンセレクターを追加し、アプリケーション/ライブラリの異なるバージョンのドキュメント整理を支援します |
| [MermaidJS HTML plugin](https://github.com/glureau/dokka-mermaid)                                                                  | KDoc内の[MermaidJS](https://mermaid-js.github.io/mermaid/#/)ダイアグラムや可視化をレンダリングします |
| [Mathjax HTML plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)                        | KDoc内の数式を綺麗に表示します |
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)               | Javaの視点から見たKotlinのシグネチャをレンダリングします |
| [GFM plugin](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm)                                                                                                                     | GitHub Flavoured Markdown形式でドキュメントを生成する機能を追加します |
| [Jekyll plugin](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-jekyll)                                                                                                                                                                                                           | Jekyll Flavoured Markdown形式でドキュメントを生成する機能を追加します |

あなたがDokkaプラグインの作者であり、このリストに自分のプラグインを追加したい場合は、[Slack](dokka-introduction.md#community)または[GitHub](https://github.com/Kotlin/dokka/)を通じてメンテナーに連絡してください。