[//]: # (title: Cからプリミティブデータ型をマッピングする - チュートリアル)

<tldr>
    <p>これは、**KotlinとCのマッピング**チュートリアルシリーズの最初のパートです。</p>
    <p><img src="icon-1.svg" width="20" alt="最初のステップ"/> **Cからプリミティブデータ型をマッピングする**<br/>
       <img src="icon-2-todo.svg" width="20" alt="2番目のステップ"/> <a href="mapping-struct-union-types-from-c.md">Cの構造体と共用体型をマッピングする</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="3番目のステップ"/> <a href="mapping-function-pointers-from-c.md">Cの関数ポインタをマッピングする</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="4番目のステップ"/> <a href="mapping-strings-from-c.md">Cの文字列をマッピングする</a><br/>
    </p>
</tldr>

> Cライブラリのインポートは[ベータ版](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)です。cinteropツールによってCライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="note"}

Kotlin/NativeでどのCデータ型が可視になるか（またその逆も）を探り、Kotlin/Nativeと[マルチプラットフォーム](gradle-configure-project.md#targeting-multiple-platforms)Gradleビルドにおける高度なC相互運用関連のユースケースを調べましょう。

このチュートリアルでは、以下のことを行います。

*   [C言語のデータ型について学ぶ](#types-in-c-language)
*   [それらの型をエクスポートで使用するCライブラリを作成する](#create-a-c-library)
*   [Cライブラリから生成されたKotlin APIを調査する](#inspect-generated-kotlin-apis-for-a-c-library)

コマンドラインを使用してKotlinライブラリを生成できます。これは直接、またはスクリプトファイル（`.sh`や`.bat`ファイルなど）を使用しても可能です。
しかし、このアプローチは、何百ものファイルやライブラリを持つ大規模プロジェクトにはうまくスケールしません。
ビルドシステムを使用すると、Kotlin/Nativeコンパイラのバイナリやライブラリ、および推移的依存関係のダウンロードとキャッシュ、コンパイラとテストの実行を自動化することでプロセスが簡素化されます。
Kotlin/Nativeは、[Kotlin Multiplatformプラグイン](gradle-configure-project.md#targeting-multiple-platforms)を介して[Gradle](https://gradle.org)ビルドシステムを使用できます。

## C言語の型

Cプログラミング言語には、以下の[データ型](https://en.wikipedia.org/wiki/C_data_types)があります。

*   基本型: `char, int, float, double` と修飾子 `signed, unsigned, short, long`
*   構造体、共用体、配列
*   ポインタ
*   関数ポインタ

さらに、より具体的な型もあります。

*   真偽値型（[C99](https://en.wikipedia.org/wiki/C99)より）
*   `size_t` と `ptrdiff_t`（`ssize_t`も）
*   固定幅整数型（例: `int32_t` または `uint64_t`）（[C99](https://en.wikipedia.org/wiki/C99)より）

C言語には、`const`、`volatile`、`restrict`、`atomic`という型修飾子もあります。

Cのデータ型がKotlinでどのように見えるかを見てみましょう。

## Cライブラリを作成する

このチュートリアルでは、`lib.c`ソースファイルは作成しません。これはCライブラリをコンパイルして実行する場合にのみ必要です。この設定では、[cinteropツール](native-c-interop.md)の実行に必要な`.h`ヘッダーファイルのみが必要です。

cinteropツールは、各`.h`ファイルのセットに対してKotlin/Nativeライブラリ（`.klib`ファイル）を生成します。生成されたライブラリは、Kotlin/NativeからCへの呼び出しを橋渡しするのに役立ちます。これには、`.h`ファイルの定義に対応するKotlin宣言が含まれます。

Cライブラリを作成するには：

1.  将来のプロジェクト用に空のフォルダを作成します。
2.  その中に、C関数がKotlinにどのようにマッピングされるかを確認するために、以下の内容の`lib.h`ファイルを作成します。

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   このファイルには`extern "C"`ブロックがありませんが、この例では必要ありません。ただし、C++とオーバーロード関数を使用する場合は必要になる場合があります。詳細については、この[Stackoverflowスレッド](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)を参照してください。

3.  以下の内容で`lib.def` [定義ファイル](native-definition-file.md)を作成します。

   ```c
   headers = lib.h
   ```

4.  cinteropツールによって生成されるコードにマクロやその他のC定義を含めることは役立つ場合があります。これにより、メソッド本体もコンパイルされ、バイナリに完全に含まれます。この機能を使用すると、Cコンパイラを必要とせずに実行可能な例を作成できます。

   これを行うには、`lib.h`ファイルからのC関数の実装を、`---`区切り文字の後に新しい`interop.def`ファイルに追加します。

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def`ファイルは、アプリケーションをコンパイル、実行、またはIDEで開くために必要なすべてを提供します。

## Kotlin/Nativeプロジェクトを作成する

> 詳細な最初のステップと新しいKotlin/Nativeプロジェクトを作成してIntelliJ IDEAで開く方法については、[Kotlin/Nativeを始める](native-get-started.md#using-gradle)チュートリアルを参照してください。
>
{style="tip"}

プロジェクトファイルを作成するには：

1.  プロジェクトフォルダに、以下の内容の`build.gradle(.kts)` Gradleビルドファイルを作成します。

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
        // mingwX64("native") {   // on Windows
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

   このプロジェクトファイルは、C相互運用をビルドステップとして追加で設定します。
   設定のさまざまな方法については、[Multiplatform Gradle DSL リファレンス](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)を参照してください。

2.  `interop.def`、`lib.h`、`lib.def`ファイルを`src/nativeInterop/cinterop`ディレクトリに移動します。
3.  `src/nativeMain/kotlin`ディレクトリを作成します。Gradleの規約に従い、ここにすべてのソースファイルを配置します。

   デフォルトでは、Cからのすべてのシンボルは`interop`パッケージにインポートされます。

4.  `src/nativeMain/kotlin`に、以下の内容の`hello.kt`スタブファイルを作成します。

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

Cのプリミティブ型宣言がKotlin側からどのように見えるかを確認した後で、コードを完成させます。

## Cライブラリの生成されたKotlin APIを調査する

Cのプリミティブ型がKotlin/Nativeにどのようにマッピングされるかを見て、それに応じてサンプルプロジェクトを更新しましょう。

IntelliJ IDEAの[Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数用に生成された以下のAPIに移動します。

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

Cの型は直接マッピングされますが、`char`型は通常8ビットの符号付き値であるため`kotlin.Byte`にマッピングされます。

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

## Kotlinコードを更新する

Cの定義を確認したところで、Kotlinコードを更新できます。`hello.kt`ファイルの最終コードは次のようになります。

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

すべてが期待通りに動作することを確認するには、[IDEで](native-get-started.md#build-and-run-the-application)`runDebugExecutableNative` Gradleタスクを実行するか、以下のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

シリーズの次のパートでは、構造体と共用体型がKotlinとCの間でどのようにマッピングされるかについて学びます。

**[次のパートに進む](mapping-struct-union-types-from-c.md)**

### 関連項目

より高度なシナリオを扱う[Cとの相互運用](native-c-interop.md)ドキュメントで詳細を学びましょう。