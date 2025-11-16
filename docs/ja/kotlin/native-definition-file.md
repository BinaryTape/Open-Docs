[//]: # (title: 定義ファイル)

Kotlin/Nativeを使用すると、CおよびObjective-Cライブラリを利用して、その機能をKotlinで使用できます。cinteropと呼ばれる特別なツールは、CまたはObjective-Cライブラリを受け取り、対応するKotlinバインディングを生成するため、ライブラリのメソッドを通常通りKotlinコードで使用できます。

これらのバインディングを生成するには、各ライブラリに定義ファイルが必要です。これは通常、ライブラリと同じ名前を持ちます。これは、ライブラリがどのように利用されるべきかを正確に記述するプロパティファイルです。利用可能なプロパティの全リストについては、[プロパティ](#properties)を参照してください。

プロジェクトで作業する際の一般的なワークフローを以下に示します。

1.  バインディングに何を含めるかを記述する`.def`ファイルを作成します。
2.  生成されたバインディングをKotlinコードで使用します。
3.  Kotlin/Nativeコンパイラを実行して最終的な実行可能ファイルを生成します。

## 定義ファイルの作成と設定

Cライブラリの定義ファイルを作成し、バインディングを生成しましょう。

1.  IDEで`src`フォルダーを選択し、**ファイル | 新規 | ディレクトリ**で新しいディレクトリを作成します。
2.  新しいディレクトリに`nativeInterop/cinterop`という名前を付けます。

    これは`.def`ファイルの場所に関するデフォルトの慣例ですが、異なる場所を使用する場合は`build.gradle.kts`ファイルで上書きできます。
3.  新しいサブフォルダーを選択し、**ファイル | 新規 | ファイル**で`png.def`ファイルを作成します。
4.  必要なプロパティを追加します。

    ```none
    headers = png.h
    headerFilter = png.h
    package = png

    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
    ```

    *   `headers`は、Kotlinスタブを生成するヘッダーファイルのリストです。このエントリには複数のファイルを追加でき、それぞれをスペースで区切ります。この場合、`png.h`のみです。参照されるファイルは、指定されたパス（この場合は`/usr/include/png`）で利用可能である必要があります。
    *   `headerFilter`は、具体的に何が含まれるかを示します。Cでは、あるファイルが別のファイルを`#include`ディレクティブで参照すると、すべてのヘッダーも含まれます。時にはこれは不要な場合があり、[globパターンを使用して](https://en.wikipedia.org/wiki/Glob_(programming))このパラメータを追加することで調整できます。

        `headerFilter`は、外部依存関係（システム`stdint.h`ヘッダーなど）をinteropライブラリに取り込みたくない場合に使用できます。また、ライブラリサイズの最適化や、システムと提供されるKotlin/Nativeコンパイル環境間の潜在的な競合を修正するのに役立つ場合があります。

    *   特定のプラットフォームの動作を変更する必要がある場合、`compilerOpts.osx`や`compilerOpts.linux`のような形式を使用して、プラットフォーム固有の値をオプションに提供できます。この場合、それらはmacOS（`.osx`サフィックス）とLinux（`.linux`サフィックス）です。サフィックスなしのパラメータ（例: `linkerOpts=`）も可能で、すべてのプラットフォームに適用されます。

5.  バインディングを生成するには、通知で**Sync Now**をクリックしてGradleファイルを同期します。

    ![Synchronize the Gradle files](gradle-sync.png)

バインディング生成後、IDEはそれらをネイティブライブラリのプロキシビューとして使用できます。

> コマンドラインで[cinteropツール](#generate-bindings-using-command-line)を使用してバインディングの生成を設定することもできます。
>
{style="tip"}

## プロパティ

以下は、生成されるバイナリの内容を調整するために定義ファイルで使用できるプロパティの全リストです。詳細については、以下の対応するセクションを参照してください。

| **Property**                                                                        | **Description**                                                                                                                                                                                                          |
| :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`headers`](#import-headers)                                                        | バインディングに含めるライブラリのヘッダーのリスト。                                                                                                                                                       |
| [`modules`](#import-modules)                                                        | バインディングに含めるObjective-CライブラリのClangモジュールのリスト。                                                                                                                                    |
| `language`                                                                          | 言語を指定します。デフォルトではCが使用されます。必要に応じて`Objective-C`に変更します。                                                                                                                                      |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinteropツールがCコンパイラに渡すコンパイラオプション。                                                                                                                                                        |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinteropツールがリンカーに渡すリンカーオプション。                                                                                                                                                              |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 無視すべき関数名のスペース区切りリスト。                                                                                                                                                         |
| [`staticLibraries`](#include-a-static-library)                                      | [実験的](components-stability.md#stability-levels-explained)。スタティックライブラリを`.klib`に含めます。                                                                                                              |
| [`libraryPaths`](#include-a-static-library)                                         | [実験的](components-stability.md#stability-levels-explained)。cinteropツールが`.klib`に含めるライブラリを検索するディレクトリのスペース区切りリスト。                                    |
| `packageName`                                                                       | 生成されるKotlin APIのパッケージプレフィックス。                                                                                                                                                                             |
| [`headerFilter`](#filter-headers-by-globs)                                          | ライブラリをインポートする際に、globでヘッダーをフィルタリングし、それらのみを含めます。                                                                                                                                                |
| [`excludeFilter`](#exclude-headers)                                                 | ライブラリをインポートする際に特定のヘッダーを除外し、`headerFilter`よりも優先されます。                                                                                                                               |
| [`strictEnums`](#configure-enums-generation)                                        | [Kotlin enum](enum-classes.md)として生成すべきenumのスペース区切りリスト。                                                                                                                             |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 整数値として生成すべきenumのスペース区切りリスト。                                                                                                                                             |
| [`noStringConversion`](#set-up-string-conversion)                                   | `const char*`パラメータがKotlin `String`に自動変換されるべきではない関数のスペース区切りリスト。                                                                                                     |
| `allowedOverloadsForCFunctions`                                                     | デフォルトでは、C関数は一意の名前を持つと仮定されます。複数の関数が同じ名前を持つ場合、1つだけが選択されます。ただし、`allowedOverloadsForCFunctions`でこれらの関数を指定することで、これを変更できます。 |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 非指定Objective-Cイニシャライザを`super()`コンストラクタとして呼び出すことを許可しないコンパイラチェックを無効にします。                                                                                              |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | Objective-Cコードからの例外を`ForeignException`型のKotlin例外にラップします。                                                                                                                          |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | たとえば、ユーザーがリンカーエラーを解決するのに役立つカスタムメッセージを追加します。                                                                                                                                                 |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

プロパティのリストに加えて、定義ファイルに[カスタム宣言](#add-custom-declarations)を含めることができます。

### ヘッダーのインポート

CライブラリがClangモジュールを持たず、代わりにヘッダーのセットで構成されている場合、`headers`プロパティを使用してインポートすべきヘッダーを指定します。

```none
headers = curl/curl.h
```

#### globによるヘッダーのフィルタリング

`.def`ファイルのフィルタープロパティを使用して、globでヘッダーをフィルタリングできます。ヘッダーからの宣言を含めるには、`headerFilter`プロパティを使用します。ヘッダーがいずれかのglobに一致する場合、その宣言はバインディングに含まれます。

globは、適切なインクルードパス要素に対する相対的なヘッダーパス（例: `time.h`や`curl/curl.h`）に適用されます。したがって、ライブラリが通常`#include <SomeLibrary/Header.h>`でインクルードされる場合、おそらく以下のフィルターでヘッダーをフィルタリングできます。

```none
headerFilter = SomeLibrary/**
```

`headerFilter`が指定されていない場合、すべてのヘッダーが含まれます。ただし、`headerFilter`を使用し、globをできるだけ正確に指定することをお勧めします。この場合、生成されたライブラリには必要な宣言のみが含まれます。これは、Kotlinや開発環境のツールをアップグレードする際に発生する様々な問題を回避するのに役立ちます。

#### ヘッダーの除外

特定のヘッダーを除外するには、`excludeFilter`プロパティを使用します。これは、不要なヘッダーや問題のあるヘッダーを削除し、コンパイルを最適化するのに役立ちます。指定されたヘッダーからの宣言はバインディングに含まれないためです。

```none
excludeFilter = SomeLibrary/time.h
```

> 同じヘッダーが`headerFilter`で含まれ、かつ`excludeFilter`で除外された場合、その指定されたヘッダーはバインディングに含まれません。
>
{style="note"}

### モジュールのインポート

Objective-CライブラリがClangモジュールを持っている場合、`modules`プロパティを使用して、インポートするモジュールを指定します。

```none
modules = UIKit
```

### コンパイラおよびリンカーオプションの受け渡し

`compilerOpts`プロパティを使用して、内部でヘッダーを分析するために使用されるCコンパイラにオプションを渡します。最終的な実行可能ファイルをリンクするために使用されるリンカーにオプションを渡すには、`linkerOpts`を使用します。例：

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

特定のターゲットにのみ適用されるターゲット固有のオプションも指定できます。

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

この設定では、ヘッダーはLinuxで`-DBAR=bar -DFOO=foo1`を使用し、macOSで`-DBAR=bar -DFOO=foo2`を使用して分析されます。定義ファイルオプションは、共通部分とプラットフォーム固有部分の両方を持つことができることに注意してください。

### 特定の関数を無視する

`excludedFunctions`プロパティを使用して、無視すべき関数名のリストを指定します。これは、ヘッダーで宣言された関数が呼び出し可能であることが保証されておらず、これを自動的に判断するのが困難または不可能な場合に役立ちます。このプロパティを、interop自体のバグを回避するためにも使用できます。

### スタティックライブラリを含める

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも廃止または変更される可能性があります。評価目的のみに使用してください。
>
{style="warning"}

ユーザーの環境で利用可能であると仮定するよりも、製品にスタティックライブラリを同梱する方が便利な場合があります。スタティックライブラリを`.klib`に含めるには、`staticLibraries`と`libraryPaths`プロパティを使用します。

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

上記のスニペットが与えられると、cinteropツールは`/opt/local/lib`と`/usr/local/opt/curl/lib`で`libfoo.a`を検索し、見つかった場合、ライブラリバイナリを`klib`に含めます。

プログラムでこのように`klib`を使用すると、ライブラリは自動的にリンクされます。

### enumの生成を設定する

`strictEnums`プロパティを使用してenumをKotlin enumとして生成するか、`nonStrictEnums`を使用して整数値として生成します。いずれのリストにもenumが含まれていない場合、ヒューリスティックに基づいて生成されます。

### 文字列変換の設定

`noStringConversion`プロパティを使用して、`const char*`関数パラメータのKotlin `String`への自動変換を無効にします。

### 非指定イニシャライザの呼び出しを許可する

デフォルトでは、Kotlin/Nativeコンパイラは非指定Objective-Cイニシャライザを`super()`コンストラクタとして呼び出すことを許可しません。この動作は、指定されたObjective-Cイニシャライザがライブラリ内で適切にマークされていない場合に不便になる可能性があります。これらのコンパイラチェックを無効にするには、`disableDesignatedInitializerChecks`プロパティを使用します。

### Objective-C例外の処理

デフォルトでは、Objective-C例外がObjective-CからKotlinへのinterop境界に到達し、Kotlinコードに渡された場合、プログラムはクラッシュします。

Objective-C例外をKotlinに伝播するには、`foreignExceptionMode = objc-wrap`プロパティでラッピングを有効にします。この場合、Objective-C例外は`ForeignException`型を持つKotlin例外に変換されます。

### リンカーエラーの解決を支援する

KotlinライブラリがCまたはObjective-Cライブラリに依存している場合、たとえば[CocoaPods連携](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を使用している場合、リンカーエラーが発生する可能性があります。依存ライブラリがマシンにローカルでインストールされていないか、プロジェクトのビルドスクリプトで明示的に設定されていない場合、「Framework not found」エラーが発生します。

ライブラリの作者である場合、カスタムメッセージでユーザーがリンカーエラーを解決するのを支援できます。これを行うには、`.def`ファイルに`userSetupHint=message`プロパティを追加するか、`-Xuser-setup-hint`コンパイラオプションを`cinterop`に渡します。

### カスタム宣言の追加

バインディングを生成する前に、カスタムC宣言をライブラリに追加する必要がある場合があります（たとえば、[マクロ](native-c-interop.md#macros)の場合など）。これらの宣言を含む追加のヘッダーファイルを作成する代わりに、区切り行（区切りシーケンス`---`のみを含む行）の後に、`.def`ファイルの末尾に直接含めることができます。

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

`.def`ファイルのこの部分はヘッダーファイルの一部として扱われるため、本体を持つ関数は`static`として宣言する必要があることに注意してください。宣言は`headers`リストからのファイルが含まれた後にパースされます。

## コマンドラインを使用したバインディングの生成

定義ファイルに加えて、`cinterop`呼び出しで対応するプロパティをオプションとして渡すことで、バインディングに何を含めるかを指定できます。

`png.klib`コンパイル済みライブラリを生成するコマンドの例を以下に示します。

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

生成されたバインディングは一般的にプラットフォーム固有であるため、複数のターゲット向けに開発している場合、バインディングを再生成する必要があることに注意してください。

*   sysroot検索パスに含まれていないホストライブラリの場合、ヘッダーが必要になる場合があります。
*   設定スクリプトを持つ一般的なUNIXライブラリの場合、`compilerOpts`には、`--cflags`オプションを持つ設定スクリプトの出力（正確なパスなしで）が含まれる可能性が高いです。
*   `--libs`を持つ設定スクリプトの出力は、`linkerOpts`プロパティに渡すことができます。

## 次のステップ

*   [C相互運用性向けのバインディング](native-c-interop.md#bindings)
*   [Swift/Objective-Cとの相互運用性](native-objc-interop.md)