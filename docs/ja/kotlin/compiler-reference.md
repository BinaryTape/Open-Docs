[//]: # (title: Kotlinコンパイラのオプション)

Kotlinの各リリースには、サポートされているターゲット（JVM、JavaScript、[対応プラットフォーム](native-overview.md#target-platforms)用のネイティブバイナリ）向けのコンパイラが含まれています。

これらのコンパイラは、以下によって使用されます。
*   IDEで、Kotlinプロジェクトの**コンパイル**ボタンまたは**実行**ボタンをクリックしたとき。
*   Gradleで、コンソールまたはIDEで`gradle build`を呼び出したとき。
*   Mavenで、コンソールまたはIDEで`mvn compile`または`mvn test-compile`を呼び出したとき。

Kotlinコンパイラは、[コマンドラインコンパイラでの作業](command-line.md)チュートリアルで説明されているように、コマンドラインから手動で実行することもできます。

## コンパイラのオプション

Kotlinコンパイラには、コンパイルプロセスを調整するための多数のオプションがあります。
異なるターゲット向けのコンパイラオプションは、それぞれの説明とともにこのページにリストされています。

コンパイラのオプションとその値（_コンパイラ引数_）を設定するには、いくつかの方法があります。
*   IntelliJ IDEAで、**Settings/Preferences** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler** の**Additional command line parameters**テキストボックスにコンパイラ引数を入力します。
*   Gradleを使用している場合は、Kotlinコンパイルタスクの`compilerOptions`プロパティにコンパイラ引数を指定します。詳細については、[Gradleコンパイラオプション](gradle-compiler-options.md#how-to-define-options)を参照してください。
*   Mavenを使用している場合は、Mavenプラグインノードの`<configuration>`要素にコンパイラ引数を指定します。詳細については、[Maven](maven.md#specify-compiler-options)を参照してください。
*   コマンドラインコンパイラを実行する場合は、ユーティリティ呼び出しに直接コンパイラ引数を追加するか、[引数ファイル](#argfile)に記述します。

  例：

  ```bash
  $ kotlinc hello.kt -include-runtime -d hello.jar
  ```

  > Windowsでは、区切り文字（空白、`=`、`;`、`,`）を含むコンパイラ引数を渡す場合、これらの引数を二重引用符（`"`）で囲みます。
  > ```
  > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
  > ```
  {style="note"}

## 共通オプション

以下のオプションは、すべてのKotlinコンパイラに共通です。

### -version

コンパイラのバージョンを表示します。

### -verbose

コンパイルプロセスの詳細を含む、詳細なログ出力を有効にします。

### -script

Kotlinスクリプトファイルを評価します。このオプションを指定して呼び出すと、コンパイラは指定された引数の中から最初のKotlinスクリプト（`*.kts`）ファイルを実行します。

### -help (-h)

使用法情報を表示して終了します。標準オプションのみが表示されます。
高度なオプションを表示するには、`-X`を使用します。

### -X

<primary-label ref="experimental-general"/>

高度なオプションに関する情報を表示して終了します。これらのオプションは現在不安定です。名前や動作は予告なく変更される場合があります。

### -kotlin-home _path_

ランタイムライブラリの検出に使用されるKotlinコンパイラへのカスタムパスを指定します。

### -P plugin:pluginId:optionName=value

Kotlinコンパイラプラグインにオプションを渡します。
コアプラグインとそのオプションは、ドキュメントの[Core compiler plugins](components-stability.md#core-compiler-plugins)セクションにリストされています。

### -language-version _version_

指定されたKotlinバージョンとのソース互換性を提供します。

### -api-version _version_

指定されたKotlinバンドルライブラリのバージョンからの宣言のみの使用を許可します。

### -progressive

コンパイラの[プログレッシブモード](whatsnew13.md#progressive-mode)を有効にします。

プログレッシブモードでは、不安定なコードに対する非推奨化とバグ修正が、段階的な移行サイクルを経ずに直ちに適用されます。
プログレッシブモードで書かれたコードは後方互換性がありますが、非プログレッシブモードで書かれたコードは、プログレッシブモードでコンパイルエラーを引き起こす可能性があります。

### @argfile

指定されたファイルからコンパイラオプションを読み取ります。このようなファイルには、値とソースファイルへのパスを持つコンパイラオプションを含めることができます。オプションとパスは空白で区切る必要があります。例：

```
-include-runtime -d hello.jar hello.kt
```

空白を含む値を渡すには、一重引用符（**'**）または二重引用符（**"**）で囲みます。値に引用符が含まれる場合は、バックスラッシュ（**\\**）でエスケープします。
```
-include-runtime -d 'My folder'
```

複数の引数ファイルを渡すこともできます。例えば、コンパイラオプションとソースファイルを分離するためです。

```bash
$ kotlinc @compiler.options @classes
```

ファイルが現在のディレクトリとは異なる場所にある場合は、相対パスを使用します。

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

指定された完全修飾名を持つ要件アノテーションで、[オプトインが必要な](opt-in-requirements.md)APIの使用を有効にします。

### -Xrepl

<primary-label ref="experimental-general"/>

Kotlin REPLをアクティブにします。

```bash
kotlinc -Xrepl
```

### -Xannotation-target-all

<primary-label ref="experimental-general"/>

アノテーションの実験的な[`all`ユースサイトターゲット](annotations.md#all-meta-target)を有効にします。

```bash
kotlinc -Xannotation-target-all
```

### -Xannotation-default-target=param-property

<primary-label ref="experimental-general"/>

アノテーションのユースサイトターゲットの新しい実験的な[デフォルト設定ルール](annotations.md#defaults-when-no-use-site-targets-are-specified)を有効にします。

```bash
kotlinc -Xannotation-default-target=param-property
```

### 警告管理

#### -nowarn

コンパイル中のすべての警告を抑制します。

#### -Werror

すべての警告をコンパイルエラーとして扱います。

#### -Wextra

真の場合に警告を発する[追加の宣言、式、および型コンパイラチェック](whatsnew21.md#extra-compiler-checks)を有効にします。

#### -Xwarning-level
<primary-label ref="experimental-general"/>

特定のコンパイラ警告の重大度レベルを設定します。

```bash
kotlinc -Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

*   `error`: 指定された警告のみをエラーに昇格させます。
*   `warning`: 指定された診断に対して警告を発し、デフォルトで有効になっています。
*   `disabled`: 指定された警告のみをモジュール全体で抑制します。

プロジェクト内の警告レポートは、モジュール全体のルールと特定のルールを組み合わせて調整できます。

| コマンド                                           | 説明                                                       |
|----------------------------------------------------|------------------------------------------------------------|
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 指定された警告を除くすべての警告を抑制します。             |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 指定された警告を除くすべての警告をエラーに昇格させます。 |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 指定されたチェックを除くすべての追加チェックを有効にします。 |

一般的なルールから除外する警告が多数ある場合は、[`@argfile`](#argfile)を使用して別のファイルにリストできます。

## Kotlin/JVMコンパイラのオプション

Kotlin/JVMコンパイラは、KotlinソースファイルをJavaクラスファイルにコンパイルします。KotlinからJVMへのコンパイルのためのコマンドラインツールは、`kotlinc`および`kotlinc-jvm`です。これらを使用してKotlinスクリプトファイルを実行することもできます。

[共通オプション](#common-options)に加えて、Kotlin/JVMコンパイラは以下のオプションを持っています。

### -classpath _path_ (-cp _path_)

指定されたパスでクラスファイルを検索します。クラスパスの要素はシステムパス区切り文字（Windowsでは**;**、macOS/Linuxでは**:**）で区切ります。
クラスパスには、ファイルやディレクトリのパス、ZIPファイル、またはJARファイルを含めることができます。

### -d _path_

生成されたクラスファイルを指定された場所に配置します。場所はディレクトリ、ZIPファイル、またはJARファイルにすることができます。

### -include-runtime

結果のJARファイルにKotlinランタイムを含めます。これにより、結果のアーカイブはJavaが有効な任意の環境で実行可能になります。

### -jdk-home _path_

デフォルトの`JAVA_HOME`と異なる場合、カスタムのJDKホームディレクトリをクラスパスに含めるように指定します。

### -Xjdk-release=version

<primary-label ref="experimental-general"/>

生成されるJVMバイトコードのターゲットバージョンを指定します。クラスパス内のJDKのAPIを指定されたJavaバージョンに制限します。[`-jvm-target version`](#jvm-target-version)を自動的に設定します。
指定可能な値は`1.8`、`9`、`10`、...、`24`です。

> このオプションは、各JDKディストリビューションに対して[有効である保証はありません](https://youtrack.jetbrains.com/issue/KT-29974)。
>
{style="note"}

### -jvm-target _version_

生成されるJVMバイトコードのターゲットバージョンを指定します。指定可能な値は`1.8`、`9`、`10`、...、`24`です。
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

Kotlin/JVM stdlib（`kotlin-stdlib.jar`）およびKotlinリフレクション（`kotlin-reflect.jar`）をクラスパスに自動的に含めません。

### -script-templates _classnames[,]_

スクリプト定義テンプレートクラス。完全修飾クラス名を使用し、コンマ（**，**）で区切ります。

### -Xjvm-expose-boxed

<primary-label ref="experimental-general"/>

モジュール内のすべてのインライン値クラスのボックス化されたバージョンと、それらを使用する関数のボックス化されたバリアントを生成し、Javaから両方にアクセスできるようにします。詳細については、JavaからKotlinを呼び出すガイドの[インライン値クラス](java-to-kotlin-interop.md#inline-value-classes)を参照してください。

### -jvm-default _mode_

インターフェースで宣言された関数がJVM上でデフォルトメソッドとしてどのようにコンパイルされるかを制御します。

| モード               | 説明                                                                                                                       |
|--------------------|----------------------------------------------------------------------------------------------------------------------------|
| `enable`           | インターフェースにデフォルト実装を生成し、サブクラスと`DefaultImpls`クラスにブリッジ関数を含めます。（デフォルト）       |
| `no-compatibility` | 互換性ブリッジと`DefaultImpls`クラスをスキップし、インターフェースにのみデフォルト実装を生成します。                      |
| `disable`          | デフォルトメソッドをスキップし、互換性ブリッジと`DefaultImpls`クラスのみを生成します。                                    |

## Kotlin/JSコンパイラのオプション

Kotlin/JSコンパイラは、KotlinソースファイルをJavaScriptコードにコンパイルします。KotlinからJSへのコンパイルのためのコマンドラインツールは、`kotlinc-js`です。

[共通オプション](#common-options)に加えて、Kotlin/JSコンパイラは以下のオプションを持っています。

### -target {es5|es2015}

指定されたECMAバージョン向けにJSファイルを生成します。

### -libraries _path_

`.meta.js`ファイルと`.kjsm`ファイルを含むKotlinライブラリへのパス。システムパス区切り文字で区切ります。

### -main _{call|noCall}_

実行時に`main`関数を呼び出すかどうかを定義します。

### -meta-info

メタデータを含む`.meta.js`ファイルと`.kjsm`ファイルを生成します。JSライブラリを作成する際にこのオプションを使用します。

### -module-kind {umd|commonjs|amd|plain}

コンパイラによって生成されるJSモジュールの種類：

- `umd` - [Universal Module Definition](https://github.com/umdjs/umd)モジュール
- `commonjs` - [CommonJS](http://www.commonjs.org/)モジュール
- `amd` - [Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition)モジュール
- `plain` - プレーンJSモジュール

異なる種類のJSモジュールとその違いについては、[この記事](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)を参照してください。

### -no-stdlib (JS)

デフォルトのKotlin/JS stdlibをコンパイル依存関係に自動的に含めません。

### -output _filepath_

コンパイル結果の出力先ファイルを指定します。値はファイル名を含む`.js`ファイルへのパスである必要があります。

### -output-postfix _filepath_

指定されたファイルのコンテンツを出力ファイルの末尾に追加します。

### -output-prefix _filepath_

指定されたファイルのコンテンツを出力ファイルの先頭に追加します。

### -source-map

ソースマップを生成します。

### -source-map-base-dirs _path_

指定されたパスをベースディレクトリとして使用します。ベースディレクトリはソースマップ内の相対パスを計算するために使用されます。

### -source-map-embed-sources _{always|never|inlining}_

ソースファイルをソースマップに埋め込みます。

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

Kotlinコードで宣言した変数名と関数名をソースマップに追加します。

| 設定                | 説明                                         | 出力例                          |
|---------------------|----------------------------------------------|---------------------------------|
| `simple-names`      | 変数名と単純な関数名が追加されます。（デフォルト） | `main`                          |
| `fully-qualified-names` | 変数名と完全修飾関数名が追加されます。       | `com.example.kjs.playground.main` |
| `no`                | 変数名または関数名は追加されません。       | N/A                             |

### -source-map-prefix

ソースマップ内のパスに指定されたプレフィックスを追加します。

## Kotlin/Nativeコンパイラのオプション

Kotlin/Nativeコンパイラは、Kotlinソースファイルを[対応プラットフォーム](native-overview.md#target-platforms)向けのネイティブバイナリにコンパイルします。Kotlin/Nativeコンパイルのためのコマンドラインツールは、`kotlinc-native`です。

[共通オプション](#common-options)に加えて、Kotlin/Nativeコンパイラは以下のオプションを持っています。

### -enable-assertions (-ea)

生成されたコードでランタイムアサーションを有効にします。

### -g

デバッグ情報の出力を有効にします。このオプションは最適化レベルを下げ、[`-opt`](#opt)オプションと組み合わせて使用すべきではありません。

### -generate-test-runner (-tr)

プロジェクトから単体テストを実行するためのアプリケーションを生成します。

### -generate-no-exit-test-runner (-trn)

明示的なプロセス終了なしで単体テストを実行するためのアプリケーションを生成します。

### -include-binary _path_ (-ib _path_)

生成されたklibファイル内に外部バイナリをパックします。

### -library _path_ (-l _path_)

ライブラリとリンクします。Kotlin/Nativeプロジェクトでのライブラリの使用については、[Kotlin/Nativeライブラリ](native-libraries.md)を参照してください。

### -library-version _version_ (-lv _version_)

ライブラリのバージョンを設定します。

### -list-targets

利用可能なハードウェアターゲットをリスト表示します。

### -manifest _path_

マニフェストアデンドファイルを提供します。

### -module-name _name_ (Native)

コンパイルモジュールの名前を指定します。
このオプションは、Objective-Cにエクスポートされる宣言の名前プレフィックスを指定するためにも使用できます。
[KotlinフレームワークのカスタムObjective-Cプレフィックス/名前を指定するにはどうすればよいですか？](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

ネイティブビットコードライブラリを含めます。

### -no-default-libs

コンパイラと一緒に配布されるビルド済みの[プラットフォームライブラリ](native-platform-libs.md)とユーザーコードのリンクを無効にします。

### -nomain

`main`エントリポイントが外部ライブラリによって提供されるものと仮定します。

### -nopack

ライブラリをklibファイルにパックしません。

### -linker-option

バイナリビルド中にリンカに引数を渡します。これは、一部のネイティブライブラリとリンクするために使用できます。

### -linker-options _args_

バイナリビルド中にリンカに複数の引数を渡します。引数は空白で区切ります。

### -nostdlib

stdlibとリンクしません。

### -opt

コンパイル最適化を有効にし、より良いランタイムパフォーマンスを持つバイナリを生成します。
最適化レベルを下げる[`-g`](#g)オプションと組み合わせて使用することは推奨されません。

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

ライブラリ検索パス。詳細については、[ライブラリ検索シーケンス](native-libraries.md#library-search-sequence)を参照してください。

### -target _target_

ハードウェアターゲットを設定します。利用可能なターゲットのリストを表示するには、[`-list-targets`](#list-targets)オプションを使用します。