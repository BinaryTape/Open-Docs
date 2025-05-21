---
title: 定義ファイル
---
Kotlin/Native を使うと、C および Objective-C のライブラリを利用し、Kotlin でその機能を使用できます。
cinterop と呼ばれる特別なツールは、C または Objective-C のライブラリを受け取り、対応する Kotlin バインディングを生成します。
これにより、ライブラリのメソッドを通常どおり Kotlin コードで使用できます。

これらのバインディングを生成するには、各ライブラリに定義ファイルが必要です。通常、ライブラリと同じ名前になります。
これは、ライブラリをどのように使用するかを正確に記述するプロパティファイルです。利用可能な[プロパティの一覧](#properties)をご覧ください。

プロジェクトを扱う場合の一般的なワークフローを次に示します。

1. バインディングに含めるものを記述する `.def` ファイルを作成します。
2. 生成されたバインディングを Kotlin コードで使用します。
3. Kotlin/Native コンパイラを実行して、最終的な実行可能ファイルを生成します。

## 定義ファイルの作成と構成

定義ファイルを作成し、C ライブラリのバインディングを生成してみましょう。

1. IDE で、`src` フォルダを選択し、**File | New | Directory** で新しいディレクトリを作成します。
2. 新しいディレクトリに `nativeInterop/cinterop` という名前を付けます。
   
   これは `.def` ファイルの場所のデフォルトの規則ですが、別の場所を使用する場合は、`build.gradle.kts` ファイルでオーバーライドできます。
3. 新しいサブフォルダを選択し、**File | New | File** で `png.def` ファイルを作成します。
4. 必要なプロパティを追加します。

   ```none
   headers = png.h
   headerFilter = png.h
   package = png
   
   compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
   linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
   linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
   ```

   * `headers` は、Kotlin スタブを生成するヘッダーファイルのリストです。このエントリには、スペースで区切って複数のファイルを追加できます。
     この場合は、`png.h` のみです。参照されるファイルは、指定されたパス (この場合は `/usr/include/png`) で利用可能である必要があります。
   * `headerFilter` は、何が含まれているかを正確に示します。C では、あるファイルが `#include` ディレクティブで別のファイルを参照している場合、すべてのヘッダーも含まれます。
     不要な場合もあり、[glob パターンを使用](https://en.wikipedia.org/wiki/Glob_(programming))して、このパラメータを追加して調整できます。

     外部依存関係 (システムの `stdint.h` ヘッダーなど) を interop ライブラリにフェッチしたくない場合は、`headerFilter` を使用できます。
     また、ライブラリサイズの最適化や、システムと提供されている Kotlin/Native コンパイル環境間の潜在的な競合を修正するのに役立つ場合があります。

   * 特定のプラットフォームの動作を変更する必要がある場合は、`compilerOpts.osx` や `compilerOpts.linux` のような形式を使用して、プラットフォーム固有の値をオプションに指定できます。
     この場合、これらは macOS (`.osx` サフィックス) と Linux (`.linux` サフィックス) です。サフィックスのないパラメータ (たとえば、`linkerOpts=`) も可能で、すべてのプラットフォームに適用されます。

5. バインディングを生成するには、通知の **Sync Now** をクリックして Gradle ファイルを同期します。

   <img src="/img/gradle-sync.png" alt="Gradle ファイルの同期" style={{verticalAlign: 'middle'}}/>

バインディングの生成後、IDE はそれらをネイティブライブラリのプロキシビューとして使用できます。

:::note
コマンドラインで [cinterop ツール](#generate-bindings-using-command-line) を使用して、バインディングの生成を構成することもできます。

## プロパティ

生成されたバイナリの内容を調整するために定義ファイルで使用できるプロパティの完全なリストを次に示します。
詳細については、以下の対応するセクションを参照してください。

| **プロパティ**                                                                        | **説明**                                                                                                                                                                                                          |
|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | バインディングに含めるライブラリのヘッダーのリスト。                                                                                                                                                       |
| [`modules`](#import-modules)                                                        | バインディングに含める Objective-C ライブラリの Clang モジュールのリスト。                                                                                                                                    |
| `language`                                                                          | 言語を指定します。デフォルトでは C が使用されます。必要に応じて `Objective-C` に変更してください。                                                                                                                                      |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinterop ツールが C コンパイラに渡すコンパイラオプション。                                                                                                                                                        |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinterop ツールがリンカに渡すリンカオプション。                                                                                                                                                              |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 無視する必要がある関数名のスペース区切りのリスト。                                                                                                                                                         |                                              
| `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| [`staticLibraries`](#include-a-static-library)                                      | [試験的](components-stability#stability-levels-explained)。静的ライブラリを `.klib` に含めます。                                                                                                              |
| [`libraryPaths`](#include-a-static-library)                                         | [試験的](components-stability#stability-levels-explained)。cinterop ツールが `.klib` に含めるライブラリを検索するディレクトリのスペース区切りのリスト。                                    |
| `packageName`                                                                       | 生成された Kotlin API のパッケージプレフィックス。                                                                                                                                                                             |
| [`headerFilter`](#filter-headers-by-globs)                                          | glob でヘッダーをフィルタリングし、ライブラリのインポート時にそれらのみを含めます。                                                                                                                                                |
| [`excludeFilter`](#exclude-headers)                                                 | ライブラリのインポート時に特定のヘッダーを除外し、`headerFilter` よりも優先されます。                                                                                                                               |
| [`strictEnums`](#configure-enums-generation)                                        | [Kotlin 列挙型](enum-classes)として生成する必要がある列挙型のスペース区切りのリスト。                                                                                                                             |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 整数値として生成する必要がある列挙型のスペース区切りのリスト。                                                                                                                                             |
| [`noStringConversion`](#set-up-string-conversion)                                   | `const char*` パラメータを Kotlin `String` に自動変換しない関数のスペース区切りのリスト。                                                                                                     |
| `allowedOverloadsForCFunctions`                                                     | デフォルトでは、C 関数には一意の名前が付いていると想定されます。複数の関数に同じ名前が付いている場合は、1 つだけが選択されます。ただし、`allowedOverloadsForCFunctions` でこれらの関数を指定することで、これを変更できます。 |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | `super()` コンストラクタとして指定されていない Objective-C イニシャライザの呼び出しを許可しないコンパイラチェックを無効にします。                                                                                              |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | Objective-C コードからの例外を `ForeignException` 型の Kotlin 例外にラップします。                                                                                                                          |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | たとえば、リンカエラーの解決を支援するために、カスタムメッセージを追加します。                                                                                                                                                 |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

プロパティのリストに加えて、定義ファイルに[カスタム宣言](#add-custom-declarations)を含めることができます。

### ヘッダーのインポート

C ライブラリに Clang モジュールがなく、代わりにヘッダーのセットで構成されている場合は、`headers` プロパティを使用して、インポートする必要があるヘッダーを指定します。

```none
headers = curl/curl.h
```

#### glob によるヘッダーのフィルタリング

`.def` ファイルのフィルタプロパティを使用して、glob でヘッダーをフィルタリングできます。ヘッダーからの宣言を含めるには、`headerFilter` プロパティを使用します。ヘッダーが glob のいずれかに一致する場合、その宣言はバインディングに含まれます。

glob は、適切なインクルードパス要素に対する相対的なヘッダーパス (たとえば、`time.h` または `curl/curl.h`) に適用されます。
したがって、通常、ライブラリが `#include <SomeLibrary/Header.h>` でインクルードされている場合は、おそらく次のフィルタでヘッダーをフィルタリングできます。

```none
headerFilter = SomeLibrary/**
```

`headerFilter` が指定されていない場合は、すべてのヘッダーが含まれます。ただし、`headerFilter` を使用して、glob をできるだけ正確に指定することをお勧めします。この場合、生成されるライブラリには必要な宣言のみが含まれます。開発環境で Kotlin またはツールをアップグレードする際に、さまざまな問題を回避するのに役立ちます。

#### ヘッダーの除外

特定のヘッダーを除外するには、`excludeFilter` プロパティを使用します。指定されたヘッダーからの宣言はバインディングに含まれないため、冗長または問題のあるヘッダーを削除し、コンパイルを最適化するのに役立ちます。

```none
excludeFilter = SomeLibrary/time.h
```

同じヘッダーが `headerFilter` でインクルードされ、`excludeFilter` で除外されている場合、指定されたヘッダーはバインディングに含まれません。

:::

### モジュールのインポート

Objective-C ライブラリに Clang モジュールがある場合は、`modules` プロパティを使用して、インポートするモジュールを指定します。

```none
modules = UIKit
```

### コンパイラおよびリンカオプションの受け渡し

`compilerOpts` プロパティを使用して、C コンパイラにオプションを渡します。これは、内部でヘッダーを分析するために使用されます。
最終的な実行可能ファイルをリンクするために使用されるリンカにオプションを渡すには、`linkerOpts` を使用します。例:

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

この構成では、Linux では `-DBAR=bar -DFOO=foo1`、macOS では `-DBAR=bar -DFOO=foo2` を使用してヘッダーが分析されます。定義ファイルオプションには、共通部分とプラットフォーム固有の部分の両方を含めることができることに注意してください。

### 特定の関数の無視

無視する必要がある関数名のリストを指定するには、`excludedFunctions` プロパティを使用します。これは、ヘッダーで宣言されている関数が呼び出し可能であることが保証されていない場合、および
これを自動的に判断することが困難または不可能な場合に役立ちます。このプロパティを使用して、interop 自体のバグを回避することもできます。

### 静的ライブラリの組み込み

:::caution
この機能は[試験的](components-stability#stability-levels-explained)です。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。

:::

場合によっては、ユーザーの環境内で静的ライブラリが利用可能であることを前提とするのではなく、製品に静的ライブラリを同梱する方が便利な場合があります。静的ライブラリを `.klib` に含めるには、`staticLibrary` および `libraryPaths` プロパティを使用します。

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

上記のスニペットが指定されている場合、cinterop ツールは `/opt/local/lib` および `/usr/local/opt/curl/lib` で `libfoo.a` を検索し、見つかった場合はライブラリバイナリを `klib` に含めます。

プログラムでこのような `klib` を使用すると、ライブラリは自動的にリンクされます。

### 列挙型の生成の構成

列挙型を Kotlin 列挙型として生成するには `strictEnums` プロパティを使用し、整数値として生成するには `nonStrictEnums` を使用します。列挙型がこれらのリストのいずれにも含まれていない場合は、ヒューリスティックに基づいて生成されます。

### 文字列変換の設定

`const char*` 関数のパラメータを Kotlin `String` として自動的に変換しないようにするには、`noStringConversion` プロパティを使用します。

### 指定されていないイニシャライザの呼び出しを許可する

デフォルトでは、Kotlin/Native コンパイラは、指定されていない Objective-C イニシャライザを `super()` コンストラクタとして呼び出すことを許可しません。指定された Objective-C イニシャライザがライブラリで適切にマークされていない場合、この動作は不便な場合があります。これらのコンパイラチェックを無効にするには、`disableDesignatedInitializerChecks` プロパティを使用します。

### Objective-C 例外の処理

デフォルトでは、Objective-C 例外が Objective-C から Kotlin への interop 境界に到達して Kotlin コードに到達すると、プログラムはクラッシュします。

Objective-C 例外を Kotlin に伝播するには、`foreignExceptionMode = objc-wrap` プロパティでラップを有効にします。
この場合、Objective-C 例外は `ForeignException` 型を取得する Kotlin 例外に変換されます。

#### リンカエラーの解決の支援

Kotlin ライブラリが C または Objective-C ライブラリに依存している場合、たとえば、[CocoaPods 統合](native-cocoapods)を使用している場合、リンカエラーが発生する可能性があります。依存ライブラリがローカルマシンにインストールされていないか、プロジェクトビルドスクリプトで明示的に構成されていない場合、「Framework not found」エラーが発生します。

ライブラリの作成者である場合は、カスタムメッセージでリンカエラーの解決を支援できます。
そのためには、`.def` ファイルに `userSetupHint=message` プロパティを追加するか、`-Xuser-setup-hint` コンパイラオプションを `cinterop` に渡します。

### カスタム宣言の追加

場合によっては、バインディングを生成する前にカスタム C 宣言をライブラリに追加する必要があります (たとえば、[マクロ](native-c-interop#macros)の場合)。
これらの宣言を含む追加のヘッダーファイルを作成する代わりに、区切り記号シーケンス `---` のみを含む区切り行の後に、`.def` ファイルの末尾に直接含めることができます。

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

この `.def` ファイルの部分はヘッダーファイルの一部として扱われるため、本体を含む関数は `static` として宣言する必要があることに注意してください。宣言は、`headers` リストからファイルをインクルードした後に解析されます。

## コマンドラインを使用したバインディングの生成

定義ファイルに加えて、対応するプロパティを `cinterop` 呼び出しのオプションとして渡すことで、バインディングに含めるものを指定できます。

コンパイルされた `png.klib` ライブラリを生成するコマンドの例を次に示します。

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

生成されたバインディングは一般的にプラットフォーム固有であるため、複数のターゲット向けに開発している場合は、バインディングを再生成する必要があります。

* sysroot 検索パスに含まれていないホストライブラリの場合、ヘッダーが必要になる場合があります。
* 構成スクリプトを使用する一般的な UNIX ライブラリの場合、`compilerOpts` には、`--cflags` オプション (正確なパスなしの場合があります) を使用した構成スクリプトの出力が含まれる可能性があります。
* `--libs` を使用した構成スクリプトの出力は、`linkerOpts` プロパティに渡すことができます。

## 次のステップ

* [C-interoperability のバインディング](native-c-interop#bindings)
* [Swift/Objective-C との相互運用性](native-objc-interop)
  ```