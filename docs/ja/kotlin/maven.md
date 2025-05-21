---
title: Maven
---
Mavenは、Javaベースのプロジェクトをビルドおよび管理するために使用できるビルドシステムです。

## プラグインの構成と有効化

`kotlin-maven-plugin`はKotlinのソースとモジュールをコンパイルします。 現在、Maven v3のみがサポートされています。

`pom.xml`ファイルで、使用するKotlinのバージョンを`kotlin.version`プロパティに定義します。

```xml
<properties>
    <kotlin.version>2.1.20</kotlin.version>
</properties>
```

`kotlin-maven-plugin`を有効にするには、`pom.xml`ファイルを更新します。

```xml
<plugins>
<plugin>
        <artifactId>kotlin-maven-plugin</artifactId>
        <groupId>org.jetbrains.kotlin</groupId>
        <version>2.1.20</version>
    </plugin>
</plugins>
```

### JDK 17の使用

JDK 17を使用するには、`.mvn/jvm.config`ファイルに以下を追加します。

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## リポジトリの宣言

デフォルトでは、`mavenCentral`リポジトリはすべてのMavenプロジェクトで使用できます。 他のリポジトリのアーティファクトにアクセスするには、
`<repositories>`要素で各リポジトリのIDとURLを指定します。

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

:::note
Gradleプロジェクトで`mavenLocal()`をリポジトリとして宣言すると、GradleプロジェクトとMavenプロジェクトを切り替えるときに問題が発生する可能性があります。 詳細については、[リポジトリの宣言](gradle-configure-project#declare-repositories)を参照してください。

:::

## 依存関係の設定

Kotlinには、アプリケーションで使用できる広範な標準ライブラリがあります。
プロジェクトで標準ライブラリを使用するには、次の依存関係を`pom.xml`ファイルに追加します。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

:::note
Kotlinのバージョンが以下より古い状態でJDK 7または8をターゲットにしている場合は、
* 1.8の場合は、`kotlin-stdlib-jdk7`または`kotlin-stdlib-jdk8`をそれぞれ使用します。
* 1.2の場合は、`kotlin-stdlib-jre7`または`kotlin-stdlib-jre8`をそれぞれ使用します。

::: 

プロジェクトで[Kotlinリフレクション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)
またはテスト機能を使用する場合は、対応する依存関係も追加する必要があります。
アーティファクトIDは、リフレクションライブラリの場合は`kotlin-reflect`、テストライブラリの場合は`kotlin-test`および`kotlin-test-junit`です。

## Kotlinのみのソースコードのコンパイル

ソースコードをコンパイルするには、`<build>`タグでソースディレクトリを指定します。

```xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
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

Kotlin 1.8.20以降では、上記の`<executions>`要素全体を`<extensions>true</extensions>`に置き換えることができます。
拡張機能を有効にすると、`compile`、`test-compile`、`kapt`、および`test-kapt`の実行がビルドに自動的に追加され、適切な[ライフサイクルフェーズ](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)にバインドされます。
実行を構成する必要がある場合は、そのIDを指定する必要があります。 この例については、次のセクションを参照してください。

:::note
複数のビルドプラグインがデフォルトのライフサイクルを上書きし、`extensions`オプションも有効にしている場合、
`<build>`セクションの最後のプラグインがライフサイクル設定に関して優先されます。 ライフサイクル設定に対するそれ以前の変更はすべて無視されます。

:::

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## KotlinとJavaのソースのコンパイル

KotlinとJavaのソースコードを含むプロジェクトをコンパイルするには、Javaコンパイラーの前にKotlinコンパイラーを呼び出します。
Mavenの用語では、`kotlin-maven-plugin`が`maven-compiler-plugin`の前に実行されるようにすることを意味します。これを行うには、次のメソッドを使用し、
`pom.xml`ファイルで`kotlin`プラグインが`maven-compiler-plugin`より前にあることを確認します。

```xml
<build>
<plugins>
<plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions> <!-- You can set this option 
            to automatically take information about lifecycles -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- You can skip the <goals> element 
                        if you enable extensions for the plugin -->
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
                        <goal>test-compile</goal> <!-- You can skip the <goals> element 
                    if you enable extensions for the plugin -->
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
                <!-- Replacing default-compile as it is treated specially by Maven -->
                <execution>
                    <id>default-compile</id>
<phase>none</phase>
                </execution>
                <!-- Replacing default-testCompile as it is treated specially by Maven -->
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

ビルドを高速化するために、`kotlin.compiler.incremental`プロパティを追加してインクリメンタルコンパイルを有効にできます。

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

または、`-Dkotlin.compiler.incremental=true`オプションを指定してビルドを実行します。

## アノテーション処理の構成

[`kapt` – Mavenでの使用](kapt#use-in-maven)を参照してください。

## JARファイルの作成

モジュールのコードのみを含む小さなJARファイルを作成するには、Mavenの`pom.xml`ファイルの`build->plugins`に以下を含めます。ここで、`main.class`はプロパティとして定義され、メインのKotlinまたはJavaクラスを指します。

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

## 自己完結型のJARファイルの作成

モジュールのコードとその依存関係を含む自己完結型のJARファイルを作成するには、Mavenの`pom.xml`ファイルの`build->plugins`に以下を含めます。ここで、`main.class`はプロパティとして定義され、
メインのKotlinまたはJavaクラスを指します。

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

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## コンパイラーオプションの指定

コンパイラーの追加のオプションと引数は、Mavenプラグインノードの`<configuration>`要素のタグとして指定できます。

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- If you want to enable automatic addition of executions to your build -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- Disable warnings -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- Enable strict mode for JSR-305 annotations -->
            ...
        </args>
    </configuration>
</plugin>
```

オプションの多くは、プロパティを介して構成することもできます。

```xml
<project ...>
<properties>
        <kotlin.compiler.languageVersion>2.1</kotlin.compiler.languageVersion>
    </properties>
</project>
```

次の属性がサポートされています。

### JVMに固有の属性

| Name              | Property name                   | Description                                                                                          | Possible values                                  | Default value               |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------------------------|
| `nowarn`          |                                 | 警告を生成しない                                                                                     | true, false                                      | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 指定されたバージョンのKotlinとのソース互換性を提供する                                                  | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | バンドルされたライブラリの指定されたバージョンからの宣言のみを使用できるようにする                            | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                 | コンパイルするソースファイルを含むディレクトリ                                                             |                                                  | プロジェクトのソースルート    |
| `compilerPlugins` |                                 | 有効なコンパイラープラグイン                                                                              |                                                  | []                          |
| `pluginOptions`   |                                 | コンパイラープラグインのオプション                                                                          |                                                  | []                          |
| `args`            |                                 | 追加のコンパイラー引数                                                                                  |                                                  | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 生成されたJVMバイトコードのターゲットバージョン                                                           | "1.8", "9", "10", ..., "23"                      | "1.8" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | デフォルトのJAVA_HOMEの代わりに、指定された場所からカスタムJDKをクラスパスに含めます                               |                                                  |                             |

## BOMの使用

Kotlinの[Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)を使用するには、
[`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom)への依存関係を記述します。

```xml
<dependencyManagement>
    <dependencies>  
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-bom</artifactId>
            <version>2.1.20</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## ドキュメントの生成

標準のJavadoc生成プラグイン（`maven-javadoc-plugin`）はKotlinコードをサポートしていません。 Kotlinプロジェクトのドキュメントを生成するには、[Dokka](https://github.com/Kotlin/dokka)を使用します。 Dokkaは、混合言語プロジェクトをサポートし、標準のJavadocを含む複数の形式で出力を生成できます。 MavenプロジェクトでDokkaを構成する方法の詳細については、[Maven](dokka-maven)を参照してください。

## OSGiサポートの有効化

[MavenプロジェクトでOSGiサポートを有効にする方法を学びます](kotlin-osgi#maven)。