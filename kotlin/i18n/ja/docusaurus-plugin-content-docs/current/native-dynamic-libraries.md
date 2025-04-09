---
title: "Kotlin/Nativeをダイナミックライブラリとして – チュートリアル"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

既存のプログラムからKotlinコードを利用するために、ダイナミックライブラリを作成できます。これにより、JVM、Python、Androidなど、多くのプラットフォームや言語間でコードを共有できます。

:::note
iOSやその他のAppleターゲットの場合、frameworkの生成をお勧めします。[Kotlin/Native as an Apple framework](apple-framework)のチュートリアルを参照してください。

既存のネイティブアプリケーションやライブラリからKotlin/Nativeコードを利用できます。これには、Kotlinコードを`.so`、`.dylib`、または`.dll`形式のダイナミックライブラリにコンパイルする必要があります。

このチュートリアルでは、以下を行います。

* [Kotlinコードをダイナミックライブラリにコンパイルする](#create-a-kotlin-library)
* [生成されたCヘッダーを調べる](#generated-header-file)
* [CからKotlinダイナミックライブラリを使用する](#use-generated-headers-from-c)
* [プロジェクトをコンパイルして実行する](#compile-and-run-the-project)

コマンドラインを使用して、直接またはスクリプトファイル（`.sh`や`.bat`ファイルなど）を使用してKotlinライブラリを生成できます。
ただし、このアプローチは、数百のファイルやライブラリを持つ大規模なプロジェクトには適していません。
ビルドシステムを使用すると、Kotlin/Nativeコンパイラのバイナリとライブラリ、および推移的な依存関係を持つライブラリをダウンロードしてキャッシュし、コンパイラとテストを実行することでプロセスを簡素化できます。
Kotlin/Nativeは、[Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms)を介して[Gradle](https://gradle.org)ビルドシステムを使用できます。

Kotlin/Nativeと[Kotlin Multiplatform](gradle-configure-project#targeting-multiple-platforms)のGradleを使用した高度なC interop関連の使用法について見てみましょう。

Macを使用しており、macOSまたはその他のAppleターゲット用のアプリケーションを作成して実行する場合は、[Xcode Command Line Tools](https://developer.apple.com/download/)をインストールし、起動して、最初にライセンス条項に同意する必要があります。

:::

## Kotlinライブラリを作成する

Kotlin/Nativeコンパイラは、Kotlinコードからダイナミックライブラリを生成できます。ダイナミックライブラリには、Cからコンパイルされたコードを呼び出すために使用する`.h`ヘッダーファイルが付属していることがよくあります。

Kotlinライブラリを作成し、Cプログラムから使用してみましょう。

:::note
詳細な最初の手順については、[Get started with Kotlin/Native](native-get-started#using-gradle)のチュートリアルを参照してください。
新しいKotlin/Nativeプロジェクトを作成し、IntelliJ IDEAで開く方法も説明されています。

1. `src/nativeMain/kotlin`ディレクトリに移動し、次のライブラリの内容を含む`lib.kt`ファイルを作成します。

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

2. 次のように`build.gradle(.kts)` Gradleビルドファイルを更新します。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // macOS on Apple Silicon
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS and Linux 
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "8.10"
        distributionType = Wrapper.DistributionType.ALL
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS and Linux 
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    wrapper {
        gradleVersion = "8.10"
        distributionType = "ALL"
    }
    ```

    </TabItem>
    </Tabs>

    * `binaries {}`ブロックは、ダイナミックライブラリまたは共有ライブラリを生成するようにプロジェクトを構成します。
    * `libnative`はライブラリ名として使用され、生成されるヘッダーファイル名のプレフィックスになります。また、ヘッダーファイル内のすべての宣言のプレフィックスにもなります。

3. IDEで`linkDebugSharedNative` Gradleタスクを実行するか、ターミナルで次のコンソールコマンドを使用してライブラリをビルドします。

   ```bash
   ./gradlew linkDebugSharedNative
   ```

ビルドにより、ライブラリが`build/bin/native/debugShared`ディレクトリに次のファイルで生成されます。

* macOS `libnative_api.h`および`libnative.dylib`
* Linux：`libnative_api.h`および`libnative.so`
* Windows：`libnative_api.h`、`libnative.def`、および`libnative.dll`

`linkNative` Gradleタスクを使用して、ライブラリの`debug`と`release`の両方のバリアントを生成することもできます。

Kotlin/Nativeコンパイラは、すべてのプラットフォームで`.h`ファイルを生成するために同じルールを使用します。KotlinライブラリのC APIをチェックしてみましょう。

## 生成されたヘッダーファイル

Kotlin/Nativeの宣言がどのようにC関数にマッピングされるかを見てみましょう。

`build/bin/native/debugShared`ディレクトリで、`libnative_api.h`ヘッダーファイルを開きます。
最初の部分には、標準のC/C++ヘッダーとフッターが含まれています。

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// The rest of the generated code

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

この後、`libnative_api.h`には、一般的な型定義のブロックが含まれています。

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

Kotlinは、作成された`libnative_api.h`ファイルのすべての宣言に`libnative_`プレフィックスを使用します。型マッピングの完全なリストを次に示します。

| Kotlin definition      | C type                                        |
|------------------------|-----------------------------------------------|
| `libnative_KBoolean`   | `bool` or `_Bool`                             |
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

`libnative_api.h`ファイルの定義セクションには、Kotlinのプリミティブ型がCのプリミティブ型にどのようにマッピングされるかが示されています。
Kotlin/Nativeコンパイラは、すべてのライブラリに対してこれらのエントリを自動的に生成します。
リバースマッピングについては、[Mapping primitive data types from C](mapping-primitive-data-types-from-c)チュートリアルで説明されています。

自動的に生成された型定義の後に、ライブラリで使用される個別の型定義があります。

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// Automatically generated type definitions

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

Cでは、`typedef struct { ... } TYPE_NAME`構文は構造体を宣言します。

このパターンの詳細については、[this StackOverflow thread](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)を参照してください。

これらの定義からわかるように、Kotlinの型は同じパターンを使用してマッピングされます。`Object`は`libnative_kref_example_Object`にマッピングされ、`Clazz`は`libnative_kref_example_Clazz`にマッピングされます。すべての構造体には、ポインタを持つ`pinned`フィールドのみが含まれています。フィールド型`libnative_KNativePtr`は、ファイルの先頭で`void*`として定義されています。

Cは名前空間をサポートしていないため、Kotlin/Nativeコンパイラは、既存のネイティブプロジェクトの他のシンボルとの競合を避けるために、長い名前を生成します。

### Service runtime functions

`libnative_ExportedSymbols`構造体は、Kotlin/Nativeとライブラリによって提供されるすべての関数を定義します。
パッケージを模倣するために、ネストされた匿名構造体を多用します。`libnative_`プレフィックスはライブラリ名に由来します。

`libnative_ExportedSymbols`には、ヘッダーファイルにいくつかのヘルパー関数が含まれています。

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

これらの関数はKotlin/Nativeオブジェクトを処理します。`DisposeStablePointer`はKotlinオブジェクトへの参照を解放するために呼び出され、`DisposeString`はCで`char*`型を持つKotlin文字列を解放するために呼び出されます。

`libnative_api.h`ファイルの次の部分は、ランタイム関数の構造体宣言で構成されています。

```c
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
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
libnative_kref_kotlin_ULong (*createNullableULong)(libnative_KULong);
libnative_KULong (*getNonNullValueOfULong)(libnative_kref_kotlin_ULong);
```

`IsInstance`関数を使用して、Kotlinオブジェクト（その`.pinned`ポインタで参照）が型のインスタンスであるかどうかを確認できます。生成される実際の操作セットは、実際の使用法によって異なります。

Kotlin/Nativeには独自のガベージコレクターがありますが、CからアクセスされるKotlinオブジェクトは管理しません。ただし、Kotlin/Nativeは[interoperability with Swift/Objective-C](native-objc-interop)を提供し、ガベージコレクターは[integrated with Swift/Objective-C ARC](native-arc-integration)と統合されています。

### Your library functions

ライブラリで使用される個別の構造体宣言を見てみましょう。`libnative_kref_example`フィールドは、`libnative_kref.`プレフィックスを使用してKotlinコードのパッケージ構造を模倣しています。

```c
typedef struct {
  /* User functions. */
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

コードは匿名構造体宣言を使用します。ここで、`struct { ... } foo`は名前のない匿名構造体型の外部構造体のフィールドを宣言します。

Cはオブジェクトもサポートしていないため、関数ポインタを使用してオブジェクトのセマンティクスを模倣します。関数ポインタは`RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`として宣言されます。

`libnative_kref_example_Clazz`フィールドはKotlinの`Clazz`を表します。`libnative_KULong`は`memberFunction`フィールドでアクセスできます。唯一の違いは、`memberFunction`が最初のパラメーターとして`thiz`参照を受け入れることです。Cはオブジェクトをサポートしていないため、`thiz`ポインタが明示的に渡されます。

`Clazz`フィールド（別名`libnative_kref_example_Clazz_Clazz`）にはコンストラクターがあり、`Clazz`のインスタンスを作成するためのコンストラクター関数として機能します。

Kotlinの`object Object`は`libnative_kref_example_Object`としてアクセスできます。`_instance`関数は、オブジェクトの唯一のインスタンスを取得します。

プロパティは関数に変換されます。`get_`および`set_`プレフィックスは、それぞれgetter関数とsetter関数に名前を付けます。たとえば、Kotlinの読み取り専用プロパティ`globalString`は、Cの`get_globalString`関数に変換されます。

グローバル関数`forFloats`、`forIntegers`、および`strings`は、`libnative_kref_example`匿名構造体の関数ポインタに変換されます。

### Entry point

APIの作成方法がわかったので、`libnative_ExportedSymbols`構造体の初期化が開始点です。次に、`libnative_api.h`の最後の部分を見てみましょう。

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols`関数を使用すると、ネイティブコードからKotlin/Nativeライブラリへのゲートウェイを開くことができます。
これは、ライブラリにアクセスするためのエントリポイントです。ライブラリ名は、関数名のプレフィックスとして使用されます。

スレッドごとに返された`libnative_ExportedSymbols*`ポインタをホストする必要がある場合があります。

:::

## Cから生成されたヘッダーを使用する

Cから生成されたヘッダーを使用するのは簡単です。ライブラリディレクトリに、次のコードを含む`main.c`ファイルを作成します。

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  // Obtain reference for calling Kotlin/Native functions
  libnative_ExportedSymbols* lib = libnative_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  // Use C and Kotlin/Native strings
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s
out:%s
", str, response);
  lib->DisposeString(response);

  // Create Kotlin object instance
  libnative_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
  long x = lib->kotlin.root.example.Clazz.memberFunction(newInstance, 42);
  lib->DisposeStablePointer(newInstance.pinned);

  printf("DemoClazz returned %ld
", x);

  return 0;
}
```

## プロジェクトをコンパイルして実行する

### On macOS

Cコードをコンパイルしてダイナミックライブラリとリンクするには、ライブラリディレクトリに移動して次のコマンドを実行します。

```bash
clang main.c libnative.dylib
```

コンパイラは`a.out`という名前の実行可能ファイルを生成します。実行して、CライブラリからKotlinコードを実行します。

### On Linux

Cコードをコンパイルしてダイナミックライブラリとリンクするには、ライブラリディレクトリに移動して次のコマンドを実行します。

```bash
gcc main.c libnative.so
```

コンパイラは`a.out`という名前の実行可能ファイルを生成します。実行して、CライブラリからKotlinコードを実行します。Linuxでは、アプリケーションが現在のフォルダーから`libnative.so`ライブラリをロードするように、`LD_LIBRARY_PATH`に`.`を含める必要があります。

### On Windows

まず、x64_64ターゲットをサポートするMicrosoft Visual C++コンパイラをインストールする必要があります。

これを行う最も簡単な方法は、WindowsマシンにMicrosoft Visual Studioをインストールすることです。インストール中に、C++を操作するために必要なコンポーネントを選択します。たとえば、**C++によるデスクトップ開発**などです。

Windowsでは、スタティックライブラリラッパーを生成するか、[LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)または同様のWin32API関数を使用して手動でダイナミックライブラリを含めることができます。

最初のオプションを使用して、`libnative.dll`のスタティックラッパーライブラリを生成しましょう。

1. ツールチェーンから`lib.exe`を呼び出して、DLLの使用をコードから自動化するスタティックライブラリラッパー`libnative.lib`を生成します。

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. `main.c`を実行可能ファイルにコンパイルします。生成された`libnative.lib`をビルドコマンドに含めて開始します。

   ```bash
   cl.exe main.c libnative.lib
   ```

   このコマンドは、実行できる`main.exe`ファイルを生成します。

## What's next

* [Learn more about interoperability with Swift/Objective-C](native-objc-interop)
* [Check out the Kotlin/Native as an Apple framework tutorial](apple-framework)