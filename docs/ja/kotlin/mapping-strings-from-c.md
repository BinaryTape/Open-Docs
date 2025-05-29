[//]: # (title: C言語からの文字列マッピング – チュートリアル)

<tldr>
    <p>これは<strong>KotlinとCのデータマッピング</strong>チュートリアルシリーズの最終パートです。始める前に、以前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">C言語からのプリミティブデータ型マッピング</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">C言語からの構造体と共用体マッピング</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">関数ポインタのマッピング</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>C言語からの文字列マッピング</strong><br/>
    </p>
</tldr>

> Cライブラリのインポートは[Experimental (実験的)](components-stability.md#stability-levels-explained)です。cinteropツールによってCライブラリから生成されるすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="warning"}
 
シリーズの最終パートでは、Kotlin/NativeでC言語の文字列をどのように扱うかを見ていきましょう。

このチュートリアルでは、以下の方法を学びます。

* [Kotlinの文字列をCに渡す](#pass-kotlin-strings-to-c)
* [KotlinでC言語の文字列を読み取る](#read-c-strings-in-kotlin)
* [C言語の文字列バイトをKotlinの文字列として受け取る](#receive-c-string-bytes-from-kotlin)

## C言語の文字列の操作

C言語には専用の文字列型がありません。特定のコンテキストで`char *`がC言語の文字列を表すかどうかは、メソッドのシグネチャやドキュメントから判断できます。

C言語の文字列はヌル終端（null-terminated）されており、文字列の終わりを示すためにバイトシーケンスの末尾に終端ゼロ文字`\0`が追加されます。通常、[UTF-8エンコードされた文字列](https://en.wikipedia.org/wiki/UTF-8)が使用されます。
UTF-8エンコーディングは可変幅文字を使用し、[ASCII](https://en.wikipedia.org/wiki/ASCII)との後方互換性があります。
Kotlin/NativeはデフォルトでUTF-8文字エンコーディングを使用します。

KotlinとC言語の間で文字列がどのようにマッピングされるかを理解するために、まずライブラリヘッダーを作成します。
[シリーズの最初のパート](mapping-primitive-data-types-from-c.md)で、必要なファイルを含むCライブラリをすでに作成しています。このステップでは：

1. `lib.h`ファイルを、C言語の文字列を扱う以下の関数宣言で更新します。

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   この例は、C言語で文字列を渡したり受け取ったりする一般的な方法を示しています。`return_string()`関数の戻り値は慎重に扱ってください。返された`char*`を解放するために正しい`free()`関数を使用していることを確認してください。

2. `interop.def`ファイルの`---`セパレータの後に宣言を更新します。

   ```c
   ---
   
   void pass_string(char* str) {
   }
   
   char* return_string() {
     return "C string";
   }
   
   int copy_string(char* str, int size) {
       *str++ = 'C';
       *str++ = ' ';
       *str++ = 'K';
       *str++ = '/';
       *str++ = 'N';
       *str++ = 0;
       return 0;
   }
   ```

`interop.def`ファイルは、アプリケーションをコンパイル、実行、またはIDEで開くために必要なすべてを提供します。

## Cライブラリ用に生成されたKotlin APIの確認

C言語の文字列宣言がKotlin/Nativeにどのようにマッピングされるかを見ていきましょう。

1. `src/nativeMain/kotlin`にある`hello.kt`ファイルを、[前のチュートリアル](mapping-function-pointers-from-c.md)の内容で更新します。

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi
  
   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")

       pass_string(/*fix me*/)
       val useMe = return_string()
       val useMe2 = copy_string(/*fix me*/)
   }
   ```

2. IntelliJ IDEAの[Go to declaration (宣言へ移動)](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C言語関数用に生成された以下のAPIに移動します。

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

これらの宣言はわかりやすいものです。Kotlinでは、C言語の`char *`ポインタは、引数として`str: CValuesRef<ByteVarOf>?`に、戻り値の型として`CPointer<ByteVarOf>?`にマッピングされます。Kotlinは`char`型を`kotlin.Byte`として表現します。これは通常8ビットの符号付き値だからです。

生成されたKotlin宣言では、`str`は`CValuesRef<ByteVarOf<Byte>>?`として定義されています。
この型はヌル許容（nullable）であるため、引数値として`null`を渡すことができます。

## Kotlinの文字列をCに渡す

次に、KotlinからAPIを使ってみましょう。まず`pass_string()`関数を呼び出します。

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cstr

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val str = "This is a Kotlin string"
    pass_string(str.cstr)
}
```

Kotlinの文字列をCに渡すのは、`String.cstr`[拡張プロパティ](extensions.md#extension-properties)のおかげで簡単です。
UTF-16文字が関与するケースには、`String.wcstr`プロパティもあります。

## KotlinでC言語の文字列を読み取る

今度は、`return_string()`関数から返された`char *`を受け取り、それをKotlinの文字列に変換します。

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.toKString

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val stringFromC = return_string()?.toKString()

    println("Returned from C: $stringFromC")
}
```

ここでは、`.toKString()`拡張関数が、`return_string()`関数から返されたC言語の文字列をKotlinの文字列に変換します。

Kotlinは、C言語の`char *`文字列をKotlinの文字列に変換するためのいくつかの拡張関数を提供しています。これらはエンコーディングによって異なります。

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // UTF-8文字列のための標準関数
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // UTF-8文字列を明示的に変換する
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // UTF-16エンコードされた文字列を変換する
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // UTF-32エンコードされた文字列を変換する
```

## C言語の文字列バイトをKotlinの文字列として受け取る

今回は、`copy_string()`C関数を使用して、指定されたバッファにC言語の文字列を書き込みます。これは2つの引数を取ります。文字列を書き込むメモリ位置へのポインタと、許容されるバッファサイズです。

この関数は、成功または失敗を示す何かを返す必要があります。`0`が成功、かつ提供されたバッファが十分な大きさであったことを意味すると仮定しましょう。

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.addressOf
import kotlinx.cinterop.usePinned

@OptIn(ExperimentalForeignApi::class)
fun sendString() {
    val buf = ByteArray(255)
    buf.usePinned { pinned ->
        if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
            throw Error("Failed to read string from C")
        }
    }

    val copiedStringFromC = buf.decodeToString()
    println("Message from C: $copiedStringFromC")
}
```

ここでは、まずネイティブポインタがC関数に渡されます。`.usePinned`拡張関数は、バイト配列のネイティブメモリアドレスを一時的に固定します。C関数はバイト配列にデータを書き込みます。もう1つの拡張関数である`ByteArray.decodeToString()`は、UTF-8エンコーディングを仮定して、バイト配列をKotlinの文字列に変換します。

## Kotlinコードの更新

C言語の宣言をKotlinコードで使用する方法を学んだので、プロジェクトでそれらを使用してみましょう。
最終的な`hello.kt`ファイルは次のようになるでしょう。
 
```kotlin
import interop.*
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val str = "This is a Kotlin string"
    pass_string(str.cstr)

    val useMe = return_string()?.toKString() ?: error("null pointer returned")
    println(useMe)

    val copyFromC = ByteArray(255).usePinned { pinned ->
        val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
        if (useMe2 != 0) throw Error("Failed to read a string from C")
        pinned.get().decodeToString()
    }

    println(copyFromC)
}
```

すべてが期待通りに動作することを確認するには、[IDE](native-get-started.md)で`runDebugExecutableNative` Gradleタスクを実行するか、以下のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

より高度なシナリオをカバーする[C言語との相互運用](native-c-interop.md)ドキュメントで詳細を学びましょう。