---
title: "Cの構造体と共用体型のマッピング – チュートリアル"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   これは、<strong>KotlinとCのマッピング</strong>に関するチュートリアルシリーズの第2部です。先に進む前に、必ず前のステップを完了してください。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">Cからのプリミティブデータ型のマッピング</a><br/>
       <img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>Cからの構造体と共用体の型のマッピング</strong><br/>
       <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">関数ポインタのマッピング</a><br/>
       <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">Cからの文字列のマッピング</a><br/>
</p>

:::

:::caution
Cライブラリのインポートは[Experimental](components-stability#stability-levels-explained)です。cinteropツールによってCライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。

Kotlin/Nativeに付属しているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIのみオプトインが必要です。

:::

KotlinからどのCの構造体と共用体の宣言が表示されるかを探り、Kotlin/Nativeと[マルチプラットフォーム](gradle-configure-project#targeting-multiple-platforms)の高度なC interop関連のユースケースを調べましょう。
Gradleビルド。

このチュートリアルでは、次のことを学びます。

* [構造体と共用体の型がどのようにマップされるか](#mapping-struct-and-union-c-types)
* [Kotlinから構造体と共用体の型を使用する方法](#use-struct-and-union-types-from-kotlin)

## 構造体と共用体のC型のマッピング

Kotlinが構造体と共用体の型をどのようにマップするかを理解するために、Cでそれらを宣言し、Kotlinでどのように表現されるかを調べましょう。

[前のチュートリアル](mapping-primitive-data-types-from-c)では、必要なファイルを含むCライブラリを既に作成しました。
このステップでは、`interop.def`ファイルの`---`区切り文字の後の宣言を更新します。

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

`interop.def`ファイルは、コンパイル、実行、またはIDEでアプリケーションを開くために必要なすべてを提供します。

## Cライブラリ用に生成されたKotlin APIの検査

Cの構造体と共用体の型がKotlin/Nativeにどのようにマップされるかを確認し、プロジェクトを更新しましょう。

1. `src/nativeMain/kotlin`で、[前のチュートリアル](mapping-primitive-data-types-from-c)の`hello.kt`ファイルを次の内容で更新します。

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

2. コンパイラエラーを回避するために、ビルドプロセスに相互運用性を追加します。そのためには、`build.gradle(.kts)`ビルドファイルを次の内容で更新します。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        macosArm64("native") {    // macOS on Apple Silicon
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms 
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // on Windows
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

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
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

    </TabItem>
    </Tabs> 

3. IntelliJ IDEAの[宣言へ移動](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数、構造体、および共用体用に生成された次のAPIに移動します。

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

技術的には、Kotlin側では構造体と共用体の型に違いはありません。cinteropツールは、構造体と共用体のC宣言の両方に対してKotlin型を生成します。

生成されたAPIには、`CValue<T>`および`CValuesRef<T>`の完全修飾パッケージ名が含まれており、`kotlinx.cinterop`内の場所を反映しています。`CValue<T>`はby-valueの構造体パラメータを表し、`CValuesRef<T>?`は構造体または共用体へのポインタを渡すために使用されます。

## Kotlinから構造体と共用体の型を使用する

KotlinからCの構造体と共用体の型を使用することは、生成されたAPIのおかげで簡単です。唯一の問題は、これらの型の新しいインスタンスをどのように作成するかです。

`MyStruct`と`MyUnion`をパラメータとして受け取る生成された関数を見てみましょう。by-valueパラメータは`kotlinx.cinterop.CValue<T>`として表され、ポインタ型のパラメータは`kotlinx.cinterop.CValuesRef<T>?`を使用します。

Kotlinは、これらの型の作成と操作に便利なAPIを提供します。実際に使用する方法を見てみましょう。

### CValue&lt;T&gt;の作成

`CValue<T>`型は、C関数の呼び出しにby-valueパラメータを渡すために使用されます。`cValue`関数を使用して`CValue<T>`インスタンスを作成します。この関数は、基になるC型をインプレースで初期化するための[レシーバ付きのラムダ関数](lambdas#function-literals-with-receiver)を必要とします。関数は次のように宣言されています。

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() `->` Unit): CValue<T>
```

`cValue`を使用してby-valueパラメータを渡す方法は次のとおりです。

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

### CValuesRef&lt;T&gt;として構造体と共用体を作成する

`CValuesRef<T>`型は、C関数のポインタ型のパラメータを渡すためにKotlinで使用されます。`MyStruct`と`MyUnion`をネイティブメモリに割り当てるには、`kotlinx.cinterop.NativePlacement`型で次の拡張関数を使用します。

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement`は、`malloc`や`free`と同様の関数を持つネイティブメモリを表します。`NativePlacement`にはいくつかの実装があります。

* グローバルな実装は`kotlinx.cinterop.nativeHeap`ですが、使用後にメモリを解放するには`nativeHeap.free()`を呼び出す必要があります。
* より安全な代替手段は`memScoped()`です。これは、すべての割り当てがブロックの最後に自動的に解放される短寿命のメモリスコープを作成します。

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() `->` R): R
  ```

`memScoped()`を使用すると、ポインタを持つ関数を呼び出すためのコードは次のようになります。

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

ここでは、`memScoped {}`ブロック内で利用可能な`ptr`拡張プロパティが、`MyStruct`インスタンスと`MyUnion`インスタンスをネイティブポインタに変換します。

メモリは`memScoped {}`ブロック内で管理されているため、ブロックの最後に自動的に解放されます。
割り当て解除されたメモリへのアクセスを防ぐために、このスコープ外でポインタを使用しないでください。より長寿命の割り当てが必要な場合（たとえば、Cライブラリでのキャッシュの場合）は、`Arena()`または`nativeHeap`の使用を検討してください。

### CValue&lt;T&gt;とCValuesRef&lt;T&gt;間の変換

場合によっては、1つの関数の呼び出しで構造体を値として渡し、別の関数の呼び出しで同じ構造体を参照として渡す必要があります。

これを行うには、`NativePlacement`が必要ですが、最初に`CValue<T>`がどのようにポインタに変換されるかを見てみましょう。

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

ここでも、`memScoped {}`からの`ptr`拡張プロパティが、`MyStruct`インスタンスをネイティブポインタに変換します。
これらのポインタは、`memScoped {}`ブロック内でのみ有効です。

ポインタをby-valueの変数に戻すには、`.readValue()`拡張関数を呼び出します。

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

KotlinコードでCの宣言を使用する方法を学んだので、プロジェクトで使用してみてください。
`hello.kt`ファイルの最終的なコードは次のようになります。

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

すべてが期待どおりに動作することを確認するには、[IDEで](native-get-started#build-and-run-the-application)`runDebugExecutableNative` Gradleタスクを実行します。
または、次のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

シリーズの次のパートでは、関数ポインタがKotlinとCの間でどのようにマップされるかを学びます。

**[次のパートに進む](mapping-function-pointers-from-c)**

### 参照

より高度なシナリオをカバーする[Cとの相互運用性](native-c-interop)のドキュメントで詳細をご覧ください。