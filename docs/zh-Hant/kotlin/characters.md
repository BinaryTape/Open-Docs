[//]: # (title: 字元)
[//]: # (description: 了解如何在 Kotlin 中使用 Char 型別，包括語法、Unicode 支援、轉義序列以及常見的字元操作。)

[`Char`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/) 型別將單個字元表示為一個 UTF-16 程式碼單元。

使用 `Char` 來表示單個字元值，例如字母、數字、標點符號或空白字元。對於字元序列，請使用 [`String`](strings.md)。

> `Char` 不是數值型別，但每個字元都有一個可以存取的數值 Unicode 值。
> 請參閱[](#character-conversion)。
> 
{style="tip"}

## 語法

若要宣告一個字元，請將該值括在單引號 (`' '`) 中。您可以明確指定 `Char` 型別，或讓 Kotlin 從值中進行推論：

```kotlin
val letter: Char = 'a'

// Kotlin 會推論為 Char，因為這些值是寫在單引號中的
val digit = '1'
val symbol = '!'
val space = ' '
val separator = ':'
```

字元常值必須正好包含一個字元。否則，Kotlin 編譯器會報錯：

```kotlin
val invalid = 'AB' // 錯誤
val invalidEmpty = '' // 錯誤
```
{validate="false"}

### 可為 Null 的值

若要儲存一個可為 null 的值，請使用 `Char?`：

```kotlin
val maybeAbsent: Char? = null
```

> 在 JVM 上，當需要時會對可為 null 的 `Char` 值進行裝箱 (boxed)。這同樣適用於
> [數值型別](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)。
>
{style="note"}

## Unicode 支援

Kotlin 將 `Char` 值表示為 UTF-16 程式碼單元。這意味著單個 `Char` 儲存的是一個 UTF-16 程式碼單元，而不一定是一個完整的 Unicode 字元。

### 基本多語言平面

單個 `Char` 可以儲存從 `\u0000` 到 `\uFFFF` 範圍內的值。
此範圍涵蓋了基本多語言平面 (Basic Multilingual Plane, BMP)，其中包括幾乎所有現代語言的字元以及大量的符號。

若要透過 Unicode 值指定字元，請使用 `\u` 後接來自 [Unicode 表](https://www.unicode.org/charts/) 的四位十六進制值：

```kotlin
val unicodeNumber = '\u0031' // 等於 '1'
```

### 增補字元

BMP 之外的 Unicode 字元（例如表情符號和某些古老文字）無法由單個 `Char` 表示。在 UTF-16 中，它們被編碼為一個 *代理對 (surrogate pair)*，其中兩個 `Char` 值在 `String` 中共同代表一個 Unicode 字元：

```kotlin
fun main() {
//sampleStart
    val emoji = "🥦"
    
    println(emoji.length) // 2
    println(emoji[0])     // 第一個代理
    println(emoji[1])     // 第二個代理
//sampleEnd
}
```

> 若要單獨處理 32 位元符號，請使用儲存為 `Int` 值的 Unicode 碼位 (code points)。
>
{style="tip"}

## 轉義序列

對於難以直接在原始碼中撰寫或具有特殊含義的特殊字元，請使用轉義序列。

每個轉義序列都以反斜線 (`\`) 開頭。

| **支援的序列** | **說明** | 
|------------------------|-----------------------|
| `\t`                   | Tab                   | 
| `\b`                   | Backspace             | 
| `
`                   | 換行 (LF)         | 
| `\r`                   | 歸位 (CR)  | 
| `\'`                   | 單引號 | 
| `\"`                   | 雙引號 |
| `\\`                   | 反斜線             | 
| `\$`                   | 美元符號           | 

例如：

```kotlin
val newLine = '
'
val dollar = '$'
val backslash = '\\'
```

## 操作

`Char` 支援比較、檢查、大小寫轉換以及明確的數值轉換。

### 字元比較

若要比較 `Char` 值，請使用標準的[比較運算子](keyword-reference.md#operators-and-special-symbols)，例如 `==`、`!=`、`<`、`>`、`<=` 和 `>=`。

Kotlin 透過字元的數值 Unicode 值進行比較，並回傳一個 `Boolean` 值：

```kotlin
val before = 'a' < 'b' // true
val after = 'c' > 'd' // false
val different = 'A' == 'a' // false 
val equal = 'A' == 'A' // true
```

### 字元處理

Kotlin 提供用於檢查字元值以及進行大小寫轉換的函式。例如：

```kotlin
fun main() {
//sampleStart
    val myChar = 'A'
    // 檢查該字元是否代表數字
    println(myChar.isDigit()) // false
    // 檢查該字元是否代表大寫字母
    println(myChar.isUpperCase()) // true
    // 回傳小寫版本
    println(myChar.lowercaseChar()) // 'a'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 在 [API 參考文件](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/)中進一步了解可用的函式。
>
{style="note"}

### 字元算術

您可以透過加上或減去一個整數來建立另一個字元值：

```kotlin
fun main() {
//sampleStart
    val a = 'a'

    println(a + 1)  // b
    println(a + 2)  // c
    println(a - 32) // A
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 這些操作遵循的是 Unicode 值，而非特定語言的字母表規則。
>
{style="note"}

您還可以在可變變數上使用遞增 (`++`) 和遞減 (`--`) 運算子的前綴與後綴形式：

```kotlin
fun main() {
//sampleStart
    var a = 'A'
    
    a += 10
    println(a)   // 'K'
    
    println(++a) // 'L'  前綴遞增
    println(a++) // 'L'  後綴遞增
    println(a)   // 'M'
    
    println(--a) // 'L'  前綴遞減
    println(a--) // 'L'  後綴遞減
    println(a)   // 'K'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 字元轉換

若要將 `Char` 轉換為數值型別，請使用明確轉換：

* 使用 `.code` 獲取字元的數值 Unicode 值：

  ```kotlin
  fun main() { 
  //sampleStart
      val letter = 'A'
      println(letter.code) // 65
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* 如果字元代表十進制數字，請使用 `digitToInt()`：
  ```kotlin
  fun main() { 
  //sampleStart
      val digit = '7'
      println(digit.digitToInt()) // 7
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

  > 如果字元可能不是有效的數字，請使用 `digitToIntOrNull()`。
  >
  {style="tip"}