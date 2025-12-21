[//]: # (title: Mavenプロジェクトのコンパイルとパッケージ化)

Mavenプロジェクトを設定して、KotlinのみのソースまたはKotlinとJavaが混在するソースをコンパイルし、Kotlinコンパイラを設定し、コンパイラオプションを指定し、アプリケーションをJARにパッケージ化できます。

## ソースコードのコンパイルを設定する

ソースコードが正しくコンパイルされるように、プロジェクト設定を調整してください。
Mavenプロジェクトは、[Kotlinのみのソース](#compile-kotlin-only-sources)または[KotlinとJavaのソース](#compile-kotlin-and-java-sources)の組み合わせをコンパイルするように設定できます。

### Kotlinのみのソースをコンパイルする

Kotlinソースコードをコンパイルするには：

1. `<build>`セクションでソースディレクトリを指定します：

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2. Kotlin Mavenプラグインが適用されていることを確認します：

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

上記の`<executions>`セクション全体を`<extensions>true</extensions>`に置き換えることができます。
拡張機能を有効にすると、`compile`、`test-compile`、`kapt`、`test-kapt`の各実行がビルドに自動的に追加され、それぞれの適切な[ライフサイクルフェーズ](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)にバインドされます。
実行を設定する必要がある場合は、そのIDを指定する必要があります。これの例は次のセクションにあります。

> 複数のビルドプラグインがデフォルトのライフサイクルを上書きし、`extensions`オプションも有効にしている場合、ライフサイクル設定に関しては`<build>`セクションの最後のプラグインが優先されます。それ以前のライフサイクル設定への変更はすべて無視されます。
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### KotlinとJavaのソースをコンパイルする

KotlinとJavaのソースファイルの両方を含むプロジェクトをコンパイルするには、KotlinコンパイラがJavaコンパイラの前に実行されることを確認してください。
Javaコンパイラは、Kotlinの宣言が`.class`ファイルにコンパイルされるまで認識できません。
JavaコードがKotlinクラスを使用している場合、`cannot find symbol`エラーを避けるために、それらのクラスは最初にコンパイルされる必要があります。

Mavenは主に以下の2つの要因に基づいてプラグインの実行順序を決定します：

* `pom.xml`ファイル内のプラグイン宣言の順序。
* `default-compile`や`default-testCompile`などの組み込みのデフォルト実行。これらは`pom.xml`ファイル内での位置に関わらず、常にユーザー定義の実行の前に実行されます。

実行順序を制御するには：

* `kotlin-maven-plugin`を`maven-compiler-plugin`の前に宣言します。
* Javaコンパイラプラグインのデフォルト実行を無効にします。
* コンパイルフェーズを明示的に制御するためのカスタム実行を追加します。

> Mavenの特別な`none`フェーズを使用して、デフォルト実行を無効にすることができます。
>
{style="note"}

`extensions`を使用すると、Kotlin/Java混在コンパイルの設定を簡素化できます。
これにより、Mavenコンパイラプラグインの設定をスキップできます：

<tabs group="kotlin-java-maven">
<tab title="extensionsを使用する場合" group-key="with-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
            <executions>
                <execution>
                    <id>default-compile</id>
                    <phase>compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- Ensure Kotlin code can reference Java code -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>default-test-compile</id>
                    <phase>test-compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <!-- No need to configure Maven compiler plugin with extensions -->
    </plugins>
</build>
```

プロジェクトに以前、Kotlinのみの設定があった場合、`<build>`セクションから以下の行も削除する必要があります：

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

これにより、`extensions`の設定で、KotlinコードがJavaコードを参照でき、その逆も可能であることが保証されます。

</tab>
<tab title="extensionsを使用しない場合" group-key="no-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>kotlin-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- Ensure Kotlin code can reference Java code -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>kotlin-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>test-compile</goal>
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

        <!-- Maven compiler plugin configuration -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.14.0</version>
            <executions>
                <!-- Disable default executions -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>

                <!-- Define custom executions -->
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

</tab>
</tabs>

この設定により、以下のことが保証されます：

* Kotlinコードが最初にコンパイルされます。
* JavaコードはKotlinの後にコンパイルされ、Kotlinクラスを参照できます。
* デフォルトのMavenの動作がプラグインの順序を上書きすることはありません。

Mavenがプラグインの実行をどのように処理するかについての詳細は、公式のMavenドキュメントにある[デフォルトのプラグイン実行IDのガイド](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)を参照してください。

## Kotlinコンパイラを設定する

### 実行戦略を選択する

_Kotlinコンパイラの実行戦略_は、Kotlinコンパイラがどこで実行されるかを定義します。利用可能な戦略は2つあります：

| 戦略                 | Kotlinコンパイラの実行場所 |
|----------------------|----------------------------|
| Kotlinデーモン (デフォルト) | 独自のデーモンプロセス内       |
| インプロセス           | Mavenプロセス内            |

デフォルトでは、[Kotlinデーモン](kotlin-daemon.md)が使用されます。`pom.xml`ファイルで次のプロパティを設定することにより、「インプロセス」戦略に切り替えることができます：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

使用するコンパイラの実行戦略に関わらず、明示的にインクリメンタルコンパイルを設定する必要があります。

### インクリメンタルコンパイルを有効にする

ビルドを高速化するために、`kotlin.compiler.incremental`プロパティを追加することでインクリメンタルコンパイルを有効にできます：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

または、`-Dkotlin.compiler.incremental=true`オプションを付けてビルドを実行します。

### コンパイラオプションを指定する

コンパイラ用の追加オプションと引数は、Mavenプラグインノードの`<configuration>`セクションで要素として指定できます：

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

オプションの多くはプロパティを通じて設定することもできます：

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

以下の属性がサポートされています：

#### JVM固有の属性

| 名前              | プロパティ名                  | 説明                                                                     | 可能な値                                      | デフォルト値               |
|-------------------|-------------------------------|--------------------------------------------------------------------------|-----------------------------------------------|-----------------------------|
| `nowarn`          |                               | 警告を生成しない                                                         | true, false                                   | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 指定されたKotlinバージョンとのソース互換性を提供します                   | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | バンドルされているライブラリの指定されたバージョンからの宣言のみを使用できるようにします | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                               | コンパイルするソースファイルを含むディレクトリ                         |                                               | プロジェクトのソースルート  |
| `compilerPlugins` |                               | 有効なコンパイラプラグイン                                               |                                               | []                          |
| `pluginOptions`   |                               | コンパイラプラグインのオプション                                         |                                               | []                          |
| `args`            |                               | 追加のコンパイラ引数                                                     |                                               | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`   | 生成されるJVMバイトコードのターゲットバージョン                          | "1.8", "9", "10", ..., "25"                 | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`     | デフォルトのJAVA_HOMEの代わりに、指定された場所からカスタムJDKをクラスパスに含めます |                                               |                             |

## プロジェクトをパッケージ化する

### JARファイルを作成する

モジュールからのコードのみを含む小さなJARファイルを作成するには、`main.class`がプロパティとして定義され、メインのKotlinまたはJavaクラスを指しているMaven `pom.xml`ファイル内の`<build><plugins>`の下に以下を含めます：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.5.0</version>
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

### 自己完結型JARファイルを作成する

モジュールからのコードとその依存関係を含む自己完結型JARファイルを作成するには、`main.class`がプロパティとして定義され、メインのKotlinまたはJavaクラスを指しているMaven `pom.xml`ファイル内の`<build><plugins>`の下に以下を含めます：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.8.0</version>
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

この自己完結型JARファイルは、アプリケーションを実行するためにJREに直接渡すことができます：

```bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar