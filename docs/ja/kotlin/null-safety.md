[//]: # (title: ヌル安全性)

ヌル安全性は、ヌル参照（「10億ドルの間違い (The Billion-Dollar Mistake)」としても知られています）の発生リスクを大幅に削減するために設計されたKotlinの機能です。

Javaを含む多くのプログラミング言語で最も一般的な落とし穴の1つは、ヌル参照のメンバーにアクセスするとヌル参照例外が発生することです。Javaでは、これは`NullPointerException`、略して_NPE_に相当します。

Kotlinは、型システムの一部としてヌル許容性を明示的にサポートしており、どの変数やプロパティが`null`を許容するかを明示的に宣言できることを意味します。また、非ヌル変数を宣言すると、コンパイラはこれらの変数が`null`値を保持できないことを強制し、NPEを防ぎます。

Kotlinのヌル安全性は、潜在的なヌル関連の問題を実行時ではなくコンパイル時に捕捉することで、より安全なコードを保証します。この機能は、`null`値を明示的に表現することでコードの堅牢性、可読性、保守性を向上させ、コードを理解しやすく管理しやすくします。

KotlinでNPEが発生しうる唯一の原因は次のとおりです。

*   [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)の明示的な呼び出し。
*   [非ヌル表明演算子`!!`](#not-null-assertion-operator)の使用。
*   初期化中のデータ不整合。例えば、以下の場合です。
    *   コンストラクタで利用可能な未初期化の`this`が、他の場所で使用されている場合（[「`this`の漏洩」](https://youtrack.jetbrains.com/issue/KTIJ-9751)）。
    *   派生クラスでの実装が未初期化の状態を使用している、[スーパークラスのコンストラクタがopenメンバーを呼び出す](inheritance.md#derived-class-initialization-order)場合。
*   Javaとの相互運用:
    *   [プラットフォーム型](java-interop.md#null-safety-and-platform-types)のヌル参照のメンバーにアクセスしようとすること。
    *   ジェネリック型におけるヌル許容性の問題。例えば、Kotlinの`MutableList<String>`に`null`を追加するJavaコードがあり、これを適切に処理するには`MutableList<String?>`が必要になる場合など。
    *   外部のJavaコードによって引き起こされるその他の問題。

> NPE以外にも、ヌル安全性に関連する別の例外として[`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)があります。Kotlinは、初期化されていないプロパティにアクセスしようとしたときにこの例外をスローし、非ヌル許容プロパティが準備できるまで使用されないようにします。これは通常、[`lateinit`プロパティ](properties.md#late-initialized-properties-and-variables)で発生します。
>
{style="tip"}

## ヌル許容型と非ヌル許容型

Kotlinでは、型システムは`null`を保持できる型（ヌル許容型）とそうでない型（非ヌル許容型）を区別します。例えば、`String`型の通常の変数は`null`を保持できません。

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

`a`は非ヌル許容変数であるため、NPEを引き起こすことなく、`a`のメソッドを安全に呼び出すか、プロパティにアクセスできます。コンパイラは`a`が常に有効な`String`値を保持することを保証するため、`null`の場合にそのプロパティやメソッドにアクセスするリスクはありません。

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

`null`値を許可するには、変数型の直後に`?`記号を付けて変数を宣言します。例えば、`String?`と記述することでヌル許容文字列を宣言できます。この式により、`String`は`null`を受け入れる型になります。

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

`b`に直接`length`にアクセスしようとすると、コンパイラはエラーを報告します。これは、`b`がヌル許容変数として宣言されており、`null`値を保持できるためです。ヌル許容型のプロパティに直接アクセスしようとするとNPEが発生します。

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

上記の例では、プロパティにアクセスしたり操作を実行したりする前に、ヌル許容性を確認するために安全呼び出しを使用することをコンパイラは要求します。ヌル許容型を処理する方法はいくつかあります。

*   [`if`条件文で`null`をチェックする](#check-for-null-with-the-if-conditional)
*   [安全呼び出し演算子`?.`](#safe-call-operator)
*   [エルビス演算子`?:`](#elvis-operator)
*   [非ヌル表明演算子`!!`](#not-null-assertion-operator)
*   [ヌル許容レシーバー](#nullable-receiver)
*   [`let`関数](#let-function)
*   [安全キャスト`as?`](#safe-casts)
*   [ヌル許容型のコレクション](#collections-of-a-nullable-type)

`null`処理ツールとテクニックの詳細と例については、次のセクションをお読みください。

## `if`条件文で`null`をチェックする

ヌル許容型を扱う場合、NPEを避けるためにヌル許容性を安全に処理する必要があります。これを処理する方法の1つは、`if`条件式を使ってヌル許容性を明示的にチェックすることです。

例えば、`b`が`null`であるかどうかを確認し、その後`b.length`にアクセスします。

```kotlin
fun main() {
//sampleStart
    // ヌル許容変数にnullを代入します
    val b: String? = null
    // まずヌル許容性をチェックし、次に長さにアクセスします
    val l = if (b != null) b.length else -1
    print(l)
    // -1
//sampleEnd
}
```
{kotlin-runnable="true"}

上記の例では、コンパイラが[スマートキャスト](typecasts.md#smart-casts)を実行して、型をヌル許容型の`String?`から非ヌル許容型の`String`に変更します。また、実行したチェックに関する情報を追跡し、`if`条件文内で`length`への呼び出しを許可します。

より複雑な条件もサポートされています。

```kotlin
fun main() {
//sampleStart
    // ヌル許容文字列を変数に代入します
    val b: String? = "Kotlin"

    // まずヌル許容性をチェックし、次に長さにアクセスします
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

上記の例は、[スマートキャストの前提条件](typecasts.md#smart-cast-prerequisites)と同様に、コンパイラがチェックと使用の間に`b`が変更されないことを保証できる場合にのみ機能することに注意してください。

## 安全呼び出し演算子

安全呼び出し演算子`?.`を使用すると、より短い形式でヌル許容性を安全に処理できます。オブジェクトが`null`の場合、NPEをスローする代わりに、`?.`演算子は単純に`null`を返します。

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

`b?.length`式はヌル許容性をチェックし、`b`が非ヌルであれば`b.length`を返し、そうでなければ`null`を返します。この式の型は`Int?`です。

Kotlinでは、`?.`演算子を[`var`変数と`val`変数](basic-syntax.md#variables)の両方で使用できます。

*   ヌル許容の`var`は`null`（例: `var nullableValue: String? = null`）または非ヌル値（例: `var nullableValue: String? = "Kotlin"`）を保持できます。非ヌル値である場合でも、任意の時点で`null`に変更できます。
*   ヌル許容の`val`は`null`（例: `val nullableValue: String? = null`）または非ヌル値（例: `val nullableValue: String? = "Kotlin"`）を保持できます。非ヌル値である場合、その後`null`に変更することはできません。

安全呼び出しはチェーンで役立ちます。例えば、Bobは部署に配属されている場合とそうでない場合がある従業員です。その部署には、さらに別の従業員が部署長として配属されている場合があります。Bobの部署長の氏名を取得するには（もし存在すれば）、次のように記述します。

```kotlin
bob?.department?.head?.name
```

このチェーンは、いずれかのプロパティが`null`である場合、`null`を返します。

代入の左辺に安全呼び出しを配置することもできます。

```kotlin
person?.department?.head = managersPool.getManager()
```

上記の例では、安全呼び出しチェーンのいずれかのレシーバーが`null`の場合、代入はスキップされ、右辺の式は全く評価されません。例えば、`person`または`person.department`のいずれかが`null`の場合、関数は呼び出されません。以下は、同じ安全呼び出しを`if`条件文で表現した場合の同等なコードです。

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## エルビス演算子

ヌル許容型を扱う場合、`null`をチェックして代替値を提供できます。例えば、`b`が`null`でなければ、`b.length`にアクセスします。そうでなければ、代替値を返します。

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

完全な`if`式を記述する代わりに、エルビス演算子`?:`を使用すると、より簡潔な方法でこれを処理できます。

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

`?:`の左辺の式が`null`でなければ、エルビス演算子はそれを返します。そうでなければ、エルビス演算子は右辺の式を返します。右辺の式は、左辺が`null`の場合にのみ評価されます。

`throw`と`return`はKotlinでは式であるため、エルビス演算子の右辺でこれらを使用することもできます。これは、例えば関数引数をチェックする際に便利です。

```kotlin
fun foo(node: Node): String? {
    // getParent()をチェックします。nullでなければparentに代入され、nullであればnullを返します
    val parent = node.getParent() ?: return null
    // getName()をチェックします。nullでなければnameに代入され、nullであれば例外をスローします
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 非ヌル表明演算子

非ヌル表明演算子`!!`は、あらゆる値を非ヌル許容型に変換します。

値が`null`ではない変数に`!!`演算子を適用すると、それは非ヌル許容型として安全に処理され、コードは正常に実行されます。しかし、値が`null`の場合、`!!`演算子はそれが非ヌル許容として扱われることを強制し、NPEが発生します。

`b`が`null`ではなく、`!!`演算子によってその非ヌル値（この例では`String`）が返される場合、`length`に正しくアクセスします。

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

`b`が`null`で、`!!`演算子によってその非ヌル値が返されると、NPEが発生します。

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

`!!`演算子は、値が`null`ではないと確信しており、NPEが発生する可能性がないにもかかわらず、コンパイラが特定のルールによりこれを保証できない場合に特に便利です。そのような場合、`!!`演算子を使用して、値が`null`ではないことをコンパイラに明示的に伝えることができます。

## ヌル許容レシーバー

[ヌル許容レシーバー型](extensions.md#nullable-receiver)を持つ拡張関数を使用すると、`null`になる可能性のある変数に対してもこれらの関数を呼び出すことができます。

ヌル許容レシーバー型に拡張関数を定義することで、関数を呼び出すたびに`null`をチェックする代わりに、関数内で`null`値を処理できます。

例えば、[`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html)拡張関数はヌル許容レシーバーで呼び出すことができます。`null`値に対して呼び出されると、例外をスローすることなく安全に文字列`"null"`を返します。

```kotlin
//sampleStart
fun main() {
    // person変数に格納されているヌル許容のPersonオブジェクトにnullを代入します
    val person: Person? = null

    // ヌル許容のperson変数に.toStringを適用し、文字列をプリントします
    println(person.toString())
    // null
}

// シンプルなPersonクラスを定義します
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

上記の例では、`person`が`null`であっても、`.toString()`関数は安全に文字列`"null"`を返します。これはデバッグやロギングに役立ちます。

`.toString()`関数がヌル許容文字列（文字列表現または`null`のいずれか）を返すことを期待する場合、[安全呼び出し演算子`?.`](#safe-call-operator)を使用します。`?.`演算子は、オブジェクトが`null`ではない場合にのみ`.toString()`を呼び出し、そうでなければ`null`を返します。

```kotlin
//sampleStart
fun main() {
    // ヌル許容のPersonオブジェクトを変数に代入します
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // personがnullであれば"null"をプリントし、そうでなければperson.toString()の結果をプリントします
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

`null`値を処理し、非ヌル許容型に対してのみ操作を実行するには、安全呼び出し演算子`?.`と[`let`関数](scope-functions.md#let)を組み合わせて使用できます。

この組み合わせは、式を評価し、結果が`null`でないかを確認し、`null`でない場合にのみコードを実行することで、手動でのヌルチェックを回避するために役立ちます。

```kotlin
fun main() {
//sampleStart
    // ヌル許容文字列のリストを宣言します
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // リスト内の各項目を反復処理します
    for (item in listWithNulls) {
        // 項目がnullでないかをチェックし、非ヌル値のみをプリントします
        item?.let { println(it) }
        //Kotlin 
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## 安全キャスト

Kotlinの[型キャスト](typecasts.md#unsafe-cast-operator)のための通常の演算子は`as`演算子です。しかし、オブジェクトがターゲット型ではない場合、通常のキャストは例外を発生させる可能性があります。

安全キャストには`as?`演算子を使用できます。これは値を指定された型にキャストしようとし、その値がその型ではない場合は`null`を返します。

```kotlin
fun main() {
//sampleStart
    // あらゆる型の値を保持できるAny型の変数を宣言します
    val a: Any = "Hello, Kotlin!"

    // 'as?'演算子を使用してIntに安全キャストします
    val aInt: Int? = a as? Int
    // 'as?'演算子を使用してStringに安全キャストします
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"
//sampleEnd
}
```
{kotlin-runnable="true"}

上記のコードは`null`をプリントします。これは`a`が`Int`ではないため、キャストが安全に失敗するからです。また、`String?`型に一致するため、`"Hello, Kotlin!"`をプリントし、安全キャストは成功しています。

## ヌル許容型のコレクション

ヌル許容要素のコレクションがあり、非ヌルなものだけを保持したい場合は、`filterNotNull()`関数を使用します。

```kotlin
fun main() {
//sampleStart
    // いくつかのnull値と非nullの整数値を含むリストを宣言します
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // null値をフィルタリングして、非nullの整数リストを作成します
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
//sampleEnd
}
```
{kotlin-runnable="true"}

## 次は何ですか？

*   [JavaとKotlinでヌル許容性を処理する方法](java-to-kotlin-nullability-guide.md)を学びましょう。
*   [確実な非ヌル許容型](generics.md#definitely-non-nullable-types)であるジェネリック型について学びましょう。