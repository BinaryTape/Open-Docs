---
title: "C との相互運用性"
---
:::note
Cライブラリのインポートは[試験的](components-stability#stability-levels-explained)です。
cinteropツールによってCライブラリから生成されたすべてのKotlin宣言は、`@ExperimentalForeignApi` アノテーションを持つ必要があります。

Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。

このドキュメントでは、KotlinとCの相互運用性に関する一般的な側面を説明します。Kotlin/Nativeにはcinteropツールが付属しており、
これを使用すると、外部Cライブラリとやり取りするために必要なものをすべてすばやく生成できます。

このツールはCヘッダーを分析し、Cの型、関数、定数をKotlinへの簡単なマッピングとして生成します。
生成されたスタブは、IDEにインポートして、コード補完とナビゲーションを有効にできます。

KotlinはObjective-Cとの相互運用性も提供します。Objective-Cライブラリもcinteropツールを介してインポートされます。
詳細については、[Swift/Objective-C interop](native-objc-interop)を参照してください。

## プロジェクトのセットアップ

Cライブラリを使用する必要があるプロジェクトを扱う場合の一般的なワークフローを以下に示します。

1. [定義ファイル](native-definition-file)を作成して構成します。これは、cinteropツールがKotlinの[バインディング](#bindings)に含める必要があるものを記述します。
2. Gradleビルドファイルを構成して、ビルドプロセスにcinteropを含めます。
3. プロジェクトをコンパイルして実行し、最終的な実行可能ファイルを生成します。

実践的な経験を得るには、[C interopを使用したアプリの作成](native-app-with-c-and-libcurl)チュートリアルを完了してください。

:::

多くの場合、Cライブラリとのカスタム相互運用性を構成する必要はありません。代わりに、[プラットフォームライブラリ](native-platform-libs)と呼ばれるプラットフォーム標準のバインディングで利用可能なAPIを使用できます。たとえば、
Linux/macOSプラットフォームのPOSIX、WindowsプラットフォームのWin32、macOS/iOSのAppleフレームワークなどがこの方法で利用できます。

## バインディング

### 基本的なInterop型

サポートされているすべてのC型には、Kotlinに対応する表現があります。

* 符号付き、符号なしの整数型、および浮動小数点型は、同じ幅のKotlinの対応するものにマッピングされます。
* ポインタと配列は、`CPointer<T>?`にマッピングされます。
* 列挙型は、ヒューリスティクスと[定義ファイルの設定](native-definition-file#configure-enums-generation)に応じて、Kotlinの列挙型または整数値のいずれかにマッピングできます。
* 構造体と共用体は、ドット表記でフィールドを使用できる型にマッピングされます。つまり、`someStructInstance.field1`です。
* `typedef`は`typealias`として表されます。

また、Cの型には、この型のlvalueを表すKotlinの型があります。つまり、単純な不変の自己完結型の値ではなく、メモリに配置された値です。同様の概念としてC++の参照を考えてください。構造体（および構造体への`typedef`）の場合、この表現がメインのものであり、構造体自体と同じ名前を持ちます。Kotlinの列挙型の場合、`${type}.Var`という名前が付けられています。`CPointer<T>`の場合、`CPointerVar<T>`です。そして、他のほとんどの型の場合、`${type}Var`です。

両方の表現を持つ型の場合、lvalueを持つ型には、値にアクセスするための可変の`.value`プロパティがあります。

#### ポインタ型

`CPointer<T>`の型引数`T`は、上記のlvalue型のいずれかである必要があります。たとえば、Cの型`struct S*`は`CPointer<S>`に、`int8_t*`は`CPointer<int_8tVar>`に、`char**`は`CPointer<CPointerVar<ByteVar>>`にマッピングされます。

CのヌルポインタはKotlinの`null`として表され、ポインタ型`CPointer<T>`はnullableではありませんが、
`CPointer<T>?`はnullableです。この型の値は、`null`の処理に関連するすべてのKotlin操作をサポートしています。たとえば、
`?:`、`?.`、`!!`などです。

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

配列も`CPointer<T>`にマッピングされるため、インデックスで値にアクセスするための`[]`演算子をサポートしています。

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>`の`.pointed`プロパティは、このポインタが指す型`T`のlvalueを返します。逆の操作は`.ptr`です。これはlvalueを取り、それへのポインタを返します。

`void*`は`COpaquePointer`にマッピングされます。これは、他のすべてのポインタ型のスーパータイプである特別なポインタ型です。
したがって、C関数が`void*`を取る場合、Kotlinバインディングは任意の`CPointer`を受け入れます。

ポインタ（`COpaquePointer`を含む）のキャストは、`.reinterpret<T>`で行うことができます。例：

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

Cと同様に、これらの`.reinterpret`キャストは安全ではなく、アプリケーションで微妙なメモリの問題を引き起こす可能性があります。

また、`.toLong()`および`.toCPointer<T>()`拡張メソッドによって提供される、`CPointer<T>?`と`Long`間の安全でないキャストもあります。

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

:::tip
コンテキストから結果の型がわかっている場合は、型推論のおかげで型引数を省略できます。

:::

### メモリ割り当て

ネイティブメモリは、`NativePlacement`インターフェイスを使用して割り当てることができます。例：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val byteVar = placement.alloc<ByteVar>()
```

または：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val bytePtr = placement.allocArray<ByteVar>(5)
```

最も論理的な配置は、オブジェクト`nativeHeap`にあります。これは、`malloc`を使用してネイティブメモリを割り当てることに対応し、割り当てられたメモリを解放するための追加の`.free()`操作を提供します。

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap`は、メモリを手動で解放する必要があります。ただし、レキシカルスコープにバインドされたライフタイムでメモリを割り当てるのが便利な場合があります。このようなメモリが自動的に解放される場合に役立ちます。

これに対処するには、`memScoped { }`を使用できます。中括弧の内側では、一時的な配置が暗黙的なレシーバーとして使用できるため、allocおよびallocArrayを使用してネイティブメモリを割り当てることができ、割り当てられたメモリはスコープを離れた後に自動的に解放されます。

たとえば、ポインタパラメータを介して値を返すC関数は、次のように使用できます。

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### バインディングへのポインタの渡し方

Cポインタは`CPointer<T> type`にマッピングされますが、C関数ポインタ型のパラメータは`CValuesRef<T>`にマッピングされます。`CPointer<T>`をそのようなパラメータの値として渡すと、C関数にそのまま渡されます。
ただし、ポインタの代わりに値のシーケンスを渡すことができます。この場合、シーケンスは「値渡し」されます。つまり、C関数は、そのシーケンスの一時的なコピーへのポインタを受け取ります。これは、関数が戻るまでのみ有効です。

ポインタパラメータの`CValuesRef<T>`表現は、明示的なネイティブメモリ割り当てなしでC配列リテラルをサポートするように設計されています。C値の不変の自己完結型シーケンスを構築するために、次のメソッドが提供されています。

* `${type}Array.toCValues()`、ここで`type`はKotlinのプリミティブ型です
* `Array<CPointer<T>?>.toCValues()`、`List<CPointer<T>?>.toCValues()`
* `cValuesOf(vararg elements: ${type})`、ここで`type`はプリミティブまたはポインタです

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

他のポインタとは異なり、`const char*`型のパラメータはKotlinの`String`として表されます。したがって、C文字列を予期するバインディングに任意のKotlin文字列を渡すことができます。

KotlinとC文字列を手動で変換するために使用できるツールもいくつかあります。

* `fun CPointer<ByteVar>.toKString(): String`
* `val String.cstr: CValuesRef<ByteVar>`.

ポインタを取得するには、`.cstr`をネイティブメモリに割り当てる必要があります。例：

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

いずれの場合も、C文字列はUTF-8としてエンコードされていると想定されます。

自動変換をスキップして、バインディングでrawポインタが使用されるようにするには、`.def`ファイルに[`noStringConversion`プロパティ](native-definition-file#set-up-string-conversion)を追加します。

```c
noStringConversion = LoadCursorA LoadCursorW
```

これにより、`CPointer<ByteVar>`型の任意の値は、`const char*`型の引数として渡すことができます。Kotlin文字列を渡す必要がある場合は、次のようなコードを使用できます。

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### スコープローカルポインタ

`memScoped {}`で利用可能な`CValues<T>.ptr`拡張プロパティを使用して、`CValues<T>`インスタンスのC表現のスコープ安定ポインタを作成できます。これにより、特定の`MemScope`にバインドされたライフタイムを持つCポインタを必要とするAPIを使用できます。例：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value `->` items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    // ...
}
```

この例では、C API `new_menu()`に渡されるすべての値は、それが属する最も内側の`memScope`のライフタイムを持ちます。コントロールフローが`memScoped`スコープを離れると、Cポインタは無効になります。

### 値による構造体の受け渡し

C関数が構造体/共用体`T`を値で受け取るか返す場合、対応する引数の型または戻り値の型は`CValue<T>`として表されます。

`CValue<T>`は不透明な型であるため、構造体フィールドは適切なKotlinプロパティでアクセスできません。APIが構造体を不透明なハンドルとして使用する場合、これは問題ありません。ただし、フィールドアクセスが必要な場合は、次の変換メソッドを使用できます。

* [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
  (lvalue) `T`を`CValue<T>`に変換します。したがって、`CValue<T>`を構築するには、
  `T`を割り当てて入力し、`CValue<T>`に変換できます。
* [`CValue<T>.useContents(block: T.() `->` R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
  一時的に`CValue<T>`をメモリに格納し、次に渡されたラムダをこの配置された値`T`をレシーバーとして実行します。
  したがって、単一のフィールドを読み取るには、次のコードを使用できます。

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```
  
* [`fun cValue(initialize: T.() `->` Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
  提供された`initialize`関数を適用してメモリに`T`を割り当て、結果を`CValue<T>`に変換します。
* [`fun CValue<T>.copy(modify: T.() `->` Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
  既存の`CValue<T>`の変更されたコピーを作成します。元の値はメモリに配置され、`modify()`を使用して変更されます
  関数で、新しい`CValue<T>`に変換されます。
* [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
  `CValues<T>`を`AutofreeScope`に配置し、割り当てられたメモリへのポインタを返します。割り当てられたメモリは、
  `AutofreeScope`が破棄されると自動的に解放されます。

### コールバック

Kotlin関数をC関数へのポインタに変換するには、`staticCFunction(::kotlinFunction)`を使用できます。関数の参照の代わりにラムダを提供することもできます。関数またはラムダは、値をキャプチャしないでください。

#### コールバックへのユーザーデータの渡し方

多くの場合、C APIでは、一部のユーザーデータをコールバックに渡すことができます。このようなデータは通常、コールバックを構成するときにユーザーによって提供されます。たとえば、`void*`として一部のC関数に渡される（または構造体に書き込まれる）などです。ただし、Kotlinオブジェクトへの参照をCに直接渡すことはできません。したがって、コールバックを構成する前にラップし、コールバック自体でアンラップして、Cの世界を介してKotlinからKotlinへ安全に移動する必要があります。このようなラッピングは、`StableRef`クラスで可能です。

参照をラップするには：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

ここで、`voidPtr`は`COpaquePointer`であり、C関数に渡すことができます。

参照をアンラップするには：

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

ここで、`kotlinReference`は元のラップされた参照です。

作成された`StableRef`は、メモリリークを防ぐために、最終的に`.dispose()`メソッドを使用して手動で破棄する必要があります。

```kotlin
stableRef.dispose()
```

その後、無効になるため、`voidPtr`をアンラップできなくなります。

### マクロ

定数に展開されるすべてのCマクロは、Kotlinプロパティとして表されます。

コンパイラが型を推論できる場合、パラメータなしのマクロがサポートされます。

```c
int foo(int);
#define FOO foo(42)
```

この場合、Kotlinで`FOO`を使用できます。

他のマクロをサポートするには、サポートされている宣言でラップして手動で公開できます。たとえば、
関数のようなマクロ`FOO`は、
[カスタム宣言を追加](native-definition-file#add-custom-declarations)して、関数`foo()`として公開できます。

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 移植性

Cライブラリには、プラットフォームに依存する型の関数パラメータまたは構造体フィールドがある場合があります。たとえば、`long`または`size_t`などです。Kotlin自体は、暗黙的な整数のキャストもCスタイルの整数のキャスト（たとえば、
`(size_t) intValue`）も提供しないため、このような場合に移植可能なコードを簡単に記述できるように、`convert`メソッドが提供されています。

```kotlin
fun $.convert<$>(): $
```

ここで、`type1`と`type2`はそれぞれ、符号付きまたは符号なしの整数型である必要があります。

`.convert<${type}>`は、`type`に応じて、`.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、
`.toUShort`、`.toUInt`または`.toULong`メソッドのいずれかと同じセマンティクスを持ちます。

`convert`の使用例：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

また、型パラメータは自動的に推論できるため、場合によっては省略できます。

### オブジェクトの固定

Kotlinオブジェクトは固定できます。つまり、メモリ内の位置は固定解除されるまで安定していることが保証され、そのようなオブジェクトの内部データへのポインタをC関数に渡すことができます。

使用できるアプローチがいくつかあります。

* [`usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)サービス関数を使用します。
  オブジェクトを固定し、ブロックを実行し、通常および例外パスで固定を解除します。

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*

  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) {
      val buffer = ByteArray(1024)
      buffer.usePinned { pinned `->`
          while (true) {
              val length = recv(fd, pinned.addressOf(0), buffer.size.convert(), 0).toInt()
              if (length <= 0) {
                  break
              }
              // Now `buffer` has raw data obtained from the `recv()` call.
          }
      }
  }
  ```

  ここで、`pinned`は特別な型`Pinned<T>`のオブジェクトです。これは、固定された配列本体のアドレスを取得できる`addressOf`などの便利な拡張機能を提供します。

* 内部的に同様の機能を持つ[`refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html)関数を使用します。
  特定のケースでは、ボイラープレートコードを減らすのに役立つ場合があります。

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
          // Now `buffer` has raw data obtained from the `recv()` call.
      }
  }
  ```

  ここで、`buffer.refTo(0)`は`CValuesRef`型を持ち、`recv()`関数に入る前に配列を固定し、
  そのゼロ番目の要素のアドレスを関数に渡し、終了後に配列の固定を解除します。

### 事前宣言

事前宣言をインポートするには、`cnames`パッケージを使用します。たとえば、`library.package`を持つCライブラリで宣言された`cstructName`事前宣言をインポートするには、特別な事前宣言パッケージを使用します。
`import cnames.structs.cstructName`。

構造体の事前宣言を持つcinteropライブラリと、別のパッケージに実際の実装を持つcinteropライブラリの2つを考えてみましょう。

```C
// First C library
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```C
// Second C library
// Header:
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// Implementation:
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

2つのライブラリ間でオブジェクトを転送するには、Kotlinコードで明示的な`as`キャストを使用します。

```kotlin
// Kotlin code:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 次のステップ

次のチュートリアルを完了して、KotlinとCの間で型、関数、および定数がどのようにマッピングされるかを学びます。

* [Cからのプリミティブデータ型のマッピング](mapping-primitive-data-types-from-c)
* [Cからの構造体および共用体型のマッピング](mapping-function-pointers-from-c)
* [Cからの関数ポインタのマッピング](mapping-function-pointers-from-c)
* [Cからの文字列のマッピング](mapping-strings-from-c)
  ```