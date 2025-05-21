---
title: "Cからの文字列のマッピング – チュートリアル"
---
:::info
<p>
   これは、<strong>KotlinとCのマッピング</strong>チュートリアルシリーズの最終パートです。先に進む前に、前の手順を完了していることを確認してください。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">Cからのプリミティブデータ型のマッピング</a><br/>
        <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">Cからの構造体と共用体のマッピング</a><br/>
      <img src="/img/icon-3-done.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">関数ポインタのマッピング</a><br/>
      <img src="/img/icon-4.svg" width="20" alt="Fourth step"/> <strong>Cからの文字列のマッピング</strong><br/>
</p>

:::

:::caution
Cライブラリのインポートは[Experimental](components-stability#stability-levels-explained)です。cinteropツールによってCライブラリから生成されたすべてのKotlinの宣言には、`@ExperimentalForeignApi`アノテーションが必要です。

Kotlin/Nativeに付属するネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。

:::
 
このシリーズの最終パートでは、Kotlin/NativeでCの文字列を扱う方法を見ていきましょう。

このチュートリアルでは、次の方法を学びます。

* [Kotlinの文字列をCに渡す](#pass-kotlin-strings-to-c)
* [KotlinでCの文字列を読む](#read-c-strings-in-kotlin)
* [KotlinからCの文字列のバイト列を受け取る](#receive-c-string-bytes-from-kotlin)

## Cの文字列の操作

Cには専用の文字列型がありません。メソッドのシグネチャまたはドキュメントは、特定のコンテキストで与えられた`char *`がCの文字列を表すかどうかを識別するのに役立ちます。

C言語の文字列はnull終端されているため、文字列の終わりを示すために、バイトシーケンスの末尾にトレーリングゼロ文字`\0`が追加されます。通常、[UTF-8エンコード文字列](https://en.wikipedia.org/wiki/UTF-8)が使用されます。UTF-8エンコーディングは可変幅の文字を使用し、[ASCII](https://en.wikipedia.org/wiki/ASCII)との下位互換性があります。Kotlin/NativeはデフォルトでUTF-8文字エンコーディングを使用します。

文字列がKotlinとCの間でどのようにマッピングされるかを理解するために、最初にライブラリヘッダーを作成します。[シリーズの最初のパート](mapping-primitive-data-types-from-c)では、必要なファイルを含むCライブラリを既に作成しています。このステップでは：

1. Cの文字列を扱う次の関数宣言で`lib.h`ファイルを更新します。

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   この例は、C言語で文字列を渡したり受け取ったりする一般的な方法を示しています。`return_string()`関数の戻り値を慎重に処理してください。返された`char*`を解放するために、正しい`free()`関数を使用していることを確認してください。

2. `---`セパレーターの後に`interop.def`ファイルの宣言を更新します。

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

`interop.def`ファイルは、コンパイル、実行、またはIDEでアプリケーションを開くために必要なすべてを提供します。

## Cライブラリ用に生成されたKotlin APIを検査する

Cの文字列宣言がKotlin/Nativeにどのようにマッピングされるかを見てみましょう。

1. `src/nativeMain/kotlin`で、[前のチュートリアル](mapping-function-pointers-from-c)から`hello.kt`ファイルを次の内容で更新します。

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

2. IntelliJ IDEAの[宣言へ移動](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数のために生成された次のAPIに移動します。

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

これらの宣言は簡単です。Kotlinでは、Cの`char *`ポインタは、パラメータの場合は`str: CValuesRef<ByteVarOf>?`に、戻り値の型の場合は`CPointer<ByteVarOf>?`にマッピングされます。Kotlinは`char`型を`kotlin.Byte`として表します。これは通常8ビットの符号付きの値です。

生成されたKotlinの宣言では、`str`は`CValuesRef<ByteVarOf<Byte>>?`として定義されています。
この型はnullableなので、`null`を引数の値として渡すことができます。

## Kotlinの文字列をCに渡す

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

Kotlinの文字列をCに渡すのは簡単です。`String.cstr`[拡張プロパティ](extensions#extension-properties)のおかげです。
UTF-16文字を含む場合は、`String.wcstr`プロパティもあります。

## KotlinでCの文字列を読む

次に、`return_string()`関数から返された`char *`を取得して、Kotlinの文字列に変換します。

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

ここで、`.toKString()`拡張関数は、`return_string()`関数から返されたCの文字列をKotlinの文字列に変換します。

Kotlinは、Cの`char *`文字列をKotlinの文字列に変換するためのいくつかの拡張関数を提供します。
エンコーディングに応じて：

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // UTF-8文字列の標準関数
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // UTF-8文字列を明示的に変換します
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // UTF-16エンコードされた文字列を変換します
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // UTF-32エンコードされた文字列を変換します
```

## KotlinからCの文字列のバイト列を受け取る

今回は、`copy_string()` C関数を使用して、Cの文字列を指定されたバッファーに書き込みます。これには、文字列を書き込むメモリ位置へのポインタと、許可されたバッファーサイズの2つの引数が必要です。

関数は、成功したか失敗したかを示す何かを返す必要もあります。`0`は成功したことを意味し、提供されたバッファーは十分に大きいと仮定しましょう。

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.addressOf
import kotlinx.cinterop.usePinned

@OptIn(ExperimentalForeignApi::class)
fun sendString() {
    val buf = ByteArray(255)
    buf.usePinned { pinned `->`
        if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
            throw Error("Failed to read string from C")
        }
    }

    val copiedStringFromC = buf.decodeToString()
    println("Message from C: $copiedStringFromC")
}
```

ここで、ネイティブポインタが最初にC関数に渡されます。`.usePinned`拡張関数は、バイト配列のネイティブメモリアドレスを一時的にピン止めします。C関数はバイト配列にデータを入力します。別の拡張関数`ByteArray.decodeToString()`は、UTF-8エンコーディングを想定して、バイト配列をKotlinの文字列に変換します。

## Kotlinコードを更新する

KotlinコードでCの宣言を使用する方法を学んだので、プロジェクトでそれらを使用してみてください。
最後の`hello.kt`ファイル内のコードは次のようになります。
 
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

    val copyFromC = ByteArray(255).usePinned { pinned `->`
        val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
        if (useMe2 != 0) throw Error("Failed to read a string from C")
        pinned.get().decodeToString()
    }

    println(copyFromC)
}
```

すべてが期待どおりに動作することを確認するには、[IDEで](native-get-started)`runDebugExecutableNative` Gradleタスクを実行するか、次のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

より高度なシナリオをカバーする[Cとの相互運用性](native-c-interop)ドキュメントで詳細をご覧ください。