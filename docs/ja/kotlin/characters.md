[//]: # (title: 文字)
[//]: # (description: KotlinでのChar型の使用方法について、構文、Unicodeサポート、エスケープシーケンス、文字に対する一般的な操作などを学びます。)

[`Char`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/) 型は、単一の文字を UTF-16 コードユニットとして表します。

文字、数字、句読点、空白などの個別の文字値には `Char` を使用します。一連の文字（文字列）には [`String`](strings.md) を使用してください。

> `Char` は数値型ではありませんが、各文字にはアクセス可能な数値の Unicode 値があります。
> [](#character-conversion) を参照してください。
> 
{style="tip"}

## 構文

文字を宣言するには、値をシングルクォート (`' '`) で囲みます。`Char` 型を明示的に指定することも、Kotlin に値から推論させることもできます：

```kotlin
val letter: Char = 'a'

// Kotlin は値がシングルクォートで記述されているため、Char であると推論します
val digit = '1'
val symbol = '!'
val space = ' '
val separator = ':'
```

文字リテラルには、ちょうど1つの文字が含まれている必要があります。そうでない場合、Kotlin コンパイラはエラーを報告します：

```kotlin
val invalid = 'AB' // エラー
val invalidEmpty = '' // エラー
```
{validate="false"}

### Null 許容値

Null 許容値を格納するには、`Char?` を使用します：

```kotlin
val maybeAbsent: Char? = null
```

> JVM 上では、必要に応じて Null 許容な `Char` 値はボックス化されます。これは
> [数値型](numbers.md#boxing-and-caching-numbers-on-the-jvm)にも当てはまります。
>
{style="note"}

## Unicode サポート

Kotlin は `Char` 値を UTF-16 コードユニットとして表します。これは、単一の `Char` が1つの UTF-16 コードユニットを格納することを意味し、必ずしも1つの完全な Unicode 文字であるとは限りません。

### 基本多言語面 (BMP)

単一の `Char` は、`\u0000` から `\uFFFF` の範囲の値を格納できます。
この範囲は、ほぼすべての現代の言語の文字と膨大な数の記号を含む基本多言語面 (BMP) をカバーしています。

Unicode 値で文字を指定するには、`\u` の後に [Unicode 一覧表](https://www.unicode.org/charts/) から取得した4桁の16進数値を続けます：

```kotlin
val unicodeNumber = '\u0031' // '1' と等価
```

### 追加文字

絵文字や一部の歴史的な文字など、BMP 以外の Unicode 文字は、単一の `Char` で表すことができません。UTF-16 では、これらは *サロゲートペア*（surrogate pair）としてエンコードされ、2つの `Char` 値が組み合わさって `String` 内の1つの Unicode 文字を表します。

```kotlin
fun main() {
//sampleStart
    val emoji = "🥦"
    
    println(emoji.length) // 2
    println(emoji[0])     // 最初のサロゲート
    println(emoji[1])     // 2番目のサロゲート
//sampleEnd
}
```

> 32ビットの記号を個別に扱うには、`Int` 値として格納された Unicode コードポイントを使用してください。
>
{style="tip"}

## エスケープシーケンス

ソースコードに直接記述するのが難しい、または特別な意味を持つ特殊文字には、エスケープシーケンスを使用します。

すべてのエスケープシーケンスはバックスラッシュ (`\`) で始まります。

| **サポートされているシーケンス** | **説明**                | 
|------------------------|-----------------------|
| `\t`                   | タブ                    | 
| `\b`                   | バックスペース             | 
| `
`                   | 改行 (LF)               | 
| `\r`                   | 復帰 (CR)               | 
| `\'`                   | シングルクォーテーション       | 
| `\"`                   | ダブルクォーテーション       |
| `\\`                   | バックスラッシュ             | 
| `\$`                   | ドル記号                  | 

例：

```kotlin
val newLine = '
'
val dollar = '\$'
val backslash = '\\'
```

## 操作

`Char` は、比較、検査、大文字・小文字の変換、および明示的な数値変換をサポートしています。

### 文字の比較

`Char` 値を比較するには、`==`、`!=`、`<`、`>`、`<=`、`>=` などの標準的な [比較演算子](keyword-reference.md#operators-and-special-symbols) を使用します。

Kotlin は `Char` 値をその数値 Unicode 値で比較し、`Boolean` 値を返します：

```kotlin
val before = 'a' < 'b' // true
val after = 'c' > 'd' // false
val different = 'A' == 'a' // false 
val equal = 'A' == 'A' // true
```

### 文字の処理

Kotlin は、文字値の検査や大文字・小文字の変換のための関数を提供しています。
例えば：

```kotlin
fun main() {
//sampleStart
    val myChar = 'A'
    // 文字が数字であるかチェックする
    println(myChar.isDigit()) // false
    // 文字が大文字であるかチェックする
    println(myChar.isUpperCase()) // true
    // 小文字バージョンを返す
    println(myChar.lowercaseChar()) // 'a'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 利用可能な関数の詳細については、
> [API リファレンス](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/) を参照してください。
>
{style="note"}

### 文字の算術演算

整数を加算または減算することで、別の文字値を作成できます：

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

> これらの操作は、言語固有のアルファベット規則ではなく、Unicode 値に従います。
>
{style="note"}

ミュータブル（可変）な変数に対して、インクリメント (`++`) およびデクリメント (`--`) 演算子を前置および後置形式で使用することもできます：

```kotlin
fun main() {
//sampleStart
    var a = 'A'
    
    a += 10
    println(a)   // 'K'
    
    println(++a) // 'L'  前置インクリメント
    println(a++) // 'L'  後置インクリメント
    println(a)   // 'M'
    
    println(--a) // 'L'  前置デクリメント
    println(a--) // 'L'  後置デクリメント
    println(a)   // 'K'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 文字の変換

`Char` を数値型に変換するには、明示的な変換を使用します：

* 文字の数値 Unicode 値を取得するには `.code` を使用します：

  ```kotlin
  fun main() { 
  //sampleStart
      val letter = 'A'
      println(letter.code) // 65
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* 文字が 10 進数字を表している場合は、`digitToInt()` を使用します：
  ```kotlin
  fun main() { 
  //sampleStart
      val digit = '7'
      println(digit.digitToInt()) // 7
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

  > 文字が有効な数字でない可能性がある場合は、`digitToIntOrNull()` を使用してください。
  >
  {style="tip"}