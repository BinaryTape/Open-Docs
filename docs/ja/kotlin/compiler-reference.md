[//]: # (title: Kotlinコンパイラオプション)

Kotlinの各リリースには、[サポートされているプラットフォーム](native-overview.md#target-platforms)向けのJVM、JavaScript、およびネイティブバイナリといった、サポートされているターゲット向けコンパイラが含まれています。

これらのコンパイラは、以下によって使用されます:
*   IDE: Kotlinプロジェクトで__Compile__ または __Run__ ボタンをクリックした際
*   Gradle: コンソールまたはIDEで `gradle build` を呼び出した際
*   Maven: コンソールまたはIDEで `mvn compile` または `mvn test-compile` を呼び出した際

Kotlinコンパイラは、[コマンドラインコンパイラの使用](command-line.md)チュートリアルで説明されているように、コマンドラインから手動で実行することもできます。

## コンパイラオプション

Kotlinコンパイラには、コンパイルプロセスを調整するための多数のオプションがあります。
異なるターゲットのコンパイラオプションは、それぞれの説明とともにこのページにリストされています。

コンパイラオプションとその値（*コンパイラ引数*）を設定する方法はいくつかあります:
*   IntelliJ IDEAの場合: **設定/Preferences** | **ビルド、実行、デプロイ** | **コンパイラ** | **Kotlinコンパイラ** の「**Additional command line parameters**」テキストボックスにコンパイラ引数を入力します。
*   Gradleを使用している場合: Kotlinコンパイルタスクの `compilerOptions` プロパティでコンパイラ引数を指定します。詳細は、[Gradleコンパイラオプション](gradle-compiler-options.md#how-to-define-options)を参照してください。
*   Mavenを使用している場合: Mavenプラグインノードの `<configuration>` 要素にコンパイラ引数を指定します。詳細は、[Maven](maven.md#specify-compiler-options)を参照してください。
*   コマンドラインコンパイラを実行する場合: ユーティリティ呼び出しに直接コンパイラ引数を追加するか、[argfile](#argfile)に記述します。

  例:

  ```bash
  $ kotlinc hello.kt -include-runtime -d hello.jar
  ```

  > Windowsでは、区切り文字（空白、`=、`;、`,`）を含むコンパイラ引数を渡す場合、これらの引数を二重引用符（`"`）で囲みます。
  > ```
  > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
  > ```
  {style="note"}

## 共通オプション

以下のオプションは、すべてのKotlinコンパイラに共通です。

### -version

コンパイラのバージョンを表示します。

### -nowarn

コンパイル中にコンパイラが警告を表示するのを抑制します。

### -Werror

すべての警告をコンパイルエラーにします。

### -Wextra

有効な場合に警告を出力する[追加の宣言、式、および型のコンパイラチェック](whatsnew21.md#extra-compiler-checks)を有効にします。

### -verbose

コンパイルプロセスの詳細を含む詳細なログ出力を有効にします。

### -script

Kotlinスクリプトファイルを評価します。このオプションを指定して呼び出された場合、コンパイラは、与えられた引数の中から最初のKotlinスクリプト（`*.kts`）ファイルを実行します。

### -help (-h)

使用法情報を表示して終了します。標準オプションのみが表示されます。
高度なオプションを表示するには、`-X`を使用します。

### -X

高度なオプションに関する情報を表示して終了します。これらのオプションは現在不安定です。その名前と動作は予告なく変更される場合があります。

### -kotlin-home _path_

ランタイムライブラリの検出に使用されるKotlinコンパイラへのカスタムパスを指定します。

### -P plugin:pluginId:optionName=value

Kotlinコンパイラプラグインにオプションを渡します。
コアプラグインとそのオプションは、ドキュメントの[Core compiler plugins](components-stability.md#core-compiler-plugins)セクションにリストされています。

### -language-version _version_

指定されたKotlinバージョンとのソース互換性を提供します。

### -api-version _version_

指定されたKotlinバンドルライブラリの宣言のみを使用できるようにします。

### -progressive

コンパイラの[プログレッシブモード](whatsnew13.md#progressive-mode)を有効にします。

プログレッシブモードでは、不安定なコードに対する非推奨化とバグ修正が、段階的な移行サイクルを経る代わりに、すぐに有効になります。
プログレッシブモードで書かれたコードは後方互換性がありますが、非プログレッシブモードで書かれたコードはプログレッシブモードでコンパイルエラーを引き起こす可能性があります。

### @argfile

指定されたファイルからコンパイラオプションを読み取ります。このようなファイルには、値を持つコンパイラオプションとソースファイルへのパスを含めることができます。オプションとパスは空白で区切る必要があります。例:

```
-include-runtime -d hello.jar hello.kt
```

空白を含む値を渡すには、それらをシングル（**'**）またはダブル（**"**）引用符で囲みます。値に引用符が含まれている場合は、バックスラッシュ（**\\**）でエスケープします。
```
-include-runtime -d 'My folder'
```

例えば、コンパイラオプションとソースファイルを分けるために、複数の引数ファイルを渡すこともできます。

```bash
$ kotlinc @compiler.options @classes
```

ファイルが現在のディレクトリとは異なる場所に存在する場合、相対パスを使用します。

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

指定された完全修飾名を持つ要件アノテーション付きで、[opt-inが必要な](opt-in-requirements.md)APIの使用を有効にします。

### -Xsuppress-warning

特定の警告を[プロジェクト全体でグローバルに](whatsnew21.md#global-warning-suppression)抑制します。例:

```bash
kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
```

## Kotlin/JVM コンパイラオプション

JS用Kotlinコンパイラは、KotlinソースファイルをJavaクラスファイルにコンパイルします。
KotlinからJVMへのコンパイル用コマンドラインツールは `kotlinc` と `kotlinc-jvm` です。
これらはKotlinスクリプトファイルの実行にも使用できます。

[共通オプション](#common-options)に加えて、Kotlin/JVMコンパイラは以下のオプションを持っています。

### -classpath _path_ (-cp _path_)

指定されたパス内でクラスファイルを検索します。クラスパスの要素はシステムパスセパレーター（Windowsでは**;**、macOS/Linuxでは**:**）で区切ります。
クラスパスには、ファイルパス、ディレクトリパス、ZIPファイル、またはJARファイルを含めることができます。

### -d _path_

生成されたクラスファイルを指定された場所に配置します。場所はディレクトリ、ZIPファイル、またはJARファイルにできます。

### -include-runtime

Kotlinランタイムを結果のJARファイルに含めます。結果のアーカイブをあらゆるJava対応環境で実行可能にします。

### -jdk-home _path_

デフォルトの `JAVA_HOME` と異なる場合、クラスパスに含めるカスタムJDKホームディレクトリを使用します。

### -Xjdk-release=version

生成されるJVMバイトコードのターゲットバージョンを指定します。クラスパス内のJDKのAPIを指定されたJavaバージョンに制限します。
[`-jvm-target version`](#jvm-target-version)を自動的に設定します。
指定可能な値は `1.8`、`9`、`10`、...、`21` です。

> このオプションは、各JDKディストリビューションで有効であることは[保証されていません](https://youtrack.jetbrains.com/issue/KT-29974)。
>
{style="note"}

### -jvm-target _version_

生成されるJVMバイトコードのターゲットバージョンを指定します。指定可能な値は `1.8`、`9`、`10`、...、`21` です。
デフォルト値は`%defaultJvmTargetVersion%`です。

### -java-parameters

メソッドパラメータに関するJava 1.8リフレクションのメタデータを生成します。

### -module-name _name_ (JVM)

生成される`.kotlin_module`ファイルにカスタム名を指定します。

### -no-jdk

Javaランタイムをクラスパスに自動的に含めません。

### -no-reflect

Kotlinリフレクション（`kotlin-reflect.jar`）をクラスパスに自動的に含めません。

### -no-stdlib (JVM)

Kotlin/JVM stdlib（`kotlin-stdlib.jar`）とKotlinリフレクション（`kotlin-reflect.jar`）をクラスパスに自動的に含めません。

### -script-templates _classnames[,]_

スクリプト定義テンプレートクラス。完全修飾クラス名を使用し、コンマ（**,**）で区切ります。

## Kotlin/JS コンパイラオプション

JS用Kotlinコンパイラは、KotlinソースファイルをJavaScriptコードにコンパイルします。
KotlinからJSへのコンパイル用コマンドラインツールは `kotlinc-js` です。

[共通オプション](#common-options)に加えて、Kotlin/JSコンパイラは以下のオプションを持っています。

### -target {es5|es2015}

指定されたECMAバージョンのJSファイルを生成します。

### -libraries _path_

`.meta.js`および`.kjsm`ファイルを持つKotlinライブラリへのパスで、システムパスセパレーターで区切られます。

### -main _{call|noCall}_

実行時に`main`関数を呼び出すかどうかを定義します。

### -meta-info

メタデータを含む`.meta.js`および`.kjsm`ファイルを生成します。JSライブラリを作成する際にこのオプションを使用します。

### -module-kind {umd|commonjs|amd|plain}

コンパイラによって生成されるJSモジュールの種類:

-   `umd` - [Universal Module Definition](https://github.com/umdjs/umd)モジュール
-   `commonjs` - [CommonJS](http://www.commonjs.org/)モジュール
-   `amd` - [Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition)モジュール
-   `plain` - プレーンJSモジュール

JSモジュールのさまざまな種類とそれらの違いについて詳しくは、[この記事](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)を参照してください。

### -no-stdlib (JS)

デフォルトのKotlin/JS stdlibをコンパイル依存関係に自動的に含めません。

### -output _filepath_

コンパイル結果の出力先ファイルを設定します。値は、その名前を含む`.js`ファイルへのパスである必要があります。

### -output-postfix _filepath_

指定されたファイルの内容を出力ファイルの末尾に追加します。

### -output-prefix _filepath_

指定されたファイルの内容を出力ファイルの先頭に追加します。

### -source-map

ソースマップを生成します。

### -source-map-base-dirs _path_

指定されたパスをベースディレクトリとして使用します。ベースディレクトリは、ソースマップ内の相対パスを計算するために使用されます。

### -source-map-embed-sources _{always|never|inlining}_

ソースファイルをソースマップに埋め込みます。

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

Kotlinコードで宣言した変数名と関数名をソースマップに追加します。

| 設定 | 説明 | 出力例 |
|---|---|---|
| `simple-names` | 変数名とシンプルな関数名が追加されます。（デフォルト） | `main` |
| `fully-qualified-names` | 変数名と完全修飾関数名が追加されます。 | `com.example.kjs.playground.main` |
| `no` | 変数名も関数名も追加されません。 | N/A |

### -source-map-prefix

ソースマップ内のパスに指定されたプレフィックスを追加します。

## Kotlin/Native コンパイラオプション

Kotlin/Nativeコンパイラは、Kotlinソースファイルを[サポートされているプラットフォーム](native-overview.md#target-platforms)向けのネイティブバイナリにコンパイルします。
Kotlin/Nativeコンパイル用のコマンドラインツールは `kotlinc-native` です。

[共通オプション](#common-options)に加えて、Kotlin/Nativeコンパイラは以下のオプションを持っています。

### -enable-assertions (-ea)

生成されたコードでランタイムアサーションを有効にします。

### -g

デバッグ情報の出力を有効にします。このオプションは最適化レベルを低下させ、[`-opt`](#opt)オプションと組み合わせて使用しないでください。

### -generate-test-runner (-tr)

プロジェクトから単体テストを実行するためのアプリケーションを生成します。

### -generate-no-exit-test-runner (-trn)

明示的なプロセス終了なしで単体テストを実行するためのアプリケーションを生成します。

### -include-binary _path_ (-ib _path_)

生成されたklibファイル内に外部バイナリをパックします。

### -library _path_ (-l _path_)

ライブラリとリンクします。Kotlin/Nativeプロジェクトでのライブラリの使用について学ぶには、[Kotlin/Nativeライブラリ](native-libraries.md)を参照してください。

### -library-version _version_ (-lv _version_)

ライブラリバージョンを設定します。

### -list-targets

利用可能なハードウェアターゲットを一覧表示します。

### -manifest _path_

マニフェスト追記ファイルを提供します。

### -module-name _name_ (Native)

コンパイルモジュールの名前を指定します。
このオプションは、Objective-Cにエクスポートされる宣言の名前プレフィックスを指定するためにも使用できます:
[KotlinフレームワークのObjective-Cプレフィックス/名前をカスタム指定するにはどうすればよいですか？](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

ネイティブビットコードライブラリを含めます。

### -no-default-libs

ユーザーコードのリンクを、コンパイラに同梱されているプリビルドの[プラットフォームライブラリ](native-platform-libs.md)と無効にします。

### -nomain

`main`エントリーポイントが外部ライブラリによって提供されると仮定します。

### -nopack

ライブラリをklibファイルにパックしません。

### -linker-option

バイナリビルド中にリンカに引数を渡します。これは、ネイティブライブラリへのリンクに使用できます。

### -linker-options _args_

バイナリビルド中にリンカに複数の引数を渡します。引数は空白で区切ります。

### -nostdlib

stdlibとリンクしません。

### -opt

コンパイル最適化を有効にし、より良いランタイムパフォーマンスを持つバイナリを生成します。最適化レベルを低下させる[`-g`](#g)オプションと組み合わせて使用することはお勧めしません。

### -output _name_ (-o _name_)

出力ファイルの名前を設定します。

### -entry _name_ (-e _name_)

修飾されたエントリーポイント名を指定します。

### -produce _output_ (-p _output_)

出力ファイルの種類を指定します:

-   `program`
-   `static`
-   `dynamic`
-   `framework`
-   `library`
-   `bitcode`

### -repo _path_ (-r _path_)

ライブラリ検索パス。詳細については、[ライブラリ検索シーケンス](native-libraries.md#library-search-sequence)を参照してください。

### -target _target_

ハードウェアターゲットを設定します。利用可能なターゲットのリストを確認するには、[`-list-targets`](#list-targets)オプションを使用します。