[//]: # (title: コマンドラインインターフェース)

何らかの理由で[Gradle](dokka-gradle.md)や[Maven](dokka-maven.md)といったビルドツールを利用できない場合、Dokkaにはドキュメント生成用のコマンドライン (CLI) ランナーが用意されています。

比較すると、DokkaのGradleプラグインと同等か、それ以上の機能を持っています。しかし、特にマルチプラットフォームやマルチモジュールの環境では、自動設定がないためセットアップがかなり難しくなります。

## はじめに

CLIランナーは、独立した実行可能なアーティファクトとしてMaven Centralに公開されています。

[Maven Central](https://central.sonatype.com/artifact/org.jetbrains.dokka/dokka-cli)で探すか、[直接ダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-cli/%dokkaVersion%/dokka-cli-%dokkaVersion%.jar)できます。

`dokka-cli-%dokkaVersion%.jar`ファイルをコンピューターに保存したら、`-help`オプションを付けて実行すると、利用可能なすべての設定オプションとその説明を確認できます。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

いくつかのネストされたオプション、例えば`-sourceSet`でも同様に動作します。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

## ドキュメントの生成

### 前提条件

依存関係を管理するビルドツールがないため、依存関係の`.jar`ファイルを自分で用意する必要があります。

以下に、どの出力形式でも必要となる依存関係をリストします。

| **グループ**             | **アーティファクト**                  | **バージョン**    | **リンク**                                                                                                                                                 |
|-----------------------|-------------------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.dokka` | `dokka-base`                  | %dokkaVersion% | [download](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-base/%dokkaVersion%/dokka-base-%dokkaVersion%.jar)                                   |
| `org.jetbrains.dokka` | `analysis-kotlin-descriptors` | %dokkaVersion% | [download](https://repo1.maven.org/maven2/org/jetbrains/dokka/analysis-kotlin-descriptors/%dokkaVersion%/analysis-kotlin-descriptors-%dokkaVersion%.jar) |

以下は、[HTML](dokka-html.md)出力形式で必要となる追加の依存関係です。

| **グループ**               | **アーティファクト**       | **バージョン** | **リンク**                                                                                                           |
|-------------------------|--------------------|-------------|--------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.kotlinx` | `kotlinx-html-jvm` | 0.8.0       | [download](https://repo1.maven.org/maven2/org/jetbrains/kotlinx/kotlinx-html-jvm/0.8.0/kotlinx-html-jvm-0.8.0.jar) |
| `org.freemarker`        | `freemarker`       | 2.3.31      | [download](https://repo1.maven.org/maven2/org/freemarker/freemarker/2.3.31/freemarker-2.3.31.jar)                  |

### コマンドラインオプションでの実行

CLIランナーを設定するためにコマンドラインオプションを渡すことができます。

最低限、以下のオプションを指定する必要があります。

*   `-pluginsClasspath` - ダウンロードした依存関係への絶対/相対パスのリスト。セミコロン`;`で区切ります。
*   `-sourceSet` - ドキュメントを生成するためのコードソースへの絶対パス。
*   `-outputDir` - ドキュメントの出力ディレクトリへの絶対/相対パス。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;./analysis-kotlin-descriptors-%dokkaVersion%.jar;./kotlinx-html-jvm-0.8.0.jar;./freemarker-2.3.31.jar" \
     -sourceSet "-src /home/myCoolProject/src/main/kotlin" \
     -outputDir "./dokka/html"
```

指定された例を実行すると、[HTML](dokka-html.md)出力形式でドキュメントが生成されます。

その他の設定については、[コマンドラインオプション](#command-line-options)を参照してください。

### JSON設定での実行

JSONでCLIランナーを設定することも可能です。この場合、JSON設定ファイルへの絶対/相対パスを最初の唯一の引数として指定する必要があります。他のすべての設定オプションは、そこからパースされます。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar dokka-configuration.json
```

最低限、以下のJSON設定ファイルが必要です。

```json
{
  "outputDir": "./dokka/html",
  "sourceSets": [
    {
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "sourceRoots": [
        "/home/myCoolProject/src/main/kotlin"
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

詳細については、[JSON設定オプション](#json-configuration)を参照してください。

### その他の出力形式

デフォルトでは、`dokka-base`アーティファクトには[HTML](dokka-html.md)出力形式のみが含まれています。

他のすべての出力形式は、[Dokkaプラグイン](dokka-plugins.md)として実装されています。それらを使用するには、プラグインクラスパスに配置する必要があります。

例えば、実験的な[GFM](dokka-markdown.md#gfm)出力形式でドキュメントを生成したい場合、gfm-pluginのJAR（[ダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)）をダウンロードし、`pluginsClasspath`設定オプションに渡す必要があります。

コマンドラインオプション経由:

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

JSON設定経由:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

GFMプラグインが`pluginsClasspath`に渡されると、CLIランナーはGFM出力形式でドキュメントを生成します。

詳細については、[Markdown](dokka-markdown.md)および[Javadoc](dokka-javadoc.md#generate-javadoc-documentation)のページを参照してください。

## コマンドラインオプション

利用可能なすべてのコマンドラインオプションとその詳細な説明を確認するには、以下を実行します。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

簡易要約:

| オプション                       | 説明                                                                                                                                                                                           |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `moduleName`                 | プロジェクト/モジュールの名前。                                                                                                                                                                           |
| `moduleVersion`              | ドキュメント化されるバージョン。                                                                                                                                                    |
| `outputDir`                  | 出力ディレクトリパス。デフォルトは`./dokka`。                                                                                                                                                          |
| `sourceSet`                  | Dokkaソースセットの設定。ネストされた設定オプションを含みます。                                                                                                                          |
| `pluginsConfiguration`       | Dokkaプラグインの設定。                                                                                                                                                                      |
| `pluginsClasspath`           | Dokkaプラグインとその依存関係を含むjarファイルのリスト。セミコロンで区切られた複数のパスを受け入れます。                                                                                               |
| `offlineMode`                | ネットワーク経由でリモートファイル/リンクを解決するかどうか。                                                                                                                                                   |
| `failOnWarning`              | Dokkaが警告またはエラーを出力した場合にドキュメント生成を失敗させるかどうか。                                                                                                                  |
| `delayTemplateSubstitution`  | 一部の要素の置換を遅延させるかどうか。マルチモジュールプロジェクトのインクリメンタルビルドで使用されます。                                                                                                  |
| `noSuppressObviousFunctions` | `kotlin.Any`や`java.lang.Object`から継承された明らかな関数を抑制するかどうか。                                                                                               |
| `includes`                   | モジュールとパッケージのドキュメントを含むMarkdownファイル。セミコロンで区切られた複数の値を受け入れます。                                                                                        |
| `suppressInheritedMembers`   | 特定のクラスで明示的にオーバーライドされていない継承メンバーを抑制するかどうか。                                                                                                             |
| `globalPackageOptions`       | `matchingRegex,-deprecated,-privateApi,+warnUndocumented,+suppress;+visibility:PUBLIC;...`の形式のパッケージ設定オプションのグローバルリスト。セミコロンで区切られた複数の値を受け入れます。 |
| `globalLinks`                | `{url}^{packageListUrl}`の形式のグローバル外部ドキュメントリンク。`^^`で区切られた複数の値を受け入れます。                                                                                    |
| `globalSrcLink`              | ソースディレクトリとコードをブラウズするためのWebサービス間のグローバルマッピング。セミコロンで区切られた複数のパスを受け入れます。                                                                    |
| `helpSourceSet`              | ネストされた`-sourceSet`設定のヘルプを表示します。                                                                                                                                                |
| `loggingLevel`               | ロギングレベル。可能な値: `DEBUG, PROGRESS, INFO, WARN, ERROR`。                                                                                                                                 |
| `help, h`                    | 使用方法に関する情報。                                                                                                                                                                                           |

#### ソースセットオプション

ネストされた`-sourceSet`設定のコマンドラインオプションのリストを確認するには、以下を実行します。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

簡易要約:

| オプション                       | 説明                                                                                                                                                                    |
|------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sourceSetName`              | ソースセットの名前。                                                                                                                                                        |
| `displayName`                | ソースセットの表示名。内部と外部の両方で使用されます。                                                                                                           |
| `classpath`                  | 解析とインタラクティブなサンプル用のクラスパス。セミコロンで区切られた複数のパスを受け入れます。                                                                                |
| `src`                        | 解析およびドキュメント化されるソースコードのルート。セミコロンで区切られた複数のパスを受け入れます。                                                                               |
| `dependentSourceSets`        | `moduleName/sourceSetName`形式の依存ソースセットの名前。セミコロンで区切られた複数の値を受け入れます。                                                      |
| `samples`                    | サンプル関数を含むディレクトリまたはファイルのリスト。セミコロンで区切られた複数のパスを受け入れます。<anchor name="includes-cli"/>                                      |
| `includes`                   | [モジュールとパッケージのドキュメント](dokka-module-and-package-docs.md)を含むMarkdownファイル。セミコロンで区切られた複数のパスを受け入れます。                              |
| `documentedVisibilities`     | ドキュメント化される可視性。セミコロンで区切られた複数の値を受け入れます。可能な値: `PUBLIC`、`PRIVATE`、`PROTECTED`、`INTERNAL`、`PACKAGE`。                      |
| `reportUndocumented`         | ドキュメント化されていない宣言を報告するかどうか。                                                                                                                                   |
| `noSkipEmptyPackages`        | 空のパッケージのページを作成するかどうか。                                                                                                                                    |
| `skipDeprecated`             | 非推奨の宣言をスキップするかどうか。                                                                                                                                       |
| `jdkVersion`                 | JDK Javadocへのリンクに使用するJDKのバージョン。                                                                                                                             |
| `languageVersion`            | 解析とサンプル設定に使用される言語バージョン。                                                                                                                     |
| `apiVersion`                 | 解析とサンプル設定に使用されるKotlin APIバージョン。                                                                                                                   |
| `noStdlibLink`               | Kotlin標準ライブラリへのリンクを生成するかどうか。                                                                                                                      |
| `noJdkLink`                  | JDK Javadocへのリンクを生成するかどうか。                                                                                                                                     |
| `suppressedFiles`            | 抑制されるファイルのパス。セミコロンで区切られた複数のパスを受け入れます。                                                                                               |
| `analysisPlatform`           | 解析設定に使用されるプラットフォーム。                                                                                                                                         |
| `perPackageOptions`          | `matchingRegexp,-deprecated,-privateApi,+warnUndocumented,+suppress;...`の形式のパッケージソースセット設定のリスト。セミコロンで区切られた複数の値を受け入れます。 |
| `externalDocumentationLinks` | `{url}^{packageListUrl}`の形式の外部ドキュメントリンク。`^^`で区切られた複数の値を受け入れます。                                                                    |
| `srcLink`                    | ソースディレクトリとコードをブラウズするためのWebサービス間のマッピング。セミコロンで区切られた複数のパスを受け入れます。                                                    |

## JSON設定

以下に、各設定セクションの例と詳細な説明を示します。ページ下部には、[すべての設定オプション](#complete-configuration)が適用された例も記載されています。

### 一般設定

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "includes": [
    "module.md"
  ],
  "sourceLinks":  [
    { "_comment": "オプションは別のセクションで説明されています" }
  ],
  "perPackageOptions": [
    { "_comment": "オプションは別のセクションで説明されています" }
  ],
  "externalDocumentationLinks":  [
    { "_comment": "オプションは別のセクションで説明されています" }
  ],
  "sourceSets": [
    { "_comment": "オプションは別のセクションで説明されています" }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

<deflist collapsible="true">
    <def title="moduleName">
        <p>モジュールを参照するために使用される表示名。目次、ナビゲーション、ロギングなどで使用されます。</p>
        <p>デフォルト: <code>root</code></p>
    </def>
    <def title="moduleVersion">
        <p>モジュールのバージョン。</p>
        <p>デフォルト: 空</p>
    </def>
    <def title="outputDirectory">
        <p>出力形式に関わらず、ドキュメントが生成されるディレクトリ。</p>
        <p>デフォルト: <code>./dokka</code></p>
    </def>
    <def title="failOnWarning">
        <p>
            Dokkaが警告またはエラーを出力した場合に、ドキュメント生成を失敗させるかどうか。
            プロセスは、まずすべてのエラーと警告が出力されるまで待機します。
        </p>
        <p>この設定は<code>reportUndocumented</code>と連携してうまく機能します。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>明らかな関数を抑制するかどうか。</p>
            関数は、以下の場合に明らかな関数とみなされます:
            <list>
                <li>
                    <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code>、または
                    <code>java.lang.Enum</code>から継承されたもの。例: <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    合成（コンパイラによって生成された）もので、ドキュメントがないもの。例:
                    <code>dataClass.componentN</code>や<code>dataClass.copy</code>。
                </li>
            </list>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>特定のクラスで明示的にオーバーライドされていない継承メンバーを抑制するかどうか。</p>
        <p>
            注: これは<code>equals</code> / <code>hashCode</code> / <code>toString</code>などの関数を抑制できますが、
            <code>dataClass.componentN</code>や<code>dataClass.copy</code>のような合成関数を抑制することはできません。
            そのためには<code>suppressObviousFunctions</code>を使用してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="offlineMode">
        <anchor name="includes-json"/>
        <p>ネットワーク経由でリモートファイル/リンクを解決するかどうか。</p>
        <p>
            これには、外部ドキュメントリンクの生成に使用されるパッケージリストが含まれます。
            例えば、標準ライブラリのクラスをクリック可能にするためなどです。
        </p>
        <p>
            これを<code>true</code>に設定すると、特定の場合にビルド時間を大幅に短縮できますが、
            ドキュメントの品質やユーザーエクスペリエンスを悪化させる可能性もあります。例えば、
            標準ライブラリを含む依存関係からのクラス/メンバーリンクが解決されなくなるなどです。
        </p>
        <p>
            注: 取得したファイルをローカルにキャッシュし、Dokkaにローカルパスとして提供することができます。
            <code>externalDocumentationLinks</code>セクションを参照してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="includes">
        <p>
            [モジュールとパッケージのドキュメント](dokka-module-and-package-docs.md)を含む
            Markdownファイルのリスト。
        </p>
        <p>指定されたファイルの内容はパースされ、モジュールとパッケージの説明としてドキュメントに埋め込まれます。</p>
        <p>これはパッケージごとに設定できます。</p>
    </def>
    <def title="sourceSets">
        <p>
          Kotlinの[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)の
          個別および追加設定。
        </p>
        <p>利用可能なオプションのリストについては、[ソースセット設定](#source-set-configuration)を参照してください。</p>
    </def>
    <def title="sourceLinks">
        <p>すべてのソースセットに適用されるソースリンクのグローバル設定。</p>
        <p>利用可能なオプションのリストについては、[ソースリンク設定](#source-link-configuration)を参照してください。</p>
    </def>
    <def title="perPackageOptions">
        <p>ソースセットに関わらず、一致するパッケージのグローバル設定。</p>
        <p>利用可能なオプションのリストについては、[パッケージごとの設定](#per-package-configuration)を参照してください。</p>
    </def>
    <def title="externalDocumentationLinks">
        <p>使用されているソースセットに関わらず、外部ドキュメントリンクのグローバル設定。</p>
        <p>利用可能なオプションのリストについては、[外部ドキュメントリンク設定](#external-documentation-links-configuration)を参照してください。</p>
    </def>
    <def title="pluginsClasspath">
        <p>Dokkaプラグインとその依存関係を含むJARファイルのリスト。</p>
    </def>
</deflist>

### ソースセット設定

Kotlinの[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)の設定方法:

```json
{
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks":  [
        { "_comment": "オプションは別のセクションで説明されています" }
      ],
      "perPackageOptions": [
        { "_comment": "オプションは別のセクションで説明されています" }
      ],
      "externalDocumentationLinks":  [
        { "_comment": "オプションは別のセクションで説明されています" }
      ]
    }
  ]
}
```

<deflist collapsible="true">
    <def title="displayName">
        <p>このソースセットを参照するために使用される表示名。</p>
        <p>
            この名前は、外部（例えば、ドキュメント読者にソースセット名が表示される）と
            内部（例えば、<code>reportUndocumented</code>のロギングメッセージ）の両方で使用されます。
        </p>
        <p>より良い代替案がない場合は、プラットフォーム名を使用できます。</p>
    </def>
    <def title="sourceSetID">
        <p>ソースセットの技術的なID</p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化すべき可視性修飾子のセット。</p>
        <p>
            <code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合、
            または<code>public</code>宣言を除外し、内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>これはパッケージごとに設定できます。</p>
        <p>
            可能な値:</p>
            <list>
                <li><code>PUBLIC</code></li>
                <li><code>PRIVATE</code></li>
                <li><code>PROTECTED</code></li>
                <li><code>INTERNAL</code></li>
                <li><code>PACKAGE</code></li>
            </list>
        <p>デフォルト: <code>PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターでフィルタリングされた後、
            KDocを持たない可視の未ドキュメント化宣言について警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と連携してうまく機能します。</p>
        <p>これはパッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            様々なフィルターが適用された後、可視の宣言を含まないパッケージをスキップするかどうか。
        </p>
        <p>
            例えば、<code>skipDeprecated</code>が<code>true</code>に設定されており、パッケージが非推奨の宣言のみを含む場合、
            それは空とみなされます。
        </p>
        <p>CLIランナーのデフォルトは<code>false</code>です。</p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>でアノテーションされた宣言をドキュメント化するかどうか。</p>
        <p>これはパッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="jdkVersion">
        <p>Java型に対する外部ドキュメントリンクを生成する際に使用するJDKバージョン。</p>
        <p>
            例えば、ある公開宣言のシグネチャで<code>java.util.UUID</code>を使用し、
            このオプションが<code>8</code>に設定されている場合、Dokkaはそれに対する
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a>への外部ドキュメントリンクを生成します。
        </p>
    </def>
    <def title="languageVersion">
        <p>
            解析および[<code>@sample</code>](https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier)環境のセットアップに使用される
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin言語バージョン</a>。
        </p>
    </def>
    <def title="apiVersion">
        <p>
            解析および[<code>@sample</code>](https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier)環境のセットアップに使用される
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin APIバージョン</a>。
        </p>
    </def>
    <def title="noStdlibLink">
        <p>
            Kotlinの標準ライブラリのAPIリファレンスドキュメントに繋がる外部ドキュメントリンクを生成するかどうか。
        </p>
        <p>注: <code>noStdLibLink</code>が<code>false</code>に設定されている場合、リンクは**生成されます**。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="noJdkLink">
        <p>JDKのJavadocへの外部ドキュメントリンクを生成するかどうか。</p>
        <p>JDK Javadocのバージョンは<code>jdkVersion</code>オプションによって決定されます。</p>
        <p>注: <code>noJdkLink</code>が<code>false</code>に設定されている場合、リンクは**生成されます**。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="includes">
        <p>
            [モジュールとパッケージのドキュメント](dokka-module-and-package-docs.md)を含む
            Markdownファイルのリスト。
        </p>
        <p>指定されたファイルの内容はパースされ、モジュールとパッケージの説明としてドキュメントに埋め込まれます。</p>
    </def>
    <def title="analysisPlatform">
        <p>
            コード解析および[<code>@sample</code>](https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier)環境のセットアップに使用されるプラットフォーム。
        </p>
        <p>
            可能な値:</p>
            <list>
                <li><code>jvm</code></li>
                <li><code>common</code></li>
                <li><code>js</code></li>
                <li><code>native</code></li>
            </list>
    </def>
    <def title="sourceRoots">
        <p>
            解析およびドキュメント化されるソースコードのルート。
            ディレクトリおよび個々の<code>.kt</code> / <code>.java</code>ファイルが受け入れられます。
        </p>
    </def>
    <def title="classpath">
        <p>解析とインタラクティブなサンプル用のクラスパス。</p>
        <p>これは、依存関係から来る一部の型が自動的に解決/認識されない場合に役立ちます。</p>
        <p>このオプションは<code>.jar</code>ファイルと<code>.klib</code>ファイルの両方を受け入れます。</p>
    </def>
    <def title="samples">
        <p>
            [<code>@sample</code>](https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier) KDocタグ経由で参照されるサンプル関数を含むディレクトリまたはファイルのリスト。
        </p>
    </def>
    <def title="suppressedFiles">
        <p>ドキュメント生成時に抑制されるファイル。</p>
    </def>
    <def title="sourceLinks">
        <p>このソースセットにのみ適用されるソースリンクのパラメータセット。</p>
        <p>利用可能なオプションのリストについては、[ソースリンク設定](#source-link-configuration)を参照してください。</p>
    </def>
    <def title="perPackageOptions">
        <p>このソースセット内の一致するパッケージに特有のパラメータセット。</p>
        <p>利用可能なオプションのリストについては、[パッケージごとの設定](#per-package-configuration)を参照してください。</p>
    </def>
    <def title="externalDocumentationLinks">
        <p>このソースセットにのみ適用される外部ドキュメントリンクのパラメータセット。</p>
        <p>利用可能なオプションのリストについては、[外部ドキュメントリンク設定](#external-documentation-links-configuration)を参照してください。</p>
    </def>
</deflist>

### ソースリンク設定

`sourceLinks`設定ブロックを使用すると、各シグネチャに特定の行番号を持つ`remoteUrl`への`source`リンクを追加できます（行番号は`remoteLineSuffix`を設定することで構成可能です）。

これにより、読者は各宣言のソースコードを見つけやすくなります。

例として、`kotlinx.coroutines`の[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)関数のドキュメントを参照してください。

ソースリンクは、すべてのソースセットに対して一度にまとめて設定することも、[個別に](#source-set-configuration)設定することもできます。

```json
{
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ]
}
```

<deflist collapsible="true">
    <def title="localDirectory">
        <p>ローカルソースディレクトリへのパス。</p>
    </def>
    <def title="remoteUrl">
        <p>
            ドキュメント読者がアクセスできるソースコードホスティングサービス（GitHub、GitLab、Bitbucketなど）のURL。
            このURLは、宣言のソースコードリンクを生成するために使用されます。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            ソースコードの行番号をURLに付加するために使用されるサフィックス。これにより、読者はファイルだけでなく、
            宣言の特定の行番号にもナビゲートしやすくなります。
        </p>
        <p>
            数値自体は指定されたサフィックスに付加されます。例えば、
            このオプションが<code>#L</code>に設定され、行番号が10の場合、結果のURLサフィックスは
            <code>#L10</code>になります。
        </p>
        <p>
            人気のあるサービスで使用されるサフィックス:</p>
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>デフォルト: 空（サフィックスなし）</p>
    </def>
</deflist>

### パッケージごとの設定

`perPackageOptions`設定ブロックを使用すると、`matchingRegex`に一致する特定のパッケージに対していくつかのオプションを設定できます。

パッケージ設定は、すべてのソースセットに対して一度にまとめて追加することも、[個別に](#source-set-configuration)追加することもできます。

```json
{
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "skipDeprecated": false,
      "reportUndocumented": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ]
}
```

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>パッケージに一致するために使用される正規表現。</p>
    </def>
    <def title="suppress">
        <p>ドキュメント生成時にこのパッケージをスキップするかどうか。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>でアノテーションされた宣言をドキュメント化するかどうか。</p>
        <p>これはプロジェクト/モジュールレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターでフィルタリングされた後、
            KDocを持たない可視の未ドキュメント化宣言について警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と連携してうまく機能します。</p>
        <p>これはソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化すべき可視性修飾子のセット。</p>
        <p>
            このパッケージ内の<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合、
            または<code>public</code>宣言を除外し、内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>ソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>PUBLIC</code></p>
    </def>
</deflist>

### 外部ドキュメントリンク設定

`externalDocumentationLinks`ブロックを使用すると、依存関係の外部ホスト型ドキュメントに繋がるリンクを作成できます。

例えば、`kotlinx.serialization`の型を使用している場合、デフォルトではドキュメント内でクリックできない、まるで未解決であるかのように見えます。しかし、`kotlinx.serialization`のAPIリファレンスドキュメントはDokkaによって構築され、[kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/)で公開されているため、それに対する外部ドキュメントリンクを設定できます。これにより、Dokkaはライブラリからの型に対するリンクを生成し、それらを正常に解決してクリック可能にすることができます。

外部ドキュメントリンクは、すべてのソースセットに対して一度にまとめて設定することも、[個別に](#source-set-configuration)設定することもできます。

```json
{
  "externalDocumentationLinks": [
    {
      "url": "https://kotlinlang.org/api/kotlinx.serialization/",
      "packageListUrl": "https://kotlinlang.org/api/kotlinx.serialization/package-list"
    }
  ]
}
```

<deflist collapsible="true">
    <def title="url">
        <p>リンク先のドキュメントのルートURL。末尾のスラッシュを**含める必要があります**。</p>
        <p>
            Dokkaは、指定されたURLの<code>package-list</code>を自動的に見つけ出し、
            宣言をリンクするために最善を尽くします。
        </p>
        <p>
            自動解決に失敗した場合、または代わりにローカルキャッシュファイルを使用したい場合は、
            <code>packageListUrl</code>オプションの設定を検討してください。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code>の正確な場所。これはDokkaが自動的に解決することに頼る代替手段です。
        </p>
        <p>
            パッケージリストには、ドキュメントとプロジェクト自体に関する情報（モジュール名、パッケージ名など）が含まれています。
        </p>
        <p>これはネットワーク呼び出しを避けるためにローカルキャッシュファイルにすることもできます。</p>
    </def>
</deflist>

### 完全な設定

以下に、すべての設定オプションが同時に適用された例を示します。

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ],
  "externalDocumentationLinks": [
    {
      "url": "https://docs.oracle.com/javase/8/docs/api/",
      "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
    },
    {
      "url": "https://kotlinlang.org/api/core/kotlin-stdlib/",
      "packageListUrl": "https://kotlinlang.org/api/core/kotlin-stdlib/package-list"
    }
  ],
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "reportUndocumented": false,
      "skipDeprecated": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ],
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks": [
        {
          "localDirectory": "src/main/kotlin",
          "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
          "remoteLineSuffix": "#L"
        }
      ],
      "externalDocumentationLinks": [
        {
          "url": "https://docs.oracle.com/javase/8/docs/api/",
          "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
        },
        {
          "url": "https://kotlinlang.org/api/core/kotlin-stdlib/",
          "packageListUrl": "https://kotlinlang.org/api/core/kotlin-stdlib/package-list"
        }
      ],
      "perPackageOptions": [
        {
          "matchingRegex": ".*internal.*",
          "suppress": false,
          "reportUndocumented": false,
          "skipDeprecated": false,
          "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
        }
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ],
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"separateInheritedMembers\":false,\"footerMessage\":\"© 2021 pretty good Copyright\"}"
    }
  ],
  "includes": [
    "module.md"
  ]
}