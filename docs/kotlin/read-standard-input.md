---
title: "Read standard input"
---
使用 `readln()` 函数从标准输入读取数据。它将整行读取为字符串：

```kotlin
// 读取用户输入并将其存储在变量中。例如：Hi there!
val myInput = readln()

println(myInput)
// Hi there!

// 读取并打印用户输入，而不将其存储在变量中。例如：Hi, Kotlin!
println(readln())
// Hi, Kotlin!
```

要处理字符串以外的数据类型，可以使用转换函数（如 `.toInt()`、`.toLong()`、`.toDouble()`、`.toFloat()` 或 `.toBoolean()`）转换输入。可以读取不同数据类型的多个输入，并将每个输入存储在变量中：

```kotlin
// 将输入从字符串转换为整数值。例如：12
val myNumber = readln().toInt()
println(myNumber)
// 12

// 将输入从字符串转换为双精度浮点数值。例如：345
val myDouble = readln().toDouble()
println(myDouble)
// 345.0

// 将输入从字符串转换为布尔值。例如：true
val myBoolean = readln().toBoolean()
println(myBoolean)
// true
```

这些转换函数假设用户输入的是目标数据类型的有效表示形式。例如，使用 `.toInt()` 将 "hello" 转换为整数会导致异常，因为该函数期望字符串输入中包含数字。

要读取由分隔符分隔的多个输入元素，请使用 `.split()` 函数并指定分隔符。以下代码示例从标准输入读取数据，根据分隔符将输入拆分为元素列表，并将列表的每个元素转换为特定类型：

```kotlin
// 读取输入，假设元素由空格分隔，并将它们转换为整数。例如：1 2 3
val numbers = readln().split(' ').map { it.toInt() }
println(numbers)
//[1, 2, 3]

// 读取输入，假设元素由逗号分隔，并将它们转换为双精度浮点数。例如：4,5,6
val doubles = readln().split(',').map { it.toDouble() }
println(doubles)
//[4.0, 5.0, 6.0]
```

:::note
有关在 Kotlin/JVM 中读取用户输入的另一种方法，请参阅 [Standard input with Java Scanner](standard-input)。

:::

## 安全地处理标准输入

可以使用 `.toIntOrNull()` 函数安全地将用户输入从字符串转换为整数。如果转换成功，此函数将返回一个整数。但是，如果输入不是整数的有效表示形式，则返回 `null`：

```kotlin
// 如果输入无效，则返回 null。例如：Hello!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 将有效的输入从字符串转换为整数。例如：13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

`readlnOrNull()` 函数也有助于安全地处理用户输入。 `readlnOrNull()` 函数从标准输入读取数据，如果到达输入的末尾则返回 null，而 `readln()` 在这种情况下会抛出异常。