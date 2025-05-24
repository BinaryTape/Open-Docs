---
title: "C言語からの関数ポインタのマッピング – チュートリアル"
---
:::info
<p>
   これは、<strong>KotlinとCのマッピング</strong>に関するチュートリアルシリーズの第3部です。先に進む前に、前の手順を完了していることを確認してください。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">Cのプリミティブデータ型のマッピング</a><br/>
        <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">Cの構造体と共用体の型のマッピング</a><br/>
        <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>関数ポインタのマッピング</strong><br/>
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">Cの文字列のマッピング</a><br/>
</p>

:::

:::caution
Cライブラリのインポートは[Experimental](components-stability#stability-levels-explained)です。cinteropツールによってCライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。

Kotlin/Nativeに付属するネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。

:::

KotlinからどのC関数ポインタが見えるかを探り、Kotlin/Nativeと[マルチプラットフォーム](gradle-configure-project#targeting-multiple-platforms) Gradleビルドの高度なC interop関連のユースケースを調べましょう。

このチュートリアルでは、次のことを行います。

* [Kotlin関数をC関数ポインタとして渡す方法を学ぶ](#pass-kotlin-function-as-a-c-function-pointer)
* [KotlinからC関数ポインタを使用する](#use-the-c-function-pointer-from-kotlin)

## Cからの関数ポインタ型のマッピング

KotlinとC間のマッピングを理解するために、2つの関数を宣言しましょう。1つは関数ポインタをパラメータとして受け取り、もう1つは関数ポインタを返します。

このシリーズの[最初のパート](mapping-primitive-data-types-from-c)で、必要なファイルを含むCライブラリをすでに作成しました。このステップでは、`interop.def`ファイルの`---`区切り記号の後の宣言を更新します。

```c 

---

int myFun(int i) {
  return i+1;
}

typedef int  (*MyFun)(int);

void accept_fun(MyFun f) {
  f(42);
}

MyFun supply_fun() {
  return myFun;
}
``` 

`interop.def`ファイルは、アプリケーションをコンパイル、実行、またはIDEで開くために必要なものをすべて提供します。

## Cライブラリ用に生成されたKotlin APIを検査する

C関数ポインタがKotlin/Nativeにどのようにマッピングされるかを見て、プロジェクトを更新しましょう。

1. `src/nativeMain/kotlin`で、[前のチュートリアル](mapping-struct-union-types-from-c)の`hello.kt`ファイルを次の内容で更新します。

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi
   
   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")
      
       accept_fun(/* fix me*/)
       val useMe = supply_fun()
   }
   ```

2. IntelliJ IDEAの[宣言へ移動](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数の次の生成されたAPIに移動します。

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) `->` kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) `->` kotlin.Int>>? /* from: interop.MyFun? */
   ```

ご覧のとおり、C関数ポインタはKotlinでは`CPointer<CFunction<...>>`を使用して表されます。`accept_fun()`関数はオプションの関数ポインタをパラメータとして取り、`supply_fun()`は関数ポインタを返します。

`CFunction<(Int) `->` Int>`は関数シグネチャを表し、`CPointer<CFunction<...>>?`はnullable関数ポインタを表します。すべての`CPointer<CFunction<...>>`型で使用可能な`invoke`演算子の拡張関数があり、通常のKotlin関数であるかのように関数ポインタを呼び出すことができます。

## Kotlin関数をC関数ポインタとして渡す

KotlinコードからC関数を使用してみましょう。`accept_fun()`関数を呼び出し、C関数ポインタをKotlinラムダに渡します。

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

この呼び出しでは、Kotlin/Nativeの`staticCFunction {}`ヘルパー関数を使用して、Kotlinラムダ関数をC関数ポインタにラップします。これにより、バインドされておらず、キャプチャしないラムダ関数のみが許可されます。たとえば、関数からローカル変数をキャプチャすることはできず、グローバルに表示される宣言のみをキャプチャできます。

関数が例外をスローしないことを確認してください。`staticCFunction {}`から例外をスローすると、非決定的な副作用が発生します。

## KotlinからC関数ポインタを使用する

次のステップは、`supply_fun()`呼び出しから返されたC関数ポインタを呼び出すことです。

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.invoke

@OptIn(ExperimentalForeignApi::class)
fun myFun2() {
    val functionFromC = supply_fun() ?: error("No function is returned")

    functionFromC(42)
}
```

Kotlinは、関数ポインタの戻り値をnullableな`CPointer<CFunction<>`オブジェクトに変換します。最初に明示的に`null`を確認する必要があります。これが、上記のコードで[Elvis演算子](null-safety)が使用されている理由です。cinteropツールを使用すると、C関数ポインタを通常のKotlin関数呼び出しとして呼び出すことができます：`functionFromC(42)`。

## Kotlinコードを更新する

すべての定義を確認したので、プロジェクトでそれらを使用してみてください。
`hello.kt`ファイルのコードは次のようになります。

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.invoke
import kotlinx.cinterop.staticCFunction

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val cFunctionPointer = staticCFunction<Int, Int> { it + 1 }
    accept_fun(cFunctionPointer)

    val funFromC = supply_fun() ?: error("No function is returned")
    funFromC(42)
}
```

すべてが期待どおりに動作することを確認するには、[IDEで](native-get-started#build-and-run-the-application)`runDebugExecutableNative` Gradleタスクを実行するか、次のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

このシリーズの次のパートでは、KotlinとCの間で文字列がどのようにマッピングされるかを学びます。

**[次のパートに進む](mapping-strings-from-c)**

### 参照

より高度なシナリオをカバーする[Cとの相互運用性](native-c-interop)ドキュメントで詳細をご覧ください。