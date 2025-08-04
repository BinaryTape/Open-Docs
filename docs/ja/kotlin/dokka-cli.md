[//]: # (title: CLI)

何らかの理由で[Gradle](dokka-gradle.md)や[Maven](dokka-maven.md)ビルドツールを使用できない場合でも、Dokkaにはドキュメントを生成するためのコマンドライン (CLI) ランナーがあります。

比較すると、DokkaのGradleプラグインと同等、あるいはそれ以上の機能を備えています。ただし、特にマルチプラットフォームやマルチモジュールの環境では、自動設定がないためセットアップがかなり困難です。

## 開始する

CLIランナーは、独立した実行可能なアーティファクトとしてMaven Centralに公開されています。

[Maven Central](https://central.sonatype.com/artifact/org.jetbrains.dokka/dokka-cli)で見つけるか、[直接ダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-cli/%dokkaVersion%/dokka-cli-%dokkaVersion%.jar)できます。

`dokka-cli-%dokkaVersion%.jar`ファイルをコンピューターに保存したら、`-help`オプションを付けて実行し、利用可能なすべての設定オプションとその説明を確認します。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

また、`-sourceSet`のようなネストされたオプションでも機能します。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

## ドキュメントを生成する

### 前提条件

依存関係を管理するビルドツールがないため、依存関係の`.jar`ファイルを自分で提供する必要があります。

以下は、あらゆる出力形式で必要な依存関係です。

| **グループ**             | **アーティファクト**                  | **バージョン**    | **リンク**                                                                                                                                                 |
|-----------------------|-------------------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.dokka` | `dokka-base`                  | %dokkaVersion% | [ダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-base/%dokkaVersion%/dokka-base-%dokkaVersion%.jar)                                   |
| `org.jetbrains.dokka` | `analysis-kotlin-descriptors` | %dokkaVersion% | [ダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/analysis-kotlin-descriptors/%dokkaVersion%/analysis-kotlin-descriptors-%dokkaVersion%.jar) |

以下は、[HTML](dokka-html.md)出力形式で追加で必要な依存関係です。

| **グループ**               | **アーティファクト**       | **バージョン** | **リンク**                                                                                                           |
|-------------------------|--------------------|-------------|--------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.kotlinx` | `kotlinx-html-jvm` | 0.8.0       | [ダウンロード](https://repo1.maven.org/maven2/org/jetbrains/kotlinx/kotlinx-html-jvm/0.8.0/kotlinx-html-jvm-0.8.0.jar) |
| `org.freemarker`        | `freemarker`       | 2.3.31      | [ダウンロード](https://repo1.maven.org/maven2/org/freemarker/freemarker/2.3.31/freemarker-2.3.31.jar)                  |

### コマンドラインオプションで実行する

CLIランナーを設定するために、コマンドラインオプションを渡すことができます。

最低限、以下のオプションを指定する必要があります。

*   `-pluginsClasspath` - ダウンロードした依存関係への絶対/相対パスのリスト。セミコロン `;` で区切ります。
*   `-sourceSet` - ドキュメントを生成するコードソースへの絶対パス。
*   `-outputDir` - ドキュメント出力ディレクトリへの絶対/相対パス。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;./analysis-kotlin-descriptors-%dokkaVersion%.jar;./kotlinx-html-jvm-0.8.0.jar;./freemarker-2.3.31.jar" \
     -sourceSet "-src /home/myCoolProject/src/main/kotlin" \
     -outputDir "./dokka/html"
```

指定された例を実行すると、[HTML](dokka-html.md)出力形式でドキュメントが生成されます。

設定の詳細については、[コマンドラインオプション](#command-line-options)を参照してください。

### JSON設定で実行する

CLIランナーをJSONで設定することも可能です。この場合、JSON設定ファイルへの絶対/相対パスを最初の唯一の引数として提供する必要があります。他のすべての設定オプションはそこから解析されます。

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

他のすべての出力形式は[Dokkaプラグイン](dokka-plugins.md)として実装されています。これらを使用するには、プラグインのクラスパスに配置する必要があります。

例えば、実験的な[GFM](dokka-markdown.md#gfm)出力形式でドキュメントを生成したい場合、gfm-pluginのJAR（[ダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)）をダウンロードし、`pluginsClasspath`設定オプションに渡す必要があります。

コマンドラインオプション経由：

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

JSON設定経由：

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

GFMプラグインを`pluginsClasspath`に渡すことで、CLIランナーはGFM出力形式でドキュメントを生成します。

詳細については、[Markdown](dokka-markdown.md)および[Javadoc](dokka-javadoc.md#generate-javadoc-documentation)のページを参照してください。

## コマンドラインオプション

利用可能なすべてのコマンドラインオプションとその詳細な説明のリストを見るには、以下を実行します。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

概要：

| オプション                       | 説明                                                                                                                                                                                           |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `moduleName`                 | プロジェクト/モジュールの名前。                                                                                                                                                                           |
| `moduleVersion`              | ドキュメント化されるバージョン。                                                                                                                                                    |
| `outputDir`                  | 出力ディレクトリのパス。デフォルトは`./dokka`です。                                                                                                                                                          |
| `sourceSet`                  | Dokkaソースセットの設定。ネストされた設定オプションを含みます。                                                                                                                                                         |
| `pluginsConfiguration`       | Dokkaプラグインの設定。                                                                                                                                                                      |
| `pluginsClasspath`           | Dokkaプラグインとその依存関係を含むjarファイルのリスト。セミコロンで区切られた複数のパスを受け入れます。                                                                                               |
| `offlineMode`                | ネットワーク経由でリモートファイル/リンクを解決するかどうか。                                                                                                                                                   |
| `failOnWarning`              | Dokkaが警告またはエラーを出した場合にドキュメント生成を失敗させるかどうか。                                                                                                                                                 |
| `delayTemplateSubstitution`  | 一部の要素の置換を遅延させるかどうか。マルチモジュールプロジェクトのインクリメンタルビルドで使用されます。                                                                                                  |
| `noSuppressObviousFunctions` | `kotlin.Any`や`java.lang.Object`から継承された明白な関数を抑制するかどうか。                                                                                                                              |
| `includes`                   | モジュールとパッケージのドキュメントを含むMarkdownファイル。セミコロンで区切られた複数の値を受け入れます。                                                                                        |
| `suppressInheritedMembers`   | 特定のクラスで明示的にオーバーライドされていない継承されたメンバーを抑制するかどうか。                                                                                                             |
| `globalPackageOptions`       | パッケージ設定オプションのグローバルリスト。形式は`"matchingRegex,-deprecated,-privateApi,+warnUndocumented,+suppress;+visibility:PUBLIC;..."`です。セミコロンで区切られた複数の値を受け入れます。 |
| `globalLinks`                | 外部ドキュメントリンクのグローバルリスト。形式は`{url}^{packageListUrl}`です。`^^`で区切られた複数の値を受け入れます。                                                                                    |
| `globalSrcLink`              | ソースディレクトリとコードブラウジング用のWebサービス間のグローバルマッピング。セミコロンで区切られた複数のパスを受け入れます。                                                                    |
| `helpSourceSet`              | ネストされた`-sourceSet`設定のヘルプを表示します。                                                                                                                                                |
| `loggingLevel`               | ログレベル。取りうる値は`DEBUG, PROGRESS, INFO, WARN, ERROR`です。                                                                                                                                 |
| `help, h`                    | 使用方法の情報。                                                                                                                                                                                           |

#### ソースセットオプション

ネストされた`-sourceSet`設定のコマンドラインオプションのリストを見るには、以下を実行します。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

概要：

| オプション                       | 説明                                                                                                                                                                    |
|------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sourceSetName`              | ソースセットの名前。                                                                                                                                                        |
| `displayName`                | ソースセットの表示名。内部的にも外部的にも使用されます。                                                                                                                                          |
| `classpath`                  | 解析およびインタラクティブなサンプル用のクラスパス。セミコロンで区切られた複数のパスを受け入れます。                                                                                                               |
| `src`                        | 解析およびドキュメント化されるソースコードのルート。セミコロンで区切られた複数のパスを受け入れます。                                                                                                              |
| `dependentSourceSets`        | 依存するソースセットの名前。形式は`moduleName/sourceSetName`です。セミコロンで区切られた複数の値を受け入れます。                                                      |
| `samples`                    | サンプル関数を含むディレクトリまたはファイルのリスト。セミコロンで区切られた複数のパスを受け入れます。<anchor name="includes-cli"/>                                      |
| `includes`                   | [モジュールとパッケージのドキュメント](dokka-module-and-package-docs.md)を含むMarkdownファイル。セミコロンで区切られた複数のパスを受け入れます。                              |
| `documentedVisibilities`     | ドキュメント化される可視性。セミコロンで区切られた複数の値を受け入れます。取りうる値は`PUBLIC`、`PRIVATE`、`PROTECTED`、`INTERNAL`、`PACKAGE`です。                      |
| `reportUndocumented`         | ドキュメント化されていない宣言を報告するかどうか。                                                                                                                                   |
| `noSkipEmptyPackages`        | 空のパッケージのページを作成するかどうか。                                                                                                                                    |
| `skipDeprecated`             | 非推奨の宣言をスキップするかどうか。                                                                                                                                       |
| `jdkVersion`                 | JDK Javadocへのリンクに使用するJDKのバージョン。                                                                                                                             |
| `languageVersion`            | 解析およびサンプルの設定に使用される言語バージョン。                                                                                                                     |
| `apiVersion`                 | 解析およびサンプルの設定に使用されるKotlin APIバージョン。                                                                                                                   |
| `noStdlibLink`               | Kotlin標準ライブラリへのリンクを生成するかどうか。                                                                                                                                     |
| `noJdkLink`                  | JDK Javadocへのリンクを生成するかどうか。                                                                                                                                     |
| `suppressedFiles`            | 抑制されるファイルのパス。セミコロンで区切られた複数のパスを受け入れます。                                                                                               |
| `analysisPlatform`           | 解析の設定に使用されるプラットフォーム。                                                                                                                                         |
| `perPackageOptions`          | パッケージソースセット設定のリスト。形式は`matchingRegexp,-deprecated,-privateApi,+warnUndocumented,+suppress;...`です。セミコロンで区切られた複数の値を受け入れます。 |
| `externalDocumentationLinks` | 外部ドキュメントリンク。形式は`{url}^{packageListUrl}`です。`^^`で区切られた複数の値を受け入れます。                                                                    |
| `srcLink`                    | ソースディレクトリとコードブラウジング用のWebサービス間のマッピング。セミコロンで区切られた複数のパスを受け入れます。                                                    |

## JSON設定

以下に、各設定セクションのいくつかの例と詳細な説明を示します。ページの最下部には、[すべての設定オプション](#complete-configuration)が適用された例もあります。

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
    { "_comment": "Options are described in a separate section" }
  ],
  "perPackageOptions": [
    { "_comment": "Options are described in a separate section" }
  ],
  "externalDocumentationLinks":  [
    { "_comment": "Options are described in a separate section" }
  ],
  "sourceSets": [
    { "_comment": "Options are described in a separate section" }
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
    <def title="モジュール名">
        <p>モジュールを参照するために使用される表示名です。目次、ナビゲーション、ロギングなどに使用されます。</p>
        <p>デフォルト: <code>root</code></p>
    </def>
    <def title="モジュールバージョン">
        <p>モジュールのバージョン。</p>
        <p>デフォルト: 空</p>
    </def>
    <def title="出力ディレクトリ">
        <p>出力形式に関わらず、ドキュメントが生成されるディレクトリ。</p>
        <p>デフォルト: <code>./dokka</code></p>
    </def>
    <def title="警告時に失敗">
        <p>
            Dokkaが警告またはエラーを出した場合にドキュメント生成を失敗させるかどうか。
            プロセスは、すべてのエラーと警告が最初に出力されるまで待機します。
        </p>
        <p>この設定は<code>reportUndocumented</code>と組み合わせてうまく機能します。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="明白な関数を抑制">
        <p>明白な関数を抑制するかどうか。</p>
            関数が明白であると見なされるのは、以下のいずれかの場合です。
            <list>
                <li>
                    <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code>または
                    <code>java.lang.Enum</code>から継承されている場合。例: <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    合成（コンパイラによって生成されたもの）で、ドキュメントがない場合。例:
                    <code>dataClass.componentN</code>または<code>dataClass.copy</code>。
                </li>
            </list>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="継承されたメンバーを抑制">
        <p>特定のクラスで明示的にオーバーライドされていない継承されたメンバーを抑制するかどうか。</p>
        <p>
            注：これは<code>equals</code> / <code>hashCode</code> / <code>toString</code>などの関数を抑制できますが、
            <code>dataClass.componentN</code>や<code>dataClass.copy</code>のような合成関数は抑制できません。
            そのためには<code>suppressObviousFunctions</code>を使用してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="オフラインモード">
        <anchor name="includes-json"/>
        <p>ネットワーク経由でリモートファイル/リンクを解決するかどうか。</p>
        <p>
            これには、外部ドキュメントリンクを生成するために使用されるパッケージリストが含まれます。
            例えば、標準ライブラリのクラスをクリック可能にするためです。
        </p>
        <p>
            これを<code>true</code>に設定すると、特定のケースでビルド時間を大幅に短縮できますが、
            ドキュメントの品質とユーザーエクスペリエンスを低下させる可能性もあります。例えば、
            標準ライブラリを含む依存関係からのクラス/メンバーリンクを解決しない場合などです。
        </p>
        <p>
            注：取得したファイルをローカルにキャッシュし、Dokkaにローカルパスとして提供することができます。
            <code>externalDocumentationLinks</code>セクションを参照してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="インクルード">
        <p>
            <a href="dokka-module-and-package-docs.md">モジュールおよびパッケージのドキュメント</a>を
            含むMarkdownファイルのリスト。
        </p>
        <p>指定されたファイルのコンテンツは解析され、モジュールおよびパッケージの説明としてドキュメントに埋め込まれます。</p>
        <p>これはパッケージごとに設定できます。</p>
    </def>
    <def title="ソースセット">
        <p>
          Kotlinの<a href="https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets">ソースセット</a>の
          個別の追加設定。
        </p>
        <p>利用可能なオプションのリストについては、<a href="#source-set-configuration">ソースセット設定</a>を参照してください。</p>
    </def>
    <def title="ソースリンク">
        <p>すべてのソースセットに適用されるソースリンクのグローバル設定。</p>
        <p>利用可能なオプションのリストについては、<a href="#source-link-configuration">ソースリンク設定</a>を参照してください。</p>
    </def>
    <def title="パッケージごとのオプション">
        <p>ソースセットに関わらず、一致したパッケージのグローバル設定。</p>
        <p>利用可能なオプションのリストについては、<a href="#per-package-configuration">パッケージごとの設定</a>を参照してください。</p>
    </def>
    <def title="外部ドキュメントリンク">
        <p>使用されるソースセットに関わらず、外部ドキュメントリンクのグローバル設定。</p>
        <p>利用可能なオプションのリストについては、<a href="#external-documentation-links-configuration">外部ドキュメントリンク設定</a>を参照してください。</p>
    </def>
    <def title="プラグインクラスパス">
        <p>Dokkaプラグインとその依存関係を含むJARファイルのリスト。</p>
    </def>
</deflist>

### ソースセット設定

Kotlinの[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)を設定する方法：

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
        { "_comment": "Options are described in a separate section" }
      ],
      "perPackageOptions": [
        { "_comment": "Options are described in a separate section" }
      ],
      "externalDocumentationLinks":  [
        { "_comment": "Options are described in a separate section" }
      ]
    }
  ]
}
```

<deflist collapsible="true">
    <def title="表示名">
        <p>このソースセットを参照するために使用される表示名。</p>
        <p>
            この名前は、外部（例えば、ドキュメント閲覧者からソースセット名が見える）および内部（例えば、<code>reportUndocumented</code>のログメッセージ用）の両方で使用されます。
        </p>
        <p>より良い代替手段がない場合は、プラットフォーム名を使用できます。</p>
    </def>
    <def title="ソースセットID">
        <p>ソースセットの技術的なID。</p>
    </def>
    <def title="ドキュメント化される可視性">
        <p>ドキュメント化すべき可視性修飾子のセット。</p>
        <p>
            これは、<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合、
            あるいは<code>public</code>宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>これはパッケージごとに設定できます。</p>
        <p>
            取りうる値：</p>
            <list>
                <li><code>PUBLIC</code></li>
                <li><code>PRIVATE</code></li>
                <li><code>PROTECTED</code></li>
                <li><code>INTERNAL</code></li>
                <li><code>PACKAGE</code></li>
            </list>
        <p>デフォルト: <code>PUBLIC</code></p>
    </def>
    <def title="ドキュメント化されていない宣言の報告">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターでフィルタリングされた後、
            可視でドキュメント化されていない宣言、つまりKDocがない宣言について警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と組み合わせてうまく機能します。</p>
        <p>これはパッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="空のパッケージをスキップ">
        <p>
            様々なフィルターが適用された後、可視な宣言を含まないパッケージをスキップするかどうか。
        </p>
        <p>
            例えば、<code>skipDeprecated</code>が<code>true</code>に設定され、パッケージに非推奨の宣言のみが含まれている場合、
            そのパッケージは空であると見なされます。
        </p>
        <p>CLIランナーのデフォルトは<code>false</code>です。</p>
    </def>
    <def title="非推奨をスキップ">
        <p><code>@Deprecated</code>で注釈された宣言をドキュメント化するかどうか。</p>
        <p>これはパッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="JDKバージョン">
        <p>Java型に対する外部ドキュメントリンクを生成する際に使用するJDKのバージョン。</p>
        <p>
            例えば、何らかの<code>public</code>宣言シグネチャで<code>java.util.UUID</code>を使用し、
            このオプションが<code>8</code>に設定されている場合、Dokkaはそれに対する<a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a>への
            外部ドキュメントリンクを生成します。
        </p>
    </def>
    <def title="言語バージョン">
        <p>
            解析と<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>環境の
            設定に使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin言語バージョン</a>。
        </p>
    </def>
    <def title="APIバージョン">
        <p>
            解析と<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>環境の
            設定に使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin APIバージョン</a>。
        </p>
    </def>
    <def title="標準ライブラリリンクなし">
        <p>
            Kotlinの標準ライブラリのAPIリファレンスドキュメントに繋がる外部ドキュメントリンクを生成するかどうか。
        </p>
        <p>注: <code>noStdLibLink</code>が<code>false</code>に設定されている場合、リンクは<b>生成されます</b>。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="JDKリンクなし">
        <p>JDKのJavadocへの外部ドキュメントリンクを生成するかどうか。</p>
        <p>JDK Javadocのバージョンは、<code>jdkVersion</code>オプションによって決定されます。</p>
        <p>注: <code>noJdkLink</code>が<code>false</code>に設定されている場合、リンクは<b>生成されます</b>。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="インクルード">
        <p>
            <a href="dokka-module-and-package-docs.md">モジュールおよびパッケージのドキュメント</a>を
            含むMarkdownファイルのリスト。
        </p>
        <p>指定されたファイルのコンテンツは解析され、モジュールおよびパッケージの説明としてドキュメントに埋め込まれます。</p>
    </def>
    <def title="解析プラットフォーム">
        <p>
            コード解析と<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>環境の
            設定に使用されるプラットフォーム。
        </p>
        <p>
            取りうる値：</p>
            <list>
                <li><code>jvm</code></li>
                <li><code>common</code></li>
                <li><code>js</code></li>
                <li><code>native</code></li>
            </list>
    </def>
    <def title="ソースルート">
        <p>
            解析およびドキュメント化されるソースコードのルート。
            ディレクトリおよび個別の<code>.kt</code> / <code>.java</code>ファイルが受け入れられます。
        </p>
    </def>
    <def title="クラスパス">
        <p>解析およびインタラクティブなサンプル用のクラスパス。</p>
        <p>これは、依存関係から来る一部の型が自動的に解決/認識されない場合に役立ちます。</p>
        <p>このオプションは、<code>.jar</code>ファイルと<code>.klib</code>ファイルの両方を受け入れます。</p>
    </def>
    <def title="サンプル">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDocタグを介して参照される
            サンプル関数を含むディレクトリまたはファイルのリスト。
        </p>
    </def>
    <def title="抑制されるファイル">
        <p>ドキュメント生成時に抑制されるファイル。</p>
    </def>
    <def title="ソースリンク">
        <p>このソースセットにのみ適用されるソースリンクのパラメータセット。</p>
        <p>利用可能なオプションのリストについては、<a href="#source-link-configuration">ソースリンク設定</a>を参照してください。</p>
    </def>
    <def title="パッケージごとのオプション">
        <p>このソースセット内の、一致したパッケージに固有のパラメータセット。</p>
        <p>利用可能なオプションのリストについては、<a href="#per-package-configuration">パッケージごとの設定</a>を参照してください。</p>
    </def>
    <def title="外部ドキュメントリンク">
        <p>このソースセットにのみ適用される外部ドキュメントリンクのパラメータセット。</p>
        <p>利用可能なオプションのリストについては、<a href="#external-documentation-links-configuration">外部ドキュメントリンク設定</a>を参照してください。</p>
    </def>
</deflist>

### ソースリンク設定

`sourceLinks`設定ブロックを使用すると、各シグネチャに特定の行番号を持つ`remoteUrl`への`source`リンクを追加できます。（行番号は`remoteLineSuffix`を設定することで構成可能です）。

これは、閲覧者が各宣言のソースコードを見つけるのに役立ちます。

例については、`kotlinx.coroutines`の[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)関数のドキュメントを参照してください。

すべてのソースセットに対して同時に、または[個別に](#source-set-configuration)ソースリンクを設定できます。

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
    <def title="ローカルディレクトリ">
        <p>ローカルソースディレクトリへのパス。</p>
    </def>
    <def title="リモートURL">
        <p>
            GitHub、GitLab、Bitbucketなど、ドキュメント閲覧者がアクセスできるソースコードホスティングサービスのURL。
            このURLは、宣言のソースコードリンクを生成するために使用されます。
        </p>
    </def>
    <def title="リモート行サフィックス">
        <p>
            URLにソースコードの行番号を追加するために使用されるサフィックス。
            これにより、閲覧者はファイルだけでなく、宣言の特定の行番号に移動できます。
        </p>
        <p>
            番号自体は指定されたサフィックスに追加されます。例えば、
            このオプションが<code>#L</code>に設定され、行番号が10の場合、結果のURLサフィックスは
            <code>#L10</code>となります。
        </p>
        <p>
            一般的なサービスで使用されるサフィックス：</p>
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>デフォルト: 空（サフィックスなし）</p>
    </def>
</deflist>

### パッケージごとの設定

`perPackageOptions`設定ブロックでは、`matchingRegex`に一致する特定のパッケージに対していくつかのオプションを設定できます。

すべてのソースセットに対して同時に、または[個別に](#source-set-configuration)パッケージ設定を追加できます。

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
    <def title="マッチング正規表現">
        <p>パッケージに一致させるために使用される正規表現。</p>
    </def>
    <def title="抑制">
        <p>ドキュメント生成時にこのパッケージをスキップするかどうか。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="非推奨をスキップ">
        <p><code>@Deprecated</code>で注釈された宣言をドキュメント化するかどうか。</p>
        <p>これはプロジェクト/モジュールレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="ドキュメント化されていない宣言の報告">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターでフィルタリングされた後、
            可視でドキュメント化されていない宣言、つまりKDocがない宣言について警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と組み合わせてうまく機能します。</p>
        <p>これはソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="ドキュメント化される可視性">
        <p>ドキュメント化すべき可視性修飾子のセット。</p>
        <p>
            これは、このパッケージ内の<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合、
            あるいは<code>public</code>宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>ソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>PUBLIC</code></p>
    </def>
</deflist>

### 外部ドキュメントリンク設定

`externalDocumentationLinks`ブロックを使用すると、依存関係の外部ホスト型ドキュメントに繋がるリンクを作成できます。

例えば、`kotlinx.serialization`の型を使用している場合、デフォルトではドキュメント内でクリックできない、まるで未解決であるかのように見えます。しかし、`kotlinx.serialization`のAPIリファレンスドキュメントはDokkaによって構築され、[kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/)に公開されているため、それに対する外部ドキュメントリンクを設定できます。これにより、Dokkaはライブラリからの型のリンクを生成し、それらを正常に解決してクリック可能にすることができます。

すべてのソースセットに対して同時に、または[個別に](#source-set-configuration)外部ドキュメントリンクを設定できます。

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
    <def title="URL">
        <p>リンク先のドキュメントのルートURL。末尾のスラッシュを<b>含める必要があります</b>。</p>
        <p>
            Dokkaは、指定されたURLの<code>package-list</code>を自動的に見つけ、宣言をリンクするために最善を尽くします。
        </p>
        <p>
            自動解決に失敗した場合や、代わりにローカルにキャッシュされたファイルを使用したい場合は、
            <code>packageListUrl</code>オプションの設定を検討してください。
        </p>
    </def>
    <def title="パッケージリストURL">
        <p>
            <code>package-list</code>の正確な場所。これはDokkaによる自動解決に頼る代替手段です。
        </p>
        <p>
            パッケージリストには、モジュール名やパッケージ名など、ドキュメントとプロジェクト自体に関する情報が含まれています。
        </p>
        <p>これは、ネットワーク呼び出しを避けるためにローカルにキャッシュされたファイルであることも可能です。</p>
    </def>
</deflist>

### 完全な設定

以下に、同時に適用されたすべての利用可能な設定オプションを示します。

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