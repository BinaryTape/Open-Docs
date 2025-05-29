[//]: # (title: returnとジャンプ)

Kotlinには、3つの構造的なジャンプ式があります。

*   `return`は、デフォルトで最も近い囲んでいる関数または[匿名関数](lambdas.md#anonymous-functions)から戻ります。
*   `break`は、最も近い囲んでいるループを終了します。
*   `continue`は、最も近い囲んでいるループの次のステップに進みます。

これらの式はすべて、より大きな式の一部として使用できます。

```kotlin
val s = person.name ?: return
```

これらの式の型は、[Nothing型](exceptions.md#the-nothing-type)です。

## breakとcontinueのラベル

Kotlinのどのような式でも、_ラベル_でマークできます。
ラベルは、`abc@`や`fooBar@`のように、識別子に`@`記号を続けた形式をとります。
式にラベルを付けるには、その前にラベルを追加するだけです。

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

> 特定の場合では、明示的にラベルを定義しなくても、`break`と`continue`を*非ローカルに*適用できます。
> そのような非ローカルな使用は、囲んでいる[インライン関数](inline-functions.md#break-and-continue)で使用されるラムダ式で有効です。
>
{style="note"}

## returnのラベル

Kotlinでは、関数リテラル、ローカル関数、およびオブジェクト式を使用して関数をネストできます。
修飾された`return`を使用すると、外側の関数から戻ることができます。

最も重要なユースケースは、ラムダ式からの戻りです。ラムダ式から戻るには、それにラベルを付け、`return`を修飾します。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // ラムダの呼び出し元（forEachループ）へのローカルreturn
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

これにより、ラムダ式からのみ戻ります。多くの場合、そのようなラベルはラムダが渡される関数と同じ名前を持つため、_暗黙のラベル_を使用する方が便利です。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // ラムダの呼び出し元（forEachループ）へのローカルreturn
        print(it)
    }
    print(" done with implicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

あるいは、ラムダ式を[匿名関数](lambdas.md#anonymous-functions)に置き換えることもできます。
匿名関数内の`return`文は、匿名関数自体から戻ります。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 匿名関数の呼び出し元（forEachループ）へのローカルreturn
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

前の3つの例でのローカルreturnの使用は、通常のループでの`continue`の使用に似ていることに注意してください。

`break`に直接相当するものはありませんが、別のネストされたラムダを追加し、そこから非ローカルに戻ることでシミュレートできます。

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // runに渡されたラムダからの非ローカルreturn
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

値を返す場合、パーサーは修飾された`return`を優先します。

```kotlin
return@a 1
```

これは、「ラベル`@a`で`1`を返す」という意味であり、「ラベル付き式`(@a 1)`を返す」という意味ではありません。

> 特定の場合では、ラベルを使用せずにラムダ式から戻ることができます。そのような*非ローカルな*returnは、ラムダ内にありますが、囲んでいる[インライン関数](inline-functions.md#returns)を終了します。
>
{style="note"}