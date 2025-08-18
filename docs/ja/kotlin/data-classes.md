[//]: # (title: データクラス)

Kotlinのデータクラスは、主にデータを保持するために使用されます。各データクラスに対して、コンパイラはインスタンスを読み取り可能な形式で出力したり、インスタンスを比較したり、コピーしたりできる追加のメンバー関数を自動的に生成します。データクラスは`data`キーワードでマークされます:

```kotlin
data class User(val name: String, val age: Int)
```

コンパイラは、プライマリコンストラクタで宣言されたすべてのプロパティから、以下のメンバーを自動的に導出します:

*   `equals()`/`hashCode()` ペア。
*   `"User(name=John, age=42)"`形式の`toString()`。
*   宣言順に対応するプロパティの[`componentN()` 関数](destructuring-declarations.md)。
*   `copy()` 関数 (以下参照)。

生成されたコードの一貫性と意味のある動作を保証するために、データクラスは以下の要件を満たす必要があります:

*   プライマリコンストラクタには少なくとも1つのパラメータが必要です。
*   すべてのプライマリコンストラクタパラメータは`val`または`var`でマークされている必要があります。
*   データクラスは`abstract`、`open`、`sealed`、`inner`であってはなりません。

さらに、データクラスメンバーの生成は、メンバーの継承に関して以下の規則に従います:

*   データクラスの本体に`equals()`、`hashCode()`、`toString()`の明示的な実装がある場合、またはスーパークラスに`final`な実装がある場合、これらの関数は生成されず、既存の実装が使用されます。
*   スーパークラスが`open`で互換性のある型を返す`componentN()`関数を持つ場合、対応する関数がデータクラスに生成され、スーパークラスのものをオーバーライドします。スーパークラスの関数が互換性のないシグネチャのため、または`final`であるためにオーバーライドできない場合、エラーが報告されます。
*   `componentN()`関数と`copy()`関数に明示的な実装を提供することは許可されていません。

データクラスは他のクラスを拡張できます ([密封クラス](sealed-classes.md)の例を参照)。

> On the JVM, if the generated class needs to have a parameterless constructor, default values for the properties have
> to be specified (see [Constructors](classes.md#constructors)):
>
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## クラス本体で宣言されたプロパティ

コンパイラは、自動生成される関数に対してプライマリコンストラクタ内で定義されたプロパティのみを使用します。生成される実装からプロパティを除外するには、クラス本体内で宣言します:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

以下の例では、`toString()`、`equals()`、`hashCode()`、および`copy()`の実装ではデフォルトで`name`プロパティのみが使用され、`component1()`というコンポーネント関数は1つだけです。`age`プロパティはクラス本体内で宣言されており、除外されます。
したがって、`equals()`はプライマリコンストラクタのプロパティのみを評価するため、同じ`name`で異なる`age`値を持つ2つの`Person`オブジェクトは等しいとみなされます:

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

`copy()`関数を使用してオブジェクトをコピーすると、一部のプロパティを変更しつつ、残りを変更せずに維持できます。上記の`User`クラスに対するこの関数の実装は次のようになります:

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

その後、次のように記述できます:

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## データクラスと分解宣言

データクラスのために生成される*コンポーネント関数*は、それらを[分解宣言](destructuring-declarations.md)で使用することを可能にします:

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 標準データクラス

標準ライブラリは`Pair`クラスと`Triple`クラスを提供します。しかし、ほとんどの場合、名前付きデータクラスはプロパティに意味のある名前を提供することでコードを読みやすくするため、より良い設計選択肢となります。