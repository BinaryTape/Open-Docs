[//]: # (title: Ant)

> Kotlin 2.2.0以降、KotlinにおけるAntビルドシステムのサポートは非推奨となります。
> Kotlin 2.3.0ではAntサポートを削除する予定です。
>
> しかし、もしAntの外部メンテナーになることにご興味がある場合は、
> [こちらのYouTrack課題](https://youtrack.jetbrains.com/issue/KT-75875/)にコメントを残してください。
>
{style="warning"}

## Antタスクの取得

KotlinはAnt用に3つのタスクを提供します。

*   `kotlinc`: JVMをターゲットとするKotlinコンパイラー
*   `kotlin2js`: JavaScriptをターゲットとするKotlinコンパイラー
*   `withKotlin`: 標準の*javac* Antタスクを使用する際にKotlinファイルをコンパイルするためのタスク

これらのタスクは、[Kotlinコンパイラー](%kotlinLatestUrl%)アーカイブの`lib`フォルダーにある*kotlin-ant.jar*ライブラリで定義されています。Antバージョン1.8.2以降が必要です。

## KotlinソースのみでJVMをターゲットにする

プロジェクトがKotlinソースコードのみで構成されている場合、プロジェクトをコンパイルする最も簡単な方法は`kotlinc`タスクを使用することです。

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

ここで、`${kotlin.lib}`はKotlinスタンドアロンコンパイラーが解凍されたフォルダーを指します。

## 複数のルートを持つKotlinソースのみでJVMをターゲットにする

プロジェクトが複数のソースルートで構成されている場合、パスを定義するために`src`を要素として使用します。

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc output="hello.jar">
            <src path="root1"/>
            <src path="root2"/>
        </kotlinc>
    </target>
</project>
```

## KotlinとJavaソースでJVMをターゲットにする

プロジェクトがKotlinとJavaの両方のソースコードで構成されている場合、`kotlinc`を使用することも可能ですが、タスクパラメーターの繰り返しを避けるため、`withKotlin`タスクの使用を推奨します。

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <delete dir="classes" failonerror="false"/>
        <mkdir dir="classes"/>
        <javac destdir="classes" includeAntRuntime="false" srcdir="src">
            <withKotlin/>
        </javac>
        <jar destfile="hello.jar">
            <fileset dir="classes"/>
        </jar>
    </target>
</project>
```

また、コンパイルされるモジュールの名前を`moduleName`属性として指定することもできます。

```xml
<withKotlin moduleName="myModule"/>
```

## 単一ソースフォルダーでJavaScriptをターゲットにする

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## Prefix、PostFix、およびsourcemapオプションでJavaScriptをターゲットにする

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 単一ソースフォルダーとmetaInfoオプションでJavaScriptをターゲットにする

`metaInfo`オプションは、翻訳結果をKotlin/JavaScriptライブラリとして配布したい場合に有用です。
`metaInfo`が`true`に設定されている場合、コンパイル中にバイナリメタデータを含む追加のJSファイルが作成されます。このファイルは翻訳結果と一緒に配布する必要があります。

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js will be created, which contains binary metadata -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## リファレンス

要素と属性の完全なリストを以下に示します。

### kotlincとkotlin2jsに共通の属性

| Name | 説明                                                                    | 必須 | デフォルト値 |
|------|-------------------------------------------------------------------------|------|-------------|
| `src`  | コンパイルするKotlinソースファイルまたはディレクトリ                  | Yes  |             |
| `nowarn` | すべてのコンパイル警告を抑制する                                        | No   | false       |
| `noStdlib` | Kotlin標準ライブラリをクラスパスに含めない                                | No   | false       |
| `failOnError` | コンパイル中にエラーが検出された場合、ビルドを失敗させる                 | No   | true        |

### kotlincの属性

| Name | 説明                                                                                 | 必須 | デフォルト値                                    |
|------|--------------------------------------------------------------------------------------|------|-------------------------------------------------|
| `output`  | 出力先ディレクトリまたは.jarファイル名                                           | Yes  |                                                 |
| `classpath`  | コンパイルクラスパス                                                                 | No   |                                                 |
| `classpathref`  | コンパイルクラスパス参照                                                             | No   |                                                 |
| `includeRuntime`  | `output`が.jarファイルの場合、Kotlinランタイムライブラリをjarに含めるかどうか | No   | true                                            |
| `moduleName` | コンパイルされるモジュールの名前                                                     | No   | ターゲットの名前（指定されている場合）またはプロジェクト |

### kotlin2jsの属性

| Name | 説明                                                     | 必須 |
|------|----------------------------------------------------------|------|
| `output`  | 出力先ファイル                                           | Yes  |
| `libraries`  | Kotlinライブラリへのパス                                 | No   |
| `outputPrefix`  | 生成されるJavaScriptファイルに使用するプレフィックス | No   |
| `outputSuffix` | 生成されるJavaScriptファイルに使用するサフィックス | No   |
| `sourcemap`  | ソースマップファイルを生成するかどうか                   | No   |
| `metaInfo`  | バイナリディスクリプターを持つメタデータファイルを生成するかどうか | No   |
| `main`  | コンパイラーが生成したコードがmain関数を呼び出すべきか | No   |

### 生のコンパイラー引数を渡す

カスタムの生のコンパイラー引数を渡すには、`value`または`line`属性とともに`<compilerarg>`要素を使用できます。
これは、`<kotlinc>`、`<kotlin2js>`、および`<withKotlin>`タスク要素内で実行できます。

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

使用できる引数の完全なリストは、`kotlinc -help`を実行すると表示されます。