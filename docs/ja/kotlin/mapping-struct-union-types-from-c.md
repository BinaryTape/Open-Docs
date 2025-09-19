[//]: # (title: Cのstruct型とunion型をマッピングする – チュートリアル)

<tldr>
    <p>これは<strong>KotlinとCのマッピング</strong>チュートリアルシリーズの第2部です。進む前に、前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ"/> <a href="mapping-primitive-data-types-from-c.md">Cのプリミティブデータ型をマッピングする</a><br/>
       <img src="icon-2.svg" width="20" alt="2番目のステップ"/> <strong>Cのstruct型とunion型をマッピングする</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="3番目のステップ"/> <a href="mapping-function-pointers-from-c.md">関数ポインタをマッピングする</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="4番目のステップ"/> <a href="mapping-strings-from-c.md">Cの文字列をマッピングする</a><br/>
    </p>
</tldr>

> Cライブラリのインポートは[ベータ版](native-c-interop-stability.md)です。cinteropツールによってCライブラリから生成されるすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションを付加する必要があります。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="note"}

KotlinからどのようなCのstructおよびunion宣言が可視であるかを探り、Kotlin/Nativeおよび[マルチプラットフォーム](gradle-configure-project.md#targeting-multiple-platforms)Gradleビルドにおける高度なC interop関連のユースケースを調べましょう。

このチュートリアルでは、以下を学びます。

*   [struct型とunion型がどのようにマッピングされるか](#mapping-struct-and-union-c-types)
*   [Kotlinからstruct型とunion型を使用する方法](#use-struct-and-union-types-from-kotlin)

## Cのstruct型とunion型のマッピング

Kotlinがstruct型とunion型をどのようにマッピングするかを理解するために、Cでそれらを宣言し、Kotlinでどのように表現されるかを調べましょう。

[前のチュートリアル](mapping-primitive-data-types-from-c.md)で、必要なファイルを含むCライブラリを既に作成しました。このステップでは、`---`区切り文字の後に`interop.def`ファイルの宣言を更新します。

```c

---

typedef struct {
  int a;
  double b;
} MyStruct;

void struct_by_value(MyStruct s) {}
void struct_by_pointer(MyStruct* s) {}

typedef union {
  int a;
  MyStruct b;
  float c;
} MyUnion;

void union_by_value(MyUnion u) {}
void union_by_pointer(MyUnion* u) {}
``` 

`interop.def`ファイルには、アプリケーションをIDEでコンパイル、実行、または開くために必要なすべてが提供されています。

## Cライブラリの生成されたKotlin APIを検査する

Cのstruct型とunion型がKotlin/Nativeにどのようにマッピングされるかを見て、プロジェクトを更新しましょう。

1.  `src/nativeMain/kotlin`で、[前のチュートリアル](mapping-primitive-data-types-from-c.md)の`hello.kt`ファイルを以下の内容で更新します。

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")

        struct_by_value(/* fix me*/)
        struct_by_pointer(/* fix me*/)
        union_by_value(/* fix me*/)
        union_by_pointer(/* fix me*/)
    }
    ```

2.  コンパイラエラーを避けるために、ビルドプロセスに相互運用性を追加します。そのためには、`build.gradle(.kts)`ビルドファイルを以下の内容で更新します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        macosArm64("native") {    // Apple Silicon搭載macOS
        // macosX64("native") {   // x86_64プラットフォーム上のmacOS
        // linuxArm64("native") { // ARM64プラットフォーム上のLinux 
        // linuxX64("native") {   // x86_64プラットフォーム上のLinux
        // mingwX64("native") {   // Windows
            val main by compilations.getting
            val interop by main.cinterops.creating {
                definitionFile.set(project.file("src/nativeInterop/cinterop/interop.def"))
            }
        
            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        macosArm64("native") {    // Apple Silicon搭載macOS
        // macosX64("native") {   // x86_64プラットフォーム上のmacOS
        // linuxArm64("native") { // ARM64プラットフォーム上のLinux
        // linuxX64("native") {   // x86_64プラットフォーム上のLinux
        // mingwX64("native") {   // Windows
            compilations.main.cinterops {
                interop {   
                    definitionFile = project.file('src/nativeInterop/cinterop/interop.def')
                }
            }
        
            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    </tabs> 

3.  IntelliJ IDEAの[宣言へ移動](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数、struct、union用に生成された以下のAPIに移動します。

    ```kotlin
    fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
    fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
    
    fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
    fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
    ```

技術的には、Kotlin側ではstruct型とunion型に違いはありません。cinteropツールは、structとunionの両方のC宣言に対してKotlin型を生成します。

生成されたAPIには、`CValue<T>`と`CValuesRef<T>`の完全修飾パッケージ名が含まれており、それらが`kotlinx.cinterop`に位置することを反映しています。`CValue<T>`は値渡し構造体パラメータを表し、`CValuesRef<T>?`は構造体またはunionへのポインタを渡すために使用されます。

## Kotlinからstruct型とunion型を使用する

生成されたAPIのおかげで、Cのstruct型とunion型をKotlinから使用することは簡単です。唯一の問題は、これらの型の新しいインスタンスをどのように作成するかです。

`MyStruct`と`MyUnion`をパラメータとして受け取る生成された関数を見てみましょう。値渡しパラメータは`kotlinx.cinterop.CValue<T>`として表現され、ポインタ型のパラメータは`kotlinx.cinterop.CValuesRef<T>?`を使用します。

Kotlinはこれらの型を作成し、操作するための便利なAPIを提供しています。実際にどのように使用するかを見てみましょう。

### CValue&lt;T&gt;を作成する

`CValue<T>`型は、値渡しパラメータをC関数呼び出しに渡すために使用されます。`cValue`関数を使用して`CValue<T>`インスタンスを作成します。この関数は、基となるC型をインプレースで初期化するために、[レシーバ付きラムダ関数](lambdas.md#function-literals-with-receiver)を必要とします。この関数は次のように宣言されています。

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

以下に`cValue`の使用方法と、値渡しパラメータの渡し方を示します。

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue

@OptIn(ExperimentalForeignApi::class)
fun callValue() {

    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }
    struct_by_value(cStruct)

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    union_by_value(cUnion)
}
```

### structとunionをCValuesRef&lt;T&gt;として作成する

`CValuesRef<T>`型は、KotlinでC関数のポインタ型パラメータを渡すために使用されます。ネイティブメモリに`MyStruct`と`MyUnion`を割り当てるには、`kotlinx.cinterop.NativePlacement`型に対する以下の拡張関数を使用します。

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement`は、`malloc`や`free`に似た関数を持つネイティブメモリを表します。`NativePlacement`にはいくつかの実装があります。

*   グローバルな実装は`kotlinx.cinterop.nativeHeap`ですが、使用後にメモリを解放するために`nativeHeap.free()`を呼び出す必要があります。
*   より安全な代替手段は`memScoped()`で、これは短命なメモリスコープを作成し、そのブロックの終わりにすべての割り当てが自動的に解放されます。

    ```kotlin
    fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
    ```

`memScoped()`を使用すると、ポインタを持つ関数を呼び出すコードは次のようになります。

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ptr

@OptIn(ExperimentalForeignApi::class)
fun callRef() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_pointer(cStruct.ptr)

        val cUnion = alloc<MyUnion>()
        cUnion.b.a = 5
        cUnion.b.b = 2.7182

        union_by_pointer(cUnion.ptr)
    }
}
```

ここで、`memScoped {}`ブロック内で利用可能な`ptr`拡張プロパティは、`MyStruct`と`MyUnion`のインスタンスをネイティブポインタに変換します。

メモリは`memScoped {}`ブロック内で管理されるため、ブロックの終わりに自動的に解放されます。解放されたメモリへのアクセスを防ぐため、このスコープ外でポインタを使用することは避けてください。より寿命の長い割り当て（たとえば、Cライブラリでのキャッシングなど）が必要な場合は、`Arena()`または`nativeHeap`の使用を検討してください。

### CValue&lt;T&gt;とCValuesRef&lt;T&gt;の変換

ある関数呼び出しではstructを値として渡し、別の関数呼び出しでは同じstructを参照として渡す必要がある場合があります。

これを行うには`NativePlacement`が必要ですが、まず`CValue<T>`がどのようにポインタに変換されるかを見てみましょう。

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped

@OptIn(ExperimentalForeignApi::class)
fun callMix_ref() {
    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }

    memScoped {
        struct_by_pointer(cStruct.ptr)
    }
}
```

ここでも、`memScoped {}`の`ptr`拡張プロパティは、`MyStruct`インスタンスをネイティブポインタに変換します。これらのポインタは`memScoped {}`ブロック内でのみ有効です。

ポインタを値渡し変数に戻すには、`.readValue()`拡張関数を呼び出します。

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.readValue

@OptIn(ExperimentalForeignApi::class)
fun callMix_value() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_value(cStruct.readValue())
    }
}
```

## Kotlinコードの更新

C宣言をKotlinコードで使用する方法を学んだので、プロジェクトでそれらを使用してみてください。`hello.kt`ファイルの最終的なコードは次のようになります。

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.ptr
import kotlinx.cinterop.readValue
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    memScoped {
        union_by_value(cUnion)
        union_by_pointer(cUnion.ptr)
    }

    memScoped {
        val cStruct = alloc<MyStruct> {
            a = 42
            b = 3.14
        }

        struct_by_value(cStruct.readValue())
        struct_by_pointer(cStruct.ptr)
    }
}
```

すべてが期待どおりに動作することを確認するには、[IDEで](native-get-started.md#build-and-run-the-application)`runDebugExecutableNative` Gradleタスクを実行するか、以下のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

シリーズの次のパートでは、KotlinとCの間で関数ポインタがどのようにマッピングされるかを学びます。

**[次のパートに進む](mapping-function-pointers-from-c.md)**

### 関連項目

より高度なシナリオをカバーする[Cとの相互運用性](native-c-interop.md)のドキュメントで詳細を学びましょう。