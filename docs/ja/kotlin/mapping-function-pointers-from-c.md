[//]: # (title: Cからの関数ポインタのマッピング – チュートリアル)

<tldr>
    <p>これは「<strong>KotlinとCのマッピング</strong>」チュートリアルシリーズの第3部です。次に進む前に、前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第1ステップ"/> <a href="mapping-primitive-data-types-from-c.md">Cからのプリミティブデータ型のマッピング</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第2ステップ"/> <a href="mapping-struct-union-types-from-c.md">Cからの構造体および共用体型のマッピング</a><br/>
        <img src="icon-3.svg" width="20" alt="第3ステップ"/> <strong>Cからの関数ポインタのマッピング</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="第4ステップ"/> <a href="mapping-strings-from-c.md">Cからの文字列のマッピング</a><br/>
    </p>
</tldr>

> Cライブラリのインポートは[ベータ](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)段階です。cinteropツールによってCライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが付与されている必要があります。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）では、一部のAPIでのみオプトインが必要です。
>
{style="note"}

KotlinからどのC関数ポインタが見えるかを確認し、Kotlin/Nativeと[マルチプラットフォーム](gradle-configure-project.md#targeting-multiple-platforms) Gradleビルドの高度なC相互運用（interop）に関するユースケースを調べましょう。

このチュートリアルでは、以下の内容を学びます：

* [Kotlin関数をC関数ポインタとして渡す方法](#pass-kotlin-function-as-a-c-function-pointer)
* [KotlinからC関数ポインタを使用する方法](#use-the-c-function-pointer-from-kotlin)

## Cからの関数ポインタ型のマッピング

KotlinとCの間のマッピングを理解するために、2つの関数を宣言してみましょう。1つは関数ポインタをパラメータとして受け取り、もう1つは関数ポインタを返す関数です。

[シリーズの第1部](mapping-primitive-data-types-from-c.md)で、必要なファイルを含むCライブラリをすでに作成しました。このステップでは、`---`セパレータの後にある`interop.def`ファイルの宣言を更新します：

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

`interop.def`ファイルには、アプリケーションをコンパイル、実行、またはIDEで開くために必要なすべてが含まれています。

## Cライブラリ用に生成されたKotlin APIの確認

C関数ポインタがKotlin/Nativeにどのようにマッピングされるかを確認し、プロジェクトを更新しましょう：

1. `src/nativeMain/kotlin`にある、[前のチュートリアル](mapping-struct-union-types-from-c.md)で作成した`hello.kt`ファイルを以下の内容で更新します：

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

2. IntelliJ IDEAの[Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数用に生成された以下のAPIに移動します：

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
   ```

ご覧の通り、C関数ポインタはKotlinでは`CPointer<CFunction<...>>`を使用して表現されます。`accept_fun()`関数はオプション（nullable）の関数ポインタをパラメータとして取り、`supply_fun()`は関数ポインタを返します。

`CFunction<(Int) -> Int>`は関数のシグネチャを表し、`CPointer<CFunction<...>>?`はnullableな関数ポインタを表します。すべての`CPointer<CFunction<...>>`型には、[`.invoke()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/invoke.html)演算子の拡張関数が用意されており、これによって関数ポインタを通常のKotlin関数であるかのように呼び出すことができます。

## Kotlin関数をC関数ポインタとして渡す

KotlinコードからC関数を使ってみましょう。`accept_fun()`関数を呼び出し、C関数ポインタとしてKotlinラムダを渡します：

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

この呼び出しでは、Kotlin/Nativeの`staticCFunction {}`ヘルパー関数を使用して、Kotlinラムダ関数をC関数ポインタにラップしています。これには、バインドされていない、キャプチャを行わない（non-capturing）ラムダ関数のみを使用できます。例えば、関数内のローカル変数をキャプチャすることはできず、グローバルにアクセス可能な宣言のみをキャプチャできます。

関数が例外をスローしないように注意してください。`staticCFunction {}`から例外をスローすると、非決定的な副作用が発生します。

## KotlinからC関数ポインタを使用する

次のステップは、`supply_fun()`の呼び出しから返されたC関数ポインタを呼び出すことです：

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

Kotlinは、関数ポインタの戻り値をnullableな`CPointer<CFunction<>>`オブジェクトに変換します。最初に明示的に`null`チェックを行う必要があり、そのため上記のコードでは[エルビス演算子](null-safety.md)が使用されています。cinteropツールを使用すると、C関数ポインタを通常のKotlin関数の呼び出し（`functionFromC(42)`）として呼び出すことができます。

## Kotlinコードの更新

すべての定義を確認したので、プロジェクトでそれらを使用してみましょう。
`hello.kt`ファイルのコードは以下のようになります：

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

すべてが期待通りに動作することを確認するために、[IDEで](native-get-started.md#build-and-run-the-application) `runDebugExecutableNative` Gradleタスクを実行するか、以下のコマンドを使用してコードを実行します：

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

シリーズの次のパートでは、KotlinとCの間で文字列がどのようにマッピングされるかを学びます：

**[次のパートへ進む](mapping-strings-from-c.md)**

### 関連項目

より高度なシナリオをカバーしている[Cとの相互運用性](native-c-interop.md)のドキュメントで詳細を確認してください。