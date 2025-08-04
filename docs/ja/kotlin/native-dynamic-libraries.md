[//]: # (title: Kotlin/Nativeを動的ライブラリとして使用する – チュートリアル)

Kotlinコードを既存のプログラムから利用するために、動的ライブラリを作成できます。これにより、JVM、Python、Androidなど、多くのプラットフォームや言語間でコードを共有できるようになります。

> iOSやその他のAppleターゲット向けには、フレームワークの生成を推奨します。[Kotlin/NativeをAppleフレームワークとして使用する](apple-framework.md)チュートリアルを参照してください。
>
{style="tip"}

既存のネイティブアプリケーションやライブラリからKotlin/Nativeコードを利用できます。そのためには、Kotlinコードを`.so`、`.dylib`、または`.dll`形式の動的ライブラリにコンパイルする必要があります。

このチュートリアルでは、以下の内容を行います。

* [Kotlinコードを動的ライブラリにコンパイルする](#create-a-kotlin-library)
* [生成されたCヘッダーを調べる](#generated-header-file)
* [CからKotlin動的ライブラリを使用する](#use-generated-headers-from-c)
* [プロジェクトをコンパイルして実行する](#compile-and-run-the-project)

Kotlinライブラリを生成するには、コマンドラインを直接使用するか、スクリプトファイル（`.sh`や`.bat`ファイルなど）を使用できます。しかし、このアプローチは何百ものファイルやライブラリを持つ大規模なプロジェクトにはスケールしません。ビルドシステムを使用すると、Kotlin/Nativeコンパイラのバイナリやライブラリ、および推移的依存関係のダウンロードとキャッシュ、さらにコンパイラの実行とテストにより、プロセスが簡素化されます。Kotlin/Nativeは、[Kotlin Multiplatformプラグイン](gradle-configure-project.md#targeting-multiple-platforms)を通じて[Gradle](https://gradle.org)ビルドシステムを利用できます。

Kotlin/Nativeの高度なC相互運用関連の利用法と、Gradleによる[Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms)ビルドについて見ていきましょう。

> Macを使用しており、macOSまたはその他のAppleターゲット向けアプリケーションを作成および実行したい場合は、まず[Xcode Command Line Tools](https://developer.apple.com/download/)をインストールし、起動して、ライセンス条項に同意する必要があります。
>
{style="note"}

## Kotlinライブラリを作成する

Kotlin/Nativeコンパイラは、Kotlinコードから動的ライブラリを生成できます。動的ライブラリには、コンパイルされたコードをCから呼び出すために使用する`.h`ヘッダーファイルが付属していることがよくあります。

Kotlinライブラリを作成し、Cプログラムから利用してみましょう。

> 新しいKotlin/Nativeプロジェクトを作成し、IntelliJ IDEAで開くための詳細な最初のステップと手順については、[Kotlin/Native入門](native-get-started.md#using-gradle)チュートリアルを参照してください。
>
{style="tip"}

1. `src/nativeMain/kotlin`ディレクトリに移動し、以下のライブラリコンテンツを含む`lib.kt`ファイルを作成します。

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

2. `build.gradle(.kts)` Gradleビルドファイルを次のように更新します。

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
        gradleVersion = "%gradleVersion%"
        distributionType = "ALL"
    }
    ```

    </tab>
    </tabs>

    * `binaries {}`ブロックは、プロジェクトが動的ライブラリまたは共有ライブラリを生成するように設定します。
    * `libnative`は、ライブラリ名として、生成されるヘッダーファイル名のプレフィックスとして使用されます。また、ヘッダーファイル内のすべての宣言にプレフィックスを付けます。

3. IDEで`linkDebugSharedNative` Gradleタスクを実行するか、ターミナルで次のコンソールコマンドを使用してライブラリをビルドします。

   ```bash
   ./gradlew linkDebugSharedNative
   ```

ビルドにより、ライブラリが`build/bin/native/debugShared`ディレクトリに以下のファイルとともに生成されます。

* macOS: `libnative_api.h`および`libnative.dylib`
* Linux: `libnative_api.h`および`libnative.so`
* Windows: `libnative_api.h`、`libnative.def`、および`libnative.dll`

> `linkNative` Gradleタスクを使用して、ライブラリの`debug`版と`release`版の両方を生成することもできます。
>
{style="tip"}

Kotlin/Nativeコンパイラは、すべてのプラットフォームに対して同じルールを使用して`.h`ファイルを生成します。KotlinライブラリのC APIを確認してみましょう。

## 生成されたヘッダーファイル

Kotlin/Nativeの宣言がどのようにC関数にマッピングされるかを見ていきましょう。

`build/bin/native/debugShared`ディレクトリで、`libnative_api.h`ヘッダーファイルを開きます。最初の部分には、標準のC/C++ヘッダーとフッターが含まれています。

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

これに続いて、`libnative_api.h`には共通の型定義を含むブロックが含まれています。

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

Kotlinは、作成された`libnative_api.h`ファイル内のすべての宣言に`libnative_`プレフィックスを使用します。以下に、型マッピングの完全なリストを示します。

| Kotlinの定義       | Cの型                                         |
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

`libnative_api.h`ファイルの定義セクションは、Kotlinのプリミティブ型がCのプリミティブ型にどのようにマッピングされるかを示しています。Kotlin/Nativeコンパイラは、すべてのライブラリに対してこれらのエントリを自動的に生成します。逆のマッピングについては、[Cからのプリミティブデータ型のマッピング](mapping-primitive-data-types-from-c.md)チュートリアルで説明されています。

自動生成された型定義の後には、ライブラリで使用されている個別の型定義が見つかります。

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

C言語では、`typedef struct { ... } TYPE_NAME`構文が構造体を宣言します。

> このパターンの詳細については、[StackOverflowのこのスレッド](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)を参照してください。
>
{style="tip"}

これらの定義からわかるように、Kotlinの型は同じパターンでマッピングされます。`Object`は`libnative_kref_example_Object`に、`Clazz`は`libnative_kref_example_Clazz`にマッピングされます。すべての構造体は、ポインタを持つ`pinned`フィールドのみを含んでいます。`libnative_KNativePtr`フィールドの型は、ファイルの冒頭で`void*`として定義されています。

C言語は名前空間をサポートしていないため、Kotlin/Nativeコンパイラは、既存のネイティブプロジェクト内の他のシンボルとの衝突を避けるために長い名前を生成します。

### サービスランタイム関数

`libnative_ExportedSymbols`構造体は、Kotlin/Nativeとあなたのライブラリが提供するすべての関数を定義します。これは、パッケージを模倣するためにネストされた匿名構造体を多用しています。`libnative_`プレフィックスはライブラリ名に由来します。

`libnative_ExportedSymbols`には、ヘッダーファイルにいくつかのヘルパー関数が含まれています。

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

これらの関数はKotlin/Nativeオブジェクトを扱います。`DisposeStablePointer`はKotlinオブジェクトへの参照を解放するために呼び出され、`DisposeString`はC言語で`char*`型を持つKotlin文字列を解放するために呼び出されます。

`libnative_api.h`ファイルの次の部分には、ランタイム関数の構造体宣言が含まれています。

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

`IsInstance`関数を使用して、Kotlinオブジェクト（その`.pinned`ポインタで参照される）がある型のインスタンスであるかどうかを確認できます。生成される操作の実際のセットは、実際の使用状況によって異なります。

> Kotlin/Nativeには独自のガベージコレクタがありますが、CからアクセスされるKotlinオブジェクトは管理しません。ただし、Kotlin/Nativeは[Swift/Objective-Cとの相互運用](native-objc-interop.md)を提供しており、ガベージコレクタは[Swift/Objective-C ARCと統合されています](native-arc-integration.md)。
>
{style="tip"}

### あなたのライブラリ関数

ライブラリで使用されている個別の構造体宣言を見てみましょう。`libnative_kref_example`フィールドは、`libnative_kref.`プレフィックスを付けてKotlinコードのパッケージ構造を模倣しています。

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

このコードは匿名構造体宣言を使用しています。ここでは、`struct { ... } foo`は、名前のない匿名構造体型の外側の構造体内にフィールドを宣言しています。

C言語もオブジェクトをサポートしていないため、関数ポインタを使用してオブジェクトのセマンティクスを模倣します。関数ポインタは`RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`として宣言されます。

`libnative_kref_example_Clazz`フィールドは、Kotlinの`Clazz`を表します。`libnative_KULong`は`memberFunction`フィールドでアクセス可能です。唯一の違いは、`memberFunction`が最初のパラメータとして`thiz`参照を受け入れることです。C言語はオブジェクトをサポートしないため、`thiz`ポインタが明示的に渡されます。

`Clazz`フィールド（別名`libnative_kref_example_Clazz_Clazz`）にはコンストラクタがあり、これは`Clazz`のインスタンスを作成するコンストラクタ関数として機能します。

Kotlinの`object Object`は`libnative_kref_example_Object`としてアクセス可能です。`_instance`関数は、オブジェクトの唯一のインスタンスを取得します。

プロパティは関数に変換されます。`get_`と`set_`プレフィックスは、それぞれゲッター関数とセッター関数を命名します。たとえば、Kotlinの読み取り専用プロパティ`globalString`は、Cでは`get_globalString`関数に変換されます。

グローバル関数`forFloats`、`forIntegers`、および`strings`は、`libnative_kref_example`匿名構造体内の関数ポインタに変換されます。

### エントリポイント

APIがどのように作成されるかがわかったところで、`libnative_ExportedSymbols`構造体の初期化が開始点となります。では、`libnative_api.h`の最後の部分を見ていきましょう。

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols`関数は、ネイティブコードからKotlin/Nativeライブラリへのゲートウェイを開くことを可能にします。これはライブラリにアクセスするためのエントリポイントです。ライブラリ名が関数名のプレフィックスとして使用されます。

> 返される`libnative_ExportedSymbols*`ポインタをスレッドごとにホストする必要がある場合があります。
>
{style="note"}

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

### macOSの場合

Cコードをコンパイルし、動的ライブラリとリンクするには、ライブラリディレクトリに移動して次のコマンドを実行します。

```bash
clang main.c libnative.dylib
```

コンパイラは`a.out`という実行可能ファイルを生成します。これを実行して、CライブラリからKotlinコードを実行します。

### Linuxの場合

Cコードをコンパイルし、動的ライブラリとリンクするには、ライブラリディレクトリに移動して次のコマンドを実行します。

```bash
gcc main.c libnative.so
```

コンパイラは`a.out`という実行可能ファイルを生成します。これを実行して、CライブラリからKotlinコードを実行します。Linuxでは、アプリケーションが現在のフォルダから`libnative.so`ライブラリをロードすることを認識させるために、`.`を`LD_LIBRARY_PATH`に含める必要があります。

### Windowsの場合

まず、x64_64ターゲットをサポートするMicrosoft Visual C++コンパイラをインストールする必要があります。

これを行う最も簡単な方法は、WindowsマシンにMicrosoft Visual Studioをインストールすることです。インストール中に、C++で作業するために必要なコンポーネルの例として、**C++によるデスクトップ開発**を選択します。

Windowsでは、静的ライブラリラッパーを生成するか、[LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)または類似のWin32API関数を手動で利用するかによって、動的ライブラリを含めることができます。

最初のオプションを使用して、`libnative.dll`の静的ラッパーライブラリを生成してみましょう。

1. ツールチェーンから`lib.exe`を呼び出し、コードからのDLL使用を自動化する静的ライブラリラッパー`libnative.lib`を生成します。

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. `main.c`を実行可能ファイルにコンパイルします。生成された`libnative.lib`をビルドコマンドに含めて開始します。

   ```bash
   cl.exe main.c libnative.lib
   ```

   このコマンドは、実行可能な`main.exe`ファイルを生成します。

## 次のステップ

* [Swift/Objective-Cとの相互運用についてさらに学ぶ](native-objc-interop.md)
* [Kotlin/NativeをAppleフレームワークとして使用するチュートリアルを確認する](apple-framework.md)