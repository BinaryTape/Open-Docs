[//]: # (title: 戻りとジャンプ)

Kotlinには、3つの構造化されたジャンプ式があります。

*   `return`は、デフォルトでは最も近い囲み関数または[匿名関数](lambdas.md#anonymous-functions)から戻ります。
*   `break`は、最も近い囲みループを終了します。
*   `continue`は、最も近い囲みループの次のステップに進みます。

これらの式はすべて、より大きな式の一部として使用できます。

```kotlin
val s = person.name ?: return
```

これらの式の型は[Nothing型](exceptions.md#the-nothing-type)です。

## ラベル付きbreakとcontinue

Kotlinのあらゆる式には、*ラベル*を付けることができます。
ラベルは、`abc@`や`fooBar@`のように、識別子の後に`@`記号が続く形式を持ちます。
式にラベルを付けるには、その式の前にラベルを追加するだけです。

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

これで、`break`または`continue`をラベルで修飾できます。

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

ラベルで修飾された`break`は、そのラベルが付けられたループの直後の実行ポイントにジャンプします。
`continue`は、そのループの次のイテレーションに進みます。

> 場合によっては、明示的にラベルを定義することなく、`break`や`continue`を*非ローカルに*適用できます。
> このような非ローカルな使用法は、囲み[インライン関数](inline-functions.md#break-and-continue)内で使用されるラムダ式で有効です。
>
{style="note"}

## ラベル付きreturn

Kotlinでは、関数リテラル、ローカル関数、オブジェクト式を使用して関数をネストできます。
修飾された`return`を使用すると、外側の関数から戻ることができます。

最も重要なユースケースは、ラムダ式からの戻りです。ラムダ式から戻るには、
それにラベルを付け、`return`を修飾します。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // ラムダの呼び出し元（forEachループ）へのローカルリターン
        print(it)
    }
    print(" done with explicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

これで、ラムダ式からのみ戻ります。多くの場合、_暗黙的なラベル_を使用する方が便利です。なぜなら、そのようなラベルは、ラムダが渡される関数と同じ名前を持つためです。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // ラムダの呼び出し元（forEachループ）へのローカルリターン
        print(it)
    }
    print(" done with implicit label")
}
//end

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

あるいは、ラムダ式を[匿名関数](lambdas.md#anonymous-functions)に置き換えることもできます。
匿名関数内の`return`文は、その匿名関数自体から戻ります。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 匿名関数の呼び出し元（forEachループ）へのローカルリターン
        print(value)
    })
    print(" done with anonymous function")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

前の3つの例におけるローカルリターンの使用は、通常のループにおける`continue`の使用に似ていることに注意してください。

`break`に直接相当するものはありませんが、外側の`run`ラムダを追加し、そこから非ローカルに戻ることでシミュレートできます。

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // runに渡されたラムダからの非ローカルリターン
            print(it)
        }
    }
    print(" done with nested loop")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ここでの非ローカルリターンは、ネストされた`forEach()`ラムダが[インライン関数](inline-functions.md)として機能するため可能です。

値を戻す際、パーサーは修飾された`return`を優先します。

```kotlin
return@a 1
```

これは、「ラベル`@a`で`1`を戻す」という意味であり、「ラベル付けされた式`(@a 1)`を戻す」という意味ではありません。

> 場合によっては、ラベルを使用せずにラムダ式から戻ることができます。このような*非ローカルな*戻りは、ラムダ内にありますが、囲み[インライン関数](inline-functions.md#returns)を終了します。
>
{style="note"}