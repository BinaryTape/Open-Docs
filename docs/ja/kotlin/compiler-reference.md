[//]: # (title: Kotlin コンパイラオプション)

<show-structure depth="1"/>

Kotlin の各リリースには、サポートされているターゲット（JVM、JavaScript、および[サポートされているプラットフォーム](native-overview.md#target-platforms)向けのネイティブバイナリ）用のコンパイラが含まれています。

これらのコンパイラは以下によって使用されます：
* IDE：Kotlin プロジェクトの **Compile** または **Run** ボタンをクリックしたとき。
* Gradle：コンソールや IDE で `gradle build` を呼び出したとき。
* Maven：コンソールや IDE で `mvn compile` または `mvn test-compile` を呼び出したとき。

また、[コマンドラインコンパイラの使用](command-line.md)チュートリアルで説明されているように、コマンドラインから手動で Kotlin コンパイラを実行することもできます。

## コンパイラオプション

Kotlin コンパイラには、コンパイルプロセスをカスタマイズするための多数のオプションがあります。
ターゲットごとのコンパイラオプションとその説明をこのページに記載しています。

コンパイラオプションとその値（*コンパイラ引数*）を設定するには、いくつかの方法があります：
* IntelliJ IDEA の場合：**Settings/Preferences** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler** の **Additional command line parameters** テキストボックスにコンパイラ引数を入力します。
* Gradle を使用している場合：Kotlin コンパイルタスクの `compilerOptions` プロパティでコンパイラ引数を指定します。
詳細は [Gradle コンパイラオプション](gradle-compiler-options.md#how-to-define-options)を参照してください。
* Maven を使用している場合：Maven プラグインノードの `<configuration>` 要素内でコンパイラ引数を指定します。
詳細は [Maven](maven-kotlin-compiler.md#specify-compiler-options) を参照してください。
* コマンドラインコンパイラを実行する場合：ユーティリティの呼び出しに直接コンパイラ引数を追加するか、[引数ファイル（argfile）](#argfile)に記述します。

  例：

  ```bash
  $ kotlinc hello.kt -include-runtime -d hello.jar
  ```

  > Windows では、区切り文字（空白、`=`、`;`、`,`）を含むコンパイラ引数を渡す場合、それらの引数をダブルクォーテーション（`"`）で囲んでください。
  > ```
  > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
  > ```
  {style="note"}

## コンパイラオプションのスキーマ

すべてのコンパイラオプションに共通のスキーマが、JAR アーティファクトとして [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description) で公開されています。このアーティファクトには、すべてのコンパイラオプションの説明のコード表現と（Kotlin 以外の利用者向けの）JSON 版の両方が含まれています。また、各オプションが導入されたバージョンや安定化したバージョンなどのメタデータも含まれています。

## 共通オプション

以下のオプションは、すべての Kotlin コンパイラで共通です。

### -api-version _version_

バンドルされた Kotlin ライブラリの指定されたバージョンからの宣言のみを使用できるようにします。

### -help (-h)

使用法を表示して終了します。標準オプションのみが表示されます。
高度なオプションを表示するには、`-X` を使用してください。

### -kotlin-home _path_

ランタイムライブラリの検出に使用される Kotlin コンパイラへのカスタムパスを指定します。

### -language-version _version_

指定された言語バージョンに従って、サポートされる構文とセマンティクスを設定します。例えば、Kotlin コンパイラバージョン 2.4.0 で `-language-version=2.2` を使用すると、バージョン 2.2 以前の言語機能と標準ライブラリ API のみを使用できるようになります。これは、新しい Kotlin バージョンへの段階的な移行に役立ちます。

### -opt-in _annotation_

指定された完全修飾名を持つ要件アノテーションを使用して、[オプトインを必要とする](opt-in-requirements.md) API の使用を有効にします。

### -P plugin:pluginId:optionName=value

Kotlin コンパイラプラグインにオプションを渡します。
コアプラグインとそのオプションは、ドキュメントの[コアコンパイラプラグイン](components-stability.md#core-compiler-plugins)セクションに記載されています。

### -progressive

コンパイラの[プログレッシブモード](whatsnew13.md#progressive-mode)を有効にします。

プログレッシブモードでは、不安定なコードに対する非推奨化（deprecation）やバグ修正が、緩やかな移行サイクルを経ることなく即座に適用されます。
プログレッシブモードで書かれたコードには後方互換性がありますが、非プログレッシブモードで書かれたコードはプログレッシブモードでコンパイルエラーを引き起こす可能性があります。

### -script

Kotlin スクリプトファイルを評価します。このオプションを指定して呼び出すと、コンパイラは引数の中で最初の Kotlin スクリプト（`*.kts`）ファイルを実行します。

### -verbose

コンパイルプロセスの詳細を含む、詳細なログ出力を有効にします。

### -version

コンパイラのバージョンを表示します。

### -X

<primary-label ref="experimental-general"/>

高度なオプションに関する情報を表示して終了します。これらのオプションは現在不安定（unstable）であり、その名前や動作は予告なく変更される可能性があります。

### Kotlin コントラクトオプション
<primary-label ref="experimental-general"/>

以下のオプションは、実験的な Kotlin コントラクト（contracts）機能を有効にします。

#### -Xallow-contracts-on-more-functions

プロパティアクセサ、特定の演算子関数、ジェネリック型に対する型アサーションなど、追加の宣言でコントラクトを有効にします。

#### -Xallow-condition-implies-returns-contracts

コントラクト内で `returnsNotNull()` 関数を使用して、特定の条件に対して非 null の戻り値を想定できるようにします。

#### -Xallow-holdsin-contract

コントラクト内で `holdsIn` キーワードを使用して、ラムダ内で boolean 条件が `true` であると想定できるようにします。

#### -Xallow-returns-result-of

`returnsResultOf()` コントラクトの使用を許可し、未使用の戻り値チェッカーが、無視できる結果と高階関数からの意味のある結果を区別できるようにします。

### -Xallow-reified-type-in-catch
<primary-label ref="experimental-general"/>

`inline` 関数の `catch` 節で reified（実体化された）`Throwable` 型パラメータのサポートを有効にします。

### -Xcollection-literals
<primary-label ref="experimental-general"/>

角括弧構文 `[]` による[コレクションリテラル](whatsnew24.md#support-for-collection-literals)のサポートを有効にします。

### -Xcompiler-plugin-order={plugin.before>plugin.after}
<primary-label ref="experimental-general"/>

コンパイラプラグインの実行順序を設定します。コンパイラはまず `plugin.before` を実行し、次に `plugin.after` を実行します。

3つ以上のプラグインに対して複数の順序ルールを定義できます。例：

```bash
kotlinc -Xcompiler-plugin-order=plugin.first>plugin.middle
kotlinc -Xcompiler-plugin-order=plugin.middle>plugin.last
```

これにより、以下の実行順序になります：

1. `plugin.first`
2. `plugin.middle`
3. `plugin.last`

コンパイラプラグインが存在しない場合、対応するルールは無視されます。

以下のプラグインを ID で設定できます：

| コンパイラプラグイン         | プラグイン ID                              |
|-----------------------------|--------------------------------------------|
| `all-open`, `kotlin-spring` | `org.jetbrains.kotlin.allopen`             |
| AtomicFU                    | `org.jetbrains.kotlinx.atomicfu`           |
| Compose                     | `androidx.compose.compiler.plugins.kotlin` |
| `js-plain-objects`          | `org.jetbrains.kotlinx.jspo`               |
| `jvm-abi-gen`               | `org.jetbrains.kotlin.jvm.abi`             |
| kapt                        | `org.jetbrains.kotlin.kapt3`               |
| Lombok                      | `org.jetbrains.kotlin.lombok`              |
| `no-arg`, `kotlin-jpa`      | `org.jetbrains.kotlin.noarg`               |
| Parcelize                   | `org.jetbrains.kotlin.parcelize`           |
| Power-assert                | `org.jetbrains.kotlin.powerassert`         |
| SAM with receiver           | `org.jetbrains.kotlin.samWithReceiver`     |
| Serialization               | `org.jetbrains.kotlinx.serialization`      |

この実行順序はコンパイラプラグインのバックエンドのみを制御し、フロントエンドは制御しません。

### -Xdata-flow-based-exhaustiveness
<primary-label ref="experimental-general"/>

`when` 式に対してデータフローに基づく網羅性（exhaustiveness）チェックを有効にします。

### -Xexplicit-context-arguments
<primary-label ref="experimental-general"/>

コンテキストパラメータに対する明示的な[コンテキスト引数](context-parameters.md#pass-context-arguments-explicitly)を有効にします。

これにより、呼び出し側でコンテキスト引数を渡すことで、オーバーロードの曖昧さを解消できるようになります。

### -Xklib-ir-inliner
<primary-label ref="experimental-general"/>

Kotlin/Native、Kotlin/JS、および Kotlin/Wasm に対して[モジュール内インライン化](whatsnew24.md#consistent-intra-module-function-inlining-during-klib-compilation)を有効にするかどうかを構成します。デフォルトでは有効になっています。

このオプションは以下のモードをサポートしています：

* `disabled`: Kotlin/Native、Kotlin/JS、および Kotlin/Wasm のモジュール内インライン化を無効にします。
* `full`: モジュール間インライン化を有効にします。

### -Xintrinsic-const-evaluation
<primary-label ref="experimental-general"/>

[向上したコンパイル時の定数](whatsnew24.md#improved-compile-time-constants)を有効にします。

### -Xname-based-destructuring
<primary-label ref="experimental-opt-in"/>

プロパティ名に基づく[分解宣言](destructuring-declarations.md#name-based-destructuring)をコンパイラがどのように解釈するかを構成します。

このオプションは以下のモードをサポートしています：

* `only-syntax`: 既存の分解宣言の動作を変更せずに、名前ベースの分解の明示的な形式を有効にします。
* `name-mismatch`: データクラスでのポジションベース（位置ベース）の分解において、変数名がプロパティ名と一致しない場合に警告を報告します。
* `complete`: 丸括弧を使用した短縮形式の名前ベースの分解を有効にし、角括弧構文によるポジションベースの分解のサポートを継続します。

### -Xphases-to-dump-before
<primary-label ref="experimental-general"/>

IR lowering コンパイルステージの後にダンプファイルを作成するには、`ExternalPackageParentPatcherLowering` に設定します。Kotlin/JVM の出力ディレクトリは [`-Xdump-directory`](#xdump-directory) コンパイラオプションで設定します。

### -Xrepl
<primary-label ref="experimental-general"/>

Kotlin REPL を起動します。

```bash
kotlinc -Xrepl
```

### -Xreturn-value-checker
<primary-label ref="experimental-general"/>

コンパイラが[無視された結果を報告する](unused-return-value-checker.md)方法を設定します：

* `disable`: 未使用の戻り値チェッカーを無効にします（デフォルト）。
* `check`: チェッカーを有効にし、マークされた関数からの無視された結果に対して警告を報告します。
* `full`: チェッカーを有効にし、プロジェクト内のすべての関数をマークされたものとして扱い、無視された結果に対して警告を報告します。

### 警告管理

#### -nowarn

コンパイル中のすべての警告を抑制します。

#### -Werror

すべての警告をコンパイルエラーとして扱います。

#### -Wextra

有効な場合に警告を発する[追加の宣言、式、および型のコンパイラチェック](whatsnew21.md#extra-compiler-checks)を有効にします。

#### -Xrender-internal-diagnostic-names
<primary-label ref="experimental-general"/>

警告とともに内部診断名を表示します。これは、`-Xwarning-level` オプションで構成する `DIAGNOSTIC_NAME` を特定するのに役立ちます。

#### -Xwarning-level
<primary-label ref="experimental-general"/>

特定のコンパイラ警告の重大度レベルを設定します：

```bash
kotlinc -Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: 指定された警告のみをエラーに引き上げます。
* `warning`: 指定された診断に対して警告を出力します（デフォルトで有効）。
* `disabled`: 指定された警告のみをモジュール全体で抑制します。

プロジェクト内での警告レポートは、モジュール全体のルールと特定のルールを組み合わせることで調整できます：

| コマンド                                           | 説明                                                   |
|----------------------------------------------------|--------------------------------------------------------|
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 指定されたもの以外のすべての警告を抑制します。         |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 指定されたもの以外のすべての警告をエラーに引き上げます。 |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 指定されたもの以外のすべての追加チェックを有効にします。 |

一般ルールから除外したい警告が多数ある場合は、[`@argfile`](#argfile) を使用して別のファイルにリストすることができます。

`DIAGNOSTIC_NAME` を確認するには、[`-Xrender-internal-diagnostic-names`](#xrender-internal-diagnostic-names) を使用してください。

### @argfile

指定されたファイルからコンパイラオプションを読み込みます。このようなファイルには、値を含むコンパイラオプションやソースファイルへのパスを含めることができます。オプションとパスは空白で区切る必要があります。例：

```
-include-runtime -d hello.jar hello.kt
```

空白を含む値を渡すには、シングルクォーテーション（**'**）またはダブルクォーテーション（**"**）で囲みます。値に引用符が含まれる場合は、バックスラッシュ（**\\**）でエスケープしてください。

```
-include-runtime -d 'My folder'
```

また、コンパイラオプションとソースファイルを分ける場合など、複数の引数ファイルを渡すことも可能です。

```bash
$ kotlinc @compiler.options @classes
```

ファイルが現在のディレクトリとは異なる場所にある場合は、相対パスを使用してください。

```bash
$ kotlinc @options/compiler.options hello.kt
```

## Kotlin/JVM コンパイラオプション

JVM 用の Kotlin コンパイラは、Kotlin ソースファイルを Java クラスファイルにコンパイルします。
Kotlin から JVM へのコンパイル用のコマンドラインツールは `kotlinc` および `kotlinc-jvm` です。
これらは Kotlin スクリプトファイルの実行にも使用できます。

[共通オプション](#common-options)に加えて、Kotlin/JVM コンパイラには以下のオプションがあります。

### -classpath _path_ (-cp _path_)

指定されたパスでクラスファイルを検索します。クラスパスの要素は、システムのパス区切り文字（Windows では **;**、macOS/Linux では **:**）で区切ります。
クラスパスには、ファイルやディレクトリのパス、ZIP、または JAR ファイルを含めることができます。

### -d _path_

生成されたクラスファイルを指定した場所に配置します。場所はディレクトリ、ZIP、または JAR ファイルが可能です。

### -include-runtime

生成される JAR ファイルに Kotlin ランタイムを含めます。これにより、生成されたアーカイブを Java が利用可能な任意の環境で実行できるようになります。

### -jdk-home _path_

デフォルトの `JAVA_HOME` と異なる場合に、クラスパスに含めるカスタム JDK ホームディレクトリを使用します。

### -Xjdk-release=version

<primary-label ref="experimental-general"/>

生成される JVM バイトコードのターゲットバージョンを指定します。クラスパス内の JDK の API を、指定された Java バージョンに制限します。
自動的に [`-jvm-target version`](#jvm-target-version) を設定します。
可能な値は `1.8`, `9`, `10`, ..., `26` です。

> このオプションは、すべての JDK ディストリビューションで効果があることが[保証されているわけではありません](https://youtrack.jetbrains.com/issue/KT-29974)。
>
{style="note"}

### -jvm-default _mode_

インターフェースで宣言された関数を JVM 上のデフォルトメソッドにコンパイルする方法を制御します。

| モード             | 説明                                                                                                                               |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `enable`           | インターフェースにデフォルト実装を生成し、サブクラスにブリッジ関数を含め、`DefaultImpls` クラスを生成します。（デフォルト）        |
| `no-compatibility` | インターフェースにデフォルト実装のみを生成し、互換性ブリッジや `DefaultImpls` クラスをスキップします。                            |
| `disable`          | 互換性ブリッジと `DefaultImpls` クラスのみを生成し、デフォルトメソッドをスキップします。                                            |

### -jvm-target _version_

生成される JVM バイトコードのターゲットバージョンを指定します。可能な値は `1.8`, `9`, `10`, ..., `26` です。
デフォルト値は `%defaultJvmTargetVersion%` です。

### -java-parameters

メソッドパラメータに関する Java 1.8 リフレクション用のメタデータを生成します。

### -module-name _name_ (JVM)

生成される `.kotlin_module` ファイルにカスタム名を設定します。
  
### -no-jdk

Java ランタイムを自動的にクラスパスに含めません。

### -no-reflect

Kotlin リフレクション（`kotlin-reflect.jar`）を自動的にクラスパスに含めません。

### -no-stdlib (JVM)

Kotlin/JVM 標準ライブラリ（`kotlin-stdlib.jar`）および Kotlin リフレクション（`kotlin-reflect.jar`）を自動的にクラスパスに含めません。
  
### -script-templates _classnames[,]_

スクリプト定義テンプレートクラスを指定します。完全修飾クラス名を使用し、カンマ（**,**）で区切ります。

### -Xdump-directory
<primary-label ref="experimental-general"/>

[-Xphases-to-dump-before`](#xphases-to-dump-before) コンパイラオプションのダンプファイルディレクトリを設定します。

### -Xjvm-expose-boxed
<primary-label ref="experimental-general"/>

モジュール内のすべてのインライン値クラスのボックス化（boxed）バージョンと、それらを使用する関数のボックス化バリアントを生成し、両方を Java からアクセス可能にします。詳細については、Java から Kotlin を呼び出すためのガイドの[インライン値クラス](java-to-kotlin-interop.md#inline-value-classes)を参照してください。

### -Xnullability-annotations
<primary-label ref="experimental-general"/>

特定の Java パッケージからの Null 許容性アノテーションを Kotlin コンパイラがどのように解釈するかを構成します。

サポートされているアノテーションと構成オプションの全リストについては、[Null 許容性アノテーション](java-interop.md#nullability-annotations)を参照してください。

## Kotlin/JS compiler options

JS 用の Kotlin コンパイラは、Kotlin ソースファイルを JavaScript コードにコンパイルします。
Kotlin から JS へのコンパイル用のコマンドラインツールは `kotlinc-js` です。

[共通オプション](#common-options)に加えて、Kotlin/JS コンパイラには以下のオプションがあります。

### -libraries _path_

`.meta.js` および `.kjsm` ファイルを含む Kotlin ライブラリへのパス。システムのパス区切り文字で区切ります。

### -main _{call|noCall}_

実行時に `main` 関数を呼び出すかどうかを定義します。

### -meta-info

メタデータを含む `.meta.js` および `.kjsm` ファイルを生成します。JS ライブラリを作成するときにこのオプションを使用します。

### -module-kind {umd|commonjs|amd|plain}

コンパイラによって生成される JS モジュールの種類：

- `umd` - [Universal Module Definition](https://github.com/umdjs/umd) モジュール
- `commonjs` - [CommonJS](http://www.commonjs.org/) モジュール
- `amd` - [Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) モジュール
- `plain` - プレーンな JS モジュール
    
異なる種類の JS モジュールとその違いの詳細については、[こちらの記事](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)を参照してください。

### -no-stdlib (JS)

デフォルトの Kotlin/JS 標準ライブラリをコンパイル依存関係に自動的に含めません。

### -output _filepath_

コンパイル結果の出力先ファイルを設定します。値は、ファイル名を含む `.js` ファイルへのパスである必要があります。

### -output-postfix _filepath_

指定されたファイルの内容を出力ファイルの最後に追加します。

### -output-prefix _filepath_

指定されたファイルの内容を出力ファイルの最初に追加します。

### -source-map

ソースマップを生成します。

### -source-map-base-dirs _path_

指定されたパスをベースディレクトリとして使用します。ベースディレクトリは、ソースマップ内の相対パスの計算に使用されます。

### -source-map-embed-sources _{always|never|inlining}_

ソースファイルをソースマップに埋め込みます。

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

Kotlin コードで宣言した変数名と関数名をソースマップに追加します。

| 設定 | 説明 | 出力例 |
|---|---|---|
| `simple-names` | 変数名と単純な関数名が追加されます。（デフォルト） | `main` |
| `fully-qualified-names` | 変数名と完全修飾された関数名が追加されます。 | `com.example.kjs.playground.main` |
| `no` | 変数名や関数名は追加されません。 | N/A |

### -source-map-prefix

ソースマップ内のパスに指定されたプレフィックスを追加します。

### -target {es5|es2015}

指定された ECMA バージョン用の JS ファイルを生成します。

### -Xenable-implementing-interfaces-from-typescript
<primary-label ref="experimental-general"/>

JavaScript/TypeScript から、`@JsExport` アノテーションでエクスポートされた [Kotlin インターフェースの実装](whatsnew2320.md#implementing-kotlin-interfaces-from-javascript-typescript)を許可します。

### -Xes-long-as-bigint
<primary-label ref="experimental-general"/>

モダンな JavaScript (ES2020) へのコンパイル時に、Kotlin の `Long` 値を表すために JavaScript の `BigInt` 型のサポートを有効にします。

## Kotlin/Native コンパイラオプション

Kotlin/Native コンパイラは、Kotlin ソースファイルを[サポートされているプラットフォーム](native-overview.md#target-platforms)用のネイティブバイナリにコンパイルします。
Kotlin/Native コンパイル用のコマンドラインツールは `kotlinc-native` です。

[共通オプション](#common-options)に加えて、Kotlin/Native コンパイラには以下のオプションがあります。

### -enable-assertions (-ea)

生成されたコードでランタイムアサーションを有効にします。

### -entry _name_ (-e _name_)

完全修飾されたエントリポイント名を指定します。

### -g

デバッグ情報の出力を有効にします。このオプションは最適化レベルを下げるため、[`-opt`](#opt) オプションと組み合わせるべきではありません。
    
### -generate-test-runner (-tr)

プロジェクトからユニットテストを実行するためのアプリケーションを生成します。

### -generate-no-exit-test-runner (-trn)

明示的なプロセス終了を行わずにユニットテストを実行するためのアプリケーションを生成します。

### -include-binary _path_ (-ib _path_)

生成された klib ファイル内に外部バイナリをパックします。

### -library _path_ (-l _path_)

ライブラリとリンクします。Kotlin/Native プロジェクトでのライブラリの使用については、[Kotlin/Native ライブラリ](native-libraries.md)を参照してください。

### -library-version _version_ (-lv _version_)

ライブラリのバージョンを設定します。

### -linker-option

バイナリビルド中にリンカーに引数を渡します。これは、特定のネイティブライブラリに対してリンクするために使用できます。

### -linker-options _args_

バイナリビルド中にリンカーに複数の引数を渡します。引数は空白で区切ります。
    
### -list-targets

利用可能なハードウェアターゲットを一覧表示します。

### -manifest _path_

マニフェスト追記ファイルを提供します。

### -module-name _name_ (Native)

コンパイルモジュールの名前を指定します。
このオプションは、Objective-C にエクスポートされる宣言のプレフィックスを指定するためにも使用できます：
[Kotlin フレームワークにカスタムの Objective-C プレフィックス/名前を指定するにはどうすればよいですか？](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

ネイティブビットコードライブラリを含めます。

### -no-default-libs

ユーザーコードと、コンパイラに同梱されているビルド済みの[プラットフォームライブラリ](native-platform-libs.md)とのリンクを無効にします。

### -nomain

`main` エントリポイントが外部ライブラリによって提供されるものと想定します。

### -nopack

ライブラリを klib ファイルにパックしません。

### -nostdlib

標準ライブラリ（stdlib）とリンクしません。

### -opt

コンパイルの最適化を有効にし、実行時のパフォーマンスが優れたバイナリを生成します。最適化レベルを下げる [`-g`](#g) オプションと組み合わせることは推奨されません。

### -output _name_ (-o _name_)

出力ファイルの名前を設定します。

### -produce _output_ (-p _output_)

出力ファイルの種類を指定します：

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _path_ (-r _path_)

ライブラリ検索パス。詳細は [ライブラリ検索順序](native-libraries.md#library-search-sequence) を参照してください。

### -target _target_

ハードウェアターゲットを設定します。利用可能なターゲットのリストを表示するには、[`-list-targets`](#list-targets) オプションを使用します。

### -Xccall-mode
<primary-label ref="experimental-general"/>

cinterop 経由でインポートされた C または Objective-C ライブラリ用の[新しい相互運用モード](whatsnew2320.md#new-interoperability-mode-for-c-or-objective-c-libraries)を有効にします。

### -Xoverride-konan-properties=min.version.*
<primary-label ref="experimental-general"/>

Kotlin のデフォルトよりも低い、サポートされる Apple ターゲットのバージョンを構成します。例：

```bash
kotlinc -Xoverride-konan-properties=minVersion.ios=14.0
kotlinc -Xoverride-konan-properties=minVersion.macos=11.0
kotlinc -Xoverride-konan-properties=minVersion.tvos=14.0
kotlinc -Xoverride-konan-properties=minVersion.watchos=7.0