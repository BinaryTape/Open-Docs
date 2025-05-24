---
title: リターンとジャンプ
---
Kotlinには、3つの構造的なジャンプ式があります。

* `return` は、デフォルトで、最も内側の関数または[無名関数](lambdas#anonymous-functions)から戻ります。
* `break` は、最も内側のループを終了させます。
* `continue` は、最も内側のループの次のステップに進みます。

これらの式はすべて、より大きな式の一部として使用できます。

```kotlin
val s = person.name ?: return
```

これらの式の型は、[Nothing型](exceptions#the-nothing-type)です。

## Breakとcontinueのラベル

Kotlinの任意の式には、_ラベル_を付けることができます。
ラベルの形式は、`abc@` や `fooBar@` のように、識別子の後に `@` 記号が続くものです。
式にラベルを付けるには、その前にラベルを追加するだけです。

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

これで、`break` または `continue` をラベルで修飾できます。

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

ラベルで修飾された `break` は、そのラベルでマークされたループの直後の実行ポイントにジャンプします。
`continue` は、そのループの次のイテレーションに進みます。

:::note
場合によっては、ラベルを明示的に定義せずに、*非ローカル*に `break` と `continue` を適用できます。
このような非ローカルな使用は、囲み[インライン関数](inline-functions#break-and-continue)で使用されるラムダ式で有効です。

:::

## ラベルへのReturn

Kotlinでは、関数リテラル、ローカル関数、およびオブジェクト式を使用して関数をネストできます。
修飾された `return` を使用すると、外側の関数から戻ることができます。

最も重要なユースケースは、ラムダ式から戻ることです。ラムダ式から戻るには、
ラベルを付けて `return` を修飾します。

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // ラムダの呼び出し元（forEachループ）へのローカルリターン
        print(it)
    }
    print(" done with explicit label")
}

fun main() {
    foo()
}
```

これで、ラムダ式からのみ戻ります。多くの場合、_暗黙的なラベル_を使用する方が便利です。このようなラベルは、
ラムダが渡される関数と同じ名前を持つためです。

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // ラムダの呼び出し元（forEachループ）へのローカルリターン
        print(it)
    }
    print(" done with implicit label")
}

fun main() {
    foo()
}
```

または、ラムダ式を[無名関数](lambdas#anonymous-functions)に置き換えることもできます。
無名関数の `return` ステートメントは、無名関数自体から戻ります。

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 無名関数の呼び出し元（forEachループ）へのローカルリターン
        print(value)
    })
    print(" done with anonymous function")
}

fun main() {
    foo()
}
```

前の3つの例でのローカルリターンの使用は、通常のループでの `continue` の使用と似ていることに注意してください。

`break` に直接相当するものはありませんが、別のネストされたラムダを追加し、そこから非ローカルに戻ることによってシミュレートできます。

```kotlin

fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // runに渡されたラムダからの非ローカルリターン
            print(it)
        }
    }
    print(" done with nested loop")
}

fun main() {
    foo()
}
```

値を返す場合、パーサーは修飾されたreturnを優先します。

```kotlin
return@a 1
```

これは、「ラベル `@a` で `1` を返す」という意味であり、「ラベル付きの式 `(@a 1)` を返す」という意味ではありません。

:::note
場合によっては、ラベルを使用せずにラムダ式から戻ることができます。このような *非ローカル* リターンは、
ラムダ内にありますが、囲み[インライン関数](inline-functions#returns)を終了します。

:::