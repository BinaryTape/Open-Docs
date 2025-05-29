[//]: # (title: Cの構造体と共用体型をマッピングする – チュートリアル)

<tldr>
    <p>これは<strong>KotlinとCのマッピング</strong>チュートリアルシリーズの第2部です。読み進める前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">Cのプリミティブデータ型のマッピング</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>Cの構造体と共用体型のマッピング</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">Cの関数ポインタのマッピング</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">Cの文字列のマッピング</a><br/>
    </p>
</tldr>

> Cライブラリのインポートは[Experimental](components-stability.md#stability-levels-explained)です。cinteropツールによってCライブラリから生成されるすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIのみオプトインが必要です。
>
{style="warning"}

Cの構造体（struct）と共用体（union）の宣言がKotlinからどのように見えるかを探り、Kotlin/Nativeおよび[マルチプラットフォーム](gradle-configure-project.md#targeting-multiple-platforms)Gradleビルドにおける高度なC相互運用関連のユースケースを検証しましょう。

このチュートリアルでは、以下を学習します。

* [構造体と共用体型がどのようにマッピングされるか](#mapping-struct-and-union-c-types)
* [Kotlinから構造体と共用体型を使用する方法](#use-struct-and-union-types-from-kotlin)

## Cの構造体と共用体型のマッピング

Kotlinが構造体と共用体型をどのようにマッピングするかを理解するために、それらをCで宣言し、Kotlinでどのように表現されるかを検証しましょう。

[前のチュートリアル](mapping-primitive-data-types-from-c.md)で、必要なファイルを含むCライブラリをすでに作成しました。このステップでは、`interop.def`ファイル内の`---`セパレータの後ろに宣言を更新します。

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

`interop.def`ファイルは、アプリケーションのコンパイル、実行、またはIDEでの開くために必要なすべてを提供します。

## Cライブラリの生成されたKotlin APIを検査する

Cの構造体と共用体型がKotlin/Nativeにどのようにマッピングされるかを見て、プロジェクトを更新しましょう。

1. `src/nativeMain/kotlin`内で、[前のチュートリアル](mapping-primitive-data-types-from-c.md)の`hello.kt`ファイルを以下の内容で更新します。

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

2. コンパイラエラーを回避するため、ビルドプロセスに相互運用性（interoperability）を追加します。そのためには、`build.gradle(.kts)`ビルドファイルを以下の内容で更新します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

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

    </tab>
    <tab title="Groovy" group-key="groovy">

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

    </tab>
    </tabs> 

3. IntelliJ IDEAの[宣言に移動](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数、構造体、共用体について以下の生成されたAPIに移動します。

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

技術的には、Kotlin側では構造体型と共用体型に違いはありません。cinteropツールは、構造体と共用体の両方のC宣言に対してKotlin型を生成します。

生成されたAPIには、`kotlinx.cinterop`における`CValue<T>`と`CValuesRef<T>`の場所を反映した完全修飾パッケージ名が含まれています。`CValue<T>`は値渡しされる構造体パラメータを表し、`CValuesRef<T>?`は構造体または共用体へのポインタを渡すために使用されます。

## Kotlinから構造体と共用体型を使用する

生成されたAPIのおかげで、KotlinからCの構造体と共用体型を使用するのは簡単です。唯一の問題は、これらの型の新しいインスタンスをどのように作成するかです。

`MyStruct`と`MyUnion`をパラメータとして受け取る生成された関数を見てみましょう。値渡しされるパラメータは`kotlinx.cinterop.CValue<T>`として表現され、ポインタ型のパラメータは`kotlinx.cinterop.CValuesRef<T>?`を使用します。

Kotlinは、これらの型を作成して操作するための便利なAPIを提供します。実際にそれを使用する方法を探ってみましょう。

### `CValue<T>`の作成

`CValue<T>`型は、C関数呼び出しに値渡しされるパラメータを渡すために使用されます。`cValue`関数を使用して`CValue<T>`インスタンスを作成します。この関数は、基になるC型をその場で初期化するための[レシーバ付きラムダ関数](lambdas.md#function-literals-with-receiver)を必要とします。この関数は次のように宣言されます。

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

`cValue`を使用して値渡しされるパラメータを渡す方法は次のとおりです。

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

### `CValuesRef<T>`として構造体と共用体を作成する

`CValuesRef<T>`型は、C関数のポインタ型パラメータを渡すためにKotlinで使用されます。ネイティブメモリに`MyStruct`と`MyUnion`を割り当てるには、`kotlinx.cinterop.NativePlacement`型に対する以下の拡張関数を使用します。

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement`は、`malloc`や`free`に似た関数を持つネイティブメモリを表します。`NativePlacement`にはいくつかの実装があります。

* グローバルな実装は`kotlinx.cinterop.nativeHeap`ですが、使用後にメモリを解放するために`nativeHeap.free()`を呼び出す必要があります。
* より安全な代替手段は`memScoped()`です。これは短命なメモリスコープを作成し、そのブロックの終了時にすべての割り当てが自動的に解放されます。

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

ここで、`memScoped {}`ブロック内で利用できる`ptr`拡張プロパティは、`MyStruct`および`MyUnion`インスタンスをネイティブポインタに変換します。

メモリは`memScoped {}`ブロック内で管理されるため、ブロックの終了時に自動的に解放されます。解放されたメモリへのアクセスを防ぐため、このスコープの外でポインタを使用することは避けてください。より長期間の割り当て（たとえば、Cライブラリでのキャッシュ用）が必要な場合は、`Arena()`または`nativeHeap`の使用を検討してください。

### `CValue<T>`と`CValuesRef<T>`間の変換

`CValuesRef<T>`をポインタに変換する方法を見てみましょう。

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

ここでも、`memScoped {}`の`ptr`拡張プロパティが`MyStruct`インスタンスをネイティブポインタに変換します。これらのポインタは`memScoped {}`ブロック内でのみ有効です。

ポインタを値渡しされる変数に戻すには、`.readValue()`拡張関数を呼び出します。

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

## Kotlinコードを更新する

Cの宣言をKotlinコードで使用する方法を学んだので、プロジェクトでそれらを使用してみてください。`hello.kt`ファイルの最終的なコードは次のようになります。

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

すべてが期待通りに動作することを確認するには、[IDEで](native-get-started.md#build-and-run-the-application) `runDebugExecutableNative` Gradleタスクを実行するか、次のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

シリーズの次のパートでは、関数ポインタがKotlinとCの間でどのようにマッピングされるかを学習します。

**[次のパートに進む](mapping-function-pointers-from-c.md)**

### 参照

より高度なシナリオをカバーする[Cとの相互運用](native-c-interop.md)ドキュメントで詳細を学習してください。