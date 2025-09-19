[//]: # (title: ヌル安全)

ヌル安全 (Null safety) は、[10億ドルの過ち (The Billion-Dollar Mistake)](https://en.wikipedia.org/wiki/Null_pointer#History) とも呼ばれるヌル参照のリスクを大幅に軽減するために設計されたKotlinの機能です。

Javaを含む多くのプログラミング言語における最も一般的な落とし穴の1つは、ヌル参照のメンバーにアクセスするとヌル参照例外が発生することです。Javaでは、これは `NullPointerException`、または略して *NPE* に相当します。

Kotlinは、型システムの一部としてヌル許容性 (nullability) を明示的にサポートしており、どの変数やプロパティが`null`を許容するかを明示的に宣言できます。また、非ヌル許容変数を宣言すると、コンパイラはこれらの変数が`null`値を保持できないように強制し、NPEを防止します。

Kotlinのヌル安全は、潜在的なヌル関連の問題を実行時ではなくコンパイル時に捕捉することで、より安全なコードを保証します。この機能は、`null`値を明示的に表現することでコードの堅牢性、可読性、保守性を向上させ、コードを理解し管理しやすくします。

KotlinでNPEが発生する唯一の可能性のある原因は次のとおりです。

*   [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)への明示的な呼び出し。
*   [非ヌルアサーション演算子 `!!`](#not-null-assertion-operator)の使用。
*   初期化中のデータ不整合、例えば次のような場合:
    *   コンストラクタで利用可能な未初期化の `this` が他の場所で使用される場合 ([「thisのリーク (a "leaking `this`")」](https://youtrack.jetbrains.com/issue/KTIJ-9751))。
    *   [スーパークラスのコンストラクタがオープンメンバーを呼び出す](inheritance.md#derived-class-initialization-order)場合で、派生クラスでのその実装が未初期化の状態を使用している場合。
*   Javaとの相互運用:
    *   [プラットフォーム型 (platform type)](java-interop.md#null-safety-and-platform-types)の`null`参照のメンバーにアクセスしようとすること。
    *   ジェネリック型に関するヌル許容性の問題。例えば、JavaコードがKotlinの`MutableList<String>`に`null`を追加するような場合で、これを適切に処理するには`MutableList<String?>`が必要となるでしょう。
    *   外部のJavaコードによって引き起こされるその他の問題。

> NPEの他に、ヌル安全に関連するもう1つの例外は [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/) です。Kotlinは、初期化されていないプロパティにアクセスしようとしたときにこの例外をスローし、非ヌル許容プロパティが準備できるまで使用されないことを保証します。これは通常、[`lateinit`プロパティ](properties.md#late-initialized-properties-and-variables)で発生します。
>
{style="tip"}

## ヌル許容型と非ヌル許容型

Kotlinでは、型システムは`null`を保持できる型 (ヌル許容型) と保持できない型 (非ヌル許容型) を区別します。例えば、通常の`String`型の変数は`null`を保持できません。

```kotlin
fun main() {
//sampleStart
    // 非ヌル文字列を変数に代入します
    var a: String = "abc"
    // 非ヌル許容変数にnullを再代入しようとします
    a = null
    print(a)
    // Null can not be a value of a non-null type String
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

`a`に対してメソッドを安全に呼び出したり、プロパティにアクセスしたりできます。`a`は非ヌル許容変数であるため、NPEを引き起こさないことが保証されています。コンパイラは`a`が常に有効な`String`値を保持することを保証するため、`null`のときにそのプロパティやメソッドにアクセスするリスクはありません。

```kotlin
fun main() {
//sampleStart
    // 非ヌル文字列を変数に代入します
    val a: String = "abc"
    // 非ヌル許容変数の長さを返します
    val l = a.length
    print(l)
    // 3
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

`null`値を許可するには、変数型の直後に`?`記号を付けて変数を宣言します。例えば、`String?`と記述することでヌル許容文字列を宣言できます。この表現により`String`は`null`を受け入れられる型になります。

```kotlin
fun main() {
//sampleStart
    // ヌル許容文字列を変数に代入します
    var b: String? = "abc"
    // ヌル許容変数にnullを正常に再代入します
    b = null
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

`b`で`length`に直接アクセスしようとすると、コンパイラはエラーを報告します。これは、`b`がヌル許容変数として宣言されており、`null`値を保持できるためです。ヌル許容型でプロパティに直接アクセスしようとすると、NPEが発生します。

```kotlin
fun main() {
//sampleStart
    // ヌル許容文字列を変数に代入します
    var b: String? = "abc"
    // ヌル許容変数にnullを再代入します
    b = null
    // ヌル許容変数の長さを直接返そうとします
    val l = b.length
    print(l)
    // Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String? 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

上記の例では、コンパイラはプロパティにアクセスしたり操作を実行したりする前に、ヌル許容性をチェックするために安全な呼び出しを使用することを要求します。ヌル許容型を処理するにはいくつかの方法があります。

*   [ `if`条件式による`null`チェック](#check-for-null-with-the-if-conditional)
*   [安全呼び出し演算子 `?.`](#safe-call-operator)
*   [エルビス演算子 `?:`](#elvis-operator)
*   [非ヌルアサーション演算子 `!!`](#not-null-assertion-operator)
*   [ヌル許容レシーバー](#nullable-receiver)
*   [ `let`関数](#let-function)
*   [安全なキャスト `as?`](#safe-casts)
*   [ヌル許容型のコレクション](#collections-of-a-nullable-type)

`null`処理のツールとテクニックの詳細と例については、次のセクションをお読みください。

## `if`条件式による`null`チェック

ヌル許容型を扱う場合、NPEを避けるためにヌル許容性を安全に処理する必要があります。これを処理する1つの方法は、`if`条件式を使ってヌル許容性を明示的にチェックすることです。

例えば、`b`が`null`かどうかをチェックし、それから`b.length`にアクセスします。

```kotlin
fun main() {
//sampleStart
    // ヌル許容変数にnullを代入します
    val b: String? = null
    // 最初にヌル許容性をチェックし、それから長さにアクセスします
    val l = if (b != null) b.length else -1
    print(l)
    // -1
//sampleEnd
}
```
{kotlin-runnable="true"}

上記の例では、コンパイラは[スマートキャスト (smart cast)](typecasts.md#smart-casts)を実行し、ヌル許容の`String?`型を非ヌル許容の`String`型に変更します。また、実行したチェックに関する情報を追跡し、`if`条件式内で`length`への呼び出しを許可します。

より複雑な条件もサポートされています。

```kotlin
fun main() {
//sampleStart
    // ヌル許容文字列を変数に代入します
    val b: String? = "Kotlin"

    // 最初にヌル許容性をチェックし、それから長さにアクセスします
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
        // String of length 6
    } else {
        // 条件が満たされない場合の代替を提供します
        print("Empty string")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

上記の例は、[スマートキャストの前提条件](typecasts.md#smart-cast-prerequisites)と同じく、コンパイラがチェックから使用までの間に`b`が変更されないことを保証できる場合にのみ機能することに注意してください。

## 安全呼び出し演算子

安全呼び出し演算子 `?.` を使用すると、より短い形式でヌル許容性を安全に処理できます。NPEをスローする代わりに、オブジェクトが`null`の場合、`?.`演算子は単に`null`を返します。

```kotlin
fun main() {
//sampleStart
    // ヌル許容文字列を変数に代入します
    val a: String? = "Kotlin"
    // ヌル許容変数にnullを代入します
    val b: String? = null
    
    // ヌル許容性をチェックし、長さまたはnullを返します
    println(a?.length)
    // 6
    println(b?.length)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

`b?.length`という式はヌル許容性をチェックし、`b`が非ヌルであれば`b.length`を返し、そうでなければ`null`を返します。この式の型は`Int?`です。

Kotlinでは、`?.`演算子を[`var`変数と`val`変数](basic-syntax.md#variables)の両方で使用できます。

*   ヌル許容の`var`は`null` (例: `var nullableValue: String? = null`) または非ヌル値 (例: `var nullableValue: String? = "Kotlin"`) を保持できます。非ヌル値である場合、いつでも`null`に変更できます。
*   ヌル許容の`val`は`null` (例: `val nullableValue: String? = null`) または非ヌル値 (例: `val nullableValue: String? = "Kotlin"`) を保持できます。非ヌル値である場合、後で`null`に変更することはできません。

安全な呼び出しはチェーンで役立ちます。例えば、Bobは部署に配属されているかもしれない (あるいはいないかもしれない) 従業員です。その部署には、さらに別の従業員が部署の責任者として配属されているかもしれません。Bobの部署の責任者の名前を取得するには (もしいるならば)、次のように記述します。

```kotlin
bob?.department?.head?.name
```

このチェーンは、いずれかのプロパティが`null`であれば`null`を返します。

代入の左側に安全な呼び出しを配置することもできます。

```kotlin
person?.department?.head = managersPool.getManager()
```

上記の例では、安全呼び出しチェーン内のレシーバーのいずれかが`null`の場合、代入はスキップされ、右側の式はまったく評価されません。例えば、`person`または`person.department`のいずれかが`null`の場合、関数は呼び出されません。以下は、同じ安全呼び出しを`if`条件式で記述した場合の同等なものです。

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## エルビス演算子

ヌル許容型を扱う場合、`null`をチェックし、代替値を提供できます。例えば、`b`が`null`でない場合、`b.length`にアクセスします。そうでなければ、代替値を返します。

```kotlin
fun main() {
//sampleStart
    // ヌル許容変数にnullを代入します  
    val b: String? = null
    // ヌル許容性をチェックします。nullでなければ長さを返し、nullであれば0を返します
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

完全な`if`式を記述する代わりに、エルビス演算子`?:`を使って、より簡潔な方法でこれを処理できます。

```kotlin
fun main() {
//sampleStart
    // ヌル許容変数にnullを代入します  
    val b: String? = null
    // ヌル許容性をチェックします。nullでなければ長さを返し、nullであれば非ヌル値を返します
    val l = b?.length ?: 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

`?:`の左側の式が`null`でない場合、エルビス演算子はそれを返します。そうでなければ、エルビス演算子は右側の式を返します。右側の式は、左側が`null`の場合にのみ評価されます。

Kotlinでは`throw`と`return`は式であるため、エルビス演算子の右側でも使用できます。これは、例えば関数の引数をチェックする際に便利です。

```kotlin
fun foo(node: Node): String? {
    // getParent()をチェックします。nullでなければparentに代入され、nullであればnullを返します
    val parent = node.getParent() ?: return null
    // getName()をチェックします。nullでなければnameに代入され、nullであれば例外をスローします
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 非ヌルアサーション演算子

非ヌルアサーション演算子 `!!` は、あらゆる値を非ヌル許容型に変換します。

`!!`演算子を`null`ではない値を持つ変数に適用すると、それは非ヌル許容型として安全に処理され、コードは正常に実行されます。しかし、値が`null`の場合、`!!`演算子はそれを非ヌル許容として強制的に扱わせ、その結果NPEが発生します。

`b`が`null`ではなく、`!!`演算子がその非ヌル値 (この例では`String`) を返させると、`length`に正しくアクセスします。

```kotlin
fun main() {
//sampleStart
    // ヌル許容文字列を変数に代入します
    val b: String? = "Kotlin"
    // bを非ヌルとして扱い、その長さにアクセスします
    val l = b!!.length
    println(l)
    // 6
//sampleEnd
}
```
{kotlin-runnable="true"}

`b`が`null`の場合、`!!`演算子がその非ヌル値を返させると、NPEが発生します。

```kotlin
fun main() {
//sampleStart
    // ヌル許容変数にnullを代入します  
    val b: String? = null
    // bを非ヌルとして扱い、その長さにアクセスしようとします
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

`!!`演算子は、値が`null`ではないと確信しており、NPEが発生する可能性がない場合、しかしコンパイラが特定のルールによりこれを保証できない場合に特に便利です。そのような場合、`!!`演算子を使用して、値が`null`ではないことをコンパイラに明示的に伝えることができます。

## ヌル許容レシーバー

[ヌル許容レシーバー型 (nullable receiver type)](extensions.md#nullable-receiver)を持つ拡張関数を使用でき、これにより、`null`になる可能性のある変数でこれらの関数を呼び出すことができます。

ヌル許容レシーバー型に拡張関数を定義することで、関数を呼び出すすべての場所で`null`をチェックする代わりに、関数内で`null`値を処理できます。

例えば、[`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html)拡張関数はヌル許容レシーバーで呼び出すことができます。`null`値で呼び出された場合、例外をスローすることなく、安全に文字列`"null"`を返します。

```kotlin
//sampleStart
fun main() {
    // person変数に格納されたヌル許容Personオブジェクトにnullを代入します
    val person: Person? = null

    // ヌル許容person変数に.toStringを適用し、文字列を出力します
    println(person.toString())
    // null
}

// シンプルなPersonクラスを定義します
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

上記の例では、`person`が`null`であっても、`.toString()`関数は安全に文字列`"null"`を返します。これはデバッグやログ記録に役立ちます。

`.toString()`関数がヌル許容文字列 (文字列表現または`null`のいずれか) を返すことを期待する場合、[安全呼び出し演算子 `?.`](#safe-call-operator)を使用します。`?.`演算子は、オブジェクトが`null`でない場合にのみ`.toString()`を呼び出し、そうでなければ`null`を返します。

```kotlin
//sampleStart
fun main() {
    // ヌル許容Personオブジェクトを変数に代入します
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // personがnullの場合に"null"を出力します。そうでない場合はperson.toString()の結果を出力します
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// Personクラスを定義します
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

`?.`演算子を使用すると、`null`になる可能性のあるオブジェクトのプロパティや関数にアクセスしながら、潜在的な`null`値を安全に処理できます。

## `let`関数

`null`値を処理し、非ヌル型に対してのみ操作を実行するには、安全呼び出し演算子 `?.` を[`let`関数](scope-functions.md#let)と組み合わせて使用できます。

この組み合わせは、式を評価し、結果が`null`かどうかをチェックし、`null`でない場合にのみコードを実行するのに役立ち、手動でのヌルチェックを回避します。

```kotlin
fun main() {
//sampleStart
    // ヌル許容文字列のリストを宣言します
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // リスト内の各項目を反復処理します
    for (item in listWithNulls) {
        // 項目がnullかどうかをチェックし、非ヌル値のみを出力します
        item?.let { println(it) }
        //Kotlin 
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## 安全なキャスト

[型キャスト (type casts)](typecasts.md#unsafe-cast-operator)のための通常のKotlin演算子は`as`演算子です。しかし、オブジェクトがターゲット型でない場合、通常のキャストは例外を引き起こす可能性があります。

安全なキャストには`as?`演算子を使用できます。これは値を指定された型にキャストしようとします。そして、値がその型でない場合は`null`を返します。

```kotlin
fun main() {
//sampleStart
    // あらゆる型の値を保持できるAny型の変数を宣言します
    val a: Any = "Hello, Kotlin!"

    // as?演算子を使用してIntへの安全なキャストを行います
    val aInt: Int? = a as? Int
    // as?演算子を使用してStringへの安全なキャストを行います
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"
//sampleEnd
}
```
{kotlin-runnable="true"}

上記のコードは`null`を出力します。`a`が`Int`ではないため、キャストは安全に失敗します。また、`String?`型と一致するため、安全なキャストは成功し、`"Hello, Kotlin!"`を出力します。

## ヌル許容型のコレクション

ヌル許容要素のコレクションがあり、非ヌルなものだけを保持したい場合、`filterNotNull()`関数を使用します。

```kotlin
fun main() {
//sampleStart
    // null値と非nullの整数値を含むリストを宣言します
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // null値をフィルタリングし、非nullの整数リストを生成します
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
//sampleEnd
}
```
{kotlin-runnable="true"}

## 次のステップ

*   [JavaとKotlinでのヌル許容性の扱い](java-to-kotlin-nullability-guide.md)について学びます。
*   [確実に非ヌル許容な](generics.md#definitely-non-nullable-types)ジェネリック型について学びます。