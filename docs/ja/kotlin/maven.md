[//]: # (title: Maven)

Maven は、あらゆる Java ベースのプロジェクトをビルドおよび管理するために使用できるビルドシステムです。

## プラグインの構成と有効化

`kotlin-maven-plugin` は Kotlin のソースとモジュールをコンパイルします。現在、Maven v3 のみがサポートされています。

`pom.xml` ファイルで、使用したい Kotlin のバージョンを `kotlin.version` プロパティに定義します。

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

JDK 17 を使用するには、`.mvn/jvm.config` ファイルに以下を追加します。

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## リポジトリの宣言

デフォルトでは、`mavenCentral` リポジトリはすべての Maven プロジェクトで利用可能です。他のリポジトリのアーティファクトにアクセスするには、`<repositories>` 要素で各リポジトリの ID と URL を指定します。

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> Gradle プロジェクトで `mavenLocal()` をリポジトリとして宣言すると、Gradle プロジェクトと Maven プロジェクトを切り替える際に問題が発生する可能性があります。詳細については、[リポジトリの宣言](gradle-configure-project.md#declare-repositories)を参照してください。
>
{style="note"}

## 依存関係の設定

Kotlin には、アプリケーションで使用できる豊富な標準ライブラリがあります。プロジェクトで標準ライブラリを使用するには、以下の依存関係を `pom.xml` ファイルに追加します。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> Kotlin のバージョンが以下のものより古い場合、JDK 7 または 8 をターゲットにしている場合：
> * 1.8 より古い場合は、それぞれ `kotlin-stdlib-jdk7` または `kotlin-stdlib-jdk8` を使用します。
> * 1.2 より古い場合は、それぞれ `kotlin-stdlib-jre7` または `kotlin-stdlib-jre8` を使用します。
>
{style="note"}

プロジェクトが [Kotlin リフレクション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)またはテスト機能を使用する場合、対応する依存関係も追加する必要があります。リフレクションライブラリのアーティファクト ID は `kotlin-reflect` で、テストライブラリのアーティファクト ID は `kotlin-test` と `kotlin-test-junit` です。

## Kotlinのみのソースコードのコンパイル

ソースコードをコンパイルするには、`<build>` タグでソースディレクトリを指定します。

```xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

ソースをコンパイルするには、Kotlin Maven Plugin を参照する必要があります。

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

Kotlin 1.8.20 以降では、上記の `<executions>` 要素全体を `<extensions>true</extensions>` で置き換えることができます。拡張機能を有効にすると、`compile`、`test-compile`、`kapt`、`test-kapt` の各実行がビルドに自動的に追加され、それぞれの適切な[ライフサイクルフェーズ](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)にバインドされます。実行を構成する必要がある場合は、その ID を指定する必要があります。この例は次のセクションにあります。

> 複数のビルドプラグインがデフォルトのライフサイクルを上書きし、`extensions` オプションも有効にしている場合、`<build>` セクションの最後のプラグインがライフサイクル設定に関して優先されます。以前のライフサイクル設定への変更はすべて無視されます。
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## KotlinとJavaのソースのコンパイル

Kotlin と Java のソースコードを含むプロジェクトをコンパイルするには、Java コンパイラの前に Kotlin コンパイラを呼び出します。Maven の用語では、これは `kotlin-maven-plugin` が `maven-compiler-plugin` の前に実行されるべきであることを意味します。以下の方法で、`pom.xml` ファイル内で `kotlin` プラグインが `maven-compiler-plugin` の前に来るようにします。

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions> <!-- ライフサイクルに関する情報を自動的に取得するようにこのオプションを設定できます -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- プラグインの拡張機能を有効にする場合、<goals>要素を省略できます -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <goals>
                        <goal>test-compile</goal> <!-- プラグインの拡張機能を有効にする場合、<goals>要素を省略できます -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/test/java</sourceDir>
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
                <!-- Mavenで特別に扱われるためdefault-compileを置き換える -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- Mavenで特別に扱われるためdefault-testCompileを置き換える -->
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

## インクリメンタルコンパイルの有効化

ビルドを高速化するには、`kotlin.compiler.incremental` プロパティを追加することでインクリメンタルコンパイルを有効にすることができます。

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

または、`-Dkotlin.compiler.incremental=true` オプションを付けてビルドを実行します。

## アノテーション処理の構成

[`kapt` – Mavenでの使用](kapt.md#use-in-maven)を参照してください。

## JARファイルの作成

モジュールのコードのみを含む小さな JAR ファイルを作成するには、Maven の `pom.xml` ファイルの `build->plugins` に以下を含めます。ここで `main.class` はプロパティとして定義され、メインの Kotlin または Java クラスを指します。

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

モジュールのコードとその依存関係を含む自己完結型 JAR ファイルを作成するには、Maven の `pom.xml` ファイルの `build->plugins` に以下を含めます。ここで `main.class` はプロパティとして定義され、メインの Kotlin または Java クラスを指します。

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

この自己完結型 JAR ファイルは、アプリケーションを実行するために JRE に直接渡すことができます。

```bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## コンパイラオプションの指定

コンパイラ用の追加オプションと引数は、Maven プラグインノードの `<configuration>` 要素下のタグとして指定できます。

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- ビルドに実行を自動的に追加したい場合 -->
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

オプションの多くは、プロパティを通じて構成することもできます。

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

以下の属性がサポートされています。

### JVM固有の属性

| 名前              | プロパティ名                   | 説明                                                                                          | 使用可能な値                                 | デフォルト値                |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------------------------|
| `nowarn`          |                                 | 警告を生成しない                                                                                 | true, false                                      | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 指定されたKotlinのバージョンとのソース互換性を提供します                                    | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | 指定されたバージョンのバンドルライブラリからの宣言のみを許可します                        | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                 | コンパイルするソースファイルを含むディレクトリ                                               |                                                  | プロジェクトのソースルート    |
| `compilerPlugins` |                                 | 有効なコンパイラプラグイン                                                                             |                                                  | []                          |
| `pluginOptions`   |                                 | コンパイラプラグインのオプション                                                                         |                                                  | []                          |
| `args`            |                                 | 追加のコンパイラ引数                                                                        |                                                  | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 生成されるJVMバイトコードのターゲットバージョン                                                         | "1.8", "9", "10", ..., "23"                      | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | デフォルトのJAVA_HOMEの代わりに、指定された場所からカスタムJDKをクラスパスに含めます |                                                  |                             |

## BOMの使用

Kotlin の [Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms) を使用するには、[`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) への依存関係を記述します。

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

標準の Javadoc 生成プラグイン (`maven-javadoc-plugin`) は Kotlin コードをサポートしていません。Kotlin プロジェクトのドキュメントを生成するには、[Dokka](https://github.com/Kotlin/dokka) を使用します。Dokka は多言語プロジェクトをサポートし、標準 Javadoc を含む複数の形式で出力を生成できます。Maven プロジェクトで Dokka を構成する方法の詳細については、[Maven](dokka-maven.md) を参照してください。

## OSGiサポートの有効化

[Maven プロジェクトで OSGi サポートを有効にする方法](kotlin-osgi.md#maven)を学びましょう。