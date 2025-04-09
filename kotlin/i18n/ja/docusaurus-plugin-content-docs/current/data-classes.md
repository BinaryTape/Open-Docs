---
title: データクラス
---
Kotlinのデータクラスは、主にデータを保持するために使用されます。各データクラスに対して、コンパイラは、インスタンスを可読な出力に出力したり、インスタンスを比較したり、インスタンスをコピーしたりするための追加のメンバー関数を自動的に生成します。
データクラスは`data`でマークされます。

```kotlin
data class User(val name: String, val age: Int)
```

コンパイラは、プライマリコンストラクタで宣言されたすべてのプロパティから、次のメンバーを自動的に派生させます。

* `equals()`/`hashCode()` ペア。
* `"User(name=John, age=42)"` 形式の `toString()`。
* 宣言の順序でプロパティに対応する[`componentN()` 関数](destructuring-declarations)。
* `copy()` 関数（下記参照）。

生成されたコードの一貫性と意味のある動作を保証するために、データクラスは次の要件を満たす必要があります。

* プライマリコンストラクタには、少なくとも1つのパラメータが必要です。
* すべてのプライマリコンストラクタパラメータは、`val` または `var` としてマークする必要があります。
* データクラスは、`abstract`、`open`、`sealed`、または `inner` にすることはできません。

さらに、データクラスメンバーの生成は、メンバーの継承に関して次の規則に従います。

* データクラスの本体に `equals()`、`hashCode()`、または `toString()` の明示的な実装がある場合、またはスーパークラスに `final` 実装がある場合、これらの関数は生成されず、既存の実装が使用されます。
* スーパタイプに `open` で互換性のある型を返す `componentN()` 関数がある場合、対応する関数がデータクラスに対して生成され、スーパタイプの関数をオーバーライドします。シグネチャの互換性がないため、または `final` であるために、スーパタイプの関数をオーバーライドできない場合は、エラーが報告されます。
* `componentN()` 関数と `copy()` 関数の明示的な実装を提供することは許可されていません。

データクラスは他のクラスを拡張できます（例については、[Sealed classes](sealed-classes) を参照してください）。

:::note
JVM上で、生成されたクラスがパラメータなしのコンストラクタを持つ必要がある場合、プロパティのデフォルト値を指定する必要があります（[Constructors](classes#constructors) を参照してください）。

```kotlin
data class User(val name: String = "", val age: Int = 0)
```

:::

## クラス本体で宣言されたプロパティ

コンパイラは、自動的に生成された関数に対して、プライマリコンストラクタ内で定義されたプロパティのみを使用します。生成された実装からプロパティを除外するには、クラス本体内で宣言します。

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

以下の例では、`name` プロパティのみが、`toString()`、`equals()`、`hashCode()`、および `copy()` の実装内でデフォルトで使用され、コンポーネント関数は `component1()` のみです。
`age` プロパティはクラス本体内で宣言され、除外されます。
したがって、同じ `name` で異なる `age` 値を持つ2つの `Person` オブジェクトは、`equals()` がプライマリコンストラクタからのプロパティのみを評価するため、等しいと見なされます。

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {

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

}
```

## コピー

`copy()` 関数を使用してオブジェクトをコピーし、残りを変更せずに、そのプロパティの _一部_ を変更できます。
上記の `User` クラスに対するこの関数の実装は、次のようになります。

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

その後、次のように記述できます。

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## データクラスと分割宣言

データクラスに対して生成された _コンポーネント関数_ を使用すると、[分割宣言](destructuring-declarations) で使用できます。

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 標準データクラス

標準ライブラリは、`Pair` クラスと `Triple` クラスを提供します。ただし、ほとんどの場合、名前付きデータクラスは、プロパティに意味のある名前を提供することで、コードを読みやすくするため、より良い設計上の選択肢となります。