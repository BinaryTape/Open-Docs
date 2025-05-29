[//]: # (title: 定義ファイル)

Kotlin/Native を使用すると、C および Objective-C ライブラリを利用して、その機能を Kotlin で使用できます。cinterop と呼ばれる特殊なツールは、C または Objective-C ライブラリを取り込み、対応する Kotlin バインディングを生成するため、ライブラリのメソッドを Kotlin コードで通常通り使用できます。

これらのバインディングを生成するには、各ライブラリに定義ファイルが必要です。通常、ライブラリと同じ名前になります。これは、ライブラリがどのように利用されるべきかを正確に記述するプロパティファイルです。利用可能なプロパティの完全なリストは、[こちら](#properties)を参照してください。

プロジェクトで作業する際の一般的なワークフローを以下に示します。

1.  バインディングに含める内容を記述する `.def` ファイルを作成します。
2.  生成されたバインディングを Kotlin コードで使用します。
3.  Kotlin/Native コンパイラを実行して、最終的な実行可能ファイルを生成します。

## 定義ファイルの作成と構成

定義ファイルを作成し、C ライブラリのバインディングを生成してみましょう。

1.  IDE で `src` フォルダーを選択し、**File | New | Directory** で新しいディレクトリを作成します。
2.  新しいディレクトリに `nativeInterop/cinterop` という名前を付けます。
    
    これは `.def` ファイルの場所のデフォルトの規約ですが、別の場所を使用する場合は `build.gradle.kts` ファイルで上書きできます。
3.  新しいサブフォルダーを選択し、**File | New | File** で `png.def` ファイルを作成します。
4.  必要なプロパティを追加します。

    ```none
    headers = png.h
    headerFilter = png.h
    package = png
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
    ```

    *   `headers` は、Kotlin スタブを生成するヘッダーファイルのリストです。このエントリには複数のファイルを追加でき、それぞれをスペースで区切ります。このケースでは `png.h` のみです。参照されるファイルは指定されたパス (このケースでは `/usr/include/png`) 上に存在する必要があります。
    *   `headerFilter` は、何が正確に含まれるかを示します。C では、あるファイルが `#include` ディレクティブで別のファイルを参照すると、すべてのヘッダーも含まれます。場合によってはこれは必要なく、[glob パターン](https://en.wikipedia.org/wiki/Glob_(programming))を使用してこのパラメーターを追加することで調整できます。
    
        `headerFilter` は、外部依存関係 (システム `stdint.h` ヘッダーなど) を interop ライブラリに取り込みたくない場合に使用できます。また、ライブラリサイズの最適化や、システムと提供される Kotlin/Native コンパイル環境との間の潜在的な競合を修正するのに役立つ場合があります。
    
    *   特定のプラットフォームの動作を変更する必要がある場合は、`compilerOpts.osx` や `compilerOpts.linux` のような形式を使用して、オプションにプラットフォーム固有の値を提供できます。このケースでは、macOS (`.osx` サフィックス) と Linux (`.linux` サフィックス) です。サフィックスなしのパラメーター (例: `linkerOpts=`) も可能で、すべてのプラットフォームに適用されます。

5.  バインディングを生成するには、通知の **Sync Now** をクリックして Gradle ファイルを同期します。

    ![Gradle ファイルを同期](gradle-sync.png)

バインディングの生成後、IDE はそれらをネイティブライブラリのプロキシビューとして使用できます。

> コマンドラインで [cinterop ツール](#generate-bindings-using-command-line)を使用してバインディング生成を構成することもできます。
> 
{style="tip"}

## プロパティ

以下は、生成されるバイナリの内容を調整するために定義ファイルで使用できるプロパティの完全なリストです。詳細については、以下の対応するセクションを参照してください。

| **プロパティ**                                                                        | **説明**                                                                                                                                                                                                          |
|:------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | バインディングに含めるライブラリのヘッダーのリスト。                                                                                                                                                       |
| [`modules`](#import-modules)                                                        | バインディングに含める Objective-C ライブラリの Clang モジュールのリスト。                                                                                                                                    |
| `language`                                                                          | 言語を指定します。デフォルトでは C が使用されます。必要に応じて `Objective-C` に変更します。                                                                                                                                      |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinterop ツールが C コンパイラに渡すコンパイラオプション。                                                                                                                                                        |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinterop ツールがリンカーに渡すリンカーオプション。                                                                                                                                                              |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 無視すべき関数名をスペース区切りでリストします。                                                                                                                                                         |
| [`staticLibraries`](#include-a-static-library)                                      | [実験的機能](components-stability.md#stability-levels-explained)。静的ライブラリを `.klib` に含めます。                                                                                                              |
| [`libraryPaths`](#include-a-static-library)                                         | [実験的機能](components-stability.md#stability-levels-explained)。cinterop ツールが `.klib` に含めるライブラリを検索するディレクトリのスペース区切りリスト。                                    |
| `packageName`                                                                       | 生成される Kotlin API のパッケージプレフィックス。                                                                                                                                                                             |
| [`headerFilter`](#filter-headers-by-globs)                                          | glob でヘッダーをフィルタリングし、ライブラリをインポートする際にそれらのみを含めます。                                                                                                                                                |
| [`excludeFilter`](#exclude-headers)                                                 | ライブラリをインポートする際に特定のヘッダーを除外し、`headerFilter` よりも優先されます。                                                                                                                               |
| [`strictEnums`](#configure-enums-generation)                                        | [Kotlin 列挙型](enum-classes.md)として生成されるべき列挙型のスペース区切りリスト。                                                                                                                             |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 整数値として生成されるべき列挙型のスペース区切りリスト。                                                                                                                                             |
| [`noStringConversion`](#set-up-string-conversion)                                   | `const char*` パラメーターが Kotlin の `String` に自動変換されないようにすべき関数のスペース区切りリスト。                                                                                                     |
| `allowedOverloadsForCFunctions`                                                     | デフォルトでは、C 関数は一意の名前を持つと想定されています。複数の関数が同じ名前を持つ場合、1つのみが選択されます。ただし、`allowedOverloadsForCFunctions` でこれらの関数を指定することで、この動作を変更できます。 |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 非指定 Objective-C 初期化子を `super()` コンストラクタとして呼び出すことを許可しないコンパイラのチェックを無効にします。                                                                                              |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | Objective-C コードからの例外を `ForeignException` 型の Kotlin 例外にラップします。                                                                                                                          |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | カスタムメッセージを追加します。たとえば、ユーザーがリンカーエラーを解決するのに役立ちます。                                                                                                                                                 |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

プロパティのリストに加えて、定義ファイルに[カスタム宣言](#add-custom-declarations)を含めることができます。

### ヘッダーのインポート

C ライブラリが Clang モジュールを持たず、代わりにヘッダーのセットで構成されている場合は、`headers` プロパティを使用してインポートすべきヘッダーを指定します。

```none
headers = curl/curl.h
```

#### glob でヘッダーをフィルタリング

`.def` ファイルのフィルタプロパティを使用して、glob でヘッダーをフィルタリングできます。ヘッダーからの宣言を含めるには、`headerFilter` プロパティを使用します。ヘッダーがいずれかの glob に一致する場合、その宣言はバインディングに含まれます。

glob は、適切なインクルードパス要素に対する相対的なヘッダーパスに適用されます。たとえば、`time.h` や `curl/curl.h` などです。したがって、ライブラリが通常 `#include <SomeLibrary/Header.h>` でインクルードされる場合、以下のフィルタでヘッダーをフィルタリングできるでしょう。

```none
headerFilter = SomeLibrary/**
```

`headerFilter` が提供されない場合、すべてのヘッダーが含まれます。ただし、`headerFilter` を使用し、glob を可能な限り正確に指定することを推奨します。この場合、生成されるライブラリには必要な宣言のみが含まれます。これにより、開発環境の Kotlin やツールをアップグレードする際のさまざまな問題を回避するのに役立ちます。

#### ヘッダーを除外

特定のヘッダーを除外するには、`excludeFilter` プロパティを使用します。これにより、不要なヘッダーや問題のあるヘッダーを削除し、コンパイルを最適化するのに役立ちます。指定されたヘッダーからの宣言はバインディングに含まれないためです。

```none
excludeFilter = SomeLibrary/time.h
```

> 同じヘッダーが `headerFilter` で含まれ、かつ `excludeFilter` で除外された場合、そのヘッダーはバインディングに含まれません。
>
{style="note"}

### モジュールのインポート

Objective-C ライブラリが Clang モジュールを持っている場合は、`modules` プロパティを使用してインポートすべきモジュールを指定します。

```none
modules = UIKit
```

### コンパイラおよびリンカーオプションの渡す

`compilerOpts` プロパティを使用して、内部でヘッダーを解析するために使用される C コンパイラにオプションを渡します。最終的な実行可能ファイルをリンクするために使用されるリンカーにオプションを渡すには、`linkerOpts` を使用します。例:

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

特定のターゲットにのみ適用されるターゲット固有のオプションを指定することもできます。

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

この構成では、Linux では `-DBAR=bar -DFOO=foo1` を使用して、macOS では `-DBAR=bar -DFOO=foo2` を使用してヘッダーが解析されます。任意の定義ファイルオプションは、共通部分とプラットフォーム固有部分の両方を持つことができることに注意してください。

### 特定の関数を無視

`excludedFunctions` プロパティを使用して、無視すべき関数名のリストを指定します。これは、ヘッダーで宣言された関数が呼び出し可能であることが保証されない場合や、これを自動的に判断するのが困難または不可能な場合に役立ちます。また、このプロパティを使用して、interop 自体のバグを回避することもできます。

### 静的ライブラリを含める

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
>
{style="warning"}

ユーザーの環境で静的ライブラリが利用可能であると想定するよりも、製品に静的ライブラリを同梱する方が便利な場合があります。静的ライブラリを `.klib` に含めるには、`staticLibrary` および `libraryPaths` プロパティを使用します。

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

上記のスニペットが与えられた場合、cinterop ツールは `/opt/local/lib` および `/usr/local/opt/curl/lib` で `libfoo.a` を検索し、見つかった場合はそのライブラリバイナリを `klib` に含めます。

プログラムでこのような `klib` を使用すると、ライブラリは自動的にリンクされます。

### 列挙型の生成を構成

`strictEnums` プロパティを使用して列挙型を Kotlin の列挙型として生成するか、`nonStrictEnums` を使用して整数値として生成します。列挙型がいずれのリストにも含まれていない場合、ヒューリスティックに基づいて生成されます。

### 文字列変換を設定

`noStringConversion` プロパティを使用して、`const char*` 関数パラメーターの Kotlin の `String` への自動変換を無効にします。

### 非指定初期化子の呼び出しを許可

デフォルトでは、Kotlin/Native コンパイラは、非指定 Objective-C 初期化子を `super()` コンストラクタとして呼び出すことを許可しません。指定された Objective-C 初期化子がライブラリで適切にマークされていない場合、この動作は不便な場合があります。これらのコンパイラチェックを無効にするには、`disableDesignatedInitializerChecks` プロパティを使用します。

### Objective-C 例外を処理

デフォルトでは、Objective-C 例外が Objective-C から Kotlin への interop 境界に到達し、Kotlin コードに渡されると、プログラムがクラッシュします。

Objective-C 例外を Kotlin に伝播するには、`foreignExceptionMode = objc-wrap` プロパティを使用してラップを有効にします。この場合、Objective-C 例外は `ForeignException` 型の Kotlin 例外に変換されます。

### リンカーエラーの解決を支援

Kotlin ライブラリが C または Objective-C ライブラリに依存する場合、たとえば[CocoaPods 統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)を使用している場合、リンカーエラーが発生する可能性があります。依存するライブラリがローカルマシンにインストールされていないか、プロジェクトのビルドスクリプトで明示的に構成されていない場合、「Framework not found」エラーが発生します。

ライブラリの作成者であれば、カスタムメッセージを使用してユーザーがリンカーエラーを解決するのを助けることができます。そのためには、`userSetupHint=message` プロパティを `.def` ファイルに追加するか、`-Xuser-setup-hint` コンパイラオプションを `cinterop` に渡します。

### カスタム宣言を追加

バインディングを生成する前に、ライブラリにカスタム C 宣言を追加する必要がある場合があります (たとえば、[マクロ](native-c-interop.md#macros)の場合)。これらの宣言を含む追加のヘッダーファイルを作成する代わりに、区切りシーケンス `---` のみを含む区切り線の後に、`.def` ファイルの末尾に直接含めることができます。

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

この `.def` ファイルのこの部分はヘッダーファイルの一部として扱われるため、ボディを持つ関数は `static` として宣言する必要があることに注意してください。宣言は `headers` リストからのファイルを含んだ後に解析されます。

## コマンドラインを使用してバインディングを生成

定義ファイルに加えて、`cinterop` 呼び出しで対応するプロパティをオプションとして渡すことで、バインディングに含める内容を指定できます。

以下は、`png.klib` コンパイル済みライブラリを生成するコマンドの例です。

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

生成されるバインディングは通常、プラットフォーム固有であるため、複数のターゲット向けに開発している場合は、バインディングを再生成する必要があることに注意してください。

*   Sysroot の検索パスに含まれていないホストライブラリの場合、ヘッダーが必要になる場合があります。
*   構成スクリプトを持つ典型的な UNIX ライブラリの場合、`compilerOpts` には `--cflags` オプションを使用した構成スクリプトの出力が含まれる可能性が高いです (正確なパスなしの場合もあります)。
*   `--libs` を使用した構成スクリプトの出力は、`linkerOpts` プロパティに渡すことができます。

## 次のステップ

*   [C 相互運用機能のバインディング](native-c-interop.md#bindings)
*   [Swift/Objective-C との相互運用](native-objc-interop.md)