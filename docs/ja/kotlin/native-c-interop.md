[//]: # (title: C言語との相互運用)

> Cライブラリのインポートは[ベータ版](native-c-interop-stability.md)です。cinteropツールによってCライブラリから生成されるすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションを付ける必要があります。
>
> Kotlin/Nativeに付属のネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="note"}

このドキュメントでは、KotlinとC言語の相互運用の一般的な側面を扱います。Kotlin/Nativeにはcinteropツールが付属しており、これを使用すると外部のCライブラリと対話するために必要なすべてを迅速に生成できます。

このツールはCヘッダーを解析し、Cの型、関数、文字列をKotlinに直接マッピングしたものを生成します。生成されたスタブはIDEにインポートでき、コード補完やナビゲーションを有効にできます。

> KotlinはObjective-Cとの相互運用も提供します。Objective-Cライブラリもcinteropツールを介してインポートされます。詳細については、[Swift/Objective-Cの相互運用](native-objc-interop.md)を参照してください。
>
{style="tip"}

## プロジェクトの設定

Cライブラリを使用する必要があるプロジェクトでの一般的なワークフローは次のとおりです。

1.  [定義ファイル](native-definition-file.md)を作成し、構成します。これは、cinteropツールがKotlinの[バインディング](#bindings)に何を含めるべきかを記述します。
2.  Gradleビルドファイルを構成し、cinteropをビルドプロセスに含めます。
3.  プロジェクトをコンパイルして実行し、最終的な実行可能ファイルを生成します。

> 実践的な経験のために、[C言語相互運用を使用するアプリの作成](native-app-with-c-and-libcurl.md)チュートリアルを完了してください。
>
{style="note"}

多くの場合、Cライブラリとのカスタムの相互運用を構成する必要はありません。代わりに、[プラットフォームライブラリ](native-platform-libs.md)と呼ばれるプラットフォームの標準化されたバインディングで利用可能なAPIを使用できます。たとえば、Linux/macOSプラットフォームのPOSIX、WindowsプラットフォームのWin32、macOS/iOSのAppleフレームワークなどがこの方法で利用できます。

## バインディング

### 基本的な相互運用型

サポートされているすべてのCの型は、Kotlinに対応する表現を持っています。

*   符号付き、符号なし整数、および浮動小数点型は、同じ幅のKotlinの対応する型にマッピングされます。
*   ポインタと配列は`CPointer<T>?`にマッピングされます。
*   列挙型は、ヒューリスティクスと[定義ファイルの設定](native-definition-file.md#configure-enums-generation)に応じて、Kotlinの列挙型または整数値にマッピングできます。
*   構造体と共用体は、ドット表記（例: `someStructInstance.field1`）でフィールドにアクセスできる型にマッピングされます。
*   `typedef`は`typealias`として表現されます。

また、任意のCの型は、その型の左辺値（lvalue）を表すKotlinの型を持っています。これは、単純な不変の自己完結型値ではなく、メモリに配置された値を意味します。類似の概念としてC++の参照を考えてみてください。構造体（および構造体への`typedef`）の場合、この表現が主要なものであり、構造体自体と同じ名前を持ちます。Kotlinの列挙型の場合、`${type}.Var`と名付けられます。`CPointer<T>`の場合、`CPointerVar<T>`と名付けられます。その他のほとんどの型では、`${type}Var`と名付けられます。

両方の表現を持つ型の場合、左辺値を持つ方は、値にアクセスするための可変な`.value`プロパティを持ちます。

#### ポインタ型

`CPointer<T>`の型引数`T`は、上記で説明した左辺値型（lvalue types）のいずれかである必要があります。たとえば、Cの型`struct S*`は`CPointer<S>`にマッピングされ、`int8_t*`は`CPointer<int_8tVar>`にマッピングされ、`char**`は`CPointer<CPointerVar<ByteVar>>`にマッピングされます。

CのヌルポインタはKotlinの`null`として表現され、ポインタ型`CPointer<T>`はnull許容ではありませんが、`CPointer<T>?`はnull許容です。この型の値は、`null`の処理に関連するすべてのKotlinの操作（例: `?:`、`?.`、`!!`など）をサポートします。

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

配列も`CPointer<T>`にマッピングされるため、インデックスによる値へのアクセスに`[]`演算子をサポートしています。

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>`の`.pointed`プロパティは、このポインタが指す`T`型の左辺値（lvalue）を返します。逆の操作は`.ptr`で、これは左辺値を取り、それへのポインタを返します。

`void*`は`COpaquePointer`にマッピングされます。これは、他のすべてのポインタ型のスーパータイプである特別なポインタ型です。したがって、C関数が`void*`を受け取る場合、Kotlinのバインディングは任意の`CPointer`を受け入れます。

ポインタ（`COpaquePointer`を含む）のキャストは、たとえば`.reinterpret<T>`を使用して行うことができます。

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

また、`.toLong()`および`.toCPointer<T>()`拡張メソッドによって提供される、`CPointer<T>?`と`Long`間の安全でないキャストも利用できます。

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 結果の型がコンテキストからわかる場合、型推論のおかげで型引数を省略できます。
>
{style="tip"}

### メモリ割り当て

ネイティブメモリは、たとえば`NativePlacement`インターフェースを使用して割り当てることができます。

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

最も論理的な配置は、オブジェクト`nativeHeap`内です。これは`malloc`によるネイティブメモリの割り当てに対応し、割り当てられたメモリを解放するための追加の`.free()`操作を提供します。

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap`はメモリを手動で解放する必要があります。しかし、字句スコープに寿命が縛られたメモリを割り当てることはしばしば有用です。このようなメモリが自動的に解放されると便利です。

これに対処するため、`memScoped { }`を使用できます。波括弧の内側では、一時的なプレースメントが暗黙のレシーバーとして利用可能であるため、`alloc`および`allocArray`でネイティブメモリを割り当てることができ、割り当てられたメモリはスコープを離れた後に自動的に解放されます。

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

### バインディングにポインタを渡す

Cポインタは`CPointer<T>`型にマッピングされますが、C関数のポインタ型パラメータは`CValuesRef<T>`にマッピングされます。そのようなパラメータの値として`CPointer<T>`を渡す場合、それはそのままC関数に渡されます。ただし、ポインタの代わりに値のシーケンスを渡すこともできます。この場合、シーケンスは「値渡し」され、C関数はそのシーケンスの一時的なコピーへのポインタを受け取りますが、これは関数が戻るまでのみ有効です。

ポインタパラメータの`CValuesRef<T>`表現は、明示的なネイティブメモリ割り当てなしでC配列リテラルをサポートするように設計されています。C値の不変の自己完結型シーケンスを構築するために、以下のメソッドが提供されています。

*   `${type}Array.toCValues()`、ここで`type`はKotlinのプリミティブ型です。
*   `Array<CPointer<T>?>.toCValues()`、`List<CPointer<T>?>.toCValues()`
*   `cValuesOf(vararg elements: ${type})`、ここで`type`はプリミティブまたはポインタです。

たとえば：

```c
// C言語:
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

他のポインタとは異なり、`const char*`型のパラメータはKotlinの`String`として表現されます。したがって、C文字列を期待するバインディングに任意のKotlin文字列を渡すことができます。

KotlinとC文字列の間で手動で変換するためのツールもいくつか利用できます。

*   `fun CPointer<ByteVar>.toKString(): String`
*   `val String.cstr: CValuesRef<ByteVar>`.

ポインタを取得するには、`.cstr`をネイティブメモリに割り当てる必要があります。たとえば、以下のようになります。

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

すべてのケースにおいて、C文字列はUTF-8でエンコードされているものとみなされます。

自動変換をスキップし、バインディングで生ポインタが使用されるようにするには、`.def`ファイルに[`noStringConversion`プロパティ](native-definition-file.md#set-up-string-conversion)を追加します。

```c
noStringConversion = LoadCursorA LoadCursorW
```

このようにして、`CPointer<ByteVar>`型の任意の値が`const char*`型の引数として渡すことができます。Kotlin文字列を渡す必要がある場合、次のようなコードを使用できます。

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### スコープローカルポインタ

`memScoped {}`内で利用可能な`CValues<T>.ptr`拡張プロパティを使用して、`CValues<T>`インスタンスのC表現のスコープ安定ポインタを作成することが可能です。これにより、特定の`MemScope`に寿命が縛られたCポインタを必要とするAPIを使用できます。たとえば、次のようになります。

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

### 構造体を値渡し/値受けする

C関数が構造体/共用体`T`を値渡しまたは値受けする場合、対応する引数型または戻り型は`CValue<T>`として表現されます。

`CValue<T>`は不透明な型であるため、適切なKotlinプロパティで構造体のフィールドにアクセスすることはできません。APIが構造体を不透明なハンドルとして使用している場合は問題ありません。しかし、フィールドへのアクセスが必要な場合は、以下の変換メソッドが利用可能です。

*   [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)は（左辺値）`T`を`CValue<T>`に変換します。したがって、`CValue<T>`を構築するには、`T`を割り当て、値を設定し、その後`CValue<T>`に変換できます。
*   [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)は、`CValue<T>`を一時的にメモリに格納し、この配置された値`T`をレシーバーとして渡されたラムダを実行します。したがって、単一のフィールドを読み取るには、以下のコードを使用できます。

    ```kotlin
    val fieldValue = structValue.useContents { field }
    ```

*   [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)は、提供された`initialize`関数を適用してメモリに`T`を割り当て、その結果を`CValue<T>`に変換します。
*   [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)は、既存の`CValue<T>`の変更されたコピーを作成します。元の値はメモリに配置され、`modify()`関数を使用して変更された後、新しい`CValue<T>`に変換し直されます。
*   [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)は、`CValues<T>`を`AutofreeScope`に配置し、割り当てられたメモリへのポインタを返します。割り当てられたメモリは、`AutofreeScope`が破棄されるときに自動的に解放されます。

### コールバック

Kotlin関数をC関数へのポインタに変換するには、`staticCFunction(::kotlinFunction)`を使用できます。関数参照の代わりにラムダを提供することも可能です。関数またはラムダは値をキャプチャしてはなりません。

#### コールバックにユーザーデータを渡す

多くの場合、C APIはユーザーデータをコールバックに渡すことを許可します。このようなデータは通常、コールバックを設定する際にユーザーによって提供されます。たとえば、`void*`として何らかのC関数に渡されたり（または構造体に書き込まれたり）します。しかし、Kotlinオブジェクトへの参照はCに直接渡すことはできません。したがって、Cの世界を介してKotlinからKotlinへ安全に渡すためには、コールバックを設定する前にラップし、コールバック自体でアンラップする必要があります。このようなラッピングは`StableRef`クラスで可能です。

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

作成された`StableRef`は、メモリリークを防ぐために、最終的には`.dispose()`メソッドを使用して手動で破棄される必要があります。

```kotlin
stableRef.dispose()
```

その後、無効になるため、`voidPtr`はもうアンラップできません。

### マクロ

定数に展開されるすべてのCマクロは、Kotlinのプロパティとして表現されます。

パラメータのないマクロは、コンパイラが型を推論できる場合にサポートされます。

```c
int foo(int);
#define FOO foo(42)
```

この場合、`FOO`はKotlinで利用可能です。

他のマクロをサポートするには、サポートされている宣言でラップすることで手動で公開できます。たとえば、関数のようなマクロ`FOO`は、ライブラリに[カスタム宣言を追加する](native-definition-file.md#add-custom-declarations)ことで関数`foo()`として公開できます。

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 可搬性

Cライブラリには、`long`や`size_t`など、プラットフォーム依存の型の関数パラメータや構造体フィールドがある場合があります。Kotlin自体は、暗黙的な整数キャストやCスタイルの整数キャスト（例: `(size_t) intValue`）を提供しないため、そのような場合に可搬性のあるコードを書きやすくするために、`convert`メソッドが提供されています。

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

ここで、`type1`と`type2`はそれぞれ、符号付きまたは符号なしの整数型である必要があります。

`.convert<${type}>`は、`type`に応じて、`.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、`.toUShort`、`.toUInt`、または`.toULong`メソッドのいずれかと同じセマンティクスを持ちます。

`convert`の使用例：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

また、型パラメータは自動的に推論できるため、場合によっては省略することができます。

### オブジェクトのピンニング

Kotlinオブジェクトはピンニングできます。つまり、それらのメモリ上の位置はアンピンされるまで安定していることが保証され、そのようなオブジェクトの内部データへのポインタをC関数に渡すことができます。

いくつかの方法があります。

*   オブジェクトをピンニングし、ブロックを実行し、通常のパスおよび例外パスでアンピンする[`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)拡張関数を使用します。

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

    ここで、`pinned`は特殊な型`Pinned<T>`のオブジェクトです。これは、ピンニングされた配列ボディのアドレスを取得できる[`.addressOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/address-of.html)のような便利な拡張機能を提供します。

*   内部的には同様の機能を持つものの、場合によってはボイラープレートコードを削減できる[`.refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html)拡張関数を使用します。

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

    ここで、`buffer.refTo(0)`は`CValuesRef`型であり、`recv()`関数に入る前に配列をピンニングし、そのゼロ番目の要素のアドレスを関数に渡し、終了後に配列をアンピンします。

### 前方宣言

前方宣言をインポートするには、`cnames`パッケージを使用します。たとえば、`library.package`を持つCライブラリで宣言された`cstructName`前方宣言をインポートするには、特別な前方宣言パッケージ`import cnames.structs.cstructName`を使用します。

2つのcinteropライブラリを考えてみましょう。1つは構造体の前方宣言を持ち、もう1つは別のパッケージに実際の実装を持つものです。

```c
// 最初のCライブラリ
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```c
// 2番目のCライブラリ
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

2つのライブラリ間でオブジェクトを転送するには、Kotlinコードで明示的な`as`キャストを使用します。

```kotlin
// Kotlinコード:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 次のステップ

以下のチュートリアルを完了して、KotlinとCの間で型、関数、文字列がどのようにマッピングされるかを学びましょう。

*   [C言語からのプリミティブデータ型のマッピング](mapping-primitive-data-types-from-c.md)
*   [C言語からの構造体および共用体型のマッピング](mapping-struct-union-types-from-c.md)
*   [C言語からの関数ポインタのマッピング](mapping-function-pointers-from-c.md)
*   [C言語からの文字列のマッピング](mapping-strings-from-c.md)