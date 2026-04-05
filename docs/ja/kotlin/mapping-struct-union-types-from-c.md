[//]: # (title: Cの構造体（struct）および共用体（union）型のマッピング – チュートリアル)

<tldr>
    <p>これは<strong>KotlinとCのマッピング</strong>チュートリアルシリーズの第2部です。次に進む前に、前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">Cのプリミティブデータ型のマッピング</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>Cの構造体（struct）および共用体（union）型のマッピング</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">Cの関数ポインタのマッピング</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">Cの文字列のマッピング</a><br/>
    </p>
</tldr>

> Cライブラリのインポートは[ベータ版](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)です。cinteropツールによってCライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが付与されます。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）では、一部のAPIについてのみオプトインが必要です。
>
{style="note"}

どのCの構造体（struct）および共用体（union）の宣言がKotlinから見えるかを確認し、Kotlin/Nativeの高度なC相互運用（interop）に関連するユースケースや、[マルチプラットフォーム](gradle-configure-project.md#targeting-multiple-platforms)のGradleビルドについて見ていきましょう。

このチュートリアルでは、以下の内容を学びます：

* [構造体および共用体型がどのようにマッピングされるか](#mapping-struct-and-union-c-types)
* [Kotlinから構造体および共用体型を使用する方法](#use-struct-and-union-types-from-kotlin)

## Cの構造体および共用体型のマッピング

Kotlinが構造体（struct）および共用体（union）型をどのようにマッピングするかを理解するために、それらをCで宣言し、Kotlinでどのように表現されるかを確認してみましょう。

[前のチュートリアル](mapping-primitive-data-types-from-c.md)で、必要なファイルを含むCライブラリを既に作成しました。このステップでは、`interop.def`ファイルの `---` セパレータの後に以下の宣言を追加して更新してください：

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

`interop.def` ファイルには、アプリケーションをコンパイル、実行、またはIDEで開くために必要なすべての情報が含まれています。

## Cライブラリ用に生成されたKotlin APIの確認

Cの構造体および共用体型がKotlin/Nativeにどのようにマッピングされるかを確認し、プロジェクトを更新しましょう：

1. `src/nativeMain/kotlin` にある [前のチュートリアル](mapping-primitive-data-types-from-c.md) の `hello.kt` ファイルを、以下の内容で更新します：

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

2. コンパイルエラーを避けるために、ビルドプロセスに相互運用性を追加します。そのために、`build.gradle(.kts)` ファイルを以下の内容で更新してください：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        macosArm64()    // Apple Silicon搭載のmacOS
        // linuxArm64() // ARM64プラットフォームのLinux
        // linuxX64()   // x86_64プラットフォームのLinux
        // mingwX64()   // Windows

        targets.withType<KotlinNativeTarget>().configureEach {
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
        macosArm64()    // Apple Silicon搭載のmacOS
        // linuxArm64() // ARM64プラットフォームのLinux
        // linuxX64()   // x86_64プラットフォームのLinux
        // mingwX64()   // Windows

        targets.withType(KotlinNativeTarget).configureEach {
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

3. IntelliJ IDEAの[宣言へ移動 (Go to declaration)](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、Cの関数、構造体、共用体に対して生成された以下のAPIに移動します：

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

技術的には、Kotlin側では構造体と共用体の型に違いはありません。cinteropツールは、Cの構造体と共用体の両方の宣言に対してKotlinの型を生成します。

生成されたAPIには、`CValue<T>` と `CValuesRef<T>` の完全修飾パッケージ名が含まれており、これらが `kotlinx.cinterop` に配置されていることを示しています。`CValue<T>` は値渡しの構造体パラメータを表し、`CValuesRef<T>?` は構造体または共用体へのポインタを渡すために使用されます。

## Kotlinから構造体および共用体型を使用する

生成されたAPIのおかげで、KotlinからCの構造体および共用体型を使用するのは簡単です。唯一の問題は、これらの型の新しいインスタンスをどのように作成するかです。

`MyStruct` と `MyUnion` をパラメータとして受け取る生成された関数を見てみましょう。値渡しのパラメータは `kotlinx.cinterop.CValue<T>` として表現され、ポインタ型のパラメータは `kotlinx.cinterop.CValuesRef<T>?` を使用します。

Kotlinは、これらの型を作成し操作するための便利なAPIを提供しています。実際にどのように使用するか見ていきましょう。

### CValue&lt;T&gt; の作成

`CValue<T>` 型は、C関数の呼び出しに値渡しのパラメータを渡すために使用されます。`CValue<T>` インスタンスを作成するには、`cValue` 関数を使用します。この関数は、基盤となるC型をその場で初期化するために、[レシーバ付きラムダ関数](lambdas.md#function-literals-with-receiver)を必要とします。関数は次のように宣言されています：

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

`cValue` を使用して値渡しのパラメータを渡す方法は以下の通りです：

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

### CValuesRef&lt;T&gt; として構造体と共用体を作成する

`CValuesRef<T>` 型は、KotlinでC関数のポインタ型パラメータを渡すために使用されます。ネイティブメモリに `MyStruct` および `MyUnion` を割り当てるには、`kotlinx.cinterop.NativePlacement` 型の以下の拡張関数を使用します：

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement` は、`malloc` や `free` に似た関数を持つネイティブメモリを表します。`NativePlacement` にはいくつかの実装があります：

* グローバルな実装は `kotlinx.cinterop.nativeHeap` ですが、使用後にメモリを解放するために `nativeHeap.free()` を呼び出す必要があります。
* より安全な代替手段は `memScoped()` です。これは短命なメモリ・スコープを作成し、ブロックの最後ですべての割り当てが自動的に解放されます：

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
  ```

`memScoped()` を使用すると、ポインタを使用して関数を呼び出すコードは次のようになります：

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

ここで、`memScoped {}` ブロック内で利用可能な `ptr` 拡張プロパティは、`MyStruct` および `MyUnion` インスタンスをネイティブポインタに変換します。

メモリは `memScoped {}` ブロック内で管理されるため、ブロックの最後で自動的に解放されます。解放されたメモリへのアクセスを防ぐため、このスコープ外でポインタを使用しないでください。より長寿命の割り当てが必要な場合（例えば、Cライブラリでのキャッシュ用など）は、`Arena()` または `nativeHeap` の使用を検討してください。

### CValue&lt;T&gt; と CValuesRef&lt;T&gt; の間の変換

ある関数呼び出しでは構造体を値として渡し、別の呼び出しでは同じ構造体を参照として渡す必要がある場合があります。

これを行うには `NativePlacement` が必要ですが、まずは `CValue<T>` をポインタに変換する方法を見てみましょう：

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

ここでも、`memScoped {}` の `ptr` 拡張プロパティが `MyStruct` インスタンスをネイティブポインタに変換します。これらのポインタは `memScoped {}` ブロック内でのみ有効です。

ポインタを値渡しの変数に戻すには、`.readValue()` 拡張関数を呼び出します：

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

KotlinコードでCの宣言を使用する方法を学んだので、プロジェクトでそれらを使用してみましょう。`hello.kt` ファイルの最終的なコードは次のようになります：

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

すべてが期待通りに動作することを確認するには、[IDEで](native-get-started.md#build-and-run-the-application) `runDebugExecutable<YourTargetName>` Gradleタスクを実行するか、ターミナルでコンソールコマンドを使用します（この例の場合）：

```bash
./gradlew runDebugExecutableMacosArm64
```

## 次のステップ

シリーズの次のパートでは、KotlinとCの間で関数ポインタがどのようにマッピングされるかを学びます：

**[次のパートへ進む](mapping-function-pointers-from-c.md)**

### 関連項目

より高度なシナリオをカバーしている [Cとの相互運用性 (Interoperability with C)](native-c-interop.md) ドキュメントで詳細を学ぶことができます。