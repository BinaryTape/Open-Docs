---
title: 標準入力を読み込む
---
`readln()`関数を使用すると、標準入力からデータを読み取ることができます。これは、行全体を文字列として読み取ります。

```kotlin
// ユーザー入力を読み取り、変数に格納します。例: Hi there!
val myInput = readln()

println(myInput)
// Hi there!

// ユーザー入力を変数に格納せずに読み取って表示します。例: Hi, Kotlin!
println(readln())
// Hi, Kotlin!
```

文字列以外のデータ型を扱うには、`.toInt()`、`.toLong()`、`.toDouble()`、`.toFloat()`、または`.toBoolean()`のような変換関数を使用して入力を変換できます。
異なるデータ型の複数の入力を読み取り、各入力を変数に格納することも可能です。

```kotlin
// 入力を文字列から整数値に変換します。例: 12
val myNumber = readln().toInt()
println(myNumber)
// 12

// 入力を文字列からdouble値に変換します。例: 345
val myDouble = readln().toDouble()
println(myDouble)
// 345.0

// 入力を文字列からboolean値に変換します。例: true
val myBoolean = readln().toBoolean()
println(myBoolean)
// true
```

これらの変換関数は、ユーザーがターゲットデータ型の有効な表現を入力することを前提としています。たとえば、`.toInt()`を使用して"hello"を整数に変換すると、関数は文字列入力で数値を期待するため、例外が発生します。

区切り文字で区切られた複数の入力要素を読み取るには、区切り文字を指定して`.split()`関数を使用します。次のコードサンプルは、標準入力から読み取り、区切り文字に基づいて入力を要素のリストに分割し、リストの各要素を特定の型に変換します。

```kotlin
// 入力を読み取り、要素がスペースで区切られていると仮定して、それらを整数に変換します。例: 1 2 3
val numbers = readln().split(' ').map { it.toInt() }
println(numbers)
//[1, 2, 3]

// 入力を読み取り、要素がコンマで区切られていると仮定して、それらをdoubleに変換します。例: 4,5,6
val doubles = readln().split(',').map { it.toDouble() }
println(doubles)
//[4.0, 5.0, 6.0]
```

:::note
Kotlin/JVMでユーザー入力を読み取る別の方法については、[Standard input with Java Scanner](standard-input)を参照してください。

:::

## 標準入力を安全に処理する

`.toIntOrNull()`関数を使用すると、ユーザー入力を文字列から整数に安全に変換できます。この関数は、変換が成功した場合に整数を返します。ただし、入力が整数の有効な表現でない場合は、`null`を返します。

```kotlin
// 入力が無効な場合はnullを返します。例: Hello!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 有効な入力を文字列から整数に変換します。例: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

`readlnOrNull()`関数も、ユーザー入力を安全に処理するのに役立ちます。`readlnOrNull()`関数は標準入力から読み取り、入力の終わりに達した場合はnullを返します。一方、`readln()`はそのような場合に例外をスローします。