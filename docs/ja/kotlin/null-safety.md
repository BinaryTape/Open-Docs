---
title: "Null safety"
---
Null safetyは、[The Billion-Dollar Mistake](https://en.wikipedia.org/wiki/Null_pointer#History)としても知られる、null参照のリスクを大幅に軽減するために設計されたKotlinの機能です。

Javaを含む多くのプログラミング言語における最も一般的な落とし穴の1つは、null参照のメンバーにアクセスすると、null参照例外が発生することです。Javaでは、これは`NullPointerException`、略して_NPE_に相当します。

Kotlinは、型システムの一部としてnull許容性を明示的にサポートしています。つまり、どの変数またはプロパティが`null`を許可されるかを明示的に宣言できます。また、null非許容変数を宣言すると、コンパイラーはこれらの変数が`null`値を保持できないように強制し、NPEを防止します。

Kotlinのnull safetyは、潜在的なnull関連の問題をランタイムではなくコンパイル時に検出することにより、より安全なコードを保証します。この機能は、`null`値を明示的に表現することで、コードの堅牢性、可読性、および保守性を向上させ、コードを理解および管理しやすくします。

KotlinでNPEが発生する可能性のある原因は次のとおりです。

* [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)の明示的な呼び出し。
* [not-null assertion operator `!!`](#not-null-assertion-operator)の使用。
* 初期化中のデータの不整合。以下のような場合：
  * コンストラクターで使用可能な初期化されていない`this`が他の場所で使用される場合（["leaking `this`"](https://youtrack.jetbrains.com/issue/KTIJ-9751)）。
  * 派生クラスの実装で初期化されていない状態を使用する[スーパークラスコンストラクターによるopenメンバーの呼び出し](inheritance#derived-class-initialization-order)。
* Java interoperation：
  * [プラットフォーム型](java-interop#null-safety-and-platform-types)の`null`参照のメンバーにアクセスしようとする場合。
  * ジェネリック型に関するNullabilityの問題。たとえば、Javaコードが`null`をKotlinの`MutableList<String>`に追加する場合など、これを適切に処理するには`MutableList<String?>`が必要になります。
  * 外部Javaコードによって引き起こされるその他の問題。

:::tip
NPEに加えて、null safetyに関連するもう1つの例外は[`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)です。Kotlinは、初期化されていないプロパティにアクセスしようとすると、この例外をスローし、null非許容プロパティが準備できるまで使用されないようにします。これは通常、[`lateinit` properties](properties#late-initialized-properties-and-variables)で発生します。

:::

## Nullable types and non-nullable types

Kotlinでは、型システムは`null`を保持できる型（nullable types）と、そうでない型（non-nullable types）を区別します。たとえば、`String`型の通常の変数は`null`を保持できません。

```kotlin
fun main() {

    // Assigns a non-null string to a variable
    var a: String = "abc"
    // Attempts to re-assign null to the non-nullable variable
    a = null
    print(a)
    // Null can not be a value of a non-null type String

}
```

`a`でメソッドを安全に呼び出したり、プロパティにアクセスしたりできます。`a`はnull非許容変数であるため、NPEが発生することはありません。コンパイラーは、`a`が常に有効な`String`値を保持することを保証するため、`null`の場合にそのプロパティまたはメソッドにアクセスするリスクはありません。

```kotlin
fun main() {

    // Assigns a non-null string to a variable
    val a: String = "abc"
    // Returns the length of a non-nullable variable
    val l = a.length
    print(l)
    // 3

}
```

`null`値を許可するには、変数型の直後に`?`記号を付けて変数を宣言します。たとえば、`String?`と記述してnullable stringを宣言できます。この式により、`String`は`null`を受け入れることができる型になります。

```kotlin
fun main() {

    // Assigns a nullable string to a variable
    var b: String? = "abc"
    // Successfully re-assigns null to the nullable variable
    b = null
    print(b)
    // null

}
```

`b`で`length`に直接アクセスしようとすると、コンパイラーはエラーを報告します。これは、`b`がnullable変数として宣言されており、`null`値を保持できるためです。nullablesでプロパティに直接アクセスしようとすると、NPEが発生します。

```kotlin
fun main() {

    // Assigns a nullable string to a variable  
    var b: String? = "abc"
    // Re-assigns null to the nullable variable
    b = null
    // Tries to directly return the length of a nullable variable
    val l = b.length
    print(l)
    // Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String? 

}
```

上記の例では、コンパイラーは、プロパティにアクセスしたり操作を実行したりする前に、safe callsを使用してnullabilityを確認する必要があります。nullablesを処理する方法はいくつかあります。

* [`if` conditionalで`null`を確認](#check-for-null-with-the-if-conditional)
* [Safe call operator `?.`](#safe-call-operator)
* [Elvis operator `?:`](#elvis-operator)
* [Not-null assertion operator `!!`](#not-null-assertion-operator)
* [Nullable receiver](#nullable-receiver)
* [`let` function](#let-function)
* [Safe casts `as?`](#safe-casts)
* [Collections of a nullable type](#collections-of-a-nullable-type)

`null` handlingツールとテクニックの詳細と例については、次のセクションをお読みください。

## Check for null with the if conditional

nullable typesを使用する場合、NPEを回避するためにnullabilityを安全に処理する必要があります。これを処理する1つの方法は、`if` conditional式でnullabilityを明示的に確認することです。

たとえば、`b`が`null`かどうかを確認し、`b.length`にアクセスします。

```kotlin
fun main() {

    // Assigns null to a nullable variable
    val b: String? = null
    // Checks for nullability first and then accesses length
    val l = if (b != null) b.length else -1
    print(l)
    // -1

}
```

上記の例では、コンパイラーは[smart cast](typecasts#smart-casts)を実行して、型をnullable `String?`からnon-nullable `String`に変更します。また、実行したチェックに関する情報を追跡し、`if` conditional内で`length`の呼び出しを許可します。

より複雑な条件もサポートされています。

```kotlin
fun main() {

    // Assigns a nullable string to a variable  
    val b: String? = "Kotlin"

    // Checks for nullability first and then accesses length
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
    // Provides alternative if the condition is not met  
    } else {
        print("Empty string")
        // String of length 6
    }

}
```

上記の例は、コンパイラーがチェックとその使用の間で`b`が変更されないことを保証できる場合にのみ機能します。[smart cast prerequisites](typecasts#smart-cast-prerequisites)と同じです。

## Safe call operator

safe call operator `?.`を使用すると、nullabilityをより短い形式で安全に処理できます。オブジェクトが`null`の場合、NPEをスローする代わりに、`?.` operatorは単に`null`を返します。

```kotlin
fun main() {

    // Assigns a nullable string to a variable  
    val a: String? = "Kotlin"
    // Assigns null to a nullable variable
    val b: String? = null
    
    // Checks for nullability and returns length or null
    println(a?.length)
    // 6
    println(b?.length)
    // null

}
```

`b?.length`式はnullabilityを確認し、`b`がnull非許容の場合は`b.length`を返し、それ以外の場合は`null`を返します。この式の型は`Int?`です。

Kotlinでは[`var` and `val` variables](basic-syntax#variables)の両方で`?.` operatorを使用できます。

* nullable `var`は、`null`（たとえば、`var nullableValue: String? = null`）またはnull非許容値（たとえば、`var nullableValue: String? = "Kotlin"`）を保持できます。null非許容値の場合、いつでも`null`に変更できます。
* nullable `val`は、`null`（たとえば、`val nullableValue: String? = null`）またはnull非許容値（たとえば、`val nullableValue: String? = "Kotlin"`）を保持できます。null非許容値の場合、後で`null`に変更することはできません。

safe callsはチェーンで役立ちます。たとえば、Bobは部署に割り当てられている（または割り当てられていない）従業員です。その部署には、別の従業員が部門長として配置されている場合があります。Bobの部門長の名前（存在する場合）を取得するには、次のように記述します。

```kotlin
bob?.department?.head?.name
```

このチェーンは、そのプロパティのいずれかが`null`の場合に`null`を返します。次に、同じsafe callと同等の`if` conditionalを示します。

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

割り当ての左側にsafe callを配置することもできます。

```kotlin
person?.department?.head = managersPool.getManager()
```

上記の例では、safe callチェーンのいずれかのレシーバーが`null`の場合、割り当てはスキップされ、右側の式はまったく評価されません。たとえば、`person`または`person.department`のいずれかが`null`の場合、関数は呼び出されません。

## Elvis operator

nullable typesを使用する場合、`null`を確認して代替値を提供できます。たとえば、`b`が`null`でない場合は、`b.length`にアクセスします。それ以外の場合は、代替値を返します。

```kotlin
fun main() {

    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns 0
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0

}
```

完全な`if`式を記述する代わりに、Elvis operator `?:`を使用して、より簡潔な方法でこれを処理できます。

```kotlin
fun main() {

    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns a non-null value
    val l = b?.length ?: 0
    println(l)
    // 0

}
```

`?:`の左側の式が`null`でない場合、Elvis operatorはそれを返します。それ以外の場合、Elvis operatorは右側の式を返します。右側の式は、左側が`null`の場合にのみ評価されます。

`throw`と`return`はKotlinの式であるため、Elvis operatorの右側で使用することもできます。これは、たとえば、関数引数を確認する場合に役立ちます。

```kotlin
fun foo(node: Node): String? {
    // Checks for getParent(). If not null, it's assigned to parent. If null, returns null
    val parent = node.getParent() ?: return null
    // Checks for getName(). If not null, it's assigned to name. If null, throws exception
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## Not-null assertion operator

not-null assertion operator `!!`は、任意の値をnull非許容型に変換します。

値が`null`でない変数に`!!` operatorを適用すると、null非許容型として安全に処理され、コードは正常に実行されます。ただし、値が`null`の場合、`!!` operatorはnull非許容として扱うことを強制し、NPEが発生します。

`b`が`null`でなく、`!!` operatorがそのnull非許容値（この例では`String`）を返すようにすると、`length`に正しくアクセスします。

```kotlin
fun main() {

    // Assigns a nullable string to a variable  
    val b: String? = "Kotlin"
    // Treats b as non-null and accesses its length
    val l = b!!.length
    println(l)
    // 6

}
```

`b`が`null`で、`!!` operatorがそのnull非許容値を返すようにすると、NPEが発生します。

```kotlin
fun main() {

    // Assigns null to a nullable variable  
    val b: String? = null
    // Treats b as non-null and tries to access its length
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException

}
```

`!!` operatorは、値が`null`ではなく、NPEが発生する可能性がないと確信している場合に特に役立ちますが、コンパイラーは特定のルールによりこれを保証できません。このような場合、`!!` operatorを使用して、値が`null`ではないことをコンパイラーに明示的に指示できます。

## Nullable receiver

[nullable receiver type](extensions#nullable-receiver)で拡張関数を使用できます。これにより、これらの関数は`null`である可能性のある変数で呼び出すことができます。

nullable receiver typeで拡張関数を定義することにより、関数を呼び出すすべての場所で`null`を確認する代わりに、関数自体内で`null`値を処理できます。

たとえば、[`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html)拡張関数は、nullable receiverで呼び出すことができます。`null`値で呼び出されると、例外をスローせずに、文字列`"null"`を安全に返します。

```kotlin

fun main() {
    // Assigns null to a nullable Person object stored in the person variable
    val person: Person? = null

    // Applies .toString to the nullable person variable and prints a string
    println(person.toString())
    // null
}

// Defines a simple Person class
data class Person(val name: String)

```

上記の例では、`person`が`null`であっても、`.toString()`関数は文字列`"null"`を安全に返します。これは、デバッグとロギングに役立ちます。

`.toString()`関数がnullable string（文字列の表現または`null`）を返すことを期待する場合は、[safe-call operator `?.`](#safe-call-operator)を使用します。`?.` operatorは、オブジェクトが`null`でない場合にのみ`.toString()`を呼び出し、それ以外の場合は`null`を返します。

```kotlin

fun main() {
    // Assigns a nullable Person object to a variable
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // Prints "null" if person is null; otherwise prints the result of person.toString()
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// Defines a Person class
data class Person(val name: String)

```

`?.` operatorを使用すると、潜在的な`null`値を安全に処理しながら、`null`である可能性のあるオブジェクトのプロパティまたは関数にアクセスできます。

## Let function

`null`値を処理し、null非許容型でのみ操作を実行するには、safe call operator `?.`を[`let` function](scope-functions#let)とともに使用できます。

この組み合わせは、式を評価し、結果で`null`を確認し、`null`でない場合にのみコードを実行し、手動のnullチェックを回避する場合に役立ちます。

```kotlin
fun main() {

    // Declares a list of nullable strings
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // Iterates over each item in the list
    for (item in listWithNulls) {
        // Checks if the item is null and only prints non-null values
        item?.let { println(it) }
        //Kotlin 
    }

}
```

## Safe casts

[type casts](typecasts#unsafe-cast-operator)の通常のKotlin operatorは、`as` operatorです。ただし、オブジェクトがターゲット型でない場合、通常のキャストは例外になる可能性があります。

safe castsには`as?` operatorを使用できます。これは、値を指定された型にキャストしようとし、値がその型でない場合は`null`を返します。

```kotlin
fun main() {

    // Declares a variable of type Any, which can hold any type of value
    val a: Any = "Hello, Kotlin!"

    // Safe casts to Int using the 'as?' operator
    val aInt: Int? = a as? Int
    // Safe casts to String using the 'as?' operator
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"

}
```

`a`は`Int`ではないため、上記のコードは`null`を出力し、キャストは安全に失敗します。また、`String?`型と一致するため、`"Hello, Kotlin!"`を出力し、safe castは成功します。

## Collections of a nullable type

nullable elementsのコレクションがあり、null非許容のもののみを保持する場合は、`filterNotNull()`関数を使用します。

```kotlin
fun main() {

    // Declares a list containing some null and non-null integer values
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // Filters out null values, resulting in a list of non-null integers
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]

}
```

## What's next?

* [JavaおよびKotlinでnullabilityを処理](java-to-kotlin-nullability-guide)する方法を学びます。
* [definitely non-nullable](generics#definitely-non-nullable-types)であるジェネリック型について学びます。