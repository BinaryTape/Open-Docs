[//]: # (title: Cの文字列のマッピング – チュートリアル)

<tldr>
    <p>このチュートリアルは、<strong>KotlinとCのマッピング</strong>シリーズの最終パートです。始める前に、以前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">Cのプリミティブデータ型のマッピング</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">Cの構造体と共用体型のマッピング</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">関数ポインタのマッピング</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>Cの文字列のマッピング</strong><br/>
    </p>
</tldr>

> Cライブラリのインポートは[ベータ版](native-c-interop-stability.md)です。cinteropツールによってCライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）では、一部のAPIのみにオプトインが必要です。
>
{style="note"}
 
このシリーズの最終パートでは、Kotlin/NativeでC文字列を扱う方法を見ていきましょう。

このチュートリアルでは、次の方法を学びます。

*   [Kotlin文字列をCに渡す](#pass-kotlin-strings-to-c)
*   [KotlinでC文字列を読み取る](#read-c-strings-in-kotlin)
*   [C文字列のバイトをKotlin文字列として受け取る](#receive-c-string-bytes-from-kotlin)

## C文字列の操作

Cには専用の文字列型がありません。指定された`char *`が特定のコンテキストでC文字列を表すかどうかは、メソッドのシグネチャやドキュメントから識別できます。

C言語の文字列はヌル終端であり、文字列の終わりを示すためにバイトシーケンスの最後に終端のゼロ文字`\0`が追加されます。通常、[UTF-8エンコードされた文字列](https://en.wikipedia.org/wiki/UTF-8)が使用されます。UTF-8エンコーディングは可変幅文字を使用し、[ASCII](https://en.wikipedia.org/wiki/ASCII)と後方互換性があります。Kotlin/NativeはデフォルトでUTF-8文字エンコーディングを使用します。

KotlinとCの間で文字列がどのようにマッピングされるかを理解するために、まずライブラリヘッダーを作成します。
[シリーズの最初の部分](mapping-primitive-data-types-from-c.md)では、必要なファイルを含むCライブラリをすでに作成しています。このステップでは、次の手順を実行します。

1.  `lib.h`ファイルを次のC文字列を操作する関数宣言で更新します。

    ```c
    #ifndef LIB2_H_INCLUDED
    #define LIB2_H_INCLUDED
    
    void pass_string(char* str);
    char* return_string();
    int copy_string(char* str, int size);
    
    #endif
    ```

    この例は、C言語で文字列を渡したり受け取ったりする一般的な方法を示しています。`return_string()`関数の戻り値は注意して扱ってください。返された`char*`を解放するために正しい`free()`関数を使用していることを確認してください。

2.  `interop.def`ファイルの`---`セパレータの後で宣言を更新します。

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

`interop.def`ファイルには、アプリケーションをコンパイル、実行、またはIDEで開くために必要なすべてが用意されています。

## Cライブラリ用に生成されたKotlin APIを検査する

C文字列の宣言がKotlin/Nativeにどのようにマッピングされるかを見ていきましょう。

1.  `src/nativeMain/kotlin`で、[以前のチュートリアル](mapping-function-pointers-from-c.md)から`hello.kt`ファイルを次の内容で更新します。

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

2.  IntelliJ IDEAの[宣言へ移動](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数用に生成された次のAPIに移動します。

    ```kotlin
    fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
    fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
    fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
    ```

これらの宣言はわかりやすいものです。Kotlinでは、Cの`char *`ポインタは、パラメータには`str: CValuesRef<ByteVarOf>?`に、戻り値の型には`CPointer<ByteVarOf>?`にマッピングされます。Kotlinは`char`型を`kotlin.Byte`として表します。これは通常8ビットの符号付き値であるためです。

生成されたKotlinの宣言では、`str`は`CValuesRef<ByteVarOf<Byte>>?`として定義されています。
この型はヌル許容なので、引数値として`null`を渡すことができます。

## Kotlin文字列をCに渡す

KotlinからAPIを使用してみましょう。最初に`pass_string()`関数を呼び出します。

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

Kotlin文字列をCに渡すのは、`String.cstr`[拡張プロパティ](extensions.md#extension-properties)のおかげで簡単です。
UTF-16文字を扱う場合は、`String.wcstr`プロパティも利用できます。

## KotlinでC文字列を読み取る

次に、`return_string()`関数から返された`char *`をKotlin文字列に変換します。

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

ここでは、[`.toKString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/to-k-string.html)拡張関数が、`return_string()`関数から返されたC文字列をKotlin文字列に変換します。

Kotlinには、Cの`char *`文字列をKotlin文字列に変換するためのいくつかの拡張関数が、エンコーディングに応じて提供されています。

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // UTF-8文字列の標準関数
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // UTF-8文字列を明示的に変換
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // UTF-16エンコードされた文字列を変換
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // UTF-32エンコードされた文字列を変換
```

## KotlinからC文字列のバイトを受け取る

今回は、`copy_string()` C関数を使用して、C文字列を特定のバッファに書き込みます。これには2つの引数があります。文字列を書き込むメモリ位置へのポインタと、許可されるバッファサイズです。

関数はまた、成功したか失敗したかを示すために何かを返す必要があります。`0`は成功し、提供されたバッファが十分な大きさであったことを意味すると仮定しましょう。

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

ここでは、まずネイティブポインタがC関数に渡されます。[`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)拡張関数は、バイト配列のネイティブメモリアドレスを一時的にピン留めします。C関数はバイト配列にデータを格納します。別の拡張関数`ByteArray.decodeToString()`は、UTF-8エンコーディングを仮定して、バイト配列をKotlin文字列に変換します。

## Kotlinコードを更新する

KotlinコードでCの宣言を使用する方法を学んだので、プロジェクトでそれらを使用してみましょう。
最終的な`hello.kt`ファイルは次のようになります。
 
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

すべてが期待通りに動作することを確認するには、[IDEで](native-get-started.md)`runDebugExecutableNative` Gradleタスクを実行するか、次のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

より高度なシナリオをカバーする[Cとの相互運用性](native-c-interop.md)ドキュメントで、さらに詳しく学びましょう。