[//]: # (title: Maven)

Mavenベースのプロジェクトのドキュメントを生成するには、DokkaのMavenプラグインを使用できます。

> [DokkaのGradleプラグイン](dokka-gradle.md)と比較して、Mavenプラグインは基本的な機能のみを持ち、マルチモジュールビルドのサポートは提供しません。
> 
{style="note"}

Dokkaを試してMavenプロジェクト向けにどのように設定できるかを確認するには、[Mavenサンプル](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/maven)プロジェクトをご覧ください。

## Dokkaを適用する

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

Mavenプラグインによって次のゴールが提供されます。

| **ゴール**      | **説明**                                                                        |
|---------------|----------------------------------------------------------------------------------------|
| `dokka:dokka` | Dokkaプラグインが適用されたドキュメントを生成します。デフォルトで[HTML](dokka-html.md)形式です。 |

### 実験的機能

| **ゴール**           | **説明**                                                                             |
|--------------------|---------------------------------------------------------------------------------------------|
| `dokka:javadoc`    | [Javadoc](dokka-javadoc.md)形式でドキュメントを生成します。                                    |
| `dokka:javadocJar` | [Javadoc](dokka-javadoc.md)形式のドキュメントを含む`javadoc.jar`ファイルを生成します。 |

### その他の出力形式

デフォルトでは、DokkaのMavenプラグインは[HTML](dokka-html.md)出力形式でドキュメントをビルドします。

他のすべての出力形式は[Dokkaプラグイン](dokka-plugins.md)として実装されています。目的の形式でドキュメントを生成するには、Dokkaプラグインとして設定に追加する必要があります。

例えば、実験的な[GFM](dokka-markdown.md#gfm)形式を使用するには、`gfm-plugin`アーティファクトを追加する必要があります。

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

この設定で`dokka:dokka`ゴールを実行すると、GFM形式でドキュメントが生成されます。

Dokkaプラグインの詳細については、[Dokkaプラグイン](dokka-plugins.md)を参照してください。

## javadoc.jarのビルド

ライブラリをリポジトリに公開する場合、ライブラリのAPIリファレンスドキュメントを含む`javadoc.jar`ファイルを提供する必要があるかもしれません。

例えば、[Maven Central](https://central.sonatype.org/)に公開する場合、プロジェクトと一緒に`javadoc.jar`を提供[しなければなりません](https://central.sonatype.org/publish/requirements/)。ただし、すべてのリポジトリにそのルールがあるわけではありません。

[DokkaのGradleプラグイン](dokka-gradle.md#build-javadoc-jar)とは異なり、Mavenプラグインにはすぐに使える`dokka:javadocJar`ゴールが付属しています。デフォルトでは、`target`フォルダーに[Javadoc](dokka-javadoc.md)出力形式でドキュメントを生成します。

組み込みゴールに満足しない場合や、出力をカスタマイズしたい場合（例えば、Javadocではなく[HTML](dokka-html.md)形式でドキュメントを生成したい場合）は、次の設定でMaven JARプラグインを追加することで同様の動作を実現できます。

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

ドキュメントとそれに対応する`.jar`アーカイブは、`dokka:dokka`および`jar:jar@dokka-jar`ゴールを実行することで生成されます。

```Bash
mvn dokka:dokka jar:jar@dokka-jar
```

> ライブラリをMaven Centralに公開する場合、[javadoc.io](https://javadoc.io/)のようなサービスを利用すると、ライブラリのAPIドキュメントを無料で、セットアップなしでホストできます。これは`javadoc.jar`から直接ドキュメントページを取得します。[この例](https://javadoc.io/doc/com.trib3/server/latest/index.html)で示されているように、HTML形式でうまく動作します。
>
{style="tip"}

## 設定例

Mavenのプラグイン設定ブロックは、Dokkaの設定に使用できます。

これは、ドキュメントの出力場所のみを変更する基本的な設定の例です。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <outputDir>${project.basedir}/target/documentation/dokka</outputDir>
    </configuration>
</plugin>
```

## 設定オプション

Dokkaには、読者とあなたのエクスペリエンスを調整するための多くの設定オプションがあります。

以下に、各設定セクションの例と詳細な説明を示します。また、ページ下部には、[すべての設定オプション](#complete-configuration)が適用された例もあります。

### 一般設定

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
        <p>ドキュメント生成をスキップするかどうか。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="moduleName">
        <p>プロジェクト/モジュールを参照するために使用される表示名です。目次、ナビゲーション、ロギングなどに使用されます。</p>
        <p>デフォルト: <code>{project.artifactId}</code></p>
    </def>
    <def title="outputDir">
        <p>フォーマットに関係なく、ドキュメントが生成されるディレクトリです。</p>
        <p>デフォルト: <code>{project.basedir}/target/dokka</code></p>
    </def>
    <def title="failOnWarning">
        <p>
            Dokkaが警告またはエラーを発した場合に、ドキュメント生成を失敗させるかどうか。プロセスは、すべてのエラーと警告が最初に出力されるまで待機します。
        </p>
        <p>この設定は<code>reportUndocumented</code>と組み合わせてうまく機能します。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>明らかな関数を抑制するかどうか。</p>
        <p>
            関数は次の場合に明らかと見なされます。</p>
            <list>
                <li>
                    <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code>または
                    <code>java.lang.Enum</code>から継承されたもの（例: <code>equals</code>、<code>hashCode</code>、<code>toString</code>）。
                </li>
                <li>
                    合成されたもの（コンパイラによって生成されたもの）で、ドキュメントがないもの（例:
                    <code>dataClass.componentN</code>または<code>dataClass.copy</code>）。
                </li>
            </list>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>特定のクラスで明示的にオーバーライドされていない継承メンバーを抑制するかどうか。</p>
        <p>
            注意: これは<code>equals</code>/<code>hashCode</code>/<code>toString</code>のような関数を抑制できますが、
            <code>dataClass.componentN</code>や<code>dataClass.copy</code>のような合成関数は抑制できません。
            そのためには<code>suppressObviousFunctions</code>を使用してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="offlineMode">
        <p>ネットワーク経由でリモートファイル/リンクを解決するかどうか。</p>
        <p>
            これには、外部ドキュメントリンクを生成するために使用されるパッケージリストが含まれます。
            例えば、標準ライブラリのクラスをクリック可能にするためです。
        </p>
        <p>
            これを<code>true</code>に設定すると、特定のケースでビルド時間を大幅に短縮できますが、
            ドキュメントの品質とユーザーエクスペリエンスを悪化させる可能性もあります。例えば、
            標準ライブラリを含む依存関係からのクラス/メンバーリンクが解決されなくなるなどです。
        </p>
        <p>
            注意: 取得したファイルをローカルにキャッシュし、それらをDokkaにローカルパスとして提供することができます。
            <code>externalDocumentationLinks</code>セクションを参照してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="sourceDirectories">
        <p>
            分析およびドキュメント化されるソースコードルート。
            ディレクトリと個々の<code>.kt</code> / <code>.java</code>ファイルが入力として受け入れられます。
        </p>
        <p>デフォルト: <code>{project.compileSourceRoots}</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化されるべき可視性修飾子のセットです。</p>
        <p>
            これは、<code>protected</code>/<code>internal</code>/<code>private</code>な宣言をドキュメント化したい場合、
            または<code>public</code>な宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>パッケージごとに設定可能です。</p>
        <p>デフォルト: <code>PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターによってフィルタリングされた後、
            可視でKDocsのない宣言、つまり未ドキュメント化された宣言について警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と組み合わせてうまく機能します。</p>
        <p>これはパッケージレベルでオーバーライドできます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>でアノテーションされた宣言をドキュメント化するかどうか。</p>
        <p>これはパッケージレベルでオーバーライドできます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            さまざまなフィルターが適用された後、可視な宣言を含まないパッケージをスキップするかどうか。
        </p>
        <p>
            例えば、<code>skipDeprecated</code>が<code>true</code>に設定されており、パッケージに非推奨の宣言のみが
            含まれている場合、それは空であると見なされます。
        </p>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="suppressedFiles">
        <p>
            抑制されるべきディレクトリまたは個々のファイル。つまり、それらからの宣言はドキュメント化されません。
        </p>
    </def>
    <def title="jdkVersion">
        <p>Java型用の外部ドキュメントリンクを生成する際に使用するJDKバージョン。</p>
        <p>
            例えば、ある公開宣言のシグネチャで<code>java.util.UUID</code>を使用し、
            このオプションが<code>8</code>に設定されている場合、Dokkaはそれに対する
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a>への外部ドキュメントリンクを生成します。
        </p>
        <p>デフォルト: JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">分析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>環境の設定に使用されるKotlin言語バージョン</a>。
        </p>
        <p>デフォルトでは、Dokkaの組み込みコンパイラが利用可能な最新の言語バージョンが使用されます。</p>
    </def>
    <def title="apiVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">分析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>環境の設定に使用されるKotlin APIバージョン</a>。
        </p>
        <p>デフォルトでは、<code>languageVersion</code>から推論されます。</p>
    </def>
    <def title="noStdlibLink">
        <p>
            Kotlinの標準ライブラリのAPIリファレンスドキュメントへつながる外部ドキュメントリンクを生成するかどうか。
        </p>
        <p>注意: <code>noStdLibLink</code>が<code>false</code>に設定されている場合、リンクは<b>生成されます</b>。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="noJdkLink">
    <anchor name="includes"/>
        <p>JDKのJavadocへの外部ドキュメントリンクを生成するかどうか。</p>
        <p>JDK Javadocのバージョンは、<code>jdkVersion</code>オプションによって決定されます。</p>
        <p>注意: <code>noJdkLink</code>が<code>false</code>に設定されている場合、リンクは<b>生成されます</b>。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">モジュールおよびパッケージドキュメント</a>を含むMarkdownファイルのリスト。
        </p>
        <p>指定されたファイルの内容は解析され、モジュールおよびパッケージの説明としてドキュメントに埋め込まれます。</p>
    </def>
    <def title="classpath">
        <p>分析およびインタラクティブなサンプル用のクラスパス。</p>
        <p>
            これは、依存関係から来る一部の型が自動的に解決/認識されない場合に役立ちます。
            このオプションは<code>.jar</code>と<code>.klib</code>の両方のファイルを受け入れます。
        </p>
        <p>デフォルト: <code>{project.compileClasspathElements}</code></p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier"><code>@sample</code> KDocタグ</a>を介して参照されるサンプル関数を含むディレクトリまたはファイルのリスト。
        </p>
    </def>
</deflist>

### ソースリンク設定

`sourceLinks`設定ブロックを使用すると、特定の行番号を含む`url`へつながる`source`リンクを各シグネチャに追加できます（行番号は`lineSuffix`を設定することで構成可能です）。

これは読者が各宣言のソースコードを見つけるのに役立ちます。

例については、`kotlinx.coroutines`の[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)関数のドキュメントを参照してください。

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
            ローカルソースディレクトリへのパス。パスは現在のモジュールのルートからの相対パスである必要があります。
        </p>
        <p>
            注意: Unixベースのパスのみが許可されており、Windowsスタイルのパスはエラーをスローします。
        </p>
    </def>
    <def title="url">
        <p>
            ドキュメント読者がアクセスできるソースコードホスティングサービス（GitHub、GitLab、Bitbucketなど）のURL。
            このURLは、宣言のソースコードリンクを生成するために使用されます。
        </p>
    </def>
    <def title="lineSuffix">
        <p>
            ソースコードの行番号をURLに追加するために使用されるサフィックス。
            これは読者がファイルだけでなく、宣言の特定の行番号にも移動するのに役立ちます。
        </p>
        <p>
            番号自体は指定されたサフィックスに追加されます。例えば、このオプションが
            <code>#L</code>に設定され、行番号が10の場合、結果のURLサフィックスは<code>#L10</code>になります。
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

### 外部ドキュメントリンク設定

`externalDocumentationLinks`ブロックを使用すると、依存関係の外部ホストされているドキュメントへつながるリンクを作成できます。

例えば、`kotlinx.serialization`の型を使用している場合、デフォルトではドキュメント内で未解決であるかのようにクリックできません。しかし、`kotlinx.serialization`のAPIリファレンスドキュメントはDokkaによってビルドされ、[kotlinlang.orgで公開されている](https://kotlinlang.org/api/kotlinx.serialization/)ため、それに対して外部ドキュメントリンクを設定できます。これにより、Dokkaはライブラリの型へのリンクを生成し、それらを正常に解決してクリック可能にします。

デフォルトでは、Kotlin標準ライブラリおよびJDKの外部ドキュメントリンクは設定されています。

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
        <p>リンクするドキュメントのルートURL。末尾のスラッシュを<b>含める必要があります</b>。</p>
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
            <code>package-list</code>の正確な場所。これはDokkaが自動的に解決することに依存する代わりに選択できる方法です。
        </p>
        <p>
            パッケージリストには、モジュール名やパッケージ名など、ドキュメントとプロジェクト自体に関する情報が含まれています。
        </p>
        <p>これは、ネットワーク呼び出しを避けるためにローカルにキャッシュされたファイルでも構いません。</p>
    </def>
</deflist>

### パッケージオプション

`perPackageOptions`設定ブロックを使用すると、`matchingRegex`によって一致する特定のパッケージにいくつかのオプションを設定できます。

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
        <p>パッケージを一致させるために使用される正規表現。</p>
        <p>デフォルト: <code>.*</code></p>
 </def>
    <def title="suppress">
        <p>ドキュメント生成時にこのパッケージをスキップするかどうか。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化されるべき可視性修飾子のセット。</p>
        <p>
            これは、このパッケージ内の<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合、
            または<code>public</code>宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>デフォルト: <code>PUBLIC</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>でアノテーションされた宣言をドキュメント化するかどうか。</p>
        <p>これはプロジェクト/モジュールレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターによってフィルタリングされた後、
            可視でKDocsのない宣言、つまり未ドキュメント化された宣言について警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と組み合わせてうまく機能します。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
</deflist>

### 完全な設定

以下に、すべての可能な設定オプションが同時に適用されている例を示します。

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