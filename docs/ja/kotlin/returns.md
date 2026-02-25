[//]: # (title: リターンとジャンプ)

Kotlinには3つの構造的なジャンプ式（jump expressions）があります。

* `return`: デフォルトでは、最も内側の囲んでいる関数または[匿名関数](lambdas.md#anonymous-functions)から戻ります。
* `break`: 最も内側の囲んでいるループを終了します。
* `continue`: 最も内側の囲んでいるループの次のステップに進みます。

これらの式はすべて、より大きな式の一部として使用できます。

```kotlin
val s = person.name ?: return
```

これらの式の型は[Nothing型](exceptions.md#the-nothing-type)です。

## Breakとcontinueのラベル

Kotlinの任意の式には*ラベル*（label）を付けることができます。
ラベルは、`abc@` や `fooBar@` のように、識別子の後に `@` 記号が付いた形式です。
式にラベルを付けるには、式の前にラベルを追加するだけです。

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

これで、ラベルを指定して `break` や `continue` を使用できるようになります。

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

ラベルが指定された `break` は、そのラベルが付いたループの直後の実行ポイントまでジャンプします。
`continue` は、そのループの次のイテレーション（反復）に進みます。

> 場合によっては、ラベルを明示的に定義せずに *非局所的*（non-locally）に `break` や `continue` を適用できることがあります。このような非局所的な使用法は、囲んでいる[インライン関数](inline-functions.md#break-and-continue)で使用されるラムダ式内で有効です。
>
{style="note"}

## ラベルへのリターン

Kotlinでは、関数リテラル、ローカル関数、オブジェクト式を使用して関数をネストできます。
ラベル指定された `return` を使用すると、外側の関数から戻ることができます。

最も重要なユースケースは、ラムダ式からのリターンです。ラムダ式から戻るには、ラベルを付けて `return` を修飾します。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // ラムダの呼び出し元（forEachループ）への局所的なリターン
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

これにより、ラムダ式からのみ戻るようになります。多くの場合、*暗黙的なラベル*（implicit labels）を使用する方が便利です。そのようなラベルは、ラムダが渡される関数と同じ名前になります。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // ラムダの呼び出し元（forEachループ）への局所的なリターン
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
匿名関数内の `return` 文は、その匿名関数自体から戻ります。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 匿名関数の呼び出し元（forEachループ）への局所的なリターン
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

前述の3つの例における局所的なリターンの使用は、通常のループにおける `continue` の使用に似ていることに注意してください。

`break` に直接相当するものはありませんが、外側に `run` ラムダを追加し、そこから非局所的にリターンすることでシミュレートできます。

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // runに渡されたラムダからの非局所的なリターン
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

ここでの非局所的なリターンは、ネストされた `forEach()` ラムダが[インライン関数](inline-functions.md)として動作するため可能です。

値を返す際、パーサーはラベル指定されたリターンを優先します。

```kotlin
return@a 1
```

これは「ラベル `@a` に `1` を返す」という意味であり、「ラベル付きの式 `(@a 1)` を返す」という意味ではありません。

> 場合によっては、ラベルを使用せずにラムダ式から戻ることができます。このような *非局所的*（non-local）なリターンは、ラムダ内に配置されますが、それを囲んでいる[インライン関数](inline-functions.md#returns)を終了します。
>
{style="note"}