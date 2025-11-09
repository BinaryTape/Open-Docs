[//]: # (title: Maven)

Mavenは、あらゆるJavaベースのプロジェクトをビルドおよび管理するために使用できるビルドシステムです。

## プラグインの構成と有効化

`kotlin-maven-plugin` はKotlinのソースとモジュールをコンパイルします。現在、Maven v3のみがサポートされています。

`pom.xml` ファイルで、使用したいKotlinのバージョンを `kotlin.version` プロパティに定義します。

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

`kotlin-maven-plugin` を有効にするには、`pom.xml` ファイルを更新します。

```xml
<plugins>
    <plugin>
        <artifactId>kotlin-maven-plugin</artifactId>
        <groupId>org.jetbrains.kotlin</groupId>
        <version>%kotlinVersion%</version>
    </plugin>
</plugins>
```

### JDK 17の使用

JDK 17を使用するには、`.mvn/jvm.config` ファイルに以下を追加します。

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## リポジトリの宣言

デフォルトでは、`mavenCentral` リポジトリはすべてのMavenプロジェクトで利用可能です。他のリポジトリ内のアーティファクトにアクセスするには、`<repositories>` 要素内で各リポジトリのIDとURLを指定します。

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> Gradleプロジェクトで`mavenLocal()`をリポジトリとして宣言すると、GradleプロジェクトとMavenプロジェクトを切り替える際に問題が発生する可能性があります。詳細については、[リポジトリの宣言](gradle-configure-project.md#declare-repositories)を参照してください。
>
{style="note"}

## 依存関係の設定

Kotlinには、アプリケーションで使用できる広範な標準ライブラリがあります。プロジェクトで標準ライブラリを使用するには、`pom.xml` ファイルに以下の依存関係を追加します。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> Kotlinのバージョンが以下のものより古い場合にJDK 7または8をターゲットとする場合：
> * 1.8より古い場合は、それぞれ `kotlin-stdlib-jdk7` または `kotlin-stdlib-jdk8` を使用します。
> * 1.2より古い場合は、それぞれ `kotlin-stdlib-jre7` または `kotlin-stdlib-jre8` を使用します。
>
{style="note"} 

プロジェクトが[Kotlinリフレクション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)またはテスト機能を使用する場合は、対応する依存関係も追加する必要があります。アーティファクトIDは、リフレクションライブラリには`kotlin-reflect`、テストライブラリには`kotlin-test`および`kotlin-test-junit`です。

## Kotlinのみのソースコードのコンパイル

ソースコードをコンパイルするには、`<build>` タグ内でソースディレクトリを指定します。

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

ソースをコンパイルするには、Kotlin Maven Pluginを参照する必要があります。

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>

            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>

                <execution>
                    <id>test-compile</id>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

Kotlin 1.8.20以降、上記の`<executions>`要素全体を`<extensions>true</extensions>`に置き換えることができます。エクステンションを有効にすると、`compile`、`test-compile`、`kapt`、`test-kapt` の各実行がビルドに自動的に追加され、それぞれの適切な[ライフサイクルフェーズ](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)にバインドされます。実行を構成する必要がある場合は、そのIDを指定する必要があります。これの例は次のセクションで確認できます。

> 複数のビルドプラグインがデフォルトのライフサイクルを上書きし、`extensions` オプションも有効にしている場合、`<build>` セクションの最後のプラグインがライフサイクル設定に関して優先されます。それ以前のライフサイクル設定への変更はすべて無視されます。
> 
{style="note"}

<!-- 以下のヘッダーはMariリンクサービスで使用されています。ここで変更する場合は、そちらのリンクも変更してください -->

## KotlinおよびJavaソースのコンパイル

KotlinとJavaのソースコードを含むプロジェクトをコンパイルするには、Javaコンパイラより前にKotlinコンパイラを呼び出します。Mavenの用語では、これは`kotlin-maven-plugin`が`maven-compiler-plugin`より先に実行されるべきであることを意味します。具体的には、`pom.xml` ファイルで `kotlin` プラグインが `maven-compiler-plugin` より前に来るように、以下の方法を使用します。

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions> <!-- このオプションを設定すると、ライフサイクルに関する情報が自動的に取得されます -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- プラグインのエクステンションを有効にしている場合、<goals>要素をスキップできます -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <goals> 
                        <goal>test-compile</goal> <!-- プラグインのエクステンションを有効にしている場合、<goals>要素をスキップできます -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.5.1</version>
            <executions>
                <!-- Mavenによって特別に扱われるdefault-compileを置き換える -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- Mavenによって特別に扱われるdefault-testCompileを置き換える -->
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>java-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>testCompile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## Kotlinコンパイラの実行戦略を構成する

_Kotlinコンパイラの実行戦略_は、Kotlinコンパイラがどこで実行されるかを定義します。利用可能な戦略は2つあります。

| 戦略                  | Kotlinコンパイラの実行場所 |
|-----------------------|----------------------------|
| Kotlinデーモン (デフォルト) | 自身のデーモンプロセス内       |
| インプロセス            | Mavenプロセス内            |

デフォルトでは、[Kotlinデーモン](kotlin-daemon.md)が使用されます。`pom.xml`ファイルで次のプロパティを設定することで、「インプロセス」戦略に切り替えることができます。

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

使用するコンパイラの実行戦略に関わらず、インクリメンタルコンパイルを明示的に構成する必要があります。

## インクリメンタルコンパイルの有効化

ビルドを高速化するには、`kotlin.compiler.incremental` プロパティを追加することでインクリメンタルコンパイルを有効にできます。

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

あるいは、`-Dkotlin.compiler.incremental=true` オプションを付けてビルドを実行します。

## アノテーション処理の構成

[`kapt` – Mavenでの使用](kapt.md#use-in-maven)を参照してください。

## JARファイルの作成

モジュールからのコードのみを含む小さなJARファイルを作成するには、Mavenの`pom.xml`ファイルの`build->plugins`の下に以下を含めます。ここで`main.class`はプロパティとして定義され、メインのKotlinまたはJavaクラスを指します。

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.6</version>
    <configuration>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>${main.class}</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

## 自己完結型JARファイルの作成

モジュールからのコードとその依存関係を含む自己完結型のJARファイルを作成するには、Mavenの`pom.xml`ファイルの`build->plugins`の下に以下を含めます。ここで`main.class`はプロパティとして定義され、メインのKotlinまたはJavaクラスを指します。

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>2.6</version>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals> <goal>single</goal> </goals>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>${main.class}</mainClass>
                    </manifest>
                </archive>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
        </execution>
    </executions>
</plugin>
```

この自己完結型のJARファイルは、アプリケーションを実行するためにJREに直接渡すことができます。

```bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## コンパイラオプションの指定

コンパイラ用の追加オプションと引数は、Mavenプラグインノードの`<configuration>`要素の下にタグとして指定できます。

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- ビルドへの実行の自動追加を有効にしたい場合 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- 警告を無効にする -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- JSR-305アノテーションの厳格モードを有効にする -->
            ...
        </args>
    </configuration>
</plugin>
```

多くのオプションは、プロパティを介して構成することもできます。

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

以下の属性がサポートされています。

### JVM固有の属性

| 名前              | プロパティ名                   | 説明                                                                                | 可能な値                                     | デフォルト値                |
|-------------------|---------------------------------|-------------------------------------------------------------------------------------|----------------------------------------------|-----------------------------|
| `nowarn`          |                                 | 警告を生成しない                                                                    | true, false                                  | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 指定されたKotlinバージョンとのソース互換性を提供します                               | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | 指定されたバージョンのバンドルされたライブラリからの宣言のみを使用できるようにします | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                 | コンパイルするソースファイルを含むディレクトリ                                      |                                              | プロジェクトのソースルート    |
| `compilerPlugins` |                                 | 有効なコンパイラプラグイン                                                          |                                              | []                          |
| `pluginOptions`   |                                 | コンパイラプラグインのオプション                                                    |                                              | []                          |
| `args`            |                                 | 追加のコンパイラ引数                                                                |                                              | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 生成されるJVMバイトコードのターゲットバージョン                                     | "1.8", "9", "10", ..., "24"                  | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | デフォルトのJAVA_HOMEの代わりに、指定された場所からカスタムJDKをクラスパスに含めます |                                              |                             |

## BOMの使用

Kotlinの[Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)を使用するには、[`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom)への依存関係を記述します。

```xml
<dependencyManagement>
    <dependencies>  
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-bom</artifactId>
            <version>%kotlinVersion%</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## ドキュメントの生成

標準のJavadoc生成プラグイン(`maven-javadoc-plugin`)はKotlinコードをサポートしていません。Kotlinプロジェクトのドキュメントを生成するには、[Dokka](https://github.com/Kotlin/dokka)を使用します。Dokkaは混在言語プロジェクトをサポートし、標準Javadocを含む複数の形式で出力を生成できます。MavenプロジェクトでDokkaを構成する方法の詳細については、[Maven](dokka-maven.md)を参照してください。

## OSGiサポートの有効化

[MavenプロジェクトでOSGiサポートを有効にする方法](kotlin-osgi.md#maven)を学びましょう。