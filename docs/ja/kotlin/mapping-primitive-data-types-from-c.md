---
title: "Cのプリミティブデータ型のマッピング – チュートリアル"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   これは、<strong>KotlinとCのマッピング</strong>チュートリアルシリーズの最初の部分です。
</p>
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step"/> <strong>Cからのプリミティブデータ型のマッピング</strong><br/>
       <img src="/img/icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">Cからの構造体と共用体のマッピング</a><br/>
       <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">関数ポインタのマッピング</a><br/>
       <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">Cからの文字列のマッピング</a><br/>
</p>

:::

:::tip
Cライブラリのインポートは[Experimental](components-stability#stability-levels-explained)です。cinteropツールによってCライブラリから生成されたすべてのKotlinの宣言には、`@ExperimentalForeignApi`アノテーションが必要です。

Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIのみオプトインが必要です。

Kotlin/NativeでどのCデータ型が表示されるか、またその逆も調べ、Kotlin/Nativeと[マルチプラットフォーム](gradle-configure-project#targeting-multiple-platforms)GradleビルドのC interop関連の高度なユースケースを検証しましょう。

このチュートリアルでは、次のことを行います。

* [C言語のデータ型について学ぶ](#types-in-c-language)
* [それらの型をエクスポートで使用するCライブラリを作成する](#create-a-c-library)
* [Cライブラリから生成されたKotlin APIを検査する](#inspect-generated-kotlin-apis-for-a-c-library)

コマンドラインを使用してKotlinライブラリを生成できます。直接、またはスクリプトファイル（`.sh`や`.bat`ファイルなど）を使用します。
ただし、このアプローチは、数百のファイルとライブラリを持つ大規模なプロジェクトにはうまくスケールしません。
ビルドシステムを使用すると、Kotlin/Nativeコンパイラのバイナリとライブラリを推移的な依存関係とともにダウンロードしてキャッシュし、コンパイラとテストを実行することで、プロセスが簡素化されます。
Kotlin/Nativeは、[Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms)を介して[Gradle](https://gradle.org)ビルドシステムを使用できます。

## C言語の型

Cプログラミング言語には、次の[データ型](https://en.wikipedia.org/wiki/C_data_types)があります。

* 基本型：`char, int, float, double` に修飾子 `signed, unsigned, short, long`
* 構造体、共用体、配列
* ポインタ
* 関数ポインタ

より具体的な型もあります。

* ブール型（[C99](https://en.wikipedia.org/wiki/C99)以降）
* `size_t` と `ptrdiff_t`（`ssize_t` も）
* 固定幅整数型（`int32_t` や `uint64_t` など）（[C99](https://en.wikipedia.org/wiki/C99)以降）

C言語には、次の型修飾子もあります：`const`, `volatile`, `restrict`, `atomic`。

KotlinでどのCデータ型が表示されるかを見てみましょう。

## Cライブラリを作成する

このチュートリアルでは、Cライブラリをコンパイルして実行する場合にのみ必要な`lib.c`ソースファイルは作成しません。このセットアップでは、[cinterop tool](native-c-interop)の実行に必要な`.h`ヘッダーファイルのみが必要です。

cinteropツールは、`.h`ファイルのセットごとにKotlin/Nativeライブラリ（`.klib`ファイル）を生成します。生成されたライブラリは、Kotlin/NativeからCへの呼び出しをブリッジするのに役立ちます。これには、`.h`ファイルからの定義に対応するKotlinの宣言が含まれています。

Cライブラリを作成するには：

1. 将来のプロジェクトのために空のフォルダを作成します。
2. 内部に、C関数がKotlinにどのようにマッピングされるかを確認するために、次の内容で`lib.h`ファイルを作成します。

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   ファイルには`extern "C"`ブロックがありません。これはこの例では必要ありませんが、C++およびオーバーロードされた関数を使用する場合は必要になる場合があります。詳細については、この[Stackoverflow thread](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)を参照してください。

3. 次の内容で`lib.def`[定義ファイル](native-definition-file)を作成します。

   ```c
   headers = lib.h
   ```

4. cinteropツールによって生成されたコードにマクロまたは他のC定義を含めると便利な場合があります。このようにして、メソッド本体もコンパイルされ、バイナリに完全に含まれます。この機能を使用すると、Cコンパイラを必要とせずに、実行可能な例を作成できます。

   これを行うには、`---`区切り文字の後に、`lib.h`ファイルからのC関数の実装を新しい`interop.def`ファイルに追加します。

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def`ファイルは、アプリケーションをコンパイル、実行、またはIDEで開くために必要なすべてを提供します。

## Kotlin/Nativeプロジェクトを作成する

詳細な最初の手順と、新しいKotlin/Nativeプロジェクトを作成してIntelliJ IDEAで開く方法については、[Kotlin/Nativeを使ってみる](native-get-started#using-gradle)チュートリアルを参照してください。

:::

プロジェクトファイルを作成するには：

1. プロジェクトフォルダに、次の内容で`build.gradle(.kts)` Gradleビルドファイルを作成します。

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
        // mingwX64("native") {   // on Windows
            val main by compilations.getting
            val interop by main.cinterops.creating
        
            binaries {
                executable()
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "8.10"
        distributionType = Wrapper.DistributionType.BIN
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
            compilations.main.cinterops {
                interop 
            }
        
            binaries {
                executable()
            }
        }
    }
    
    wrapper {
        gradleVersion = '8.10'
        distributionType = 'BIN'
    }
    ```

    </TabItem>
    </Tabs>

   プロジェクトファイルは、C interopを追加のビルドステップとして構成します。
   さまざまな構成方法については、[Multiplatform Gradle DSL reference](multiplatform-dsl-reference)を参照してください。

2. `interop.def`、`lib.h`、および`lib.def`ファイルを`src/nativeInterop/cinterop`ディレクトリに移動します。
3. `src/nativeMain/kotlin`ディレクトリを作成します。これは、構成の代わりに規約を使用するというGradleの推奨事項に従って、すべてのソースファイルを配置する必要がある場所です。

   デフォルトでは、Cからのすべてのシンボルが`interop`パッケージにインポートされます。

4. `src/nativeMain/kotlin`に、次の内容で`hello.kt`スタブファイルを作成します。

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

Cプリミティブ型宣言がKotlin側からどのように見えるかを学ぶにつれて、後でコードを完成させます。

## Cライブラリ用に生成されたKotlin APIを検査する

Cプリミティブ型がKotlin/Nativeにどのようにマッピングされるかを見て、それに応じてサンプルプロジェクトを更新しましょう。

IntelliJ IDEAの[Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数のために生成された次のAPIに移動します。

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

`char`型を除いて、C型は直接マッピングされます。`char`型は通常8ビットの符号付きの値であるため、`kotlin.Byte`にマッピングされます。

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

Cの定義を確認したので、Kotlinコードを更新できます。`hello.kt`ファイルの最終的なコードは次のようになります。

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

すべてが期待どおりに動作することを確認するには、[IDEで](native-get-started#build-and-run-the-application)`runDebugExecutableNative` Gradleタスクを実行するか、次のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

シリーズの次のパートでは、構造体と共用体の型がKotlinとCの間でどのようにマッピングされるかを学びます。

**[次のパートに進む](mapping-struct-union-types-from-c)**

### 参照

より高度なシナリオをカバーする[Interoperability with C](native-c-interop)ドキュメントで詳細をご覧ください。