[//]: # (title: Cからの文字列のマッピング – チュートリアル)

<tldr>
    <p>これは <strong>KotlinとCのマッピング</strong> チュートリアルシリーズの最終パートです。次に進む前に、前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">Cからのプリミティブデータ型のマッピング</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">Cからの構造体および共用体型のマッピング</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">Cからの関数ポインタのマッピング</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>Cからの文字列のマッピング</strong><br/>
    </p>
</tldr>

> Cライブラリのインポートは[ベータ](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)段階です。cinteropツールによってCライブラリから生成されるすべてのKotlin宣言には、`@ExperimentalForeignApi` アノテーションが付与されます。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="note"}
 
シリーズの最終パートでは、Kotlin/NativeでCの文字列を扱う方法を見ていきましょう。

このチュートリアルでは、以下の方法を学びます：

* [Kotlinの文字列をCに渡す](#pass-kotlin-strings-to-c)
* [KotlinでCの文字列を読み取る](#read-c-strings-in-kotlin)
* [Cの文字列バイトをKotlinの文字列として受け取る](#receive-c-string-bytes-from-kotlin)

## Cの文字列を扱う

Cには専用の文字列型はありません。メソッドのシグネチャやドキュメントから、特定のコンテキストにおいて `char *` がCの文字列を表しているかどうかを判断する必要があります。

C言語の文字列はヌル終端（null-terminated）されており、バイトシーケンスの最後に文字列の終わりを示すゼロ文字 `\0` が追加されます。通常は、[UTF-8 エンコードされた文字列](https://en.wikipedia.org/wiki/UTF-8)が使用されます。UTF-8エンコーディングは可変幅文字を使用し、[ASCII](https://en.wikipedia.org/wiki/ASCII)と後方互換性があります。Kotlin/NativeはデフォルトでUTF-8文字エンコーディングを使用します。

KotlinとCの間で文字列がどのようにマッピングされるかを理解するために、まずライブラリヘッダーを作成します。[シリーズの第1パート](mapping-primitive-data-types-from-c.md)で、必要なファイルを含むCライブラリをすでに作成しているはずです。このステップでは以下を行います：

1. Cの文字列を扱う以下の関数宣言で `lib.h` ファイルを更新します：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   この例は、C言語で文字列を渡したり受け取ったりする一般的な方法を示しています。`return_string()` 関数の戻り値は慎重に扱ってください。返された `char*` を解放するために正しい `free()` 関数を使用するようにします。

2. `interop.def` ファイルの `---` セパレータの後の宣言を更新します：

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

`interop.def` ファイルは、アプリケーションのコンパイル、実行、またはIDEでの展開に必要なすべての情報を提供します。

## Cライブラリ用に生成されたKotlin APIを確認する

Cの文字列宣言がKotlin/Nativeにどのようにマッピングされるか見てみましょう：

1. `src/nativeMain/kotlin` にある [前のチュートリアル](mapping-function-pointers-from-c.md) の `hello.kt` ファイルを以下の内容で更新します：

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

2. IntelliJ IDEAの [宣言へ移動（Go to declaration）](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数に対して生成された以下のAPIに移動します：

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

これらの宣言は明快です。Kotlinでは、Cの `char *` ポインタはパラメータの場合は `str: CValuesRef<ByteVarOf>?` に、戻り値の型の場合は `CPointer<ByteVarOf>?` にマッピングされます。Kotlinでは、`char` 型は通常8ビットの符号付き数値であるため、`kotlin.Byte` として表現されます。

生成されたKotlinの宣言では、`str` は `CValuesRef<ByteVarOf<Byte>>?` として定義されています。この型はNullable（ヌル許容）であるため、引数の値として `null` を渡すことができます。

## Kotlinの文字列をCに渡す

KotlinからAPIを使用してみましょう。まず `pass_string()` 関数を呼び出します：

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

`String.cstr` [拡張プロパティ](extensions.md#extension-properties) のおかげで、Kotlinの文字列をCに渡すのは簡単です。UTF-16文字を含むケースには `String.wcstr` プロパティもあります。

## KotlinでCの文字列を読み取る

次に、`return_string()` 関数から返された `char *` を受け取り、それをKotlinの文字列に変換します：

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

ここでは、[`.toKString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/to-k-string.html) 拡張関数を使用して、`return_string()` 関数から返されたCの文字列をKotlinの文字列に変換しています。

Kotlinは、エンコーディングに応じてCの `char *` 文字列をKotlinの文字列に変換するためのいくつかの拡張関数を提供しています：

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // UTF-8文字列用の標準的な関数
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // UTF-8文字列を明示的に変換
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // UTF-16エンコードされた文字列を変換
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // UTF-32エンコードされた文字列を変換
```

## Cの文字列バイトをKotlinの文字列として受け取る

今回は、`copy_string()` C関数を使用して、指定されたバッファにCの文字列を書き込みます。この関数は2つの引数を取ります：文字列が書き込まれるメモリ位置へのポインタと、許可されるバッファサイズです。

関数は、成功したか失敗したかを示す値も返す必要があります。ここでは `0` が成功を意味し、提供されたバッファが十分な大きさであったと仮定します：

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

ここでは、まずネイティブポインタをC関数に渡しています。[`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 拡張関数は、バイト配列のネイティブメモリアドレスを一時的にピン留め（固定）します。C関数はそのバイト配列にデータを書き込みます。もう一つの拡張関数である `ByteArray.decodeToString()` は、UTF-8エンコーディングを想定してバイト配列をKotlinの文字列に変換します。

## Kotlinコードの更新

KotlinコードでCの宣言を使用する方法を学んだので、これらをプロジェクトで使用してみましょう。最終的な `hello.kt` ファイルのコードは以下のようになります：
 
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

すべてが期待通りに動作することを確認するには、[IDEで](native-get-started.md#build-and-run-the-application) `runDebugExecutable<YourTargetName>` Gradleタスクを実行するか、ターミナルでコンソールコマンドを使用します。この例では以下のようになります：

```bash
./gradlew runDebugExecutableMacosArm64
```

## 次のステップ

より高度なシナリオをカバーしている [Cとの相互運用性](native-c-interop.md) ドキュメントで詳細を確認してください。