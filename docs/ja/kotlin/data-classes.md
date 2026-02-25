[//]: # (title: データクラス)

Kotlinのデータクラスは、主にデータを保持するために使用されます。各データクラスに対して、コンパイラは自動的に追加のメンバ関数を生成し、インスタンスを読みやすい形式で出力したり、インスタンス同士を比較したり、インスタンスをコピーしたりできるようになります。
データクラスは `data` で修飾されます。

```kotlin
data class User(val name: String, val age: Int)
```

コンパイラは、プライマリコンストラクタで宣言されたすべてのプロパティから、以下のメンバを自動的に導出します。

* `equals()`/`hashCode()` のペア。
* `"User(name=John, age=42)"` という形式の `toString()`。
* 宣言順のプロパティに対応する [`componentN()` 関数](destructuring-declarations.md)。
* `copy()` 関数（後述）。

生成されたコードの一貫性と意味のある動作を保証するために、データクラスは以下の要件を満たす必要があります。

* プライマリコンストラクタには、少なくとも1つのパラメータが必要です。
* プライマリコンストラクタのすべてのパラメータは、`val` または `var` としてマークされている必要があります。
* データクラスは `abstract`、`open`、`sealed`、`inner` にすることはできません。

さらに、データクラスのメンバの生成は、メンバの継承に関して以下のルールに従います。

* データクラスのボディに `equals()`、`hashCode()`、または `toString()` の明示的な実装がある場合、あるいはスーパークラスに `final` な実装がある場合、これらの関数は生成されず、既存の実装が使用されます。
* スーパータイプに `open` で互換性のある型を返す `componentN()` 関数がある場合、対応する関数がデータクラスに対して生成され、スーパータイプの関数をオーバーライドします。シグネチャの不一致や `final` であるためにオーバーライドできない場合は、エラーが報告されます。
* `componentN()` および `copy()` 関数の明示的な実装を提供することは許可されていません。

データクラスは他のクラスを継承することができます（例については [Sealed classes (シールドクラス)](sealed-classes.md) を参照してください）。

> JVM上で、生成されたクラスに引数なしのコンストラクタが必要な場合は、プロパティのデフォルト値を指定する必要があります（[コンストラクタ (Constructors)](classes.md#constructors-and-initializer-blocks) を参照してください）。
> 
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## クラスボディで宣言されたプロパティ

コンパイラは、自動生成される関数のために、プライマリコンストラクタ内で定義されたプロパティのみを使用します。プロパティを生成された実装から除外するには、クラスボディ内で宣言します。

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

以下の例では、デフォルトで `toString()`、`equals()`、`hashCode()`、および `copy()` の実装内で `name` プロパティのみが使用され、コンポーネント関数は `component1()` 1つだけになります。
`age` プロパティはクラスボディ内で宣言されているため、除外されます。
したがって、`equals()` はプライマリコンストラクタのプロパティのみを評価するため、同じ `name` を持ちながら異なる `age` の値を持つ2つの `Person` オブジェクトは等しいとみなされます。

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

`copy()` 関数を使用してオブジェクトをコピーし、一部のプロパティを変更しつつ、残りを変更せずに保持することができます。
上記の `User` クラスに対するこの関数の実装は、以下のようになります。

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

これにより、以下のように記述できます。

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

`copy()` 関数は、インスタンスの *シャローコピー (shallow copy)* を作成します。言い換えれば、コンポーネントを再帰的にコピーしません。その結果、他のオブジェクトへの参照は共有されます。

例えば、プロパティが可変リストを保持している場合、「オリジナル」の値を通じて行われた変更はコピーを通じても確認でき、コピーを通じて行われた変更はオリジナルを通じても確認できます。

```kotlin
data class Employee(val name: String, val roles: MutableList<String>)

fun main() {
    val original = Employee("Jamie", mutableListOf("developer"))
    val duplicate = original.copy()

    duplicate.roles.add("team lead")

    println(original) 
    // Employee(name=Jamie, roles=[developer, team lead])
    println(duplicate) 
    // Employee(name=Jamie, roles=[developer, team lead])
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

見てわかるように、`duplicate.roles` プロパティを変更すると、両方のプロパティが同じリスト参照を共有しているため、`original.roles` プロパティも変更されます。

## データクラスと分解宣言

データクラス用に生成された *コンポーネント関数 (component functions)* により、[分解宣言 (destructuring declarations)](destructuring-declarations.md) でそれらを使用することが可能になります。

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 標準データクラス

標準ライブラリは `Pair` クラスと `Triple` クラスを提供しています。しかし、ほとんどの場合、プロパティに意味のある名前を提供してコードを読みやすくするため、名前付きのデータクラスの方が優れた設計上の選択肢となります。