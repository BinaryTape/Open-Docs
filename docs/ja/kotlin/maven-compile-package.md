[//]: # (title: Mavenプロジェクトのコンパイルとパッケージング)

Mavenプロジェクトをセットアップして、Kotlinのみ、またはKotlinとJavaが混在したソースをコンパイルしたり、Kotlinコンパイラーを設定したり、コンパイラーオプションを指定したり、アプリケーションをJAR形式でパッケージ化したりできます。

## ソースコードコンパイルの設定

ソースコードが正しくコンパイルされるようにするには、プロジェクト設定を調整します。
Mavenプロジェクトは、[Kotlinのみのソース](#kotlinのみのソースをコンパイルする)または[KotlinとJavaのソース](#kotlinとjavaのソースをコンパイルする)の組み合わせをコンパイルするようにセットアップできます。

### Kotlinのみのソースをコンパイルする

Kotlinソースコードをコンパイルするには：

1. `<build>`セクションでソースディレクトリを指定します。

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2. Kotlin Mavenプラグインが適用されていることを確認します。

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
拡張（extensions）を有効にすると、`compile`、`test-compile`、`kapt`、および`test-kapt`の各実行（executions）がビルドに自動的に追加され、適切な[ライフサイクルフェーズ](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)にバインドされます。
実行の設定が必要な場合は、そのIDを指定する必要があります。これの例は次のセクションで確認できます。

> 複数のビルドプラグインがデフォルトのライフサイクルを上書きしており、かつ`extensions`オプションを有効にしている場合、`<build>`セクション内の最後のプラグインがライフサイクル設定において優先されます。それ以前のライフサイクル設定への変更はすべて無視されます。
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### KotlinとJavaのソースをコンパイルする

KotlinとJavaの両方のソースファイルが含まれるプロジェクトをコンパイルするには、Javaコンパイラーの前にKotlinコンパイラーが実行されるようにしてください。
Javaコンパイラーは、Kotlinの宣言が`.class`ファイルにコンパイルされるまで、それらを参照することができません。
JavaコードがKotlinクラスを使用する場合、`cannot find symbol`エラーを避けるために、それらのクラスを先にコンパイルする必要があります。

Mavenは、主に次の2つの要因に基づいてプラグインの実行順序を決定します：

* `pom.xml`ファイル内でのプラグイン宣言の順序。
* `default-compile`や`default-testCompile`などの組み込みのデフォルト実行。これらは、`pom.xml`ファイル内での位置に関係なく、常にユーザー定義の実行よりも前に実行されます。

実行順序を制御するには：

* `kotlin-maven-plugin`を`maven-compiler-plugin`より前に宣言します。
* Javaコンパイラープラグインのデフォルト実行を無効にします。
* カスタム実行を追加して、コンパイルフェーズを明示的に制御します。

> デフォルトの実行を無効にするには、Mavenの特別な`none`フェーズを使用できます。
>
{style="note"}

`extensions`を使用すると、Kotlin/Java混在コンパイルの設定を簡略化できます。
これにより、Mavenコンパイラープラグインの設定を省略できます：

<tabs group="kotlin-java-maven">
<tab title="拡張あり" group-key="with-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlinコンパイラープラグインの設定 -->
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
                            <!-- KotlinコードがJavaコードを参照できるようにする -->
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
        <!-- 拡張を使用する場合、Mavenコンパイラープラグインの設定は不要 -->
    </plugins>
</build>
```

プロジェクトに以前Kotlinのみの設定があった場合は、`<build>`セクションから以下の行も削除する必要があります：

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

これにより、`extensions`セットアップを使用して、KotlinコードがJavaコードを参照でき、その逆も可能になります。

</tab>
<tab title="拡張なし" group-key="no-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlinコンパイラープラグインの設定 -->
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
                            <!-- KotlinコードがJavaコードを参照できるようにする -->
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

        <!-- Mavenコンパイラープラグインの設定 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.14.0</version>
            <executions>
                <!-- デフォルトの実行を無効化 -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>

                <!-- カスタム実行を定義 -->
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

この設定により、以下が保証されます：

* Kotlinコードが最初にコンパイルされる。
* JavaコードはKotlinの後にコンパイルされ、Kotlinクラスを参照できる。
* Mavenのデフォルトの動作がプラグインの順序を上書きしない。

Mavenがプラグインの実行を処理する方法の詳細については、Maven公式ドキュメントの[Guide to default plugin execution IDs](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)を参照してください。

## Kotlinコンパイラーの設定

### 実行戦略の選択

*Kotlinコンパイラー実行戦略*は、Kotlinコンパイラーがどこで実行されるかを定義します。利用可能な戦略は2つあります：

| 戦略 | Kotlinコンパイラーの実行場所 |
|-------------------------|---------------------------------------|
| Kotlinデーモン（デフォルト） | 独自のデーモンプロセス内 |
| インプロセス (In process) | Mavenプロセス内 |

デフォルトでは、[Kotlinデーモン](kotlin-daemon.md)が使用されます。`pom.xml`ファイルで以下のプロパティを設定することで、"インプロセス"戦略に切り替えることができます：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

使用するコンパイラー実行戦略に関係なく、インクリメンタルコンパイルは明示的に設定する必要があります。

### インクリメンタルコンパイルの有効化

ビルドを高速化するために、`kotlin.compiler.incremental`プロパティを追加してインクリメンタルコンパイルを有効にできます：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

あるいは、`-Dkotlin.compiler.incremental=true`オプションを付けてビルドを実行します。

### コンパイラーオプションの指定

コンパイラーの追加オプションや引数は、Mavenプラグインノードの`<configuration>`セクションの要素として指定できます：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- ビルドへの実行の自動追加を有効にしたい場合 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- 警告を無効化 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- JSR-305アノテーションの厳密モードを有効化 -->
            ...
        </args>
    </configuration>
</plugin>
```

多くのオプションはプロパティを通じても設定可能です：

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

以下の属性がサポートされています：

#### JVM固有の属性

| 名前 | プロパティ名 | 説明 | 指定可能な値 | デフォルト値 |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------|
| `nowarn` | | 警告を生成しない | true, false | false |
| `languageVersion` | kotlin.compiler.languageVersion | 指定されたバージョンのKotlinとのソース互換性を提供 | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (実験的) | |
| `apiVersion` | kotlin.compiler.apiVersion | バンドルされたライブラリの指定されたバージョンからの宣言のみを使用できるようにする | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (実験的) | |
| `sourceDirs` | | コンパイルするソースファイルを含むディレクトリ | | プロジェクトのソースルート |
| `compilerPlugins` | | 有効化されたコンパイラープラグイン | | [] |
| `pluginOptions` | | コンパイラープラグインのオプション | | [] |
| `args` | | 追加のコンパイラー引数 | | [] |
| `jvmTarget` | `kotlin.compiler.jvmTarget` | 生成されるJVMバイトコードのターゲットバージョン | "1.8", "9", "10", ..., "25" | "%defaultJvmTargetVersion%" |
| `jdkHome` | `kotlin.compiler.jdkHome` | デフォルトのJAVA_HOMEの代わりに、指定された場所にあるカスタムJDKをクラスパスに含める | | |

## プロジェクトのパッケージング

### JARファイルの作成

モジュールのコードのみを含む小さなJARファイルを作成するには、Mavenの`pom.xml`ファイルの`<build><plugins>`の下に以下を含めます。ここで`main.class`はプロパティとして定義され、メインのKotlinまたはJavaクラスを指します。

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

### 自己完結型JARファイルの作成

モジュールのコードとその依存関係を含む、自己完結型のJARファイルを作成するには、Mavenの`pom.xml`ファイルの`<build><plugins>`の下に以下を含めます。ここで`main.class`はプロパティとして定義され、メインのKotlinまたはJavaクラスを指します。

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

この自己完結型JARファイルは、JREに直接渡してアプリケーションを実行できます：

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar