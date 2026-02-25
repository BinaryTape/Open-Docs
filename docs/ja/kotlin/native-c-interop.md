[//]: # (title: Cとの相互運用性)

> Cライブラリのインポートは[ベータ](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)です。cinteropツールによってCライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）では、一部のAPIでのみオプトインが必要です。
>
{style="note"}

このドキュメントでは、KotlinのCとの相互運用性に関する一般的な側面について説明します。Kotlin/Nativeにはcinteropツールが付属しており、これを使用することで、外部のCライブラリと対話するために必要なすべてを迅速に生成できます。

このツールはCのヘッダーを分析し、Cの型、関数、および文字列をKotlinへと直接マッピングしたものを生成します。生成されたスタブはIDEにインポートでき、コード補完やナビゲーションが可能になります。

> KotlinはObjective-Cとの相互運用性も提供しています。Objective-Cライブラリも同様にcinteropツールを通じてインポートされます。詳細については、[Swift/Objective-Cの相互運用性](native-objc-interop.md)を参照してください。
>
{style="tip"}

## プロジェクトのセットアップ

Cライブラリを消費する必要があるプロジェクトで作業する場合の一般的なワークフローは以下の通りです：

1. [定義ファイル (.def)](native-definition-file.md)を作成し、構成します。これには、cinteropツールがKotlinの[バインディング](#bindings)に含めるべき内容を記述します。
2. Gradleビルドファイルを構成し、ビルドプロセスにcinteropを含めます。
3. プロジェクトをコンパイルおよび実行して、最終的な実行ファイルを生成します。

> 実践的な体験をするには、[Cの相互運用性を使用したアプリの作成](native-app-with-c-and-libcurl.md)チュートリアルを完了してください。
>
{style="note"}

多くの場合、Cライブラリとのカスタムな相互運用性を構成する必要はありません。代わりに、[プラットフォームライブラリ](native-platform-libs.md)と呼ばれる、プラットフォーム上で利用可能な標準化されたバインディングAPIを使用できます。たとえば、Linux/macOSプラットフォームのPOSIX、WindowsプラットフォームのWin32、またはmacOS/iOSのAppleフレームワークはこの方法で利用可能です。

## バインディング (Bindings)

### 基本的な相互運用型

サポートされているすべてのCの型には、Kotlinで対応する表現があります：

* 符号付き、符号なし整数、および浮動小数点型は、同じ幅を持つ対応するKotlinの型にマッピングされます。
* ポインタと配列は `CPointer<T>?` にマッピングされます。
* 列挙型（Enum）は、ヒューリスティックや[定義ファイルの設定](native-definition-file.md#configure-enums-generation)に応じて、Kotlinのenumまたは整数値のいずれかにマッピングされます。
* 構造体（Struct）と共用体（Union）は、ドット記法（例：`someStructInstance.field1`）でフィールドにアクセスできる型にマッピングされます。
* `typedef` は `typealias` として表現されます。

また、どのようなCの型にも、その型の「左辺値（lvalue）」を表すKotlinの型、すなわち単なる不変の自己完結した値ではなく、メモリ上に配置された値を表す型が存在します。C++のリファレンスに似た概念と考えてください。構造体（および構造体への `typedef`）の場合、この表現がメインの表現となり、構造体自体と同じ名前を持ちます。Kotlinの列挙型の場合、それは `${type}.Var` という名前になります。`CPointer<T>` の場合は `CPointerVar<T>` であり、他のほとんどの型の場合は `${type}Var` となります。

両方の表現を持つ型の場合、左辺値を持つ方の型には、値にアクセスするためのミュータブルな `.value` プロパティがあります。

#### ポインタ型

`CPointer<T>` の型引数 `T` は、上述の左辺値型のいずれかである必要があります。たとえば、Cの型 `struct S*` は `CPointer<S>` に、`int8_t*` は `CPointer<int_8tVar>` に、`char**` は `CPointer<CPointerVar<ByteVar>>` にマッピングされます。

CのヌルポインタはKotlinの `null` として表現されます。ポインタ型 `CPointer<T>` は非Nullですが、`CPointer<T>?` はNull許容です。この型の値は、`?:`、`?.`、`!!` など、`null` の処理に関連するすべてのKotlin演算子をサポートします。

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

配列も `CPointer<T>` にマッピングされるため、インデックスによる値のアクセスに `[]` 演算子をサポートします。

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` の `.pointed` プロパティは、このポインタが指す型 `T` の左辺値を返します。逆の操作は `.ptr` で、左辺値を受け取り、それを指すポインタを返します。

`void*` は `COpaquePointer` にマッピングされます。これは他のあらゆるポインタ型のスーパータイプとなる特別なポインタ型です。したがって、C関数が `void*` を受け取る場合、Kotlinのバインディングは任意の `CPointer` を受け入れます。

ポインタ（`COpaquePointer` を含む）のキャストは `.reinterpret<T>` で行うことができます。例：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr = bytePtr.reinterpret<IntVar>()
```

または：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr: CPointer<IntVar> = bytePtr.reinterpret()
```

Cと同様に、これらの `.reinterpret` によるキャストは安全ではなく、アプリケーションで潜在的なメモリの問題を引き起こす可能性があります。

また、`CPointer<T>?` と `Long` の間の安全でないキャストも利用可能で、`.toLong()` および `.toCPointer<T>()` 拡張メソッドによって提供されます。

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> コンテキストから結果の型が判明している場合は、型推論のおかげで型引数を省略できます。
> 
{style="tip"}

### メモリ割り当て

ネイティブメモリは `NativePlacement` インターフェースを使用して割り当てることができます。例：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

val placement: NativePlacement = // 配置の例については以下を参照
val byteVar = placement.alloc<ByteVar>()
val bytePtr = placement.allocArray<ByteVar>(5)
```

最も論理的な配置場所は `nativeHeap` オブジェクト内です。これは `malloc` を使用したネイティブメモリの割り当てに対応しており、割り当てられたメモリを解放するための追加の `.free()` 操作を提供します。

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap` ではメモリを手動で解放する必要があります。しかし、メモリの生存期間を字句スコープに制限して割り当てることが有用な場合がよくあります。そのようなメモリが自動的に解放されると便利です。

これに対処するために、`memScoped { }` を使用できます。波括弧の中では、一時的な配置場所が暗黙のレシーバーとして利用可能になるため、`alloc` や `allocArray` でネイティブメモリを割り当てることができ、割り当てられたメモリはスコープを抜けた後に自動的に解放されます。

たとえば、ポインタパラメータを介して値を返すC関数は次のように使用できます：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*
import platform.posix.*

val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### バインディングへのポインタの渡し方

Cのポインタは `CPointer<T>` 型にマッピングされますが、C関数のポインタ型パラメータは `CValuesRef<T>` にマッピングされます。`CPointer<T>` をそのようなパラメータの値として渡すと、そのままC関数に渡されます。ただし、ポインタの代わりに値のシーケンスを渡すこともできます。この場合、シーケンスは「値渡し」され、つまりC関数はそのシーケンスの一時的なコピーへのポインタを受け取ります。このコピーは関数が戻るまでのみ有効です。

ポインタパラメータの `CValuesRef<T>` 表現は、明示的なネイティブメモリ割り当てなしにCの配列リテラルをサポートするように設計されています。不変で自己完結したC値のシーケンスを構築するために、以下のメソッドが提供されています：

* `${type}Array.toCValues()`（`${type}` はKotlinのプリミティブ型）
* `Array<CPointer<T>?>.toCValues()`、`List<CPointer<T>?>.toCValues()`
* `cValuesOf(vararg elements: ${type})`（`${type}` はプリミティブ型またはポインタ）

例：

```c
// C:
void foo(int* elements, int count);
...
int elements[] = {1, 2, 3};
foo(elements, 3);
```

```kotlin
// Kotlin:

foo(cValuesOf(1, 2, 3), 3)
```

### 文字列

他のポインタとは異なり、`const char*` 型のパラメータはKotlinの `String` として表現されます。そのため、Cの文字列を期待するバインディングに任意のKotlin文字列を渡すことができます。

KotlinとCの文字列を手動で変換するためのツールもいくつか用意されています：

* `fun CPointer<ByteVar>.toKString(): String`
* `val String.cstr: CValuesRef<ByteVar>`

ポインタを取得するには、`.cstr` をネイティブメモリに割り当てる必要があります。例：

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

すべての場合において、Cの文字列はUTF-8としてエンコードされることが想定されています。

自動変換をスキップし、バインディングで生のポインタが使用されるようにするには、`.def` ファイルに [`noStringConversion` プロパティ](native-definition-file.md#set-up-string-conversion)を追加します：

```c
noStringConversion = LoadCursorA LoadCursorW
```

これにより、`CPointer<ByteVar>` 型の任意の値を `const char*` 型の引数として渡すことができるようになります。Kotlinの文字列を渡す必要がある場合は、以下のようなコードを使用できます：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // ASCII または UTF-8 バージョン用
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // UTF-16 バージョン用
}
```

### スコープローカルなポインタ

`memScoped {}` 内で利用可能な `CValues<T>.ptr` 拡張プロパティを使用して、`CValues<T>` インスタンスのC表現に対するスコープ内で安定したポインタを作成することが可能です。これにより、特定の `MemScope` に関連付けられた生存期間を持つCポインタを必要とするAPIを使用できます。例：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value -> items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    // ...
}
```

この例では、C APIの `new_menu()` に渡されるすべての値の生存期間は、それが属する最も内側の `memScope` のものとなります。制御フローが `memScoped` スコープを抜けると、Cポインタは無効になります。

### 構造体の値渡しと受け取り

C関数が構造体/共用体 `T` を値で受け取ったり返したりする場合、対応する引数型または戻り値の型は `CValue<T>` として表現されます。

`CValue<T>` は不透明（opaque）な型であるため、適切なKotlinプロパティを使用して構造体のフィールドにアクセスすることはできません。APIが構造体を不透明なハンドルとして使用している場合は、これで問題ありません。しかし、フィールドへのアクセスが必要な場合は、以下の変換メソッドが利用可能です：

* [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
  は（左辺値の） `T` を `CValue<T>` に変換します。したがって、`CValue<T>` を構築するには、`T` を割り当てて値を埋め、それを `CValue<T>` に変換します。
* [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
  は `CValue<T>` を一時的にメモリに格納し、配置された値 `T` をレシーバーとして渡されたラムダを実行します。単一のフィールドを読み取るには、以下のコードを使用できます：

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```
  
* [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
  は、提供された `initialize` 関数を適用して `T` をメモリに割り当て、結果を `CValue<T>` に変換します。
* [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
  は、既存の `CValue<T>` の修正されたコピーを作成します。元の値がメモリに配置され、`modify()` 関数を使用して変更された後、再び新しい `CValue<T>` に変換されます。
* [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
  は、`CValues<T>` を `AutofreeScope` 内に配置し、割り当てられたメモリへのポインタを返します。割り当てられたメモリは、`AutofreeScope` が破棄されるときに自動的に解放されます。

### コールバック

Kotlinの関数をC関数へのポインタに変換するには、`staticCFunction(::kotlinFunction)` を使用できます。関数参照の代わりにラムダを提供することも可能です。ただし、その関数やラムダは値をキャプチャしてはいけません。

#### コールバックへのユーザーデータの渡し方

CのAPIでは、コールバックに何らかのユーザーデータを渡せることがよくあります。このようなデータは通常、ユーザーがコールバックを構成するときに提供されます。それは、たとえば `void*` としてC関数に渡されるか（あるいは構造体に書き込まれるか）します。しかし、Kotlinオブジェクトへの参照を直接Cに渡すことはできません。そのため、コールバックを構成する前にラッピングし、コールバック内でアンラッピングすることで、Cの世界を経由してKotlinからKotlinへと安全にデータを渡す必要があります。このようなラッピングは `StableRef` クラスで可能です。

参照をラッピングするには：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

ここで、`voidPtr` は `COpaquePointer` であり、C関数に渡すことができます。

参照をアンラッピングするには：

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

ここで、`kotlinReference` は元のラッピングされた参照です。

作成された `StableRef` は、メモリリークを防ぐために、最終的に `.dispose()` メソッドを使用して手動で破棄する必要があります：

```kotlin
stableRef.dispose()
```

破棄された後は無効になるため、`voidPtr` をアンラッピングすることはできなくなります。

### マクロ

定数に展開されるすべてのCマクロは、Kotlinのプロパティとして表現されます。

パラメータのないマクロは、コンパイラが型を推論できる場合にサポートされます：

```c
int foo(int);
#define FOO foo(42)
```

この場合、`FOO` はKotlinで利用可能です。

その他のマクロをサポートするには、サポートされている宣言でラップして手動で公開することができます。たとえば、関数のようなマクロ `FOO` は、ライブラリに[カスタム宣言を追加](native-definition-file.md#add-custom-declarations)することで、関数 `foo()` として公開できます：

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 移植性

Cライブラリには、`long` や `size_t` のように、プラットフォームに依存する型の関数パラメータや構造体フィールドが含まれていることがあります。Kotlin自体は、暗黙的な整数キャストもCスタイルの整数キャスト（例：`(size_t) intValue`）も提供していません。そのため、このようなケースで移植性の高いコードを書きやすくするために、`convert` メソッドが提供されています：

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

ここで、`type1` と `type2` のそれぞれは、符号付きまたは符号なしの整数型である必要があります。

`.convert<${type}>` は、`type` に応じて、`.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、`.toUShort`、`.toUInt`、`.toULong` のいずれかのメソッドと同じセマンティクスを持ちます。

`convert` を使用する例：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

また、型パラメータは自動的に推論されることがあるため、場合によっては省略可能です。

### オブジェクトのピン留め（Object pinning）

Kotlinオブジェクトを「ピン留め」することができます。つまり、アンピンされるまでメモリ内での位置が安定していることが保証され、そのようなオブジェクトの内部データへのポインタをC関数に渡すことができます。

以下のいくつかのアプローチがあります：

* [`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 拡張関数を使用します。これはオブジェクトをピン留めし、ブロックを実行し、正常終了時および例外発生時の両方でアンピンします：

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*

  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) {
      val buffer = ByteArray(1024)
      buffer.usePinned { pinned ->
          while (true) {
              val length = recv(fd, pinned.addressOf(0), buffer.size.convert(), 0).toInt()
              if (length <= 0) {
                  break
              }
              // これで `buffer` には `recv()` 呼び出しから取得された生データが入っています。
          }
      }
  }
  ```

  ここで、`pinned` は特別な型 `Pinned<T>` のオブジェクトです。これには、ピン留めされた配列本体のアドレスを取得できる [`.addressOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/address-of.html) などの便利な拡張機能が用意されています。

* [`.refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 拡張関数を使用します。これは内部的に同様の機能を持ちますが、特定のケースでボイラープレートコードを減らすのに役立ちます：

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*
    
  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) { 
      val buffer = ByteArray(1024)
      while (true) {
          val length = recv(fd, buffer.refTo(0), buffer.size.convert(), 0).toInt()

          if (length <= 0) {
              break
          }
          // これで `buffer` には `recv()` 呼び出しから取得された生データが入っています。
      }
  }
  ```

  ここで、`buffer.refTo(0)` は `CValuesRef` 型を持ち、`recv()` 関数に入る前に配列をピン留めし、その0番目の要素のアドレスを関数に渡し、関数を抜けた後に配列をアンピンします。

### 前方宣言 (Forward declarations)

前方宣言をインポートするには、`cnames` パッケージを使用します。たとえば、`library.package` を持つCライブラリで宣言された `cstructName` 前方宣言をインポートするには、特別な前方宣言パッケージ `import cnames.structs.cstructName` を使用します。

2つのcinteropライブラリを考えてみましょう。1つは構造体の前方宣言を持ち、もう1つは別のパッケージに実際の定義（実装）を持っています：

```C
// 第1のCライブラリ
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```C
// 第2のCライブラリ
// ヘッダー:
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// 実装:
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

2つのライブラリ間でオブジェクトを転送するには、Kotlinコードで明示的な `as` キャストを使用します：

```kotlin
// Kotlin コード:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 次のステップ

以下のチュートリアルを完了して、KotlinとCの間で型、関数、および文字列がどのようにマッピングされるかを学びましょう：

* [Cからのプリミティブデータ型のマッピング](mapping-primitive-data-types-from-c.md)
* [Cからの構造体および共用体型のマッピング](mapping-struct-union-types-from-c.md)
* [Cからの関数ポインタのマッピング](mapping-function-pointers-from-c.md)
* [Cからの文字列のマッピング](mapping-strings-from-c.md)