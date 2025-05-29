[//]: # (title: 標準入力の読み取り)

`readln()` 関数を使用して標準入力からデータを読み取ります。この関数は行全体を文字列として読み取ります。

```kotlin
// ユーザー入力を読み込み、変数に格納します。例: Hi there!
val myInput = readln()

println(myInput)
// Hi there!

// ユーザー入力を変数に格納せずに読み込み、出力します。例: Hi, Kotlin!
println(readln())
// Hi, Kotlin!
```

文字列以外のデータ型を扱うには、`.toInt()`、`.toLong()`、`.toDouble()`、`.toFloat()`、`.toBoolean()` のような変換関数を使用して入力を変換できます。
異なるデータ型の複数の入力を読み取り、それぞれの入力を変数に格納することが可能です。

```kotlin
// 入力を文字列から整数値に変換します。例: 12
val myNumber = readln().toInt()
println(myNumber)
// 12

// 入力を文字列からdouble値に変換します。例: 345 
val myDouble = readln().toDouble()
println(myDouble)
// 345.0

// 入力を文字列から真偽値に変換します。例: true
val myBoolean = readln().toBoolean()
println(myBoolean)
// true
```

これらの変換関数は、ユーザーがターゲットデータ型の有効な表現を入力することを想定しています。例えば、"hello" を `.toInt()` を使用して整数に変換しようとすると、この関数は文字列入力に数値を期待しているため、例外が発生します。

区切り文字で区切られた複数の入力要素を読み取るには、区切り文字を指定して `.split()` 関数を使用します。以下のコード例は、標準入力から読み取り、区切り文字に基づいて入力を要素のリストに分割し、リストの各要素を特定の型に変換します。

```kotlin
// 要素がスペースで区切られていると仮定して入力を読み込み、整数に変換します。例: 1 2 3 
val numbers = readln().split(' ').map { it.toInt() }
println(numbers)
//[1, 2, 3] 

// 要素がカンマで区切られていると仮定して入力を読み込み、doubleに変換します。例: 4,5,6
val doubles = readln().split(',').map { it.toDouble() }
println(doubles)
//[4.0, 5.0, 6.0]
```

> Kotlin/JVMでユーザー入力を読み取る別の方法については、[Standard input with Java Scanner](standard-input.md) を参照してください。
>
{style="note"}

## 標準入力を安全に処理する

`.toIntOrNull()` 関数を使用すると、ユーザー入力を文字列から整数へ安全に変換できます。この関数は、変換が成功した場合は整数を返します。しかし、入力が整数の有効な表現ではない場合、`null` を返します。

```kotlin
// 入力が無効な場合、nullを返します。例: Hello!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 有効な入力を文字列から整数に変換します。例: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

`readlnOrNull()` 関数も、ユーザー入力を安全に処理するのに役立ちます。`readlnOrNull()` 関数は標準入力から読み込み、入力の終わりに達した場合に null を返しますが、`readln()` はそのような場合に例外をスローします。