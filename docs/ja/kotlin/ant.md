---
title: Ant
---
## Antタスクの取得

KotlinはAnt用に3つのタスクを提供します。

* `kotlinc`: JVMをターゲットとするKotlinコンパイラ
* `kotlin2js`: JavaScriptをターゲットとするKotlinコンパイラ
* `withKotlin`: 標準の *javac* Antタスクを使用する際にKotlinファイルをコンパイルするタスク

これらのタスクは、[Kotlin Compiler](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)アーカイブの`lib`フォルダーにある*kotlin-ant.jar*ライブラリで定義されています。 Antバージョン1.8.2以降が必要です。

## KotlinのみのソースでJVMをターゲットにする

プロジェクトがKotlinソースコードのみで構成されている場合、プロジェクトをコンパイルする最も簡単な方法は、`kotlinc`タスクを使用することです。

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

ここで`${kotlin.lib}`は、Kotlinスタンドアロンコンパイラが解凍されたフォルダーを指します。

## Kotlinのみのソースと複数のルートでJVMをターゲットにする

プロジェクトが複数のソースルートで構成されている場合は、パスを定義する要素として`src`を使用します。

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

プロジェクトがKotlinとJavaの両方のソースコードで構成されている場合、`kotlinc`を使用することも可能ですが、タスクパラメータの繰り返しを避けるためには、`withKotlin`タスクを使用することをお勧めします。

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

コンパイルされるモジュールの名前を`moduleName`属性として指定することもできます。

```xml
<withKotlin moduleName="myModule"/>
```

## 単一のソースフォルダーでJavaScriptをターゲットにする

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## プレフィックス、ポストフィックス、およびソースマップオプションを使用してJavaScriptをターゲットにする

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 単一のソースフォルダーとmetaInfoオプションを使用してJavaScriptをターゲットにする

`metaInfo`オプションは、変換の結果をKotlin/JavaScriptライブラリとして配布する場合に便利です。
`metaInfo`が`true`に設定されている場合、コンパイル中にバイナリメタデータを含む追加のJSファイルが作成されます。
このファイルは、変換の結果とともに配布する必要があります。

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js が作成され、バイナリメタデータが含まれます -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## 参考文献

要素と属性の完全なリストを以下に示します。

### kotlincとkotlin2jsに共通の属性

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `src`  | コンパイルするKotlinソースファイルまたはディレクトリ | Yes |  |
| `nowarn` | すべてのコンパイル警告を抑制します | No | false |
| `noStdlib` | Kotlin標準ライブラリをクラスパスに含めません | No | false |
| `failOnError` | コンパイル中にエラーが検出された場合、ビルドを失敗させます | No | true |

### kotlinc属性

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `output`  | 出力先ディレクトリまたは.jarファイル名 | Yes |  |
| `classpath`  | コンパイルクラスパス | No |  |
| `classpathref`  | コンパイルクラスパス参照 | No |  |
| `includeRuntime`  | `output`が.jarファイルの場合、Kotlinランタイムライブラリをjarに含めるかどうか | No | true  |
| `moduleName` | コンパイルされるモジュールの名前 | No | ターゲットの名前（指定されている場合）またはプロジェクト |

### kotlin2js属性

| Name | Description | Required |
|------|-------------|----------|
| `output`  | 出力先ファイル | Yes |
| `libraries`  | Kotlinライブラリへのパス | No |
| `outputPrefix`  | 生成されたJavaScriptファイルに使用するプレフィックス | No |
| `outputSuffix` | 生成されたJavaScriptファイルに使用するサフィックス | No |
| `sourcemap`  | ソースマップファイルを生成するかどうか | No |
| `metaInfo`  | バイナリ記述子を持つメタデータファイルを生成するかどうか | No |
| `main`  | コンパイラが生成したコードでmain関数を呼び出す必要があるかどうか | No |

### 生のコンパイラ引数を渡す

カスタムの生のコンパイラ引数を渡すには、`value`または`line`属性を持つ`<compilerarg>`要素を使用できます。
これは、`<kotlinc>`、`<kotlin2js>`、および`<withKotlin>`タスク要素内で、次のように行うことができます。

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

使用できる引数の完全なリストは、`kotlinc -help`を実行すると表示されます。