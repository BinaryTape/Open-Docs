[//]: # (title: データクラス)

Kotlinのデータクラスは、主にデータを保持するために使用されます。各データクラスについて、コンパイラはインスタンスを読み取り可能な出力に表示したり、インスタンスを比較したり、コピーしたりできる追加のメンバー関数を自動的に生成します。
データクラスは`data`とマークされます。

```kotlin
data class User(val name: String, val age: Int)
```

コンパイラは、プライマリコンストラクタで宣言されたすべてのプロパティから、以下のメンバーを自動的に派生させます。

*   `equals()`/`hashCode()`のペア。
*   `"User(name=John, age=42)"`形式の`toString()`。
*   宣言順に対応するプロパティの[`componentN()`関数](destructuring-declarations.md)。
*   `copy()`関数 (後述参照)。

生成されたコードの一貫性と意味のある動作を保証するために、データクラスは以下の要件を満たす必要があります。

*   プライマリコンストラクタには少なくとも1つのパラメータが必要です。
*   すべてのプライマリコンストラクタパラメータは`val`または`var`でマークされている必要があります。
*   データクラスはabstract、open、sealed、またはinnerにすることはできません。

さらに、データクラスメンバーの生成は、メンバーの継承に関して以下の規則に従います。

*   データクラスの本体に`equals()`、`hashCode()`、または`toString()`の明示的な実装がある場合、またはスーパークラスに`final`実装がある場合、これらの関数は生成されず、既存の実装が使用されます。
*   スーパークラスが`open`であり、互換性のある型を返す`componentN()`関数を持つ場合、対応する関数がデータクラス用に生成され、スーパークラスのものをオーバーライドします。スーパークラスの関数が互換性のないシグネチャのため、または`final`であるためにオーバーライドできない場合、エラーが報告されます。
*   `componentN()`および`copy()`関数の明示的な実装を提供することは許可されていません。

データクラスは他のクラスを拡張できます ([Sealed classes](sealed-classes.md)で例を参照)。

> On the JVM, if the generated class needs to have a parameterless constructor, default values for the properties have
> to be specified (see [Constructors](classes.md#constructors)):
> 
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## クラス本体で宣言されたプロパティ

コンパイラは、自動生成される関数にプライマリコンストラクタ内で定義されたプロパティのみを使用します。生成される実装からプロパティを除外するには、クラス本体内で宣言します。

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

以下の例では、`toString()`、`equals()`、`hashCode()`、`copy()`の実装内でデフォルトで使用されるのは`name`プロパティのみであり、コンポーネント関数は`component1()`のみです。
`age`プロパティはクラス本体内で宣言されており、除外されます。
したがって、`equals()`はプライマリコンストラクタのプロパティのみを評価するため、同じ`name`を持ちながら`age`が異なる2つの`Person`オブジェクトは等しいと見なされます。

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {
//sampleStart
    val person1 = Person("John")
    val person2 = Person("John")
    person1.age = 10
    person2.age = 20

    println("person1 == person2: ${person1 == person2}")
    // person1 == person2: true
  
    println("person1 with age ${person1.age}: ${person1}")
    // person1 with age 10: Person(name=John)
  
    println("person2 with age ${person2.age}: ${person2}")
    // person2 with age 20: Person(name=John)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## コピー

オブジェクトをコピーするには`copy()`関数を使用します。これにより、プロパティの_一部_を変更し、残りを変更せずに保持することができます。
上記の`User`クラスに対するこの関数の実装は以下のようになります。

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

その後、以下のように記述できます。

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## データクラスと分割宣言

データクラス用に生成される_コンポーネント関数_により、それらを[分割宣言](destructuring-declarations.md)で使用することが可能になります。

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 標準データクラス

標準ライブラリは`Pair`および`Triple`クラスを提供します。しかし、ほとんどの場合、名前付きデータクラスは、プロパティに意味のある名前を付けることでコードを読みやすくするため、より良い設計上の選択肢となります。