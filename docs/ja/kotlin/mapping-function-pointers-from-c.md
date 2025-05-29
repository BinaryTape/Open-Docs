[//]: # (title: Cの関数ポインタのマッピング – チュートリアル)

<tldr>
    <p>これは<strong>KotlinとCのマッピング</strong>チュートリアルシリーズの第3部です。次に進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ"/> <a href="mapping-primitive-data-types-from-c.md">Cのプリミティブデータ型のマッピング</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第2ステップ"/> <a href="mapping-struct-union-types-from-c.md">Cの構造体と共用体型のマッピング</a><br/>
        <img src="icon-3.svg" width="20" alt="第3ステップ"/> <strong>関数ポインタのマッピング</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="第4ステップ"/> <a href="mapping-strings-from-c.md">Cの文字列のマッピング</a><br/>
    </p>
</tldr>

> Cライブラリのインポートは[実験的](components-stability.md#stability-levels-explained)です。cinteropツールによってCライブラリから生成されるすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが付加されるべきです。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="warning"}

KotlinからどのC関数ポインタが見えるか、またKotlin/Nativeと[マルチプラットフォーム](gradle-configure-project.md#targeting-multiple-platforms)Gradleビルドの高度なC相互運用関連のユースケースを見ていきましょう。

このチュートリアルでは、次のことを行います。

* [Kotlin関数をC関数ポインタとして渡す方法を学ぶ](#pass-kotlin-function-as-a-c-function-pointer)
* [KotlinからC関数ポインタを使用する](#use-the-c-function-pointer-from-kotlin)

## Cから関数ポインタ型をマッピングする

KotlinとC間のマッピングを理解するために、関数ポインタをパラメータとして受け取る関数と、関数ポインタを返す関数の2つを宣言してみましょう。

シリーズの[最初のパート](mapping-primitive-data-types-from-c.md)で、必要なファイルを含むCライブラリをすでに作成しました。この手順では、`---`セパレータの後に`interop.def`ファイル内の宣言を更新します。

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

`interop.def`ファイルは、アプリケーションをコンパイル、実行、またはIDEで開くために必要なすべてを提供します。

## Cライブラリ用に生成されたKotlin APIを検査する

C関数ポインタがどのようにKotlin/Nativeにマッピングされるかを見て、プロジェクトを更新しましょう。

1. `src/nativeMain/kotlin`にある`hello.kt`ファイルを、[前のチュートリアル](mapping-struct-union-types-from-c.md)の内容で以下のように更新します。

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

2. IntelliJ IDEAの[Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数用に生成された以下のAPIに移動します。

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
   ```

ご覧のとおり、C関数ポインタはKotlinでは`CPointer<CFunction<...>>`を使用して表現されます。`accept_fun()`関数はオプションの関数ポインタをパラメータとして受け取り、`supply_fun()`は関数ポインタを返します。

`CFunction<(Int) -> Int>`は関数シグネチャを表し、`CPointer<CFunction<...>>?`はnull許容の関数ポインタを表します。すべての`CPointer<CFunction<...>>`型で`invoke`演算子拡張関数が利用可能であり、それにより関数ポインタを通常のKotlin関数であるかのように呼び出すことができます。

## Kotlin関数をC関数ポインタとして渡す

KotlinコードからC関数を使ってみましょう。`accept_fun()`関数を呼び出し、C関数ポインタをKotlinラムダに渡します。

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

この呼び出しは、Kotlin/Nativeの`staticCFunction {}`ヘルパー関数を使用して、Kotlinラムダ関数をC関数ポインタにラップします。これにより、束縛されていない（unbound）ラムダ関数と、キャプチャしない（non-capturing）ラムダ関数のみが許可されます。たとえば、関数のローカル変数をキャプチャすることはできず、グローバルに可視な宣言のみが対象となります。

関数が例外をスローしないことを確認してください。`staticCFunction {}`から例外をスローすると、非決定論的な副作用が発生します。

## KotlinからC関数ポインタを使用する

次のステップは、`supply_fun()`の呼び出しから返されたC関数ポインタを呼び出すことです。

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

Kotlinは、関数ポインタの戻り値をnull許容の`CPointer<CFunction<>>`オブジェクトに変換します。まず明示的に`null`をチェックする必要があります。そのため、上記のコードでは[Elvis演算子](null-safety.md)が使用されています。cinteropツールを使用すると、C関数ポインタを通常のKotlin関数呼び出し（例: `functionFromC(42)`)として呼び出すことができます。

## Kotlinコードを更新する

すべての定義を確認したので、プロジェクトでそれらを使用してみましょう。
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

すべてが期待どおりに機能することを確認するには、IDEで`runDebugExecutableNative` Gradleタスクを[実行](native-get-started.md#build-and-run-the-application)するか、以下のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

シリーズの次のパートでは、文字列がKotlinとCの間でどのようにマッピングされるかを学びます。

**[次のパートに進む](mapping-strings-from-c.md)**

### 参照

より高度なシナリオをカバーする[Cとの相互運用](native-c-interop.md)ドキュメントで詳細を学ぶことができます。