[//]: # (title: Cからのプリミティブデータ型のマッピング – チュートリアル)

<tldr>
    <p>これは <strong>Mapping Kotlin and C</strong>（KotlinとCのマッピング）チュートリアルシリーズの第1部です。</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>Cからのプリミティブデータ型のマッピング</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">Cからの構造体（struct）型と共用体（union）型のマッピング</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">Cからの関数ポインタのマッピング</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">Cからの文字列のマッピング</a><br/>
    </p>
</tldr>

> Cライブラリのインポートは[ベータ版](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)です。cinteropツールによってCライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi` アノテーションが付与されます。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）では、一部のAPIについてのみオプトインが必要です。
>
{style="note"}

どのCデータ型がKotlin/Nativeで参照可能か（またはその逆）を探り、Kotlin/Nativeと[マルチプラットフォーム](gradle-configure-project.md#targeting-multiple-platforms) Gradleビルドにおける、高度なC相互運用（interop）に関連するユースケースを確認しましょう。

このチュートリアルでは、以下の内容を学習します：

* [C言語のデータ型について学ぶ](#types-in-c-language)
* [エクスポートにそれらの型を使用するCライブラリを作成する](#create-a-c-library)
* [Cライブラリから生成されたKotlin APIを検査する](#inspect-generated-kotlin-apis-for-a-c-library)

コマンドラインを使用して、直接またはスクリプトファイル（`.sh` や `.bat` ファイルなど）でKotlinライブラリを生成できます。
しかし、このアプローチは数百のファイルやライブラリを持つ大規模なプロジェクトには適していません。
ビルドシステムを使用すると、Kotlin/Nativeコンパイラのバイナリや推移的依存関係（transitive dependencies）を持つライブラリのダウンロードとキャッシュ、およびコンパイラとテストの実行が簡素化されます。
Kotlin/Nativeは、[Kotlinマルチプラットフォームプラグイン](gradle-configure-project.md#targeting-multiple-platforms)を通じて [Gradle](https://gradle.org) ビルドシステムを使用できます。

## C言語の型

Cプログラミング言語には、以下の[データ型](https://en.wikipedia.org/wiki/C_data_types)があります：

* 基本型：`char, int, float, double` と、修飾子の `signed, unsigned, short, long`
* 構造体（Structures）、共用体（Unions）、配列（Arrays）
* ポインタ（Pointers）
* 関数ポインタ（Function pointers）

また、より具体的な型もあります：

* ブーリアン型（[C99](https://en.wikipedia.org/wiki/C99) より）
* `size_t` および `ptrdiff_t`（および `ssize_t`）
* `int32_t` や `uint64_t` などの固定幅整数型（[C99](https://en.wikipedia.org/wiki/C99) より）

また、C言語には `const`、`volatile`、`restrict`、`atomic` といった型修飾子も存在します。

これらのCデータ型がKotlinでどのように見えるかを見ていきましょう。

## Cライブラリの作成

このチュートリアルでは、`lib.c` ソースファイルは作成しません。これはCライブラリをコンパイルして実行する場合にのみ必要です。今回のセットアップでは、[cinteropツール](native-c-interop.md)を実行するために必要な `.h` ヘッダーファイルのみが必要です。

cinteropツールは、一連の `.h` ファイルに対してKotlin/Nativeライブラリ（`.klib` ファイル）を生成します。生成されたライブラリは、Kotlin/NativeからCへの呼び出しをブリッジするのに役立ちます。これには、`.h` ファイルの定義に対応するKotlin宣言が含まれています。

Cライブラリを作成するには：

1. 将来のプロジェクト用に空のフォルダを作成します。
2. その中に、Cの関数がどのようにKotlinにマッピングされるかを確認するための `lib.h` ファイルを、以下の内容で作成します：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   このファイルには `extern "C"` ブロックが含まれていません。この例では不要ですが、C++を使用し関数をオーバーロードする場合は必要になることがあります。詳細は、こちらの [Stackoverflowのスレッド](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c) を参照してください。

3. 以下の内容で `lib.def` [定義ファイル（definition file）](native-definition-file.md)を作成します：

   ```c
   headers = lib.h
   ```

4. cinteropツールによって生成されるコードに、マクロやその他のCの定義を含めると便利な場合があります。これにより、メソッド本体もコンパイルされ、バイナリに完全に含まれるようになります。この機能を使用すると、Cコンパイラを必要とせずに実行可能な例を作成できます。

   これを行うには、`lib.h` ファイルのC関数の実装を、新しい `interop.def` ファイルの `---` セパレータの後に追加します：

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def` ファイルは、アプリケーションをIDEでコンパイル、実行、または開くために必要なすべてを提供します。

## Kotlin/Nativeプロジェクトの作成

> 初めてのステップの詳細や、新しいKotlin/Nativeプロジェクトを作成してIntelliJ IDEAで開く方法については、[Kotlin/Nativeを始める](native-get-started.md#using-gradle) チュートリアルを参照してください。
>
{style="tip"}

プロジェクトファイルを作成するには：

1. プロジェクトフォルダに、以下の内容で `build.gradle(.kts)` Gradleビルドファイルを作成します：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }

    repositories {
        mavenCentral()
    }

    kotlin {
        macosArm64()    // Apple Silicon搭載のmacOS
        // linuxArm64() // ARM64プラットフォーム上のLinux
        // linuxX64()   // x86_64プラットフォーム上のLinux
        // mingwX64()   // x86_64プラットフォーム上のWindows

        targets.withType<KotlinNativeTarget>().configureEach {
            val main by compilations.getting
            val interop by main.cinterops.creating

            binaries {
                executable()
            }
        }
    }

    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.BIN
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }

    repositories {
        mavenCentral()
    }

    kotlin {
        macosArm64()    // Apple Silicon搭載のmacOS
        // linuxArm64() // ARM64プラットフォーム上のLinux
        // linuxX64()   // x86_64プラットフォーム上のLinux
        // mingwX64()   // Windows

        targets.withType(KotlinNativeTarget).configureEach {
            compilations.main.cinterops {
                interop
            }

            binaries {
                executable()
            }
        }
    }

    wrapper {
        gradleVersion = '%gradleVersion%'
        distributionType = 'BIN'
    }
    ```

    </tab>
    </tabs>

   このプロジェクトファイルは、C相互運用（interop）を追加のビルドステップとして構成します。
   構成のさまざまな方法については、[マルチプラットフォーム Gradle DSL リファレンス](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)を確認してください。

2. `interop.def`、`lib.h`、および `lib.def` ファイルを `src/nativeInterop/cinterop` ディレクトリに移動します。
3. `src/nativeMain/kotlin` ディレクトリを作成します。ここは、設定（configurations）ではなく規約（conventions）を使用するというGradleの推奨事項に従って、すべてのソースファイルを配置する場所です。

   デフォルトでは、Cからのすべてのシンボルは `interop` パッケージにインポートされます。

4. `src/nativeMain/kotlin` に、以下の内容で `hello.kt` スタブファイルを作成します：

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")

        ints(/* fix me*/)
        uints(/* fix me*/)
        doubles(/* fix me*/)
    }
    ```

Cのプリミティブ型の宣言がKotlin側からどのように見えるかを学習した後、コードを完成させます。

## Cライブラリに対して生成されたKotlin APIを検査する

Cのプリミティブ型がKotlin/Nativeにどのようにマッピングされるかを確認し、それに応じてサンプルプロジェクトを更新しましょう。

IntelliJ IDEAの [宣言へ移動（Go to declaration）](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) を使用して、C関数に対して生成された以下のAPIに移動します：

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

Cの型は直接マッピングされますが、`char` 型だけは例外です。`char` は通常8ビットの符号付き数値であるため、`kotlin.Byte` にマッピングされます：

| C                  | Kotlin        |
|--------------------|---------------|
| char               | kotlin.Byte   |
| unsigned char      | kotlin.UByte  |
| short              | kotlin.Short  |
| unsigned short     | kotlin.UShort |
| int                | kotlin.Int    |
| unsigned int       | kotlin.UInt   |
| long long          | kotlin.Long   |
| unsigned long long | kotlin.ULong  |
| float              | kotlin.Float  |
| double             | kotlin.Double |

## Kotlinコードの更新

Cの定義を確認したので、Kotlinコードを更新できます。`hello.kt` ファイルの最終的なコードは以下のようになります：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    ints(1, 2, 3, 4)
    uints(5u, 6u, 7u, 8u)
    doubles(9.0f, 10.0)
}
```

すべてが期待通りに動作することを確認するには、[IDEで](native-get-started.md#build-and-run-the-application) `runDebugExecutable<YourTargetName>` Gradleタスクを実行するか、ターミナルでコンソールコマンドを使用してコードを実行します。この例では以下の通りです：

```bash
./gradlew runDebugExecutableMacosArm64
```

## 次のステップ

シリーズの次のパートでは、構造体（struct）型と共用体（union）型がKotlinとCの間でどのようにマッピングされるかを学びます：

**[次のパートに進む](mapping-struct-union-types-from-c.md)**

### 関連項目

より高度なシナリオをカバーしている [Cとの相互運用性](native-c-interop.md) ドキュメントで詳細を確認してください。