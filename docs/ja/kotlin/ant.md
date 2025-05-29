[//]: # (title: Ant)

## Ant タスクの取得

Kotlin は Ant 用に 3 つのタスクを提供します。

*   `kotlinc`: JVM をターゲットとする Kotlin コンパイラ
*   `kotlin2js`: JavaScript をターゲットとする Kotlin コンパイラ
*   `withKotlin`: 標準の *javac* Ant タスクを使用する際に Kotlin ファイルをコンパイルするためのタスク

これらのタスクは、[Kotlin コンパイラ](%kotlinLatestUrl%)アーカイブの `lib` フォルダにある *kotlin-ant.jar* ライブラリで定義されています。Ant バージョン 1.8.2 以降が必要です。

## Kotlin のみで書かれたソースコードで JVM をターゲットにする

プロジェクトが Kotlin ソースコードのみで構成されている場合、プロジェクトをコンパイルする最も簡単な方法は、`kotlinc` タスクを使用することです。

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

ここで、`${kotlin.lib}` は Kotlin スタンドアロンコンパイラが解凍されたフォルダを指します。

## 複数のルートを持つ Kotlin のみで書かれたソースコードで JVM をターゲットにする

プロジェクトが複数のソースルートで構成されている場合は、`src` を要素として使用してパスを定義します。

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

## Kotlin と Java のソースコードで JVM をターゲットにする

プロジェクトが Kotlin と Java の両方のソースコードで構成されている場合、`kotlinc` を使用することも可能ですが、タスクパラメータの繰り返しを避けるため、`withKotlin` タスクを使用することが推奨されます。

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

また、`moduleName` 属性としてコンパイル対象のモジュールの名前を指定することもできます。

```xml
<withKotlin moduleName="myModule"/>
```

## 単一のソースフォルダで JavaScript をターゲットにする

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## Prefix、Postfix、および sourcemap オプションで JavaScript をターゲットにする

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 単一のソースフォルダと metaInfo オプションで JavaScript をターゲットにする

`metaInfo` オプションは、コンパイル結果を Kotlin/JavaScript ライブラリとして配布したい場合に便利です。`metaInfo` が `true` に設定されている場合、コンパイル中にバイナリメタデータを含む追加の JS ファイルが作成されます。このファイルは、コンパイル結果と合わせて配布されるべきです。

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js が作成され、バイナリメタデータが含まれます -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## リファレンス

要素と属性の完全なリストを以下に示します。

### kotlinc と kotlin2js に共通の属性

| 名前 | 説明 | 必須 | デフォルト値 |
|------|-------------|----------|---------------|
| `src`  | コンパイルする Kotlin ソースファイルまたはディレクトリ | Yes |  |
| `nowarn` | すべてのコンパイル警告を抑制します | No | false |
| `noStdlib` | Kotlin 標準ライブラリをクラスパスに含めません | No | false |
| `failOnError` | コンパイル中にエラーが検出された場合、ビルドを失敗させます | No | true |

### kotlinc 属性

| 名前 | 説明 | 必須 | デフォルト値 |
|------|-------------|----------|---------------|
| `output`  | 出力先ディレクトリまたは .jar ファイル名 | Yes |  |
| `classpath`  | コンパイル時のクラスパス | No |  |
| `classpathref`  | コンパイル時のクラスパス参照 | No |  |
| `includeRuntime`  | `output` が .jar ファイルの場合、Kotlin ランタイムライブラリが jar に含まれるかどうか | No | true  |
| `moduleName` | コンパイル対象のモジュールの名前 | No | ターゲットの名前 (指定されている場合) またはプロジェクトの名前 |

### kotlin2js 属性

| 名前 | 説明 | 必須 |
|------|-------------|----------|
| `output`  | 出力先ファイル | Yes |
| `libraries`  | Kotlin ライブラリへのパス | No |
| `outputPrefix`  | 生成される JavaScript ファイルに使用するプレフィックス | No |
| `outputSuffix` | 生成される JavaScript ファイルに使用するサフィックス | No |
| `sourcemap`  | ソースマップファイルを生成するかどうか | No |
| `metaInfo`  | バイナリディスクリプタを含むメタデータファイルを生成するかどうか | No |
| `main`  | コンパイラが生成するコードがメイン関数を呼び出すべきかどうか | No |

### 生の (raw) コンパイラ引数の引き渡し

カスタムの raw コンパイラ引数を渡すには、`<compilerarg>` 要素を `value` または `line` 属性とともに使用できます。これは、`<kotlinc>`、`<kotlin2js>`、および `<withKotlin>` タスク要素内で実行できます。例を以下に示します。

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

使用可能な引数の完全なリストは、`kotlinc -help` を実行したときに表示されます。