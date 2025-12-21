[//]: # (title: Maven)

Mavenベースのプロジェクトのドキュメントを生成するには、Dokka用Mavenプラグインを使用します。

> [Dokka用Gradleプラグイン](dokka-gradle.md)と比較して、Mavenプラグインは基本的な機能しか持たず、
> マルチモジュールビルドをサポートしていません。
> 
{style="note"}

[Mavenの例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/maven)プロジェクトにアクセスして、Dokkaを試したり、Mavenプロジェクト用に設定する方法を確認できます。

## Dokkaの適用

Dokkaを適用するには、POMファイルの`plugins`セクションに`dokka-maven-plugin`を追加する必要があります。

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## ドキュメントの生成

Mavenプラグインによって提供されるゴールは以下の通りです。

| **ゴール**      | **説明**                                                                        |
|---------------|----------------------------------------------------------------------------------------|
| `dokka:dokka` | Dokkaプラグインが適用されたドキュメントを生成します。デフォルトのフォーマットは[HTML](dokka-html.md)です。 |

### 実験的機能 (Experimental)

| **ゴール**           | **説明**                                                                             |
|--------------------|---------------------------------------------------------------------------------------------|
| `dokka:javadoc`    | [Javadoc](dokka-javadoc.md)フォーマットでドキュメントを生成します。                                    |
| `dokka:javadocJar` | [Javadoc](dokka-javadoc.md)フォーマットのドキュメントを含む`javadoc.jar`ファイルを生成します。 |

### その他の出力フォーマット

デフォルトでは、Dokka用Mavenプラグインは[HTML](dokka-html.md)出力フォーマットでドキュメントをビルドします。

他のすべての出力フォーマットは[Dokkaプラグイン](dokka-plugins.md)として実装されています。目的のフォーマットでドキュメントを生成するには、それをDokkaプラグインとして設定に追加する必要があります。

例えば、実験的な[GFM](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm#readme)フォーマットを使用するには、`gfm-plugin`アーティファクトを追加する必要があります。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>gfm-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

この設定で`dokka:dokka`ゴールを実行すると、GFMフォーマットでドキュメントが生成されます。

Dokkaプラグインについて詳しく知るには、[Dokkaプラグイン](dokka-plugins.md)を参照してください。

## javadoc.jarのビルド

ライブラリをリポジトリに公開したい場合、ライブラリのAPIリファレンスドキュメントを含む`javadoc.jar`ファイルを提供する必要がある場合があります。

例えば、[Maven Central](https://central.sonatype.org/)に公開する場合、プロジェクトと一緒に`javadoc.jar`を提供することが[必須](https://central.sonatype.org/publish/requirements/)です。ただし、すべてのリポジトリにこのルールがあるわけではありません。

[Dokka用Gradleプラグイン](dokka-gradle.md#build-javadoc-jar)とは異なり、Mavenプラグインにはすぐに使える`dokka:javadocJar`ゴールが付属しています。デフォルトでは、`target`フォルダに[Javadoc](dokka-javadoc.md)出力フォーマットでドキュメントを生成します。

組み込みのゴールに満足できない場合、または出力をカスタマイズしたい場合（例えば、Javadocではなく[HTML](dokka-html.md)フォーマットでドキュメントを生成したい場合）、以下の設定でMaven JARプラグインを追加することで同様の動作を実現できます。

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.3.0</version>
    <executions>
        <execution>
            <goals>
                <goal>test-jar</goal>
            </goals>
        </execution>
        <execution>
            <id>dokka-jar</id>
            <phase>package</phase>
            <goals>
                <goal>jar</goal>
            </goals>
            <configuration>
                <classifier>dokka</classifier>
                <classesDirectory>${project.build.directory}/dokka</classesDirectory>
                <skipIfEmpty>true</skipIfEmpty>
            </configuration>
        </execution>
    </executions>
</plugin>
```

ドキュメントとそれに対応する`.jar`アーカイブは、`dokka:dokka`と`jar:jar@dokka-jar`ゴールを実行することで生成されます。

```Bash
mvn dokka:dokka jar:jar@dokka-jar
```

> Maven Centralにライブラリを公開する場合、[javadoc.io](https://javadoc.io/)のようなサービスを利用して、
> ライブラリのAPIドキュメントを無料で、かつセットアップなしでホストできます。
> これは`javadoc.jar`から直接ドキュメントページを取得します。
> [この例](https://javadoc.io/doc/com.trib3/server/latest/index.html)で示されているように、HTMLフォーマットとうまく機能します。
>
{style="tip"}

## 設定例

Mavenのプラグイン設定ブロックはDokkaを設定するために使用できます。

以下は、ドキュメントの出力場所のみを変更する基本的な設定の例です。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <outputDir>${project.basedir}/target/documentation/dokka</outputDir>
    </configuration>
</plugin>
```

## 設定オプション

Dokkaには、あなたと読者のエクスペリエンスを調整するための多くの設定オプションがあります。

以下に、各設定セクションの例と詳細な説明を示します。ページの最下部には、[すべての設定オプション](#complete-configuration)が適用された例も記載されています。

### 一般的な設定

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PROTECTED</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <!-- Separate section -->
        </sourceLinks>
        <externalDocumentationLinks>
            <!-- Separate section -->
        </externalDocumentationLinks>
        <perPackageOptions>
            <!-- Separate section -->
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="skip">
        <p>ドキュメントの生成をスキップするかどうか。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="moduleName">
        <p>プロジェクト/モジュールを参照するために使用される表示名。目次、ナビゲーション、ログなどに使用されます。</p>
        <p>デフォルト: <code>{project.artifactId}</code></p>
    </def>
    <def title="outputDir">
        <p>フォーマットに関わらず、ドキュメントが生成されるディレクトリ。</p>
        <p>デフォルト: <code>{project.basedir}/target/dokka</code></p>
    </def>
    <def title="failOnWarning">
        <p>
            Dokkaが警告またはエラーを出力した場合に、ドキュメントの生成を失敗させるかどうか。
            プロセスは、すべてのエラーと警告が出力されるまで待機します。
        </p>
        <p>この設定は<code>reportUndocumented</code>と組み合わせるとうまく機能します。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>自明な関数を抑制するかどうか。</p>
        <p>
            以下の関数は自明であるとみなされます。</p>
            <list>
                <li>
                    <code>equals</code>、<code>hashCode</code>、<code>toString</code>のように、
                    <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code>、
                    または<code>java.lang.Enum</code>から継承された関数。
                </li>
                <li>
                    コンパイラによって生成され（合成された）、ドキュメントがない関数。
                    例: <code>dataClass.componentN</code>や<code>dataClass.copy</code>。
                </li>
            </list>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>特定のクラスで明示的にオーバーライドされていない継承メンバーを抑制するかどうか。</p>
        <p>
            注意: これにより<code>equals</code>/<code>hashCode</code>/<code>toString</code>のような関数を抑制できますが、
            <code>dataClass.componentN</code>や<code>dataClass.copy</code>のような合成関数は抑制できません。
            それには<code>suppressObviousFunctions</code>を使用してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="offlineMode">
        <p>ネットワーク経由でリモートファイル/リンクを解決するかどうか。</p>
        <p>
            これには、外部ドキュメントリンク生成に使用されるパッケージリストが含まれます。
            例えば、標準ライブラリのクラスをクリック可能にするためなどです。
        </p>
        <p>
            これを<code>true</code>に設定すると、特定のケースではビルド時間を大幅に短縮できますが、
            ドキュメントの品質やユーザーエクスペリエンスを低下させる可能性もあります。例えば、
            標準ライブラリを含む依存関係からのクラス/メンバーリンクを解決しないことなどです。
        </p>
        <p>
            注意: フェッチしたファイルをローカルにキャッシュし、それらをローカルパスとしてDokkaに提供できます。
            <code>externalDocumentationLinks</code>セクションを参照してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="sourceDirectories">
        <p>
            分析およびドキュメント化されるソースコードルート。
            受け入れられる入力は、ディレクトリおよび個々の<code>.kt</code> / <code>.java</code>ファイルです。
        </p>
        <p>デフォルト: <code>{project.compileSourceRoots}</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化すべき可視性修飾子のセット。</p>
        <p>
            これは、<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合や、
            <code>public</code>宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>パッケージごとに設定可能です。</p>
        <p>デフォルト: <code>PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターによってフィルターされた後、
            表示可能なドキュメント化されていない宣言（KDocsがない宣言）について警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と組み合わせるとうまく機能します。</p>
        <p>これはパッケージレベルで上書きできます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>で注釈付けされた宣言をドキュメント化するかどうか。</p>
        <p>これはパッケージレベルで上書きできます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            様々なフィルターが適用された後、表示可能な宣言を含まないパッケージをスキップするかどうか。
        </p>
        <p>
            例えば、<code>skipDeprecated</code>が<code>true</code>に設定されており、
            パッケージに非推奨の宣言のみが含まれている場合、そのパッケージは空であるとみなされます。
        </p>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="suppressedFiles">
        <p>
            抑制すべきディレクトリまたは個々のファイル。つまり、そこからの宣言はドキュメント化されません。
        </p>
    </def>
    <def title="jdkVersion">
        <p>Java型用の外部ドキュメントリンクを生成する際に使用するJDKバージョン。</p>
        <p>
            例えば、何らかのpublic宣言のシグネチャで<code>java.util.UUID</code>を使用しており、
            このオプションが<code>8</code>に設定されている場合、Dokkaはそれに対する
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a>への外部ドキュメントリンクを生成します。
        </p>
        <p>デフォルト: JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            分析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境を設定するために使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin言語バージョン</a>。
        </p>
        <p>デフォルトでは、Dokkaに組み込まれているコンパイラで利用可能な最新の言語バージョンが使用されます。</p>
    </def>
    <def title="apiVersion">
        <p>
            分析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境を設定するために使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin APIバージョン</a>。
        </p>
        <p>デフォルトでは、<code>languageVersion</code>から推測されます。</p>
    </def>
    <def title="noStdlibLink">
        <p>
            Kotlinの標準ライブラリのAPIリファレンスドキュメントに繋がる外部ドキュメントリンクを生成するかどうか。
        </p>
        <p>注意: <code>noStdLibLink</code>が<code>false</code>に設定されている場合、リンクは**生成されます**。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="noJdkLink">
    <anchor name="includes"/>
        <p>JDKのJavadocへの外部ドキュメントリンクを生成するかどうか。</p>
        <p>JDK Javadocのバージョンは<code>jdkVersion</code>オプションによって決定されます。</p>
        <p>注意: <code>noJdkLink</code>が<code>false</code>に設定されている場合、リンクは**生成されます**。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">モジュールおよびパッケージのドキュメント</a>を
            含むMarkdownファイルの一覧。
        </p>
        <p>指定されたファイルの内容は解析され、モジュールおよびパッケージの説明としてドキュメントに埋め込まれます。</p>
    </def>
    <def title="classpath">
        <p>分析およびインタラクティブなサンプル用のクラスパス。</p>
        <p>
            これは、依存関係から来るいくつかの型が自動的に解決/認識されない場合に役立ちます。
            このオプションは、<code>.jar</code>および<code>.klib</code>ファイルの両方を受け入れます。
        </p>
        <p>デフォルト: <code>{project.compileClasspathElements}</code></p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample KDocタグ</a>を介して参照される
            サンプル関数を含むディレクトリまたはファイルの一覧。
        </p>
    </def>
</deflist>

### ソースリンクの設定

`sourceLinks`設定ブロックを使用すると、各シグネチャに特定の行番号を含む`url`への`source`リンクを追加できます。（行番号は`lineSuffix`を設定することで構成可能です。）

これにより、読者は各宣言のソースコードを見つけることができます。

例として、`kotlinx.coroutines`の[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)関数のドキュメントを参照してください。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="path">
        <p>
            ローカルのソースディレクトリへのパス。パスは現在のモジュールのルートからの相対パスでなければなりません。
        </p>
        <p>
            注意: Unixベースのパスのみが許可されており、Windows形式のパスはエラーをスローします。
        </p>
    </def>
    <def title="url">
        <p>
            GitHub、GitLab、Bitbucketなど、ドキュメント読者がアクセスできるソースコードホスティングサービスのURL。
            このURLは宣言のソースコードリンクを生成するために使用されます。
        </p>
    </def>
    <def title="lineSuffix">
        <p>
            ソースコードの行番号をURLに追加するために使用されるサフィックス。
            これにより、読者はファイルだけでなく、宣言の特定の行番号にもナビゲートできます。
        </p>
        <p>
            番号自体は指定されたサフィックスに追加されます。例えば、このオプションが<code>#L</code>に設定され、
            行番号が10の場合、結果のURLサフィックスは<code>#L10</code>になります。
        </p>
        <p>
            一般的なサービスで使用されるサフィックス:</p>
            <list>
            <li>GitHub: <code>#L</code></li>
            <li>GitLab: <code>#L</code></li>
            <li>Bitbucket: <code>#lines-</code></li>
            </list>
    </def>
</deflist>

### 外部ドキュメントリンクの設定

`externalDocumentationLinks`ブロックを使用すると、依存関係の外部ホストされているドキュメントに繋がるリンクを作成できます。

例えば、`kotlinx.serialization`の型を使用している場合、デフォルトではそれらはドキュメントでクリックできない、あたかも未解決であるかのように表示されます。しかし、`kotlinx.serialization`のAPIリファレンスドキュメントはDokkaによってビルドされ、[kotlinlang.orgに公開されている](https://kotlinlang.org/api/kotlinx.serialization/)ため、それに対する外部ドキュメントリンクを設定できます。これによりDokkaがライブラリの型へのリンクを生成できるようになり、それらが正常に解決され、クリック可能になります。

デフォルトでは、Kotlin標準ライブラリおよびJDK用の外部ドキュメントリンクが設定されています。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/kotlinx.serialization/</url>
                <packageListUrl>file:/${project.basedir}/serialization.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="url">
        <p>リンク先のドキュメントのルートURL。末尾のスラッシュを**含める必要があります**。</p>
        <p>
            Dokkaは、与えられたURLの<code>package-list</code>を自動的に見つけ出し、
            宣言を相互にリンクするために最善を尽くします。
        </p>
        <p>
            自動解決が失敗した場合、または代わりにローカルキャッシュファイルを使用したい場合は、
            <code>packageListUrl</code>オプションの設定を検討してください。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code>の正確な場所。これはDokkaが自動的に解決することに依存する代替手段です。
        </p>
        <p>
            パッケージリストには、モジュール名やパッケージ名など、ドキュメントおよびプロジェクト自体に関する情報が含まれています。
        </p>
        <p>これはネットワーク呼び出しを避けるために、ローカルにキャッシュされたファイルでも構いません。</p>
    </def>
</deflist>

### パッケージオプション

`perPackageOptions`設定ブロックを使用すると、`matchingRegex`でマッチする特定のパッケージにいくつかのオプションを設定できます。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>パッケージを照合するために使用される正規表現。</p>
        <p>デフォルト: <code>.*</code></p>
 </def>
    <def title="suppress">
        <p>このパッケージをドキュメント生成時にスキップすべきかどうか。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化すべき可視性修飾子のセット。</p>
        <p>
            これは、このパッケージ内の<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合や、
            <code>public</code>宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>デフォルト: <code>PUBLIC</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>で注釈付けされた宣言をドキュメント化するかどうか。</p>
        <p>これはプロジェクト/モジュールレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターによってフィルターされた後、
            表示可能なドキュメント化されていない宣言（KDocsがない宣言）について警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と組み合わせるとうまく機能します。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
</deflist>

### 完全な設定

以下に、適用可能なすべての設定オプションを同時に示した例を示します。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PRIVATE</visibility>
            <visibility>PROTECTED</visibility>
            <visibility>INTERNAL</visibility>
            <visibility>PACKAGE</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/core/kotlin-stdlib/</url>
                <packageListUrl>file:/${project.basedir}/stdlib.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>