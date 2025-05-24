---
title: "Null safety"
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types（基本型）</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections（コレクション）</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow（制御フロー）</a><br />
        <img src="/img/icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions（関数）</a><br />
        <img src="/img/icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes（クラス）</a><br />
        <img src="/img/icon-7.svg" width="20" alt="Final step" /> <strong>Null safety（Null安全性）</strong><br />
</p>

:::

Kotlin では、`null` 値を持つことが可能です。Kotlin は、何かが欠落している場合やまだ設定されていない場合に `null` 値を使用します。
[Collections](kotlin-tour-collections#kotlin-tour-map-no-key)の章で、map に存在しないキーを持つキーと値のペアにアクセスしようとしたときに、Kotlin が `null` 値を返す例をすでに見ています。このように `null` 値を使用することは便利ですが、コードが `null` 値を処理する準備ができていないと、問題が発生する可能性があります。

プログラムでの `null` 値に関する問題を回避するために、Kotlin には null safety（Null安全性）が実装されています。Null safety（Null安全性）は、`null` 値に関する潜在的な問題を、実行時ではなくコンパイル時に検出します。

Null safety（Null安全性）は、以下のことを可能にする機能の組み合わせです。

* プログラムで `null` 値が許可される場合を明示的に宣言する。
* `null` 値をチェックする。
* `null` 値を含む可能性のあるプロパティまたは関数に対して、安全な呼び出しを使用する。
* `null` 値が検出された場合に実行するアクションを宣言する。

## Nullable types（Nullable型）

Kotlin は nullable types（Nullable型）をサポートしており、宣言された型が `null` 値を持つ可能性を許容します。デフォルトでは、型は `null` 値を受け入れることが**許可されていません**。Nullable types（Nullable型）は、型宣言の後に `?` を明示的に追加することで宣言されます。

例：

```kotlin
fun main() {
    // neverNull は String 型を持ちます
    var neverNull: String = "This can't be null"

    // コンパイラエラーをスローします
    neverNull = null

    // nullable は nullable String 型を持ちます
    var nullable: String? = "You can keep a null here"

    // これは OK です
    nullable = null

    // デフォルトでは、null 値は受け入れられません
    var inferredNonNull = "The compiler assumes non-nullable"

    // コンパイラエラーをスローします
    inferredNonNull = null

    // notNull は null 値を受け入れません
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // コンパイラエラーをスローします
}
```

:::tip
`length` は、文字列内の文字数を含む [String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) クラスのプロパティです。

:::

## Check for null values（Null値の確認）

条件式内で `null` 値の存在を確認できます。次の例では、`describeString()` 関数に、`maybeString` が `null` **ではない** かどうか、およびその `length` が 0 より大きいかどうかをチェックする `if` ステートメントがあります。

```kotlin
fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "String of length ${maybeString.length}"
    } else {
        return "Empty or null string"
    }
}

fun main() {
    val nullString: String? = null
    println(describeString(nullString))
    // Empty or null string
}
```

## Use safe calls（安全な呼び出しの使用）

`null` 値を含む可能性のあるオブジェクトのプロパティに安全にアクセスするには、safe call（安全な呼び出し）演算子 `?.` を使用します。safe call（安全な呼び出し）演算子は、オブジェクトまたはアクセスされたプロパティのいずれかが `null` の場合、`null` を返します。これは、コード内で `null` 値の存在によってエラーが発生するのを避けたい場合に役立ちます。

次の例では、`lengthString()` 関数は safe call（安全な呼び出し）を使用して、文字列の長さまたは `null` のいずれかを返します。

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    val nullString: String? = null
    println(lengthString(nullString))
    // null
}
```

:::tip
safe call（安全な呼び出し）は、オブジェクトのプロパティに `null` 値が含まれている場合に、エラーをスローせずに `null` が返されるように、チェーン化できます。例：

```kotlin
  person.company?.address?.country
```

:::

safe call（安全な呼び出し）演算子は、拡張関数またはメンバー関数を安全に呼び出すためにも使用できます。この場合、関数が呼び出される前に null チェックが実行されます。チェックで `null` 値が検出された場合、呼び出しはスキップされ、`null` が返されます。

次の例では、`nullString` が `null` であるため、[`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) の呼び出しはスキップされ、`null` が返されます。

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.uppercase())
    // null
}
```

## Use Elvis operator（Elvis演算子の使用）

`null` 値が検出された場合に返すデフォルト値を、**Elvis operator（Elvis演算子）** `?:` を使用して指定できます。

Elvis operator（Elvis演算子）の左側に、`null` 値を確認するものを記述します。
Elvis operator（Elvis演算子）の右側に、`null` 値が検出された場合に返すものを記述します。

次の例では、`nullString` が `null` であるため、`length` プロパティにアクセスするための safe call（安全な呼び出し）は `null` 値を返します。
その結果、Elvis operator（Elvis演算子）は `0` を返します。

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
```

Kotlin の null safety（Null安全性）の詳細については、[Null safety（Null安全性）](null-safety)を参照してください。

## Practice（演習）

### Exercise（課題）

会社の従業員のデータベースにアクセスできる `employeeById` 関数があります。残念ながら、この関数は `Employee?` 型の値を返すため、結果は `null` になる可能性があります。あなたの目標は、`id` が提供されたときに従業員の給与を返す関数、または従業員がデータベースに存在しない場合は `0` を返す関数を作成することです。

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 `->` Employee("Mary", 20)
    2 `->` null
    3 `->` Employee("John", 21)
    4 `->` Employee("Ann", 23)
    else `->` null
}

fun salaryById(id: Int) = // Write your code here

fun main() {
    println((1..5).sumOf { id `->` salaryById(id) })
}
```

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 `->` Employee("Mary", 20)
    2 `->` null
    3 `->` Employee("John", 21)
    4 `->` Employee("Ann", 23)
    else `->` null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id `->` salaryById(id) })
}
```

## What's next?（次は？）

おめでとうございます！Kotlin ツアーを完了したので、人気のある Kotlin アプリケーションのチュートリアルをご覧ください。

* [バックエンドアプリケーションを作成する](jvm-create-project-with-spring-boot)
* [Android および iOS 用のクロスプラットフォームアプリケーションを作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)