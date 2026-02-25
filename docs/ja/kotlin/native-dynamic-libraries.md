[//]: # (title: チュートリアル：ダイナミックライブラリとしての Kotlin/Native)

既存のプログラムから Kotlin コードを利用するために、ダイナミックライブラリを作成できます。これにより、JVM、Python、Android を含む多くのプラットフォームや言語間でコードを共有することが可能になります。

> iOS およびその他の Apple ターゲットについては、フレームワークの生成を推奨します。[Apple フレームワークとしての Kotlin/Native](apple-framework.md) チュートリアルを参照してください。
> 
{style="tip"}

既存のネイティブアプリケーションやライブラリから Kotlin/Native コードを使用できます。そのためには、Kotlin コードを `.so`、`.dylib`、または `.dll` 形式のダイナミックライブラリ（動的ライブラリ）にコンパイルする必要があります。

このチュートリアルでは、以下の内容を行います：

* [Kotlin コードをダイナミックライブラリにコンパイルする](#create-a-kotlin-library)
* [生成された C ヘッダーを確認する](#generated-header-file)
* [C から Kotlin ダイナミックライブラリを使用する](#use-generated-headers-from-c)
* [プロジェクトをコンパイルして実行する](#compile-and-run-the-project)

Kotlin ライブラリを生成するには、コマンドラインから直接実行するか、スクリプトファイル（`.sh` や `.bat` ファイルなど）を使用できます。
しかし、このアプローチは数百のファイルやライブラリを持つ大規模なプロジェクトには適していません。
ビルドシステムを使用すると、Kotlin/Native コンパイラのバイナリや、推移的依存関係を持つライブラリのダウンロードとキャッシュ、コンパイラやテストの実行が簡素化されます。
Kotlin/Native では、[Kotlin Multiplatform プラグイン](gradle-configure-project.md#targeting-multiple-platforms)を通じて [Gradle](https://gradle.org) ビルドシステムを使用できます。

Kotlin/Native の高度な C インターオペラビリティ（相互運用性）関連の使用法と、Gradle を使用した [Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms) ビルドについて見ていきましょう。

> Mac を使用しており、macOS やその他の Apple ターゲット向けのアプリケーションを作成・実行したい場合は、まず [Xcode Command Line Tools](https://developer.apple.com/download/) をインストールして起動し、ライセンス条項に同意する必要があります。
>
{style="note"}

## Kotlin ライブラリの作成

Kotlin/Native コンパイラは、Kotlin コードからダイナミックライブラリを生成できます。通常、ダイナミックライブラリには `.h` ヘッダーファイルが付属しており、これを使用して C からコンパイルされたコードを呼び出します。

Kotlin ライブラリを作成し、それを C プログラムから使用してみましょう。

> 新しい Kotlin/Native プロジェクトの作成方法や IntelliJ IDEA での開き方などの詳細な手順については、[Kotlin/Native を始める](native-get-started.md#using-gradle) チュートリアルを参照してください。
>
{style="tip"}

1. `src/nativeMain/kotlin` ディレクトリに移動し、以下のライブラリの内容を含む `lib.kt` ファイルを作成します：

   ```kotlin
   package example
    
   object Object { 
       val field = "A"
   }
    
   class Clazz {
       fun memberFunction(p: Int): ULong = 42UL
   }
    
   fun forIntegers(b: Byte, s: Short, i: UInt, l: Long) { }
   fun forFloats(f: Float, d: Double) { }
    
   fun strings(str: String) : String? {
       return "That is '$str' from C"
   }
    
   val globalString = "A global String"
   ```

2. `build.gradle(.kts)` Gradle ビルドファイルを以下のように更新します：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple Silicon 搭載の macOS
        // macosX64("native") {   // x86_64 プラットフォームの macOS
        // linuxArm64("native") { // ARM64 プラットフォームの Linux
        // linuxX64("native") {   // x86_64 プラットフォームの Linux
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS および Linux 
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.ALL
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple Silicon 搭載の macOS
        // macosX64("native") {   // x86_64 プラットフォームの macOS
        // linuxArm64("native") { // ARM64 プラットフォームの Linux
        // linuxX64("native") {   // x86_64 プラットフォームの Linux
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS および Linux 
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = "ALL"
    }
    ```

    </tab>
    </tabs>

    * `binaries {}` ブロックは、ダイナミックライブラリまたは共有ライブラリを生成するようにプロジェクトを構成します。
    * `libnative` はライブラリ名として使用され、生成されるヘッダーファイル名のプレフィックスになります。また、ヘッダーファイル内のすべての宣言のプレフィックスとしても使用されます。

3. IDE で `linkDebugSharedNative` Gradle タスクを実行するか、ターミナルで以下のコンソールコマンドを使用してライブラリをビルドします：

   ```bash
   ./gradlew linkDebugSharedNative
   ```

ビルドが完了すると、`build/bin/native/debugShared` ディレクトリに以下のファイルとともにライブラリが生成されます：

* macOS: `libnative_api.h` および `libnative.dylib`
* Linux: `libnative_api.h` および `libnative.so`
* Windows: `libnative_api.h`、`libnative.def`、および `libnative.dll`

> `linkNative` Gradle タスクを使用すると、ライブラリの `debug` と `release` の両方のバリアントを生成することもできます。
> 
{style="tip"}

Kotlin/Native コンパイラは、すべてのプラットフォームに対して同じルールを使用して `.h` ファイルを生成します。Kotlin ライブラリの C API を確認してみましょう。

## 生成されたヘッダーファイル

Kotlin/Native の宣言がどのように C 関数にマッピングされるかを確認してみましょう。

`build/bin/native/debugShared` ディレクトリにある `libnative_api.h` ヘッダーファイルを開きます。
最初の部分は、標準的な C/C++ のヘッダーガードとフッターが含まれています：

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// 生成されたコードの残り

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

これに続いて、`libnative_api.h` には共通の型定義を含むブロックがあります：

```c
#ifdef __cplusplus
typedef bool            libnative_KBoolean;
#else
typedef _Bool           libnative_KBoolean;
#endif
typedef unsigned short     libnative_KChar;
typedef signed char        libnative_KByte;
typedef short              libnative_KShort;
typedef int                libnative_KInt;
typedef long long          libnative_KLong;
typedef unsigned char      libnative_KUByte;
typedef unsigned short     libnative_KUShort;
typedef unsigned int       libnative_KUInt;
typedef unsigned long long libnative_KULong;
typedef float              libnative_KFloat;
typedef double             libnative_KDouble;
typedef float __attribute__ ((__vector_size__ (16))) libnative_KVector128;
typedef void*              libnative_KNativePtr;
``` 

Kotlin は、作成された `libnative_api.h` ファイル内のすべての宣言に `libnative_` プレフィックスを使用します。型マッピングの完全なリストは以下の通りです：

| Kotlin の定義            | C の型                                          |
|------------------------|-----------------------------------------------|
| `libnative_KBoolean`   | `bool` または `_Bool`                             |
| `libnative_KChar`      | `unsigned short`                              |
| `libnative_KByte`      | `signed char`                                 |
| `libnative_KShort`     | `short`                                       |
| `libnative_KInt`       | `int`                                         |
| `libnative_KLong`      | `long long`                                   |
| `libnative_KUByte`     | `unsigned char`                               |
| `libnative_KUShort`    | `unsigned short`                              |
| `libnative_KUInt`      | `unsigned int`                                |
| `libnative_KULong`     | `unsigned long long`                          |
| `libnative_KFloat`     | `float`                                       |
| `libnative_KDouble`    | `double`                                      |
| `libnative_KVector128` | `float __attribute__ ((__vector_size__ (16))` |
| `libnative_KNativePtr` | `void*`                                       |

`libnative_api.h` ファイルの定義セクションは、Kotlin のプリミティブ型が C のプリミティブ型にどのようにマッピングされるかを示しています。
Kotlin/Native コンパイラは、すべてのライブラリに対してこれらのエントリを自動的に生成します。
逆のマッピングについては、[C からのプリミティブデータ型のマッピング](mapping-primitive-data-types-from-c.md) チュートリアルで説明されています。

自動的に生成された型定義の後に、ライブラリで使用される個別の型定義があります：

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// 自動生成された型定義

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

C において、`typedef struct { ... } TYPE_NAME` 構文は構造体を宣言します。

> このパターンの詳細な説明については、[この StackOverflow のスレッド](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)を参照してください。
>
{style="tip"}

これらの定義からわかるように、Kotlin の型は同じパターンを使用してマッピングされています：`Object` は `libnative_kref_example_Object` に、`Clazz` は `libnative_kref_example_Clazz` にマッピングされます。すべての構造体には、ポインタを持つ `pinned` フィールド以外何も含まれていません。フィールド型 `libnative_KNativePtr` は、ファイルの前の方で `void*` として定義されています。

C は名前空間をサポートしていないため、Kotlin/Native コンパイラは、既存のネイティブプロジェクト内の他のシンボルとの衝突を避けるために長い名前を生成します。

### サービスランタイム関数

`libnative_ExportedSymbols` 構造体は、Kotlin/Native およびライブラリによって提供されるすべての関数を定義します。
パッケージを模倣するために、入れ子になった無名構造体を多用しています。`libnative_` プレフィックスはライブラリ名に由来します。

`libnative_ExportedSymbols` には、ヘッダーファイル内のいくつかのヘルパー関数が含まれています：

```c
typedef struct {
  /* サービス関数 */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

これらの関数は Kotlin/Native オブジェクトを扱います。`DisposeStablePointer` は Kotlin オブジェクトへの参照を解放するために呼び出され、`DisposeString` は C で `char*` 型を持つ Kotlin 文字列を解放するために呼び出されます。

`libnative_api.h` ファイルの次の部分は、ランタイム関数の構造体宣言で構成されています：

```c
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
libnative_kref_kotlin_Byte (*createNullableByte)(libnative_KByte);
libnative_KByte (*getNonNullValueOfByte)(libnative_kref_kotlin_Byte);
libnative_kref_kotlin_Short (*createNullableShort)(libnative_KShort);
libnative_KShort (*getNonNullValueOfShort)(libnative_kref_kotlin_Short);
libnative_kref_kotlin_Int (*createNullableInt)(libnative_KInt);
libnative_KInt (*getNonNullValueOfInt)(libnative_kref_kotlin_Int);
libnative_kref_kotlin_Long (*createNullableLong)(libnative_KLong);
libnative_KLong (*getNonNullValueOfLong)(libnative_kref_kotlin_Long);
libnative_kref_kotlin_Float (*createNullableFloat)(libnative_KFloat);
libnative_KFloat (*getNonNullValueOfFloat)(libnative_kref_kotlin_Float);
libnative_kref_kotlin_Double (*createNullableDouble)(libnative_KDouble);
libnative_KDouble (*getNonNullValueOfDouble)(libnative_kref_kotlin_Double);
libnative_kref_kotlin_Char (*createNullableChar)(libnative_KChar);
libnative_KChar (*getNonNullValueOfChar)(libnative_kref_kotlin_Char);
libnative_kref_kotlin_Boolean (*createNullableBoolean)(libnative_KBoolean);
libnative_KBoolean (*getNonNullValueOfBoolean)(libnative_kref_kotlin_Boolean);
libnative_kref_kotlin_Unit (*createNullableUnit)(void);
libnative_kref_kotlin_UByte (*createNullableUByte)(libnative_KUByte);
libnative_KUByte (*getNonNullValueOfUByte)(libnative_kref_kotlin_UByte);
libnative_kref_kotlin_UShort (*createNullableUShort)(libnative_KUShort);
libnative_KUShort (*getNonNullValueOfUShort)(libnative_kref_kotlin_UShort);
libnative_kref_kotlin_UInt (*createNullableUInt)(libnative_KUInt);
libnative_KUInt (*getNonNullValueOfUInt)(libnative_kref_kotlin_UInt);
对外开放libnative_kref_kotlin_ULong (*createNullableULong)(libnative_KULong);
libnative_KULong (*getNonNullValueOfULong)(libnative_kref_kotlin_ULong);
```

`IsInstance` 関数を使用して、Kotlin オブジェクト（その `.pinned` ポインタで参照される）が特定の型のインスタンスであるかどうかを確認できます。生成される実際の操作セットは、実際の使用状況によって異なります。

> Kotlin/Native には独自のガベージコレクタがありますが、C からアクセスされる Kotlin オブジェクトは管理しません。ただし、Kotlin/Native は [Swift/Objective-C との相互運用性](native-objc-interop.md)を提供しており、ガベージコレクタは [Swift/Objective-C ARC と統合](native-arc-integration.md)されています。
>
{style="tip"}

### ライブラリの関数

ライブラリで使用される個別の構造体宣言を見てみましょう。`libnative_kref_example` フィールドは、`libnative_kref.` プレフィックスを付けて、Kotlin コードのパッケージ構造を模倣しています：

```c
typedef struct {
  /* ユーザー関数 */
  struct {
    struct {
      struct {
        struct {
          libnative_KType* (*_type)(void);
          libnative_kref_example_Object (*_instance)();
          const char* (*get_field)(libnative_kref_example_Object thiz);
        } Object;
        struct {
          libnative_KType* (*_type)(void);
          libnative_kref_example_Clazz (*Clazz)();
          libnative_KULong (*memberFunction)(libnative_kref_example_Clazz thiz, libnative_KInt p);
        } Clazz;
        const char* (*get_globalString)();
        void (*forFloats)(libnative_KFloat f, libnative_KDouble d);
        void (*forIntegers)(libnative_KByte b, libnative_KShort s, libnative_KUInt i, libnative_KLong l);
        const char* (*strings)(const char* str);
      } example;
    } root;
  } kotlin;
} libnative_ExportedSymbols;
```

このコードでは無名構造体宣言が使用されています。ここで、`struct { ... } foo` は、名前のない無名構造体型のフィールドを外側の構造体に宣言しています。

C はオブジェクトもサポートしていないため、関数ポインタを使用してオブジェクトのセマンティクスを模倣しています。関数ポインタは `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)` として宣言されます。

`libnative_kref_example_Clazz` フィールドは、Kotlin の `Clazz` を表します。`libnative_KULong` は `memberFunction` フィールドを介してアクセス可能です。唯一の違いは、`memberFunction` が最初のパラメータとして `thiz` 参照を受け取ることです。C はオブジェクトをサポートしていないため、`thiz` ポインタは明示的に渡されます。

`Clazz` フィールドにはコンストラクタ（別名 `libnative_kref_example_Clazz_Clazz`）があり、これは `Clazz` のインスタンスを作成するためのコンストラクタ関数として機能します。

Kotlin の `object Object` は `libnative_kref_example_Object` としてアクセス可能です。`_instance` 関数は、そのオブジェクトの唯一のインスタンスを取得します。

プロパティは関数に変換されます。`get_` および `set_` プレフィックスは、それぞれゲッター関数とセッター関数の名前になります。例えば、Kotlin の読み取り専用プロパティ `globalString` は、C では `get_globalString` 関数に変換されます。

グローバル関数 `forFloats`、`forIntegers`、および `strings` は、`libnative_kref_example` 無名構造体内の関数ポインタに変換されます。

### エントリポイント

API がどのように作成されるかがわかったので、`libnative_ExportedSymbols` 構造体の初期化が開始点となります。それでは、`libnative_api.h` の最後の部分を見てみましょう：

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 関数を使用すると、ネイティブコードから Kotlin/Native ライブラリへのゲートウェイを開くことができます。これがライブラリにアクセスするためのエントリポイントです。関数名のプレフィックスとしてライブラリ名が使用されます。

> 返された `libnative_ExportedSymbols*` ポインタをスレッドごとに保持する必要がある場合があります。
>
{style="note"}

## C から生成されたヘッダーを使用する

C から生成されたヘッダーを使用するのは簡単です。ライブラリディレクトリに、以下のコードを含む `main.c` ファイルを作成します：

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  // Kotlin/Native 関数を呼び出すための参照を取得する
  libnative_ExportedSymbols* lib = libnative_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  // C と Kotlin/Native の文字列を使用する
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s
out:%s
", str, response);
  lib->DisposeString(response);

  // Kotlin オブジェクトのインスタンスを作成する
  libnative_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
  long x = lib->kotlin.root.example.Clazz.memberFunction(newInstance, 42);
  lib->DisposeStablePointer(newInstance.pinned);

  printf("DemoClazz returned %ld
", x);

  return 0;
}
```

## プロジェクトのコンパイルと実行

### macOS の場合

C コードをコンパイルし、ダイナミックライブラリとリンクするには、ライブラリディレクトリに移動して以下のコマンドを実行します：

```bash
clang main.c libnative.dylib
```

コンパイラは `a.out` という実行ファイルを生成します。これを実行して、C ライブラリから Kotlin コードを実行します。

### Linux の場合

C コードをコンパイルし、ダイナミックライブラリとリンクするには、ライブラリディレクトリに移動して以下のコマンドを実行します：

```bash
gcc main.c libnative.so
```

コンパイラは `a.out` という実行ファイルを生成します。これを実行して、C ライブラリから Kotlin コードを実行します。Linux では、アプリケーションが現在のフォルダから `libnative.so` ライブラリをロードできるように、`LD_LIBRARY_PATH` に `.` を含める必要があります。

### Windows の場合

まず、x64_64 ターゲットをサポートする Microsoft Visual C++ コンパイラをインストールする必要があります。

最も簡単な方法は、Windows マシンに Microsoft Visual Studio をインストールすることです。インストール中に、C++ を使用するために必要なコンポーネント（例：**C++ によるデスクトップ開発**）を選択してください。

Windows では、スタティックライブラリのラッパーを生成するか、[LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya) または同様の Win32API 関数を使用して手動でダイナミックライブラリを組み込むことができます。

最初のオプションを使用して、`libnative.dll` 用のスタティックラッパーライブラリを生成してみましょう：

1. ツールチェーンから `lib.exe` を呼び出して、コードからの DLL 使用を自動化するスタティックライブラリラッパー `libnative.lib` を生成します：

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. `main.c` をコンパイルして実行ファイルを作成します。ビルドコマンドに生成された `libnative.lib` を含めて開始します：

   ```bash
   cl.exe main.c libnative.lib
   ```

   このコマンドは `main.exe` ファイルを生成し、実行することができます。

## 次のステップ

* [Swift/Objective-C との相互運用性について詳しく学ぶ](native-objc-interop.md)
* [Apple フレームワークとしての Kotlin/Native チュートリアルを確認する](apple-framework.md)