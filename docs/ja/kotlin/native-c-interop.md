[//]: # (title: Cとの相互運用)

> Cライブラリのインポートは[実験的機能](components-stability.md#stability-levels-explained)です。
> cinteropツールによってCライブラリから生成されるすべてのKotlin宣言には、
> `@ExperimentalForeignApi` アノテーションが付与されます。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、
> 一部のAPIでのみオプトインが必要です。
>
{style="warning"}

このドキュメントでは、KotlinとCの相互運用の一般的な側面について説明します。Kotlin/Nativeにはcinteropツールが付属しており、これを使用すると、外部のCライブラリと連携するために必要なすべてを迅速に生成できます。

このツールはCヘッダーを解析し、Cの型、関数、定数をKotlinに直接マッピングします。生成されたスタブはIDEにインポートでき、コード補完とナビゲーションが可能になります。

> KotlinはObjective-Cとの相互運用も提供します。Objective-Cライブラリもcinteropツールを介してインポートされます。
> 詳細については、[Swift/Objective-Cの相互運用](native-objc-interop.md)を参照してください。
>
{style="tip"}

## プロジェクトのセットアップ

Cライブラリを使用する必要があるプロジェクトで作業する場合の一般的なワークフローは次のとおりです。

1.  [定義ファイル](native-definition-file.md)を作成し、構成します。これはcinteropツールがKotlinの[バインディング](#bindings)に何を含めるべきかを記述します。
2.  Gradleビルドファイルを設定して、ビルドプロセスにcinteropを含めます。
3.  プロジェクトをコンパイルして実行し、最終的な実行可能ファイルを生成します。

> 実践的な経験を積むには、[C interopを使用したアプリの作成](native-app-with-c-and-libcurl.md)チュートリアルを完了してください。
>
{style="note"}

多くの場合、Cライブラリとのカスタム相互運用を構成する必要はありません。代わりに、[プラットフォームライブラリ](native-platform-libs.md)と呼ばれるプラットフォーム標準化されたバインディングで利用可能なAPIを使用できます。たとえば、Linux/macOSプラットフォームのPOSIX、WindowsプラットフォームのWin32、またはmacOS/iOSのAppleフレームワークは、この方法で利用可能です。

## バインディング

### 基本的な相互運用型

サポートされているすべてのC型には、Kotlinに対応する表現があります。

*   符号付き整数型、符号なし整数型、および浮動小数点型は、同じ幅のKotlinの対応型にマッピングされます。
*   ポインタと配列は`CPointer<T>?`にマッピングされます。
*   Enumは、ヒューリスティックおよび[定義ファイルの設定](native-definition-file.md#configure-enums-generation)に応じて、Kotlinのenumまたは整数値のいずれかにマッピングできます。
*   構造体と共用体は、ドット表記（例: `someStructInstance.field1`）でフィールドにアクセスできる型にマッピングされます。
*   `typedef`は`typealias`として表現されます。

また、すべてのC型には、その型のlvalueを表すKotlin型があります。これは、単純な変更不能な自己完結型の値ではなく、メモリに存在する値を意味します。C++のリファレンスを類似の概念と考えてください。構造体（および構造体への`typedef`）の場合、この表現が主要なものであり、構造体自体と同じ名前を持ちます。Kotlinのenumの場合、`${type}.Var`という名前になり、`CPointer<T>`の場合、`CPointerVar<T>`となり、その他のほとんどの型の場合、`${type}Var`となります。

両方の表現を持つ型の場合、lvalueを持つ表現は、値にアクセスするためのミュータブルな`.value`プロパティを持ちます。

#### ポインタ型

`CPointer<T>`の型引数`T`は、上記のlvalue型のいずれかである必要があります。たとえば、C型`struct S*`は`CPointer<S>`に、`int8_t*`は`CPointer<int_8tVar>`に、`char**`は`CPointer<CPointerVar<ByteVar>>`にマッピングされます。

CのnullポインタはKotlinの`null`として表現され、ポインタ型`CPointer<T>`はnull許容ではありませんが、`CPointer<T>?`はnull許容です。この型の値は、`?:`、`?.`、`!!`など、`null`の処理に関連するすべてのKotlin演算をサポートします。

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

配列も`CPointer<T>`にマッピングされるため、インデックスによる値へのアクセスに`[]`演算子をサポートします。

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>`の`.pointed`プロパティは、このポインタによって指される`T`型のlvalueを返します。逆の操作は`.ptr`で、lvalueを受け取り、それへのポインタを返します。

`void*`は`COpaquePointer`にマッピングされます。これは、他のポインタ型のスーパタイプである特別なポインタ型です。したがって、C関数が`void*`を取る場合、Kotlinバインディングは任意の`CPointer`を受け入れます。

ポインタ（`COpaquePointer`を含む）のキャストは、`.reinterpret<T>`で行うことができます。例:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr = bytePtr.reinterpret<IntVar>()
```

または:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr: CPointer<IntVar> = bytePtr.reinterpret()
```

Cと同様に、これらの`.reinterpret`キャストは安全ではなく、アプリケーションで微妙なメモリ問題を引き起こす可能性があります。

また、`CPointer<T>?`と`Long`の間で利用可能な安全でないキャストがあり、`.toLong()`と`.toCPointer<T>()`拡張メソッドによって提供されます。

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 結果の型がコンテキストから既知の場合、型推論のおかげで型引数を省略できます。
>
{style="tip"}

### メモリ割り当て

ネイティブメモリは、`NativePlacement`インターフェースを使用して割り当てることができます。例:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val byteVar = placement.alloc<ByteVar>()
```

または:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val bytePtr = placement.allocArray<ByteVar>(5)
```

最も論理的なプレースメントは`nativeHeap`オブジェクト内です。これは`malloc`によるネイティブメモリの割り当てに対応し、割り当てられたメモリを解放するための追加の`.free()`操作を提供します。

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap`はメモリを手動で解放する必要があります。ただし、字句スコープに寿命が紐付けられたメモリを割り当てることは、しばしば有用です。このようなメモリが自動的に解放されると便利です。

これに対処するため、`memScoped { }`を使用できます。波括弧内では、一時的なプレースメントが暗黙のレシーバーとして利用できるため、`alloc`および`allocArray`でネイティブメモリを割り当てることができ、割り当てられたメモリはスコープを離れた後に自動的に解放されます。

たとえば、ポインタパラメータを介して値を返すC関数は次のように使用できます。

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

### バインディングへのポインタの引き渡し

Cポインタは`CPointer<T> type`にマッピングされますが、C関数のポインタ型パラメータは`CValuesRef<T>`にマッピングされます。`CPointer<T>`をこのようなパラメータの値として渡す場合、そのままC関数に渡されます。ただし、ポインタの代わりに値のシーケンスを渡すこともできます。この場合、シーケンスは「値渡し」され、つまり、C関数はシーケンスの一時的なコピーへのポインタを受け取ります。これは関数が戻るまでのみ有効です。

ポインタパラメータの`CValuesRef<T>`表現は、明示的なネイティブメモリ割り当てなしにC配列リテラルをサポートするように設計されています。C値の変更不能な自己完結型シーケンスを構築するために、次のメソッドが提供されています。

*   `${type}Array.toCValues()`（`type`はKotlinのプリミティブ型）
*   `Array<CPointer<T>?>.toCValues()`、`List<CPointer<T>?>.toCValues()`
*   `cValuesOf(vararg elements: ${type})`（`type`はプリミティブまたはポインタ）

例:

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

他のポインタとは異なり、`const char*`型のパラメータはKotlinの`String`として表現されます。そのため、任意のKotlin文字列をC文字列を期待するバインディングに渡すことができます。

Kotlin文字列とC文字列の間を手動で変換するためのツールもいくつか利用できます。

*   `fun CPointer<ByteVar>.toKString(): String`
*   `val String.cstr: CValuesRef<ByteVar>`。

ポインタを取得するには、`.cstr`をネイティブメモリに割り当てる必要があります。例:

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

すべての場合において、C文字列はUTF-8でエンコードされていると想定されています。

自動変換をスキップし、バインディングで生ポインタが使用されるようにするには、[`noStringConversion`プロパティ](native-definition-file.md#set-up-string-conversion)を`.def`ファイルに追加します。

```c
noStringConversion = LoadCursorA LoadCursorW
```

これにより、`CPointer<ByteVar>`型の任意の値が`const char*`型の引数として渡すことができます。Kotlin文字列を渡す必要がある場合、次のようなコードを使用できます。

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### スコープローカルポインタ

`memScoped {}`内で利用可能な`CValues<T>.ptr`拡張プロパティを使用して、`CValues<T>`インスタンスのC表現のスコープ安定ポインタを作成することができます。これにより、特定の`MemScope`に寿命が紐付けられたCポインタを必要とするAPIを使用できます。例:

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

この例では、C API `new_menu()`に渡されるすべての値は、それが属する最も内側の`memScope`の寿命を持ちます。制御フローが`memScoped`スコープを離れると、Cポインタは無効になります。

### 構造体を値として渡す・受け取る

C関数が構造体/共用体`T`を値として受け取ったり返したりする場合、対応する引数型または戻り値型は`CValue<T>`として表現されます。

`CValue<T>`は不透明な型であるため、構造体フィールドには適切なKotlinプロパティでアクセスできません。APIが構造体を不透明なハンドルとして使用している場合はこれで問題ありません。ただし、フィールドアクセスが必要な場合は、次の変換メソッドが利用可能です。

*   [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)は（lvalueの）`T`を`CValue<T>`に変換します。したがって、`CValue<T>`を構築するには、`T`を割り当てて、値を設定し、`CValue<T>`に変換することができます。
*   [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)は、`CValue<T>`を一時的にメモリに格納し、その配置された値`T`をレシーバーとして渡されたラムダを実行します。したがって、単一のフィールドを読み取るには、次のコードを使用できます。

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```

*   [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)は、指定された`initialize`関数を適用してメモリに`T`を割り当て、その結果を`CValue<T>`に変換します。
*   [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)は、既存の`CValue<T>`の変更されたコピーを作成します。元の値はメモリに配置され、`modify()`関数を使用して変更され、新しい`CValue<T>`に変換し直されます。
*   [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)は、`CValues<T>`を`AutofreeScope`に配置し、割り当てられたメモリへのポインタを返します。割り当てられたメモリは、`AutofreeScope`が破棄されるときに自動的に解放されます。

### コールバック

Kotlin関数をC関数へのポインタに変換するには、`staticCFunction(::kotlinFunction)`を使用します。関数参照の代わりにラムダを指定することも可能です。関数またはラムダは値をキャプチャしてはいけません。

#### ユーザーデータをコールバックに渡す

しばしばC APIは、コールバックに何らかのユーザーデータを渡すことを許可します。そのようなデータは通常、コールバックを構成する際にユーザーによって提供されます。それは`void*`としてC関数に渡されたり（または構造体に書き込まれたり）します。しかし、Kotlinオブジェクトへの参照をCに直接渡すことはできません。そのため、コールバックを構成する前にラップし、Cの世界を安全にKotlinからKotlinへ移動できるように、コールバック自体でアンラップする必要があります。このようなラッピングは`StableRef`クラスで可能です。

参照をラップするには:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

ここで、`voidPtr`は`COpaquePointer`であり、C関数に渡すことができます。

参照をアンラップするには:

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

ここで、`kotlinReference`は元のラップされた参照です。

作成された`StableRef`は、メモリリークを防ぐため、最終的に`.dispose()`メソッドを使用して手動で破棄する必要があります。

```kotlin
stableRef.dispose()
```

その後、無効になり、`voidPtr`をアンラップできなくなります。

### マクロ

定数に展開されるすべてのCマクロは、Kotlinプロパティとして表現されます。

パラメータのないマクロは、コンパイラが型を推論できる場合にサポートされます。

```c
int foo(int);
#define FOO foo(42)
```

この場合、`FOO`はKotlinで利用できます。

他のマクロをサポートするには、サポートされている宣言でラップして手動で公開できます。たとえば、関数のようなマクロ`FOO`は、ライブラリに[カスタム宣言](native-definition-file.md#add-custom-declarations)を追加することで、関数`foo()`として公開できます。

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### ポータビリティ

Cライブラリには、`long`や`size_t`など、プラットフォーム依存の型の関数パラメータや構造体フィールドを持つ場合があります。Kotlin自体は暗黙の整数キャストやCスタイルの整数キャスト（例: `(size_t) intValue`）を提供しないため、そのような場合にポータブルなコードを書きやすくするために、`convert`メソッドが提供されています。

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

ここで、`type1`と`type2`のそれぞれは、符号付きまたは符号なしのいずれかの整数型である必要があります。

`.convert<${type}>`は、`type`に応じて、`.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、`.toUShort`、`.toUInt`、または`.toULong`メソッドのいずれかと同じセマンティクスを持ちます。

`convert`の使用例:

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

また、型パラメータは自動的に推論されるため、場合によっては省略できます。

### オブジェクトのピン止め

Kotlinオブジェクトはピン止めできます。つまり、メモリ内の位置がアンピンされるまで安定していることが保証され、そのようなオブジェクトの内部データへのポインタをC関数に渡すことができます。

いくつかのアプローチがあります。

*   [`usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)サービス関数を使用します。これはオブジェクトをピン止めし、ブロックを実行し、通常パスと例外パスでピン止めを解除します。

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
              // Now `buffer` has raw data obtained from the `recv()` call.
          }
      }
  }
  ```

  ここで、`pinned`は特殊な型`Pinned<T>`のオブジェクトです。これは、ピン止めされた配列本体のアドレスを取得できる`addressOf`のような便利な拡張機能を提供します。

*   `refTo()`は、内部的に同様の機能を持っていますが、特定のケースでは、ボイラープレートコードを減らすのに役立つ場合があります。

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

  ここで、`buffer.refTo(0)`は`CValuesRef`型であり、`recv()`関数に入る前に配列をピン止めし、そのゼロ番目の要素のアドレスを関数に渡し、終了後に配列のピン止めを解除します。

### 順方向宣言

順方向宣言をインポートするには、`cnames`パッケージを使用します。たとえば、`library.package`を持つCライブラリで宣言された`cstructName`順方向宣言をインポートするには、特別な順方向宣言パッケージ`import cnames.structs.cstructName`を使用します。

構造体の順方向宣言を持つライブラリと、別のパッケージに実際の実装を持つライブラリの2つのcinteropライブラリを考えてみましょう。

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

次のチュートリアルを完了して、KotlinとCの間で型、関数、定数がどのようにマッピングされるかを学びましょう。

*   [Cからのプリミティブデータ型のマッピング](mapping-primitive-data-types-from-c.md)
*   [Cからの構造体と共用体型のマッピング](mapping-function-pointers-from-c.md)
*   [Cからの関数ポインタのマッピング](mapping-function-pointers-from-c.md)
*   [Cからの文字列のマッピング](mapping-strings-from-c.md)