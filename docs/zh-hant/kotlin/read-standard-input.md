---
title: 讀取標準輸入
---
使用 `readln()` 函式從標準輸入讀取資料。它會將整行讀取為字串：

```kotlin
// 讀取使用者輸入並將其儲存在變數中。例如：Hi there!
val myInput = readln()

println(myInput)
// Hi there!

// 讀取並印出使用者輸入，而不將其儲存在變數中。例如：Hi, Kotlin!
println(readln())
// Hi, Kotlin!
```

若要使用字串以外的資料類型，您可以使用轉換函式（例如 `.toInt()`、`.toLong()`、`.toDouble()`、`.toFloat()` 或 `.toBoolean()`）轉換輸入。
可以讀取不同資料類型的多個輸入，並將每個輸入儲存在變數中：

```kotlin
// 將輸入從字串轉換為整數值。例如：12
val myNumber = readln().toInt()
println(myNumber)
// 12

// 將輸入從字串轉換為 Double 值。例如：345
val myDouble = readln().toDouble()
println(myDouble)
// 345.0

// 將輸入從字串轉換為布林值。例如：true
val myBoolean = readln().toBoolean()
println(myBoolean)
// true
```

這些轉換函式假設使用者輸入目標資料類型的有效表示式。 例如，使用 `.toInt()` 將 "hello" 轉換為整數會導致例外，因為該函式預期字串輸入中為數字。

若要讀取由分隔符號分隔的數個輸入元素，請使用 `.split()` 函式並指定分隔符號。 以下程式碼範例從標準輸入讀取、根據分隔符號將輸入分割為元素清單，並將清單的每個元素轉換為特定類型：

```kotlin
// 讀取輸入，假設元素由空格分隔，並將其轉換為整數。 例如：1 2 3
val numbers = readln().split(' ').map { it.toInt() }
println(numbers)
//[1, 2, 3]

// 讀取輸入，假設元素由逗號分隔，並將其轉換為 Double。 例如：4,5,6
val doubles = readln().split(',').map { it.toDouble() }
println(doubles)
//[4.0, 5.0, 6.0]
```

:::note
如需在 Kotlin/JVM 中讀取使用者輸入的另一種方法，請參閱 [Standard input with Java Scanner](standard-input)。

:::

## 安全地處理標準輸入

您可以使用 `.toIntOrNull()` 函式安全地將使用者輸入從字串轉換為整數。 如果轉換成功，此函式會傳回一個整數。 但是，如果輸入不是整數的有效表示式，它會傳回 `null`：

```kotlin
// 如果輸入無效，則傳回 null。 例如：Hello!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 將有效輸入從字串轉換為整數。 例如：13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

`readlnOrNull()` 函式也有助於安全地處理使用者輸入。 `readlnOrNull()` 函式從標準輸入讀取，如果到達輸入的結尾，則傳回 null，而 `readln()` 在這種情況下會擲回例外。
```