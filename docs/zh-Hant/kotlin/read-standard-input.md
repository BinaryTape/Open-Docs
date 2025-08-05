[//]: # (title: 讀取標準輸入)

使用 `readln()` 函式從標準輸入讀取資料。它將整行內容讀取為字串：

```kotlin
// 讀取使用者輸入並將其儲存在變數中。例如：Hi there!
val myInput = readln()

println(myInput)
// Hi there!

// 讀取並列印使用者輸入，而不將其儲存在變數中。例如：Hi, Kotlin!
println(readln())
// Hi, Kotlin!
```

若要處理字串以外的資料型別，您可以使用 `.toInt()`、`.toLong()`、`.toDouble()`、`.toFloat()` 或 `.toBoolean()` 等轉換函式來轉換輸入。
可以讀取多個不同資料型別的輸入，並將每個輸入儲存在一個變數中：

```kotlin
// 將輸入從字串轉換為整數值。例如：12
val myNumber = readln().toInt()
println(myNumber)
// 12

// 將輸入從字串轉換為雙精度浮點數值。例如：345 
val myDouble = readln().toDouble()
println(myDouble)
// 345.0

// 將輸入從字串轉換為布林值。例如：true
val myBoolean = readln().toBoolean()
println(myBoolean)
// true
```

這些轉換函式假設使用者輸入目標資料型別的有效表示。例如，使用 `.toInt()` 將 "hello" 轉換為整數將導致例外狀況，因為該函式期望字串輸入中包含數字。

若要讀取由分隔符號 (delimiter) 分隔的多個輸入元素，請使用 `.split()` 函式並指定分隔符號。以下程式碼範例從標準輸入讀取內容，根據分隔符號將輸入分割成元素列表，並將列表中的每個元素轉換為特定型別：

```kotlin
// 讀取輸入，假設元素以空格分隔，並將其轉換為整數。例如：1 2 3 
val numbers = readln().split(' ').map { it.toInt() }
println(numbers)
//[1, 2, 3] 

// 讀取輸入，假設元素以逗號分隔，並將其轉換為雙精度浮點數。例如：4,5,6
val doubles = readln().split(',').map { it.toDouble() }
println(doubles)
//[4.0, 5.0, 6.0]
```

> 如需在 Kotlin/JVM 中讀取使用者輸入的替代方法，請參閱 [使用 Java Scanner 進行標準輸入](standard-input.md)。
>
{style="note"}

## 安全地處理標準輸入

您可以使用 `.toIntOrNull()` 函式將使用者輸入從字串安全地轉換為整數。如果轉換成功，此函式會回傳一個整數。然而，如果輸入不是整數的有效表示，它會回傳 `null`：

```kotlin
// 如果輸入無效，則回傳 null。例如：Hello!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 將有效輸入從字串轉換為整數。例如：13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

`readlnOrNull()` 函式在安全處理使用者輸入方面也很有用。`readlnOrNull()` 函式從標準輸入讀取，如果到達輸入的末尾則回傳 null，而 `readln()` 在這種情況下會拋出例外狀況。