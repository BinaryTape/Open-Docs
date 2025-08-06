[//]: # (title: Cからの関数ポインターのマッピング – チュートリアル)

<tldr>
    <p>これは**KotlinとCのマッピング**チュートリアルシリーズの第3部です。進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">Cからのプリミティブデータ型のマッピング</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">Cからの構造体と共用体型のマッピング</a><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>関数ポインターのマッピング</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">Cからの文字列のマッピング</a><br/>
    </p>
</tldr>

> Cライブラリのインポートは[ベータ版](native-c-interop-stability.md)です。Cライブラリからcinteropツールによって生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIのみオプトインが必要です。
> {style="note"}

KotlinからどのC関数ポインターが可視であるかを探り、Kotlin/Nativeと[マルチプラットフォーム](gradle-configure-project.md#targeting-multiple-platforms) Gradleビルドの高度なC相互運用関連のユースケースを調べましょう。

このチュートリアルでは、以下を行います。

*   [Kotlin関数をC関数ポインターとして渡す方法を学ぶ](#pass-kotlin-function-as-a-c-function-pointer)
*   [KotlinからC関数ポインターを使用する](#use-the-c-function-pointer-from-kotlin)

## Cからの関数ポインター型のマッピング

KotlinとCのマッピングを理解するために、関数ポインターをパラメーターとして受け取る関数と、関数ポインターを返す関数の2つを宣言しましょう。

シリーズの[最初のパート](mapping-primitive-data-types-from-c.md)では、必要なファイルを含むCライブラリを既に作成しました。このステップでは、`---`セパレーターの後に`interop.def`ファイル内の宣言を更新します。

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

`interop.def`ファイルは、IDEでアプリケーションをコンパイル、実行、または開くために必要なすべてを提供します。

## Cライブラリ用に生成されたKotlin APIを検査する

C関数ポインターがKotlin/Nativeにどのようにマッピングされるかを見て、プロジェクトを更新しましょう。

1.  `src/nativeMain/kotlin`で、[前のチュートリアル](mapping-struct-union-types-from-c.md)から`hello.kt`ファイルを以下の内容で更新します。

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

2.  IntelliJ IDEAの[宣言へ移動](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)コマンド（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）を使用して、C関数用に生成された以下のAPIに移動します。

    ```kotlin
    fun myFun(i: kotlin.Int): kotlin.Int
    fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
    fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
    ```

ご覧のとおり、C関数ポインターはKotlinでは`CPointer<CFunction<...>>`を使用して表現されます。`accept_fun()`関数はオプションの関数ポインターをパラメーターとして受け取り、`supply_fun()`関数は関数ポインターを返します。

`CFunction<(Int) -> Int>`は関数シグネチャを表し、`CPointer<CFunction<...>>?`はnull許容の関数ポインターを表します。すべての`CPointer<CFunction<...>>`型に対して[`.invoke()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/invoke.html)演算子拡張関数が利用可能であり、これにより通常のKotlin関数であるかのように関数ポインターを呼び出すことができます。

## Kotlin関数をC関数ポインターとして渡す

KotlinコードからC関数を使ってみる時が来ました。`accept_fun()`関数を呼び出し、C関数ポインターをKotlinラムダに渡します。

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

この呼び出しは、Kotlin/Nativeの`staticCFunction {}`ヘルパー関数を使用して、Kotlinラムダ関数をC関数ポインターにラップします。これは、束縛されていない非キャプチャラムダ関数のみを許可します。たとえば、関数内のローカル変数をキャプチャすることはできず、グローバルに可視な宣言のみをキャプチャできます。

関数が例外をスローしないことを確認してください。`staticCFunction {}`から例外をスローすると、非決定的な副作用が発生します。

## KotlinからC関数ポインターを使用する

次のステップは、`supply_fun()`呼び出しから返されたC関数ポインターを呼び出すことです。

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

Kotlinは、関数ポインターの戻り型をnull許容の`CPointer<CFunction<>`オブジェクトに変換します。最初に明示的に`null`をチェックする必要があり、そのため上記のコードでは[エルビス演算子](null-safety.md)が使用されています。cinteropツールを使用すると、C関数ポインターを通常のKotlin関数呼び出し（`functionFromC(42)`）として呼び出すことができます。

## Kotlinコードの更新

すべての定義を見たので、それらをプロジェクトで使ってみましょう。
`hello.kt`ファイル内のコードは次のようになります。

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

すべてが期待通りに動作することを確認するには、[IDEで](native-get-started.md#build-and-run-the-application)`runDebugExecutableNative` Gradleタスクを実行するか、以下のコマンドを使用してコードを実行します。

```bash
./gradlew runDebugExecutableNative
```

## 次のステップ

シリーズの次のパートでは、KotlinとCの間で文字列がどのようにマッピングされるかを学びます。

**[次のパートに進む](mapping-strings-from-c.md)**

### 関連項目

より高度なシナリオを扱う[Cとの相互運用性](native-c-interop.md)のドキュメントで詳細を学んでください。