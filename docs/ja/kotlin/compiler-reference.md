---
title: Kotlinコンパイラーオプション
---
Kotlinの各リリースには、サポートされているターゲット（[サポートされているプラットフォーム](native-overview#target-platforms)向けのJVM、JavaScript、およびネイティブバイナリ）用のコンパイラーが含まれています。

これらのコンパイラーは以下によって使用されます。

* IDE。Kotlinプロジェクトで［__Compile__］または［__Run__］ボタンをクリックしたとき。
* Gradle。コンソールまたはIDEで`gradle build`を呼び出すとき。
* Maven。コンソールまたはIDEで`mvn compile`または`mvn test-compile`を呼び出すとき。

[コマンドラインコンパイラーの操作](command-line)のチュートリアルで説明されているように、コマンドラインからKotlinコンパイラーを手動で実行することもできます。

## コンパイラーオプション

Kotlinコンパイラーには、コンパイルプロセスを調整するための多くのオプションがあります。
さまざまなターゲット向けのコンパイラーオプションは、このページに各オプションの説明とともに記載されています。

コンパイラーオプションとその値（_コンパイラー引数_）を設定する方法はいくつかあります。
* IntelliJ IDEAでは、**Settings/Preferences** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler**の**Additional command line parameters**テキストボックスにコンパイラー引数を記述します。
* Gradleを使用している場合は、Kotlinコンパイルタスクの`compilerOptions`プロパティでコンパイラー引数を指定します。
  詳細については、[Gradleコンパイラーオプション](gradle-compiler-options#how-to-define-options)を参照してください。
* Mavenを使用している場合は、Mavenプラグインノードの`<configuration>`要素でコンパイラー引数を指定します。
  詳細については、[Maven](maven#specify-compiler-options)を参照してください。
* コマンドラインコンパイラーを実行する場合は、ユーティリティ呼び出しにコンパイラー引数を直接追加するか、[argfile](#argfile)に記述します。

例：

```bash
$ kotlinc hello.kt -include-runtime -d hello.jar
```

:::note
Windowsでは、区切り文字（空白、`=`、`;`、`,`）を含むコンパイラー引数を渡す場合、
これらの引数を二重引用符（`"`）で囲みます。
```
$ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
```

:::

## 共通オプション

次のオプションは、すべてのKotlinコンパイラーに共通です。

### -version

コンパイラーのバージョンを表示します。

### -nowarn

コンパイル中にコンパイラーが警告を表示しないようにします。

### -Werror

すべての警告をコンパイルエラーに変えます。

### -Wextra

trueの場合に警告を発する[追加の宣言、式、および型のコンパイラーチェック](whatsnew21#extra-compiler-checks)を有効にします。

### -verbose

コンパイルプロセスの詳細を含む、詳細なロギング出力を有効にします。

### -script

Kotlinスクリプトファイルを評価します。このオプションを指定して呼び出すと、コンパイラーは指定された引数の中で最初のKotlinスクリプト（`*.kts`）ファイルを実行します。

### -help (-h)

使用法情報を表示して終了します。標準オプションのみが表示されます。
詳細オプションを表示するには、`-X`を使用します。

### -X

詳細オプションに関する情報を表示して終了します。これらのオプションは現在不安定です。
それらの名前と動作は予告なく変更される場合があります。

### -kotlin-home _path_

ランタイムライブラリの検出に使用されるKotlinコンパイラーへのカスタムパスを指定します。

### -P plugin:pluginId:optionName=value

Kotlinコンパイラープラグインにオプションを渡します。
コアプラグインとそのオプションは、ドキュメントの[コアコンパイラープラグイン](components-stability#core-compiler-plugins)セクションにリストされています。

### -language-version _version_

指定されたバージョンのKotlinとのソース互換性を提供します。

### -api-version _version_

指定されたバージョンのKotlinバンドルライブラリからの宣言のみを使用できるようにします。

### -progressive

コンパイラーの[progressive mode](whatsnew13#progressive-mode)を有効にします。

progressive modeでは、不安定なコードの非推奨とバグ修正が、段階的な移行サイクルを経ずにすぐに有効になります。
progressive modeで記述されたコードは下位互換性がありますが、
非progressive modeで記述されたコードは、progressive modeでコンパイルエラーを引き起こす可能性があります。

### @argfile

指定されたファイルからコンパイラーオプションを読み取ります。このようなファイルには、値を持つコンパイラーオプション
とソースファイルへのパスを含めることができます。オプションとパスは空白で区切る必要があります。例：

```
-include-runtime -d hello.jar hello.kt
```

空白を含む値を渡すには、それらを単一（**'**）または二重（**"**）引用符で囲みます。値に
引用符が含まれている場合は、バックスラッシュ（**\\**）でエスケープします。
```
-include-runtime -d 'My folder'
```

たとえば、コンパイラーオプションをソースファイルから分離するために、複数の引数ファイルを渡すこともできます。

```bash
$ kotlinc @compiler.options @classes
```

ファイルが現在のディレクトリとは異なる場所にある場合は、相対パスを使用します。

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

指定された完全修飾名を持つ要件アノテーションを使用して、[opt-inが必要](opt-in-requirements)なAPIの使用を有効にします。

### -Xsuppress-warning

特定の警告を[プロジェクト全体でグローバルに抑制](whatsnew21#global-warning-suppression)します。例：

```bash
kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
```

## Kotlin/JVMコンパイラーオプション

JVM用のKotlinコンパイラーは、KotlinソースファイルをJavaクラスファイルにコンパイルします。
KotlinからJVMへのコンパイル用のコマンドラインツールは、`kotlinc`と`kotlinc-jvm`です。
Kotlinスクリプトファイルの実行にも使用できます。

[共通オプション](#common-options)に加えて、Kotlin/JVMコンパイラーには以下のオプションがあります。

### -classpath _path_ (-cp _path_)

指定されたパスでクラスファイルを検索します。クラスパスの要素は、システムパス区切り文字（Windowsでは**;**、macOS/Linuxでは**:**）で区切ります。
クラスパスには、ファイルとディレクトリのパス、ZIP、またはJARファイルを含めることができます。

### -d _path_

生成されたクラスファイルを指定された場所に配置します。場所は、ディレクトリ、ZIP、またはJARファイルにすることができます。

### -include-runtime

Kotlinランタイムを結果のJARファイルに含めます。結果のアーカイブをJava対応の任意の
環境で実行可能にします。

### -jdk-home _path_

デフォルトの`JAVA_HOME`と異なる場合に、クラスパスに含めるカスタムJDKホームディレクトリを使用します。

### -Xjdk-release=version

生成されたJVMバイトコードのターゲットバージョンを指定します。クラスパス内のJDKのAPIを指定されたJavaバージョンに制限します。
[`-jvm-target version`](#jvm-target-version)を自動的に設定します。
可能な値は、`1.8`、`9`、`10`、...、`21`です。

:::note
このオプションは、各JDKディストリビューションに対して有効であることが[保証されていません](https://youtrack.jetbrains.com/issue/KT-29974)。

:::

### -jvm-target _version_

生成されたJVMバイトコードのターゲットバージョンを指定します。可能な値は、`1.8`、`9`、`10`、...、`21`です。
デフォルト値は`1.8`です。

### -java-parameters

メソッドパラメーターに関するJava 1.8リフレクションのメタデータを生成します。

### -module-name _name_ (JVM)

生成された`.kotlin_module`ファイルにカスタム名を付けます。

### -no-jdk

Javaランタイムをクラスパスに自動的に含めません。

### -no-reflect

Kotlinリフレクション（`kotlin-reflect.jar`）をクラスパスに自動的に含めません。

### -no-stdlib (JVM)

Kotlin/JVM stdlib（`kotlin-stdlib.jar`）とKotlinリフレクション（`kotlin-reflect.jar`）を
クラスパスに自動的に含めません。

### -script-templates _classnames[,]_

スクリプト定義テンプレートクラス。完全修飾クラス名を使用し、コンマ（**,**）で区切ります。

## Kotlin/JSコンパイラーオプション

JS用のKotlinコンパイラーは、KotlinソースファイルをJavaScriptコードにコンパイルします。
KotlinからJSへのコンパイル用のコマンドラインツールは、`kotlinc-js`です。

[共通オプション](#common-options)に加えて、Kotlin/JSコンパイラーには以下のオプションがあります。

### -target _\{es5|es2015\}_

指定されたECMAバージョンのJSファイルを生成します。

### -libraries _path_

`.meta.js`ファイルと`.kjsm`ファイルを含むKotlinライブラリへのパス。システムパス区切り文字で区切ります。

### -main _\{call|noCall\}_

実行時に`main`関数を呼び出すかどうかを定義します。

### -meta-info

メタデータを含む`.meta.js`ファイルと`.kjsm`ファイルを生成します。JSライブラリを作成するときにこのオプションを使用します。

### -module-kind _\{umd|commonjs|amd|plain\}_

コンパイラーによって生成されるJSモジュールの種類：

- `umd` - [Universal Module Definition](https://github.com/umdjs/umd)モジュール
- `commonjs` - [CommonJS](http://www.commonjs.org/)モジュール
- `amd` - [Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition)モジュール
- `plain` - プレーンなJSモジュール

さまざまな種類のJSモジュールとその違いの詳細については、
[この記事](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)を参照してください。

### -no-stdlib (JS)

デフォルトのKotlin/JS stdlibをコンパイル依存関係に自動的に含めません。

### -output _filepath_

コンパイル結果の宛先ファイルを設定します。値は、名前を含む`.js`ファイルへのパスである必要があります。

### -output-postfix _filepath_

指定されたファイルの内容を出力ファイルの末尾に追加します。

### -output-prefix _filepath_

指定されたファイルの内容を出力ファイルの先頭に追加します。

### -source-map

ソースマップを生成します。

### -source-map-base-dirs _path_

指定されたパスをベースディレクトリとして使用します。ベースディレクトリは、ソースマップ内の相対パスの計算に使用されます。

### -source-map-embed-sources _\{always|never|inlining\}_

ソースファイルをソースマップに埋め込みます。

### -source-map-names-policy _\{simple-names|fully-qualified-names|no\}_

Kotlinコードで宣言した変数名と関数名をソースマップに追加します。

| 設定 | 説明 | 出力例 |
|---|---|---|
| `simple-names` | 変数名と単純な関数名が追加されます。（デフォルト） | `main` |
| `fully-qualified-names` | 変数名と完全修飾関数名が追加されます。 | `com.example.kjs.playground.main` |
| `no` | 変数名または関数名は追加されません。 | N/A |

### -source-map-prefix

指定されたプレフィックスをソースマップ内のパスに追加します。

## Kotlin/Nativeコンパイラーオプション

Kotlin/Nativeコンパイラーは、Kotlinソースファイルを[サポートされているプラットフォーム](native-overview#target-platforms)のネイティブバイナリにコンパイルします。
Kotlin/Nativeコンパイル用のコマンドラインツールは、`kotlinc-native`です。

[共通オプション](#common-options)に加えて、Kotlin/Nativeコンパイラーには以下のオプションがあります。

### -enable-assertions (-ea)

生成されたコードでランタイムアサーションを有効にします。

### -g

デバッグ情報の発行を有効にします。このオプションは最適化レベルを下げ、
[`-opt`](#opt)オプションと組み合わせることはできません。

### -generate-test-runner (-tr)

プロジェクトから単体テストを実行するためのアプリケーションを生成します。

### -generate-no-exit-test-runner (-trn)

明示的なプロセス終了なしで単体テストを実行するためのアプリケーションを生成します。

### -include-binary _path_ (-ib _path_)

生成されたklibファイル内に外部バイナリをパックします。

### -library _path_ (-l _path_)

ライブラリとリンクします。Kotlin/Nativeプロジェクトでのライブラリの使用については、
[Kotlin/Nativeライブラリ](native-libraries)を参照してください。

### -library-version _version_ (-lv _version_)

ライブラリのバージョンを設定します。

### -list-targets

利用可能なハードウェアターゲットをリストします。

### -manifest _path_

マニフェスト追加ファイルを提供します。

### -module-name _name_ (Native)

コンパイルモジュールの名前を指定します。
このオプションを使用して、Objective-Cにエクスポートされる宣言の名前プレフィックスを指定することもできます。
[KotlinフレームワークのカスタムObjective-Cプレフィックス/名前を指定するにはどうすればよいですか？](native-faq#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

ネイティブビットコードライブラリを含めます。

### -no-default-libs

コンパイラーとともに配布されるプリビルド[プラットフォームライブラリ](native-platform-libs)とのユーザーコードのリンクを無効にします。

### -nomain

`main`エントリポイントが外部ライブラリによって提供されると想定します。

### -nopack

ライブラリをklibファイルにパックしません。

### -linker-option

バイナリの構築中にリンカーに引数を渡します。これは、一部のネイティブライブラリに対してリンクするために使用できます。

### -linker-options _args_

バイナリの構築中にリンカーに複数の引数を渡します。引数を空白で区切ります。

### -nostdlib

stdlibとリンクしません。

### -opt

コンパイルの最適化を有効にし、ランタイムパフォーマンスが向上したバイナリを生成します。最適化レベルを下げる[`-g`](#g)オプションと組み合わせることはお勧めしません。

### -output _name_ (-o _name_)

出力ファイルの名前を設定します。

### -entry _name_ (-e _name_)

修飾されたエントリポイント名を指定します。

### -produce _output_ (-p _output_)

出力ファイルの種類を指定します。

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _path_ (-r _path_)

ライブラリ検索パス。詳細については、[ライブラリ検索シーケンス](native-libraries#library-search-sequence)を参照してください。

### -target _target_

ハードウェアターゲットを設定します。利用可能なターゲットのリストを表示するには、[`-list-targets`](#list-targets)オプションを使用します。