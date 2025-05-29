[//]: # (title: Cのプリミティブデータ型のマッピング – チュートリアル)

<tldr>
    <p>これは<strong>KotlinとCのマッピング</strong>チュートリアルシリーズの最初のパートです。</p>
    <p><img src="icon-1.svg" width="20" alt="最初のステップ"/> <strong>Cのプリミティブデータ型のマッピング</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="2番目のステップ"/> <a href="mapping-struct-union-types-from-c.md">Cの構造体と共用体型のマッピング</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="3番目のステップ"/> <a href="mapping-function-pointers-from-c.md">関数ポインターのマッピング</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="4番目のステップ"/> <a href="mapping-strings-from-c.md">Cの文字列のマッピング</a><br/>
    </p>
</tldr>

> Cライブラリのインポートは[実験的機能 (Experimental)](components-stability.md#stability-levels-explained)です。cinteropツールによってCライブラリから生成されるKotlinの宣言は、すべて`@ExperimentalForeignApi`アノテーションを持つ必要があります。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="warning"}

どのCデータ型がKotlin/Nativeで可視であるか、またその逆についても見ていきましょう。さらに、Kotlin/NativeのC言語との相互運用に関連する高度なユースケースや、[マルチプラットフォーム](gradle-configure-project.md#targeting-multiple-platforms)のGradleビルドについて詳しく見ていきます。

このチュートリアルでは、次のことを行います:

* [C言語のデータ型について学ぶ](#types-in-c-language)
* [それらの型をエクスポートで使用するCライブラリを作成する](#create-a-c-library)
* [Cライブラリから生成されたKotlin APIを検査する](#inspect-generated-kotlin-apis-for-a-c-library)

コマンドラインを使用して、直接、またはスクリプトファイル（`.sh`や`.bat`ファイルなど）でKotlinライブラリを生成できます。しかし、このアプローチは、何百ものファイルやライブラリを持つ大規模なプロジェクトにはうまくスケールしません。ビルドシステムを使用すると、Kotlin/Nativeのコンパイラのバイナリと推移的依存関係を持つライブラリをダウンロードしてキャッシュし、コンパイラとテストを実行することでプロセスを簡素化できます。Kotlin/Nativeは、[Kotlin Multiplatformプラグイン](gradle-configure-project.md#targeting-multiple-platforms)を介して[Gradle](https://gradle.org)ビルドシステムを使用できます。

## C言語のデータ型

Cプログラミング言語には、以下の[データ型](https://en.wikipedia.org/wiki/C_data_types)があります:

* 基本型: `char, int, float, double` （修飾子 `signed, unsigned, short, long` を伴う）
* 構造体、共用体、配列
* ポインター
* 関数ポインター

また、より具体的な型も存在します:

* 真偽値型 (Boolean型)（[C99](https://en.wikipedia.org/wiki/C99)より）
* `size_t` および `ptrdiff_t` （`ssize_t` も）
* 固定幅整数型（`int32_t` や `uint64_t` など）（[C99](https://en.wikipedia.org/wiki/C99)より）

C言語には、以下の型修飾子も存在します: `const`、`volatile`、`restrict`、`atomic`。

どのCデータ型がKotlinで可視であるかを見ていきましょう。

## Cライブラリを作成する

このチュートリアルでは、`lib.c`ソースファイルを作成しません。これはCライブラリをコンパイルして実行したい場合にのみ必要です。この設定では、[cinteropツール](native-c-interop.md)の実行に必要となる`.h`ヘッダーファイルのみが必要です。

cinteropツールは、`.h`ファイルの各セットに対してKotlin/Nativeライブラリ（`.klib`ファイル）を生成します。生成されたライブラリは、Kotlin/NativeからCへの呼び出しを橋渡しするのに役立ちます。これには、`.h`ファイルからの定義に対応するKotlinの宣言が含まれています。

Cライブラリを作成するには:

1. 今後のプロジェクトのために空のフォルダーを作成します。
2. その中に、C関数がKotlinにどのようにマッピングされるかを確認するために、以下の内容で`lib.h`ファイルを作成します:

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   このファイルには`extern "C"`ブロックがありません。これはこの例では必要ありませんが、C++およびオーバーロードされた関数を使用する場合は必要になる場合があります。詳細は、この[Stackoverflowスレッド](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)を参照してください。

3. 以下の内容で`lib.def`[定義ファイル](native-definition-file.md)を作成します:

   ```c
   headers = lib.h
   ```

4. cinteropツールによって生成されたコードに、マクロやその他のC定義を含めることは役立つ場合があります。これにより、メソッド本体もコンパイルされ、バイナリに完全に含まれます。この機能により、Cコンパイラを必要とせずに実行可能な例を作成できます。

   そのためには、`lib.h`ファイルからのC関数の実装を、`---`セパレーターの後で新しい`interop.def`ファイルに追加します:

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def`ファイルは、アプリケーションをコンパイル、実行、またはIDEで開くために必要なすべてを提供します。

## Kotlin/Nativeプロジェクトを作成する

> 詳細な最初のステップについては、[Kotlin/Nativeを始める](native-get-started.md#using-gradle)チュートリアルを参照してください。および新しいKotlin/Nativeプロジェクトを作成し、IntelliJ IDEAで開く方法に関する指示についても記載されています。
>
{style="tip"}

プロジェクトファイルを作成するには:

1. プロジェクトフォルダー内に、以下の内容で`build.gradle(.kts)`Gradleビルドファイルを作成します:

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
        macosArm64("native") {    // Apple Silicon上のmacOS
        // macosX64("native") {   // x86_64プラットフォーム上のmacOS
        // linuxArm64("native") { // ARM64プラットフォーム上のLinux 
        // linuxX64("native") {   // x86_64プラットフォーム上のLinux
        // mingwX64("native") {   // Windows上
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
        // macosX64("native") {   // x86_64プラットフォーム上のmacOS
        // linuxArm64("native") { // ARM64プラットフォーム上のLinux
        // linuxX64("native") {   // x86_64プラットフォーム上のLinux
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

   このプロジェクトファイルは、C相互運用をビルドの追加ステップとして構成します。さまざまな構成方法を学ぶために、[Multiplatform Gradle DSLリファレンス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)を確認してください。

2. `interop.def`、`lib.h`、`lib.def`ファイルを`src/nativeInterop/cinterop`ディレクトリに移動します。
3. `src/nativeMain/kotlin`ディレクトリを作成します。これは、Gradleの規約を使用するという推奨事項に従って、すべてのソースファイルを配置するべき場所です。

   デフォルトでは、Cからのすべてのシンボルは`interop`パッケージにインポートされます。

4. `src/nativeMain/kotlin`内に、以下の内容で`hello.kt`スタブファイルを作成します:

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

Cのプリミティブ型宣言がKotlin側からどのように見えるかを学ぶにつれて、後でコードを完成させます。

## Cライブラリから生成されたKotlin APIを検査する

Cのプリミティブ型がKotlin/Nativeにどのようにマッピングされるかを見て、それに応じてサンプルプロジェクトを更新しましょう。

IntelliJ IDEAの[宣言に移動](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、以下の生成されたAPI（C関数用）に移動します:

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C型は直接マッピングされますが、`char`型は通常8ビットの符号付き値であるため、`kotlin.Byte`にマッピングされます。

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

Cの定義を見たので、Kotlinコードを更新できます。`hello.kt`ファイルの最終的なコードはこのようになります:

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

すべてが期待通りに動作することを確認するために、[IDE](native-get-started.md#build-and-run-the-application)で`runDebugExecutableNative`Gradleタスクを実行するか、以下のコマンドを使用してコードを実行します:

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

シリーズの次のパートでは、構造体と共用体型がKotlinとCの間でどのようにマッピングされるかを学びます:

**[次のパートに進む](mapping-struct-union-types-from-c.md)**

### 参照

より高度なシナリオをカバーする[Cとの相互運用](native-c-interop.md)ドキュメントで詳細を学びましょう。